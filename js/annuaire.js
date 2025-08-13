// Configuration globale
const CONFIG = {
    itemsPerPage: 12,
    animationDelay: 100,
    searchDelay: 300
};

// Données simulées des acteurs (à remplacer par une vraie base de données)
const acteurs = [
    {
        id: 1,
        nom: "Association Femmes Entrepreneures",
        categorie: "association",
        secteur: "artisanat",
        commune: "keur-massar",
        description: "Promotion de l'artisanat local par les femmes. Formation et accompagnement des entrepreneures locales.",
        image: "../images/acteurs/acteurs",
        dateCreation: "2020-03-15",
        membres: 45,
        contact: {
            email: "contact@femmes-entrepreneures.sn",
            telephone: "+221 77 000 00 01",
            adresse: "Keur Massar, Dakar"
        },
        activites: ["Formation", "Artisanat", "Émancipation"]
    },
    {
        id: 2,
        nom: "Coopérative Agricole de Keur Massar",
        categorie: "cooperative",
        secteur: "agriculture",
        commune: "medina-gounass",
        description: "Production et distribution de produits agricoles locaux. Développement de l'agriculture durable.",
        image: "../images/acteurs/acteurs",
        dateCreation: "2019-06-20",
        membres: 120,
        contact: {
            email: "info@coopagri-km.sn",
            telephone: "+221 77 000 00 02",
            adresse: "Médina Gounass, Keur Massar"
        },
        activites: ["Agriculture", "Bio", "Formation"]
    },
    {
        id: 3,
        nom: "GIE Artisans Unis",
        categorie: "gie",
        secteur: "artisanat",
        commune: "sam-notaire",
        description: "Groupement d'artisans spécialisés dans la transformation du bois et du métal.",
        image: "../images/acteurs/acteurs",
        dateCreation: "2021-01-10",
        membres: 25,
        contact: {
            email: "contact@artisans-unis.sn",
            telephone: "+221 77 000 00 03",
            adresse: "Sam Notaire, Keur Massar"
        },
        activites: ["Artisanat", "Formation", "Vente"]
    },
    {
        id: 4,
        nom: "ONG Développement Durable",
        categorie: "ong",
        secteur: "environnement",
        commune: "nguene",
        description: "Organisation non gouvernementale dédiée à la protection de l'environnement et au développement durable.",
        image: "../images/acteurs/acteurs",
        dateCreation: "2018-09-05",
        membres: 80,
        contact: {
            email: "info@dev-durable.sn",
            telephone: "+221 77 000 00 04",
            adresse: "Nguène, Keur Massar"
        },
        activites: ["Environnement", "Sensibilisation", "Projets"]
    },
    {
        id: 5,
        nom: "Entreprise Sociale Tech",
        categorie: "entreprise",
        secteur: "technologie",
        commune: "sangalkam",
        description: "Entreprise sociale spécialisée dans les solutions technologiques pour le développement local.",
        image: "../images/acteurs/acteurs",
        dateCreation: "2022-02-28",
        membres: 15,
        contact: {
            email: "contact@tech-social.sn",
            telephone: "+221 77 000 00 05",
            adresse: "Sangalkam, Keur Massar"
        },
        activites: ["Technologie", "Innovation", "Formation"]
    },
    {
        id: 6,
        nom: "Fondation Éducation Pour Tous",
        categorie: "fondation",
        secteur: "education",
        commune: "bambylor",
        description: "Fondation dédiée à l'amélioration de l'accès à l'éducation pour tous les enfants de Keur Massar.",
        image: "../images/acteurs/acteurs",
        dateCreation: "2017-11-12",
        membres: 200,
        contact: {
            email: "info@education-pour-tous.sn",
            telephone: "+221 77 000 00 06",
            adresse: "Bambylor, Keur Massar"
        },
        activites: ["Éducation", "Formation", "Soutien"]
    },
    {
        id: 7,
        nom: "Coopérative de Transport",
        categorie: "cooperative",
        secteur: "transport",
        commune: "keur-massar",
        description: "Coopérative de transport local offrant des services de mobilité durable.",
        image: "../images/acteurs/acteurs",
        dateCreation: "2020-08-15",
        membres: 35,
        contact: {
            email: "contact@transport-coop.sn",
            telephone: "+221 77 000 00 07",
            adresse: "Keur Massar Centre"
        },
        activites: ["Transport", "Mobilité", "Service"]
    },
    {
        id: 8,
        nom: "Association Santé Communautaire",
        categorie: "association",
        secteur: "sante",
        commune: "medina-gounass",
        description: "Association promouvant la santé communautaire et l'accès aux soins de base.",
        image: "../images/acteurs/acteurs",
        dateCreation: "2019-04-22",
        membres: 60,
        contact: {
            email: "info@sante-communautaire.sn",
            telephone: "+221 77 000 00 08",
            adresse: "Médina Gounass, Keur Massar"
        },
        activites: ["Santé", "Prévention", "Sensibilisation"]
    }
];

