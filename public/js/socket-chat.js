var socket = io();

const params = new URLSearchParams(window.location.search)
if(!params.has('nombre')||!params.has('sala')){
    window.location='index.html'
    throw new Error('campos obligatorio')
}

if(!params.get('nombre')||!params.get('sala')){
    window.location='index.html'
    throw new Error('campos obligatorio')
}
let usuario ={nombre:params.get('nombre'),sala:params.get('sala')}

socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('entrarChat',usuario,(resp)=>{
    	console.log('usuarios Conectados ',resp)
    })
});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});


// Enviar información
socket.emit('enviarMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});

// Escuchar información
socket.on('crearMensaje', function(mensaje) {
    console.log('Servidor:', mensaje);
});

socket.on('listaPersona',(list)=>{
	console.log('lisata chat:', list);
})

socket.on('mensajePrivado',(mensaje)=>{
	console.log('mensajePrivado',mensaje)
})