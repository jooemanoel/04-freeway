// Primeiro, obtenha uma referência ao elemento canvas
var tela = document.getElementById('tela');
var ctx = tela.getContext('2d');

// Variáveis
var score = 0, deaths = 0;
var listaCarros = [];
var panda = { x: 0, y: 0, speed: 5};
var imgCarro = new Image();
imgCarro.src = 'car.png';
var imgPanda = new Image();
imgPanda.src = 'panda.png';

function iniciarJogo() {
    redimensionarTela();
    criaListaCarros();
    criaPanda();
}

// Função para ajustar a tela do canvas à janela
function redimensionarTela() {
    tela.width = window.innerWidth - 20;
    tela.height = window.innerHeight - 20;
}

function criaListaCarros() {
    var rx = 0, ry = 0;
    for (let i = 0; i < 10; i++) {
        rx = Math.floor(Math.random() * Math.floor(tela.width / imgCarro.width));
        ry = Math.floor(Math.random() * 4);
        var carro = {
            x: rx * imgCarro.width,
            y: tela.height * 0.2 * ry + tela.height / 8 - imgCarro.height / 2 + tela.height * 0.2,
            speed: Math.floor(Math.random() * 3 + 4),
            dy: ry
        };
        listaCarros.push(carro);
    }
}

function criaPanda() {
    panda.x = tela.width / 2 - imgPanda.width / 2;
    panda.y = 0;
}

function desenhaRua() {
    for (let j = 1; j < 4; j++) {
        for (let i = 0; i * 100 < tela.width; i++) {
            ctx.fillStyle = 'yellow';
            ctx.fillRect(i * 100, (tela.height / 5) * j - 5 + tela.height / 5, 80, 10);
        }
    }
}

function desenharListaCarros() {
    for (let i = 0; i < listaCarros.length; i++) {
        ctx.drawImage(imgCarro, listaCarros[i].x, listaCarros[i].y);
    }
}

function desenharPanda() {
    ctx.drawImage(imgPanda, panda.x, panda.y);
}

function desenharInfo(){
    ctx.font = 'bold 30px Courier New';
    ctx.fillText('SCORE: ' + score, 30, 30);
    ctx.fillText('DEATHS: ' + deaths, tela.width - 200, 30);
}

function desenharTela() {
    ctx.clearRect(0, 0, tela.width, tela.height);
    desenhaRua();
    desenharListaCarros();
    desenharPanda();
    desenharInfo();
}

function moveListaCarros() {
    for (let i = 0; i < listaCarros.length; i++) {
        if(listaCarros[i].dy % 2){
            listaCarros[i].x += listaCarros[i].speed;
            if (listaCarros[i].x > tela.width) {
                listaCarros[i].x = -imgCarro.width;
                ry = Math.floor(Math.random() * 4);
                listaCarros[i].y = tela.height * 0.2 * ry + tela.height / 8 - imgCarro.height / 2 + tela.height * 0.2;
            }
        }
        else{
            listaCarros[i].x -= listaCarros[i].speed;
            if (listaCarros[i].x + imgCarro.width < 0) {
                listaCarros[i].x = tela.width;
                ry = Math.floor(Math.random() * 4);
                listaCarros[i].y = tela.height * 0.2 * ry + tela.height / 8 - imgCarro.height / 2 + tela.height * 0.2;
            }
        }
    }
}

function movePanda() {
    if (teclasPressionadas["ArrowUp"] && panda.y > 0) {
        panda.y -= panda.speed;
        if (panda.y < 0) panda.y = 0;
    }
    if (teclasPressionadas["ArrowDown"] && panda.y < tela.height - imgPanda.height) {
        panda.y += panda.speed;
        if (panda.y > tela.height - imgPanda.height){
            score++;
            panda.y = 0;
        }
    }
    if (teclasPressionadas["ArrowLeft"] && panda.x > 0) {
        panda.x -= panda.speed;
        if (panda.x < 0) panda.x = 0;
    }
    if (teclasPressionadas["ArrowRight"] && panda.x < tela.width - imgPanda.width) {
        panda.x += panda.speed;
        if (panda.x > tela.width - imgPanda.width) panda.x = tela.width - imgPanda.width;
    }
}

function checaBatidas(){
    for (let i = 0; i < listaCarros.length; i++) {
        if(bateu(listaCarros[i])){
            deaths++;
            criaPanda();
        }
    }
}

function bateu(carro){
    var bx = false, by = false;
    if(panda.x < carro.x){
        if(panda.x + imgPanda.width > carro.x){
            bx = true;
        }
    }
    if(panda.x > carro.x){
        if(panda.x < carro.x + imgCarro.width){
            bx = true;
        }
    }
    if(panda.y < carro.y){
        if(panda.y + imgPanda.height > carro.y){
            by = true;
        }
    }
    if(panda.y > carro.y){
        if(panda.y < carro.y + imgCarro.height){
            by = true;
        }
    }
    return bx && by;
}

function evoluiJogo() {
    desenharTela();
    moveListaCarros();
    movePanda();
    checaBatidas();
}

var teclasPressionadas = {};

window.addEventListener('keydown', function(event) {
    teclasPressionadas[event.key] = true;
});

window.addEventListener('keyup', function(event) {
    teclasPressionadas[event.key] = false;
});

window.onload = iniciarJogo;
// Atualize a tela a cada 10 milissegundos
setInterval(evoluiJogo, 10);