document.addEventListener('DOMContentLoaded', async () => {
    async function getUsers() {
        const rolesObj = await getRolesObj()

        fetch('http://localhost:8080/app/admin/users')
            .then(response => response.json())
            .then(users => {
                let tbody = $('#usersTableBody');
                tbody.empty();

                fetch('http://localhost:8080/app/admin/roles')

                users.forEach(user => {
                    let roles = user.roles.map(role => role.name).join(' ');
                    let row = $('<tr>');
                    row.append($('<td>').text(user.id));
                    row.append($('<td>').text(user.firstName));
                    row.append($('<td>').text(user.lastName));
                    row.append($('<td>').text(user.email));
                    row.append($('<td>').text(roles));
                    const editButton = $('<button>').addClass('btn btn-info edit-btn')
                        .text('Edit')
                        .attr('data-bs-toggle', 'modal')
                        .attr('data-bs-target', '#editModal')
                        .attr('data-id', user.id)
                        .attr('data-firstname', user.firstName)
                        .attr('data-lastname', user.lastName)
                        .attr('data-email', user.email)
                        .attr('data-login', user.login)
                        .attr('data-password', user.password)
                        .attr('data-roles', JSON.stringify(rolesObj))
                        .click(function () {
                            const id = $(this).data('id');
                            const firstName = $(this).data('firstname');
                            const lastName = $(this).data('lastname');
                            const email = $(this).data('email');
                            const login = $(this).data('login');
                            const roles = $(this).data('roles');
                            openEditModal(id, firstName, lastName, email, login, roles);
                        });
                    const deleteButton = $('<button>').addClass('btn btn-danger delete-btn')
                        .text('Delete')
                        .attr('data-id', user.id)
                        .attr('data-bs-toggle', 'modal')
                        .attr('data-bs-target', '#deleteModal')
                        .attr('data-id', user.id)
                        .attr('data-firstname', user.firstName)
                        .attr('data-lastname', user.lastName)
                        .attr('data-email', user.email)
                        .attr('data-login', user.login)
                        .attr('data-password', user.password)
                        .attr('data-roles', JSON.stringify(user.roles))
                        .click(function () {
                            const id = $(this).data('id');
                            const firstName = $(this).data('firstname');
                            const lastName = $(this).data('lastname');
                            const email = $(this).data('email');
                            const login = $(this).data('login');
                            const roles = $(this).data('roles');
                            deleteModal(id, firstName, lastName, email, login, roles);
                        });

                    row.append($('<td>').append(editButton))
                    row.append($('<td>').append(deleteButton))
                    tbody.append(row);
                });
            });
    }

    function getRoles() {
        fetch('/app/admin/roles')
            .then(response => response.json())
            .then(roles => {
                const select = $('#roles');
                select.empty();
                roles.forEach(role => {
                    const option = $('<option>')
                        .attr('value', role.id)
                        .text(role.name);
                    select.append(option);
                });
            });
    }

    function getRolesObj() {
        return fetch('/app/admin/roles')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
            });
    }

    $('#addUserForm').submit(function (event) {
        event.preventDefault();
        const formData = {
            firstName: $('#firstname').val(),
            lastName: $('#lastname').val(),
            email: $('#cremail').val(),
            login: $('#crlogin').val(),
            password: $('#crpassword').val(),
            roles: $('#roles').val()
        };
        $.ajax({
            url: '/app/admin',
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'X-CSRF-TOKEN': $('input[name="_csrf"]').val()
            },
            data: JSON.stringify(formData),
            success: function () {
                getUsers();
                alert("Пользователь успешно добавлен");
            },
            error: function () {
                alert('Failed to create user.');
            }
        });
    });

    function deleteModal(id, firstName, lastName, email, login, roles) {
        $('#delIdInput').val(id);
        $('#delfirstInput').val(firstName);
        $('#dellastInput').val(lastName);
        $('#delemailInput').val(email);
        $('#delloginInput').val(login);

        const userRolesInput = $('#deluserRolesInput');
        userRolesInput.empty();

        roles.forEach(function (role) {
            const option = $('<option>').attr('value', JSON.stringify(role)).text(role.name);
            userRolesInput.append(option);
        });

        $('#delclosemodal').off('click').on('click', function () {
            $('#deleteModal').modal('hide');
        });

        $('#delcancelmodal').off('click').on('click', function () {
            $('#deleteModal').modal('hide');
        });

        $('#deleteBtn').off('click').on('click', function () {
            $.ajax({
                url: 'http://localhost:8080/app/admin/delete',
                type: 'POST',
                headers: {
                    'X-CSRF-TOKEN': $('input[name="_csrf"]').val()
                },
                data: {id: id},
                success: function () {
                    getUsers();
                    $('#deleteModal').modal('hide');
                },
                error: function () {
                    alert('Failed to delete user.');
                }
            });
        });
    }

    function openEditModal(id, firstName, lastName, email, login, roles) {
        $('#userIdInput').val(id);
        $('#firstInput').val(firstName);
        $('#lastInput').val(lastName);
        $('#emailInput').val(email);
        $('#loginInput').val(login);

        const userRolesInput = $('#userRolesInput');
        userRolesInput.empty();

        roles.forEach(function (role) {
            const option = $('<option>').attr('value', JSON.stringify(role)).text(role.name);
            userRolesInput.append(option);
        });

        $('#closemodal').off('click').on('click', function () {
            $('#editModal').modal('hide');
        });

        $('#cancelmodal').off('click').on('click', function () {
            $('#editModal').modal('hide');
        });

        $('#saveChangesBtn').off('click').on('click', function () {
            const userRoles = [];
            userRolesInput.find('option:selected').each(function () {
                userRoles.push(JSON.parse($(this).val()));
            });

            const data = {
                id: id,
                firstName: $('#firstInput').val(),
                lastName: $('#lastInput').val(),
                email: $('#emailInput').val(),
                login: $('#loginInput').val(),
                password: $('#passwordInput').val(),
                roles: userRoles
            };
            if (!data.lastName || !data.firstName || !data.login || !data.email ||
                !data.password || userRoles.length === 0) {
                alert("Не все поля заполнены!");
                return;
            }
            fetch(`http://localhost:8080/app/admin/edit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': $('input[name="_csrf"]').val()
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(result => {
                    getUsers();
                    $('#editModal').modal('hide');
                })
                .catch(error => console.error(error));
        });
    }

    await getUsers();
    await getRoles();
})