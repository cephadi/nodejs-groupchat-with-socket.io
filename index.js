const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http) // instance atau object untuk socket.io
const port = 3000

app.get('/', (req, res) => {
    // res.send({ message: "App with Socket.io!" })
    res.sendFile(__dirname + '/client/index.html')
})

var jmlhUser = 0

// setiap org yg connect, maka code ini di eksekusi
io.on('connection', (socket) => {
    jmlhUser++;
    console.log('User connected : ', jmlhUser)
    socket.emit('status', { userConnected: jmlhUser }) // emit method yg digunakan untuk mengirim data ke client

    // listen event
    socket.on('chat message', (message) => {
        console.log('A user send this message : ', message)
        io.emit('chat message', message) // broadcast/callback ke semua client
    })

    // ketika seseorang disconnect, maka code ini di eksekusi
    socket.on('disconnect', () => {
        console.log('User disconnected')
        jmlhUser--;
        console.log('User connected : ', jmlhUser)
        socket.emit('status', { userConnected: jmlhUser })
    })
})

http.listen(port, () => {
    console.log(`App running at http://localhost:${port}`)
})