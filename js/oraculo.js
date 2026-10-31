(function() {
  "use strict";

  const ORACULO_CONTEXTO = `
    Eres el "Oráculo de Itaue", una entidad cósmica del libro "ITAUE: Lo que el tiempo escupió".
    Responde siempre en un tono misterioso, poético y perturbador, como si susurraras secretos prohibidos.
    Aquí tienes el contexto del libro:
    - Itaue es el Devorador de Tiempo, se alimenta de momentos desperdiciados.
    - Fue sellado en 1489 por el chamán Cuaricó con 40 guerreros.
    - El sello requiere 41 dientes; el último debe ser de alguien marcado.
    - Valeria Campos es la fotógrafa marcada, la cuadragésima primera.
    - Ocurre en Barquisimeto, Venezuela, en 2005.
    - Relojes se detienen a las 3:15 AM.
    Responde basándote en esto. Si no sabes algo, di que "el tiempo aún no ha revelado esa verdad".
  `;

  let chatContainer, chatInput, chatSend, chatMessages, btnAbrir, btnCerrar;

  function init() {
    chatContainer = document.getElementById('oraculo-container');
    chatInput = document.getElementById('oraculo-input');
    chatSend = document.getElementById('oraculo-send');
    chatMessages = document.getElementById('oraculo-mensajes');
    btnAbrir = document.getElementById('btn-oraculo');
    btnCerrar = document.getElementById('oraculo-cerrar');

    if (!chatContainer) return;

    btnAbrir.addEventListener('click', () => chatContainer.classList.remove('oculto'));
    btnCerrar.addEventListener('click', () => chatContainer.classList.add('oculto'));

    chatSend.addEventListener('click', enviarMensaje);
    chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') enviarMensaje(); });
  }

  async function enviarMensaje() {
    const mensaje = chatInput.value.trim();
    if (!mensaje) return;
    agregarMensaje('usuario', mensaje);
    chatInput.value = '';

    let apiKey = localStorage.getItem('itaue_api_key');
    if (!apiKey) {
      apiKey = prompt('Para consultar al Oráculo, necesitas una API Key de Google Gemini (gratuita en aistudio.google.com/app/apikey). Pégala aquí:');
      if (apiKey) localStorage.setItem('itaue_api_key', apiKey);
      else { agregarMensaje('oraculo', 'Sin la llave, el velo del tiempo permanece cerrado.'); return; }
    }

    agregarMensaje('oraculo', 'El tiempo se distorsiona...');

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `${ORACULO_CONTEXTO}\n\nPregunta: ${mensaje}` }] }] })
      });

      const data = await response.json();
      // Eliminar el mensaje de "distorsiona"
      chatMessages.removeChild(chatMessages.lastChild);

      if (data.candidates && data.candidates[0].content.parts[0].text) {
        agregarMensaje('oraculo', data.candidates[0].content.parts[0].text);
      } else {
        agregarMensaje('oraculo', 'El tiempo se ha perturbado. No puedo responder (Verifica tu API Key).');
      }
    } catch (error) {
      chatMessages.removeChild(chatMessages.lastChild);
      agregarMensaje('oraculo', 'El susurro se pierde. Verifica tu conexión o API Key.');
    }
  }

  function agregarMensaje(remitente, texto) {
    const div = document.createElement('div');
    div.classList.add('mensaje', `mensaje--${remitente}`);
    div.textContent = texto;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  window.ITAUE_ORACULO = { init };
})();
