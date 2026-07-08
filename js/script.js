/* ==========================================
   CABEÇALHO — estado ao scroll + menu mobile
========================================== */

const header = document.querySelector('header');
const navToggle = document.querySelector('.nav-toggle');
const navLista = document.querySelector('nav ul');

function atualizarHeader() {
    if (!header) return;
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', atualizarHeader);
document.addEventListener('DOMContentLoaded', atualizarHeader);

if (navToggle && navLista) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('aberto');
        navLista.classList.toggle('aberto');
    });

    navLista.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('aberto');
            navLista.classList.remove('aberto');
        });
    });
}

// NOVA FUNÇÃO
let pratoSelecionado = "";
let precoSelecionado = 0;

function selecionarPrato(nome, preco) {
    pratoSelecionado = nome;
    precoSelecionado = preco;

    document.getElementById("pagamentoBox").style.display = "flex";
    document.getElementById("resumoPedido").innerText =
        `Prato: ${nome} | Preço: ${preco} KZ`;
}

// Função WhatsApp (já existente)
function enviarWhatsApp() {
    const nome = document.getElementById('nome').value;
    const data = document.getElementById('data').value;
    const pessoas = document.getElementById('pessoas').value;

    const meuTelefone = "244945677071"; 

    if (nome === "" || data === "") {
        alert("Por favor, preencha o seu nome e a data para a reserva.");
        return;
    }

    const dataFormatada = data.split('-').reverse().join('/');

    const mensagem = `Olá! Gostaria de solicitar uma reserva:%0A` +
                     `*Nome:* ${nome}%0A` +
                     `*Data:* ${dataFormatada}%0A` +
                     `*Pessoas:* ${pessoas}`;

    const url = `https://wa.me/${meuTelefone}?text=${mensagem}`;
    
    window.open(url, '_blank');
}

function fecharPagamento() {
    document.getElementById("pagamentoBox").style.display = "none";
}

function pagar() {
    document.getElementById("pagamentoBox").style.display = "none";

    setTimeout(() => {
        alert("✅ Pagamento efetuado com sucesso!");
    }, 500);
}

function avaliar(elemento, nota) {
    const container = elemento.parentElement;
    const id = container.getAttribute("data-id");
    const estrelas = container.children;

    // limpar
    for (let i = 0; i < estrelas.length; i++) {
        estrelas[i].classList.remove("ativo");
    }

    // ativar
    for (let i = 0; i < nota; i++) {
        estrelas[i].classList.add("ativo");
    }

    // guardar no localStorage
    localStorage.setItem("avaliacao_" + id, nota);
}

function adicionarComentario() {
    const nome = document.getElementById("nomeComentario").value;
    const texto = document.getElementById("textoComentario").value;

    if (nome === "" || texto === "") {
        alert("Preencha todos os campos!");
        return;
    }

    const comentario = {
        nome: nome,
        texto: texto
    };

    // pegar comentários já guardados
    let comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];

    // adicionar novo
    comentarios.unshift(comentario);

    // guardar novamente
    localStorage.setItem("comentarios", JSON.stringify(comentarios));

    // mostrar na tela
    mostrarComentarios();

    // limpar campos
    document.getElementById("nomeComentario").value = "";
    document.getElementById("textoComentario").value = "";
}

function mostrarComentarios() {
    const lista = document.getElementById("listaComentarios");
    if (!lista) return;
    lista.innerHTML = "";

    let comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];

    comentarios.forEach(c => {
        const novoComentario = document.createElement("div");
        novoComentario.classList.add("comentario");

        novoComentario.innerHTML = `
            <strong>${c.nome}</strong>
            <p>${c.texto}</p>
        `;

        lista.appendChild(novoComentario);
    });
}



window.addEventListener("DOMContentLoaded", () => {
    const avaliacoes = document.querySelectorAll(".avaliacao");

    avaliacoes.forEach(container => {
        const id = container.getAttribute("data-id");
        const nota = localStorage.getItem("avaliacao_" + id);

        if (nota) {
            const estrelas = container.children;

            for (let i = 0; i < nota; i++) {
                estrelas[i].classList.add("ativo");
            }
        }
    });

    // carregar comentários
    mostrarComentarios();

});

