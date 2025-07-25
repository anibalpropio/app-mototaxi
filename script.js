// ========================================
// CONFIGURACIÓN DE CONDUCTORES
// ========================================
// IMPORTANTE: Cambia estos números por los de tus conductores reales
const CONDUCTORES = [
    { nombre: "Anibal", telefono: "+59172606929" },
    { nombre: "Claudio", telefono: "+59177348376" },
    { nombre: "José", telefono: "+59176543210" },
    { nombre: "Ana", telefono: "+591xxxxxx" },
    // Agrega más conductores aquí
];

// URL base de tu aplicación (cámbiala por tu GitHub Pages URL)
const URL_BASE = "https://tu-usuario.github.io/tu-repositorio"; // CAMBIAR ESTO

// ========================================
// FUNCIÓN PRINCIPAL MEJORADA
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

    if (!validarTelefono(telefono)) {
        alert("⚠️ Por favor ingresa un número de teléfono válido");
        return;
    }

    // Guardar datos para futuros pedidos
    localStorage.setItem("nombreClienteMototaxi", nombre);
    localStorage.setItem("telefonoClienteMototaxi", telefono);

    // Generar ID único para este pedido
    const pedidoId = generarIdPedido();
    
    // Guardar pedido en localStorage
    guardarPedido(pedidoId, { nombre, telefono, ubicacion, timestamp: Date.now() });

    // Mostrar animación
    mostrarAnimacionMoto();
    
    // Enviar a todos los conductores después de 1 segundo
    setTimeout(() => {
        enviarATodosConductores(nombre, telefono, ubicacion, pedidoId);
        mostrarConfirmacion();
    }, 1000);
}

// ========================================
// SISTEMA DE ENVÍO A MÚLTIPLES CONDUCTORES
// ========================================
function enviarATodosConductores(nombre, telefono, ubicacion, pedidoId) {
    const mensaje = crearMensajePedido(nombre, telefono, ubicacion, pedidoId);
    
    // Enviar a cada conductor
    CONDUCTORES.forEach((conductor, index) => {
        setTimeout(() => {
            enviarMensajeAConductor(conductor.telefono, mensaje);
        }, index * 500); // Esperar 500ms entre cada envío
    });
}

function crearMensajePedido(nombre, telefono, ubicacion, pedidoId) {
    const urlTomar = `${URL_BASE}/tomar.html?id=${pedidoId}`;
    
    const mensaje = `🏍️ *NUEVO PEDIDO MOTOTAXI* 🏍️

*ASOCIACIÓN:* Los Famosos
━━━━━━━━━━━━━━━━━━━━━━
👤 *Cliente:* ${nombre}
📱 *Teléfono:* ${telefono}
📍 *Ubicación:* ${ubicacion}
━━━━━━━━━━━━━━━━━━━━━━

⏰ *${new Date().toLocaleTimeString()}*

🚀 *TOMAR VIAJE:* ${urlTomar}

⚠️ *IMPORTANTE:* Solo el primer conductor que tome el viaje lo atenderá.`;

    return mensaje;
}

