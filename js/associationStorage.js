// Système de stockage local pour les Associations
// Permet la synchronisation entre l'admin et la page publique

class AssociationStorage {
    constructor() {
        this.storageKey = 'keurMassarAssociations';
        this.initializeStorage();
    }

    // Initialiser le stockage (si vide, tenter de charger la base statique si disponible)
    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            try {
                if (typeof associationDatabase !== 'undefined' && Array.isArray(associationDatabase)) {
                    this.saveAssociations(associationDatabase);
                } else {
                    this.saveAssociations([]);
                }
            } catch (e) {
                console.error('Erreur d\'initialisation du stockage des associations:', e);
                this.saveAssociations([]);
            }
        }
    }

    getAllAssociations() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Erreur lors de la récupération des associations:', e);
            return [];
        }
    }

    getAssociationById(id) {
        const list = this.getAllAssociations();
        return list.find(a => a.id === id);
    }

    addAssociation(associationData) {
        try {
            const list = this.getAllAssociations();
            const newId = list.length > 0 ? Math.max(...list.map(a => a.id)) + 1 : 1;
            const newAssociation = {
                id: newId,
                ...associationData,
                dateCreation: associationData.dateCreation || new Date().getFullYear().toString(),
                statut: associationData.statut || 'Active'
            };
            list.push(newAssociation);
            this.saveAssociations(list);
            this.notifyUpdate('add', newAssociation);
            return newAssociation;
        } catch (e) {
            console.error('Erreur lors de l\'ajout de l\'association:', e);
            return null;
        }
    }

    updateAssociation(id, associationData) {
        try {
            const list = this.getAllAssociations();
            const index = list.findIndex(a => a.id === id);
            if (index !== -1) {
                list[index] = { ...list[index], ...associationData };
                this.saveAssociations(list);
                this.notifyUpdate('update', list[index]);
                return list[index];
            }
            return null;
        } catch (e) {
            console.error('Erreur lors de la mise à jour de l\'association:', e);
            return null;
        }
    }

    deleteAssociation(id) {
        try {
            const list = this.getAllAssociations();
            const index = list.findIndex(a => a.id === id);
            if (index !== -1) {
                const removed = list[index];
                list.splice(index, 1);
                this.saveAssociations(list);
                this.notifyUpdate('delete', removed);
                return true;
            }
            return false;
        } catch (e) {
            console.error('Erreur lors de la suppression de l\'association:', e);
            return false;
        }
    }

    saveAssociations(list) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(list));
        } catch (e) {
            console.error('Erreur lors de l\'enregistrement des associations:', e);
        }
    }

    exportData() {
        const list = this.getAllAssociations();
        const dataStr = JSON.stringify(list, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `associations_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    importData(jsonData) {
        try {
            const list = JSON.parse(jsonData);
            if (Array.isArray(list)) {
                this.saveAssociations(list);
                this.notifyUpdate('import', null);
                return true;
            }
            return false;
        } catch (e) {
            console.error('Erreur lors de l\'import des associations:', e);
            return false;
        }
    }

    notifyUpdate(action, association) {
        const event = new CustomEvent('associationUpdate', {
            detail: { action, association, timestamp: Date.now() }
        });
        window.dispatchEvent(event);
    }

    onUpdate(callback) {
        window.addEventListener('associationUpdate', (event) => {
            callback(event.detail);
        });
    }
}

// Instance globale
const associationStorage = new AssociationStorage();

// Export Node (si nécessaire)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AssociationStorage, associationStorage };
} 