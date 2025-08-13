// Système de stockage local pour les G.I.E
// Ce fichier permet la synchronisation entre l'admin et la page publique

class GIEStorage {
    constructor() {
        this.storageKey = 'keurMassarGIE';
        this.initializeStorage();
    }

    // Initialiser le stockage avec des données par défaut
    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            const defaultGIE = [
                {
                    id: 1,
                    nom: "GIE Femmes Entrepreneures",
                    commune: "Keur Massar Nord",
                    adresse: "Quartier Aïnoumady, Rue KM-15",
                    telephone: "+221 77 123 45 67",
                    president: "Mme Fatoumata Diop",
                    nombre: "50",
                    type: "Formelle",
                    secteur: "Commerce",
                    email: "femmes.entrepreneures@email.com",
                    dateCreation: "2020-03-15",
                    statut: "Actif",
                    description: "Groupement de femmes entrepreneures spécialisées dans le commerce local"
                },
                {
                    id: 2,
                    nom: "GIE Agriculteurs Unis",
                    commune: "Keur Massar Sud",
                    adresse: "Zone maraîchère, Lot 45",
                    telephone: "+221 77 234 56 78",
                    president: "M. Amadou Ba",
                    nombre: "75",
                    type: "Informelle",
                    secteur: "Agriculture",
                    email: "agriculteurs.unis@email.com",
                    dateCreation: "2019-07-22",
                    statut: "Actif",
                    description: "Coopérative agricole spécialisée dans la production maraîchère"
                },
                {
                    id: 3,
                    nom: "GIE Artisans de Malika",
                    commune: "Malika",
                    adresse: "Marché artisanal, Stand 12",
                    telephone: "+221 77 345 67 89",
                    president: "Mme Awa Diouf",
                    nombre: "30",
                    type: "Formelle",
                    secteur: "Artisanat",
                    email: "artisans.malika@email.com",
                    dateCreation: "2021-01-10",
                    statut: "Actif",
                    description: "Association d'artisans traditionnels de Malika"
                }
            ];
            this.saveGIE(defaultGIE);
        }
    }

    // Récupérer tous les G.I.E
    getAllGIE() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Erreur lors de la récupération des G.I.E:', error);
            return [];
        }
    }

    // Récupérer un G.I.E par ID
    getGIEById(id) {
        const gieList = this.getAllGIE();
        return gieList.find(gie => gie.id === id);
    }

    // Ajouter un nouveau G.I.E
    addGIE(gieData) {
        try {
            const gieList = this.getAllGIE();
            const newId = gieList.length > 0 ? Math.max(...gieList.map(gie => gie.id)) + 1 : 1;
            
            const newGIE = {
                id: newId,
                ...gieData,
                dateCreation: new Date().toISOString().split('T')[0],
                statut: "Actif"
            };

            gieList.push(newGIE);
            this.saveGIE(gieList);
            
            // Déclencher un événement personnalisé pour notifier les autres pages
            this.notifyUpdate('add', newGIE);
            
            return newGIE;
        } catch (error) {
            console.error('Erreur lors de l\'ajout du G.I.E:', error);
            return null;
        }
    }

    // Mettre à jour un G.I.E
    updateGIE(id, gieData) {
        try {
            const gieList = this.getAllGIE();
            const index = gieList.findIndex(gie => gie.id === id);
            
            if (index !== -1) {
                gieList[index] = { ...gieList[index], ...gieData };
                this.saveGIE(gieList);
                
                // Déclencher un événement personnalisé
                this.notifyUpdate('update', gieList[index]);
                
                return gieList[index];
            }
            return null;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du G.I.E:', error);
            return null;
        }
    }

    // Supprimer un G.I.E
    deleteGIE(id) {
        try {
            const gieList = this.getAllGIE();
            const index = gieList.findIndex(gie => gie.id === id);
            
            if (index !== -1) {
                const deletedGIE = gieList[index];
                gieList.splice(index, 1);
                this.saveGIE(gieList);
                
                // Déclencher un événement personnalisé
                this.notifyUpdate('delete', deletedGIE);
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Erreur lors de la suppression du G.I.E:', error);
            return false;
        }
    }

    // Rechercher des G.I.E
    searchGIE(query) {
        const gieList = this.getAllGIE();
        const searchTerm = query.toLowerCase();
        
        return gieList.filter(gie => 
            gie.nom.toLowerCase().includes(searchTerm) ||
            gie.president.toLowerCase().includes(searchTerm) ||
            gie.commune.toLowerCase().includes(searchTerm) ||
            gie.secteur.toLowerCase().includes(searchTerm) ||
            (gie.description && gie.description.toLowerCase().includes(searchTerm))
        );
    }

    // Filtrer par commune
    filterByCommune(commune) {
        const gieList = this.getAllGIE();
        return gieList.filter(gie => gie.commune === commune);
    }

    // Filtrer par secteur
    filterBySecteur(secteur) {
        const gieList = this.getAllGIE();
        return gieList.filter(gie => gie.secteur === secteur);
    }

    // Filtrer par type
    filterByType(type) {
        const gieList = this.getAllGIE();
        return gieList.filter(gie => gie.type === type);
    }

    // Obtenir les statistiques
    getStats() {
        const gieList = this.getAllGIE();
        return {
            total: gieList.length,
            parCommune: gieList.reduce((acc, gie) => {
                acc[gie.commune] = (acc[gie.commune] || 0) + 1;
                return acc;
            }, {}),
            parSecteur: gieList.reduce((acc, gie) => {
                acc[gie.secteur] = (acc[gie.secteur] || 0) + 1;
                return acc;
            }, {}),
            parType: gieList.reduce((acc, gie) => {
                acc[gie.type] = (acc[gie.type] || 0) + 1;
                return acc;
            }, {})
        };
    }

    // Sauvegarder dans le localStorage
    saveGIE(gieList) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(gieList));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des G.I.E:', error);
        }
    }

    // Notifier les autres pages des changements
    notifyUpdate(action, gie) {
        const event = new CustomEvent('gieUpdate', {
            detail: { action, gie, timestamp: Date.now() }
        });
        window.dispatchEvent(event);
    }

    // Écouter les changements
    onUpdate(callback) {
        window.addEventListener('gieUpdate', (event) => {
            callback(event.detail);
        });
    }

    // Écouter les changements de localStorage (pour les autres onglets)
    onStorageChange(callback) {
        window.addEventListener('storage', (event) => {
            if (event.key === this.storageKey) {
                callback();
            }
        });
    }

    // Exporter les données
    exportData() {
        const gieList = this.getAllGIE();
        const dataStr = JSON.stringify(gieList, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `gie_database_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Importer des données
    importData(jsonData) {
        try {
            const gieList = JSON.parse(jsonData);
            if (Array.isArray(gieList)) {
                this.saveGIE(gieList);
                this.notifyUpdate('import', null);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Erreur lors de l\'import des données:', error);
            return false;
        }
    }

    // Vider le stockage
    clearStorage() {
        localStorage.removeItem(this.storageKey);
        this.notifyUpdate('clear', null);
    }
}

// Créer une instance globale
const gieStorage = new GIEStorage();

// Exporter pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GIEStorage, gieStorage };
} 