function toggleFAQ(elemento) {
    const resposta = elemento.nextElementSibling;

    if (resposta.style.display === "block") {
        resposta.style.display = "none";
    } else {
        resposta.style.display = "block";
    }
}

function lerMais(botao) {
    const conteudo = botao.nextElementSibling;

    if (conteudo.style.display === "block") {
        conteudo.style.display = "none";
        botao.innerText = "Ler mais";
    } else {
        conteudo.style.display = "block";
        botao.innerText = "Mostrar menos";
    }
}

function inscreverEmail() {
    const email = document.getElementById("emailNewsletter").value;

    if (!email.includes("@")) {
        alert("Digite um email válido!");
        return;
    }

    let emails = JSON.parse(localStorage.getItem("emails")) || [];

    emails.push(email);

    localStorage.setItem("emails", JSON.stringify(emails));

    alert("✅ Inscrição realizada com sucesso!");

    document.getElementById("emailNewsletter").value = "";
}

let pratoEncomenda = "";
let precoEncomenda = 0;

function abrirEncomenda(nome, preco) {

    pratoEncomenda = nome;
    precoEncomenda = preco;

    document.getElementById("modalEncomenda")
    .style.display = "flex";

    atualizarResumo();
}

function fecharEncomenda() {

    document.getElementById("modalEncomenda")
    .style.display = "none";
}

