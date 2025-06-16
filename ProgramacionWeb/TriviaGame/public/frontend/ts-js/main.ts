window.addEventListener('DOMContentLoaded', startIndex, false)

async function startIndex() {
    const btnRegistro = document.getElementById('btn-registro') as HTMLButtonElement
    const btnInicioSesion = document.getElementById('btn-inicio-sesion') as HTMLButtonElement
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion') as HTMLButtonElement
    const userText = document.getElementById('user') as HTMLParagraphElement
    const categorias = document.getElementsByClassName('categorias') as HTMLCollection

    btnRegistro.addEventListener('click', () => {
        location.href = 'signup.html'
    })

    btnInicioSesion.addEventListener('click', () => {
        location.href = 'login.html'
    })

    for (let i = 0; i < categorias.length; i++)
        categorias[i].addEventListener('click', launchCategory, false)

    try {
        // Verificar el estado de la sesion
        const response = await fetch('http://localhost:3000/check-auth', {
            method: 'GET',
            credentials: 'include'
        })

        // console.log(response)

        const result = await response.json()

        // Verficiar si el usuario esta autenticado
        if (result.authenticated) {
            btnRegistro.style.display = 'none'
            btnInicioSesion.style.display = 'none'
            btnCerrarSesion.style.display = 'inline-block'
            userText.style.display = 'block'
            userText.style.fontWeight = 'bold'

            // console.log(result)
        
            userText.textContent = `Hola, ${result.user}`

            // Manejar el boton para cerrar sesion
            btnCerrarSesion.addEventListener('click', async () => {
                await fetch('http://localhost:3000/logout', {
                    method: 'POST',
                    credentials: 'include'
                })

                location.href = 'login.html'
                alert('Saliendo de la sesion')
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

async function launchCategory(this: HTMLDivElement) {
    const css = document.getElementById('hoja-estilos') as HTMLLinkElement
    const titulo = document.getElementById('titulo-categorias') as HTMLHeadingElement

    css.href = '../css/categorias.css'
    titulo.textContent = `${this.dataset.categoria}`
}