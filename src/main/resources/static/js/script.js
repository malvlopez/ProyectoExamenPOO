const URL_API = "http://localhost:8080/apiEstudiantes/Estudiantes";
let listaOriginalEstudiantes = [];

// 1. CARGA INICIAL
async function cargarEstudiantes() {
    try {
        const respuesta = await fetch(URL_API);
        listaOriginalEstudiantes = await respuesta.json();
        renderizarTabla(listaOriginalEstudiantes);
    } catch (error) {
        console.error("Error al cargar:", error);
        mostrarNotificacion("Error de conexión con el servidor", "error");
    }
}

// 2. RENDERIZADO DE TABLA (Única función para pintar)
function renderizarTabla(estudiantes) {
    const tabla = document.getElementById('tablaEstudiantes');
    tabla.innerHTML = '';

    estudiantes.forEach(estudiante => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${estudiante.dni}</td>
            <td>${estudiante.name} ${estudiante.lastName}</td>
            <td>${estudiante.career}</td>
            <td>
                <div class="actions-container">
                    <button class="btn-edit" title="Editar">✏️</button>
                    <button class="btn-delete" title="Eliminar">🗑️</button>
                </div>
            </td>
        `;

        // Asignar eventos de forma limpia
        fila.querySelector('.btn-edit').addEventListener('click', () => prepararEdicion(estudiante));
        fila.querySelector('.btn-delete').addEventListener('click', () => eliminarEstudiante(estudiante.id));

        tabla.appendChild(fila);
    });
}

// 3. BÚSQUEDA EN TIEMPO REAL
document.getElementById('inputBuscar').addEventListener('input', (e) => {
    const criterio = e.target.value.toLowerCase();
    const tipo = document.getElementById('tipoBusqueda').value;

    if (tipo === 'dni') {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 10);
    }

    const filtrados = listaOriginalEstudiantes.filter(estudiante => {
        if (tipo === 'dni') {
            return estudiante.dni.startsWith(e.target.value);
        } else {
            const nombreCompleto = `${estudiante.name} ${estudiante.lastName}`.toLowerCase();
            return nombreCompleto.includes(criterio);
        }
    });
    renderizarTabla(filtrados);
});

// 4. PREPARAR EDICIÓN
function prepararEdicion(estudiante) {
    document.getElementById('estudianteId').value = estudiante.id;
    document.getElementById('dni').value = estudiante.dni;
    document.getElementById('name').value = estudiante.name;
    document.getElementById('lastName').value = estudiante.lastName;
    document.getElementById('age').value = estudiante.age;
    document.getElementById('email').value = estudiante.email;
    document.getElementById('career').value = estudiante.career;

    const btn = document.querySelector('.btn-save');
    btn.textContent = "Actualizar Estudiante";
    btn.classList.add('editing');
}

// 5. GUARDAR / ACTUALIZAR (POST / PUT)
document.getElementById('formEstudiante').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('estudianteId').value;
    const esEdicion = id !== "";

    const datos = {
        dni: document.getElementById('dni').value,
        name: document.getElementById('name').value,
        lastName: document.getElementById('lastName').value,
        age: parseInt(document.getElementById('age').value),
        email: document.getElementById('email').value,
        career: document.getElementById('career').value
    };

    try {
        const url = esEdicion ? `${URL_API}/${id}` : URL_API;
        const metodo = esEdicion ? 'PUT' : 'POST';

        const respuesta = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (respuesta.ok) {
            mostrarNotificacion(esEdicion ? "Actualizado con éxito" : "Registrado con éxito");
            resetearFormulario();
            cargarEstudiantes();
        } else {
            const err = await respuesta.json();
            mostrarNotificacion("Error: " + (err.message || "Datos inválidos"), "error");
        }
    } catch (err) {
        mostrarNotificacion("Error al procesar", "error");
    }
});

// 6. ELIMINAR
async function eliminarEstudiante(id) {
    if (confirm("¿Eliminar este registro?")) {
        await fetch(`${URL_API}/${id}`, { method: 'DELETE' });
        cargarEstudiantes();
    }
}

// FUNCIONES AUXILIARES
function resetearFormulario() {
    document.getElementById('formEstudiante').reset();
    document.getElementById('estudianteId').value = "";
    const btn = document.querySelector('.btn-save');
    btn.textContent = "Guardar Estudiante";
    btn.classList.remove('editing');
}

function mostrarNotificacion(msj, tipo = 'success') {
    const container = document.getElementById('notification-container');
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.textContent = msj;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 3000);
}

document.getElementById('btnCargar').addEventListener('click', cargarEstudiantes);
window.onload = cargarEstudiantes;