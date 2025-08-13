// Stockage local des Utilisateurs (Admin)
// Fournit CRUD et persistance via localStorage

class UserStorage {
    constructor() {
        this.storageKey = 'keurMassarUsers';
        this.initializeStorage();
        this.upgradeSchema();
    }

    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            const defaultUsers = [
                { id: 1, nom: 'Admin Principal', email: 'Mamadou@negus-agency.com', role: 'Super Admin', password: 'Technox1408!' },
                { id: 2, nom: 'Utilisateur Test', email: 'test@keurmassar.sn', role: 'Éditeur', password: 'test123' },
                { id: 3, nom: 'Superviseur KM', email: 'superviseur@keurmassar.sn', role: 'Éditeur', password: 'super123' },
                { id: 4, nom: 'Gestionnaire GIE', email: 'gie.manager@keurmassar.sn', role: 'Admin', password: 'gie123' }
            ];
            this.saveUsers(defaultUsers);
        }
    }

    getAllUsers() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Erreur de lecture des utilisateurs:', e);
            return [];
        }
    }

    getUserById(id) {
        const users = this.getAllUsers();
        return users.find(u => u.id === id);
    }

    addUser(userData) {
        const users = this.getAllUsers();
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        const newUser = { id: newId, ...userData };
        if (!newUser.password || newUser.password.length < 4) {
            throw new Error('Mot de passe requis (4+ caractères)');
        }
        users.push(newUser);
        this.saveUsers(users);
        this.notifyUpdate('add', newUser);
        return newUser;
    }

    updateUser(id, userData) {
        const users = this.getAllUsers();
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...userData };
            this.saveUsers(users);
            this.notifyUpdate('update', users[index]);
            return users[index];
        }
        return null;
    }

    // Helper to update avatar (dataURL)
    updateUserAvatar(id, dataUrl) {
        return this.updateUser(id, { avatar: dataUrl });
    }

    deleteUser(id) {
        const users = this.getAllUsers();
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            const removed = users[index];
            users.splice(index, 1);
            this.saveUsers(users);
            this.notifyUpdate('delete', removed);
            return true;
        }
        return false;
    }

    saveUsers(users) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(users));
        } catch (e) {
            console.error('Erreur de sauvegarde des utilisateurs:', e);
        }
    }

    notifyUpdate(action, user) {
        const event = new CustomEvent('userUpdate', { detail: { action, user, timestamp: Date.now() } });
        window.dispatchEvent(event);
    }

    onUpdate(callback) {
        window.addEventListener('userUpdate', (e) => callback(e.detail));
    }

    // Migration: s'assurer que les mots de passe existent pour les anciens enregistrements
    upgradeSchema() {
        try {
            const users = this.getAllUsers();
            let changed = false;
            users.forEach(u => {
                // Renommer l'email de l'Admin Principal si ancien format
                if (u.email === 'admin@keurmassar.sn') {
                    u.email = 'Mamadou@negus-agency.com';
                    changed = true;
                }
                // Mettre à jour le mot de passe de Samba si présent
                if (typeof u.email === 'string' && u.email.toLowerCase() === 'samba@paessekm.sn') {
                    if (u.password !== 'Samba2025') {
                        u.password = 'Samba2025';
                        changed = true;
                    }
                }
                // Mettre à jour le mot de passe de President si présent
                if (typeof u.email === 'string' && u.email.toLowerCase() === 'president@paessekm.sn') {
                    if (u.password !== 'Gueye2025') {
                        u.password = 'Gueye2025';
                        changed = true;
                    }
                }
                // Mettre à jour le mot de passe de Sokhna si présent
                if (typeof u.email === 'string' && u.email.toLowerCase() === 'sokhna@paessekm.sn') {
                    if (u.password !== 'Sokhna2025') {
                        u.password = 'Sokhna2025';
                        changed = true;
                    }
                }
                if (!u.password) {
                    // Assigner un mot de passe par défaut simple si absent
                    if (u.email === 'Mamadou@negus-agency.com' || u.email === 'admin@keurmassar.sn') u.password = 'Technox1408!';
                    else if (u.email === 'test@keurmassar.sn') u.password = 'test123';
                    else if (u.email === 'superviseur@keurmassar.sn') u.password = 'super123';
                    else if (u.email === 'gie.manager@keurmassar.sn') u.password = 'gie123';
                    else u.password = 'pass1234';
                    changed = true;
                }
            });
            if (changed) {
                this.saveUsers(users);
            }
        } catch (e) {
            console.warn('Upgrade schema users skipped:', e);
        }
    }
}

// Instance globale
const userStorage = new UserStorage();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UserStorage, userStorage };
} 