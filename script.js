let listaSorteados = [];
const cubo1 = document.getElementById('cube1');
const cubo2 = document.getElementById('cube2');
const btnSortear = document.getElementById('btnSortear');
const resultadoDisplay = document.getElementById('currentResult');

const listaCores = ['color-default', 'color-red', 'color-green', 'color-blue', 'color-purple'];

// --- SOM SINTETIZADO (Não depende de arquivos externos) ---
function tocarSomBeep() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine'; 
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.2);

        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
        console.log("AudioContext não suportado");
    }
}

function ativarSom() {
    document.getElementById('btnAtivarSom').innerText = "✅ SOM PRONTO";
    document.getElementById('btnAtivarSom').style.background = "#2E7D32";
    tocarSomBeep();
}

function sortear() {
    const min = Math.ceil(document.getElementById('min').value);
    const max = Math.floor(document.getElementById('max').value);
    const naoRepetir = document.getElementById('noRepeat').checked;

    if (min >= max) {
        alert("O número mínimo precisa ser menor que o máximo!");
        return;
    }

    const totalPossibilidades = max - min + 1;
    if (naoRepetir && listaSorteados.length >= totalPossibilidades) {
        alert("Todos os números já sorteados!");
        return;
    }

    tocarSomBeep();

    btnSortear.disabled = true;
    btnSortear.innerText = "Sorteando...";

    [cubo1, cubo2].forEach(c => {
        listaCores.forEach(cor => c.classList.remove(cor));
        const corAleatoria = listaCores[Math.floor(Math.random() * listaCores.length)];
        c.classList.add(corAleatoria);
        c.classList.remove('idle');
        c.classList.add('spinning');
    });

    resultadoDisplay.classList.remove('animate');
    resultadoDisplay.innerText = "?";

    let numeroGerado;
    if (naoRepetir) {
        do {
            numeroGerado = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (listaSorteados.includes(numeroGerado));
    } else {
        numeroGerado = Math.floor(Math.random() * (max - min + 1)) + min;
    }

    setTimeout(() => {
        [cubo1, cubo2].forEach(c => {
            c.classList.remove('spinning');
            c.classList.add('idle');
        });

        listaSorteados.push(numeroGerado);
        resultadoDisplay.innerText = numeroGerado;
        resultadoDisplay.classList.add('animate');

        document.getElementById('historyList').innerText = listaSorteados.join(', ');
        btnSortear.disabled = false;
        btnSortear.innerText = "Sortear";
    }, 600);
}

function limpar() {
    listaSorteados = [];
    resultadoDisplay.innerText = "-";
    resultadoDisplay.classList.remove('animate');
    document.getElementById('historyList').innerText = "-";

    [cubo1, cubo2].forEach(c => {
        listaCores.forEach(cor => c.classList.remove(cor));
        c.classList.add('color-default');
        c.classList.remove('spinning');
        c.classList.add('idle');
    });
}
// Registro do Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registrado!'))
            .catch(err => console.log('Falha ao registrar SW', err));
    });
}

// ... (mantenha todo o restante do seu código de sorteio, som e limpar abaixo)