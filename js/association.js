// Variables globales
let allAssociations = [];
let filteredAssociations = [];
let currentPage = 1;
const itemsPerPage = 9;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si la base de données est disponible
    if (typeof associationDatabase === 'undefined') {
        showError('Erreur: Base de données des associations non trouvée');
        return;
    }

    // Initialiser les données (priorité au stockage local via associationStorage)
    if (typeof associationStorage !== 'undefined') {
        allAssociations = associationStorage.getAllAssociations();
    } else {
        allAssociations = associationDatabase;
    }
    filteredAssociations = [...allAssociations];

    // Flag for dismissing banner until reload
    window.__hideAuthWarningBannerAssociation = false;

    // Initialiser l'interface
    initializeInterface();
    
    // Configurer les événements
    setupEventListeners();
    
    // Afficher les données
    displayAssociations();
    updateStats();
});

// Initialiser l'interface
function initializeInterface() {
    populateFilters();
    updateResultCount();
}

// Peupler les filtres
function populateFilters() {
    const communeFilter = document.getElementById('communeFilter');
    const sectorFilter = document.getElementById('sectorFilter');
    const typeFilter = document.getElementById('typeFilter');

    // Récupérer les valeurs uniques
    const communes = [...new Set(allAssociations.map(asso => asso.commune).filter(Boolean))];
    const sectors = [...new Set(allAssociations.map(asso => asso.secteur).filter(Boolean))];
    const types = [...new Set(allAssociations.map(asso => asso.type).filter(Boolean))];

    // Peupler le filtre des communes
    communes.forEach(commune => {
        const option = document.createElement('option');
        option.value = commune;
        option.textContent = commune;
        communeFilter.appendChild(option);
    });

    // Peupler le filtre des secteurs
    sectors.forEach(sector => {
        const option = document.createElement('option');
        option.value = sector;
        option.textContent = sector;
        sectorFilter.appendChild(option);
    });

    // Peupler le filtre des types
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeFilter.appendChild(option);
    });
}

// Configurer les événements
function setupEventListeners() {
    // Filtres
    const communeFilter = document.getElementById('communeFilter');
    const sectorFilter = document.getElementById('sectorFilter');
    const typeFilter = document.getElementById('typeFilter');
    const sortFilter = document.getElementById('sortFilter');

    communeFilter.addEventListener('change', filterAssociations);
    sectorFilter.addEventListener('change', filterAssociations);
    typeFilter.addEventListener('change', filterAssociations);
    sortFilter.addEventListener('change', filterAssociations);
    
    // Boutons de vue
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.target.closest('.view-btn').dataset.view;
            setView(view);
        });
    });
}

// Fonction pour changer la vue
function setView(view) {
    // Mettre à jour les boutons
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });

    // Mettre à jour l'affichage
    const associationGrid = document.getElementById('associationGrid');
    if (associationGrid) {
        associationGrid.className = `association-grid ${view}-view`;
    }
    
    // Re-afficher les associations avec la nouvelle vue
    displayAssociations();
}

