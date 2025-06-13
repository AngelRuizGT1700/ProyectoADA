const algorithmData = {
  "Divide y vencerás": "Divide y vencerás es una estrategia que consiste en dividir un problema en subproblemas más pequeños, resolverlos independientemente y combinar sus soluciones para resolver el problema original.",
  "Heurísticas voraces": "Los algoritmos ávidos toman decisiones locales óptimas en cada paso con la esperanza de encontrar la solución global óptima, ideales para problemas de optimización simples.",
  "Programación dinámica": "La programación dinámica resuelve problemas dividiéndolos en subproblemas que se solapan y almacenando sus soluciones para evitar cálculos redundantes, mejorando eficiencia."
};

const buttons = document.querySelectorAll('.btn-link');
const descriptionBox = document.querySelector('.description-box');

if (!descriptionBox) {
  console.error('No se encontró el elemento con id "description" en el DOM');
} else {
  window.addEventListener('load', () => {
    // Si usas GSAP, asegúrate que esté cargado en tu proyecto
    if (typeof gsap !== 'undefined') {
      gsap.from('header', { duration: 1, y: -50, opacity: 0, ease: "power3.out" });
      gsap.from('main', { duration: 1, y: 50, opacity: 0, ease: "power3.out", delay: 0.5 });
    }
  });

  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      // Obtener solo el texto principal sin el span .subtext
      const mainText = btn.childNodes[0].textContent.trim();
      descriptionBox.textContent = algorithmData[mainText] || "Descripción no disponible.";
      descriptionBox.classList.add('visible');
    });

    btn.addEventListener('mouseleave', () => {
      descriptionBox.classList.remove('visible');
    });

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.add('ripple');
      setTimeout(() => btn.classList.remove('ripple'), 600);
      setTimeout(() => {
        const parentLink = btn.closest('a');
        if(parentLink && parentLink.href) {
          window.location.href = parentLink.href;
        }
      }, 300);
    });
  });
}

