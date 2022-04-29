
    // Initial Members Request
    const tableBody = document.querySelector('#users tbody')
    axios.get('http://localhost:5000/users')
    .then(res => {
        const members = res.data
        console.log(members)
        for (const member of members) {
            const tableRow = document.createElement('tr')
            tableRow.innerHTML = `
            <div class="d-flex flex-column justify-content-center">
            <h6 class="mb-0 text-xs">${member.name}</h6>
            <p class="text-xs text-secondary mb-0">${member.email}</p>
            </div>
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

