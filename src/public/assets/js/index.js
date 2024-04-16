// console.log("hola");
let nombre = prompt("ingrese su nombre");
document.title = nombre;
const socket = io();

socket.on("saludo", data => {
  console.log(data);
  if (nombre) {
    socket.emit("id", nombre);
  }
});

socket.on("Nuevo cliente", id => {
  console.log(`El cliente con id ${id} se ha unido al servidor`);
});

//parte -01 invia un mesaje atravez del socket con la constante "decir"
const decir = texto => {
  socket.emit("Nuevo mensaje", nombre, texto); //envia un mensaje nombre lo saca del prompt
};

//parte -04 recibe el emit con un on y ejecuta
socket.on("mensaje", (nombre, mensaje) => {
  console.log(`${nombre} dice ${mensaje}`);
});

//temperatura
let parrafo = document.getElementById("temperatura");
socket.on("nuervaLecturaDeTemperatura", temperatura => {
  parrafo.innerHTML = `La temperatura es ${temperatura}°`;
});
