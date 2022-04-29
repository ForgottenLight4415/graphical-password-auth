
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
    // Add New Member Form Handling
    const addMemberFormNameEl = document.getElementById('addMemberFormName');
    const addMemberFormEmailEl = document.getElementById('addMemberFormEmail');

    formEl.addEventListener('submit', (e) => {
        e.preventDefault()
        const name = addMemberFormNameEl.value
        const email = addMemberFormEmailEl.value
        const data = {
            name,
            email,
        }
        requests.addMember(data)
            .then(() => {
                window.location.reload()
            })
            .catch(() => {

            })
    })

