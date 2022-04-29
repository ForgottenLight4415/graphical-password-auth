axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
const loginFormEL = document.getElementById("LoginForm");
const emailEl = document.getElementById("email");
// const passwordEl = document.getElementById('password');

loginFormEL.addEventListener("submit", function (e) {
  e.preventDefault();
  var myModal = new bootstrap.Modal(document.getElementById("login-modal"));
  const Email = emailEl.value;
  axios
    .post("http://localhost:5000/login/get", { email: Email })
    .then((res) => {
      // console.log(res, "apiresponse")
      // console.log(res.data)
      let dataImages = JSON.stringify(res.data.Images);

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
                                        <button class="btn btn-bg" type="button">
                                            <img src="${dataImages[i].ImageUrl}" class="img-button" alt="10">
                                        </button>
                                    </div>`;
        }
        for (var i = 3; i < 6; i++) {
          row2Data =
            row2Data +
            `<div class="col">
                                        <button class="btn btn-bg" type="button">
                                            <img src="${dataImages[i].ImageUrl}" class="img-button" alt="10">
                                        </button>
                                    </div>`;
        }
        for (var i = 6; i < 9; i++) {
          row3Data =
            row3Data +
            `<div class="col">
                                        <button class="btn btn-bg" type="button">
                                            <img src="${dataImages[i].ImageUrl}" class="img-button" alt="10">
                                        </button>
                                    </div>`;
        }

        row1.innerHTML = row1Data;
        row2.innerHTML = row2Data;
        row3.innerHTML = row3Data;

        myModal.show();
      }
    })
    .catch((err) => {});
});
