axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
const loginFormEL = document.getElementById("LoginForm");
const emailEl = document.getElementById("email");


loginFormEL.addEventListener("submit", function (e) {
  e.preventDefault();
  var myModal = new bootstrap.Modal(document.getElementById("login-modal"));
  const Email = emailEl.value;
  axios
    .post("http://localhost:5000/login/get", { email: Email })
    .then((res) => {
      let dataImages = JSON.stringify(res.data.Images);

      localStorage.removeItem("ButtonImages");
      localStorage.setItem("ButtonImages", dataImages);
      if (localStorage.getItem("ButtonImages")) {
        console.log(1);
        let dataImages = JSON.parse(localStorage.getItem("ButtonImages"));
        console.log(dataImages);
        var row1 = document.getElementById("first-row");
        var row2 = document.getElementById("second-row");
        var row3 = document.getElementById("third-row");
        let row1Data = "";
        let row2Data = "";
        let row3Data = "";
        console.log(2);
        for (var i = 0; i < 3; i++) {
          row1Data =
            row1Data +
            `<div class="col">
                                        <button class="logb btn btn-bg" id="${dataImages[i].ImageId}" type="button">
                                            <img src="${dataImages[i].ImageUrl}" class="img-button" alt="10">
                                        </button>
                                    </div>`;
        }
        for (var i = 3; i < 6; i++) {
          row2Data =
            row2Data +
            `<div class="col">
                                        <button class="logb btn btn-bg" id="${dataImages[i].ImageId}" type="button">
                                            <img src="${dataImages[i].ImageUrl}" class="img-button" alt="10">
                                        </button>
                                    </div>`;
        }
        for (var i = 6; i < 9; i++) {
          row3Data =
            row3Data +
            `<div class="col">
                                        <button class="logb btn btn-bg" id="${dataImages[i].ImageId}" type="button">
                                            <img src="${dataImages[i].ImageUrl}" class="img-button" alt="10">
                                        </button>
                                    </div>`;
        }

        row1.innerHTML = row1Data;
        row2.innerHTML = row2Data;
        row3.innerHTML = row3Data;
        let btns = document.querySelectorAll("button.logb");
        let sequence = [];

        for (i of btns) {
          i.addEventListener("click", function () {
            sequence.push(this.id.trim());
          });
        }
        let loginBtn = document.getElementById("login-btn");
        loginBtn.addEventListener("click", function () {
          axios
            .post("http://localhost:5000/login", {
              sequence: sequence,
              email: Email,
            })
        .then((res) => {
          if (res.status == 200) {
            console.log(res);
            const user = res.data.user;
            localStorage.setItem('user',JSON.stringify(user));
            window.location.href = "homepage.html";
          }
        })
        .catch((e) => {
          sequence.length = 0;
          myModal.hide();
        });
    });
        myModal.show();
      }
    })
    .catch((err) => {});
});