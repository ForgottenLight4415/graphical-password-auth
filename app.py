import json
import random
import time
import os

from flask import Flask, send_from_directory, abort
from flask import request, jsonify
from flask_mysqldb import MySQL
import hashlib

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'gpass_auth'

mysql = MySQL(app)

IMAGE_DIRECTORY = "patterns"


# def image_index_encoder(image_lst, seed):
#     encoded_img_lst = []
#     for i in image_lst:
#         encoded_img_lst.append(int((i + seed) / 9))
#
#     save_str = ""
#     for i in encoded_img_lst:
#         save_str += f"{i}, "
#
#     return save_str[:-2]
#
#
# def image_index_decoder(image_lst, seed):
#     decoded_img_lst = []
#     for i in image_lst:
#         decoded_img_lst.append((i * 9) - seed)
#
#     return decoded_img_lst


def image_save_format(image_lst):
    save_str = ""
    for i in image_lst:
        save_str += f"{i}, "

    return save_str[:-2]


@app.route('/register/generate', methods=['POST'])
def register_generate_pattern():
    credentials = json.loads(request.data)
    email = credentials["email"]
    fullname = credentials["fullname"]
    seed = int(time.time())

    images = random.sample(range(1, len(os.listdir("./patterns")) + 1), 9)

    cursor = mysql.connection.cursor()
    cursor.execute('''SELECT email FROM users WHERE email="{}" LIMIT 1'''.format(email))
    data = cursor.fetchall()

    if len(data) == 0:
        cursor.execute(
            '''INSERT INTO users (full_name, email, seed, pattern_ind) VALUES ("{}", "{}", "{}", "{}")'''
                .format(fullname, email, seed, image_save_format(images)))
        mysql.connection.commit()
    else:
        cursor.close()
        return jsonify({
            "Message": "User already exists"
        })

    cursor.close()

    # Generating patterns

    links = []
    for i in images:
        links.append(f"http://localhost:5000/get-files/{i}.jpg")

    return jsonify({
        "Images": links
    })


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
        return jsonify({
            "Response": 401,
            "Message": "User does not exist"
        })

    cursor.close()

    return jsonify({
        "Response": 200,
        "Images": "Registration successful"
    })


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

    return jsonify(response_dict)


@app.route('/login', methods=['POST'])
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
        return jsonify({
            "Response": 200,
            "Message": "Login successful"
        })

    return jsonify({
        "Response": 401,
        "Message": "Unauthorized"
    })


@app.route('/get-files/<path:path>', methods=['GET', 'POST'])
def get_files(path):
    try:
        return send_from_directory(IMAGE_DIRECTORY, path)
    except FileNotFoundError:
        abort(404)


@app.route('/users', methods=['GET'])
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

    return jsonify(response_dict)


if __name__ == '__main__':
    app.run()
