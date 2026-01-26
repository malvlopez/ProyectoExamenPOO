const API_URL = "http://localhost:8080/apiEstudiantes/Estudiantes";
let masterStudentList = [];
let currentSortField = null;
let currentSortDirection = 'asc';

// 1. CARGA INICIAL
async function fetchStudents() {
    const searchInput = document.getElementById('searchInput').value.trim();

    if (searchInput !== "") {
        await performSearch();
        updateMasterListSilent();
    } else {
        try {
            const response = await fetch("http://localhost:8080/apiEstudiantes/Estudiantes");
            if (!response.ok) throw new Error();
            masterStudentList = await response.json();
            renderStudentTable(masterStudentList);
        } catch (error) {
            showToast("Error al conectar con el servidor", "error");
        }
    }
}

async function updateMasterListSilent() {
    try {
        const response = await fetch("http://localhost:8080/apiEstudiantes/Estudiantes");
        if (response.ok) masterStudentList = await response.json();
    } catch (e) { }
}

// 2. RENDERIZADO DE TABLA
function renderStudentTable(students) {
    const tableBody = document.getElementById('studentTableBody');
    tableBody.innerHTML = '';

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="badge-id">#${student.id}</span></td>
            <td>${student.dni}</td>
            <td>${student.name} ${student.lastName}</td>
            <td>${student.career}</td>
            <td>
                <div class="actions-container">
                    <button class="btn-edit" title="Editar">✏️</button>
                    <button class="btn-delete" id="del-${student.id}" title="Eliminar">🗑️</button>
                </div>
            </td>
        `;

        row.querySelector('.btn-edit').onclick = () => prepareEditForm(student);

        const delBtn = row.querySelector(`#del-${student.id}`);
        delBtn.onclick = () => {
            if (delBtn.classList.contains('confirming')) {
                deleteStudentRequest(student.id);
            } else {
                delBtn.textContent = "¿Seguro?";
                delBtn.classList.add('confirming');
                delBtn.style.background = "#2c3e50";
                setTimeout(() => {
                    if (delBtn) {
                        delBtn.textContent = "🗑️";
                        delBtn.classList.remove('confirming');
                        delBtn.style.background = "var(--danger)";
                    }
                }, 3000);
            }
        };

        tableBody.appendChild(row);
    });
}

// 3. PREPARAR MODO EDICIÓN
function prepareEditForm(student) {
    document.getElementById('studentId').value = student.id;
    document.getElementById('dni').value = student.dni;
    document.getElementById('firstName').value = student.name;
    document.getElementById('lastName').value = student.lastName;
    document.getElementById('age').value = student.age;
    document.getElementById('email').value = student.email;
    document.getElementById('career').value = student.career;

    document.getElementById('formTitle').textContent = "Actualizar Estudiante";
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.textContent = "Actualizar Datos";
    submitBtn.classList.add('editing');

    if (!document.getElementById('cancelBtn')) {
        const cancelBtn = document.createElement('button');
        cancelBtn.id = 'cancelBtn';
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn-cancel';
        cancelBtn.textContent = 'Cancelar Edición';
        cancelBtn.onclick = clearForm;
        document.getElementById('formActions').appendChild(cancelBtn);
    }
}

