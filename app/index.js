const images = document.getElementsByClassName("btn");
const img_button = document.getElementsByClassName("btn btn-bg");
img_button.addEventListner("click", getRandomImages)
function getRandomImages() {
    fetch('http://localhost:5000/register/generate')
        .then(res => res.json())
        .then(data => {
            images.innerHtml = `<img src="${data.file}"/>`
        })
    console.log(data.file)
}
