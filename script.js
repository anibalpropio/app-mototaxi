// Configuración
const ENLACE_GRUPO = "https://chat.whatsapp.com/IBqbKPsk5H14lwTtuRRT5J";

// Función principal mejorada
async function solicitarMototaxi() {
    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const ubicacion = document.getElementById("ubicacion").value.trim();

    if (!nombre || !telefono || !ubicacion) {
        alert("⚠️ Por favor completa todos los campos");
        return;
    }

    // Guardar nombre para futuros pedidos
    localStorage.setItem("nombreClienteMototaxi", nombre);

    // Crear mensaje para el grupo
    const mensaje = `*¡NUEVO PEDIDO DE MOTOTAXI!* 🏍️%0A%0A` +
                    `*Asociación:* Los Famosos%0A` +
                    `*Cliente:* ${nombre}%0A` +
                    `*Teléfono:* ${telefono}%0A` +
                    `*Ubicación:* ${ubicacion}%0A%0A` +
                    `_¡Por favor atender lo antes posible!_`;

    // Mostrar animación
    mostrarAnimacionMoto();
    
    // Enviar al grupo después de 1 segundo
    setTimeout(() => {
        enviarMensajeAlGrupo(mensaje);
        mostrarConfirmacion();
    }, 1000);
}

// Método mejorado para enviar al grupo
function enviarMensajeAlGrupo(mensaje) {
    // Crear iframe invisible para enviar el mensaje
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = `${ENLACE_GRUPO}?text=${encodeURIComponent(mensaje)}`;
    document.body.appendChild(iframe);
    
    // Eliminar iframe después de 3 segundos
    setTimeout(() => iframe.remove(), 3000);
}

function mostrarAnimacionMoto() {
    const moto = document.createElement('div');
    moto.className = 'moto-animacion';
    moto.innerHTML = '<i class="fas fa-motorcycle"></i>';
    document.body.appendChild(moto);
    
    // Añadir sonido opcional (descomentar si quieres)
    // const audio = new Audio('moto-sound.mp3');
    // audio.volume = 0.3;
    // audio.play();
    
    // Eliminar después de la animación
    setTimeout(() => moto.remove(), 2500);
}

// Mostrar confirmación
function mostrarConfirmacion() {
    document.getElementById('formulario').innerHTML = `
        <div class="confirmacion">
            <i class="fas fa-check-circle"></i>
            <h2>¡Pedido Recibido!</h2>
            <p>Gracias por confiar en MotoTaxi Los Famosos</p>
            <p>Un conductor se contactará contigo pronto.</p>
            <button class="btn-volver" onclick="location.reload()">
                <i class="fas fa-motorcycle"></i> Hacer otro pedido
            </button>
        </div>
    `;
}

// Resto de funciones (geolocalización, etc.)
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
                alert("Por favor activa el GPS o ingresa tu ubicación manualmente");
                ubicacionInput.placeholder = "Ej: Av. Principal 123";
            }
        );
    } else {
        alert("Tu navegador no soporta geolocalización");
    }
}
