import { includes } from "list"

window.addEventListener('DOMContentLoaded', startLogIn, false)

async function startLogIn() {

    try {
        const authCheck = await fetch('http://localhost:3000/check-auth', {
            credentials: 'include'
        })

        const result = await authCheck.json()

        if (result.authenticated) {
            location.href = 'index.html'
            return
        }
    } catch (err) {
        console.log('No se pudo verificar la autenticacion', err)
    }

    const form =  document.getElementById('form') as HTMLFormElement

    if (!form)
        return console.error('Hubo un error al obtener el formulario')
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault()

        const username = (document.querySelector('input[name="username"]') as HTMLInputElement)
        const password = (document.querySelector('input[name="password"]') as HTMLInputElement)

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: username.value, 
                    password: password.value,
                }),
                credentials: 'include' // Necesario para recibir cookies
            })

            const result = await response.json()

            alert(result.message)

            form.reset()

            location.href = 'index.html'

        } catch (error) {
            alert(`Error al ingresar a la cuenta`)
        }
    })
}