const token = localStorage.getItem("token");
const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

// Proteger la pagina: si no hay token, redirigir al login
if (!token || !usuario) {
  window.location.href = "login.html";
}

document.getElementById("usuarioInfo").textContent = usuario ? usuario.nombre : "";
const saludo = document.getElementById("saludoUsuario");
if (saludo && usuario) {
  saludo.textContent = `Bienvenido, ${usuario.nombre}`;
}

document.getElementById("btnCerrarSesion").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
});
