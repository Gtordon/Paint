const canvas = document.getElementById('paint');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color');
const sizeInput = document.getElementById('size');
const clearBtn = document.getElementById('clear');
const saveBtn = document.getElementById('save');

let drawing = false;
let ratio = window.devicePixelRatio || 1;

function resizeCanvas(){
	ratio = window.devicePixelRatio || 1;
	const rect = canvas.getBoundingClientRect();
	canvas.width = Math.max(1, Math.floor(rect.width * ratio));
	canvas.height = Math.max(1, Math.floor(rect.height * ratio));
	ctx.setTransform(1,0,0,1,0,0);
	ctx.scale(ratio, ratio);
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	// fondo blanco inicial
	ctx.fillStyle = '#ffffff';
	ctx.fillRect(0,0,rect.width,rect.height);
}

window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

function getPos(e){
	const rect = canvas.getBoundingClientRect();
	if(e.touches && e.touches[0]){
		return {x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top};
	}
	return {x: e.clientX - rect.left, y: e.clientY - rect.top};
}

function start(e){
	e.preventDefault();
	drawing = true;
	const p = getPos(e);
	ctx.beginPath();
	ctx.moveTo(p.x, p.y);
	ctx.strokeStyle = colorPicker.value;
	ctx.lineWidth = Number(sizeInput.value);
}

function move(e){
	if(!drawing) return;
	e.preventDefault();
	const p = getPos(e);
	ctx.lineTo(p.x, p.y);
	ctx.stroke();
}

function end(e){
	if(!drawing) return;
	e && e.preventDefault();
	drawing = false;
	ctx.closePath();
}

canvas.addEventListener('mousedown', start);
canvas.addEventListener('mousemove', move);
canvas.addEventListener('mouseup', end);
canvas.addEventListener('mouseleave', end);

canvas.addEventListener('touchstart', start, {passive:false});
canvas.addEventListener('touchmove', move, {passive:false});
canvas.addEventListener('touchend', end);

clearBtn.addEventListener('click', ()=>{
	const rect = canvas.getBoundingClientRect();
	ctx.setTransform(1,0,0,1,0,0);
	ctx.clearRect(0,0,canvas.width,canvas.height);
	resizeCanvas();
});

saveBtn.addEventListener('click', ()=>{
	const data = canvas.toDataURL('image/png');
	const link = document.createElement('a');
	link.href = data;
	link.download = 'paint.png';
	link.click();
});

