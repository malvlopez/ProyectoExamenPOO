const API_URL = "http://localhost:8080/apiEstudiantes/Estudiantes";
let masterStudentList = [];
let currentSortField = null;
let currentSortDirection = 'asc';

// 1. CARGA INICIAL
async function fetchStudents() {
    try {
        console.log("Solicitando datos actualizados a MySQL...");
        const response = await fetch(API_URL);

        if (!response.ok) throw new Error("Error en la respuesta del servidor");

        masterStudentList = await response.json();
        renderStudentTable(masterStudentList);

        console.log("Tabla actualizada con éxito.");
    } catch (error) {
        showToast("No se pudo refrescar la lista", "error");
    }
}

// 2. RENDERIZADO DE TABLA
function renderStudentTable(students) {
    const tableBody = document.getElementById('studentTableBody');
    tableBody.innerHTML = '';

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.dni}</td>
            <td>${student.name} ${student.lastName}</td>
            <td>${student.career}</td>
            <td>
                <div class="actions-container">
                    <button class="btn-edit" title="Editar">✏️</button>
                    <button class="btn-delete" title="Eliminar">🗑️</button>
                </div>
            </td>
        `;

        row.querySelector('.btn-edit').onclick = () => prepareEditForm(student);
        row.querySelector('.btn-delete').onclick = () => deleteStudentRequest(student.id);

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
    if (confirm("¿Está seguro de eliminar este registro?")) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                showToast("Estudiante eliminado satisfactoriamente");
                fetchStudents();
            } else {
                showToast("No se pudo eliminar el estudiante", "error");
            }
        } catch (error) {
            showToast("Error al conectar con el servidor", "error");
        }
    }
}

// 6. BÚSQUEDA EN TIEMPO REAL
document.getElementById('searchInput').oninput = (e) => {
    const criteria = e.target.value.toLowerCase();
    const type = document.getElementById('searchType').value;

    if (type === 'dni') {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 10);
    }

    const filtered = masterStudentList.filter(s => {
        if (type === 'dni') return s.dni.startsWith(e.target.value);
        const fullName = `${s.name} ${s.lastName}`.toLowerCase();
        return fullName.includes(criteria);
    });
    renderStudentTable(filtered);
};

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