function enviarMensajeAConductor(telefono, mensaje) {
    const url = `https://wa.me/${telefono.replace('+', '')}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

// ========================================
// SISTEMA DE GESTIÓN DE PEDIDOS
// ========================================
function generarIdPedido() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function guardarPedido(id, datos) {
    const pedidos = JSON.parse(localStorage.getItem('pedidosActivos') || '{}');
    pedidos[id] = datos;
    localStorage.setItem('pedidosActivos', JSON.stringify(pedidos));
}

function marcarPedidoTomado(id, conductorInfo) {
    const pedidos = JSON.parse(localStorage.getItem('pedidosActivos') || '{}');
    if (pedidos[id]) {
        pedidos[id].tomado = true;
        pedidos[id].conductor = conductorInfo;
        pedidos[id].horaConfirmacion = Date.now();
        localStorage.setItem('pedidosActivos', JSON.stringify(pedidos));
        return true;
    }
    return false;
}

function verificarEstadoPedido(id) {
    const pedidos = JSON.parse(localStorage.getItem('pedidosActivos') || '{}');
    return pedidos[id] || null;
}

// ========================================
// VALIDACIONES Y UTILIDADES
// ========================================
function validarTelefono(telefono) {
    // Acepta formatos: +59171234567, 71234567, etc.
    const regex = /^(\+?591)?[67]\d{7}$/;
    return regex.test(telefono.replace(/\s/g, ''));
}

function mostrarAnimacionMoto() {
    const moto = document.createElement('div');
    moto.className = 'moto-animacion';
    moto.innerHTML = '<i class="fas fa-motorcycle"></i>';
    document.body.appendChild(moto);
    
    // Sonido opcional (descomentar si tienes el archivo)
    // const audio = new Audio('moto-sound.mp3');
    // audio.volume = 0.3;
    // audio.play().catch(() => {}); // Ignore si no se puede reproducir
    
    setTimeout(() => moto.remove(), 2500);
}

// ========================================
// PANTALLAS DE CONFIRMACIÓN
// ========================================
function mostrarConfirmacion() {
    document.getElementById('formulario').innerHTML = `
        <div class="confirmacion">
            <i class="fas fa-check-circle"></i>
            <h2>¡Pedido Enviado!</h2>
            <p><strong>Gracias por confiar en MotoTaxi Los Famosos</strong></p>
            <p>Tu pedido ha sido enviado a <strong>${CONDUCTORES.length} conductores disponibles</strong></p>
            <p>El primer conductor disponible se contactará contigo en breve.</p>
            <div class="info-espera">
                <i class="fas fa-clock"></i>
                <span>Tiempo de respuesta estimado: 2-5 minutos</span>
            </div>
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
    
    // Cambiar texto del botón
    btnGps.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Obteniendo...';
    btnGps.disabled = true;
    
    ubicacionInput.placeholder = "Obteniendo ubicación...";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                ubicacionInput.value = `📍 Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
                
                // Restaurar botón
                btnGps.innerHTML = '<i class="fas fa-check"></i> Ubicación obtenida';
                setTimeout(() => {
                    btnGps.innerHTML = '<i class="fas fa-location-crosshairs"></i> Usar GPS';
                    btnGps.disabled = false;
                }, 2000);
            },
            (error) => {
                console.error('Error de geolocalización:', error);
                alert("No se pudo obtener tu ubicación. Por favor ingresa tu dirección manualmente.");
                ubicacionInput.placeholder = "Ej: Av. Principal 123, Zona Central";
                
                // Restaurar botón
                btnGps.innerHTML = '<i class="fas fa-location-crosshairs"></i> Usar GPS';
                btnGps.disabled = false;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
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
    // Cargar datos guardados
    const nombreGuardado = localStorage.getItem("nombreClienteMototaxi");
    const telefonoGuardado = localStorage.getItem("telefonoClienteMototaxi");
    
    if (nombreGuardado) {
        document.getElementById("nombre").value = nombreGuardado;
    }
    if (telefonoGuardado) {
        document.getElementById("telefono").value = telefonoGuardado;
    }
    
    // Limpiar pedidos antiguos (más de 30 minutos)
    limpiarPedidosAntiguos();
});

function limpiarPedidosAntiguos() {
    const pedidos = JSON.parse(localStorage.getItem('pedidosActivos') || '{}');
    const ahora = Date.now();
    const limite = 30 * 60 * 1000; // 30 minutos
    
    Object.keys(pedidos).forEach(id => {
        if (ahora - pedidos[id].timestamp > limite) {
            delete pedidos[id];
        }
    });
    
    localStorage.setItem('pedidosActivos', JSON.stringify(pedidos));
}

// ========================================
// FUNCIONES ADICIONALES PARA DEBUGGING
// ========================================
function mostrarEstadisticas() {
    const pedidos = JSON.parse(localStorage.getItem('pedidosActivos') || '{}');
    console.log('Pedidos activos:', Object.keys(pedidos).length);
    console.log('Conductores configurados:', CONDUCTORES.length);
    console.log('URL base:', URL_BASE);
}

// Función para testing (puedes eliminarla en producción)
function testearEnvio() {
    console.log('Testeando envío...');
    enviarATodosConductores('Test Usuario', '+59171111111', 'Ubicación de prueba', 'test123');
}