// Dados de exemplo (substitua pelos seus dados reais)
const moldData = {
    production: [
        { id: "1678", cliente: "Cliente A", data: "2023-10-15", processos: "Corte, Usinagem", status: "Em andamento" },
        { id: "1679", cliente: "Cliente B", data: "2023-10-16", processos: "Corte, Solda", status: "Aguardando revisão" }
    ],
    finished: [
        { id: "1676", cliente: "Cliente C", data: "2023-09-20", processos: "Completo", status: "Pronto para entrega" },
        { id: "1677", cliente: "Cliente D", data: "2023-09-25", processos: "Completo", status: "Entregue" }
    ],
    stock: [
        { id: "AÇO-201", codigo: "AC-304", fornecedor: "Fornecedor X", data: "2023-08-10", tipo: "inox", quantidade: "50 unidades" },
        { id: "AÇO-202", codigo: "AC-416", fornecedor: "Fornecedor Y", data: "2023-08-15", tipo: "ferramenta", quantidade: "30 unidades" }
    ]
};

// Variável para controlar a tabela atual
let currentTableType = '';
let currentData = [];
let selectedFile = null;

// Função para visualizar um item
function viewItem(itemId) {
    if (currentTableType === 'production' || currentTableType === 'finished') {
        window.location.href = `molde-finalizado.html?id=${itemId}`;
    } else if (currentTableType === 'stock') {
        window.location.href = `aco-estoque.html?id=${itemId}`;
    }
}

// Função para criar a tabela HTML
function createTable(data, title, showProcessColumn) {
    currentData = data; // Armazena os dados atuais para filtragem
    
    let html = `<div class="table-header">
                    <h2>${title}</h2>
                    <span class="result-count">${data.length} resultados encontrados</span>
                </div>
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Número</th>
                                ${showProcessColumn ? '<th>Cliente</th><th>Data</th><th>Processos</th><th>Status</th>' : '<th>Código</th><th>Fornecedor</th><th>Data</th><th>Tipo</th><th>Quantidade</th>'}
                                <th>Ação</th>
                            </tr>
                        </thead>
                        <tbody>`;
    
    data.forEach(item => {
        html += `<tr>
                    <td>${item.id}</td>
                    ${showProcessColumn 
                        ? `<td>${item.cliente}</td>
                            <td>${item.data}</td>
                            <td>${item.processos}</td>
                            <td><span class="status-badge ${getStatusClass(item.status)}">${item.status}</span></td>`
                        : `<td>${item.codigo}</td>
                            <td>${item.fornecedor}</td>
                            <td>${item.data}</td>
                            <td>${item.tipo}</td>
                            <td>${item.quantidade}</td>`}
                    <td><button class="view-btn" onclick="viewItem('${item.id}')"><i class="fas fa-eye"></i> Visualizar</button></td>
                </tr>`;
    });
    
    html += `</tbody></table></div>`;
    return html;
}

function getStatusClass(status) {
    const statusMap = {
        'Em andamento': 'status-in-progress',
        'Aguardando revisão': 'status-pending',
        'Pronto para entrega': 'status-ready',
        'Entregue': 'status-delivered',
        'Ativo': 'status-active',
        'Inativo': 'status-inactive',
        'Em Manutenção': 'status-maintenance'
    };
    return statusMap[status] || '';
}

function showTable(tableType) {
    const container = document.getElementById('table-container');
    const filtroContainer = document.getElementById('filtro-container');
    
    container.classList.remove('initial-state');
    
    // Atualiza a tabela atual
    currentTableType = tableType;
    
    // Mostra ou esconde o filtro baseado no tipo de tabela
    if (tableType === 'settings') {
        filtroContainer.classList.remove('show');
        showSettings();
        return;
    } else {
        filtroContainer.classList.add('show');
    }
    
    let html = '';
    
    if (tableType === 'production') {
        html = createTable(moldData.production, 'Moldes em Produção', true);
        // Configura filtros para moldes em produção
        document.getElementById('filtro-status').style.display = 'none';
        document.getElementById('filtro-tipo-aco').style.display = 'none';
        document.querySelector('label[for="numero-molde"]').textContent = 'Número do Molde:';
        document.querySelector('label[for="cliente"]').textContent = 'Cliente:';
    } 
    else if (tableType === 'finished') {
        html = createTable(moldData.finished, 'Moldes Finalizados', true);
        // Configura filtros para moldes finalizados
        document.getElementById('filtro-status').style.display = 'block';
        document.getElementById('filtro-tipo-aco').style.display = 'none';
        document.querySelector('label[for="numero-molde"]').textContent = 'Número do Molde:';
        document.querySelector('label[for="cliente"]').textContent = 'Cliente:';
    } 
    else if (tableType === 'stock') {
        html = createTable(moldData.stock, 'Estoque de Aços', false);
        // Configura filtros para estoque
        document.getElementById('filtro-status').style.display = 'none';
        document.getElementById('filtro-tipo-aco').style.display = 'block';
        document.querySelector('label[for="numero-molde"]').textContent = 'Código do Aço:';
        document.querySelector('label[for="cliente"]').textContent = 'Fornecedor:';
    }

    container.innerHTML = html;
}

