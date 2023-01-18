const { io } = require('../server');
const {Usuario} = require('../classes/Usuario')
const {crearMensaje} = require('../utilidades/utilidades')
const usuario =  new Usuario()
io.on('connection', (client,) => {
    client.on('entrarChat',(data,callback)=>{
        if(!data.nombre||!data.sala)
            return callback({error:true,msg:'el nombre es necesario'})

        client.join(data.sala)
        usuario.agregarPersona(client.id,data.nombre,data.sala)
        //emitir un evento cuando una persana entra al chat
        client.broadcast.to(data.sala).emit('listaPersona',usuario.getPersonasPorSala(data.sala))
        callback(usuario.getPersonasPorSala(data.sala))
    })

    client.on('crearMensaje',(data)=>{
        let persona = usuario.getPersona(client.id)
        let mensaje = crearMensaje(persona.nombre,data.mensaje)
        client.broadcast.to(persona.sala).emit('crearMensaje',mensaje)
    })

    client.on('disconnect',()=>{
        let persona = usuario.borrarPersona(client.id)
        client.broadcast.to(persona.sala).emit('crearMensaje',crearMensaje('Admistrador',`${persona.nombre} salio`))
        client.broadcast.to(persona.sala).emit('listaPersona',usuario.getPersonasPorSala(persona.sala))
    })
    //MENSAJE PRIVADO
    client.on('mensajePrivado',(data)=>{
        let persona = usuario.getPersona(client.id)
        client.broadcast.to(data.para).emit('mensajePrivado',crearMensaje(persona.nombre,data.mensaje))
    })
});
