// CRM GO NOW Tours - Sistema de Gestão de Leads
// Configurações e Variáveis Globais
const CORRECT_PASSWORD = 'Mxcf1545*';
let leads = [];
let currentEditingId = null;
let filteredLeads = [];

// Elementos DOM
document.addEventListener('DOMContentLoaded', function() {
    // Inicialização
    initializeSystem();
    loadSampleData();
});

function initializeSystem() {
    // Verificar se já está logado
    if (localStorage.getItem('loggedIn') === 'true') {
        showCRMSystem();
    }
    
    // Event Listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Login
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('togglePassword').addEventListener('click', togglePasswordVisibility);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // CRM Functions
    document.getElementById('addLeadBtn').addEventListener('click', openAddLeadModal);
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('statusFilter').addEventListener('change', handleFilter);
    document.getElementById('categoryFilter').addEventListener('change', handleFilter);
    document.getElementById('exportBtn').addEventListener('click', exportData);
    
    // Modal
    document.getElementById('closeModal').addEventListener('click', closeLeadModal);
    document.getElementById('cancelBtn').addEventListener('click', closeLeadModal);
    document.getElementById('leadForm').addEventListener('submit', handleLeadSubmit);
    
    // Fechar modal clicando fora
    document.getElementById('leadModal').addEventListener('click', function(e) {
        if (e.target === document.getElementById('leadModal')) {
            closeLeadModal();
        }
    });
}

// Sistema de Login
function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    
    if (password === CORRECT_PASSWORD) {
        localStorage.setItem('loggedIn', 'true');
        showCRMSystem();
        document.getElementById('loginError').style.display = 'none';
    } else {
        document.getElementById('loginError').style.display = 'block';
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    }
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    
    const icon = document.getElementById('togglePassword').querySelector('i');
    icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
}

function handleLogout() {
    localStorage.removeItem('loggedIn');
    showLoginScreen();
}

function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('crmSystem').style.display = 'none';
    document.getElementById('password').value = '';
    document.getElementById('password').focus();
}

function showCRMSystem() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('crmSystem').style.display = 'block';
    updateStats();
    renderLeads();
}

// Dados de Exemplo
function loadSampleData() {
    const sampleLeads = [
        {
            id: 1,
            clientName: 'João Silva',
            whatsapp: '+55 21 99999-1234',
            contactOrigin: 'Instagram',
            tourInterest: 'Helicóptero',
            arrivalDate: '2025-07-25',
            leadStatus: 'Novo',
            language: 'Português',
            lastInteraction: '2025-07-22',
            nextInteraction: '2025-07-24',
            observations: 'Cliente interessado em voo panorâmico'
        },
        {
            id: 2,
            clientName: 'Maria Santos',
            whatsapp: '+55 11 88888-5678',
            contactOrigin: 'Site',
            tourInterest: 'Cristo Redentor',
            arrivalDate: '2025-07-28',
            leadStatus: 'Conversando',
            language: 'Português',
            lastInteraction: '2025-07-21',
            nextInteraction: '2025-07-25',
            observations: 'Família com 2 crianças'
        },
        {
            id: 3,
            clientName: 'John Smith',
            whatsapp: '+1 555 123-4567',
            contactOrigin: 'Google',
            tourInterest: 'City Tour',
            arrivalDate: '2025-08-15',
            leadStatus: 'Novo',
            language: 'Inglês',
            lastInteraction: '2025-07-22',
            nextInteraction: '2025-07-26',
            observations: 'Turista americano, primeira vez no Rio'
        },
        {
            id: 4,
            clientName: 'Carlos Rodriguez',
            whatsapp: '+34 666 789-012',
            contactOrigin: 'Indicação',
            tourInterest: 'Asa Delta',
            arrivalDate: '2025-08-02',
            leadStatus: 'Confirmado',
            language: 'Espanhol',
            lastInteraction: '2025-07-20',
            nextInteraction: '',
            observations: 'Confirmado para voo duplo'
        },
        {
            id: 5,
            clientName: 'Ana Costa',
            whatsapp: '+55 21 77777-9999',
            contactOrigin: 'WhatsApp',
            tourInterest: 'Pão de Açúcar',
            arrivalDate: '',
            leadStatus: 'Planejando',
            language: 'Português',
            lastInteraction: '2025-07-18',
            nextInteraction: '2025-07-30',
            observations: 'Ainda definindo datas da viagem'
        }
    ];
    
    // Carregar dados do localStorage ou usar dados de exemplo
    const savedLeads = localStorage.getItem('leadsData');
    if (savedLeads) {
        leads = JSON.parse(savedLeads);
    } else {
        leads = sampleLeads;
        saveLeads();
    }
    
    filteredLeads = [...leads];
}

