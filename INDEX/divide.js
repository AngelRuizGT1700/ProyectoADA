// Divide y vencerás - ejemplo: merge sort animado minimalista con GSAP

const fileInput = document.getElementById('fileInput');
const inputArray = document.getElementById('inputArray');
const startBtn = document.getElementById('startBtn');
const animationArea = document.getElementById('animationArea');

function parseInput(text) {
  // Convierte string a array de números, filtrando errores
  return text
    .split(/[\s,]+/)
    .map(n => parseInt(n))
    .filter(n => !isNaN(n));
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = err => reject(err);
    reader.readAsText(file);
  });
}

function clearAnimation() {
  animationArea.innerHTML = '';
}

function createArrayElements(arr) {
  clearAnimation();
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.justifyContent = 'center';
  container.style.gap = '10px';
  container.style.flexWrap = 'wrap';

  arr.forEach(num => {
    const elem = document.createElement('div');
    elem.textContent = num;
    elem.style.width = '40px';
    elem.style.height = '40px';
    elem.style.backgroundColor = '#007bff';
    elem.style.color = 'white';
    elem.style.fontWeight = '700';
    elem.style.display = 'flex';
    elem.style.justifyContent = 'center';
    elem.style.alignItems = 'center';
    elem.style.borderRadius = '8px';
    container.appendChild(elem);
  });

  animationArea.appendChild(container);
  return container.children;
}

// Función para animar merge sort (divide y vencerás)
async function mergeSortAnimation(arr, start, end, elems) {
  if (start >= end) return;

  const mid = Math.floor((start + end) / 2);

  // Marcar parte actual
  highlightRange(elems, start, end, '#66b2ff');

  await mergeSortAnimation(arr, start, mid, elems);
  await mergeSortAnimation(arr, mid + 1, end, elems);

  await merge(arr, start, mid, end, elems);
}

function highlightRange(elems, start, end, color) {
  for (let i = 0; i < elems.length; i++) {
    elems[i].style.backgroundColor = i >= start && i <= end ? color : '#007bff';
  }
}

function merge(arr, start, mid, end, elems) {
  return new Promise(resolve => {
    let left = arr.slice(start, mid + 1);
    let right = arr.slice(mid + 1, end + 1);

    let i = 0, j = 0, k = start;
    const animationInterval = 800;

    const interval = setInterval(() => {
      if (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
          arr[k] = left[i];
          elems[k].textContent = left[i];
          i++;
        } else {
          arr[k] = right[j];
          elems[k].textContent = right[j];
          j++;
        }
      } else if (i < left.length) {
        arr[k] = left[i];
        elems[k].textContent = left[i];
        i++;
      } else if (j < right.length) {
        arr[k] = right[j];
        elems[k].textContent = right[j];
        j++;
      }
      highlightRange(elems, start, end, '#3399ff');

      k++;
      if (k > end) {
        clearInterval(interval);
        resolve();
      }
    }, animationInterval);
  });
}

startBtn.addEventListener('click', async () => {
  let arr = [];

  if (fileInput.files.length > 0) {
    try {
      const text = await readFile(fileInput.files[0]);
      arr = parseInput(text);
    } catch {
      alert('Error al leer el archivo.');
      return;
    }
  } else {
    arr = parseInput(inputArray.value);
  }

  if (arr.length === 0) {
    alert('Por favor, ingrese un arreglo válido.');
    return;
  }

  const elems = createArrayElements(arr);

  // Iniciar animación merge sort
  await mergeSortAnimation(arr, 0, arr.length - 1, elems);

  alert('Animación completa!');
});

document.getElementById('backBtn').addEventListener('click', () => {
  window.location.href = 'index.html';
});
