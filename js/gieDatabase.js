// Base de données des G.I.E (Groupements d'Intérêt Économique)
// Script de génération automatique de 600 G.I.E

// Données de base pour la génération
const communes = [
    "Keur Massar Nord",
    "Keur Massar Sud", 
    "Yeumbeul Nord",
    "Yeumbeul Sud",
    "Malika",
    "Jaxaay-Parcelles"
];

const secteurs = [
    "Agriculture",
    "Artisanat",
    "Commerce",
    "Couture",
    "Technologie",
    "Services",
    "Transport",
    "Construction",
    "Alimentation",
    "Beauté",
    "Éducation",
    "Santé",
    "Environnement",
    "Tourisme",
    "Finance"
];

const prefixes = [
    "GIE",
    "Groupement",
    "Coopérative",
    "Association",
    "Union"
];

const noms = [
    "Femmes Entrepreneures",
    "Agriculteurs Unis",
    "Artisans de Malika",
    "Commerce Plus",
    "Couture Moderne",
    "Tech Innovation",
    "Maraîchers Solidaires",
    "Artisans du Cuir",
    "Commerçants Dynamiques",
    "Couturiers Créatifs",
    "Développement Rural",
    "Artisanat Traditionnel",
    "Commerce Local",
    "Mode Africaine",
    "Innovation Technologique",
    "Agriculture Biologique",
    "Artisans du Bois",
    "Commerce Équitable",
    "Couture Traditionnelle",
    "Services Numériques",
    "Maraîchage Urbain",
    "Artisanat Moderne",
    "Commerce de Proximité",
    "Mode Contemporaine",
    "Tech Solutions",
    "Agriculture Durable",
    "Artisans du Métal",
    "Commerce International",
    "Couture Élégante",
    "Services Innovants",
    "Production Laitière",
    "Artisanat Créatif",
    "Commerce Digital",
    "Mode Éthique",
    "Tech Hub",
    "Agriculture Familiale",
    "Artisans du Verre",
    "Commerce Solidaire",
    "Couture Professionnelle",
    "Services Environnementaux",
    "Élevage Moderne",
    "Artisanat d'Art",
    "Commerce Vert",
    "Mode Durable",
    "Tech Startups",
    "Agriculture Urbaine",
    "Artisans du Textile",
    "Commerce Responsable",
    "Couture de Luxe",
    "Services Sociaux",
    "Pêche Artisanale",
    "Artisanat Digital",
    "Commerce Écologique",
    "Mode Inclusive",
    "Tech Innovation Hub"
];

const prenoms = [
    "Fatoumata", "Awa", "Khady", "Mariama", "Aminata", "Oumou", "Aissatou", "Mame", "Ndeye", "Aïcha",
    "Amadou", "Mamadou", "Ousmane", "Moussa", "Ibrahima", "Abdou", "Modou", "Samba", "Cheikh", "Malick",
    "Moussa", "Boubacar", "Seydou", "Djibril", "Alassane", "Bakary", "Mamadou", "Ibrahima", "Omar", "Youssou"
];

const nomsFamille = [
    "Diop", "Ba", "Sow", "Diouf", "Diallo", "Fall", "Ndiaye", "Gueye", "Sy", "Cissé",
    "Thiam", "Sall", "Mbaye", "Faye", "Toure", "Kane", "Seck", "Dia", "Camara", "Baldé",
    "Mane", "Samb", "Demba", "Sane", "Gassama", "Jallow", "Jammeh", "Jatta", "Kinteh", "Kinte"
];

