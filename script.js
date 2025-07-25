// ========================================
// CONFIGURACIÓN DE CONDUCTORES
// ========================================
const CONDUCTORES = [
    { nombre: "Anibal", telefono: "+59172606929" },
    { nombre: "Claudio", telefono: "+59177348376" }
];

// ========================================
// FUNCIÓN PRINCIPAL
// ========================================
async function solicitarMototaxi() {
    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const ubicacion = document.getElementById("ubicacion").value.trim();

    // Validaciones
    if (!nombre || !telefono || !ubicacion) {
        alert("⚠️ Por favor completa todos los campos");
        return;
    }

    // Guardar nombre para futuros pedidos
    localStorage.setItem("nombreClienteMototaxi", nombre);

    // Mostrar animación
    mostrarAnimacionMoto();
    
    // Enviar a todos los conductores después de 1 segundo
    setTimeout(() => {
        enviarATodosConductores(nombre, telefono, ubicacion);
        mostrarConfirmacion();
    }, 1000);
}

// ========================================
// ENVÍO A CONDUCTORES (SIMPLIFICADO)
// ========================================
function enviarATodosConductores(nombre, telefono, ubicacion) {
    const mensaje = crearMensaje(nombre, telefono, ubicacion);
    
    // Enviar a cada conductor (se abre WhatsApp con mensaje prellenado)
    CONDUCTORES.forEach((conductor, index) => {
        setTimeout(() => {
            const url = `https://wa.me/${conductor.telefono.replace('+', '')}?text=${encodeURIComponent(mensaje)}`;
            window.open(url, '_blank');
        }, index * 1000); // 1 segundo entre cada ventana
    });
}

function crearMensaje(nombre, telefono, ubicacion) {
    const ahora = new Date();
    const hora = ahora.toLocaleTimeString();
    
    return `🏍️ *NUEVO PEDIDO MOTOTAXI*

*ASOCIACIÓN:* Los Famosos
━━━━━━━━━━━━━━━━━━━━━━
👤 *Cliente:* ${nombre}
📱 *Teléfono:* ${telefono}  
📍 *Ubicación:* ${ubicacion}
━━━━━━━━━━━━━━━━━━━━━━
⏰ *Hora:* ${hora}

🚨 *IMPORTANTE:* 
• Responde "ACEPTO" si puedes tomar el viaje
• Si ya fue tomado por otro, ignora este mensaje

*¡Gracias por ser parte del equipo Los Famosos!* 🚀`;
}

// ========================================
// ANIMACIONES Y CONFIRMACIÓN
// ========================================
function mostrarAnimacionMoto() {
    const moto = document.createElement('div');
    moto.className = 'moto-animacion';
    moto.innerHTML = '<i class="fas fa-motorcycle"></i>';
    document.body.appendChild(moto);
    
    setTimeout(() => moto.remove(), 2500);
}

function mostrarConfirmacion() {
    document.getElementById('formulario').innerHTML = `
        <div class="confirmacion">
            <i class="fas fa-check-circle"></i>
            <h2>¡Pedido Enviado!</h2>
            <p><strong>Tu pedido ha sido enviado a ${CONDUCTORES.length} conductores</strong></p>
            <p>Se abrieron ${CONDUCTORES.length} ventanas de WhatsApp con tu pedido.</p>
            <div class="info-importante">
                <i class="fas fa-info-circle"></i>
                <p>El primer conductor que responda "ACEPTO" será tu conductor asignado.</p>
            </div>
            <p><strong>Tiempo estimado de respuesta: 2-5 minutos</strong></p>
            
            <button class="btn-volver" onclick="location.reload()">
                <i class="fas fa-motorcycle"></i> Hacer otro pedido
            </button>
        </div>
    `;
}

// ========================================
// GEOLOCALIZACIÓN
// ========================================
function getLocation() {
    const ubicacionInput = document.getElementById("ubicacion");
    const btnGps = document.getElementById("btn-gps");
    
    btnGps.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Obteniendo...';
    btnGps.disabled = true;
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                ubicacionInput.value = `📍 ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                
                btnGps.innerHTML = '<i class="fas fa-check"></i> ¡Listo!';
                setTimeout(() => {
                    btnGps.innerHTML = '<i class="fas fa-location-crosshairs"></i> Usar GPS';
                    btnGps.disabled = false;
                }, 2000);
            },
            (error) => {
                alert("No se pudo obtener tu ubicación. Ingresa tu dirección manualmente.");
                btnGps.innerHTML = '<i class="fas fa-location-crosshairs"></i> Usar GPS';
                btnGps.disabled = false;
            }
        );
    } else {
        alert("Tu navegador no soporta geolocalización");
        btnGps.innerHTML = '<i class="fas fa-location-crosshairs"></i> Usar GPS';
        btnGps.disabled = false;
    }
}

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener("DOMContentLoaded", () => {
    const nombreGuardado = localStorage.getItem("nombreClienteMototaxi");
    if (nombreGuardado) {
        document.getElementById("nombre").value = nombreGuardado;
    }
});