// Filtrer les associations
function filterAssociations() {
    const communeFilter = document.getElementById('communeFilter').value;
    const sectorFilter = document.getElementById('sectorFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const sortBy = document.getElementById('sortFilter').value;

    // Filtrer
    filteredAssociations = allAssociations.filter(association => {
        const matchesCommune = !communeFilter || association.commune === communeFilter;
        const matchesSector = !sectorFilter || association.secteur === sectorFilter;
        const matchesType = !typeFilter || association.type === typeFilter;

        return matchesCommune && matchesSector && matchesType;
    });

    // Trier
    sortResults(sortBy);

    // Réinitialiser la pagination
    currentPage = 1;
    
    // Mettre à jour l'affichage
    displayAssociations();
    updateResultCount();
}

// Trier les résultats
function sortResults(sortBy) {
    switch(sortBy) {
        case 'nom':
            filteredAssociations.sort((a, b) => a.nom.localeCompare(b.nom));
            break;
        case 'commune':
            filteredAssociations.sort((a, b) => a.commune.localeCompare(b.commune));
            break;
        case 'nombre':
            filteredAssociations.sort((a, b) => parseInt(b.nombre) - parseInt(a.nombre));
            break;
        case 'dateCreation':
            filteredAssociations.sort((a, b) => parseInt(b.dateCreation) - parseInt(a.dateCreation));
            break;
        default:
            filteredAssociations.sort((a, b) => a.nom.localeCompare(b.nom));
    }
}

// Afficher les associations
function displayAssociations() {
    const grid = document.getElementById('associationGrid');

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
        let banner = document.getElementById('authWarningBannerAssociation');
        if (!canViewSensitive && !window.__hideAuthWarningBannerAssociation) {
            if (!banner) {
                banner = document.createElement('div');
                banner.id = 'authWarningBannerAssociation';
                banner.innerHTML = `
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;background:#fff3cd;border:1px solid #ffeeba;color:#856404;padding:10px 12px;border-radius:8px;margin:0 0 12px 0;">
                        <div style="display:flex;align-items:center;gap:10px;">
                            <i class="fas fa-lock"></i>
                            <span>Certains détails sont masqués. <a href="../user-login.html" id="assoAuthLoginLink" style="color:#0c5460;text-decoration:underline;">Connectez-vous</a> pour voir toutes les informations.</span>
                        </div>
                        <button id="closeAuthBannerAssociation" style="border:none;background:transparent;color:#856404;cursor:pointer;font-size:16px;" title="Fermer">×</button>
                    </div>
                `;
                grid.parentElement && grid.parentElement.insertBefore(banner, grid);
                const closeBtn = document.getElementById('closeAuthBannerAssociation');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        window.__hideAuthWarningBannerAssociation = true;
                        banner.remove();
                    });
                }
                const loginLink = document.getElementById('assoAuthLoginLink');
                if (loginLink) {
                    loginLink.addEventListener('click', () => {
                        try { sessionStorage.setItem('postLoginRedirect', window.location.href); } catch {}
                    });
                }
            }
        } else if (banner) {
            banner.remove();
        }
    })();

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const associationsToShow = filteredAssociations.slice(startIndex, endIndex);

    if (associationsToShow.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Aucune association trouvée</h3>
                <p>Essayez de modifier vos critères de recherche</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = associationsToShow.map(association => createAssociationCard(association)).join('');
    updatePagination();
}

// Créer une carte d'association
function createAssociationCard(association) {
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

    return `
        <div class="association-card">
            <div class="association-card-header">
                <div class="association-logo">
                    <i class="fas fa-users"></i>
                </div>
                <div class="association-type-badge">${association.type}</div>
            </div>
            
            <div class="association-card-body">
                <h3 class="association-name">${association.nom}</h3>
                <div class="association-sector">
                    <i class="fas fa-briefcase"></i>
                    ${association.secteur}
                </div>
                <div class="association-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${association.commune}
                </div>
                <div class="association-address">
                    <i class="fas fa-home"></i>
                    ${association.adresse}
                </div>
            </div>
            
            <div class="association-card-footer">
                <div class="association-info">
                    <div class="association-president">
                        <strong>Président(e)</strong>
                        <span>${canViewSensitive ? (association.president || '') : '***'}</span>
                    </div>
                    <div class="association-members">
                        <strong>Membres</strong>
                        <span>${association.nombre}</span>
                    </div>
                </div>
                
                <div class="association-actions">
                    ${canViewSensitive ? `
                    <button class="association-action-btn primary" onclick="showAssociationDetails(${association.id})">
                        <i class="fas fa-eye"></i>
                        Voir détails
                    </button>
                    <button class="association-action-btn secondary" onclick="callAssociation('${association.telephone}')">
                        <i class="fas fa-phone"></i>
                        Appeler
                    </button>` : `
                    <button class="association-action-btn" disabled title="Connexion requise">
                        <i class="fas fa-lock"></i>
                        Restreint
                    </button>`}
                </div>
            </div>
        </div>
    `;
}