// État global de l'application
let appState = {
    currentPage: 1,
    itemsPerPage: CONFIG.itemsPerPage,
    currentView: 'grid',
    filteredActors: [...acteurs],
    searchTerm: '',
    filters: {
        categorie: '',
        secteur: '',
        commune: '',
        sortBy: 'nom'
    }
};

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    updateDisplay();
    initializeAOS();
});

// Initialisation de l'application
function initializeApp() {
    updateStats();
    populateFilters();
    setupPagination();
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Recherche principale
    const mainSearch = document.getElementById('mainSearch');
    if (mainSearch) {
        let searchTimeout;
        mainSearch.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                appState.searchTerm = e.target.value.toLowerCase();
                appState.currentPage = 1;
                filterActors();
                updateDisplay();
            }, CONFIG.searchDelay);
        });
    }

    // Filtres
    const filterSelects = ['categoryFilter', 'sectorFilter', 'communeFilter', 'sortFilter'];
    filterSelects.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', (e) => {
                appState.filters[filterId.replace('Filter', '')] = e.target.value;
                appState.currentPage = 1;
                filterActors();
                updateDisplay();
            });
        }
    });

    // Boutons de filtres
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }

    const applyBtn = document.getElementById('applyFilters');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyFilters);
    }

    // Toggle des filtres
    const toggleBtn = document.getElementById('toggleFilters');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleFilters);
    }

    // Options de vue
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.target.closest('.view-btn').dataset.view;
            setView(view);
        });
    });

    // Pagination
    const pageSizeSelect = document.getElementById('pageSize');
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', (e) => {
            appState.itemsPerPage = parseInt(e.target.value);
            appState.currentPage = 1;
            updateDisplay();
        });
    }

    // Export et impression
    const exportBtn = document.getElementById('exportResults');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportResults);
    }

    const printBtn = document.getElementById('printResults');
    if (printBtn) {
        printBtn.addEventListener('click', printResults);
    }
}

// Filtrage des acteurs
function filterActors() {
    let filtered = [...acteurs];

    // Filtre par recherche
    if (appState.searchTerm) {
        filtered = filtered.filter(actor => 
            actor.nom.toLowerCase().includes(appState.searchTerm) ||
            actor.description.toLowerCase().includes(appState.searchTerm) ||
            actor.activites.some(activite => activite.toLowerCase().includes(appState.searchTerm))
        );
    }

    // Filtres par catégorie
    if (appState.filters.categorie) {
        filtered = filtered.filter(actor => actor.categorie === appState.filters.categorie);
    }

    // Filtres par secteur
    if (appState.filters.secteur) {
        filtered = filtered.filter(actor => actor.secteur === appState.filters.secteur);
    }

    // Filtres par commune
    if (appState.filters.commune) {
        filtered = filtered.filter(actor => actor.commune === appState.filters.commune);
    }

    // Tri
    filtered.sort((a, b) => {
        switch (appState.filters.sortBy) {
            case 'nom':
                return a.nom.localeCompare(b.nom);
            case 'nom-desc':
                return b.nom.localeCompare(a.nom);
            case 'commune':
                return a.commune.localeCompare(b.commune);
            case 'secteur':
                return a.secteur.localeCompare(b.secteur);
            case 'date':
                return new Date(b.dateCreation) - new Date(a.dateCreation);
            default:
                return 0;
        }
    });

    appState.filteredActors = filtered;
}

// Mise à jour de l'affichage
function updateDisplay() {
    updateResultsCount();
    generateActorCards();
    updatePagination();
    updateActiveFilters();
}

// Génération des cartes des acteurs
function generateActorCards() {
    const directory = document.getElementById('directoryGrid');
    if (!directory) return;

    const startIndex = (appState.currentPage - 1) * appState.itemsPerPage;
    const endIndex = startIndex + appState.itemsPerPage;
    const actorsToShow = appState.filteredActors.slice(startIndex, endIndex);

    directory.innerHTML = '';

    if (actorsToShow.length === 0) {
        showEmptyState(directory);
        return;
    }

    actorsToShow.forEach((actor, index) => {
        const card = createActorCard(actor, index);
        directory.appendChild(card);
    });

    // Ajouter la classe de vue
    directory.className = `directory-grid ${appState.currentView}-view`;
}

