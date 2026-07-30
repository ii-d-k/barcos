const formLogin = document.getElementById("formLogin");
const mensaje = document.getElementById("mensaje");

const mostrarMensaje = (texto, tipo) => {
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
};

formLogin.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const correo = document.getElementById("correo").value.trim();
  const clave = document.getElementById("clave").value;

  try {
    const respuesta = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, clave })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje(datos.mensaje || "Error al iniciar sesión.", "error");
      return;
    }

    localStorage.setItem("token", datos.token);
    localStorage.setItem("usuario", JSON.stringify(datos.usuario));

    mostrarMensaje("Inicio de sesión exitoso. Redirigiendo...", "exito");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);
  } catch (error) {
    mostrarMensaje("Error de conexión con el servidor.", "error");
  }
});
