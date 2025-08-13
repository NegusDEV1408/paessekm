// Carte interactive ultra-moderne pour Keur Massar
// Coordonnées du centre de Keur Massar
const KEUR_MASSAR_CENTER = [14.7828, -17.3233];
const ZOOM_LEVEL = 13;

// Données des organisations (exemple)
const organizations = [
    {
        id: 1,
        name: "GIE Femmes Entrepreneures",
        type: "gie",
        lat: 14.7828,
        lng: -17.3233,
        description: "Groupement de femmes entrepreneures spécialisées dans le commerce local",
        address: "Quartier Aïnoumady, Rue KM-15",
        phone: "+221 77 123 45 67",
        email: "contact@gie-femmes.sn",
        sector: "Commerce",
        members: 50,
        status: "Actif"
    },
    {
        id: 2,
        name: "Association Jeunesse Active",
        type: "association",
        lat: 14.7850,
        lng: -17.3200,
        description: "Association de jeunes pour le développement communautaire",
        address: "Zone Malika, Rue 12",
        phone: "+221 77 234 56 78",
        email: "info@aja-keurmassar.sn",
        sector: "Éducation",
        members: 120,
        status: "Actif"
    },
    {
        id: 3,
        name: "Coopérative Agricole Unie",
        type: "cooperative",
        lat: 14.7800,
        lng: -17.3250,
        description: "Coopérative agricole spécialisée dans la production maraîchère",
        address: "Zone agricole, Parcelle 45",
        phone: "+221 77 345 67 89",
        email: "contact@cau-keurmassar.sn",
        sector: "Agriculture",
        members: 75,
        status: "Actif"
    },
    {
        id: 4,
        name: "ONG Développement Durable",
        type: "ong",
        lat: 14.7880,
        lng: -17.3180,
        description: "Organisation non gouvernementale pour le développement durable",
        address: "Cité Moderne, Avenue 8",
        phone: "+221 77 456 78 90",
        email: "info@ongdd-keurmassar.sn",
        sector: "Environnement",
        members: 25,
        status: "Actif"
    }
];

// Configuration des marqueurs
const markerConfig = {
    gie: {
        color: '#4e73df',
        icon: 'fas fa-building',
        label: 'G.I.E'
    },
    association: {
        color: '#e74c3c',
        icon: 'fas fa-users',
        label: 'Association'
    },
    cooperative: {
        color: '#27ae60',
        icon: 'fas fa-hands-helping',
        label: 'Coopérative'
    },
    ong: {
        color: '#f39c12',
        icon: 'fas fa-globe',
        label: 'ONG'
    },
    entreprise: {
        color: '#9b59b6',
        icon: 'fas fa-industry',
        label: 'Entreprise'
    }
};

// Initialisation de la carte avec style moderne
const map = L.map('map', {
    center: KEUR_MASSAR_CENTER,
    zoom: ZOOM_LEVEL,
    zoomControl: false,
    attributionControl: false
});

// Ajout du fond de carte moderne
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

// Définir les limites de la carte pour rester sur Keur Massar
const bounds = [
    [14.7528, -17.3533], // Sud-Ouest
    [14.8128, -17.2933]  // Nord-Est
];
map.setMaxBounds(bounds);
map.on('drag', function() {
    map.panInsideBounds(bounds, { animate: false });
});

// Collection de marqueurs
let markers = L.layerGroup().addTo(map);
let currentMarkers = [];

// Fonction pour créer un marqueur personnalisé
function createCustomMarker(org) {
    const config = markerConfig[org.type];
    
    // Créer l'icône personnalisée
    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
            <div class="marker-container" style="background: ${config.color}">
                <i class="${config.icon}"></i>
                <div class="marker-pulse"></div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });

    const marker = L.marker([org.lat, org.lng], { icon: customIcon });
    
    // Créer le popup moderne
    const popupContent = createModernPopup(org);
    marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'modern-popup'
    });

    // Ajouter des événements
    marker.on('click', function() {
        highlightMarker(marker);
        updateStats();
    });

    marker.on('mouseover', function() {
        this.getElement().style.transform = 'scale(1.2)';
    });

    marker.on('mouseout', function() {
        this.getElement().style.transform = 'scale(1)';
    });

    return marker;
}

