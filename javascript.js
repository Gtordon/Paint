// ----------------- SELECCIÓN DE ELEMENTOS -----------------
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color');
const brushSize = document.getElementById('size');

// ----------------- VARIABLES DE CONTROL -----------------
let painting = false;
let currentTool = 'line'; // 'line' o 'circle'
let startX = 0, startY = 0;
let snapshot = null;

// ----------------- AJUSTE DEL CANVAS -----------------
function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);
}
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

// ----------------- FUNCIÓN PARA POSICIÓN DEL RATÓN -----------------
function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches[0]) {
        return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

// ----------------- BOTONES PARA HERRAMIENTAS -----------------
document.getElementById('lineBtn').addEventListener('click', () => currentTool = 'line');
document.getElementById('circleBtn').addEventListener('click', () => currentTool = 'circle');

// ----------------- EVENTOS DEL CANVAS -----------------
function start(e) {
    e.preventDefault();
    painting = true;
    const p = getPos(e);
    startX = p.x;
    startY = p.y;

    ctx.strokeStyle = colorPicker.value;
    ctx.fillStyle = colorPicker.value;
    ctx.lineWidth = Number(brushSize.value);
    ctx.lineCap = 'round';

    if (currentTool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
    } else if (currentTool === 'circle') {
        // Guardamos la imagen actual para poder “arrastrar” el círculo sin borrar lo demás
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
}

function move(e) {
    if (!painting) return;
    e.preventDefault();
    const p = getPos(e);

    if (currentTool === 'line') {
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    } else if (currentTool === 'circle') {
        ctx.putImageData(snapshot, 0, 0);

        let dx = (p.x - startX) ** 2;
        let dy = (p.y - startY) ** 2;
        let radio = Math.sqrt(dx + dy);

        // ----------------- ESTE ES EL CÍRCULO (mientras arrastras) -----------------
        ctx.beginPath();
        ctx.arc(startX, startY, radio, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
    }
}

function end(e) {
    if (!painting) return;
    e && e.preventDefault();
    painting = false;

    if (currentTool === 'line') {
        ctx.closePath();
    } else if (currentTool === 'circle') {
        const p = getPos(e);
        let dx = (p.x - startX) ** 2;
        let dy = (p.y - startY) ** 2;
        let radio = Math.sqrt(dx + dy);

        // ----------------- ESTE ES EL CÍRCULO (al soltar) -----------------
        ctx.beginPath();
        ctx.arc(startX, startY, radio, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
    }
}

// ----------------- ESCUCHAR EVENTOS -----------------
canvas.addEventListener('mousedown', start);
canvas.addEventListener('mousemove', move);
canvas.addEventListener('mouseup', end);
canvas.addEventListener('mouseleave', end);