// Função para filtrar a tabela
function filtrarTabela(filtros) {
    const linhas = document.querySelectorAll('.data-table tbody tr');
    const tabela = currentTableType;
    let visibleCount = 0;
    
    currentData.forEach((item, index) => {
        const linha = linhas[index];
        let deveMostrar = true;
        
        if (tabela === 'production' || tabela === 'finished') {
            if (filtros.numero && !item.id.includes(filtros.numero)) {
                deveMostrar = false;
            }
            if (filtros.cliente && !item.cliente.toLowerCase().includes(filtros.cliente.toLowerCase())) {
                deveMostrar = false;
            }
            if (tabela === 'finished' && filtros.status && item.status !== filtros.status) {
                deveMostrar = false;
            }
            if ((filtros.dataInicio && item.data < filtros.dataInicio) || 
                (filtros.dataFim && item.data > filtros.dataFim)) {
                deveMostrar = false;
            }
        } else if (tabela === 'stock') {
            if (filtros.codigo && !item.codigo.includes(filtros.codigo)) {
                deveMostrar = false;
            }
            if (filtros.fornecedor && !item.fornecedor.toLowerCase().includes(filtros.fornecedor.toLowerCase())) {
                deveMostrar = false;
            }
            if (filtros.tipo && item.tipo !== filtros.tipo) {
                deveMostrar = false;
            }
            if ((filtros.dataInicio && item.data < filtros.dataInicio) || 
                (filtros.dataFim && item.data > filtros.dataFim)) {
                deveMostrar = false;
            }
        }
        
        if (deveMostrar) {
            linha.style.display = '';
            visibleCount++;
        } else {
            linha.style.display = 'none';
        }
    });
    
    // Atualiza o contador de resultados
    const resultCount = document.querySelector('.result-count');
    if (resultCount) {
        resultCount.textContent = `${visibleCount} resultados encontrados`;
    }
}

// Configuração dos eventos dos filtros
document.addEventListener('DOMContentLoaded', function() {
    const btnAplicar = document.getElementById('aplicar-filtro');
    const btnLimpar = document.getElementById('limpar-filtro');
    const toggleFiltros = document.getElementById('toggle-filtros');
    const filtroContent = document.getElementById('filtro-content');

    // Toggle para mostrar/ocultar filtros
    toggleFiltros.addEventListener('click', function() {
        filtroContent.style.display = filtroContent.style.display === 'none' ? 'block' : 'none';
        this.classList.toggle('collapsed');
        this.innerHTML = filtroContent.style.display === 'none' 
            ? '<i class="fas fa-chevron-down"></i> Mostrar' 
            : '<i class="fas fa-chevron-up"></i> Ocultar';
    });

    // Aplicar filtros
    btnAplicar.addEventListener('click', function() {
        const filtros = {};
        
        if (currentTableType === 'production' || currentTableType === 'finished') {
            filtros.numero = document.getElementById('numero-molde').value;
            filtros.cliente = document.getElementById('cliente').value;
            filtros.dataInicio = document.getElementById('data-inicio').value;
            filtros.dataFim = document.getElementById('data-fim').value;
            
            if (currentTableType === 'finished') {
                filtros.status = document.getElementById('status-molde').value;
            }
        } else if (currentTableType === 'stock') {
            filtros.codigo = document.getElementById('numero-molde').value;
            filtros.fornecedor = document.getElementById('cliente').value;
            filtros.dataInicio = document.getElementById('data-inicio').value;
            filtros.dataFim = document.getElementById('data-fim').value;
            filtros.tipo = document.getElementById('tipo-aco').value;
        }
        
        filtrarTabela(filtros);
    });

    // Limpar filtros
    btnLimpar.addEventListener('click', function() {
        document.querySelectorAll('.filtro-input').forEach(input => {
            input.value = '';
        });
        
        document.querySelectorAll('.filtro-select').forEach(select => {
            select.value = '';
        });
        
        // Mostrar todos os itens novamente
        document.querySelectorAll('.data-table tbody tr').forEach(linha => {
            linha.style.display = '';
        });
        
        // Atualizar contador
        const resultCount = document.querySelector('.result-count');
        if (resultCount) {
            resultCount.textContent = `${currentData.length} resultados encontrados`;
        }
    });

    // Configuração do menu lateral (seu código existente)
    const check = document.getElementById('check');
    const overlay = document.getElementById('overlay');
    const sidebar = document.querySelector('.sidebar');
    const btn = document.getElementById('btn');

    overlay.addEventListener('click', function() {
        check.checked = false;
        updateSidebarState();
    });

    function updateSidebarState() {
        if (check.checked) {
            overlay.style.display = 'block';
            setTimeout(() => {
                overlay.style.opacity = '1';
                overlay.style.visibility = 'visible';
            }, 10);
        } else {
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }

    check.addEventListener('change', updateSidebarState);

    document.addEventListener('click', function(e) {
        if (check.checked && 
            !sidebar.contains(e.target) && 
            e.target !== check && 
            e.target !== btn && 
            !btn.contains(e.target)) {
            setTimeout(() => {
                check.checked = false;
                updateSidebarState();
            }, 10);
        }
    });
});

// Configuração do menu lateral
const check = document.getElementById('check');
const overlay = document.getElementById('overlay');
const sidebar = document.querySelector('.sidebar');
const btn = document.getElementById('btn');

// Fechar menu ao clicar no overlay
overlay.addEventListener('click', function() {
    check.checked = false;
    updateSidebarState();
});

function updateSidebarState() {
    if (check.checked) {
        overlay.style.display = 'block';
        setTimeout(() => {
            overlay.style.opacity = '1';
            overlay.style.visibility = 'visible';
        }, 10);
    } else {
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }
}

// Fechar menu ao clicar fora
document.addEventListener('click', function(e) {
    // Verifica se o clique foi fora do menu, não no checkbox ou no botão do menu
    if (check.checked && 
        !sidebar.contains(e.target) && 
        e.target !== check && 
        e.target !== btn && 
        !btn.contains(e.target)) {
        check.checked = false;
        updateSidebarState();
    }
});

check.addEventListener('change', updateSidebarState);

// });