// Fonction pour créer un popup moderne
function createModernPopup(org) {
    const config = markerConfig[org.type];
    
    return `
        <div class="popup-content">
            <div class="popup-header" style="background: ${config.color}">
                <i class="${config.icon}"></i>
                <h3>${org.name}</h3>
                <span class="org-type">${config.label}</span>
            </div>
            <div class="popup-body">
                <p class="description">${org.description}</p>
                <div class="org-details">
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${org.address}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-phone"></i>
                        <a href="tel:${org.phone}">${org.phone}</a>
                    </div>
                    ${org.email ? `
                    <div class="detail-item">
                        <i class="fas fa-envelope"></i>
                        <a href="mailto:${org.email}">${org.email}</a>
                    </div>
                    ` : ''}
                    <div class="detail-item">
                        <i class="fas fa-industry"></i>
                        <span>${org.sector}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-users"></i>
                        <span>${org.members} membres</span>
                    </div>
                </div>
                <div class="popup-actions">
                    <button class="action-btn contact-btn" onclick="contactOrganization('${org.phone}')">
                        <i class="fas fa-phone"></i> Contacter
                    </button>
                    <button class="action-btn details-btn" onclick="showOrganizationDetails(${org.id})">
                        <i class="fas fa-eye"></i> Détails
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Fonction pour mettre en surbrillance un marqueur
function highlightMarker(marker) {
    // Retirer la surbrillance de tous les marqueurs
    currentMarkers.forEach(m => {
        m.getElement().classList.remove('highlighted');
    });
    
    // Ajouter la surbrillance au marqueur cliqué
    marker.getElement().classList.add('highlighted');
}

// Fonction pour ajouter tous les marqueurs
function addAllMarkers() {
    markers.clearLayers();
    currentMarkers = [];
    
    organizations.forEach(org => {
        const marker = createCustomMarker(org);
        markers.addLayer(marker);
        currentMarkers.push(marker);
    });
}

// Fonction pour filtrer les marqueurs
function filterMarkers(types) {
    markers.clearLayers();
    currentMarkers = [];
    
    organizations.forEach(org => {
        if (types.includes(org.type)) {
            const marker = createCustomMarker(org);
            markers.addLayer(marker);
            currentMarkers.push(marker);
        }
    });
    
    updateStats();
}

// Fonction pour rechercher des organisations
function searchOrganizations(query) {
    if (!query.trim()) {
        // Appliquer les filtres actuels si aucun terme de recherche
        handleFilters();
        return;
    }
    
    const checkedTypes = Array.from(document.querySelectorAll('.checkbox-container input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    const checkedSectors = Array.from(document.querySelectorAll('.sector-checkbox input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    const filtered = organizations.filter(org => {
        const searchMatch = org.name.toLowerCase().includes(query.toLowerCase()) ||
                           org.description.toLowerCase().includes(query.toLowerCase()) ||
                           org.sector.toLowerCase().includes(query.toLowerCase());
        
        const typeMatch = checkedTypes.length === 0 || checkedTypes.includes(org.type);
        const sectorMatch = checkedSectors.length === 0 || checkedSectors.includes(org.sector.toLowerCase());
        
        return searchMatch && typeMatch && sectorMatch;
    });
    
    markers.clearLayers();
    currentMarkers = [];
    
    filtered.forEach(org => {
        const marker = createCustomMarker(org);
        markers.addLayer(marker);
        currentMarkers.push(marker);
    });
    
    updateStats();
}

// Fonction pour mettre à jour les statistiques
function updateStats() {
    const totalOrgs = currentMarkers.length;
    const statsByType = {};
    
    currentMarkers.forEach(marker => {
        const org = organizations.find(o => 
            o.lat === marker.getLatLng().lat && o.lng === marker.getLatLng().lng
        );
        if (org) {
            statsByType[org.type] = (statsByType[org.type] || 0) + 1;
        }
    });
    
    // Mettre à jour l'affichage des statistiques
    document.querySelector('.stat-number').textContent = totalOrgs;
    
    // Mettre à jour les compteurs par type
    Object.keys(markerConfig).forEach(type => {
        const count = statsByType[type] || 0;
        const checkbox = document.querySelector(`input[value="${type}"]`);
        if (checkbox) {
            const countSpan = checkbox.parentElement.querySelector('.count');
            if (countSpan) {
                countSpan.textContent = `(${count})`;
            }
        }
    });
}

// Contrôles de la carte
document.getElementById('zoomIn').addEventListener('click', () => {
    map.zoomIn();
    animateButton('zoomIn');
});

document.getElementById('zoomOut').addEventListener('click', () => {
    map.zoomOut();
    animateButton('zoomOut');
});

document.getElementById('centerMap').addEventListener('click', () => {
    map.setView(KEUR_MASSAR_CENTER, ZOOM_LEVEL, {
        animate: true,
        duration: 1
    });
    animateButton('centerMap');
});

// Animation des boutons
function animateButton(buttonId) {
    const button = document.getElementById(buttonId);
    button.style.transform = 'scale(0.9)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

// Gestion des filtres
function handleFilters() {
    const checkedTypes = Array.from(document.querySelectorAll('.checkbox-container input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    const checkedSectors = Array.from(document.querySelectorAll('.sector-checkbox input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    // Si aucun filtre de type n'est sélectionné, afficher tous
    if (checkedTypes.length === 0) {
        document.querySelectorAll('.checkbox-container input[type="checkbox"]').forEach(cb => cb.checked = true);
        checkedTypes.push(...Array.from(document.querySelectorAll('.checkbox-container input[type="checkbox"]')).map(cb => cb.value));
    }
    
    // Filtrer par type et secteur
    filterMarkersByTypeAndSector(checkedTypes, checkedSectors);
}

// Fonction pour filtrer par type et secteur
function filterMarkersByTypeAndSector(types, sectors) {
    markers.clearLayers();
    currentMarkers = [];
    
    organizations.forEach(org => {
        const typeMatch = types.includes(org.type);
        const sectorMatch = sectors.length === 0 || sectors.includes(org.sector.toLowerCase());
        
        if (typeMatch && sectorMatch) {
            const marker = createCustomMarker(org);
            markers.addLayer(marker);
            currentMarkers.push(marker);
        }
    });
    
    updateStats();
}

// Écouteurs d'événements pour les filtres
document.querySelectorAll('.checkbox-container input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', handleFilters);
});

document.querySelectorAll('.sector-checkbox input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', handleFilters);
});

// Gestion de la recherche
const searchInput = document.querySelector('.search-box input');
if (searchInput) {
    searchInput.addEventListener('input', function() {
        searchOrganizations(this.value);
    });
}

// Fonctions globales pour les actions
function contactOrganization(phone) {
    window.open(`tel:${phone}`, '_self');
}

function showOrganizationDetails(id) {
    const org = organizations.find(o => o.id === id);
    if (org) {
        // Créer une modal avec les détails complets
        const modal = document.createElement('div');
        modal.className = 'organization-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${org.name}</h2>
                        <button class="modal-close" onclick="this.closest('.organization-modal').remove()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="org-detail-grid">
                            <div class="detail-section">
                                <h3>Informations Générales</h3>
                                <p><strong>Type:</strong> ${markerConfig[org.type].label}</p>
                                <p><strong>Secteur:</strong> ${org.sector}</p>
                                <p><strong>Membres:</strong> ${org.members}</p>
                                <p><strong>Statut:</strong> ${org.status}</p>
                            </div>
                            <div class="detail-section">
                                <h3>Contact</h3>
                                <p><strong>Téléphone:</strong> <a href="tel:${org.phone}">${org.phone}</a></p>
                                ${org.email ? `<p><strong>Email:</strong> <a href="mailto:${org.email}">${org.email}</a></p>` : ''}
                                <p><strong>Adresse:</strong> ${org.address}</p>
                            </div>
                            <div class="detail-section full-width">
                                <h3>Description</h3>
                                <p>${org.description}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="action-btn contact-btn" onclick="contactOrganization('${org.phone}')">
                            <i class="fas fa-phone"></i> Contacter
                        </button>
                        <button class="modal-close-btn" onclick="this.closest('.organization-modal').remove()">
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

// Styles CSS pour les marqueurs et popups
const mapStyles = `
    .custom-marker {
        background: transparent;
        border: none;
    }
    
    .marker-container {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.2rem;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        position: relative;
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .marker-container:hover {
        transform: scale(1.2);
        box-shadow: 0 8px 25px rgba(0,0,0,0.4);
    }
    
    .marker-container.highlighted {
        transform: scale(1.3);
        box-shadow: 0 0 20px rgba(255,255,255,0.8);
    }
    
    .marker-pulse {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: inherit;
        opacity: 0.6;
        animation: pulse 2s infinite;
    }
    
    .modern-popup .leaflet-popup-content-wrapper {
        background: white;
        border-radius: 15px;
        box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        border: none;
        padding: 0;
        overflow: hidden;
    }
    
    .popup-content {
        width: 300px;
    }
    
    .popup-header {
        padding: 1rem;
        color: white;
        text-align: center;
        position: relative;
    }
    
    .popup-header i {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }
    
    .popup-header h3 {
        margin: 0.5rem 0;
        font-size: 1.1rem;
        font-weight: 600;
    }
    
    .org-type {
        background: rgba(255,255,255,0.2);
        padding: 0.2rem 0.6rem;
        border-radius: 10px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .popup-body {
        padding: 1rem;
    }
    
    .description {
        margin-bottom: 1rem;
        color: #666;
        line-height: 1.4;
    }
    
    .org-details {
        margin-bottom: 1rem;
    }
    
    .detail-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }
    
    .detail-item i {
        color: #4e73df;
        width: 16px;
    }
    
    .detail-item a {
        color: #4e73df;
        text-decoration: none;
    }
    
    .detail-item a:hover {
        text-decoration: underline;
    }
    
    .popup-actions {
        display: flex;
        gap: 0.5rem;
    }
    
    .action-btn {
        flex: 1;
        padding: 0.5rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.8rem;
        font-weight: 500;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.3rem;
    }
    
    .contact-btn {
        background: #4e73df;
        color: white;
    }
    
    .contact-btn:hover {
        background: #3a5fcc;
        transform: translateY(-2px);
    }
    
    .details-btn {
        background: #6c757d;
        color: white;
    }
    
    .details-btn:hover {
        background: #5a6268;
        transform: translateY(-2px);
    }
    
    .organization-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    }
    
    .modal-overlay {
        background: white;
        border-radius: 20px;
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        animation: slideInUp 0.3s ease-out;
    }
    
    .modal-header {
        padding: 2rem 2rem 1rem;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .modal-header h2 {
        margin: 0;
        color: #333;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: #666;
    }
    
    .modal-body {
        padding: 2rem;
    }
    
    .org-detail-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
    }
    
    .detail-section h3 {
        color: #4e73df;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #4e73df;
    }
    
    .detail-section.full-width {
        grid-column: 1 / -1;
    }
    
    .modal-footer {
        padding: 1.5rem 2rem;
        border-top: 1px solid #e9ecef;
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 0.6;
        }
        50% {
            transform: scale(1.5);
            opacity: 0;
        }
        100% {
            transform: scale(1);
            opacity: 0.6;
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Ajouter les styles au document
const styleSheet = document.createElement('style');
styleSheet.textContent = mapStyles;
document.head.appendChild(styleSheet);

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    addAllMarkers();
    updateStats();
    
    // Animation d'entrée
    setTimeout(() => {
        document.querySelector('.carte-container').style.opacity = '1';
        document.querySelector('.carte-container').style.transform = 'translateY(0)';
    }, 500);

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