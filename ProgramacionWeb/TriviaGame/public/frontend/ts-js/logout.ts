async function logout() {
    try {
        const response = await fetch('http://localhost:3000/logout', {
            credentials: 'include'
        })

        const result = await response.json()
        alert(result.message)

        location.href = 'login.html'
    } catch (err) {
        alert('Error al cerrar la sesion')
    }
}