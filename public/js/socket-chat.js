var socket = io();

// Leer por parametro
var params = new URLSearchParams(window.location.search);

if (!params.has("nombre") || !params.has("sala")) {
  window.location = "index.html";
  throw new Error("El nombre y sala son necesarios");
}

var usuario = {
  nombre: params.get("nombre"),
  sala: params.get("sala"),
};

socket.on("connect", function () {
  console.log("Conectado al servidor");

  // nombre emisión | data del usuario | callback que devuelve el backend
  socket.emit("entrarChat", usuario, (res) => {
    // console.log("Usuarios conectados", res);
    renderizarUsuarios(res);
  });
});

// escuchar
socket.on("disconnect", function () {
  console.log("Perdimos conexión con el servidor");
});

// Enviar información
socket.emit(
  "enviarMensaje",
  {
    usuario: "Fernando",
    mensaje: "Hola Mundo",
  },
  function (resp) {
    console.log("respuesta server: ", resp);
  }
);

// Escuchar información
socket.on("crearMensaje", function (mensaje) {
  renderizarMensaje(mensaje, false);
  scrollBottom();
});

// Escuchar cuando un usuario entra o sale de un chat
socket.on("listaPersona", (personas = []) => {
  renderizarUsuarios(personas);
});

// Mensajes privados
socket.on("mensajePrivado", (mensaje) => {
  console.log("Mensaje privado:", mensaje);
});
