// Obtener ID del pedido desde la URL
const urlParams = new URLSearchParams(window.location.search);
const pedidoId = urlParams.get('id');

if (!pedidoId) {
    document.getElementById('contenido').innerHTML = `
        <div class="viaje-tomado">
            <h3><i class="fas fa-exclamation-triangle"></i> Error</h3>
            <p>No se encontró el ID del pedido.</p>
        </div>
    `;
}

function confirmarViaje() {
    const nombreConductor = document.getElementById('nombreConductor').value.trim();
    const telefonoConductor = document.getElementById('telefonoConductor').value.trim();
    
    if (!nombreConductor || !telefonoConductor) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    // Simular confirmación (en un sistema real, esto iría a una base de datos)
    const confirmacion = {
        pedidoId: pedidoId,
        conductor: nombreConductor,
        telefono: telefonoConductor,
        timestamp: Date.now()
    };
    
    // Guardar en localStorage (temporal)
    localStorage.setItem(`viaje_${pedidoId}`, JSON.stringify(confirmacion));
    
    // Mostrar confirmación
    document.getElementById('contenido').innerHTML = `
        <div class="viaje-confirmado">
            <h3><i class="fas fa-check-circle"></i> ¡Viaje Confirmado!</h3>
            <p><strong>Conductor:</strong> ${nombreConductor}</p>
            <p><strong>Teléfono:</strong> ${telefonoConductor}</p>
            <p>Ya puedes contactar al cliente y dirigirte a recogerlo.</p>
            <button class="btn-volver" onclick="window.close()">
                <i class="fas fa-times"></i> Cerrar
            </button>
        </div>
    `;
    
    // Opcional: Enviar notificación al cliente de que ya tiene conductor
    setTimeout(() => {
        const mensaje = `✅ ¡Excelente! Tu conductor ${nombreConductor} (${telefonoConductor}) ya tomó tu viaje y se dirigirá a recogerte. ¡Gracias por usar MotoTaxi Los Famosos!`;
        // Aquí podrías enviar el mensaje al cliente si tuvieras su número
    }, 1000);
}