/*=========================================
    COMENTÁRIOS DECAPOLIS — VERSÃO PREMIUM
=========================================*/

let avaliacaoSelecionada = 5;
let filtroAtual = "todos";
let ordenacaoAtual = "recentes";

const ROTULOS_NOTA = {
    1: "Fraco",
    2: "Razoável",
    3: "Bom",
    4: "Muito bom",
    5: "Excelente"
};

/*==============================
    ESTRELAS DO FORMULÁRIO
==============================*/
const estrelas = document.querySelectorAll(".estrela");
const rotuloNota = document.getElementById("rotuloNota");

pintarEstrelas(avaliacaoSelecionada);

estrelas.forEach((estrela) => {
    estrela.addEventListener("click", function () {
        avaliacaoSelecionada = Number(this.dataset.value);
        pintarEstrelas(avaliacaoSelecionada);
    });

    estrela.addEventListener("mouseenter", function () {
        pintarEstrelas(Number(this.dataset.value), true);
    });
});

const blocoAvaliacao = document.querySelector(".avaliacao");
if (blocoAvaliacao) {
    blocoAvaliacao.addEventListener("mouseleave", () => pintarEstrelas(avaliacaoSelecionada));
}

function pintarEstrelas(valor, apenasPreview) {
    estrelas.forEach((estrela) => {
        estrela.classList.toggle("ativa", Number(estrela.dataset.value) <= valor);
    });
    if (rotuloNota) rotuloNota.textContent = ROTULOS_NOTA[valor] || "";
}

/*==============================
    CONTADOR DE CARACTERES
==============================*/
const campoComentario = document.getElementById("comentario");
const contadorAtual = document.getElementById("contadorAtual");

if (campoComentario) {
    campoComentario.addEventListener("input", () => {
        contadorAtual.textContent = campoComentario.value.length;
    });
}

/*==============================
    VALIDAÇÃO VISUAL
==============================*/
function marcarInvalido(idCampo, invalido) {
    const campo = document.getElementById(idCampo).closest(".campo");
    campo.classList.toggle("invalido", invalido);
}

/*==============================
    GUARDAR COMENTÁRIO
==============================*/
function guardarComentario() {
    const nomeEl = document.getElementById("nome");
    const comentarioEl = document.getElementById("comentario");
    const nome = nomeEl.value.trim();
    const texto = comentarioEl.value.trim();

    let valido = true;

    if (nome === "") {
        marcarInvalido("nome", true);
        valido = false;
    } else {
        marcarInvalido("nome", false);
    }

    if (texto === "") {
        marcarInvalido("comentario", true);
        valido = false;
    } else {
        marcarInvalido("comentario", false);
    }

    if (!valido) return;

    const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
    const hoje = new Date();
    const data = hoje.toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    comentarios.unshift({
        id: Date.now() + Math.floor(Math.random() * 1000),
        nome,
        comentario: texto,
        estrelas: avaliacaoSelecionada,
        data,
        timestamp: hoje.getTime(),
        util: 0
    });

    localStorage.setItem("comentarios", JSON.stringify(comentarios));

    nomeEl.value = "";
    comentarioEl.value = "";
    contadorAtual.textContent = "0";
    avaliacaoSelecionada = 5;
    pintarEstrelas(5);

    mostrarConfirmacao();
    carregarComentarios();
}

function mostrarConfirmacao() {
    const msg = document.getElementById("mensagemSucesso");
    msg.classList.add("mostrar");
    setTimeout(() => msg.classList.remove("mostrar"), 3500);
}

/*==============================
    FILTROS E ORDENAÇÃO
==============================*/
const filtrosContainer = document.getElementById("filtros");
if (filtrosContainer) {
    filtrosContainer.addEventListener("click", (e) => {
        const botao = e.target.closest(".filtro");
        if (!botao) return;
        document.querySelectorAll(".filtro").forEach((b) => b.classList.remove("ativo"));
        botao.classList.add("ativo");
        filtroAtual = botao.dataset.filtro;
        carregarComentarios();
    });
}

const selectOrdenacao = document.getElementById("ordenacao");
if (selectOrdenacao) {
    selectOrdenacao.addEventListener("change", (e) => {
        ordenacaoAtual = e.target.value;
        carregarComentarios();
    });
}

function aplicarFiltroEOrdenacao(comentarios) {
    let lista = [...comentarios];

    if (filtroAtual !== "todos") {
        lista = lista.filter((c) => Number(c.estrelas) === Number(filtroAtual));
    }

    switch (ordenacaoAtual) {
        case "antigos":
            lista.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
            break;
        case "maior":
            lista.sort((a, b) => b.estrelas - a.estrelas);
            break;
        case "menor":
            lista.sort((a, b) => a.estrelas - b.estrelas);
            break;
        case "util":
            lista.sort((a, b) => (b.util || 0) - (a.util || 0));
            break;
        default: // recentes
            lista.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    }

    return lista;
}

