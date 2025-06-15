const formulario = document.getElementById("formulario");
const listaLibros = document.getElementById("listaLibros");
const btnSubmit = document.querySelector("button[type='submit']");
let libroActualId = null;

// Mostrar libros al cargar
document.addEventListener("DOMContentLoaded", obtenerLibros);

// Crear o actualizar libro
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  try {
    // Validación básica
    const titulo = document.getElementById("titulo").value.trim();
    const autor = document.getElementById("autor").value.trim();
    const año = document.getElementById("año").value.trim();
    const genero = document.getElementById("genero").value.trim();
    const estado = document.getElementById("estado").value;

    if (!titulo || !autor || !estado) {
      throw new Error("Por favor completa los campos requeridos");
    }

    const libro = {
      titulo,
      autor,
      año,
      genero,
      estado
    };const url = libroActualId 
      ? `/api/libros/${libroActualId}`
      : "/api/libros";
      
    const method = libroActualId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(libro)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al guardar el libro");
    }
    
    resetForm();
    await obtenerLibros();
    mostrarMensaje(libroActualId ? "actualizado" : "creado");
  } catch (error) {
    console.error("Error:", error);
    alert(error.message || "Ocurrió un error al guardar el libro");
  }
});

// Obtener libros
async function obtenerLibros() {
  try {    const response = await fetch("/api/libros");
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const libros = await response.json();
    mostrarLibros(libros);
  } catch (error) {
    console.error("Error al obtener libros:", error);
    listaLibros.innerHTML = `<p class="error">Error al cargar libros: ${error.message}</p>`;
  }
}

// Mostrar libros en el DOM
function mostrarLibros(libros) {
  listaLibros.innerHTML = "";
  
  if (libros.length === 0) {
    listaLibros.innerHTML = "<p class='empty'>No hay libros en la biblioteca</p>";
    return;
  }
  
  libros.forEach(libro => {
    const libroElement = document.createElement("div");
    libroElement.className = "card";
    libroElement.innerHTML = `
      <h3>${libro.titulo}</h3>
      <p><strong>Autor:</strong> ${libro.autor}</p>
      <p><strong>Año:</strong> ${libro.año || "No especificado"}</p>
      <p><strong>Género:</strong> ${libro.genero || "No especificado"}</p>      <p><strong>Estado:</strong> <span class="estado ${libro.estado.toLowerCase()}">${libro.estado}</span></p>
      <div class="acciones">
        <button class="btn-editar" data-id="${libro._id}">Editar</button>
        <button class="btn-eliminar" data-id="${libro._id}">Eliminar</button>
      </div>
    `;
    listaLibros.appendChild(libroElement);
  });

  // Agregar event listeners para los botones
  document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.getAttribute('data-id');
      editarLibro(id);
    });
  });

  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.getAttribute('data-id');
      eliminarLibro(id);
    });
  });
}

// Función para editar libro
async function editarLibro(id) {
  try {
    const response = await fetch(`/api/libros/${id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const libro = await response.json();
    
    // Llenar formulario
    document.getElementById("titulo").value = libro.titulo;
    document.getElementById("autor").value = libro.autor;
    document.getElementById("año").value = libro.año;
    document.getElementById("genero").value = libro.genero;
    document.getElementById("estado").value = libro.estado;
      // Configurar modo edición
    libroActualId = id;
    btnSubmit.textContent = "Actualizar Libro";
    
    // Mostrar botón cancelar
    document.getElementById("btnCancelar").classList.remove("hidden");
    
    // Scroll al formulario
    formulario.scrollIntoView({ behavior: "smooth" });
    
  } catch (error) {
    console.error("Error al editar libro:", error);
    alert("Error al cargar libro para editar: " + error.message);
  }
}

// Función para eliminar libro
async function eliminarLibro(id) {
  if (!confirm("¿Estás seguro de eliminar este libro?")) return;
  
  try {
    const response = await fetch(`/api/libros/${id}`, {
      method: "DELETE"
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    await obtenerLibros();
    alert("Libro eliminado exitosamente");
  } catch (error) {
    console.error("Error al eliminar libro:", error);
    alert("Error al eliminar libro: " + error.message);
  }
}

// Agregar manejador para el botón cancelar
document.getElementById("btnCancelar").addEventListener("click", () => {
  resetForm();
});

// Funciones auxiliares
function resetForm() {
  formulario.reset();
  libroActualId = null;
  btnSubmit.textContent = "✨ Agregar Libro";
  document.getElementById("btnCancelar").classList.add("hidden");
}

function mostrarMensaje(accion) {
  const mensaje = document.createElement("div");
  mensaje.className = "mensaje";
  mensaje.textContent = `Libro ${accion} exitosamente!`;
  document.body.appendChild(mensaje);
  
  setTimeout(() => {
    mensaje.remove();
  }, 3000);
}