// 4. ENVÍO DE FORMULARIO (GUARDAR/ACTUALIZAR)
document.getElementById('studentForm').onsubmit = async (e) => {
    e.preventDefault();

    const id = document.getElementById('studentId').value;
    const isEdit = id !== "";

    const studentData = {
        dni: document.getElementById('dni').value,
        name: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        age: parseInt(document.getElementById('age').value),
        email: document.getElementById('email').value,
        career: document.getElementById('career').value
    };

    // --- VALIDACIONES DE FRONT-END ---
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    const validateMaxWords = (text) => {
        const words = text.trim().split(/\s+/);
        return words.length > 0 && words.length <= 2;
    };

    if (!nameRegex.test(studentData.name) || !validateMaxWords(studentData.name)) {
        showToast("Nombres inválidos (Máximo 2 nombres, solo letras)", "error");
        return;
    }
    if (!nameRegex.test(studentData.lastName) || !validateMaxWords(studentData.lastName)) {
        showToast("Apellidos inválidos (Máximo 2 apellidos, solo letras)", "error");
        return;
    }

    // --- PROCESO DE PETICIÓN ---
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = "Procesando...";

    const url = isEdit ? `${API_URL}/${id}` : API_URL;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok) {
            showToast(isEdit ? "Estudiante actualizado correctamente" : "Estudiante registrado con éxito");
            clearForm();
            fetchStudents();
        } else {
            let rawError = result.message || "Error al procesar los datos";
            let errorMessage = rawError;

            // Filtrado de mensajes técnicos de MySQL
            const isDuplicate = /duplicate|constraint|uk_|entry/i.test(rawError);
            if (isDuplicate) {
                if (rawError.toLowerCase().includes("dni")) {
                    errorMessage = "Error: El DNI ya está registrado por otro estudiante.";
                } else if (rawError.toLowerCase().includes("email")) {
                    errorMessage = "Error: El correo ya pertenece a otro estudiante.";
                } else {
                    errorMessage = "Error: Dato duplicado en el sistema.";
                }
            }
            showToast(errorMessage, "error");
        }
    } catch (err) {
        showToast("Conexión inestable. Verificando cambios...", "error");
        fetchStudents();
    } finally {
        submitBtn.disabled = false;
        // Si se limpió el form, vuelve al texto original
        if (document.getElementById('studentId').value === "") {
            submitBtn.textContent = "Guardar Estudiante";
            submitBtn.classList.remove('editing');
        } else {
            submitBtn.textContent = "Actualizar Datos";
        }
    }
};

// 5. SOLICITUD DE ELIMINACIÓN
async function deleteStudentRequest(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        // 204 No Content es un éxito (response.ok)
        if (response.ok) {
            showToast("Estudiante eliminado correctamente", "success");
            fetchStudents();
        } else {
            showToast("Error: No se pudo eliminar el registro", "error");
        }
    } catch (error) {
        showToast("Error de conexión con el servidor", "error");
    }
}

// 6. BÚSQUEDA EN TIEMPO REAL
async function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const value = searchInput.value.trim();
    const type = document.getElementById('searchType').value;

    if (value === "") {
        renderStudentTable(masterStudentList);
        return;
    }

    try {
            const paramName = type === 'dni' ? 'dni' : (type === 'career' ? 'carrera' : 'nombre');
            // USAR ESTA URL CON PARAMS:
            const response = await fetch(`http://localhost:8080/apiEstudiantes/buscar?${paramName}=${encodeURIComponent(value)}`);

            if (!response.ok) {
                renderStudentTable([]);
                return;
            }

            const data = await response.json();
            renderStudentTable(Array.isArray(data) ? data : [data]);
        } catch (error) {
            console.error("Error en la búsqueda:", error);
            renderStudentTable([]);
        }
}

// Asignar el evento al input
document.getElementById('searchInput').oninput = performSearch;


// AYUDANTES
function clearForm() {
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = "";
    document.getElementById('formTitle').textContent = "Registrar Estudiante";

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.textContent = "Guardar Estudiante";
    submitBtn.classList.remove('editing');

    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) cancelBtn.remove();
}

function showToast(message, type = 'success') {
    const container = document.getElementById('notification-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// 7. ORDENAMIENTO DE TABLA
function sortStudentsBy(field) {
    if (currentSortField === field) {
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortField = field;
        currentSortDirection = 'asc';
    }

    const sorted = [...masterStudentList].sort((a, b) => {
        let valueA = a[field];
        let valueB = b[field];

        // Strings
        if (typeof valueA === 'string') {
            valueA = valueA.toLowerCase();
            valueB = valueB.toLowerCase();
        }

        if (valueA < valueB) return currentSortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return currentSortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    renderStudentTable(sorted);
}

document.getElementById('refreshBtn').onclick = fetchStudents;
window.onload = fetchStudents;