/*==============================
    CARREGAR / RENDERIZAR
==============================*/
function carregarComentarios() {
    const lista = document.getElementById("listaComentarios");
    const estadoVazio = document.getElementById("estadoVazio");
    const tituloVazio = document.getElementById("tituloVazio");
    const textoVazio = document.getElementById("textoVazio");

    const todos = JSON.parse(localStorage.getItem("comentarios")) || [];
    const visiveis = aplicarFiltroEOrdenacao(todos);

    lista.innerHTML = "";

    if (visiveis.length === 0) {
        lista.style.display = "none";
        estadoVazio.style.display = "block";
        if (todos.length === 0) {
            tituloVazio.textContent = "Ainda não há avaliações";
            textoVazio.textContent = "Seja a primeira pessoa a partilhar a sua experiência no Decapolis.";
        } else {
            tituloVazio.textContent = "Nenhuma avaliação com este filtro";
            textoVazio.textContent = "Experimente escolher outra classificação.";
        }
    } else {
        lista.style.display = "grid";
        estadoVazio.style.display = "none";

        visiveis.forEach((item) => {
            let estrelasHTML = "";
            for (let i = 1; i <= 5; i++) {
                estrelasHTML += i <= item.estrelas ? "★" : "☆";
            }

            const primeiraLetra = item.nome.charAt(0).toUpperCase();
            const util = item.util || 0;
            const marcado = localStorage.getItem("util_" + item.id) === "1";
            const selo = item.estrelas === 5
                ? `<span class="selo-verificado" title="Cliente satisfeito">
                     <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 1.9 3-.5 1.1 2.8 2.8 1.1-.5 3L22.5 12l-1.7 2.7.5 3-2.8 1.1-1.1 2.8-3-.5L12 22.6l-2.4-1.9-3 .5-1.1-2.8-2.8-1.1.5-3L1.5 12l1.7-2.7-.5-3 2.8-1.1L6.6 2.4l3 .5L12 2z" opacity=".15"/><path d="M9 12.5l2 2 4-4.5" stroke="white" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
                   </span>`
                : "";

            const card = document.createElement("div");
            card.className = "comentario";
            card.dataset.nota = item.estrelas;
            card.innerHTML = `
                <span class="aspas">&rdquo;</span>
                <div class="comentario-topo">
                    <div class="avatar">${primeiraLetra}</div>
                    <div class="info-cliente">
                        <div class="nome-linha">
                            <h4>${escaparHTML(item.nome)}</h4>
                            ${selo}
                        </div>
                        <div class="estrelas-card">${estrelasHTML}</div>
                        <div class="data">${item.data}</div>
                    </div>
                </div>
                <div class="texto-comentario">${escaparHTML(item.comentario)}</div>
                <div class="comentario-rodape">
                    <button class="btn-util ${marcado ? "marcado" : ""}" onclick="marcarUtil(${item.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 10v11H4a1 1 0 01-1-1V11a1 1 0 011-1h3zm0 0l4.5-7.5a1.5 1.5 0 012.7 1.2L13 9h6.3a2 2 0 011.97 2.3l-1.2 8A2 2 0 0118.1 21H9a2 2 0 01-2-2v-9z" stroke-linejoin="round"/></svg>
                        <span>Útil (${util})</span>
                    </button>
                    <button class="btn-apagar" title="Apagar avaliação" onclick="apagarComentario(${item.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z" stroke-linejoin="round"/></svg>
                    </button>
                </div>
            `;
            lista.appendChild(card);
        });
    }

    atualizarEstatisticas(todos);
}

function escaparHTML(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

/*==============================
    ESTATÍSTICAS
==============================*/
function atualizarEstatisticas(comentarios) {
    const total = comentarios.length;
    document.getElementById("totalComentarios").textContent = total;

    if (total > 0) {
        const soma = comentarios.reduce((acc, c) => acc + Number(c.estrelas), 0);
        const media = (soma / total).toFixed(1);
        document.getElementById("mediaEstrelas").textContent = media;

        const positivos = comentarios.filter((c) => Number(c.estrelas) >= 4).length;
        const taxa = Math.round((positivos / total) * 100);
        document.getElementById("taxaRecomendacao").textContent = taxa + "%";
    } else {
        document.getElementById("mediaEstrelas").textContent = "0.0";
        document.getElementById("taxaRecomendacao").textContent = "0%";
    }
}

/*==============================
    MARCAR ÚTIL
==============================*/
function marcarUtil(id) {
    const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
    const chave = "util_" + id;
    const jaMarcado = localStorage.getItem(chave) === "1";

    const item = comentarios.find((c) => c.id === id);
    if (!item) return;

    if (jaMarcado) {
        item.util = Math.max(0, (item.util || 0) - 1);
        localStorage.removeItem(chave);
    } else {
        item.util = (item.util || 0) + 1;
        localStorage.setItem(chave, "1");
    }

    localStorage.setItem("comentarios", JSON.stringify(comentarios));
    carregarComentarios();
}

/*==============================
    APAGAR
==============================*/
function apagarComentario(id) {
    if (!confirm("Deseja apagar esta avaliação?")) return;
    let comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
    comentarios = comentarios.filter((c) => c.id !== id);
    localStorage.setItem("comentarios", JSON.stringify(comentarios));
    localStorage.removeItem("util_" + id);
    carregarComentarios();
}

/*==============================
    INICIAR
==============================*/
window.addEventListener("DOMContentLoaded", carregarComentarios);