function enviarEncomendaWhats() {

    const nome =
    document.getElementById("clienteNome").value;

    const endereco =
    document.getElementById("clienteEndereco").value;

    const quantidade =
    document.getElementById("clienteQuantidade").value;

    if(nome === "" || endereco === "" || quantidade === "") {

        alert("Preencha todos os campos!");
        return;
    }

    const telefone = "244945677071";
    const subtotal =
    precoEncomenda * quantidade;

    const total =
    subtotal + taxaEntrega;

    const mensagem =
`Olá, gostaria de fazer uma encomenda:

   Prato: ${pratoEncomenda}
   Preço Unitário: ${precoEncomenda} KZ
   Quantidade: ${quantidade}

   Taxa de entrega: ${taxaEntrega} KZ

   Total: ${total} KZ

   Nome: ${nome}
   Endereço: ${endereco}`;

    const url =
`https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");

    fecharEncomenda();
}

const taxaEntrega = 2000;

function atualizarResumo() {

    const quantidade =
    document.getElementById("clienteQuantidade").value || 1;

    const subtotal =
    precoEncomenda * quantidade;

    const total =
    subtotal + taxaEntrega;

    document.getElementById("resumoPrato")
    .innerText =
    ` Prato: ${pratoEncomenda}`;

    document.getElementById("resumoQuantidade")
    .innerText =
    ` Quantidade: ${quantidade}`;

    document.getElementById("resumoEntrega")
    .innerText =
    ` Taxa de entrega: ${taxaEntrega} KZ`;

    document.getElementById("resumoTotal")
    .innerText =
    `Total: ${total} KZ`;
}

/* ==========================================
   REVELAÇÃO AO SCROLL (IntersectionObserver)
   Só ativa a ocultação inicial depois de confirmar suporte,
   para garantir que o conteúdo nunca fica invisível sem JS.
========================================== */

const elementosAnimados = document.querySelectorAll('.animar');
const prefereReduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && elementosAnimados.length && !prefereReduzirMovimento) {
    document.documentElement.classList.add('reveal-ativo');

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('aparecer');
                observador.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elementosAnimados.forEach(el => observador.observe(el));

    // Garante que qualquer elemento já visível no primeiro ecrã aparece de imediato
    requestAnimationFrame(() => {
        elementosAnimados.forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.top < window.innerHeight && r.bottom > 0) {
                el.classList.add('aparecer');
            }
        });
    });
}



/* ==========================================
   BOTÃO VOLTAR AO TOPO
   Injectado automaticamente em todas as páginas
   que carregam este script.
========================================== */

function iniciarBotaoTopo() {
    const botao = document.createElement('button');
    botao.className = 'btn-topo';
    botao.setAttribute('aria-label', 'Voltar ao topo');
    botao.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
        </svg>`;
    document.body.appendChild(botao);

    if (document.querySelector('.whatsapp-flutuante')) {
        botao.classList.add('com-whatsapp');
    }

    function atualizarVisibilidade() {
        if (window.scrollY > 400) {
            botao.classList.add('visivel');
        } else {
            botao.classList.remove('visivel');
        }
    }

    window.addEventListener('scroll', atualizarVisibilidade, { passive: true });
    atualizarVisibilidade();

    botao.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ==========================================
   WHATSAPP FLUTUANTE
========================================== */

function iniciarWhatsappFlutuante() {
    const telefone = '244945677071';
    const mensagem = encodeURIComponent('Olá! Gostaria de mais informações sobre o Decapolis.');

    const link = document.createElement('a');
    link.href = `https://wa.me/${telefone}?text=${mensagem}`;
    link.target = '_blank';
    link.rel = 'noopener';
    link.className = 'whatsapp-flutuante';
    link.setAttribute('aria-label', 'Falar connosco no WhatsApp');
    link.innerHTML = `
        <svg viewBox="0 0 32 32"><path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.394.703 4.623 1.912 6.494L4 29l7.69-1.874A11.93 11.93 0 0 0 16.001 27C22.63 27 28 21.627 28 15S22.63 3 16.001 3zm6.965 16.845c-.297.833-1.469 1.522-2.406 1.72-.64.135-1.475.243-4.287-.92-3.598-1.49-5.914-5.14-6.096-5.377-.176-.238-1.457-1.94-1.457-3.7 0-1.76.918-2.622 1.242-2.982.324-.36.71-.45.947-.45.237 0 .474.003.68.013.218.01.51-.083.798.61.297.71.998 2.47 1.086 2.65.089.18.148.393.03.63-.117.238-.176.386-.35.593-.176.208-.37.464-.53.623-.176.174-.36.362-.155.71.207.35.92 1.516 1.973 2.454 1.354 1.207 2.496 1.582 2.847 1.76.35.176.556.148.76-.09.207-.238.884-1.03 1.12-1.383.235-.35.472-.29.796-.174.324.117 2.06.973 2.412 1.15.353.176.588.264.674.412.086.147.086.85-.211 1.683z"/></svg>`;

    document.body.appendChild(link);
}

/* ==========================================
   REDES SOCIAIS — ícones no rodapé
========================================== */

const redesSociaisConfig = [
    {
        nome: 'Facebook',
        url: 'https://facebook.com/decapolisrestaurante',
        svg: '<svg viewBox="0 0 24 24"><path d="M13.5 21v-8.06h2.72l.4-3.16h-3.12V7.9c0-.91.26-1.53 1.57-1.53h1.67V3.55A22.4 22.4 0 0 0 14.35 3.4c-2.4 0-4.05 1.47-4.05 4.16v2.32H7.58v3.16h2.72V21h3.2z"/></svg>'
    },
    {
        nome: 'Instagram',
        url: 'https://instagram.com/decapolisrestaurante',
        svg: '<svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.43.4.61.24 1.05.52 1.5 1s.77.9 1 1.5c.17.46.36 1.26.4 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.4 2.43-.24.61-.52 1.05-1 1.5s-.9.77-1.5 1c-.46.17-1.26.36-2.43.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.4-.61-.24-1.05-.52-1.5-1s-.77-.9-1-1.5c-.17-.46-.36-1.26-.4-2.43C1.76 15.58 1.75 15.2 1.75 12s.01-3.58.07-4.85c.05-1.17.24-1.97.4-2.43.24-.61.52-1.05 1-1.5s.9-.77 1.5-1c.46-.17 1.26-.36 2.43-.4C8.42 2.21 8.8 2.2 12 2.2zm0 1.8c-3.15 0-3.5.01-4.73.07-.96.04-1.48.2-1.83.34-.46.18-.79.4-1.14.75s-.57.68-.75 1.14c-.14.35-.3.87-.34 1.83-.06 1.23-.07 1.58-.07 4.73s.01 3.5.07 4.73c.04.96.2 1.48.34 1.83.18.46.4.79.75 1.14s.68.57 1.14.75c.35.14.87.3 1.83.34 1.23.06 1.58.07 4.73.07s3.5-.01 4.73-.07c.96-.04 1.48-.2 1.83-.34.46-.18.79-.4 1.14-.75s.57-.68.75-1.14c.14-.35.3-.87.34-1.83.06-1.23.07-1.58.07-4.73s-.01-3.5-.07-4.73c-.04-.96-.2-1.48-.34-1.83a3.07 3.07 0 0 0-.75-1.14 3.07 3.07 0 0 0-1.14-.75c-.35-.14-.87-.3-1.83-.34C15.5 4.01 15.15 4 12 4zm0 3.65a4.35 4.35 0 1 1 0 8.7 4.35 4.35 0 0 1 0-8.7zm0 1.8a2.55 2.55 0 1 0 0 5.1 2.55 2.55 0 0 0 0-5.1zm5.54-1.99a1.02 1.02 0 1 1-2.04 0 1.02 1.02 0 0 1 2.04 0z"/></svg>'
    },
    {
        nome: 'WhatsApp',
        url: 'https://wa.me/244945677071',
        svg: '<svg viewBox="0 0 32 32"><path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.394.703 4.623 1.912 6.494L4 29l7.69-1.874A11.93 11.93 0 0 0 16.001 27C22.63 27 28 21.627 28 15S22.63 3 16.001 3zm6.965 16.845c-.297.833-1.469 1.522-2.406 1.72-.64.135-1.475.243-4.287-.92-3.598-1.49-5.914-5.14-6.096-5.377-.176-.238-1.457-1.94-1.457-3.7 0-1.76.918-2.622 1.242-2.982.324-.36.71-.45.947-.45.237 0 .474.003.68.013.218.01.51-.083.798.61.297.71.998 2.47 1.086 2.65.089.18.148.393.03.63-.117.238-.176.386-.35.593-.176.208-.37.464-.53.623-.176.174-.36.362-.155.71.207.35.92 1.516 1.973 2.454 1.354 1.207 2.496 1.582 2.847 1.76.35.176.556.148.76-.09.207-.238.884-1.03 1.12-1.383.235-.35.472-.29.796-.174.324.117 2.06.973 2.412 1.15.353.176.588.264.674.412.086.147.086.85-.211 1.683z"/></svg>'
    }
];

function iniciarRedesSociais() {
    const footer = document.querySelector('.footer .footer-container .footer-col');
    if (!footer) return;

    const container = document.createElement('div');
    container.className = 'footer-social';

    redesSociaisConfig.forEach(rede => {
        const link = document.createElement('a');
        link.href = rede.url;
        link.target = '_blank';
        link.rel = 'noopener';
        link.setAttribute('aria-label', rede.nome);
        link.innerHTML = rede.svg;
        container.appendChild(link);
    });

    footer.appendChild(container);
}

/* ==========================================
   NEWSLETTER — "Receba Novidades" no rodapé
   (usa a função inscreverEmail já existente)
========================================== */

function iniciarNewsletterRodape() {
    const footerBottom = document.querySelector('.footer .footer-bottom');
    if (!footerBottom) return;
    if (document.getElementById('emailNewsletter')) return; // já existe, não duplicar

    const bloco = document.createElement('div');
    bloco.className = 'footer-newsletter';
    bloco.innerHTML = `
        <div class="footer-newsletter-texto">
            <h3>Receba Novidades</h3>
            <p>Subscreva e seja o primeiro a saber sobre novos pratos, eventos e promoções do Decapolis.</p>
        </div>
        <form class="footer-newsletter-form" onsubmit="return false;">
            <input type="email" id="emailNewsletter" placeholder="O seu melhor email" required>
            <button type="button" onclick="inscreverEmail()">Subscrever</button>
        </form>
    `;

    footerBottom.parentNode.insertBefore(bloco, footerBottom);
}

/* ==========================================
   CARROSSEL / SLIDER — motor genérico
   Uso: adicionar o atributo data-carrossel a um
   contentor cujos filhos serão transformados em slides.
   Atributos opcionais:
     data-por-vista="3"     -> nº de itens visíveis em ecrã largo
     data-autoplay="true"   -> ativa reprodução automática
     data-intervalo="5000"  -> intervalo do autoplay em ms
========================================== */

function calcularItensPorVista(maxPorVista, largura) {
    if (largura < 640) return 1;
    if (largura < 980) return Math.min(2, maxPorVista);
    return maxPorVista;
}

function iniciarCarrossel(container) {
    const itensOriginais = Array.from(container.children);
    if (itensOriginais.length < 2) return;

    const maxPorVista = parseInt(container.dataset.porVista || '3', 10);
    const autoplay = container.dataset.autoplay === 'true';
    const intervalo = parseInt(container.dataset.intervalo || '5500', 10);

    // Monta a estrutura do carrossel
    const viewport = document.createElement('div');
    viewport.className = 'carrossel-viewport';

    const trilho = document.createElement('div');
    trilho.className = 'carrossel-trilho';

    itensOriginais.forEach(item => {
        const slide = document.createElement('div');
        slide.className = 'carrossel-slide';
        slide.appendChild(item);
        trilho.appendChild(slide);
    });

    viewport.appendChild(trilho);
    container.innerHTML = '';
    container.classList.add('carrossel');
    container.appendChild(viewport);

    const btnAnterior = document.createElement('button');
    btnAnterior.className = 'carrossel-seta carrossel-anterior';
    btnAnterior.setAttribute('aria-label', 'Anterior');
    btnAnterior.innerHTML = '&#10094;';

    const btnProximo = document.createElement('button');
    btnProximo.className = 'carrossel-seta carrossel-proximo';
    btnProximo.setAttribute('aria-label', 'Próximo');
    btnProximo.innerHTML = '&#10095;';

    container.appendChild(btnAnterior);
    container.appendChild(btnProximo);

    const paginacao = document.createElement('div');
    paginacao.className = 'carrossel-paginacao';
    container.appendChild(paginacao);

    let porVista = calcularItensPorVista(maxPorVista, window.innerWidth);
    let totalPaginas = Math.max(1, Math.ceil(itensOriginais.length / porVista));
    let paginaAtual = 0;
    let temporizador = null;

    function aplicarLargurasSlides() {
        const slides = trilho.querySelectorAll('.carrossel-slide');
        slides.forEach(slide => {
            slide.style.flex = `0 0 ${100 / porVista}%`;
            slide.style.maxWidth = `${100 / porVista}%`;
        });
    }

    function renderizarPontos() {
        paginacao.innerHTML = '';
        if (totalPaginas <= 1) return;
        for (let i = 0; i < totalPaginas; i++) {
            const ponto = document.createElement('button');
            ponto.className = 'carrossel-ponto' + (i === paginaAtual ? ' ativo' : '');
            ponto.setAttribute('aria-label', `Ir para o slide ${i + 1}`);
            ponto.addEventListener('click', () => irParaPagina(i));
            paginacao.appendChild(ponto);
        }
    }

    function atualizarSetas() {
        const escondidas = totalPaginas <= 1;
        btnAnterior.classList.toggle('escondida', escondidas);
        btnProximo.classList.toggle('escondida', escondidas);
    }

    function irParaPagina(indice) {
        paginaAtual = (indice + totalPaginas) % totalPaginas;
        trilho.style.transform = `translateX(-${paginaAtual * 100}%)`;
        renderizarPontos();
    }

    function proximo() { irParaPagina(paginaAtual + 1); }
    function anterior() { irParaPagina(paginaAtual - 1); }

    function iniciarAutoplay() {
        if (!autoplay || totalPaginas <= 1) return;
        pararAutoplay();
        temporizador = setInterval(proximo, intervalo);
    }
    function pararAutoplay() {
        if (temporizador) clearInterval(temporizador);
    }

    btnProximo.addEventListener('click', () => { proximo(); iniciarAutoplay(); });
    btnAnterior.addEventListener('click', () => { anterior(); iniciarAutoplay(); });

    container.addEventListener('mouseenter', pararAutoplay);
    container.addEventListener('mouseleave', iniciarAutoplay);

    // Suporte a toque (swipe)
    let toqueInicioX = 0;
    viewport.addEventListener('touchstart', e => {
        toqueInicioX = e.touches[0].clientX;
        pararAutoplay();
    }, { passive: true });

    viewport.addEventListener('touchend', e => {
        const diferenca = e.changedTouches[0].clientX - toqueInicioX;
        if (diferenca > 50) anterior();
        else if (diferenca < -50) proximo();
        iniciarAutoplay();
    }, { passive: true });

    function recalcular() {
        const novoPorVista = calcularItensPorVista(maxPorVista, window.innerWidth);
        const mudou = novoPorVista !== porVista;
        porVista = novoPorVista;
        totalPaginas = Math.max(1, Math.ceil(itensOriginais.length / porVista));
        if (paginaAtual >= totalPaginas) paginaAtual = totalPaginas - 1;
        aplicarLargurasSlides();
        atualizarSetas();
        irParaPagina(paginaAtual);
        if (mudou) iniciarAutoplay();
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(recalcular, 200);
    });

    // Estado inicial
    aplicarLargurasSlides();
    atualizarSetas();
    renderizarPontos();
    iniciarAutoplay();
}

