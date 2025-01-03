// Base de données complète des GIE
const gieDatabase = [
    {
        id: 1,
        nom: "GIE Femmes Entrepreneures",
        image: "../images/gie/default-company.jpg",
        commune: "Keur Massar Nord",
        adresse: "Quartier Aïnoumady, Rue KM-15",
        telephone: "+221 77 123 45 67"
    },
    {
        id: 2,
        nom: "GIE Agriculteurs Unis",
        image: "../images/gie/default-company.jpg",
        commune: "Keur Massar Sud",
        adresse: "Zone maraîchère, Lot 45",
        telephone: "+221 77 234 56 78"
    },
    {
        id: 3,
        nom: "GIE Artisans de Malika",
        image: "../images/gie/default-company.jpg",
        commune: "Malika",
        adresse: "Marché artisanal, Stand 12",
        telephone: "+221 77 345 67 89"
    },
    {
        id: 4,
        nom: "GIE Commerce Plus",
        image: "../images/gie/default-company.jpg",
        commune: "Yeumbeul Nord",
        adresse: "Marché Central, N°23",
        telephone: "+221 77 456 78 90"
    },
    {
        id: 5,
        nom: "GIE Couture Moderne",
        image: "../images/gie/default-company.jpg",
        commune: "Keur Massar Sud",
        adresse: "Cité des Artisans, N°45",
        telephone: "+221 77 567 89 01"
    },
    // ... Ajoutez les 45 autres entreprises de la même manière
    {
        id: 6,
        nom: "GIE Tech Innovation",
        image: "../images/gie/default-company.jpg",
        commune: "Keur Massar Nord",
        adresse: "Cité Moderne, Rue 15",
        telephone: "+221 77 999 99 99"
    },
    {
        id: 7,
        nom: "GIE Tech Innovation",
        image: "../images/gie/default-company.jpg",
        commune: "Keur Massar Nord",
        adresse: "Cité Moderne, Rue 15",
        telephone: "+221 77 999 99 99"
    },
    {
        id: 8,
        nom: "GIE Tech Innovation",
        image: "../images/gie/default-company.jpg",
        commune: "Keur Massar Nord",
        adresse: "Cité Moderne, Rue 15",
        telephone: "+221 77 999 99 99"
    },
    {
        id: 9,
        nom: "GIE Tech Innovation",
        image: "../images/gie/default-company.jpg",
        commune: "Keur Massar Nord",
        adresse: "Cité Moderne, Rue 15",
        telephone: "+221 77 999 99 99"
    },
    {
        id: 10,
        nom: "GIE Tech Innovation",
        image: "../images/gie/default-company.jpg",
        commune: "Keur Massar Nord",
        adresse: "Cité Moderne, Rue 15",
        telephone: "+221 77 999 99 99"
    },
    {
        id: 11,
        nom: "GIE Tech Innovation",
        image: "../images/gie/default-company.jpg",
        commune: "Keur Massar Nord",
        adresse: "Cité Moderne, Rue 15",
        telephone: "+221 77 999 99 99"
    },
    {
        id: 12,
        nom: "GIE Tech Innovation",
        image: "../images/gie/default-company.jpg",
        commune: "Keur Massar Nord",
        adresse: "Cité Moderne, Rue 15",
        telephone: "+221 77 999 99 99"
    }
];

// Fonction pour afficher les entreprises
function displayGIE(gieList) {
    const container = document.getElementById('gieContainer');
    
    if (gieList.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <p>Aucune entreprise trouvée.</p>
            </div>
        `;
        return;
    }

    const gieHTML = gieList.map(gie => `
        <div class="gie-card">
            <div class="gie-image">
                <img src="${gie.image}" alt="${gie.nom}">
            </div>
            <div class="gie-info">
                <h3>${gie.nom}</h3>
                <span class="commune-badge">${gie.commune}</span>
                <div class="gie-details">
                    <p><i class="fas fa-map-marker-alt"></i> ${gie.adresse}</p>
                    <p><i class="fas fa-phone"></i> ${gie.telephone}</p>
                </div>
                <div class="gie-actions">
                    <button onclick="showGieDetails(${gie.id})" class="details-btn">
                        Voir détails
                    </button>
                    <a href="tel:${gie.telephone}" class="call-btn">
                        Appeler
                    </a>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = gieHTML;
}

// Fonction pour afficher les détails d'une entreprise
function showGieDetails(gieId) {
    const gie = gieDatabase.find(g => g.id === gieId);
    if (!gie) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <div class="gie-details-modal">
                <img src="${gie.image}" alt="${gie.nom}" class="modal-image">
                <h2>${gie.nom}</h2>
                <div class="details-info">
                    <p><strong>Commune:</strong> ${gie.commune}</p>
                    <p><strong>Adresse:</strong> ${gie.adresse}</p>
                    <p><strong>Téléphone:</strong> ${gie.telephone}</p>
                </div>
                <div class="modal-actions">
                    <a href="tel:${gie.telephone}" class="call-btn">
                        <i class="fas fa-phone"></i> Appeler
                    </a>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

// Fonction de recherche
function searchGIE() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedCommune = document.getElementById('communeFilter').value;

    const filteredGIE = gieDatabase.filter(gie => {
        const matchSearch = gie.nom.toLowerCase().includes(searchTerm) ||
        gie.adresse.toLowerCase().includes(searchTerm);
        const matchCommune = !selectedCommune || gie.commune === selectedCommune;
        return matchSearch && matchCommune;
    });

    displayGIE(filteredGIE);
}

// Styles CSS supplémentaires pour l'affichage
const additionalStyles = `
    .gie-card {
        display: flex;
        background: white;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 1rem;
        box-shadow: var(--shadow);
        transition: transform 0.3s ease;
    }

    .gie-card:hover {
        transform: translateY(-5px);
    }

    .gie-image {
        width: 150px;
        min-width: 150px;
        height: 150px;
    }

    .gie-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .gie-info {
        padding: 1.5rem;
        flex: 1;
    }

    .commune-badge {
        display: inline-block;
        background: var(--primary-color);
        color: white;
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-size: 0.9rem;
        margin: 0.5rem 0;
    }

    .gie-details {
        margin: 1rem 0;
    }

    .gie-details p {
        margin: 0.5rem 0;
        color: var(--text-color);
    }

    .gie-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }

    .details-btn, .call-btn {
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        text-decoration: none;
        text-align: center;
    }

    .details-btn {
        background: var(--primary-color);
        color: white;
        border: none;
    }

    .call-btn {
        background: var(--accent-color);
        color: white;
    }

    /* Styles pour le modal */
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        max-width: 600px;
        width: 90%;
    }

    .modal-image {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: 5px;
        margin-bottom: 1rem;
    }

    .details-info {
        margin: 1rem 0;
    }

    .details-info p {
        margin: 0.5rem 0;
    }

    .close {
        float: right;
        font-size: 1.5rem;
        cursor: pointer;
    }
`;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Ajout des styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);

    // Affichage initial des entreprises
    displayGIE(gieDatabase);

    // Écouteurs d'événements pour la recherche
    document.getElementById('searchInput').addEventListener('input', searchGIE);
    document.getElementById('communeFilter').addEventListener('change', searchGIE);
});