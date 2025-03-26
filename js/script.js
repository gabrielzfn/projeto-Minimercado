// Variáveis globais
let carrinho = [];
let totalCarrinho = 0;

// Função para inicializar o sistema
document.addEventListener('DOMContentLoaded', function() {
    // Configura a data mínima para agendamento (amanhã)
    const dataInput = document.getElementById('data');
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    const dataFormatada = amanha.toISOString().split('T')[0];
    dataInput.min = dataFormatada;
    
    // Atualiza o carrinho se houver itens no localStorage
    carregarCarrinho();
});

// Função para adicionar produto ao carrinho
function adicionarAoCarrinho(nome, preco) {
    // Verifica se o produto já está no carrinho
    const produtoExistente = carrinho.find(item => item.nome === nome);
    
    if (produtoExistente) {
        produtoExistente.quantidade++;
    } else {
        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }
    
    // Atualiza o total e salva no localStorage
    totalCarrinho += preco;
    salvarCarrinho();
    atualizarCarrinho();
    
    // Exibe mensagem de sucesso
    alert(`${nome} foi adicionado ao carrinho!`);
}

// Função para atualizar a exibição do carrinho
function atualizarCarrinho() {
    const listaCarrinho = document.getElementById('listaCarrinho');
    const contadorCarrinho = document.getElementById('contadorCarrinho');
    const totalCarrinhoElement = document.getElementById('totalCarrinho');
    
    // Limpa a lista
    listaCarrinho.innerHTML = '';
    
    // Adiciona os itens
    carrinho.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        
        const itemInfo = document.createElement('div');
        itemInfo.innerHTML = `<strong>${item.nome}</strong> - ${item.quantidade}x`;
        
        const itemPreco = document.createElement('span');
        itemPreco.className = 'badge bg-success rounded-pill';
        itemPreco.textContent = `R$ ${(item.preco * item.quantidade).toFixed(2)}`;
        
        const btnRemover = document.createElement('button');
        btnRemover.className = 'btn btn-sm btn-outline-danger ms-2';
        btnRemover.innerHTML = '<i class="bi bi-trash"></i>';
        btnRemover.onclick = () => removerDoCarrinho(item.nome);
        
        const divAcoes = document.createElement('div');
        divAcoes.className = 'd-flex align-items-center';
        divAcoes.appendChild(itemPreco);
        divAcoes.appendChild(btnRemover);
        
        li.appendChild(itemInfo);
        li.appendChild(divAcoes);
        listaCarrinho.appendChild(li);
    });
    
    // Atualiza contador e total
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    contadorCarrinho.textContent = totalItens;
    totalCarrinhoElement.textContent = `R$ ${totalCarrinho.toFixed(2)}`;
}

// Função para remover item do carrinho
function removerDoCarrinho(nome) {
    const index = carrinho.findIndex(item => item.nome === nome);
    
    if (index !== -1) {
        totalCarrinho -= carrinho[index].preco * carrinho[index].quantidade;
        
        if (carrinho[index].quantidade > 1) {
            carrinho[index].quantidade--;
        } else {
            carrinho.splice(index, 1);
        }
        
        salvarCarrinho();
        atualizarCarrinho();
    }
}

// Função para salvar carrinho no localStorage
function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    localStorage.setItem('totalCarrinho', totalCarrinho.toString());
}

// Função para carregar carrinho do localStorage
function carregarCarrinho() {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    const totalSalvo = localStorage.getItem('totalCarrinho');
    
    if (carrinhoSalvo) {
        carrinho = JSON.parse(carrinhoSalvo);
        totalCarrinho = parseFloat(totalSalvo) || 0;
        atualizarCarrinho();
    }
}

// Função para finalizar compra
function finalizarCompra() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    // Aqui você pode adicionar a lógica para enviar o pedido
    alert('Compra finalizada com sucesso! Obrigado por comprar conosco.');
    
    // Limpa o carrinho
    carrinho = [];
    totalCarrinho = 0;
    salvarCarrinho();
    atualizarCarrinho();
    
    // Fecha o modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('carrinhoModal'));
    modal.hide();
}

// Função para validar formulário
function validarFormulario(event) {
    event.preventDefault();
    
    // Validação básica - na prática, você deve validar todos os campos
    if (!document.getElementById('termos').checked) {
        alert('Você deve aceitar os termos de uso!');
        return;
    }
    
    // Se tudo estiver válido, pode enviar o formulário
    alert('Cadastro realizado com sucesso! Em breve entraremos em contato.');
    document.getElementById('formCadastro').reset();
}

// Funções para formatação de campos
function formatarCPF(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 3 && value.length <= 6) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
    } else if (value.length > 6 && value.length <= 9) {
        value = value.replace(/(\d{3})(\d{3})(\d)/, '$1.$2.$3');
    } else if (value.length > 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d)/, '$1.$2.$3-$4');
    }
    
    input.value = value;
}

function formatarTelefone(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 2 && value.length <= 6) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
    } else if (value.length > 6 && value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d)/, '($1) $2-$3');
    } else if (value.length > 10) {
        value = value.replace(/(\d{2})(\d{5})(\d)/, '($1) $2-$3');
    }
    
    input.value = value;
}