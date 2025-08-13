// Classe pour gérer l'affichage des entreprises
class EntreprisesDisplay {
    constructor() {
        this.entreprises = entreprisesDatabase;
        this.filteredEntreprises = [...this.entreprises];
        this.currentPage = 1;
        this.itemsPerPage = 9;
        this.currentView = 'grid';
        this.currentFilter = 'all';
        
        this.init();
    }

    init() {
        this.renderEntreprises();
        this.setupEventListeners();
        this.updateResultsCount();
        this.updatePagination();
    }

    setupEventListeners() {
        // Recherche
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterEntreprises(e.target.value);
            });
        }

        // Filtres par statut
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Boutons de vue
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setView(e.target.dataset.view);
            });
        });

        // Pagination
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const itemsPerPageSelect = document.getElementById('items-per-page');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousPage());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextPage());
        }
        if (itemsPerPageSelect) {
            itemsPerPageSelect.addEventListener('change', (e) => {
                this.setItemsPerPage(parseInt(e.target.value));
            });
        }
    }

    filterEntreprises(searchTerm) {
        this.currentPage = 1;
        this.filteredEntreprises = this.entreprises.filter(entreprise => {
            const matchesSearch = !searchTerm || 
                entreprise.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entreprise.directeur.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entreprise.adresse.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entreprise.secteur.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter = this.currentFilter === 'all' || entreprise.statut === this.currentFilter;

            return matchesSearch && matchesFilter;
        });

        this.renderEntreprises();
        this.updateResultsCount();
        this.updatePagination();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.currentPage = 1;
        
        // Mettre à jour les boutons de filtre
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        // Appliquer le filtre
        const searchTerm = document.getElementById('search-input')?.value || '';
        this.filterEntreprises(searchTerm);
    }

    setView(view) {
        this.currentView = view;
        
        // Mettre à jour les boutons de vue
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        // Mettre à jour la grille
        const grid = document.getElementById('entreprises-grid');
        if (view === 'list') {
            grid.classList.add('list-view');
        } else {
            grid.classList.remove('list-view');
        }

        this.renderEntreprises();
    }

    setItemsPerPage(items) {
        this.itemsPerPage = items;
        this.currentPage = 1;
        this.renderEntreprises();
        this.updatePagination();
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderEntreprises();
            this.updatePagination();
        }
    }

    nextPage() {
        const maxPages = Math.ceil(this.filteredEntreprises.length / this.itemsPerPage);
        if (this.currentPage < maxPages) {
            this.currentPage++;
            this.renderEntreprises();
            this.updatePagination();
        }
    }

    updateResultsCount() {
        const countElement = document.getElementById('results-count');
        if (countElement) {
            const count = this.filteredEntreprises.length;
            const text = count === 1 ? 'entreprise trouvée' : 'entreprises trouvées';
            countElement.textContent = `${count} ${text}`;
        }
    }

    updatePagination() {
        const totalItems = this.filteredEntreprises.length;
        const maxPages = Math.ceil(totalItems / this.itemsPerPage);
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, totalItems);

        // Mettre à jour les informations de pagination
        const paginationInfo = document.getElementById('pagination-info');
        if (paginationInfo) {
            paginationInfo.textContent = `Affichage ${startItem}-${endItem} sur ${totalItems} entreprises`;
        }

        // Mettre à jour les boutons de navigation
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === maxPages;
        }

        // Mettre à jour les numéros de page
        this.renderPageNumbers(maxPages);
    }

    renderPageNumbers(maxPages) {
        const pageNumbersContainer = document.getElementById('page-numbers');
        if (!pageNumbersContainer) return;

        pageNumbersContainer.innerHTML = '';

        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(maxPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageNumber = document.createElement('span');
            pageNumber.className = 'page-number';
            if (i === this.currentPage) {
                pageNumber.classList.add('active');
            }
            pageNumber.textContent = i;
            pageNumber.addEventListener('click', () => {
                this.currentPage = i;
                this.renderEntreprises();
                this.updatePagination();
            });
            pageNumbersContainer.appendChild(pageNumber);
        }
    }

    renderEntreprises() {
        const grid = document.getElementById('entreprises-grid');
        if (!grid) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const entreprisesToShow = this.filteredEntreprises.slice(startIndex, endIndex);

        grid.innerHTML = '';

        if (entreprisesToShow.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">Aucune entreprise trouvée</h3>
                    <p style="color: var(--text-secondary);">Essayez de modifier vos critères de recherche.</p>
                </div>
            `;
            return;
        }

        entreprisesToShow.forEach(entreprise => {
            const card = this.createEntrepriseCard(entreprise);
            grid.appendChild(card);
        });
    }

    createEntrepriseCard(entreprise) {
        const card = document.createElement('div');
        card.className = 'entreprise-card';
        if (this.currentView === 'list') {
            card.classList.add('list-view');
        }

        const isListView = this.currentView === 'list';
        
        card.innerHTML = `
            <div class="entreprise-image">
                <div class="entreprise-status active">${entreprise.statut}</div>
                <div class="entreprise-overlay">
                    <button class="share-btn" onclick="shareEntreprise('${entreprise.nom}')">
                        <i class="fas fa-share"></i>
                        Partager
                    </button>
                    <a href="mailto:${entreprise.email}" class="contact-btn">
                        <i class="fas fa-envelope"></i>
                        Contacter
                    </a>
                </div>
            </div>
            <div class="entreprise-content">
                <div class="entreprise-header">
                    <div>
                        <h3>${entreprise.nom}</h3>
                        <span class="entreprise-type">${entreprise.statut}</span>
                    </div>
                </div>
                <p class="entreprise-description">${entreprise.description}</p>
                <div class="entreprise-stats">
                    <div class="stat">
                        <i class="fas fa-user"></i>
                        <span>${entreprise.employes} employés</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${entreprise.secteur}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-calendar"></i>
                        <span>Créée en ${new Date(entreprise.dateCreation).getFullYear()}</span>
                    </div>
                </div>
                <div class="entreprise-activities">
                    ${entreprise.activites.map(activite => 
                        `<span class="activity-tag">${activite}</span>`
                    ).join('')}
                </div>
                <div class="entreprise-actions">
                    <button class="btn-details" onclick="showEntrepriseDetails(${entreprise.id})">
                        <i class="fas fa-info-circle"></i>
                        Détails
                    </button>
                    <a href="mailto:${entreprise.email}" class="btn-contact">
                        <i class="fas fa-envelope"></i>
                        Contacter
                    </a>
                </div>
            </div>
        `;

        return card;
    }
}

// Fonctions utilitaires
function shareEntreprise(nom) {
    if (navigator.share) {
        navigator.share({
            title: `Entreprise ${nom}`,
            text: `Découvrez ${nom} sur Keur Massar Social`,
            url: window.location.href
        });
    } else {
        // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
        const url = window.location.href;
        const text = `Découvrez ${nom} sur Keur Massar Social: ${url}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Lien copié dans le presse-papiers !');
            });
        } else {
            // Fallback pour les navigateurs plus anciens
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Lien copié dans le presse-papiers !');
        }
    }
}

function showEntrepriseDetails(id) {
    const entreprise = entreprisesDatabase.find(e => e.id === id);
    if (!entreprise) return;

    const details = `
Nom: ${entreprise.nom}
Statut: ${entreprise.statut}
Secteur: ${entreprise.secteur}
Directeur: ${entreprise.directeur}
Adresse: ${entreprise.adresse}
Téléphone: ${entreprise.telephone}
Email: ${entreprise.email}
Employés: ${entreprise.employes}
Date de création: ${entreprise.dateCreation}
Capital: ${entreprise.capital}
Site web: ${entreprise.siteWeb}
Description: ${entreprise.description}
Activités: ${entreprise.activites.join(', ')}
    `;

    alert(details);
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }

    // Initialiser l'affichage des entreprises
    new EntreprisesDisplay();

    // Mettre à jour le compteur total
    const totalElement = document.getElementById('total-entreprises');
    if (totalElement) {
        totalElement.textContent = entreprisesDatabase.length;
    }

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