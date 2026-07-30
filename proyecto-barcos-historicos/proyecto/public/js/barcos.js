const token = localStorage.getItem("token");
const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

// Proteger la pagina
if (!token || !usuario) {
  window.location.href = "login.html";
}

document.getElementById("usuarioInfo").textContent = usuario ? usuario.nombre : "";

document.getElementById("btnCerrarSesion").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
});

const mensaje = document.getElementById("mensaje");
const listaBarcos = document.getElementById("listaBarcos");
const formBarco = document.getElementById("formBarco");
const barcoId = document.getElementById("barcoId");
const tituloFormulario = document.getElementById("tituloFormulario");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const busqueda = document.getElementById("busqueda");
const filtroPais = document.getElementById("filtroPais");

let barcosCache = [];

const mostrarMensaje = (texto, tipo) => {
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
  setTimeout(() => {
    mensaje.className = "mensaje";
  }, 3000);
};

const encabezados = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`
};

// ---------- Obtener y mostrar barcos ----------
const obtenerBarcos = async () => {
  try {
    const respuesta = await fetch("/api/barcos", { headers: encabezados });

    if (respuesta.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    const datos = await respuesta.json();
    barcosCache = datos;
    actualizarFiltroPaises(datos);
    renderizarBarcos(datos);
  } catch (error) {
    mostrarMensaje("Error al cargar los barcos.", "error");
  }
};

const actualizarFiltroPaises = (barcos) => {
  const paises = [...new Set(barcos.map((b) => b.pais))].sort();
  const valorActual = filtroPais.value;
  filtroPais.innerHTML = '<option value="">Todos los países</option>';
  paises.forEach((pais) => {
    const opcion = document.createElement("option");
    opcion.value = pais;
    opcion.textContent = pais;
    filtroPais.appendChild(opcion);
  });
  filtroPais.value = valorActual;
};

const renderizarBarcos = (barcos) => {
  listaBarcos.innerHTML = "";

  if (barcos.length === 0) {
    listaBarcos.innerHTML = '<p class="vacio">No hay barcos registrados todavía.</p>';
    return;
  }

  barcos.forEach((barco) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-barco";

    const imagen = barco.imagenUrl
      ? `<img src="${barco.imagenUrl}" alt="${barco.nombre}" onerror="this.style.display='none'">`
      : "";

    tarjeta.innerHTML = `
      ${imagen}
      <div class="contenido">
        <h3>${barco.nombre}</h3>
        <p class="dato"><strong>País:</strong> ${barco.pais}</p>
        <p class="dato"><strong>Año:</strong> ${barco.añoConstruccion}</p>
        <p class="dato"><strong>Tipo:</strong> ${barco.tipo}</p>
        <p class="dato"><strong>Función:</strong> ${barco.funcionPrincipal}</p>
        ${barco.estadoActual ? `<p class="dato"><strong>Estado actual:</strong> ${barco.estadoActual}</p>` : ""}
        ${barco.hechoHistorico ? `<p class="dato"><strong>Hecho histórico:</strong> ${barco.hechoHistorico}</p>` : ""}
      </div>
      <div class="botones-tarjeta">
        <button class="boton secundario" onclick="editarBarco('${barco._id}')">Editar</button>
        <button class="boton peligro" onclick="eliminarBarco('${barco._id}')">Eliminar</button>
      </div>
    `;

    listaBarcos.appendChild(tarjeta);
  });
};

// ---------- Crear / Actualizar ----------
formBarco.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const cuerpo = {
    nombre: document.getElementById("nombre").value.trim(),
    pais: document.getElementById("pais").value.trim(),
    añoConstruccion: Number(document.getElementById("añoConstruccion").value),
    tipo: document.getElementById("tipo").value.trim(),
    funcionPrincipal: document.getElementById("funcionPrincipal").value.trim(),
    longitudMetros: Number(document.getElementById("longitudMetros").value) || undefined,
    tripulacion: Number(document.getElementById("tripulacion").value) || undefined,
    estadoActual: document.getElementById("estadoActual").value.trim(),
    hechoHistorico: document.getElementById("hechoHistorico").value.trim(),
    imagenUrl: document.getElementById("imagenUrl").value.trim()
  };

  const id = barcoId.value;
  const esEdicion = Boolean(id);

  try {
    const respuesta = await fetch(esEdicion ? `/api/barcos/${id}` : "/api/barcos", {
      method: esEdicion ? "PUT" : "POST",
      headers: encabezados,
      body: JSON.stringify(cuerpo)
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje(datos.mensaje || "Error al guardar el barco.", "error");
      return;
    }

    mostrarMensaje(esEdicion ? "Barco actualizado correctamente." : "Barco registrado correctamente.", "exito");
    limpiarFormulario();
    obtenerBarcos();
  } catch (error) {
    mostrarMensaje("Error de conexión con el servidor.", "error");
  }
});

// ---------- Editar ----------
window.editarBarco = (id) => {
  const barco = barcosCache.find((b) => b._id === id);
  if (!barco) return;

  barcoId.value = barco._id;
  document.getElementById("nombre").value = barco.nombre || "";
  document.getElementById("pais").value = barco.pais || "";
  document.getElementById("añoConstruccion").value = barco.añoConstruccion || "";
  document.getElementById("tipo").value = barco.tipo || "";
  document.getElementById("funcionPrincipal").value = barco.funcionPrincipal || "";
  document.getElementById("longitudMetros").value = barco.longitudMetros || "";
  document.getElementById("tripulacion").value = barco.tripulacion || "";
  document.getElementById("estadoActual").value = barco.estadoActual || "";
  document.getElementById("hechoHistorico").value = barco.hechoHistorico || "";
  document.getElementById("imagenUrl").value = barco.imagenUrl || "";

  tituloFormulario.textContent = "Editar barco";
  btnGuardar.textContent = "Guardar cambios";
  btnCancelar.style.display = "inline-block";

  window.scrollTo({ top: 0, behavior: "smooth" });
};

// ---------- Eliminar ----------
window.eliminarBarco = async (id) => {
  const confirmar = confirm("¿Está seguro de que desea eliminar este registro?");
  if (!confirmar) return;

  try {
    const respuesta = await fetch(`/api/barcos/${id}`, {
      method: "DELETE",
      headers: encabezados
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje(datos.mensaje || "Error al eliminar.", "error");
      return;
    }

    mostrarMensaje("Barco eliminado correctamente.", "exito");
    obtenerBarcos();
  } catch (error) {
    mostrarMensaje("Error de conexión con el servidor.", "error");
  }
};

// ---------- Cancelar edicion ----------
btnCancelar.addEventListener("click", limpiarFormulario);

function limpiarFormulario() {
  formBarco.reset();
  barcoId.value = "";
  tituloFormulario.textContent = "Registrar nuevo barco";
  btnGuardar.textContent = "Registrar barco";
  btnCancelar.style.display = "none";
}

// ---------- Busqueda y filtros ----------
const aplicarFiltros = () => {
  const texto = busqueda.value.toLowerCase();
  const pais = filtroPais.value;

  const filtrados = barcosCache.filter((barco) => {
    const coincideNombre = barco.nombre.toLowerCase().includes(texto);
    const coincidePais = pais ? barco.pais === pais : true;
    return coincideNombre && coincidePais;
  });

  renderizarBarcos(filtrados);
};

busqueda.addEventListener("input", aplicarFiltros);
filtroPais.addEventListener("change", aplicarFiltros);

// Carga inicial
obtenerBarcos();