// Création d'une carte d'acteur
function createActorCard(actor, index) {
        const card = document.createElement('div');
        card.className = 'actor-card';
    card.style.animationDelay = `${index * CONFIG.animationDelay}ms`;

    const categoryLabel = getCategoryLabel(actor.categorie);
    const sectorLabel = getSectorLabel(actor.secteur);
    const communeLabel = getCommuneLabel(actor.commune);

        card.innerHTML = `
        <img src="${actor.image}" alt="${actor.nom}" class="actor-image" onerror="this.src='../images/logo.png'">
            <div class="actor-info">
            <span class="actor-category">${categoryLabel}</span>
                <h3>${actor.nom}</h3>
            <p class="actor-description">${actor.description}</p>
            <div class="actor-meta">
                <span><i class="fas fa-map-marker-alt"></i> ${communeLabel}</span>
                <span><i class="fas fa-industry"></i> ${sectorLabel}</span>
                <span><i class="fas fa-users"></i> ${actor.membres} membres</span>
            </div>
                <div class="actor-contact">
                <a href="mailto:${actor.contact.email}" title="Envoyer un email">
                        <i class="fas fa-envelope"></i>
                    Email
                    </a>
                <a href="tel:${actor.contact.telephone}" title="Appeler">
                        <i class="fas fa-phone"></i>
                    Téléphone
                </a>
                <a href="#" onclick="showActorDetails(${actor.id})" title="Voir les détails">
                    <i class="fas fa-info-circle"></i>
                    Détails
                    </a>
                </div>
            </div>
        `;

    return card;
}

