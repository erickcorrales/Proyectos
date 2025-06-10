window.addEventListener('DOMContentLoaded', startSignUp, false)

function startSignUp() {
    const form =  document.getElementById('form') as HTMLFormElement

    if (!form)
        return console.error('Hubo un error al obtener el formulario')
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault()

        const username = (document.querySelector('input[name="username"]') as HTMLInputElement)
        const password = (document.querySelector('input[name="password"]') as HTMLInputElement)
        const email = (document.querySelector('input[name="email"]') as HTMLInputElement)

        try {
            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: username.value, 
                    password: password.value,
                    email: email.value
                }),
                credentials: 'include'
            })

            const result = await response.json()

            alert(result.message)

            form.reset()

            location.href = 'login.html'

        } catch (error) {
            alert('Error al registrar usuario')
            console.error('Error')
        }
    })
}