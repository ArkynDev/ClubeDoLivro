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
        console.error('Erro ao carregar livros:', error);
        mostrarMensagem(CONFIG.MSG_ERRO, 'erro');
    }
}

// Função para renderizar os livros no HTML
function renderizarLivros(livros) {
    const container = document.querySelector('.book-list');
    
    if (!container) {
        console.error('Container .book-list não encontrado');
        return;
    }
    
    container.innerHTML = '';
    
    const livrosValidos = livros.filter(livro => {
        return livro[CONFIG.COLUNAS.TITULO] && livro[CONFIG.COLUNAS.AUTOR];
    });
    
    if (livrosValidos.length === 0) {
        mostrarMensagem(CONFIG.MSG_SEM_DADOS, 'info');
        return;
    }
    
    livrosValidos.forEach(livro => {
        const bookCard = criarCardLivro(livro);
        container.appendChild(bookCard);
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

    const titulo = livro[CONFIG.COLUNAS.TITULO] || '';
    const autor = livro[CONFIG.COLUNAS.AUTOR] || '';
    const capa = livro[CONFIG.COLUNAS.CAPA] || CONFIG.IMAGEM_PADRAO;
    const detalhes = livro[CONFIG.COLUNAS.DETALHES] || '';

    const compraLinks = [
        livro[CONFIG.COLUNAS.LOJA01],
        livro[CONFIG.COLUNAS.LOJA02],
        livro[CONFIG.COLUNAS.LOJA03]
    ].filter(link => link && link.trim() !== '');

    const pdf = livro[CONFIG.COLUNAS.PDF];

    modal.querySelector('.modal-body').innerHTML = `
        <img src="${capa}" class="modal-img" onerror="this.src='${CONFIG.IMAGEM_PADRAO}'" />

        <h2>${escapeHtml(titulo)}</h2>
        <p class="modal-autor">${escapeHtml(autor)}</p>
        <p class="modal-desc">${escapeHtml(detalhes)}</p>

        <div class="modal-actions">
            ${compraLinks.map((link, i) => `
                <a href="${link}" target="_blank" class="btn-buy">
                    Comprar ${i + 1}
                </a>
            `).join('')}

            ${pdf && pdf.trim() !== '' ? `
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

    const fecharModal = () => {
        modal.classList.add('closing');

        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('closing');
        }, 300);
    };

    modal.querySelector('.close-modal')
        .addEventListener('click', fecharModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            fecharModal();
        }
    });

    return modal;
}

// Função para mostrar loading
function mostrarLoading() {
    const container = document.querySelector('.book-list');
    if (container) {
        container.innerHTML = `
            <div class="loading">
                <p>${CONFIG.MSG_LOADING}</p>
                <div class="spinner"></div>
            </div>
        `;
    }
}

// Função para mostrar mensagens
function mostrarMensagem(mensagem, tipo = 'erro') {
    const container = document.querySelector('.book-list');
    if (container) {
        container.innerHTML = `
            <div class="message ${tipo}">
                <p>${mensagem}</p>
                ${tipo === 'erro' ? '<button onclick="carregarLivros()">Tentar novamente</button>' : ''}
            </div>
        `;
    }
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