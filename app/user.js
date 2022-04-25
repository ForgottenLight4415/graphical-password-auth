module.exports = () => {
    if (document.body.classList.contains('user-page') === false) {
        return;
    }
    // Initial Members Request
    const tableBody = document.querySelector('#members-table tbody')
    requests.getAllMembers().then(res => {
        const members = res.data
        for (const member of members) {
            const tableRow = document.createElement('tr')
            tableRow.innerHTML = `
            <td>
            <div class="d-flex px-2 py-1">
            <div>
            <img src="https://demos.creative-tim.com/soft-ui-design-system-pro/assets/img/team-2.jpg"
            class="avatar avatar-sm me-3">
            </div>
            <div class="d-flex flex-column justify-content-center">
            <h6 class="mb-0 text-xs">${member.name}</h6>
            <p class="text-xs text-secondary mb-0">${member.email}</p>
            </div>
            </div>
            </td>
            <td>
            <p class="text-xs font-weight-bold mb-0">${member.position}</p>
            </td>
            <td class="align-middle text-center text-sm">
            <span class="badge badge-sm bg-success">${member.team}</span>
            </td>
            <td class="align-middle text-center">
            <span class="text-secondary text-xs font-weight-bold">${moment(member.created_at).format('DD/MM/YY')}</span>
            </td>
            <td class="align-middle">
            <a href="javascript:;" class="text-secondary font-weight-bold text-xs" data-toggle="tooltip"
            data-original-title="Edit user">
            Edit
            </a>
            </td>
            `
            tableBody.appendChild(tableRow)
        }

    })
    // Add New Member Form Handling
    const formEl = document.getElementById('addMemberForm');
    const addMemberFormNameEl = document.getElementById('addMemberFormName');
    const addMemberFormEmailEl = document.getElementById('addMemberFormEmail');
    const addMemberFormPositionEl = document.getElementById('addMemberFormPosition');
    const addMemberFormTeamEl = document.getElementById('addMemberFormTeam');

    formEl.addEventListener('submit', (e) => {
        e.preventDefault()
        const name = addMemberFormNameEl.value
        const email = addMemberFormEmailEl.value
        const position = addMemberFormPositionEl.value
        const team = addMemberFormTeamEl.value
        const data = {
            name,
            email,
            position,
            team,
        }
        requests.addMember(data)
            .then(() => {
                window.location.reload()
            })
            .catch(() => {

            })
    })

}
