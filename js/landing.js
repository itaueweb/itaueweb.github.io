(function () {
  "use strict";

  const anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();

  // Revelar al hacer scroll
  const elementos = document.querySelectorAll(".revelar");
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(entradas => {
      entradas.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    elementos.forEach(el => obs.observe(el));
  } else {
    elementos.forEach(el => el.classList.add("visible"));
  }

  // Efecto sutil en la cabecera
  const cabecera = document.getElementById("cabecera");
  window.addEventListener("scroll", () => {
    if (cabecera) {
      cabecera.style.background = window.scrollY > 50 ? "rgba(5,5,5,0.95)" : "rgba(8,8,10,0.8)";
    }
  }, { passive: true });
})();