function iniciarTodosOsCarrosseis() {
    document.querySelectorAll('[data-carrossel]').forEach(iniciarCarrossel);
}

/* ==========================================
   GALERIA — filtros por categoria + lightbox
   (página galeria.html)
========================================== */

function iniciarGaleria() {
    const masonry = document.getElementById('galeriaMasonry');
    const lightbox = document.getElementById('lightbox');
    if (!masonry || !lightbox) return;

    const itens = Array.from(masonry.querySelectorAll('.galeria-item'));
    const botoesFiltro = document.querySelectorAll('.filtro-btn');

    function itensVisiveis() {
        return itens.filter(item => !item.classList.contains('escondido'));
    }

    // --- Filtros ---
    botoesFiltro.forEach(botao => {
        botao.addEventListener('click', () => {
            botoesFiltro.forEach(b => b.classList.remove('ativo'));
            botao.classList.add('ativo');

            const alvo = botao.dataset.filtro;
            itens.forEach(item => {
                const mostrar = alvo === 'todos' || item.dataset.categoria === alvo;
                item.classList.toggle('escondido', !mostrar);
            });
        });
    });

    // --- Lightbox ---
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxLegenda = document.getElementById('lightboxLegenda');
    const btnFechar = lightbox.querySelector('.lightbox-fechar');
    const btnAnterior = lightbox.querySelector('.lightbox-anterior');
    const btnProximo = lightbox.querySelector('.lightbox-proximo');

    let indiceAtual = 0;

    function atualizarLightbox() {
        const visiveis = itensVisiveis();
        if (!visiveis.length) return;
        const item = visiveis[indiceAtual];
        const img = item.querySelector('img');
        const nome = item.querySelector('.galeria-item-nome');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxLegenda.textContent = nome ? nome.textContent : img.alt;
    }

    function abrirLightbox(item) {
        const visiveis = itensVisiveis();
        indiceAtual = visiveis.indexOf(item);
        if (indiceAtual < 0) indiceAtual = 0;
        atualizarLightbox();
        lightbox.classList.add('ativo');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-aberto');
    }

    function fecharLightbox() {
        lightbox.classList.remove('ativo');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-aberto');
    }

    function navegar(direcao) {
        const visiveis = itensVisiveis();
        if (!visiveis.length) return;
        indiceAtual = (indiceAtual + direcao + visiveis.length) % visiveis.length;
        atualizarLightbox();
    }

    itens.forEach(item => {
        item.addEventListener('click', () => abrirLightbox(item));
    });

    btnFechar.addEventListener('click', fecharLightbox);
    btnProximo.addEventListener('click', () => navegar(1));
    btnAnterior.addEventListener('click', () => navegar(-1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) fecharLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('ativo')) return;
        if (e.key === 'Escape') fecharLightbox();
        if (e.key === 'ArrowRight') navegar(1);
        if (e.key === 'ArrowLeft') navegar(-1);
    });
}

/* ==========================================
   INICIALIZAÇÃO DOS NOVOS COMPONENTES
========================================== */

document.addEventListener('DOMContentLoaded', () => {
    iniciarBotaoTopo();
    iniciarWhatsappFlutuante();
    iniciarRedesSociais();
    iniciarNewsletterRodape();
    iniciarTodosOsCarrosseis();
    iniciarGaleria();
});
