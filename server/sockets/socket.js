const Usuarios = require("../classes/usuarios");
const { io } = require("../server");
const { crearMensaje } = require("../utilidades/utilidades");

const usuarios = new Usuarios();

io.on("connection", (client) => {
  console.log("[Usuario conectado]");

  client.on("entrarChat", (usuario, callback) => {
    if (!usuario.nombre || !usuario.sala) {
      return callback({
        error: true,
        mensaje: "El nombre/sala es necesario",
      });
    }

    client.join(usuario.sala);

    usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);

    client.broadcast
      .to(usuario.sala)
      .emit("listaPersona", usuarios.getPersonaPorSala(usuario.sala));
    client.broadcast
      .to(usuario.sala)
      .emit(
        "crearMensaje",
        crearMensaje("Administrador", `${usuario.nombre} se unió`)
      );
    callback(usuarios.getPersonaPorSala(usuario.sala));
  });

  client.on("disconnect", () => {
    let usuario = usuarios.borrarPersona(client.id);
    console.log("[Usuario desconectado]", usuario.nombre);
    client.broadcast
      .to(usuario.sala)
      .emit(
        "crearMensaje",
        crearMensaje("Administrador", `${usuario.nombre} abondonó el chat`)
      );
    client.broadcast
      .to(usuario.sala)
      .emit("listaPersona", usuarios.getPersonaPorSala(usuario.sala));
  });

  client.on("crearMensaje", (data, callback) => {
    let persona = usuarios.getPersona(client.id);
    let mensaje = crearMensaje(persona.nombre, data.mensaje);
    client.broadcast.to(persona.sala).emit("crearMensaje", mensaje);
    callback(mensaje);
  });

  // Mensajes privados
  client.on("mensajePrivado", ({ id, mensaje }) => {
    let persona = usuarios.getPersona(client.id);
    client.broadcast
      .to(id)
      .emit("mensajePrivado", crearMensaje(persona.nombre, mensaje));
  });
});