const adresses = [
    "Quartier Aïnoumady, Rue KM-15",
    "Zone maraîchère, Lot 45",
    "Marché artisanal, Stand 12",
    "Marché Central, N°23",
    "Cité des Artisans, N°45",
    "Cité Moderne, Rue 15",
    "Zone industrielle, Bloc A",
    "Quartier Darou Salam",
    "Cité des Maraîchers",
    "Zone commerciale, Rue 8",
    "Quartier Médina",
    "Cité des Pêcheurs",
    "Zone artisanale, Lot 7",
    "Quartier Diamalaye",
    "Cité des Commerçants",
    "Zone rurale, Parcelle 12",
    "Quartier Thiaroye",
    "Cité des Éleveurs",
    "Zone urbaine, Rue 22",
    "Quartier Malika Village",
    "Cité des Transporteurs",
    "Zone résidentielle, Lot 3",
    "Quartier Darou Rakhmane",
    "Cité des Services",
    "Zone économique, Rue 10",
    "Quartier Kamb",
    "Cité des Innovateurs",
    "Zone verte, Parcelle 5",
    "Quartier Boune",
    "Cité des Entrepreneurs",
    "Zone mixte, Rue 18",
    "Quartier Ngom",
    "Cité des Artistes",
    "Zone traditionnelle, Lot 9",
    "Quartier Jaxaay 1",
    "Cité des Créateurs",
    "Zone moderne, Rue 25",
    "Quartier Jaxaay 2",
    "Cité des Visionnaires",
    "Zone écologique, Parcelle 8",
    "Quartier Parcelles Assainies",
    "Cité des Pionniers",
    "Zone innovante, Rue 30",
    "Quartier Yeumbeul Layenne",
    "Cité des Leaders",
    "Zone dynamique, Lot 15",
    "Quartier Thiaroye Kao",
    "Cité des Ambassadeurs",
    "Zone prospère, Rue 35",
    "Quartier Darou Salam",
    "Cité des Champions",
    "Zone florissante, Parcelle 20"
];

// Fonction pour générer un numéro de téléphone aléatoire
function genererTelephone() {
    const prefixes = ["77", "76", "78", "70"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const numero = Math.floor(Math.random() * 90000000) + 10000000;
    return `+221 ${prefix} ${numero.toString().slice(0, 3)} ${numero.toString().slice(3, 5)} ${numero.toString().slice(5, 7)}`;
}

// Fonction pour générer un nombre de membres aléatoire
function genererNombreMembres() {
    const nombres = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
    return nombres[Math.floor(Math.random() * nombres.length)].toString();
}

// Fonction pour générer un nom de G.I.E
function genererNomGIE() {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const nom = noms[Math.floor(Math.random() * noms.length)];
    return `${prefix} ${nom}`;
}

// Fonction pour générer un nom de président
function genererPresident() {
    const prenom = prenoms[Math.floor(Math.random() * prenoms.length)];
    const nom = nomsFamille[Math.floor(Math.random() * nomsFamille.length)];
    const titre = prenom.startsWith('F') || prenom.startsWith('A') && prenom !== 'Amadou' ? "Mme" : "M.";
    return `${titre} ${prenom} ${nom}`;
}

// Fonction pour générer un type (Formelle ou Informelle)
function genererType() {
    return Math.random() > 0.4 ? "Formelle" : "Informelle";
}

// Fonction pour générer un secteur d'activité
function genererSecteur() {
    return secteurs[Math.floor(Math.random() * secteurs.length)];
}

// Génération de la base de données
const gieDatabase = [];

for (let i = 1; i <= 600; i++) {
    const gie = {
        id: i,
        nom: genererNomGIE(),
        image: "../images/gie/default-company.jpg",
        commune: communes[Math.floor(Math.random() * communes.length)],
        adresse: adresses[Math.floor(Math.random() * adresses.length)],
        telephone: genererTelephone(),
        president: genererPresident(),
        nombre: genererNombreMembres(),
        type: genererType(),
        secteur: genererSecteur(),
        description: `Groupe d'intérêt économique spécialisé dans ${genererSecteur().toLowerCase()} dans la commune de ${communes[Math.floor(Math.random() * communes.length)]}`,
        dateCreation: `${Math.floor(Math.random() * 10) + 2014}-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
        statut: Math.random() > 0.2 ? "Actif" : "En développement"
    };
    
    gieDatabase.push(gie);
}

// Export de la base de données
if (typeof module !== 'undefined' && module.exports) {
    module.exports = gieDatabase;
} else {
    window.gieDatabase = gieDatabase;
}

console.log(`Base de données G.I.E générée avec succès : ${gieDatabase.length} G.I.E créés`);
