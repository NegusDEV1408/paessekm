// JavaScript pour la page G.I.E avec le même design que la page association
// Affiche les 600 G.I.E depuis la base de données avec des fonctionnalités avancées

class GIEDisplay {
    constructor() {
        this.gieGrid = document.getElementById('gieGrid');
        this.communeFilter = document.getElementById('communeFilter');
        this.sectorFilter = document.getElementById('sectorFilter');
        this.sortFilter = document.getElementById('sortFilter');
        this.typeFilter = document.getElementById('typeFilter');
        this.resultCount = document.getElementById('resultCount');
        this.pagination = document.getElementById('pagination');
        
        this.currentGIE = [];
        this.filteredGIE = [];
        this.currentPage = 1;
        this.itemsPerPage = 9; // 3 colonnes x 3 rangées
        this.hideAuthWarningBanner = false; // Flag to suppress banner
        
        this.init();
    }

    init() {
        this.loadGIEFromDatabase();
        this.initializeFilters();
        this.updateStats();
        this.bindEvents();
        this.renderGIE();
    }

    loadGIEFromDatabase() {
        // Priorité au stockage local (données du dashboard)
        if (typeof gieStorage !== 'undefined') {
            const stored = gieStorage.getAllGIE();
            if (Array.isArray(stored) && stored.length > 0) {
                this.currentGIE = stored;
                this.filteredGIE = [...this.currentGIE];
                console.log(`Chargement de ${this.currentGIE.length} G.I.E depuis le stockage local`);
                return;
            }
        }
        // Sinon, fallback sur la base statique de 600 GIE
        if (typeof gieDatabase !== 'undefined' && Array.isArray(gieDatabase) && gieDatabase.length > 0) {
            this.currentGIE = gieDatabase;
            this.filteredGIE = [...this.currentGIE];
            console.log(`Chargement de ${this.currentGIE.length} G.I.E depuis la base statique`);
        } else {
            console.error('Aucune source de données G.I.E disponible');
            this.currentGIE = [];
            this.filteredGIE = [];
        }
    }

