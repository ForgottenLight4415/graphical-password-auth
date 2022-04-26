import json
import random
import time
import os

from flask import Flask, send_from_directory, abort
from flask import request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
import hashlib

app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'gpass_auth'

mysql = MySQL(app)

IMAGE_DIRECTORY = "patterns"


def format_image_save(image_lst):
    save_str = ""
    for i in image_lst:
        save_str += f"{i}, "

    return save_str[:-2]


@app.route('/register/generate', methods=['POST'])
def generate_images_for_registration():
    credentials = json.loads(request.data)
    email = credentials["email"]
    fullname = credentials["fullname"]

    cursor = mysql.connection.cursor(prepared=True)
    cursor.execute("""SELECT email FROM users WHERE email = %s LIMIT 1""", email)
    data = cursor.fetchone()

    if data is None:
        seed = int(time.time())
        images = random.sample(range(1, len(os.listdir("./patterns")) + 1), 9)
        cursor.execute(
            """INSERT INTO users (full_name, email, seed, pattern_ind) VALUES (%s, %s, %s, %s)""",
            fullname, email, seed, format_image_save(images)
        )
        mysql.connection.commit()
        cursor.close()

        # Generating patterns
        links = []
        for i in images:
            links.append(f"http://localhost:5000/get-files/{i}.jpg")
        random.shuffle(links)
        response = jsonify({
            "Images": links
        })
        response.status_code = 200
        return response
    else:
        cursor.close()
        response = jsonify({
            "Response": "409",
            "Message": "User already exists"
        })
        response.status_code = 409
        return response


@app.route('/register', methods=['POST'])
def register():
    credentials = json.loads(request.data)
    email = credentials["email"]
    sequence = credentials["sequence"]

    cursor = mysql.connection.cursor()
    cursor.execute('''SELECT email FROM users WHERE email="{}" LIMIT 1'''.format(email))
    data = cursor.fetchall()

    if len(data) != 0:
        cursor.execute(
            '''UPDATE users SET password="{}" WHERE email="{}"'''.format(hashlib.sha256(sequence.encode('utf-8'))
                                                                         .hexdigest(), email))
        mysql.connection.commit()
    else:
        cursor.close()
        response = jsonify({
            "Response": 401,
            "Message": "User does not exist"
        })
        return response

    cursor.close()
    response = jsonify({
        "Response": 200,
        "Images": "Registration successful"
    })
    return response


@app.route('/login/get', methods=['POST'])
def get_images_for_login():
    credentials = json.loads(request.data)
    username = credentials['email']

    cursor = mysql.connection.cursor()
    cursor.execute('''SELECT pattern_ind FROM users WHERE email="{}"'''.format(username))
    data = cursor.fetchall()
    cursor.close()

    response_dict = dict()
    response_dict['Response'] = 200
    response_dict['Message'] = "Get users successful"

    users = []
    for m in data:
        for i in m[0].split(','):
            users.append(f"http://localhost:5000/get-files/{i.strip()}.jpg")

    response_dict["Images"] = users

    response = jsonify(response_dict)
    return response


@app.route('/login', methods=['POST'])
# @cross_origin()
def login():
    credentials = json.loads(request.data)
    email = credentials["email"]
    sequence = credentials["sequence"]

    cursor = mysql.connection.cursor()
    cursor.execute('''SELECT email FROM users WHERE email="{}" AND password="{}" LIMIT 1'''
                   .format(email, hashlib.sha256(sequence.encode('utf-8'))
                           .hexdigest()))
    data = cursor.fetchall()

    if len(data) == 1:
        response = jsonify({
            "Response": 200,
            "Message": "Login successful"
        })
        return response

    response = jsonify({
        "Response": 401,
        "Message": "Unauthorized"
    })
    return response


@app.route('/get-files/<path:path>', methods=['GET', 'POST'])
# @cross_origin()
def get_files(path):
    try:
        response = send_from_directory(IMAGE_DIRECTORY, path)
        return response
    except FileNotFoundError:
        abort(404)


@app.route('/app/<path:path>', methods=['GET', 'POST'])
# @cross_origin()
def render_pages(path):
    try:
        response = send_from_directory("app", path)
        return response
    except FileNotFoundError:
        abort(404)


@app.route('/users', methods=['GET'])
# @cross_origin()
def get_all_users():
    cursor = mysql.connection.cursor()
    cursor.execute('''SELECT full_name, email FROM users''')
    data = cursor.fetchall()
    cursor.close()

    response_dict = dict()
    response_dict['Response'] = 200
    response_dict['Message'] = "Get users successful"

    users = []
    for user in data:
        user_dict = {
            "FullName": user[0],
            "Email": user[1]
        }
        users.append(user_dict)

    response_dict["Users"] = users

    response = jsonify(response_dict)
    return response


if __name__ == '__main__':
    app.run()
