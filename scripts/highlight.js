document.addEventListener('DOMContentLoaded', () => {
    carregarLeituraDoMes();
});

async function carregarLeituraDoMes() {
    try {
        const response = await fetch(`${CONFIG.API_URL}?action=listar`);
        const resultado = await response.json();

        if (!resultado.success) return;

        const livros = resultado.data;
        const hoje = new Date();
        const mesAtual = hoje.getMonth() + 1;
        const anoAtual = hoje.getFullYear();

        // 🔥 FILTRA TODOS OS LIVROS DO MÊS
        const livrosMes = livros.filter(livro => {
            const mesLivro = Number(livro[CONFIG.COLUNAS.MES]);
            return mesLivro === mesAtual;
        });

        if (livrosMes.length === 0) return;

        renderizarHighlight(livrosMes);

    } catch (err) {
        console.error('Erro leitura do mês', err);
    }
}

function renderizarHighlight(livros) {
    const container = document.querySelector('.highlight-container');

    // 🔥 CASO TENHA APENAS 1 LIVRO
    if (livros.length === 1) {
        const livro = livros[0];
        const grupo = Number(livro[CONFIG.COLUNAS.GRUPO]);

        container.innerHTML = criarCardHTML(
            livro,
            grupo === 0
                ? '📚 Todos os grupos estão lendo este livro'
                : `👥 Grupo ${grupo}`
        );

        const btn = container.querySelector('.highlight-btn');
        btn.addEventListener('click', () => {
            window.mostrarModal(livro);
        });

        return;
    }

    // 🔥 CAROUSEL
    let index = 0;

    container.innerHTML = `
        <div class="highlight-carousel"></div>
        <div class="highlight-dots"></div>
    `;

    const carousel = container.querySelector('.highlight-carousel');
    const dotsContainer = container.querySelector('.highlight-dots');

    dotsContainer.innerHTML = livros.map((_, i) => `
        <span class="dot ${i === 0 ? 'active' : ''}"></span>
    `).join('');

    function atualizar() {
        const livro = livros[index];
        const grupo = Number(livro[CONFIG.COLUNAS.GRUPO]);

        let legenda = '';

        if (grupo === 0) {
            legenda = '📚 Todos os grupos estão lendo este livro';
        } else {
            legenda = `👥 Leitura do Grupo ${grupo}`;
        }

        carousel.innerHTML = criarCardHTML(livro, legenda);

        // 🔥 BOTÃO DETALHES
        const btn = carousel.querySelector('.highlight-btn');
        btn.addEventListener('click', () => {
            window.mostrarModal(livro);
        });

        // 🔥 ATUALIZA BOLINHAS
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');

        index = (index + 1) % livros.length;
    }

    atualizar(); // primeira renderização

    setInterval(atualizar, 4500); // troca a cada 3s
}

function criarCardHTML(livro, legenda) {
    const titulo = livro[CONFIG.COLUNAS.TITULO];
    const autor = livro[CONFIG.COLUNAS.AUTOR];
    const capa = livro[CONFIG.COLUNAS.CAPA];

    return `
        <div class="highlight-card fade">
            <img src="${capa}">
            
            <div class="highlight-info">
                <div class="highlight-title">${titulo}</div>
                <div class="highlight-author">${autor}</div>
                <div class="highlight-label">${legenda}</div>

                <button class="highlight-btn">Detalhes</button>
            </div>
        </div>
    `;
}