import { none } from "list"
import { styleText } from "util"

window.addEventListener('DOMContentLoaded', startIndex, false)

async function startIndex() {
    const btnRegistro = document.getElementById('btn-registro') as HTMLButtonElement
    const btnInicioSesion = document.getElementById('btn-inicio-sesion') as HTMLButtonElement
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion') as HTMLButtonElement
    const userText = document.getElementById('user') as HTMLParagraphElement

    btnRegistro!.addEventListener('click', () => {
        location.href = 'signup.html'
    })
    
    btnInicioSesion!.addEventListener('click', () => {
        location.href = 'login.html'
    })

    try {
        const response = await fetch('http://localhost:3000/check-auth', {
            credentials: 'include'
        })

        const result = await response.json()

        if (result.authenticated) {
            btnRegistro.style.display = 'none'
            btnInicioSesion.style.display = 'none'
            btnCerrarSesion.style.display = 'inline-block'
            userText.style.display = 'block'

            console.log(result)
        
            userText.textContent = `Hola, ${result.user}`

            btnCerrarSesion.addEventListener('click', async () => {
                await fetch('http://localhost:3000/logout', {
                    method: 'POST',
                    credentials: 'include'
                })

                location.href = 'login.html'
            })
        } else {
            btnRegistro.style.display = 'inline-block'
            btnInicioSesion.style.display = 'inline-block'
            btnCerrarSesion.style.display = 'none'
            userText.style.display = ''
            console.log('No hay usuario en sesion activa')
        }
    } catch (err) {
        if (err instanceof Error)
            console.error('Error al verificar autenticacion', err.message)
        else
            console.error('Error desconocido')
    }
}