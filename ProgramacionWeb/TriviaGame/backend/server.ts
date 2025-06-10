import http from 'http'
import { createConnection } from 'mysql2/promise'
import { config } from 'dotenv'
import bcrypt from 'bcrypt'
import { RowDataPacket } from 'mysql2'
config() // Agregar los datos necesarios del archivo .env

// Crear conexion a la base de datos
const db = await createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

console.log('Conectando a la base de datos...')

interface User extends RowDataPacket {
    id: number,
    name: string,
    password: string,
    email: string
}

// Crear el servidor
const server =  http.createServer(async (req, res) => {

    // Permitir CORS para todas las aplicaciones
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    // Responder al preflight OPTIONS
    if (req.method === 'OPTIONS') {
        res.writeHead(204)
        res.end()
        return
    }

    // Unir los pedazos que se obtiene de la solicitud
    let body = ''
    for await (const chunk of req)
        body += chunk.toString()

    // Leer cookies
    const cookies = req.headers.cookie || ''
    const userCookie = cookies.split(';').find(c => c.trim().startsWith('user='))?.split('=')[1]
    
    // Ruta: Registro
    if (req.method === 'POST' && req.url === '/users') {
        try {    
            const { username, password, email } = JSON.parse(body)
            // Cifrar la contraseña
            const hashedPassword = await bcrypt.hash(password, 10) 
            const query = 'INSERT INTO  users (name, password, email) VALUES (?, ?,  ?);'

            await db.execute(query, [username, hashedPassword, email])

            res.statusCode = 201
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: 'Usuario creado correctamente'}))
        } catch (err) {
            if (err instanceof Error) {
                console.error('Error en el registro:', err.message)
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ message: 'Error en el servidor'}))
            } else {
                console.error('Error desconocido:', err)
            }
        }
        
        // Ruta: login
    } else if (req.method === 'POST' && req.url === '/login') {
        try {
            const { username, password } = JSON.parse(body)

            // Obtner el dato de la consulta
            const [rows] = await db.execute<User[]>('SELECT *FROM users WHERE name=?', [username])
            const user = rows[0]

            // Verificar si las contraseñas coinciden
            if (user && await bcrypt.compare(password, user.password)) {
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'set-cookie': `user=${user.name}; HttpOnly; Path=/`
                })
                res.end(JSON.stringify({ message: 'Login exitoso'}))
            } else {
                res.statusCode = 401
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ message: 'Usuario o password incorrectos'}))
            }

        } catch (err) {
            if (err instanceof Error) {
                console.error('Error en el login:', err.message)
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ message: 'Error en el servidor'}))
            } else {
                console.error('Error desconocido:', err)
            }

        }

        // Ruta: logout
    } else if (req.method === 'POST' && req.url === '/logout') {

        res.writeHead(200, {
            'content-type': 'application/json',
            'set-cookie': 'user=; Max-Age=0; Path=/'
        })
        res.end(JSON.stringify({ message: 'Sesion Cerrada'}))
    
        // Ruta verificar sesion iniciada
    } else if (req.method === 'GET' && req.url === '/check-auth') {
        
        if (!userCookie) {
            res.writeHead(401, {
                'content-type': 'application/json'
            })
            res.end(JSON.stringify({ authenticated: false}))
        } else {
            res.writeHead(200, {'content-type': 'application/json'})
            res.end(JSON.stringify({ authenticated: true, user: userCookie}))
        }

        // Ruta no encontrada
    } else {
        res.statusCode = 404
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ message: 'Ruta no encontrada'}))
    }
    
})
                

// Inicar el servidor
server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})

// Cerrar la conexión a la base de datos
process.on('SIGINT', async () => {
    console.log('Cerrando conexion a la base de datos...')
    try {
        await db.end()
        console.log('Conexion cerrada...')
        process.removeAllListeners('SIGINT')
        process.exit(0)
    
    } catch (err) {
        if (err instanceof Error)
            console.log('Error al cerrar la conexion a la base de datos...', err.message)
        else
            console.log('Error desconocido al cerrar la conexion...')

        process.exit(1)
    }
})