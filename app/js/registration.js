axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
const registrationFormEL = document.getElementById('RegistrationForm');
const nameEl = document.getElementById('name');
const emailEl = document.getElementById('email');
registrationFormEL.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = emailEl.value;
    const name = nameEl.value;
    axios.post('http://localhost:5000/register/generate', { "fullname": name, "email": email })
        .then((res) => {
            console.log(res)
            // const { refreshToken } = res.data
            // localStorage.setItem('refreshToken', refreshToken)
            // resolve(res.data);
        })
        .catch((err) => {
            // handleError(err, reject)
        })
});