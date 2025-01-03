// Données simulées des acteurs (à remplacer par une vraie base de données)
const acteurs = [
    {
        id: 1,
        nom: "Association Femmes Entrepreneures",
        categorie: "association",
        secteur: "artisanat",
        description: "Promotion de l'artisanat local par les femmes",
        image: "../images/acteurs/femmes-entrepreneures.jpg",
        contact: {
            email: "contact@femmes-entrepreneures.sn",
            telephone: "+221 77 000 00 01"
        }
    },
    {
        id: 2,
        nom: "Coopérative Agricole de Keur Massar",
        categorie: "cooperative",
        secteur: "agriculture",
        description: "Production et distribution de produits agricoles locaux",
        image: "../images/acteurs/cooperative-agricole.jpg",
        contact: {
            email: "info@coopagri-km.sn",
            telephone: "+221 77 000 00 02"
        }
    },
    // Ajoutez d'autres acteurs ici
];

// Fonction pour générer les cartes des acteurs
function generateActorCards(actors) {
    const directory = document.querySelector('.directory-grid');
    directory.innerHTML = '';

    actors.forEach(actor => {
        const card = document.createElement('div');
        card.className = 'actor-card';
        card.innerHTML = `
            <img src="${actor.image}" alt="${actor.nom}" class="actor-image">
            <div class="actor-info">
                <span class="actor-category">${actor.categorie}</span>
                <h3>${actor.nom}</h3>
                <p>${actor.description}</p>
                <div class="actor-contact">
                    <a href="mailto:${actor.contact.email}">
                        <i class="fas fa-envelope"></i>
                    </a>
                    <a href="tel:${actor.contact.telephone}">
                        <i class="fas fa-phone"></i>
                    </a>
                </div>
            </div>
        `;
        directory.appendChild(card);
    });
}

// Gestion des filtres
document.getElementById('search').addEventListener('input', filterActors);
document.getElementById('category').addEventListener('change', filterActors);
document.getElementById('sector').addEventListener('change', filterActors);

function filterActors() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const categoryFilter = document.getElementById('category').value;
    const sectorFilter = document.getElementById('sector').value;

    const filteredActors = acteurs.filter(actor => {
        const matchSearch = actor.nom.toLowerCase().includes(searchTerm) ||
                          actor.description.toLowerCase().includes(searchTerm);
        const matchCategory = !categoryFilter || actor.categorie === categoryFilter;
        const matchSector = !sectorFilter || actor.secteur === sectorFilter;

        return matchSearch && matchCategory && matchSector;
    });

    generateActorCards(filteredActors);
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    generateActorCards(acteurs);
});