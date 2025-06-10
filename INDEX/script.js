const algorithmData = {
  "Divide y vencerás": "Divide y vencerás es una estrategia que consiste en dividir un problema en subproblemas más pequeños, resolverlos independientemente y combinar sus soluciones para resolver el problema original.",
  "Algoritmos ávidos": "Los algoritmos ávidos toman decisiones locales óptimas en cada paso con la esperanza de encontrar la solución global óptima, ideales para problemas de optimización simples.",
  "Programación dinámica": "La programación dinámica resuelve problemas dividiéndolos en subproblemas que se solapan y almacenando sus soluciones para evitar cálculos redundantes, mejorando eficiencia."
};

const buttons = document.querySelectorAll('.btn-link');
const descriptionBox = document.getElementById('description');

if (!descriptionBox) {
  console.error('No se encontró el elemento con id "description" en el DOM');
} else {
  window.addEventListener('load', () => {
    gsap.from('header', { duration: 1, y: -50, opacity: 0, ease: "power3.out" });
    gsap.from('main', { duration: 1, y: 50, opacity: 0, ease: "power3.out", delay: 0.5 });
  });

  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      descriptionBox.textContent = algorithmData[btn.textContent] || "Descripción no disponible.";
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
        window.location.href = btn.href;
      }, 300);
    });
  });
}