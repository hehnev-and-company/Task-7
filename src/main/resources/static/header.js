document.addEventListener('DOMContentLoaded', async () => {
    async function getUser() {
        try {
            const response = await fetch('http://localhost:8080/app/user/user');
            const user = await response.json();
            document.getElementById('userEmail').innerText = user.email;
            document.getElementById('userRoles').innerText = user.authorities.map(role => role.authority).join(', ');
        } catch (error) {
            console.error(error);
        }
    }

    await getUser();
});