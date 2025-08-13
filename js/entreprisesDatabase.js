// Base de données des entreprises
const entreprisesDatabase = [
    {
        id: 1,
        nom: "EcoTech Solutions SARL",
        statut: "SARL",
        secteur: "Technologie",
        adresse: "Route de Rufisque, Keur Massar",
        telephone: "+221 33 123 45 67",
        email: "contact@ecotechsolutions.sn",
        directeur: "Mamadou Diallo",
        employes: 25,
        dateCreation: "2020-03-15",
        capital: "10 000 000 FCFA",
        description: "Entreprise spécialisée dans les solutions technologiques vertes et l'innovation durable.",
        activites: ["Développement logiciel", "Énergies renouvelables", "Consulting IT"],
        siteWeb: "www.ecotechsolutions.sn"
    },
    {
        id: 2,
        nom: "AgriBio SUARL",
        statut: "SUARL",
        secteur: "Agriculture",
        adresse: "Zone agricole, Keur Massar",
        telephone: "+221 33 234 56 78",
        email: "info@agribio.sn",
        directeur: "Fatou Sall",
        employes: 15,
        dateCreation: "2019-07-22",
        capital: "5 000 000 FCFA",
        description: "Entreprise d'agriculture biologique et de transformation de produits locaux.",
        activites: ["Agriculture biologique", "Transformation alimentaire", "Export"],
        siteWeb: "www.agribio.sn"
    },
    {
        id: 3,
        nom: "GreenBuild SA",
        statut: "SA",
        secteur: "Construction",
        adresse: "Avenue principale, Keur Massar",
        telephone: "+221 33 345 67 89",
        email: "contact@greenbuild.sn",
        directeur: "Ousmane Ba",
        employes: 45,
        dateCreation: "2018-11-10",
        capital: "50 000 000 FCFA",
        description: "Société de construction spécialisée dans les bâtiments écologiques et durables.",
        activites: ["Construction écologique", "Rénovation", "Architecture durable"],
        siteWeb: "www.greenbuild.sn"
    },
    {
        id: 4,
        nom: "SocialFinance SAS",
        statut: "SAS",
        secteur: "Finance",
        adresse: "Centre commercial, Keur Massar",
        telephone: "+221 33 456 78 90",
        email: "info@socialfinance.sn",
        directeur: "Aissatou Diop",
        employes: 30,
        dateCreation: "2021-01-20",
        capital: "25 000 000 FCFA",
        description: "Institution de microfinance sociale dédiée à l'inclusion financière.",
        activites: ["Microcrédit", "Épargne", "Assurance inclusive"],
        siteWeb: "www.socialfinance.sn"
    },

    {
        id: 6,
        nom: "EduTech SARL",
        statut: "SARL",
        secteur: "Éducation",
        adresse: "Quartier éducatif, Keur Massar",
        telephone: "+221 33 678 90 12",
        email: "info@edutech.sn",
        directeur: "Mariama Sow",
        employes: 18,
        dateCreation: "2021-05-12",
        capital: "8 000 000 FCFA",
        description: "Entreprise de technologies éducatives et de formation numérique.",
        activites: ["Formation numérique", "Développement éducatif", "E-learning"],
        siteWeb: "www.edutech.sn"
    },

    {
        id: 8,
        nom: "ArtisanPlus SA",
        statut: "SA",
        secteur: "Artisanat",
        adresse: "Village artisanal, Keur Massar",
        telephone: "+221 33 890 12 34",
        email: "info@artisanplus.sn",
        directeur: "Ibrahima Thiam",
        employes: 28,
        dateCreation: "2020-06-18",
        capital: "12 000 000 FCFA",
        description: "Entreprise de promotion et de commercialisation de l'artisanat local.",
        activites: ["Artisanat traditionnel", "Formation artisanale", "Export"],
        siteWeb: "www.artisanplus.sn"
    }
];

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = entreprisesDatabase;
} 