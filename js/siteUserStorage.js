// Stockage des comptes utilisateurs du site (G.I.E / Associations)
// Données conservées dans localStorage

class SiteUserStorage {
  constructor() {
    this.storageKey = 'siteUsers';
    this.initialize();
  }

  initialize() {
    if (!localStorage.getItem(this.storageKey)) {
      this.saveUsers([]);
    }
  }

  getAll() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Erreur lecture siteUsers', e);
      return [];
    }
  }

  saveUsers(list) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(list));
    } catch (e) {
      console.error('Erreur écriture siteUsers', e);
    }
  }

  findByEmail(email) {
    return this.getAll().find(u => u.email.toLowerCase() === String(email).toLowerCase());
  }

  addUser({ type, entityId, email, password, name }) {
    const users = this.getAll();
    if (this.findByEmail(email)) throw new Error('Email déjà utilisé');
    const id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const user = { id, type, entityId, email, password, name, status: 'pending', createdAt: Date.now(), approvedAt: null };
    users.push(user);
    this.saveUsers(users);
    return user;
  }

  validateLogin(email, password) {
    const user = this.findByEmail(email);
    if (user && user.password === password && user.status === 'approved') return user;
    return null;
  }

  updateUser(id, payload) {
    const users = this.getAll();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...payload };
    this.saveUsers(users);
    return users[idx];
  }

  // Moderation helpers
  updateStatus(id, status){
    const users = this.getAll();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx].status = status;
    if (status === 'approved') users[idx].approvedAt = Date.now();
    this.saveUsers(users);
    return users[idx];
  }
  approveUser(id){ return this.updateStatus(id, 'approved'); }
  rejectUser(id){ return this.updateStatus(id, 'rejected'); }
  deleteUser(id){
    const users = this.getAll();
    const next = users.filter(u => u.id !== id);
    this.saveUsers(next);
    return true;
  }
  getByStatus(status){ return this.getAll().filter(u => u.status === status); }
}

const siteUserStorage = new SiteUserStorage();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SiteUserStorage, siteUserStorage };
} 