// Mettre à jour la pagination
function updatePagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredAssociations.length / itemsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let paginationHTML = `
        <button class="pagination-btn" onclick="changePage(1)" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-angle-double-left"></i>
        </button>
        <button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-angle-left"></i>
        </button>
    `;

    // Afficher les numéros de page
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="page-number ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }

    paginationHTML += `
        <button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-angle-right"></i>
        </button>
        <button class="pagination-btn" onclick="changePage(${totalPages})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-angle-double-right"></i>
        </button>
    `;

    pagination.innerHTML = paginationHTML;
}

// Changer de page
function changePage(page) {
    const totalPages = Math.ceil(filteredAssociations.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayAssociations();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Mettre à jour les statistiques
function updateStats() {
    const totalAssociations = document.getElementById('total-associations');
    const totalMembers = document.getElementById('total-members');
    const totalSectors = document.getElementById('total-sectors');

    if (totalAssociations) totalAssociations.textContent = allAssociations.length;
    
    if (totalMembers) {
        const totalMembersCount = allAssociations.reduce((sum, asso) => sum + parseInt(asso.nombre || 0), 0);
        totalMembers.textContent = totalMembersCount.toLocaleString();
    }
    
    if (totalSectors) {
        const uniqueSectors = new Set(allAssociations.map(asso => asso.secteur).filter(Boolean));
        totalSectors.textContent = uniqueSectors.size;
    }
}

// Mettre à jour le compteur de résultats
function updateResultCount() {
    const resultCount = document.getElementById('resultCount');
    if (resultCount) {
        resultCount.textContent = filteredAssociations.length;
    }
}

// Afficher les détails d'une association
function showAssociationDetails(id) {
    const association = allAssociations.find(asso => asso.id === id);
    if (!association) return;

    const details = `
Nom: ${association.nom}
Type: ${association.type}
Secteur: ${association.secteur}
Commune: ${association.commune}
Adresse: ${association.adresse}
Président(e): ${association.president}
Téléphone: ${association.telephone}
Email: ${association.email}
Nombre de membres: ${association.nombre}
Date de création: ${association.dateCreation}
Statut: ${association.statut}
    `;

    alert(details);
}

// Appeler une association
function callAssociation(phone) {
    if (confirm(`Voulez-vous appeler ${phone} ?`)) {
        window.open(`tel:${phone}`, '_self');
    }
}

// Exporter les données
function exportData() {
    const data = filteredAssociations.map(asso => ({
        Nom: asso.nom,
        Type: asso.type,
        Secteur: asso.secteur,
        Commune: asso.commune,
        Adresse: asso.adresse,
        'Président(e)': asso.president,
        Téléphone: asso.telephone,
        Email: asso.email,
        'Nombre de membres': asso.nombre,
        'Date de création': asso.dateCreation,
        Statut: asso.statut
    }));

    const csv = convertToCSV(data);
    downloadCSV(csv, 'associations-keur-massar.csv');
}

// Imprimer les données
function printData() {
    window.print();
}

// Convertir en CSV
function convertToCSV(arr) {
    const array = [Object.keys(arr[0])].concat(arr);
    return array.map(row => {
        return Object.values(row).map(value => {
            return typeof value === 'string' ? JSON.stringify(value) : value;
        }).join(',');
    }).join('\n');
}

// Télécharger le CSV
function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Afficher une erreur
function showError(message) {
    const grid = document.getElementById('associationGrid');
    grid.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
        </div>
    `;
}

// Fonction utilitaire pour debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Gestion du menu mobile et du scroll du header
document.addEventListener('DOMContentLoaded', function() {
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