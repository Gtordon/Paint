const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const brushSize = document.getElementById('size');

let painting = false;
let currentTool = 'line';
let startX = 0;
let startY = 0;
let snapshot = null;

let elementoColor = null;
let currentColor = 'black';

document.addEventListener('DOMContentLoaded', () => {
  elementoColor = document.getElementById('black');
});

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  
  if (imgData) {
    ctx.putImageData(imgData, 0, 0);
  }
}

window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}


document.getElementById('lineBtn').addEventListener('click', () => {
  currentTool = 'line';
  console.log('Herramienta: Línea');
});

document.getElementById('circleBtn').addEventListener('click', () => {
  currentTool = 'circle';
  console.log('Herramienta: Círculo');
});

document.getElementById('clearBtn').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  console.log('Canvas limpiado');
});

function start(e) {
  e.preventDefault();
  painting = true;

  const p = getPos(e);
  startX = p.x;
  startY = p.y;

  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = currentColor;
  ctx.lineWidth = brushSize.value;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (currentTool === 'line') {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
  }
}

function move(e) {
  if (!painting) return;
  e.preventDefault();

  const p = getPos(e);

  if (currentTool === 'line') {
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }

  if (currentTool === 'circle') {
    ctx.putImageData(snapshot, 0, 0);
    
    const dx = p.x - startX;
    const dy = p.y - startY;
    const radius = Math.sqrt(dx * dx + dy * dy);

    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function end(e) {
  if (!painting) return;
  painting = false;

  if (currentTool === 'line') {
    ctx.closePath();
  }
}

canvas.addEventListener('mousedown', start);
canvas.addEventListener('mousemove', move);
canvas.addEventListener('mouseup', end);
canvas.addEventListener('mouseleave', end);

canvas.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent('mousedown', {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent('mousemove', {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchend', (e) => {
  const mouseEvent = new MouseEvent('mouseup', {});
  canvas.dispatchEvent(mouseEvent);
});

function cambiaColor(color) {
  if (elementoColor) {
    elementoColor.classList.remove('activado');
  }

  color.classList.add('activado');
  elementoColor = color;

  currentColor = color.id;
  console.log('Color cambiado a:', currentColor);
}