// Affichage de l'état vide
function showEmptyState(container) {
    container.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-search"></i>
            <h3>Aucun résultat trouvé</h3>
            <p>Aucun acteur ne correspond à vos critères de recherche. Essayez de modifier vos filtres ou votre recherche.</p>
            <button onclick="resetFilters()" class="help-btn primary">
                <i class="fas fa-times"></i>
                Réinitialiser les filtres
            </button>
        </div>
    `;
}

// Mise à jour du compteur de résultats
function updateResultsCount() {
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        countElement.textContent = appState.filteredActors.length;
    }
}

// Mise à jour des statistiques
function updateStats() {
    const stats = {
        total: acteurs.length,
        categories: new Set(acteurs.map(a => a.categorie)).size,
        sectors: new Set(acteurs.map(a => a.secteur)).size,
        communes: new Set(acteurs.map(a => a.commune)).size
    };

    const totalActors = document.getElementById('total-actors');
    if (totalActors) totalActors.textContent = `${stats.total}+`;

    const totalCategories = document.getElementById('total-categories');
    if (totalCategories) totalCategories.textContent = stats.categories;

    const totalSectors = document.getElementById('total-sectors');
    if (totalSectors) totalSectors.textContent = stats.sectors;

    const totalCommunes = document.getElementById('total-communes');
    if (totalCommunes) totalCommunes.textContent = stats.communes;
}

// Population des filtres
function populateFilters() {
    const categories = [...new Set(acteurs.map(a => a.categorie))];
    const sectors = [...new Set(acteurs.map(a => a.secteur))];
    const communes = [...new Set(acteurs.map(a => a.commune))];

    populateSelect('categoryFilter', categories, getCategoryLabel);
    populateSelect('sectorFilter', sectors, getSectorLabel);
    populateSelect('communeFilter', communes, getCommuneLabel);
}

// Population d'un select
function populateSelect(selectId, values, labelFunction) {
    const select = document.getElementById(selectId);
    if (!select) return;

    // Garder l'option par défaut
    const defaultOption = select.querySelector('option[value=""]');
    select.innerHTML = '';
    if (defaultOption) select.appendChild(defaultOption);

    values.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = labelFunction ? labelFunction(value) : value;
        select.appendChild(option);
    });
}

// Fonctions de label
function getCategoryLabel(category) {
    const labels = {
        'association': 'Association',
        'cooperative': 'Coopérative',
        'entreprise': 'Entreprise sociale',
        'gie': 'G.I.E',
        'ong': 'ONG',
        'fondation': 'Fondation',
        'artisanat': 'Artisanat',
        'commerce': 'Commerce'
    };
    return labels[category] || category;
}

function getSectorLabel(sector) {
    const labels = {
        'agriculture': 'Agriculture',
        'education': 'Éducation',
        'sante': 'Santé',
        'artisanat': 'Artisanat',
        'commerce': 'Commerce',
        'services': 'Services',
        'environnement': 'Environnement',
        'culture': 'Culture',
        'technologie': 'Technologie',
        'transport': 'Transport',
        'construction': 'Construction'
    };
    return labels[sector] || sector;
}

function getCommuneLabel(commune) {
    const labels = {
        'keur-massar': 'Keur Massar',
        'medina-gounass': 'Médina Gounass',
        'sam-notaire': 'Sam Notaire',
        'nguene': 'Nguène',
        'sangalkam': 'Sangalkam',
        'bambylor': 'Bambylor'
    };
    return labels[commune] || commune;
}

// Gestion des filtres
function resetFilters() {
    appState.filters = {
        categorie: '',
        secteur: '',
        commune: '',
        sortBy: 'nom'
    };
    appState.searchTerm = '';
    appState.currentPage = 1;

    // Réinitialiser les champs
    const mainSearch = document.getElementById('mainSearch');
    if (mainSearch) mainSearch.value = '';

    const filterSelects = ['categoryFilter', 'sectorFilter', 'communeFilter', 'sortFilter'];
    filterSelects.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) element.value = '';
    });

    filterActors();
    updateDisplay();
}

function applyFilters() {
    filterActors();
    updateDisplay();
}

function toggleFilters() {
    const content = document.getElementById('filtersContent');
    const toggleBtn = document.getElementById('toggleFilters');
    
    if (content && toggleBtn) {
        content.classList.toggle('collapsed');
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.className = content.classList.contains('collapsed') ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
        }
    }
}

// Gestion de la vue
function setView(view) {
    appState.currentView = view;
    
    // Mettre à jour les boutons
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });

    // Mettre à jour l'affichage
    const directory = document.getElementById('directoryGrid');
    if (directory) {
        directory.className = `directory-grid ${view}-view`;
    }
}

// Pagination
function setupPagination() {
    const paginationBtns = ['firstPage', 'prevPage', 'nextPage', 'lastPage'];
    paginationBtns.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', () => {
                handlePagination(btnId);
            });
        }
    });
}

function handlePagination(action) {
    const totalPages = Math.ceil(appState.filteredActors.length / appState.itemsPerPage);
    
    switch (action) {
        case 'firstPage':
            appState.currentPage = 1;
            break;
        case 'prevPage':
            if (appState.currentPage > 1) appState.currentPage--;
            break;
        case 'nextPage':
            if (appState.currentPage < totalPages) appState.currentPage++;
            break;
        case 'lastPage':
            appState.currentPage = totalPages;
            break;
    }
    
    updateDisplay();
}

function updatePagination() {
    const totalPages = Math.ceil(appState.filteredActors.length / appState.itemsPerPage);
    
    // Mettre à jour les informations de page
    const currentPageEl = document.getElementById('currentPage');
    const totalPagesEl = document.getElementById('totalPages');
    
    if (currentPageEl) currentPageEl.textContent = appState.currentPage;
    if (totalPagesEl) totalPagesEl.textContent = totalPages;

    // Mettre à jour les boutons
    const firstBtn = document.getElementById('firstPage');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const lastBtn = document.getElementById('lastPage');

    if (firstBtn) firstBtn.disabled = appState.currentPage === 1;
    if (prevBtn) prevBtn.disabled = appState.currentPage === 1;
    if (nextBtn) nextBtn.disabled = appState.currentPage === totalPages;
    if (lastBtn) lastBtn.disabled = appState.currentPage === totalPages;

    // Générer les numéros de page
    generatePageNumbers(totalPages);
}

function generatePageNumbers(totalPages) {
    const pageNumbersContainer = document.getElementById('pageNumbers');
    if (!pageNumbersContainer) return;

    pageNumbersContainer.innerHTML = '';
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, appState.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-number ${i === appState.currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            appState.currentPage = i;
            updateDisplay();
        });
        pageNumbersContainer.appendChild(pageBtn);
    }
}

// Mise à jour des filtres actifs
function updateActiveFilters() {
    const activeFilters = [];
    
    if (appState.filters.categorie) {
        activeFilters.push(getCategoryLabel(appState.filters.categorie));
    }
    if (appState.filters.secteur) {
        activeFilters.push(getSectorLabel(appState.filters.secteur));
    }
    if (appState.filters.commune) {
        activeFilters.push(getCommuneLabel(appState.filters.commune));
    }
    if (appState.searchTerm) {
        activeFilters.push(`Recherche: "${appState.searchTerm}"`);
    }

    // Ici vous pouvez ajouter l'affichage des filtres actifs si nécessaire
}

// Export des résultats
function exportResults() {
    const data = appState.filteredActors.map(actor => ({
        Nom: actor.nom,
        Catégorie: getCategoryLabel(actor.categorie),
        Secteur: getSectorLabel(actor.secteur),
        Commune: getCommuneLabel(actor.commune),
        Description: actor.description,
        Membres: actor.membres,
        Email: actor.contact.email,
        Téléphone: actor.contact.telephone,
        Adresse: actor.contact.adresse
    }));

    const csv = convertToCSV(data);
    downloadCSV(csv, 'annuaire-acteurs.csv');
}

function convertToCSV(data) {
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');
    
    return csvContent;
}

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

// Impression des résultats
function printResults() {
    const printWindow = window.open('', '_blank');
    const actors = appState.filteredActors;
    
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Annuaire des Acteurs - Keur Massar Social</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #2c3e50; text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .header { text-align: center; margin-bottom: 30px; }
                .footer { margin-top: 30px; text-align: center; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Annuaire des Acteurs</h1>
                <p>Keur Massar Social - ${new Date().toLocaleDateString()}</p>
                <p>${actors.length} acteur(s) trouvé(s)</p>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Catégorie</th>
                        <th>Secteur</th>
                        <th>Commune</th>
                        <th>Contact</th>
                    </tr>
                </thead>
                <tbody>
                    ${actors.map(actor => `
                        <tr>
                            <td>${actor.nom}</td>
                            <td>${getCategoryLabel(actor.categorie)}</td>
                            <td>${getSectorLabel(actor.secteur)}</td>
                            <td>${getCommuneLabel(actor.commune)}</td>
                            <td>${actor.contact.email}<br>${actor.contact.telephone}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="footer">
                <p>Document généré le ${new Date().toLocaleString()}</p>
                <p>© Keur Massar Social - Tous droits réservés</p>
            </div>
        </body>
        </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// Affichage des détails d'un acteur
function showActorDetails(actorId) {
    const actor = acteurs.find(a => a.id === actorId);
    if (!actor) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${actor.nom}</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="actor-details">
                    <div class="detail-section">
                        <h3>Informations générales</h3>
                        <p><strong>Catégorie:</strong> ${getCategoryLabel(actor.categorie)}</p>
                        <p><strong>Secteur:</strong> ${getSectorLabel(actor.secteur)}</p>
                        <p><strong>Commune:</strong> ${getCommuneLabel(actor.commune)}</p>
                        <p><strong>Membres:</strong> ${actor.membres}</p>
                        <p><strong>Date de création:</strong> ${new Date(actor.dateCreation).toLocaleDateString()}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Description</h3>
                        <p>${actor.description}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Activités</h3>
                        <div class="activities-tags">
                            ${actor.activites.map(activite => `<span class="tag">${activite}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Contact</h3>
                        <p><i class="fas fa-envelope"></i> <a href="mailto:${actor.contact.email}">${actor.contact.email}</a></p>
                        <p><i class="fas fa-phone"></i> <a href="tel:${actor.contact.telephone}">${actor.contact.telephone}</a></p>
                        <p><i class="fas fa-map-marker-alt"></i> ${actor.contact.adresse}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Fermer le modal en cliquant à l'extérieur
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Initialisation d'AOS (Animate On Scroll)
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
}

// Styles CSS pour le modal (à ajouter dans le CSS si nécessaire)
const modalStyles = `
<style>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 15px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e9ecef;
}

.modal-header h2 {
    margin: 0;
    color: #2c3e50;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #7f8c8d;
    transition: color 0.3s ease;
}

.modal-close:hover {
    color: #e74c3c;
}

.modal-body {
    padding: 1.5rem;
}

.detail-section {
    margin-bottom: 2rem;
}

.detail-section h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
    border-bottom: 2px solid #3498db;
    padding-bottom: 0.5rem;
}

.detail-section p {
    margin-bottom: 0.5rem;
    line-height: 1.6;
}

.activities-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.activities-tags .tag {
    background: #3498db;
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-size: 0.8rem;
}

.detail-section a {
    color: #3498db;
    text-decoration: none;
}

.detail-section a:hover {
    text-decoration: underline;
}
</style>
`;

// Ajouter les styles du modal au head
document.head.insertAdjacentHTML('beforeend', modalStyles);

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