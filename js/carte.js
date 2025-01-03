// Coordonnées du centre de Keur Massar
const KEUR_MASSAR_CENTER = [14.7828, -17.3233];
const ZOOM_LEVEL = 13;

// Initialisation de la carte
const map = L.map('map').setView(KEUR_MASSAR_CENTER, ZOOM_LEVEL);

// Ajout du fond de carte OpenStreetMap
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

// Ajouter les contrôles de zoom personnalisés
document.getElementById('zoomIn').addEventListener('click', () => {
    map.zoomIn();
});

document.getElementById('zoomOut').addEventListener('click', () => {
    map.zoomOut();
});

document.getElementById('centerMap').addEventListener('click', () => {
    map.setView(KEUR_MASSAR_CENTER, ZOOM_LEVEL);
});

// Optionnel : Ajouter une délimitation du département
const keurMassarBoundary = {
    "type": "Feature",
    "properties": {
        "name": "Keur Massar"
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-17.3533, 14.7528],
            [-17.2933, 14.7528],
            [-17.2933, 14.8128],
            [-17.3533, 14.8128],
            [-17.3533, 14.7528]
        ]]
    }
};

L.geoJSON(keurMassarBoundary, {
    style: {
        color: "var(--primary-color)",
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.1
    }
}).addTo(map);

// Fonction pour ajouter des marqueurs (exemple)
function addMarker(lat, lng, type, name, description) {
    const markerColors = {
        'association': '#FF4444',
        'cooperative': '#44FF44',
        'entreprise': '#4444FF',
        'ong': '#FFAA44'
    };

    const marker = L.circleMarker([lat, lng], {
        radius: 8,
        fillColor: markerColors[type],
        color: '#fff',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map);

    marker.bindPopup(`
        <div class="marker-popup">
            <h3>${name}</h3>
            <p>${description}</p>
            <a href="#" class="popup-link">En savoir plus</a>
        </div>
    `);

    return marker;
}

// Style pour les popups
const style = document.createElement('style');
style.textContent = `
    .marker-popup {
        padding: 10px;
    }
    .marker-popup h3 {
        margin: 0 0 8px 0;
        color: var(--text-primary);
    }
    .marker-popup p {
        margin: 0 0 8px 0;
        color: var(--text-secondary);
    }
    .popup-link {
        color: var(--accent-color);
        text-decoration: none;
        font-weight: 500;
    }
    .popup-link:hover {
        text-decoration: underline;
    }
`;
document.head.appendChild(style);

// Exemple d'ajout de quelques marqueurs
addMarker(14.7828, -17.3233, 'association', 'Association Example', 'Description de l\'association');
addMarker(14.7858, -17.3133, 'cooperative', 'Coopérative Example', 'Description de la coopérative');
addMarker(14.7798, -17.3333, 'entreprise', 'Entreprise Example', 'Description de l\'entreprise');