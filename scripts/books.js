// livros.js - Script para gerenciar os livros

// Aguarda o carregamento da página
document.addEventListener('DOMContentLoaded', () => {
    carregarLivros();
});

// Função principal para carregar os livros
async function carregarLivros() {
    try {
        mostrarLoading();
        
        const response = await fetch(`${CONFIG.API_URL}?action=listar`);
        const resultado = await response.json();
        
        if (resultado.success && resultado.data.length > 0) {
            renderizarLivros(resultado.data);
        } else {
            mostrarMensagem(CONFIG.MSG_SEM_DADOS, 'info');
        }
        
    } catch (error) {
        console.error(error);
        mostrarMensagem(CONFIG.MSG_ERRO, 'erro');
    }
}

// Função para renderizar os livros no HTML
function renderizarLivros(livros) {
    const container = document.querySelector('.book-list');
    container.innerHTML = '';

    livros.forEach(livro => {
        container.appendChild(criarCardLivro(livro));
    });
}

// Função para criar o card de um livro
function criarCardLivro(livro) {
    const div = document.createElement('div');
    div.className = 'book-card';
    
    const titulo = livro[CONFIG.COLUNAS.TITULO] || 'Título não informado';
    const autor = livro[CONFIG.COLUNAS.AUTOR] || 'Autor não informado';
    const capaUrl = livro[CONFIG.COLUNAS.CAPA] || CONFIG.IMAGEM_PADRAO;
    
    div.innerHTML = `
        <img src="${capaUrl}" 
            alt="Capa do livro: ${escapeHtml(titulo)}" 
            onerror="this.src='${CONFIG.IMAGEM_PADRAO}'">

        <div class="book-info">
            <h2 class="title">${escapeHtml(titulo)}</h2>
            <p class="author">${escapeHtml(autor)}</p>

            <div class="actions">
                <button class="details">Detalhes</button>
            </div>
        </div>
    `;
    
    const btnDetails = div.querySelector('.details');
    btnDetails.addEventListener('click', () => handleDetalhes(livro));
    
    return div;
}

// Função para lidar com os detalhes do livro
function handleDetalhes(livro) {
    console.log('Clicou no detalhes', livro);
    mostrarModal(livro);
}

// Função para mostrar o modal completo
function mostrarModal(livro) {
    let modal = document.querySelector('.modal');

    if (!modal) {
        modal = criarModal();
        document.body.appendChild(modal);
    }

    const compraLinks = [
        livro[CONFIG.COLUNAS.LOJA01],
        livro[CONFIG.COLUNAS.LOJA02],
        livro[CONFIG.COLUNAS.LOJA03]
    ].filter(l => l && l.trim() !== '');

    const pdfId = livro[CONFIG.COLUNAS.PDF];
    const pdf = pdfId && pdfId.trim() !== ''
        ? `https://drive.google.com/uc?export=download&id=${pdfId}`
        : '';

    modal.querySelector('.modal-body').innerHTML = `
        <img src="${livro[CONFIG.COLUNAS.CAPA]}" class="modal-img">

        <h2>${escapeHtml(livro[CONFIG.COLUNAS.TITULO])}</h2>
        <p class="modal-autor">${livro[CONFIG.COLUNAS.AUTOR]}</p>
        <p class="modal-desc">${livro[CONFIG.COLUNAS.DETALHES] || ''}</p>

        <div class="modal-actions">
            ${compraLinks.map((link, i) => {
                let classe = 'btn-buy';
                let icon = '';
                let texto = `Comprar ${i + 1}`;

                if (i === 0) {
                    classe += ' amazon';
                    icon = 'icons/amazon_icon.png';
                    texto = 'Comprar na Amazon';
                }

                if (i === 1) {
                    classe += ' shopee';
                    icon = 'icons/shopee_icon.png';
                    texto = 'Comprar na Shopee';
                }

                return `
                    <a href="${link}" target="_blank" class="${classe}">
                        ${icon ? `<img src="${icon}" class="btn-icon" />` : ''}
                        <span>${texto}</span>
                    </a>
                `;
            }).join('')}

            ${pdf ? `
                <a href="${pdf}" target="_blank" class="btn-pdf">
                    📥 Baixar PDF
                </a>
            ` : ''}
        </div>
    `;

    modal.style.display = 'flex';
}

// Função para criar o modal
function criarModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-body"></div>
        </div>
    `;

    const fechar = () => {
        modal.classList.add('closing');

        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('closing');
        }, 300);
    };

    modal.querySelector('.close-modal').onclick = fechar;

    modal.onclick = (e) => {
        if (e.target === modal) fechar();
    };

    return modal;
}

// Função para mostrar loading
function mostrarLoading() {
    const container = document.querySelector('.book-list');

    const quantidade = Math.ceil(window.innerHeight / 140);

    container.innerHTML = Array(quantidade).fill(`
        <div class="book-card skeleton">
            <div class="skeleton-img"></div>

            <div class="book-info">
                <div class="skeleton-title"></div>
                <div class="skeleton-author"></div>
                <div class="skeleton-btn"></div>
            </div>
        </div>
    `).join('');
}

// Função para mostrar mensagens
function mostrarMensagem(msg) {
    document.querySelector('.book-list').innerHTML = `<p>${msg}</p>`;
}

// Função utilitária para escapar HTML
function escapeHtml(texto) {
    if (!texto) return '';
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// Exporta função
window.carregarLivros = carregarLivros;