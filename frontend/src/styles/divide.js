document.addEventListener("DOMContentLoaded", () => {
  const inputArray = document.getElementById("inputArray");
  const fileInput = document.getElementById("fileInput");
  const startBtn = document.getElementById("startBtn");
  const animationArea = document.getElementById("animationArea");
  const resetBtn = document.getElementById("resetBtn");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const statsBox = document.getElementById("statsBox");
  const clearFileBtn = document.getElementById("clearFileBtn");

  let originalArray = [];
  let startTime;
  let stepCount = 0;

  // Leer archivo .txt o .csv
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      inputArray.value = event.target.result.trim();
    };
    reader.readAsText(file);
  });
  
  clearFileBtn.addEventListener("click", () => {
  fileInput.value = "";
  inputArray.value = "";
  animationArea.innerHTML = "";
  statsBox.textContent = "";
  originalArray = [];
  hideButtons();
  });

  // Botón de iniciar
  startBtn.addEventListener("click", async () => {
    const input = inputArray.value.trim();
    if (!input) return alert("Ingresa números separados por comas.");
    const numbers = input.split(",").map((x) => parseFloat(x.trim()));
    if (numbers.some(isNaN)) return alert("Solo se permiten números válidos.");

    originalArray = [...numbers];
    animationArea.innerHTML = "";
    statsBox.textContent = "";
    hideButtons();

    const elements = numbers.map((num) => {
      const box = document.createElement("div");
      box.textContent = num;
      animationArea.appendChild(box);
      return box;
    });

    startTime = performance.now();
    stepCount = 0;

    await mergeSort(numbers, 0, numbers.length - 1, elements);

    highlightSorted(elements);
    await pulse(elements);
    mostrarBotonesFinales();
  });

  // Botón de reiniciar (reset)
  resetBtn.addEventListener("click", () => {
    animationArea.innerHTML = "";
    statsBox.textContent = "";
    inputArray.value = originalArray.join(", ");
    hideButtons();
  });

  // Botón de copiar arreglo
  copyBtn.addEventListener('click', () => {
    if (originalArray.length === 0) {
      alert('No hay arreglo para copiar.');
      return;
    }
    const textToCopy = originalArray.join(', ');
    navigator.clipboard.writeText(textToCopy)
      .then(() => alert('Arreglo copiado al portapapeles!'))
      .catch(err => alert('Error al copiar: ' + err));
  });

  // Descargar TXT
downloadBtn.addEventListener('click', () => {
  const elems = animationArea.querySelectorAll('div');
  if (elems.length === 0) {
    alert('No hay arreglo para descargar.');
    return;
  }

  const sortedArr = Array.from(elems).map(e => e.textContent);
  const originalStr = originalArray && originalArray.length ? originalArray.join(', ') : 'N/A';
  const duration = startTime ? ((performance.now() - startTime) / 1000).toFixed(2) : 'N/A';
  const steps = typeof stepCount !== 'undefined' ? stepCount : 'N/A';

  let content = '--- Arreglo Ordenado - Merge Sort ---\n';
  content += `Fecha: ${new Date().toLocaleString()}\n`;
  content += `Duración de la animación: ${duration} segundos\n`;
  content += `Número total de pasos: ${steps}\n\n`;
  content += 'Arreglo original:\n';
  content += originalStr + '\n\n';
  content += 'Arreglo ordenado:\n';
  content += sortedArr.join(', ') + '\n';

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'arreglo_ordenado.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});


  // Función Merge Sort animada
  async function mergeSort(arr, start, end, elements) {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);

    await mergeSort(arr, start, mid, elements);
    await mergeSort(arr, mid + 1, end, elements);
    await merge(arr, start, mid, end, elements);
  }

async function merge(arr, start, mid, end, elements) {
  const left = arr.slice(start, mid + 1);
  const right = arr.slice(mid + 1, end + 1);
  let i = 0, j = 0, k = start;

  while (i < left.length && j < right.length) {
    stepCount++;

    // Destacar ambos elementos que se comparan
    elements[start + i].style.transition = "background-color 0.3s, border 0.3s";
    elements[mid + 1 + j].style.transition = "background-color 0.3s, border 0.3s";
    
    elements[start + i].style.backgroundColor = "#ffcc00"; // amarillo
    elements[start + i].style.border = "3px solid #ff9900";

    elements[mid + 1 + j].style.backgroundColor = "#ffcc00";
    elements[mid + 1 + j].style.border = "3px solid #ff9900";

    await delay(600);

    if (left[i] <= right[j]) {
      arr[k] = left[i];
      elements[k].textContent = left[i];

      // Resaltar el lugar donde se colocó el elemento
      elements[k].style.backgroundColor = "#28a745"; // verde
      elements[k].style.border = "3px solid #1e7e34";

      i++;
    } else {
      arr[k] = right[j];
      elements[k].textContent = right[j];

      elements[k].style.backgroundColor = "#28a745"; // verde
      elements[k].style.border = "3px solid #1e7e34";

      j++;
    }

    // Quitar resaltado de comparación
    elements[start + i - (left[i-1] !== undefined ? 1 : 0)].style.backgroundColor = "#f1f1f1";
    elements[start + i - (left[i-1] !== undefined ? 1 : 0)].style.border = "none";

    elements[mid + 1 + j - (right[j-1] !== undefined ? 1 : 0)].style.backgroundColor = "#f1f1f1";
    elements[mid + 1 + j - (right[j-1] !== undefined ? 1 : 0)].style.border = "none";

    // Pequeña pausa para que se note el cambio
    await delay(300);

    k++;
  }

  while (i < left.length) {
    stepCount++;
    elements[k].style.transition = "background-color 0.3s, border 0.3s";
    elements[k].style.backgroundColor = "#28a745";
    elements[k].style.border = "3px solid #1e7e34";
    await delay(300);

    arr[k] = left[i];
    elements[k].textContent = left[i];

    elements[k].style.backgroundColor = "#f1f1f1";
    elements[k].style.border = "none";
    i++; k++;
  }

  while (j < right.length) {
    stepCount++;
    elements[k].style.transition = "background-color 0.3s, border 0.3s";
    elements[k].style.backgroundColor = "#28a745";
    elements[k].style.border = "3px solid #1e7e34";
    await delay(300);

    arr[k] = right[j];
    elements[k].textContent = right[j];

    elements[k].style.backgroundColor = "#f1f1f1";
    elements[k].style.border = "none";
    j++; k++;
  }
}

  // Efecto de pulso al finalizar
  async function pulse(elements) {
    for (let el of elements) {
      el.classList.add("sorted");
      await delay(80);
    }
  }

  function highlightSorted(elements) {
    elements.forEach((el, idx) => {
      setTimeout(() => {
        el.style.transition = "background-color 0.3s, color 0.3s";
        el.style.backgroundColor = "#28a745"; // Verde final
        el.style.color = "#fff";
      }, idx * 80);
    });
  }

  function mostrarBotonesFinales() {
    resetBtn.style.display = "inline-block";
    copyBtn.style.display = "inline-block";
    downloadBtn.style.display = "inline-block";

    const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
    statsBox.textContent = `Ordenado en ${elapsed} segundos con ${stepCount} pasos.`;
  }

  function hideButtons() {
    resetBtn.style.display = "none";
    copyBtn.style.display = "none";
    downloadBtn.style.display = "none";
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
});

