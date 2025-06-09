window.addEventListener('DOMContentLoaded', startIndex, false)

function startIndex() {
    const btnRegistro = document.getElementById('btn-registro')
    const btnInicioSesion = document.getElementById('btn-inicio-sesion')

    btnRegistro!.addEventListener('click', () => {
        location.href = 'registro.html'
    })
    
    btnInicioSesion!.addEventListener('click', () => {
        location.href = 'login.html'
    })
}