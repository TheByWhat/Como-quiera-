// 1. IMPORTACIONES DESDE EL CDN (No requieren instalación de npm)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. TUS CREDENCIALES REALES
const firebaseConfig = {
  apiKey: "AIzaSyAvJyOHE1fS1mQj667IrGkVyQI7-hLjsF8",
  authDomain: "crud-firebase-app-697b7.firebaseapp.com",
  projectId: "crud-firebase-app-697b7",
  storageBucket: "crud-firebase-app-697b7.firebasestorage.app",
  messagingSenderId: "764457095335",
  appId: "1:764457095335:web:97e22511da53d4933e8b82"
};

// 3. INICIALIZACIÓN [cite: 30, 31, 32]
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let datos = [];

// --- FUNCIONES CRUD ---

// AGREGAR: Guarda un producto en Firestore [cite: 4, 83]
window.agregar = async function() {
    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;

    if (nombre === "" || precio === "") {
        alert("Completa todos los campos");
        return;
    }

    try {
        await addDoc(collection(db, "productos"), {
            nombre: nombre,
            precio: precio
        });
        alert("¡Producto guardado!");
        limpiarFormulario();
        leer(); 
    } catch (e) {
        console.error("Error al guardar: ", e);
    }
};

// LEER: Obtiene los datos de la base de datos [cite: 4]
async function leer() {
    datos = [];
    const querySnapshot = await getDocs(collection(db, "productos"));
    querySnapshot.forEach((doc) => {
        datos.push({ id: doc.id, ...doc.data() });
    });
    mostrar(datos);
}

// MOSTRAR: Dibuja la tabla en el HTML [cite: 107]
function mostrar(lista) {
    const tabla = document.getElementById("tabla");
    tabla.innerHTML = "";
    lista.forEach((p) => {
        tabla.innerHTML += `
            <tr>
                <td>${p.nombre}</td>
                <td>$${p.precio}</td>
                <td>
                    <button onclick="eliminar('${p.id}')">Eliminar</button>
                    <button onclick="editar('${p.id}')">Editar</button>
                </td>
            </tr>`;
    });
}

// ELIMINAR: Borra un documento por ID [cite: 4]
window.eliminar = async function(id) {
    if(confirm("¿Eliminar producto?")) {
        await deleteDoc(doc(db, "productos", id));
        leer();
    }
};

// EDITAR: Actualiza un documento [cite: 4]
window.editar = async function(id) {
    const n = prompt("Nuevo nombre:");
    const p = prompt("Nuevo precio:");
    if(n && p) {
        await updateDoc(doc(db, "productos", id), { nombre: n, precio: p });
        leer();
    }
};

// FILTRAR: Búsqueda en tiempo real [cite: 92]
window.filtrar = function() {
    const texto = document.getElementById("buscar").value.toLowerCase();
    const filtrados = datos.filter(d => d.nombre.toLowerCase().includes(texto));
    mostrar(filtrados);
};

function limpiarFormulario() {
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
}

// Carga inicial al abrir la página
leer();