(function () {
  "use strict";

  const PAGINAS = window.MUESTRA.paginas;
  const TOTAL = PAGINAS.length;
  const TOTAL_HOJAS = Math.ceil(TOTAL / 2);
  const DURACION = 800;
  const MITAD = DURACION * 0.5;

  const libro      = document.getElementById("libro");
  const vistaMovil = document.getElementById("vista-movil");
  const progreso   = document.getElementById("progreso");
  const indicador  = document.getElementById("indicador");
  const btnPrev    = document.getElementById("anterior");
  const btnNext    = document.getElementById("siguiente");

  let modo = "libro";
  let posH = 0;
  let posM = 0;
  let hojas = [];
  let animando = false;

  function render(p) {
    if (!p) return '<div class="pagina pagina--vacia" style="background:transparent; box-shadow:none;"></div>';
    const parrafos = (p.parrafos || []).map(t => `<p>${t}</p>`).join("");

    switch (p.tipo) {
      case "cubierta": return `<div class="pagina pagina--cubierta"><p class="cub__kicker">EXPEDIENTE CLASIFICADO</p><h2 class="cub__titulo">ITAUE</h2><p class="cub__sub">LO QUE EL TIEMPO<br>ESCUPIÓ</p><p class="cub__autor">${window.MUESTRA.autoria || ""}</p></div>`;
      case "nota": return `<div class="pagina pagina--nota"><p class="etiqueta">DOCUMENTO NO CLASIFICADO</p><p>${p.texto}</p></div>`;
      case "portadilla": return `<div class="pagina" style="align-items:center; justify-content:center; text-align:center;"><p class="pagina__titulo" style="font-size:2.5rem; margin-bottom:0.5rem;">${p.titulo}</p><p class="pagina__numero">${p.sub}</p><p style="font-style:italic; color:var(--sangre); margin-top:3rem;">${p.frase}</p></div>`;
      case "texto": return `<div class="pagina pagina--texto"><p class="pagina__numero">${p.numero || ""}</p><h3 class="pagina__titulo">${p.titulo || ""}</h3>${parrafos}</div>`;
      case "cierre": return `<div class="pagina" style="align-items:center; justify-content:center; text-align:center; font-style:italic; font-size:1.3rem; line-height:1.8; color:#333;">${p.texto.replace(/\n/g, "<br>")}</div>`;
      case "creditos": return `<div class="pagina" style="justify-content:flex-end; font-family:var(--mono); font-size:0.8rem; color:#555;">${parrafos}</div>`;
      default: return `<div class="pagina">${parrafos}</div>`;
    }
  }

  function construirLibro() {
    Array.prototype.forEach.call(libro.querySelectorAll(".hoja"), n => n.remove());
    hojas = [];
    for (let i = 0; i < TOTAL_HOJAS; i++) {
      const hoja = document.createElement("div");
      hoja.className = "hoja";
      hoja.style.zIndex = String(TOTAL_HOJAS - i + 10);
      const frente = render(PAGINAS[i * 2]);
      const dorso  = render(PAGINAS[i * 2 + 1]);
      hoja.innerHTML = `<div class="cara frente">${frente}</div><div class="cara dorso">${dorso}</div>`;
      hoja.addEventListener("click", e => {
        const r = hoja.getBoundingClientRect();
        if (e.clientX - r.left > r.width / 2) siguiente(); else anterior();
      });
      libro.appendChild(hoja);
      hojas.push(hoja);
    }
    hojas.forEach((h, i) => { if (i < posH) { h.classList.add("volteada"); h.style.zIndex = String(i + 1); } });
  }

  function pintarMovil(direccion) {
    let claseAnim = direccion === "siguiente" ? "anim-next" : (direccion === "anterior" ? "anim-prev" : "");
    vistaMovil.innerHTML = `<article class="pagina-movil ${claseAnim}">${render(PAGINAS[posM])}</article>`;
  }

  function siguiente() {
    if (animando) return;
    if (window.ITAUE_AUDIO) window.ITAUE_AUDIO.playPageTurn();
    if (window.ITAUE_EFECTOS && Math.random() > 0.7) window.ITAUE_EFECTOS.triggerGlitch();

    if (modo === "libro") {
      if (posH >= TOTAL_HOJAS) return;
      animando = true;
      const hoja = hojas[posH];
      hoja.classList.add("volteada");
      setTimeout(() => { hoja.style.zIndex = String(posH + 1); }, MITAD);
      setTimeout(() => { animando = false; }, DURACION);
      posH++;
    } else {
      if (posM >= TOTAL - 1) return;
      posM++; pintarMovil("siguiente");
    }
    actualizar();
  }

  function anterior() {
    if (animando) return;
    if (window.ITAUE_AUDIO) window.ITAUE_AUDIO.playPageTurn();

    if (modo === "libro") {
      if (posH <= 0) return;
      animando = true;
      const hoja = hojas[posH - 1];
      hoja.style.zIndex = String(TOTAL_HOJAS - (posH - 1) + 10);
      hoja.classList.remove("volteada");
      setTimeout(() => { animando = false; }, DURACION);
      posH--;
    } else {
      if (posM <= 0) return;
      posM--; pintarMovil("anterior");
    }
    actualizar();
  }

  function actualizar() {
    if (modo === "libro") {
      progreso.textContent = posH === 0 ? `Página 1 de ${TOTAL}` : `Páginas ${posH * 2}–${posH * 2 + 1} de ${TOTAL}`;
      btnPrev.disabled = posH <= 0; btnNext.disabled = posH >= TOTAL_HOJAS;
      indicador.textContent = `${posH + 1} / ${TOTAL_HOJAS + 1}`;
    } else {
      progreso.textContent = `Página ${posM + 1} de ${TOTAL}`;
      btnPrev.disabled = posM <= 0; btnNext.disabled = posM >= TOTAL - 1;
      indicador.textContent = `${posM + 1} / ${TOTAL}`;
    }
  }

  let xInicio = null, yInicio = null;
  document.addEventListener("touchstart", e => { if (modo === "movil") { xInicio = e.touches[0].clientX; yInicio = e.touches[0].clientY; } }, { passive: true });
  document.addEventListener("touchend", e => {
    if (modo !== "movil" || xInicio === null) return;
    const dx = e.changedTouches[0].clientX - xInicio;
    if (Math.abs(dx) > 50) { if (dx < 0) siguiente(); else anterior(); }
    xInicio = null;
  }, { passive: true });
  document.addEventListener("keydown", e => { if (e.key === "ArrowRight" || e.key === " ") siguiente(); if (e.key === "ArrowLeft") anterior(); });
  btnNext.addEventListener("click", siguiente); btnPrev.addEventListener("click", anterior);

  function init() {
    const movil = window.innerWidth <= 820;
    modo = movil ? "movil" : "libro";
    document.body.classList.toggle("modo-movil", movil);
    if (movil) pintarMovil("inicial"); else construirLibro();
    actualizar();

    // INICIALIZAR EXTRAS
    if (window.ITAUE_EFECTOS) window.ITAUE_EFECTOS.initParticles();
    if (window.ITAUE_ORACULO) window.ITAUE_ORACULO.init();
    
    // EVENTO BOTÓN AUDIO
    const btnAudio = document.getElementById('btn-audio');
    if (btnAudio && window.ITAUE_AUDIO) {
      btnAudio.addEventListener('click', () => {
        const muted = window.ITAUE_AUDIO.toggleMute();
        btnAudio.textContent = muted ? '🔇' : '🔊';
      });
    }
  }

  init();
})();
