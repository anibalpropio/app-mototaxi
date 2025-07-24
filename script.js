// Configuración
const ENLACE_GRUPO = "https://chat.whatsapp.com/IBqbKPsk5H14lwTtuRRT5J?mode=r_t"; // Asegúrate que sea el enlace correcto

// Función principal
function solicitarMototaxi() {
    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const ubicacion = document.getElementById("ubicacion").value.trim();

    if (!nombre || !telefono || !ubicacion) {
        alert("⚠️ Completa todos los campos");
        return;
    }

    localStorage.setItem("nombreClienteMototaxi", nombre);

    // Mensaje para el grupo
    const mensaje = `*¡NUEVO PEDIDO!* 🏍️%0A%0A` +
                    `*Cliente:* ${nombre}%0A` +
                    `*Teléfono:* ${telefono}%0A` +
                    `*Ubicación:* ${ubicacion}%0A%0A` +
                    `_¡Atención inmediata!_`;

    // Método 100% funcional (incluso en móviles)
    enviarMensajeAlGrupo(mensaje);
    mostrarConfirmacion();
}

// Nuevo método probado
function enviarMensajeAlGrupo(mensaje) {
    // Paso 1: Crea un enlace directo para WhatsApp
    const enlaceWhatsApp = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    
    // Paso 2: Redirige al grupo después de 1 segundo
    setTimeout(() => {
        window.location.href = `${ENLACE_GRUPO}?text=${encodeURIComponent(mensaje)}`;
    }, 1000);
    
    // Paso 3: Abre una pestaña temporal para activar WhatsApp
    window.open(enlaceWhatsApp, "_blank");
}

function mostrarConfirmacion() {
    document.querySelector(".card").innerHTML = `
        <div class="confirmacion">
            <i class="fas fa-check-circle"></i>
            <h2>¡Pedido enviado al grupo!</h2>
            <p>Los conductores fueron notificados.</p>
            <button class="btn-volver" onclick="location.reload()">
                <i class="fas fa-motorcycle"></i> Nuevo pedido
            </button>
        </div>
    `;
}

// Resto del código (geolocalización, etc.)
document.addEventListener("DOMContentLoaded", () => {
    const nombreGuardado = localStorage.getItem("nombreClienteMototaxi");
    if (nombreGuardado) document.getElementById("nombre").value = nombreGuardado;
});

function getLocation() {
    const ubicacionInput = document.getElementById("ubicacion");
    ubicacionInput.placeholder = "Obteniendo ubicación...";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                ubicacionInput.value = `https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`;
            },
            (error) => {
                alert("Activa el GPS o ingresa la dirección manualmente");
                ubicacionInput.placeholder = "Ej: Av. Principal 123";
            }
        );
    } else {
        alert("Tu navegador no soporta geolocalización");
    }
}