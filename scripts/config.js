// config.js - Configurações da aplicação

const CONFIG = {
    // URL da sua API do Google Apps Script
    API_URL: 'https://script.google.com/macros/s/AKfycbwDFsQl1qCKVZdJ5MjpJLAhB9FF8frxXyJwmvX6S8WUg5u_Lyp_9P245AMcZRkx7Vudlg/exec',
    
    // Mapeamento das colunas da planilha (usando os nomos em MAIÚSCULO)
    COLUNAS: {
        TITULO: 'TITULO',
        AUTOR: 'AUTOR',
        CAPA: 'CAPA',
        DETALHES: 'DETALHES',
        LOJA01: 'LOJA01',
        LOJA02: 'LOJA02',
        LOJA03: 'LOJA03',
        PDF: 'PDF'
    },
    
    // Configurações visuais
    IMAGEM_PADRAO: 'https://via.placeholder.com/300x450?text=Sem+Capa',
    
    // Mensagens
    MSG_ERRO: 'Erro ao carregar os livros. Tente novamente mais tarde.',
    MSG_LOADING: 'Carregando livros...',
    MSG_SEM_DADOS: 'Nenhum livro encontrado na biblioteca.'
};

// Verificação se o objeto foi criado corretamente
console.log('Configurações carregadas:', CONFIG.API_URL);