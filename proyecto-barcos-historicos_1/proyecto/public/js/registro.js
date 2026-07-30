const formRegistro = document.getElementById("formRegistro");
const mensaje = document.getElementById("mensaje");

const mostrarMensaje = (texto, tipo) => {
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
};

formRegistro.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const clave = document.getElementById("clave").value;
  const confirmarClave = document.getElementById("confirmarClave").value;

  if (clave !== confirmarClave) {
    mostrarMensaje("Las contraseñas no coinciden.", "error");
    return;
  }

  try {
    const respuesta = await fetch("/api/auth/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, correo, clave })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje(datos.mensaje || "Error al registrarse.", "error");
      return;
    }

    localStorage.setItem("token", datos.token);
    localStorage.setItem("usuario", JSON.stringify(datos.usuario));

    mostrarMensaje("Registro exitoso. Redirigiendo...", "exito");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  } catch (error) {
    mostrarMensaje("Error de conexión con el servidor.", "error");
  }
});
