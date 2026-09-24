const visorAtual = document.getElementById('visorAtual');
const visorAnterior = document.getElementById('visorAnterior');
const teclas = document.querySelectorAll('.tecla');

let numeroAtual = '0';
let numeroAnterior = '';
let operador = null;
let resetarProximaEntrada = false;

const simbolos = { somar: '+', subtrair: '−', multiplicar: '×', dividir: '÷' };

function atualizarVisor() {
    visorAtual.textContent = numeroAtual;
    visorAnterior.textContent = (numeroAnterior && operador)
        ? `${numeroAnterior} ${simbolos[operador]}`
        : '';
}

function inserirNumero(numero) {
    if (resetarProximaEntrada) {
        numeroAtual = '0';
        resetarProximaEntrada = false;
    }
    if (numero === '.' && numeroAtual.includes('.')) return;
    numeroAtual = (numeroAtual === '0' && numero !== '.')
        ? numero
        : numeroAtual + numero;
}

function definirOperador(novoOperador) {
    if (operador && !resetarProximaEntrada) calcular();
    numeroAnterior = numeroAtual;
    operador = novoOperador;
    resetarProximaEntrada = true;
}

function calcular() {
    const anterior = parseFloat(numeroAnterior);
    const atual = parseFloat(numeroAtual);
    if (isNaN(anterior) || isNaN(atual) || !operador) return;

    let resultado;
    switch (operador) {
        case 'somar': resultado = anterior + atual; break;
        case 'subtrair': resultado = anterior - atual; break;
        case 'multiplicar': resultado = anterior * atual; break;
        case 'dividir': resultado = atual === 0 ? 'Erro' : anterior / atual; break;
        default: return;
    }

    numeroAtual = typeof resultado === 'number'
        ? (Math.round(resultado * 1e10) / 1e10).toString()
        : resultado;
    operador = null;
    numeroAnterior = '';
    resetarProximaEntrada = true;
}

function limparTudo() {
    numeroAtual = '0';
    numeroAnterior = '';
    operador = null;
    resetarProximaEntrada = false;
}

function apagarUltimo() {
    numeroAtual = numeroAtual.length > 1 ? numeroAtual.slice(0, -1) : '0';
}

function calcularPorcentagem() {
    numeroAtual = (parseFloat(numeroAtual) / 100).toString();
}

teclas.forEach(tecla => {
    tecla.addEventListener('click', () => {
        const { numero, acao } = tecla.dataset;

        if (numero !== undefined) {
            inserirNumero(numero);
        } else if (['somar', 'subtrair', 'multiplicar', 'dividir'].includes(acao)) {
            definirOperador(acao);
        } else if (acao === 'limpar') {
            limparTudo();
        } else if (acao === 'apagar') {
            apagarUltimo();
        } else if (acao === 'porcentagem') {
            calcularPorcentagem();
        } else if (acao === 'igual') {
            calcular();
        }
        atualizarVisor();
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') inserirNumero(e.key);
    else if (e.key === '.') inserirNumero('.');
    else if (e.key === '+') definirOperador('somar');
    else if (e.key === '-') definirOperador('subtrair');
    else if (e.key === '*') definirOperador('multiplicar');
    else if (e.key === '/') { e.preventDefault(); definirOperador('dividir'); }
    else if (e.key === 'Enter' || e.key === '=') calcular();
    else if (e.key === 'Backspace') apagarUltimo();
    else if (e.key === 'Escape') limparTudo();
    else return;
    atualizarVisor();
});
