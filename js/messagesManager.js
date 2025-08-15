// Gestionnaire de messages pour le dashboard admin
class MessagesManager {
    constructor() {
        this.messages = [];
        this.currentPage = 1;
        this.messagesPerPage = 10;
        this.currentFilter = 'all';
        this.currentTypeFilter = 'all';
        this.init();
    }

    init() {
        this.loadMessages();
        this.setupEventListeners();
        this.renderMessages();
    }

    loadMessages() {
        this.messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        this.sortMessages();
    }

    sortMessages() {
        // Trier par date (plus récent en premier)
        this.messages.sort((a, b) => new Date(b.dateEnvoi) - new Date(a.dateEnvoi));
    }

    setupEventListeners() {
        // Filtres
        const statusFilter = document.getElementById('message-status-filter');
        const typeFilter = document.getElementById('message-type-filter');
        
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.currentPage = 1;
                this.renderMessages();
            });
        }
        
        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.currentTypeFilter = e.target.value;
                this.currentPage = 1;
                this.renderMessages();
            });
        }
    }

    getFilteredMessages() {
        let filtered = this.messages;

        // Filtre par statut
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(msg => {
                switch (this.currentFilter) {
                    case 'new': return !msg.lu;
                    case 'read': return msg.lu && !msg.repondu;
                    case 'replied': return msg.repondu;
                    default: return true;
                }
            });
        }

        // Filtre par type
        if (this.currentTypeFilter !== 'all') {
            filtered = filtered.filter(msg => msg.sujet === this.currentTypeFilter);
        }

        return filtered;
    }

    renderMessages() {
        const messagesList = document.getElementById('messages-list');
        if (!messagesList) return;

        const filteredMessages = this.getFilteredMessages();
        const startIndex = (this.currentPage - 1) * this.messagesPerPage;
        const endIndex = startIndex + this.messagesPerPage;
        const pageMessages = filteredMessages.slice(startIndex, endIndex);

        if (pageMessages.length === 0) {
            messagesList.innerHTML = `
                <div class="no-messages">
                    <i class="fas fa-inbox"></i>
                    <p>Aucun message trouvé</p>
                </div>
            `;
            return;
        }

        messagesList.innerHTML = pageMessages.map(message => this.createMessageCard(message)).join('');
        this.updatePagination(filteredMessages.length);
    }

    createMessageCard(message) {
        const statusClass = message.repondu ? 'replied' : message.lu ? 'read' : 'new';
        const statusText = message.repondu ? 'Répondu' : message.lu ? 'Lu' : 'Nouveau';
        const urgencyClass = message.urgence === 'urgent' ? 'urgent' : message.urgence === 'important' ? 'important' : 'normal';
        
        return `
            <div class="message-card ${statusClass}" data-message-id="${message.id}">
                <div class="message-header">
                    <div class="message-info">
                        <h4 class="message-subject">${this.escapeHtml(message.sujet)}</h4>
                        <span class="message-author">${this.escapeHtml(message.nom)}</span>
                        <span class="message-email">${this.escapeHtml(message.email)}</span>
                        <span class="message-date">${this.formatDate(message.dateEnvoi)}</span>
                    </div>
                    <div class="message-status">
                        <span class="status-badge ${statusClass}">${statusText}</span>
                        <span class="urgency-badge ${urgencyClass}">${message.urgence}</span>
                    </div>
                </div>
                <div class="message-preview">
                    <p>${this.escapeHtml(message.message.substring(0, 150))}${message.message.length > 150 ? '...' : ''}</p>
                </div>
                <div class="message-actions">
                    <button class="action-btn" onclick="messagesManager.viewMessage('${message.id}')">
                        <i class="fas fa-eye"></i> Voir
                    </button>
                    ${!message.lu ? `
                        <button class="action-btn" onclick="messagesManager.markAsRead('${message.id}')">
                            <i class="fas fa-check"></i> Marquer comme lu
                        </button>
                    ` : ''}
                    ${!message.repondu ? `
                        <button class="action-btn" onclick="messagesManager.replyToMessage('${message.id}')">
                            <i class="fas fa-reply"></i> Répondre
                        </button>
                    ` : ''}
                    <button class="action-btn delete-btn" onclick="messagesManager.deleteMessage('${message.id}')">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </div>
            </div>
        `;
    }

    updatePagination(totalMessages) {
        const totalPages = Math.ceil(totalMessages / this.messagesPerPage);
        const currentPageSpan = document.getElementById('current-page');
        const totalPagesSpan = document.getElementById('total-pages');
        
        if (currentPageSpan) currentPageSpan.textContent = this.currentPage;
        if (totalPagesSpan) totalPagesSpan.textContent = totalPages;
    }

    viewMessage(messageId) {
        const message = this.messages.find(m => m.id === messageId);
        if (!message) return;

        // Marquer comme lu si ce n'est pas déjà fait
        if (!message.lu) {
            this.markAsRead(messageId);
        }

        // Afficher le message dans une modal
        this.showMessageModal(message);
    }

    showMessageModal(message) {
        const modal = document.createElement('div');
        modal.className = 'message-modal';
        modal.innerHTML = `
            <div class="message-modal-backdrop"></div>
            <div class="message-modal-content">
                <div class="message-modal-header">
                    <h3>${this.escapeHtml(message.sujet)}</h3>
                    <button class="close-btn" onclick="this.closest('.message-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="message-modal-body">
                    <div class="message-details">
                        <p><strong>De:</strong> ${this.escapeHtml(message.nom)} (${this.escapeHtml(message.email)})</p>
                        <p><strong>Date:</strong> ${this.formatDate(message.dateEnvoi)}</p>
                        <p><strong>Urgence:</strong> ${message.urgence}</p>
                        <p><strong>Newsletter:</strong> ${message.newsletter ? 'Oui' : 'Non'}</p>
                    </div>
                    <div class="message-content">
                        <h4>Message:</h4>
                        <p>${this.escapeHtml(message.message)}</p>
                    </div>
                </div>
                <div class="message-modal-footer">
                    <button class="action-btn" onclick="messagesManager.replyToMessage('${message.id}')">
                        <i class="fas fa-reply"></i> Répondre
                    </button>
                    <button class="action-btn" onclick="this.closest('.message-modal').remove()">
                        <i class="fas fa-times"></i> Fermer
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    markAsRead(messageId) {
        const message = this.messages.find(m => m.id === messageId);
        if (message) {
            message.lu = true;
            message.statut = 'read';
            this.saveMessages();
            this.renderMessages();
        }
    }

    replyToMessage(messageId) {
        const message = this.messages.find(m => m.id === messageId);
        if (!message) return;

        // Ouvrir l'email client avec les informations pré-remplies
        const subject = `Re: ${message.sujet}`;
        const body = `Bonjour ${message.nom},\n\nMerci pour votre message.\n\nCordialement,\nL'équipe PAESSE Keur Massar`;
        
        window.open(`mailto:${message.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
        
        // Marquer comme répondu
        message.repondu = true;
        message.statut = 'replied';
        this.saveMessages();
        this.renderMessages();
    }

    deleteMessage(messageId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
            this.messages = this.messages.filter(m => m.id !== messageId);
            this.saveMessages();
            this.renderMessages();
        }
    }

    markAllAsRead() {
        this.messages.forEach(message => {
            message.lu = true;
            message.statut = 'read';
        });
        this.saveMessages();
        this.renderMessages();
    }

    deleteSelectedMessages() {
        const selectedMessages = document.querySelectorAll('.message-card input[type="checkbox"]:checked');
        if (selectedMessages.length === 0) {
            alert('Aucun message sélectionné');
            return;
        }

        if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedMessages.length} message(s) ?`)) {
            selectedMessages.forEach(checkbox => {
                const messageId = checkbox.closest('.message-card').dataset.messageId;
                this.messages = this.messages.filter(m => m.id !== messageId);
            });
            this.saveMessages();
            this.renderMessages();
        }
    }

    saveMessages() {
        localStorage.setItem('contactMessages', JSON.stringify(this.messages));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Fonctions globales pour les boutons
function markAllAsRead() {
    if (messagesManager) messagesManager.markAllAsRead();
}

function deleteSelectedMessages() {
    if (messagesManager) messagesManager.deleteSelectedMessages();
}

function previousPage() {
    if (messagesManager && messagesManager.currentPage > 1) {
        messagesManager.currentPage--;
        messagesManager.renderMessages();
    }
}

function nextPage() {
    if (messagesManager) {
        const filteredMessages = messagesManager.getFilteredMessages();
        const totalPages = Math.ceil(filteredMessages.length / messagesManager.messagesPerPage);
        if (messagesManager.currentPage < totalPages) {
            messagesManager.currentPage++;
            messagesManager.renderMessages();
        }
    }
}

// Initialisation
let messagesManager;
document.addEventListener('DOMContentLoaded', () => {
    messagesManager = new MessagesManager();
}); 