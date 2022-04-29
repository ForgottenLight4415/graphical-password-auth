axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
const registrationFormEL = document.getElementById("RegistrationForm");
const nameEl = document.getElementById("name");
const emailEl = document.getElementById("email");


registrationFormEL.addEventListener("submit", function (e) {
    e.preventDefault();
    var myModal = new bootstrap.Modal(document.getElementById("register-modal"));
    const email = emailEl.value;
    const name = nameEl.value;
    axios
        .post("http://localhost:5000/register/generate", {
            fullname: name,
            email: email,
        })
        .then((res) => {
            // console.log(res, "apiresponse")
            // console.log(res.data)
            let dataImages = JSON.stringify(res.data.Images);

            localStorage.setItem("ButtonImages", dataImages);
            if (localStorage.getItem("ButtonImages")) {

                let dataImages = JSON.parse(localStorage.getItem("ButtonImages"));
                console.log(dataImages);
                var row1 = document.getElementById("first-row");
                var row2 = document.getElementById("second-row");
                var row3 = document.getElementById("third-row");


                let row1Data = "";
                let row2Data = "";
                let row3Data = "";

                for (var i = 0; i < 3; i++) {
                    row1Data =
                        row1Data +
                        `<div class="col">
                                        <button class="amisha btn btn-bg" id="${dataImages[i].ImageId}" type="button">
                                            <img src="${dataImages[i].ImageUrl}" class="img-button" alt="10">
                                        </button>
                                    </div>`;


                }
                for (var i = 3; i < 6; i++) {
                    row2Data =
                        row2Data +
                        `<div class="col">
                                        <button class="amisha btn btn-bg" id="${dataImages[i].ImageId}" type="button">
                                            <img src="${dataImages[i].ImageUrl}" class="img-button" alt="10">
                                        </button>
                                    </div>`;
                }
                for (var i = 6; i < 9; i++) {
                    row3Data =
                        row3Data +
                        `<div class="col">
                                        <button class="amisha btn btn-bg" id="${dataImages[i].ImageId}" type="button">
                                            <img src="${dataImages[i].ImageUrl}" class="img-button" alt="10">
                                        </button>
                                    </div>`;
                }


                row1.innerHTML = row1Data;
                row2.innerHTML = row2Data;
                row3.innerHTML = row3Data;
                let btns = document.querySelectorAll('button.amisha');
                let sequence = [];

                for (i of btns) {
                    i.addEventListener('click', function () {
                        console.log(this.id);
                        sequence.push(this.id);
                        console.log(sequence)
                    });
                }
                let registerBtn = document.getElementById('register-btn');
                registerBtn.addEventListener('click', function () {
                    axios
                        .post("http://localhost:5000/register", {
                            sequence: sequence,
                            email: email,

                        })
                        .then((res) => {
                            if (res.status == 200) {
                                console.log(res);
                                window.location.href = 'Login.html';
                            }

                        });


                })


                myModal.show();

                // $(document).ready(function () {
                //     $('button.btnRegister').on('click', function (e) {
                //         e.preventDefault();
                //         console.log("heloo world")
                //     });
                // });
            }
        })
        .catch((err) => { });
});




















// $("#register-modal").on('click', '#register-btn', function () {

//     console.log("Hello world");
// });
// const btnRegister = document.getElementById("register-btn")
// // console.log(btnRegister)
// btnRegister.addEventListener("submit", function (e) {
//     e.preventDefault();
//     const email = emailEl.value;
//     console.log("hello world")
//     // const sequence = nameEl.value;
axios
    .post("http://localhost:5000/register", {
        sequence: sequence,
        email: email,

    })
// });