// Funções de Categoria Automática
function calculateCategory(arrivalDate) {
    if (!arrivalDate) return 'Sem data';
    
    const today = new Date();
    const arrival = new Date(arrivalDate);
    const diffTime = arrival - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 3) return 'Urgente';
    if (diffDays <= 10) return 'Próximo';
    if (diffDays <= 30) return 'Planejando';
    return 'Futuro';
}

// Renderização da Tabela
function renderLeads() {
    const tableBody = document.getElementById('leadsTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    filteredLeads.forEach(lead => {
        const category = calculateCategory(lead.arrivalDate);
        const row = createLeadRow(lead, category);
        tableBody.appendChild(row);
    });
    
    updateStats();
}

function createLeadRow(lead, category) {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${lead.clientName}</td>
        <td>${lead.whatsapp}</td>
        <td>${lead.contactOrigin}</td>
        <td>${lead.tourInterest}</td>
        <td>${formatDate(lead.arrivalDate)}</td>
        <td><span class="category-badge category-${category.toLowerCase().replace(' ', '-')}">${category}</span></td>
        <td><span class="status-badge status-${lead.leadStatus.toLowerCase()}">${lead.leadStatus}</span></td>
        <td>${lead.language}</td>
        <td>${formatDate(lead.lastInteraction)}</td>
        <td>${formatDate(lead.nextInteraction)}</td>
        <td>
            <div class="action-buttons">
                <button class="action-btn whatsapp-btn" onclick="openWhatsApp('${lead.whatsapp}', '${lead.clientName}')" title="WhatsApp">
                    <i class="fab fa-whatsapp"></i>
                </button>
                <button class="action-btn edit-btn" onclick="editLead(${lead.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteLead(${lead.id})" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Estatísticas
function updateStats() {
    const total = leads.length;
    const urgent = leads.filter(lead => calculateCategory(lead.arrivalDate) === 'Urgente').length;
    
    const totalElement = document.getElementById('totalLeads');
    const urgentElement = document.getElementById('urgentLeads');
    
    if (totalElement) totalElement.textContent = total;
    if (urgentElement) urgentElement.textContent = urgent;
}

// Modal de Lead
function openAddLeadModal() {
    currentEditingId = null;
    document.getElementById('modalTitle').textContent = 'Novo Lead';
    document.getElementById('leadForm').reset();
    document.getElementById('leadModal').style.display = 'flex';
    document.getElementById('clientName').focus();
}

function editLead(id) {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    
    currentEditingId = id;
    document.getElementById('modalTitle').textContent = 'Editar Lead';
    
    // Preencher formulário
    document.getElementById('clientName').value = lead.clientName;
    document.getElementById('whatsapp').value = lead.whatsapp;
    document.getElementById('contactOrigin').value = lead.contactOrigin;
    document.getElementById('tourInterest').value = lead.tourInterest;
    document.getElementById('arrivalDate').value = lead.arrivalDate;
    document.getElementById('leadStatus').value = lead.leadStatus;
    document.getElementById('language').value = lead.language;
    document.getElementById('nextInteraction').value = lead.nextInteraction;
    document.getElementById('observations').value = lead.observations;
    
    document.getElementById('leadModal').style.display = 'flex';
}

function closeLeadModal() {
    document.getElementById('leadModal').style.display = 'none';
    document.getElementById('leadForm').reset();
    currentEditingId = null;
}

function handleLeadSubmit(e) {
    e.preventDefault();
    
    const leadData = {
        clientName: document.getElementById('clientName').value,
        whatsapp: document.getElementById('whatsapp').value,
        contactOrigin: document.getElementById('contactOrigin').value,
        tourInterest: document.getElementById('tourInterest').value,
        arrivalDate: document.getElementById('arrivalDate').value,
        leadStatus: document.getElementById('leadStatus').value,
        language: document.getElementById('language').value,
        nextInteraction: document.getElementById('nextInteraction').value,
        observations: document.getElementById('observations').value,
        lastInteraction: new Date().toISOString().split('T')[0]
    };
    
    if (currentEditingId) {
        // Editar lead existente
        const index = leads.findIndex(l => l.id === currentEditingId);
        if (index !== -1) {
            leads[index] = { ...leads[index], ...leadData };
        }
    } else {
        // Adicionar novo lead
        const newId = Math.max(...leads.map(l => l.id), 0) + 1;
        leads.push({ id: newId, ...leadData });
    }
    
    saveLeads();
    applyFilters();
    renderLeads();
    closeLeadModal();
    
    // Mostrar feedback
    showNotification(currentEditingId ? 'Lead atualizado com sucesso!' : 'Lead adicionado com sucesso!');
}

function deleteLead(id) {
    if (confirm('Tem certeza que deseja excluir este lead?')) {
        leads = leads.filter(l => l.id !== id);
        saveLeads();
        applyFilters();
        renderLeads();
        showNotification('Lead excluído com sucesso!');
    }
}

// Busca e Filtros
function handleSearch() {
    applyFilters();
}

function handleFilter() {
    applyFilters();
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilterValue = document.getElementById('statusFilter').value;
    const categoryFilterValue = document.getElementById('categoryFilter').value;
    
    filteredLeads = leads.filter(lead => {
        const category = calculateCategory(lead.arrivalDate);
        
        const matchesSearch = !searchTerm || 
            lead.clientName.toLowerCase().includes(searchTerm) ||
            lead.whatsapp.includes(searchTerm) ||
            lead.contactOrigin.toLowerCase().includes(searchTerm) ||
            lead.tourInterest.toLowerCase().includes(searchTerm);
            
        const matchesStatus = !statusFilterValue || lead.leadStatus === statusFilterValue;
        const matchesCategory = !categoryFilterValue || category === categoryFilterValue;
        
        return matchesSearch && matchesStatus && matchesCategory;
    });
    
    renderLeads();
}

// WhatsApp Integration
function openWhatsApp(phone, name) {
    const message = `Olá ${name}! Aqui é da GO NOW Tours. Como posso ajudá-lo com seu tour no Rio de Janeiro?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone.replace(/[^\d]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

// Export Data
function exportData() {
    const csvContent = generateCSV();
    downloadCSV(csvContent, 'crm-gonow-tours.csv');
    showNotification('Dados exportados com sucesso!');
}

function generateCSV() {
    const headers = [
        'Nome do Cliente',
        'WhatsApp',
        'Origem do Contato',
        'Tour de Interesse',
        'Data de Chegada',
        'Categoria',
        'Status',
        'Idioma',
        'Última Interação',
        'Próxima Interação',
        'Observações'
    ];
    
    const rows = filteredLeads.map(lead => {
        const category = calculateCategory(lead.arrivalDate);
        return [
            lead.clientName,
            lead.whatsapp,
            lead.contactOrigin,
            lead.tourInterest,
            lead.arrivalDate || '',
            category,
            lead.leadStatus,
            lead.language,
            lead.lastInteraction || '',
            lead.nextInteraction || '',
            lead.observations || ''
        ];
    });
    
    const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
    
    return csvContent;
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Local Storage
function saveLeads() {
    localStorage.setItem('leadsData', JSON.stringify(leads));
}

// Notifications
function showNotification(message) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #007A87;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + N para novo lead
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        if (document.getElementById('crmSystem').style.display !== 'none') {
            openAddLeadModal();
        }
    }
    
    // ESC para fechar modal
    if (e.key === 'Escape') {
        if (document.getElementById('leadModal').style.display === 'flex') {
            closeLeadModal();
        }
    }
});

// Auto-save quando sair da página
window.addEventListener('beforeunload', function() {
    saveLeads();
});