    initializeFilters() {
        // Initialiser les filtres avec les données disponibles
        const communes = [...new Set(this.currentGIE.map(gie => gie.commune))].sort();
        const sectors = [...new Set(this.currentGIE.map(gie => gie.secteur))].sort();
        const types = [...new Set(this.currentGIE.map(gie => gie.type))].sort();

        // Remplir le filtre des communes
        communes.forEach(commune => {
            const option = document.createElement('option');
            option.value = commune;
            option.textContent = commune;
            this.communeFilter.appendChild(option);
        });

        // Remplir le filtre des secteurs
        sectors.forEach(sector => {
            const option = document.createElement('option');
            option.value = sector;
            option.textContent = sector;
            this.sectorFilter.appendChild(option);
        });

        // Remplir le filtre des types
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            this.typeFilter.appendChild(option);
        });
    }

    updateStats() {
        // Mettre à jour les statistiques
        const totalGIE = document.getElementById('total-gie');
        const totalCommunes = document.getElementById('total-communes');
        const totalSectors = document.getElementById('total-sectors');
        const totalMembers = document.getElementById('total-members');

        if (totalGIE) totalGIE.textContent = this.currentGIE.length;
        if (totalCommunes) totalCommunes.textContent = [...new Set(this.currentGIE.map(gie => gie.commune))].length;
        if (totalSectors) totalSectors.textContent = [...new Set(this.currentGIE.map(gie => gie.secteur))].length;
        
        // Calculer le total des membres
        const totalMembersCount = this.currentGIE.reduce((sum, gie) => sum + parseInt(gie.nombre), 0);
        if (totalMembers) totalMembers.textContent = totalMembersCount.toLocaleString();
    }

    bindEvents() {
        // Écouter les changements de filtres
        this.communeFilter.addEventListener('change', () => this.filterGIE());
        this.sectorFilter.addEventListener('change', () => this.filterGIE());
        this.sortFilter.addEventListener('change', () => this.filterGIE());
        this.typeFilter.addEventListener('change', () => this.filterGIE());
        
        // Écouter les boutons de vue
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.closest('.view-btn').dataset.view;
                this.setView(view);
            });
        });
    }
    
    setView(view) {
        // Mettre à jour les boutons
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Mettre à jour l'affichage
        if (this.gieGrid) {
            this.gieGrid.className = `gie-grid ${view}-view`;
        }
        
        // Re-rendre les cartes avec la nouvelle vue
        this.renderGIE();
    }

    filterGIE() {
        const communeValue = this.communeFilter.value;
        const sectorValue = this.sectorFilter.value;
        const typeValue = this.typeFilter.value;
        const sortValue = this.sortFilter.value;

        // Filtrer les G.I.E
        this.filteredGIE = this.currentGIE.filter(gie => {
            const matchesCommune = !communeValue || gie.commune === communeValue;
            const matchesSector = !sectorValue || gie.secteur === sectorValue;
            const matchesType = !typeValue || gie.type === typeValue;

            return matchesCommune && matchesSector && matchesType;
        });

        // Trier les résultats
        this.sortGIE(sortValue);

        // Réinitialiser à la première page
        this.currentPage = 1;

        // Afficher les résultats
        this.renderGIE();
    }

    sortGIE(sortBy) {
        switch (sortBy) {
            case 'nom':
                this.filteredGIE.sort((a, b) => a.nom.localeCompare(b.nom));
                break;
            case 'commune':
                this.filteredGIE.sort((a, b) => a.commune.localeCompare(b.commune));
                break;
            case 'nombre':
                this.filteredGIE.sort((a, b) => parseInt(b.nombre) - parseInt(a.nombre));
                break;
            case 'dateCreation':
                this.filteredGIE.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));
                break;
            default:
                this.filteredGIE.sort((a, b) => a.nom.localeCompare(b.nom));
        }
    }

    renderGIE() {
        if (!this.gieGrid) return;

        // Show auth banner for non-authorized users
        (function(){
            let canViewSensitive = false;
            try {
                const siteRaw = sessionStorage.getItem('currentSiteUser') || localStorage.getItem('currentSiteUser');
                const siteUser = siteRaw ? JSON.parse(siteRaw) : null;
                if (siteUser) canViewSensitive = true;
            } catch {}
            if (!canViewSensitive) {
                const allowedEmails = new Set([
                    'Mamadou@negus-agency.com',
                    'test@keurmassar.sn',
                    'superviseur@keurmassar.sn',
                    'gie.manager@keurmassar.sn'
                ]);
                try {
                    const raw = sessionStorage.getItem('currentAdminUser') || localStorage.getItem('currentAdminUser');
                    const adminUser = raw ? JSON.parse(raw) : null;
                    canViewSensitive = adminUser && allowedEmails.has(adminUser.email);
                } catch {}
            }
            let banner = document.getElementById('authWarningBannerGie');
            if (!canViewSensitive && !this.hideAuthWarningBanner) {
                if (!banner) {
                    banner = document.createElement('div');
                    banner.id = 'authWarningBannerGie';
                    banner.innerHTML = `
                        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;background:#fff3cd;border:1px solid #ffeeba;color:#856404;padding:10px 12px;border-radius:8px;margin:0 0 12px 0;">
                            <div style="display:flex;align-items:center;gap:10px;">
                                <i class="fas fa-lock"></i>
                                <span>Certains détails sont masqués. <a href="../user-login.html" id="gieAuthLoginLink" style="color:#0c5460;text-decoration:underline;">Connectez-vous</a> pour voir toutes les informations.</span>
                            </div>
                            <button id="closeAuthBannerGie" style="border:none;background:transparent;color:#856404;cursor:pointer;font-size:16px;" title="Fermer">×</button>
                        </div>
                    `;
                    this.gieGrid.parentElement && this.gieGrid.parentElement.insertBefore(banner, this.gieGrid);
                    const closeBtn = document.getElementById('closeAuthBannerGie');
                    if (closeBtn) {
                        closeBtn.addEventListener('click', () => {
                            this.hideAuthWarningBanner = true;
                            banner.remove();
                        });
                    }
                    const loginLink = document.getElementById('gieAuthLoginLink');
                    if (loginLink) {
                        loginLink.addEventListener('click', () => {
                            try { sessionStorage.setItem('postLoginRedirect', window.location.href); } catch {}
                        });
                    }
                }
            } else if (banner) {
                banner.remove();
            }
        }).call(this);

        this.gieGrid.innerHTML = '';

        if (this.filteredGIE.length === 0) {
            this.gieGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>Aucun G.I.E trouvé</h3>
                    <p>Aucun G.I.E ne correspond à vos critères de recherche.</p>
                </div>
            `;
            this.resultCount.textContent = '0';
            this.pagination.innerHTML = '';
            return;
        }

        // Calculer la pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const gieToShow = this.filteredGIE.slice(startIndex, endIndex);

        // Créer les cartes G.I.E
        gieToShow.forEach(gie => {
            const gieCard = this.createGIECard(gie);
            this.gieGrid.appendChild(gieCard);
        });

        // Mettre à jour le compteur
        this.resultCount.textContent = this.filteredGIE.length;

        // Afficher la pagination
        this.renderPagination();
    }

    createGIECard(gie) {
        const card = document.createElement('div');
        card.className = 'gie-card';
        
        // Vérifier si on est en vue liste
        const isListView = this.gieGrid && this.gieGrid.classList.contains('list-view');
        
        // Check privileged users (site members first, then admin whitelist)
        let canViewSensitive = false;
        try {
            const siteRaw = sessionStorage.getItem('currentSiteUser') || localStorage.getItem('currentSiteUser');
            const siteUser = siteRaw ? JSON.parse(siteRaw) : null;
            if (siteUser) canViewSensitive = true;
        } catch {}
        if (!canViewSensitive) {
            const allowedEmails = new Set([
                'Mamadou@negus-agency.com',
                'test@keurmassar.sn',
                'superviseur@keurmassar.sn',
                'gie.manager@keurmassar.sn'
            ]);
            try {
                const raw = sessionStorage.getItem('currentAdminUser') || localStorage.getItem('currentAdminUser');
                const adminUser = raw ? JSON.parse(raw) : null;
                canViewSensitive = adminUser && allowedEmails.has(adminUser.email);
            } catch {}
        }
        
        card.innerHTML = `
            <div class="gie-card-header">
                <div class="gie-logo">
                    <i class="fas fa-building"></i>
                </div>
                <div class="gie-type-badge">${gie.type}</div>
                <div class="gie-statut-badge">${gie.statut}</div>
            </div>
            <div class="gie-card-body">
                <h3 class="gie-name">${gie.nom}</h3>
                <div class="gie-sector">
                    <i class="fas fa-industry"></i>
                    ${gie.secteur}
                </div>
                <div class="gie-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${gie.commune}
                </div>
                <div class="gie-address">${gie.adresse}</div>
            </div>
            <div class="gie-card-footer">
                <div class="gie-info">
                    <div class="gie-president">
                        <strong>Président</strong>
                        <span>${canViewSensitive ? (gie.president || '') : '***'}</span>
                    </div>
                    <div class="gie-members">
                        <strong>Membres</strong>
                        <span>${gie.nombre}</span>
                    </div>
                </div>
                <div class="gie-actions">
                    ${canViewSensitive ? `
                    <button class="gie-action-btn primary" onclick="contactGIE('${gie.telephone}')" title="Contacter">
                        <i class="fas fa-phone"></i>
                        Contacter
                    </button>
                    <button class="gie-action-btn secondary" onclick="showGIEDetails(${gie.id})" title="Détails">
                        <i class="fas fa-eye"></i>
                        Détails
                    </button>` : `
                    <button class="gie-action-btn" disabled title="Connexion requise">
                        <i class="fas fa-lock"></i>
                        Restreint
                    </button>`}
                </div>
            </div>
        `;

        return card;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredGIE.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            this.pagination.innerHTML = '';
            return;
        }

        let paginationHTML = `
            <button class="pagination-btn" onclick="gieDisplay.goToPage(1)" ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-angle-double-left"></i>
            </button>
            <button class="pagination-btn" onclick="gieDisplay.goToPage(${this.currentPage - 1})" ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-angle-left"></i>
            </button>
            <div class="page-numbers">
        `;

        // Afficher les numéros de pages
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="page-number ${i === this.currentPage ? 'active' : ''}" onclick="gieDisplay.goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        paginationHTML += `
            </div>
            <button class="pagination-btn" onclick="gieDisplay.goToPage(${this.currentPage + 1})" ${this.currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-angle-right"></i>
            </button>
            <button class="pagination-btn" onclick="gieDisplay.goToPage(${totalPages})" ${this.currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-angle-double-right"></i>
            </button>
        `;

        this.pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderGIE();
        // Scroll vers le haut de la section
        this.gieGrid.scrollIntoView({ behavior: 'smooth' });
    }
}

// Fonctions globales
function contactGIE(telephone) {
    if (telephone) {
        window.open(`tel:${telephone}`, '_self');
    }
}

function showGIEDetails(gieId) {
    const gie = gieDatabase.find(g => g.id === gieId);
    if (gie) {
        // Créer une modal avec les détails complets
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${gie.nom}</h2>
                        <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-grid">
                            <div class="modal-section">
                                <h3>Informations Générales</h3>
                                <p><strong>Président:</strong> ${gie.president}</p>
                                <p><strong>Type:</strong> ${gie.type}</p>
                                <p><strong>Secteur:</strong> ${gie.secteur}</p>
                                <p><strong>Nombre de membres:</strong> ${gie.nombre}</p>
                                <p><strong>Statut:</strong> ${gie.statut}</p>
                                <p><strong>Date de création:</strong> ${new Date(gie.dateCreation).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div class="modal-section">
                                <h3>Contact</h3>
                                <p><strong>Téléphone:</strong> <a href="tel:${gie.telephone}">${gie.telephone}</a></p>
                                <p><strong>Adresse:</strong> ${gie.adresse}</p>
                                <p><strong>Commune:</strong> ${gie.commune}</p>
                            </div>
                            ${gie.description ? `
                            <div class="modal-section full-width">
                                <h3>Description</h3>
                                <p>${gie.description}</p>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="gie-action-btn primary" onclick="contactGIE('${gie.telephone}')">
                            <i class="fas fa-phone"></i> Contacter
                        </button>
                        <button class="gie-action-btn secondary" onclick="this.closest('.modal').remove()">
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

function exportData() {
    const dataToExport = gieDisplay.filteredGIE.map(gie => ({
        'Nom': gie.nom,
        'Président': gie.president,
        'Commune': gie.commune,
        'Adresse': gie.adresse,
        'Téléphone': gie.telephone,
        'Nombre de membres': gie.nombre,
        'Secteur': gie.secteur,
        'Type': gie.type,
        'Statut': gie.statut,
        'Date de création': gie.dateCreation,
        'Description': gie.description || ''
    }));

    const csvContent = convertToCSV(dataToExport);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `GIE_KeuMassar_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function convertToCSV(data) {
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header];
            return `"${value}"`;
        });
        csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
}

function printData() {
    const printWindow = window.open('', '_blank');
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Liste des G.I.E - Keur Massar</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                h1 { color: #333; }
                .stats { margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <h1>Liste des G.I.E - Keur Massar</h1>
            <div class="stats">
                <p><strong>Total:</strong> ${gieDisplay.filteredGIE.length} G.I.E</p>
                <p><strong>Date d'impression:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Président</th>
                        <th>Commune</th>
                        <th>Téléphone</th>
                        <th>Secteur</th>
                        <th>Type</th>
                        <th>Membres</th>
                    </tr>
                </thead>
                <tbody>
                    ${gieDisplay.filteredGIE.map(gie => `
                        <tr>
                            <td>${gie.nom}</td>
                            <td>${gie.president}</td>
                            <td>${gie.commune}</td>
                            <td>${gie.telephone}</td>
                            <td>${gie.secteur}</td>
                            <td>${gie.type}</td>
                            <td>${gie.nombre}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </body>
        </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// Variable globale pour accéder à l'instance
let gieDisplay;

// Initialiser l'affichage quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    gieDisplay = new GIEDisplay();

    // Gestion du menu mobile et du scroll du header
    const header = document.querySelector('.header-transparent');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Gestion du scroll pour le header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Gestion du menu mobile
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });

        // Fermer le menu quand on clique sur un lien
        const navItems = document.querySelectorAll('.nav-item a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                navLinks.classList.remove('active');
            });
        });

        // Fermer le menu quand on clique en dehors
        document.addEventListener('click', function(e) {
            if (!header.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }
});