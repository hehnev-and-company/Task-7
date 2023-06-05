document.addEventListener('DOMContentLoaded', async () => {
    async function getUser() {
        fetch('http://localhost:8080/app/user/user')
            .then(response => response.json())
            .then(user => {
                let tbody = $('#userTableBody');
                tbody.empty();
                let roles = user.roles.map(role => role.name).join(' ');
                let row = $('<tr>');
                row.append($('<td>').text(user.id));
                row.append($('<td>').text(user.firstName));
                row.append($('<td>').text(user.lastName));
                row.append($('<td>').text(user.email));
                row.append($('<td>').text(roles));
                tbody.append(row);
            });
    }

    await getUser();
})