
    // Initial Members Request
    const tableBody = document.querySelector('#users tbody')
    axios.get('http://localhost:5000/users')
    .then(res => {
        const members = res.data.users
        console.log(members)
        let number = 1
        for (const member of members) {
            const tableRow = document.createElement('tr')
            tableRow.innerHTML = `
            <td>${number++}</td>
            <td>${member.fullname}</td>
            <td>${member.email}</td>
            `
            tableBody.appendChild(tableRow)
        }

    })

    const nameEl = document.getElementById('name')
    const emailEl = document.getElementById('email')
    try {
    const user = JSON.parse(localStorage.getItem('user'))
    nameEl.innerHTML = `Welcome, ${user.fullName}`
    emailEl.innerHTML = `Email: ${user.email}` 
    } catch (error) {
        window.location.href = "/Login.html"
    }

    const logoutEl = document.getElementById('logout')
    logoutEl.addEventListener("click",function(){localStorage.removeItem('user')
    window.location.href = "/Login.html"
})
    
  


