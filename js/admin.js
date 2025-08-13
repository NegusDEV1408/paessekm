// JS pour le dashboard admin avec intégration de la base de données G.I.E. et Associations complètes

// Variables globales pour la gestion des G.I.E.
let currentGieDatabase = [];
let filteredGieDatabase = [];

// Variables globales pour la gestion des Associations
let currentAssociationDatabase = [];
let filteredAssociationDatabase = [];

// Suivi de l'utilisateur admin courant
let currentAdminUser = null;
let currentAdminRole = 'Super Admin';

function getCurrentAdminUser() {
    try {
        const raw = sessionStorage.getItem('currentAdminUser');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function applyRolePermissions(user) {
    currentAdminUser = user;
    currentAdminRole = (user && user.role) ? user.role : 'Super Admin';

    const nameEl = document.querySelector('.admin-name');
    const roleEl = document.querySelector('.admin-role');
    if (nameEl) nameEl.textContent = user ? user.nom : 'Administrateur';
    if (roleEl) roleEl.textContent = user ? user.role : 'Super Admin';
    const avatarEl = document.getElementById('admin-avatar');
    if (avatarEl) {
        // Set initials from name if no image
        const initials = (user && user.nom) ? user.nom.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase() : 'AD';
        avatarEl.textContent = initials;
    }

    // Masquer la gestion des utilisateurs pour Admin et Éditeur
    if (currentAdminRole === 'Admin' || currentAdminRole === 'Éditeur') {
        const usersSection = document.getElementById('users');
        if (usersSection) usersSection.style.display = 'none';
        const usersMenu = document.querySelector('.sidebar-menu a[href="#users"]');
        if (usersMenu && usersMenu.parentElement) usersMenu.parentElement.style.display = 'none';
    }

    // Éditeur: lecture seule (désactiver actions d'écriture)
    if (currentAdminRole === 'Éditeur') {
        const toDisable = [
            '#add-gie-btn', '#gie-sync-btn', '#gie-merge-btn', '#export-gie-btn', '#export-pdf-btn', '#print-all-btn',
            '#add-association-btn', '#association-sync-btn', '#association-merge-btn', '#export-association-btn', '#export-association-pdf-btn', '#print-all-associations-btn',
            '#user-add-btn'
        ];
        toDisable.forEach(sel => { const el = document.querySelector(sel); if (el) { el.disabled = true; el.setAttribute('data-tooltip', 'Action réservée aux administrateurs'); }});
        // Désactiver aussi les boutons d'action dans les tableaux
        document.querySelectorAll('#gie-table .gie-action-btn, #association-table .gie-action-btn').forEach(btn => {
            btn.disabled = true;
            btn.setAttribute('data-tooltip', 'Action réservée aux administrateurs');
        });
    }
}

// Garde-fous côté handlers
function requireAdminOrSuperAdmin() {
    if (!(currentAdminRole === 'Admin' || currentAdminRole === 'Super Admin')) {
        alert('Action réservée aux administrateurs.');
        return false;
    }
    return true;
}

function requireSuperAdmin() {
    if (currentAdminRole !== 'Super Admin') {
        alert('Action réservée au Super Admin.');
        return false;
    }
    return true;
}

// Initialisation de la base de données G.I.E.
function initializeGieDatabase() {
    // Utiliser le système de stockage local
    if (typeof gieStorage !== 'undefined') {
        currentGieDatabase = gieStorage.getAllGIE();
        filteredGieDatabase = [...currentGieDatabase];
        
        // Écouter les changements
        gieStorage.onUpdate((updateInfo) => {
            console.log('Mise à jour G.I.E détectée:', updateInfo);
            refreshGieData();
        });
        
        console.log('Base de données G.I.E. initialisée avec', currentGieDatabase.length, 'enregistrements');
    } else {
        console.error('Système de stockage G.I.E non disponible');
    }
}

// Fonction pour rafraîchir les données G.I.E
function refreshGieData() {
    if (typeof gieStorage !== 'undefined') {
        currentGieDatabase = gieStorage.getAllGIE();
        filteredGieDatabase = [...currentGieDatabase];
        renderGieTable();
        updateGieCounter();
        populateGieFilterOptions();
    }
}

// Fonction pour rafraîchir toutes les données du dashboard
function refreshAllDashboardData() {
  // Rafraîchir les données G.I.E
  if (typeof refreshGieData === 'function') {
    refreshGieData();
  }
  
  // Rafraîchir les données Associations
  if (typeof refreshAssociationData === 'function') {
    refreshAssociationData();
  }
  
  // Rafraîchir les compteurs
  if (typeof updateGieCounter === 'function') {
    updateGieCounter();
  }
  if (typeof updateAssociationCounter === 'function') {
    updateAssociationCounter();
  }
  
  console.log('Toutes les données du dashboard ont été rafraîchies');
}

// ==================== GESTION DES G.I.E. ====================

// Fonction pour rendre le tableau des G.I.E.
function renderGieTable(data = filteredGieDatabase) {
    const tbody = document.querySelector('#gie-table tbody');
    if (!tbody) {
        console.error('Tableau G.I.E. non trouvé');
        return;
    }
    
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 20px;">Aucun G.I.E. trouvé</td></tr>';
        return;
    }
    
    data.forEach(gie => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${gie.id || ''}</td>
            <td>${gie.nom || ''}</td>
            <td>${gie.commune || ''}</td>
            <td>${gie.adresse || ''}</td>
            <td>${gie.telephone || ''}</td>
            <td>${gie.president || ''}</td>
            <td>${gie.nombre || ''}</td>
            <td>${gie.type || ''}</td>
            <td>${gie.secteur || ''}</td>
            <td>
                <button class="gie-action-btn" onclick="handleEditGie(${gie.id})" title="Modifier">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="gie-action-btn" style="background:#e74c3c;" onclick="handleDeleteGie(${gie.id})" title="Supprimer">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    updateGieCounter();
}

// Fonction pour mettre à jour le compteur de G.I.E.
function updateGieCounter() {
    const counter = document.getElementById('gie-counter');
    const countElement = document.getElementById('gie-count');
    if (counter) {
        counter.textContent = `${filteredGieDatabase.length} G.I.E. affichés sur ${currentGieDatabase.length} total`;
    }
    if (countElement) {
        countElement.textContent = currentGieDatabase.length;
    }
}

// Fonction de recherche et filtrage pour G.I.E.
function filterGieDatabase() {
    const searchInput = document.getElementById('gie-search');
    const communeFilter = document.getElementById('gie-commune-filter');
    const typeFilter = document.getElementById('gie-type-filter');
    const secteurFilter = document.getElementById('gie-secteur-filter');
    
    if (!searchInput || !communeFilter || !typeFilter || !secteurFilter) {
        return;
    }
    
    const searchTerm = searchInput.value.toLowerCase();
    const communeValue = communeFilter.value;
    const typeValue = typeFilter.value;
    const secteurValue = secteurFilter.value;
    
    filteredGieDatabase = currentGieDatabase.filter(gie => {
        const matchesSearch = !searchTerm || 
                            (gie.nom && gie.nom.toLowerCase().includes(searchTerm)) ||
                            (gie.president && gie.president.toLowerCase().includes(searchTerm)) ||
                            (gie.adresse && gie.adresse.toLowerCase().includes(searchTerm));
        
        const matchesCommune = !communeValue || gie.commune === communeValue;
        const matchesType = !typeValue || gie.type === typeValue;
        const matchesSecteur = !secteurValue || gie.secteur === secteurValue;
        
        return matchesSearch && matchesCommune && matchesType && matchesSecteur;
    });
    
    renderGieTable();
}

// Fonction pour peupler les options de filtre G.I.E.
function populateGieFilterOptions() {
    const communes = [...new Set(currentGieDatabase.map(gie => gie.commune).filter(Boolean))];
    const types = [...new Set(currentGieDatabase.map(gie => gie.type).filter(Boolean))];
    const secteurs = [...new Set(currentGieDatabase.map(gie => gie.secteur).filter(Boolean))];
    
    const communeFilter = document.getElementById('gie-commune-filter');
    const typeFilter = document.getElementById('gie-type-filter');
    const secteurFilter = document.getElementById('gie-secteur-filter');
    
    if (communeFilter) {
        communeFilter.innerHTML = '<option value="">Toutes les communes</option>';
        communes.forEach(commune => {
            communeFilter.innerHTML += `<option value="${commune}">${commune}</option>`;
        });
    }
    
    if (typeFilter) {
        typeFilter.innerHTML = '<option value="">Tous les types</option>';
        types.forEach(type => {
            typeFilter.innerHTML += `<option value="${type}">${type}</option>`;
        });
    }
    
    if (secteurFilter) {
        secteurFilter.innerHTML = '<option value="">Tous les secteurs</option>';
        secteurs.forEach(secteur => {
            secteurFilter.innerHTML += `<option value="${secteur}">${secteur}</option>`;
        });
    }
}

// Fonction pour afficher le formulaire G.I.E.
function showGieForm(edit = false, gie = null) {
    const form = document.getElementById('gie-form');
    if (form) {
        form.style.display = 'block';
        if (edit && gie) {
            document.getElementById('gie-id').value = gie.id;
            document.getElementById('gie-nom').value = gie.nom || '';
            document.getElementById('gie-commune').value = gie.commune || '';
            document.getElementById('gie-adresse').value = gie.adresse || '';
            document.getElementById('gie-telephone').value = gie.telephone || '';
            document.getElementById('gie-president').value = gie.president || '';
            document.getElementById('gie-nombre').value = gie.nombre || '';
            document.getElementById('gie-type').value = gie.type || '';
            document.getElementById('gie-secteur').value = gie.secteur || '';
        } else {
            form.reset();
            document.getElementById('gie-id').value = '';
        }
    }
}

// Fonction pour masquer le formulaire G.I.E.
function hideGieForm() {
    const form = document.getElementById('gie-form');
    if (form) form.style.display = 'none';
}

// Fonction pour éditer un G.I.E.
function handleEditGie(id) {
    if (typeof gieStorage !== 'undefined') {
        const gie = gieStorage.getGIEById(id);
        if (gie) {
            showGieForm(true, gie);
        }
    }
}

// Fonction pour supprimer un G.I.E.
function handleDeleteGie(id) {
    if (!requireAdminOrSuperAdmin()) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer ce G.I.E. ?')) {
        if (typeof gieStorage !== 'undefined') {
            const success = gieStorage.deleteGIE(id);
            if (success) {
                refreshGieData();
                showNotification('G.I.E. supprimé avec succès !', 'success');
            } else {
                showNotification('Erreur lors de la suppression du G.I.E.', 'error');
            }
        }
    }
}

// Fonction pour gérer la soumission du formulaire G.I.E.
function handleGieFormSubmit(e) {
    if (!requireAdminOrSuperAdmin()) { e.preventDefault(); return; }
    e.preventDefault();
    
    const formData = {
        nom: document.getElementById('gie-nom').value,
        commune: document.getElementById('gie-commune').value,
        adresse: document.getElementById('gie-adresse').value,
        telephone: document.getElementById('gie-telephone').value,
        president: document.getElementById('gie-president').value,
        nombre: document.getElementById('gie-nombre').value,
        type: document.getElementById('gie-type').value,
        secteur: document.getElementById('gie-secteur').value,
        email: document.getElementById('gie-email')?.value || '',
        description: document.getElementById('gie-description')?.value || ''
    };
    
    const editId = document.getElementById('gie-id').value;
    
    if (editId) {
        // Mise à jour
        if (typeof gieStorage !== 'undefined') {
            const updatedGie = gieStorage.updateGIE(parseInt(editId), formData);
            if (updatedGie) {
                refreshGieData();
                showNotification('G.I.E. mis à jour avec succès !', 'success');
            } else {
                showNotification('Erreur lors de la mise à jour du G.I.E.', 'error');
            }
        }
    } else {
        // Ajout
        if (typeof gieStorage !== 'undefined') {
            const newGie = gieStorage.addGIE(formData);
            if (newGie) {
                refreshGieData();
                showNotification('G.I.E. ajouté avec succès !', 'success');
            } else {
                showNotification('Erreur lors de l\'ajout du G.I.E.', 'error');
            }
        }
    }
    
    hideGieForm();
    e.target.reset();
}

// Fonction d'export JSON pour G.I.E.
function exportGieDatabase() {
    const exportTextarea = document.getElementById('gie-export');
    if (exportTextarea) {
        exportTextarea.value = JSON.stringify(currentGieDatabase, null, 2);
        exportTextarea.style.display = 'block';
        exportTextarea.select();
        document.execCommand('copy');
        alert('Base de données G.I.E. copiée dans le presse-papiers !');
    }
}

// Fonction d'export PDF pour G.I.E.
function exportGieToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Base de données G.I.E. - Keur Massar', 20, 20);
    
    const headers = [['ID', 'Nom', 'Commune', 'Téléphone', 'Président', 'Membres', 'Type', 'Secteur']];
    const data = currentGieDatabase.map(gie => [
        gie.id || '',
        gie.nom || '',
        gie.commune || '',
        gie.telephone || '',
        gie.president || '',
        gie.nombre || '',
        gie.type || '',
        gie.secteur || ''
    ]);
    
    doc.autoTable({
        head: headers,
        body: data,
        startY: 30,
        styles: {
            fontSize: 8,
            cellPadding: 2
        },
        headStyles: {
            fillColor: [78, 115, 223],
            textColor: 255
        }
    });
    
    doc.save('base_donnees_gie_keur_massar.pdf');
}

// Fonction d'impression pour G.I.E.
function printAllGIE() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Base de données G.I.E. - Keur Massar</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #4e73df; color: white; }
                h1 { color: #4e73df; }
                @media print {
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>Base de données G.I.E. - Keur Massar</h1>
            <p>Total: ${currentGieDatabase.length} G.I.E.</p>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Commune</th>
                        <th>Adresse</th>
                        <th>Téléphone</th>
                        <th>Président</th>
                        <th>Membres</th>
                        <th>Type</th>
                        <th>Secteur</th>
                    </tr>
                </thead>
                <tbody>
                    ${currentGieDatabase.map(gie => `
                        <tr>
                            <td>${gie.id || ''}</td>
                            <td>${gie.nom || ''}</td>
                            <td>${gie.commune || ''}</td>
                            <td>${gie.adresse || ''}</td>
                            <td>${gie.telephone || ''}</td>
                            <td>${gie.president || ''}</td>
                            <td>${gie.nombre || ''}</td>
                            <td>${gie.type || ''}</td>
                            <td>${gie.secteur || ''}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="no-print">
                <button onclick="window.print()">Imprimer</button>
                <button onclick="window.close()">Fermer</button>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// Fonction de réinitialisation des filtres G.I.E.
function resetFilters() {
    const searchInput = document.getElementById('gie-search');
    const communeFilter = document.getElementById('gie-commune-filter');
    const typeFilter = document.getElementById('gie-type-filter');
    const secteurFilter = document.getElementById('gie-secteur-filter');
    
    if (searchInput) searchInput.value = '';
    if (communeFilter) communeFilter.value = '';
    if (typeFilter) typeFilter.value = '';
    if (secteurFilter) secteurFilter.value = '';
    
    filteredGieDatabase = [...currentGieDatabase];
    renderGieTable();
}

// Fonction de synchronisation G.I.E.
function syncWithMainDatabase() {
    if (!requireAdminOrSuperAdmin()) return;
    if (typeof gieDatabase !== 'undefined') {
        currentGieDatabase = [...gieDatabase];
        filteredGieDatabase = [...gieDatabase];
        // Persister dans le stockage local pour la page publique
        if (typeof gieStorage !== 'undefined') {
            try {
                gieStorage.saveGIE(currentGieDatabase);
            } catch (e) {
                console.error('Erreur de sauvegarde dans le stockage local:', e);
            }
        }
        renderGieTable();
        populateGieFilterOptions();
        updateGieCounter();
        alert('Base de données G.I.E. synchronisée et sauvegardée !');
    } else {
        alert('Base de données G.I.E. indisponible (gieDatabase non chargé).');
    }
}

// Nouvelle fonction: fusionner la base statique (600) avec la base locale sans écraser les ajouts
function mergeWithMainGieDatabase() {
    if (!requireAdminOrSuperAdmin()) return;
    if (typeof gieDatabase === 'undefined') {
        alert('Base de données G.I.E. indisponible (gieDatabase non chargé).');
        return;
    }
    const strategySelect = document.getElementById('gie-merge-strategy');
    const strategy = strategySelect ? strategySelect.value : 'keepLocal';

    // Indexer la base locale et statique par ID
    const localById = new Map(currentGieDatabase.map(g => [g.id, g]));
    const staticById = new Map(gieDatabase.map(g => [g.id, g]));

    let added = 0;
    let replaced = 0;

    for (const [id, staticG] of staticById.entries()) {
        const localG = localById.get(id);
        if (!localG) {
            // Pas présent en local, on ajoute
            localById.set(id, staticG);
            added++;
        } else if (strategy === 'preferStatic') {
            // Remplacer la version locale par la version statique
            localById.set(id, staticG);
            replaced++;
        } // else keepLocal: on garde la version locale
    }

    const merged = Array.from(localById.values());
    currentGieDatabase = merged;
    filteredGieDatabase = [...merged];

    if (typeof gieStorage !== 'undefined') {
        try {
            gieStorage.saveGIE(merged);
        } catch (e) {
            console.error('Erreur de sauvegarde lors de la fusion:', e);
        }
    }

    renderGieTable();
    populateGieFilterOptions();
    updateGieCounter();
    alert(`Fusion terminée: ${merged.length} éléments au total (ajoutés: ${added}, remplacés: ${replaced}).`);
}

// Fonction de debug G.I.E.
function debugGieDatabase() {
    console.log('=== DEBUG G.I.E. DATABASE ===');
    console.log('Base de données originale:', (typeof gieDatabase !== 'undefined' ? gieDatabase : '(gieDatabase non chargé)'));
    console.log('Base de données actuelle:', currentGieDatabase);
    console.log('Base de données filtrée:', filteredGieDatabase);
    console.log('Nombre total:', currentGieDatabase.length);
    console.log('Nombre filtré:', filteredGieDatabase.length);
}

// ==================== GESTION DES ASSOCIATIONS ====================

// Fonction pour rendre le tableau des Associations
function renderAssociationTable(data = filteredAssociationDatabase) {
    const tbody = document.querySelector('#association-table tbody');
    if (!tbody) {
        console.error('Tableau Associations non trouvé');
        return;
    }
    
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="13" style="text-align: center; padding: 20px;">Aucune Association trouvée</td></tr>';
        return;
    }
    
    data.forEach(association => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${association.id || ''}</td>
            <td>${association.nom || ''}</td>
            <td>${association.commune || ''}</td>
            <td>${association.adresse || ''}</td>
            <td>${association.telephone || ''}</td>
            <td>${association.president || ''}</td>
            <td>${association.nombre || ''}</td>
            <td>${association.type || ''}</td>
            <td>${association.secteur || ''}</td>
            <td>${association.email || ''}</td>
            <td>${association.dateCreation || ''}</td>
            <td>${association.statut || ''}</td>
            <td>
                <button class="gie-action-btn" onclick="handleEditAssociation(${association.id})" title="Modifier">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="gie-action-btn" style="background:#e74c3c;" onclick="handleDeleteAssociation(${association.id})" title="Supprimer">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    updateAssociationCounter();
}

// Fonction pour mettre à jour le compteur d'Associations
function updateAssociationCounter() {
    const counter = document.getElementById('association-counter');
    const countElement = document.getElementById('association-count');
    if (counter) {
        counter.textContent = `${filteredAssociationDatabase.length} Associations affichées sur ${currentAssociationDatabase.length} total`;
    }
    if (countElement) {
        countElement.textContent = currentAssociationDatabase.length;
    }
}

// Fonction de recherche et filtrage pour Associations
function filterAssociationDatabase() {
    const searchInput = document.getElementById('association-search');
    const communeFilter = document.getElementById('association-commune-filter');
    const typeFilter = document.getElementById('association-type-filter');
    const secteurFilter = document.getElementById('association-secteur-filter');
    const statutFilter = document.getElementById('association-statut-filter');
    
    if (!searchInput || !communeFilter || !typeFilter || !secteurFilter || !statutFilter) {
        return;
    }
    
    const searchTerm = searchInput.value.toLowerCase();
    const communeValue = communeFilter.value;
    const typeValue = typeFilter.value;
    const secteurValue = secteurFilter.value;
    const statutValue = statutFilter.value;
    
    filteredAssociationDatabase = currentAssociationDatabase.filter(association => {
        const matchesSearch = !searchTerm || 
                            (association.nom && association.nom.toLowerCase().includes(searchTerm)) ||
                            (association.president && association.president.toLowerCase().includes(searchTerm)) ||
                            (association.adresse && association.adresse.toLowerCase().includes(searchTerm));
        
        const matchesCommune = !communeValue || association.commune === communeValue;
        const matchesType = !typeValue || association.type === typeValue;
        const matchesSecteur = !secteurValue || association.secteur === secteurValue;
        const matchesStatut = !statutValue || association.statut === statutValue;
        
        return matchesSearch && matchesCommune && matchesType && matchesSecteur && matchesStatut;
    });
    
    renderAssociationTable();
}

// Fonction pour peupler les options de filtre Associations
function populateAssociationFilterOptions() {
    const communes = [...new Set(currentAssociationDatabase.map(association => association.commune).filter(Boolean))];
    const types = [...new Set(currentAssociationDatabase.map(association => association.type).filter(Boolean))];
    const secteurs = [...new Set(currentAssociationDatabase.map(association => association.secteur).filter(Boolean))];
    const statuts = [...new Set(currentAssociationDatabase.map(association => association.statut).filter(Boolean))];
    
    const communeFilter = document.getElementById('association-commune-filter');
    const typeFilter = document.getElementById('association-type-filter');
    const secteurFilter = document.getElementById('association-secteur-filter');
    const statutFilter = document.getElementById('association-statut-filter');
    
    if (communeFilter) {
        communeFilter.innerHTML = '<option value="">Toutes les communes</option>';
        communes.forEach(commune => {
            communeFilter.innerHTML += `<option value="${commune}">${commune}</option>`;
        });
    }
    
    if (typeFilter) {
        typeFilter.innerHTML = '<option value="">Tous les types</option>';
        types.forEach(type => {
            typeFilter.innerHTML += `<option value="${type}">${type}</option>`;
        });
    }
    
    if (secteurFilter) {
        secteurFilter.innerHTML = '<option value="">Tous les secteurs</option>';
        secteurs.forEach(secteur => {
            secteurFilter.innerHTML += `<option value="${secteur}">${secteur}</option>`;
        });
    }
    
    if (statutFilter) {
        statutFilter.innerHTML = '<option value="">Tous les statuts</option>';
        statuts.forEach(statut => {
            statutFilter.innerHTML += `<option value="${statut}">${statut}</option>`;
        });
    }
}

// Fonction pour afficher le formulaire Association
function showAssociationForm(edit = false, association = null) {
    const form = document.getElementById('association-form');
    if (form) {
        form.style.display = 'block';
        if (edit && association) {
            document.getElementById('association-id').value = association.id;
            document.getElementById('association-nom').value = association.nom || '';
            document.getElementById('association-commune').value = association.commune || '';
            document.getElementById('association-adresse').value = association.adresse || '';
            document.getElementById('association-telephone').value = association.telephone || '';
            document.getElementById('association-president').value = association.president || '';
            document.getElementById('association-nombre').value = association.nombre || '';
            document.getElementById('association-type').value = association.type || '';
            document.getElementById('association-secteur').value = association.secteur || '';
            document.getElementById('association-email').value = association.email || '';
            document.getElementById('association-dateCreation').value = association.dateCreation || '';
            document.getElementById('association-statut').value = association.statut || '';
        } else {
            form.reset();
            document.getElementById('association-id').value = '';
        }
    }
}

// Fonction pour masquer le formulaire Association
function hideAssociationForm() {
    const form = document.getElementById('association-form');
    if (form) form.style.display = 'none';
}

// Fonction pour éditer une Association
function handleEditAssociation(id) {
    const association = currentAssociationDatabase.find(a => a.id === id);
    if (association) {
        showAssociationForm(true, association);
    }
}

// Fonction pour supprimer une Association
function handleDeleteAssociation(id) {
    if (!requireAdminOrSuperAdmin()) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer cette Association ?')) {
        if (typeof associationStorage !== 'undefined') {
            const success = associationStorage.deleteAssociation(id);
            if (success) {
                currentAssociationDatabase = associationStorage.getAllAssociations();
                filteredAssociationDatabase = [...currentAssociationDatabase];
                renderAssociationTable();
                populateAssociationFilterOptions();
                updateAssociationCounter();
                showNotification && showNotification('Association supprimée avec succès !', 'success');
            } else {
                showNotification && showNotification('Erreur lors de la suppression.', 'error');
            }
        }
    }
}

// Fonction pour gérer la soumission du formulaire Association
function handleAssociationFormSubmit(e) {
    if (!requireAdminOrSuperAdmin()) { e.preventDefault(); return; }
    e.preventDefault();
    
    const formData = {
        id: document.getElementById('association-id').value,
        nom: document.getElementById('association-nom').value,
        commune: document.getElementById('association-commune').value,
        adresse: document.getElementById('association-adresse').value,
        telephone: document.getElementById('association-telephone').value,
        president: document.getElementById('association-president').value,
        nombre: document.getElementById('association-nombre').value,
        type: document.getElementById('association-type').value,
        secteur: document.getElementById('association-secteur').value,
        email: document.getElementById('association-email').value,
        dateCreation: document.getElementById('association-dateCreation').value,
        statut: document.getElementById('association-statut').value
    };
    
    if (formData.id) {
        if (typeof associationStorage !== 'undefined') {
            const updated = associationStorage.updateAssociation(parseInt(formData.id), formData);
            if (!updated) {
                showNotification && showNotification('Erreur de mise à jour', 'error');
                return;
            }
        }
    } else {
        if (typeof associationStorage !== 'undefined') {
            const created = associationStorage.addAssociation(formData);
            if (!created) {
                showNotification && showNotification('Erreur lors de l\'ajout', 'error');
                return;
            }
        }
    }
    
    currentAssociationDatabase = associationStorage.getAllAssociations();
    filteredAssociationDatabase = [...currentAssociationDatabase];
    renderAssociationTable();
    populateAssociationFilterOptions();
    updateAssociationCounter();
    hideAssociationForm();
}

// Fonction d'export JSON pour Associations
function exportAssociationDatabase() {
    const exportTextarea = document.getElementById('association-export');
    if (exportTextarea) {
        exportTextarea.value = JSON.stringify(currentAssociationDatabase, null, 2);
        exportTextarea.style.display = 'block';
        exportTextarea.select();
        document.execCommand('copy');
        alert('Base de données Associations copiée dans le presse-papiers !');
    }
}

// Fonction d'export PDF pour Associations
function exportAssociationToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Base de données Associations - Keur Massar', 20, 20);
    
    const headers = [['ID', 'Nom', 'Commune', 'Téléphone', 'Président', 'Membres', 'Type', 'Secteur', 'Email', 'Date Création', 'Statut']];
    const data = currentAssociationDatabase.map(association => [
        association.id || '',
        association.nom || '',
        association.commune || '',
        association.telephone || '',
        association.president || '',
        association.nombre || '',
        association.type || '',
        association.secteur || '',
        association.email || '',
        association.dateCreation || '',
        association.statut || ''
    ]);
    
    doc.autoTable({
        head: headers,
        body: data,
        startY: 30,
        styles: {
            fontSize: 7,
            cellPadding: 1
        },
        headStyles: {
            fillColor: [78, 115, 223],
            textColor: 255
        }
    });
    
    doc.save('base_donnees_associations_keur_massar.pdf');
}

// Fonction d'impression pour Associations
function printAllAssociations() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Base de données Associations - Keur Massar</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #4e73df; color: white; }
                h1 { color: #4e73df; }
                @media print {
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>Base de données Associations - Keur Massar</h1>
            <p>Total: ${currentAssociationDatabase.length} Associations</p>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Commune</th>
                        <th>Adresse</th>
                        <th>Téléphone</th>
                        <th>Président</th>
                        <th>Membres</th>
                        <th>Type</th>
                        <th>Secteur</th>
                        <th>Email</th>
                        <th>Date Création</th>
                        <th>Statut</th>
                    </tr>
                </thead>
                <tbody>
                    ${currentAssociationDatabase.map(association => `
                        <tr>
                            <td>${association.id || ''}</td>
                            <td>${association.nom || ''}</td>
                            <td>${association.commune || ''}</td>
                            <td>${association.adresse || ''}</td>
                            <td>${association.telephone || ''}</td>
                            <td>${association.president || ''}</td>
                            <td>${association.nombre || ''}</td>
                            <td>${association.type || ''}</td>
                            <td>${association.secteur || ''}</td>
                            <td>${association.email || ''}</td>
                            <td>${association.dateCreation || ''}</td>
                            <td>${association.statut || ''}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="no-print">
                <button onclick="window.print()">Imprimer</button>
                <button onclick="window.close()">Fermer</button>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// Fonction de réinitialisation des filtres Associations
function resetAssociationFilters() {
    const searchInput = document.getElementById('association-search');
    const communeFilter = document.getElementById('association-commune-filter');
    const typeFilter = document.getElementById('association-type-filter');
    const secteurFilter = document.getElementById('association-secteur-filter');
    const statutFilter = document.getElementById('association-statut-filter');

    if (searchInput) searchInput.value = '';
    if (communeFilter) communeFilter.value = '';
    if (typeFilter) typeFilter.value = '';
    if (secteurFilter) secteurFilter.value = '';
    if (statutFilter) statutFilter.value = '';

    filteredAssociationDatabase = [...currentAssociationDatabase];
    renderAssociationTable();
}

// Fonction de synchronisation des Associations depuis la base statique
function syncAssociationDatabase() {
    if (!requireAdminOrSuperAdmin()) return;
    if (typeof associationDatabase !== 'undefined') {
        currentAssociationDatabase = [...associationDatabase];
        filteredAssociationDatabase = [...associationDatabase];
        // Persister dans le stockage local
        if (typeof associationStorage !== 'undefined') {
            try {
                associationStorage.saveAssociations(currentAssociationDatabase);
            } catch (e) {
                console.error('Erreur de sauvegarde des associations:', e);
            }
        }
        renderAssociationTable();
        populateAssociationFilterOptions();
        updateAssociationCounter();
        alert('Base de données Associations synchronisée et sauvegardée !');
    } else {
        alert('Base de données Associations indisponible (associationDatabase non chargé).');
    }
}

// Fonction de debug Associations
function debugAssociationDatabase() {
    console.log('=== DEBUG ASSOCIATIONS DATABASE ===');
    console.log('Base de données originale:', (typeof associationDatabase !== 'undefined' ? associationDatabase : '(associationDatabase non chargé)'));
    console.log('Base de données actuelle:', currentAssociationDatabase);
    console.log('Base de données filtrée:', filteredAssociationDatabase);
    console.log('Nombre total:', currentAssociationDatabase.length);
    console.log('Nombre filtré:', filteredAssociationDatabase.length);
}

// Fonction pour fusionner la base statique avec la base locale
function mergeAssociationDatabase() {
    if (!requireAdminOrSuperAdmin()) return;
    if (typeof associationDatabase === 'undefined') {
        alert('Base statique Associations indisponible (associationDatabase non chargé).');
        return;
    }
    const strategySelect = document.getElementById('association-merge-strategy');
    const strategy = strategySelect ? strategySelect.value : 'keepLocal';

    const localById = new Map(currentAssociationDatabase.map(a => [a.id, a]));
    const staticById = new Map(associationDatabase.map(a => [a.id, a]));

    let added = 0;
    let replaced = 0;

    for (const [id, staticA] of staticById.entries()) {
        const localA = localById.get(id);
        if (!localA) {
            localById.set(id, staticA);
            added++;
        } else if (strategy === 'preferStatic') {
            localById.set(id, staticA);
            replaced++;
        }
    }

    const merged = Array.from(localById.values());
    currentAssociationDatabase = merged;
    filteredAssociationDatabase = [...merged];

    if (typeof associationStorage !== 'undefined') {
        try {
            associationStorage.saveAssociations(merged);
        } catch (e) {
            console.error('Erreur de sauvegarde Associations lors de la fusion:', e);
        }
    }

    renderAssociationTable();
    populateAssociationFilterOptions();
    updateAssociationCounter();
    alert(`Fusion Associations terminée: ${merged.length} éléments au total (ajoutés: ${added}, remplacés: ${replaced}).`);
}

// ==================== GESTION DES MEMBRES (SITE) ====================
function renderMembersTable(filter = 'approved') {
  const tbody = document.querySelector('#members-table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  // Récupérer les membres du siteUserStorage
  let siteMembers = [];
  if (typeof siteUserStorage !== 'undefined') {
    siteMembers = (filter === 'pending') ? siteUserStorage.getByStatus('pending') : siteUserStorage.getByStatus('approved');
  }
  
  // Récupérer les demandes d'enregistrement du formulaire principal
  let registrationRequests = [];
  try {
    const requestsData = localStorage.getItem('registrationRequests');
    if (requestsData) {
      registrationRequests = JSON.parse(requestsData);
      // Filtrer selon le statut
      registrationRequests = registrationRequests.filter(req => {
        if (filter === 'pending') return req.status === 'pending';
        return req.status === 'approved';
      });
    }
  } catch (e) {
    console.error('Erreur lecture demandes d\'enregistrement:', e);
  }
  
  // Combiner les deux listes
  const allMembers = [...siteMembers, ...registrationRequests];
  
  if (!allMembers.length) { 
    const tr = document.createElement('tr'); 
    tr.innerHTML = `<td colspan="7" style="padding:12px;">Aucun membre ${filter === 'pending' ? 'en attente' : 'approuvé'}</td>`; 
    tbody.appendChild(tr); 
    return; 
  }
  
  allMembers.forEach(u => {
    const tr = document.createElement('tr');
    
    // Déterminer le nom de l'entité
    let entityName = '';
    if (u.entityData && u.entityData.nom) {
      // Demande d'enregistrement du formulaire principal
      entityName = u.entityData.nom;
    } else if (u.type === 'GIE' && typeof gieDatabase !== 'undefined') {
      entityName = gieDatabase.find(g => g.id === u.entityId)?.nom || '';
    } else if (u.type === 'ASSO' && typeof associationDatabase !== 'undefined') {
      entityName = associationDatabase.find(a => a.id === u.entityId)?.nom || '';
    }
    
    // Déterminer le nom de l'utilisateur
    const userName = u.name || u.nom || 'N/A';
    const userEmail = u.email || 'N/A';
    const userType = u.type || 'N/A';
    const userStatus = u.status || 'pending';
    
    tr.innerHTML = `
      <td>${u.id}</td>
      <td>${userName}</td>
      <td>${userEmail}</td>
      <td>${userType}</td>
      <td>${entityName || u.entityId || ''}</td>
      <td>${userStatus}</td>
      <td>
        ${userStatus === 'pending' ? `
          <button class="gie-action-btn" onclick="approveMember(${u.id})" title="Approuver"><i class="fas fa-check"></i></button>
          <button class="gie-action-btn" style="background:#e67e22;" onclick="rejectMember(${u.id})" title="Refuser"><i class="fas fa-ban"></i></button>
        ` : ''}
        <button class="gie-action-btn" style="background:#e74c3c;" onclick="deleteMember(${u.id})" title="Supprimer"><i class="fas fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
function showToast(message, type='success'){
  const c=document.getElementById('toast-container'); if(!c) return;
  const t=document.createElement('div'); t.className='toast'+(type==='error'?' error': type==='warn'?' warn':'');
  t.innerHTML=`<i class="fas ${type==='error'?'fa-times-circle': type==='warn'?'fa-exclamation-circle':'fa-check-circle'}"></i> <span>${message}</span> <button class="close" title="Fermer">×</button>`;
  c.appendChild(t);
  const closeBtn = t.querySelector('.close');
  const duration = type==='error' ? 4000 : type==='warn' ? 3000 : 2500;
  let timer = setTimeout(()=>{ t.remove(); }, duration);
  t.addEventListener('mouseenter', ()=>{ clearTimeout(timer); });
  t.addEventListener('mouseleave', ()=>{ timer = setTimeout(()=>{ t.remove(); }, 1200); });
  if (closeBtn) closeBtn.addEventListener('click', ()=>{ t.remove(); });
}
function flashRowById(id){ const tbody=document.querySelector('#members-table tbody'); if(!tbody) return; const rows=[...tbody.querySelectorAll('tr')]; const r=rows.find(tr=>tr.firstElementChild && tr.firstElementChild.textContent==String(id)); if(r){ r.classList.add('flash-highlight'); setTimeout(()=>r.classList.remove('flash-highlight'), 1200);} }
function approveMember(id){ 
  // Gérer les membres du siteUserStorage
  if (typeof siteUserStorage !== 'undefined') {
    const user = siteUserStorage.getAll().find(u => u.id === id);
    if (user) {
      siteUserStorage.approveUser(id);
      renderMembersTable(currentMembersFilter);
      flashRowById(id);
      showToast('Membre approuvé');
      return;
    }
  }
  
  // Gérer les demandes d'enregistrement du formulaire principal
  try {
    const requestsData = localStorage.getItem('registrationRequests');
    if (requestsData) {
      let requests = JSON.parse(requestsData);
      const requestIndex = requests.findIndex(req => req.id === id);
      if (requestIndex !== -1) {
        const request = requests[requestIndex];
        requests[requestIndex].status = 'approved';
        requests[requestIndex].approvedAt = new Date().toISOString();
        localStorage.setItem('registrationRequests', JSON.stringify(requests));
        
        // Ajouter automatiquement à la base de données correspondante
        addToDatabase(request);
        
        renderMembersTable(currentMembersFilter);
        flashRowById(id);
        showToast('Demande d\'enregistrement approuvée et ajoutée à la base de données');
        return;
      }
    }
  } catch (e) {
    console.error('Erreur lors de l\'approbation:', e);
  }
  
  showToast('Erreur: Membre non trouvé', 'error');
}

// Fonction pour ajouter automatiquement à la base de données correspondante
function addToDatabase(request) {
  try {
    const entityData = request.entityData;
    if (!entityData) {
      console.error('Données d\'entité manquantes');
      return;
    }
    
    // Générer un nouvel ID pour la base de données
    const newId = generateNewEntityId(entityData.type);
    
    if (entityData.type === 'gie' && typeof gieStorage !== 'undefined') {
      // Ajouter à la base de données G.I.E
      const newGie = {
        id: newId,
        nom: entityData.nom,
        president: entityData.president,
        telephone: entityData.telephone,
        email: entityData.email || '',
        commune: entityData.commune,
        adresse: entityData.adresse || '',
        secteur: entityData.secteur,
        description: entityData.description || '',
        membres: entityData.membres || '',
        statut: 'Actif',
        dateCreation: entityData.dateCreation || new Date().toISOString(),
        dateApproval: new Date().toISOString()
      };
      
      gieStorage.addGIE(newGie);
      console.log('G.I.E ajoutée à la base de données:', newGie);
      
    } else if (entityData.type === 'association' && typeof associationStorage !== 'undefined') {
      // Ajouter à la base de données Association
      const newAssociation = {
        id: newId,
        nom: entityData.nom,
        president: entityData.president,
        telephone: entityData.telephone,
        email: entityData.email || '',
        commune: entityData.commune,
        adresse: entityData.adresse || '',
        secteur: entityData.secteur,
        description: entityData.description || '',
        membres: entityData.membres || '',
        statut: 'Actif',
        dateCreation: entityData.dateCreation || new Date().toISOString(),
        dateApproval: new Date().toISOString()
      };
      
      associationStorage.addAssociation(newAssociation);
      console.log('Association ajoutée à la base de données:', newAssociation);
      
    } else if (entityData.type === 'entreprise' || entityData.type === 'cooperative') {
      // Pour les entreprises et coopératives, on pourrait ajouter à une base de données spécifique
      console.log('Type d\'organisation non encore implémenté:', entityData.type);
    }
    
    // Rafraîchir les données du dashboard
    refreshAllDashboardData();
    
  } catch (e) {
    console.error('Erreur lors de l\'ajout à la base de données:', e);
  }
}

// Fonction pour générer un nouvel ID unique
function generateNewEntityId(type) {
  try {
    if (type === 'gie' && typeof gieStorage !== 'undefined') {
      const allGies = gieStorage.getAllGIE();
      const maxId = Math.max(...allGies.map(g => parseInt(g.id) || 0), 0);
      return (maxId + 1).toString();
    } else if (type === 'association' && typeof associationStorage !== 'undefined') {
      const allAssociations = associationStorage.getAllAssociations();
      const maxId = Math.max(...allAssociations.map(a => parseInt(a.id) || 0), 0);
      return (maxId + 1).toString();
    }
  } catch (e) {
    console.error('Erreur lors de la génération d\'ID:', e);
  }
  
  // Fallback: utiliser timestamp
  return Date.now().toString();
}

function rejectMember(id){ 
  // Gérer les membres du siteUserStorage
  if (typeof siteUserStorage !== 'undefined') {
    const user = siteUserStorage.getAll().find(u => u.id === id);
    if (user) {
      siteUserStorage.rejectUser(id);
      renderMembersTable(currentMembersFilter);
      flashRowById(id);
      showToast('Membre refusé', 'warn');
      return;
    }
  }
  
  // Gérer les demandes d'enregistrement du formulaire principal
  try {
    const requestsData = localStorage.getItem('registrationRequests');
    if (requestsData) {
      let requests = JSON.parse(requestsData);
      const requestIndex = requests.findIndex(req => req.id === id);
      if (requestIndex !== -1) {
        const request = requests[requestIndex];
        requests[requestIndex].status = 'rejected';
        localStorage.setItem('registrationRequests', JSON.stringify(requests));
        
        // Supprimer de la base de données si elle y avait été ajoutée
        removeFromDatabase(request);
        
        renderMembersTable(currentMembersFilter);
        flashRowById(id);
        showToast('Demande d\'enregistrement refusée et supprimée de la base de données', 'warn');
        return;
      }
    }
  } catch (e) {
    console.error('Erreur lors du rejet:', e);
  }
  
  showToast('Erreur: Membre non trouvé', 'error');
}

function deleteMember(id){ 
  if (!confirm('Supprimer ce membre ?')) return;
  
  // Gérer les membres du siteUserStorage
  if (typeof siteUserStorage !== 'undefined') {
    const user = siteUserStorage.getAll().find(u => u.id === id);
    if (user) {
      siteUserStorage.deleteUser(id);
      renderMembersTable(currentMembersFilter);
      showToast('Membre supprimé', 'error');
      return;
    }
  }
  
  // Gérer les demandes d'enregistrement du formulaire principal
  try {
    const requestsData = localStorage.getItem('registrationRequests');
    if (requestsData) {
      let requests = JSON.parse(requestsData);
      const requestIndex = requests.findIndex(req => req.id === id);
      if (requestIndex !== -1) {
        const request = requests[requestIndex];
        
        // Supprimer de la base de données si elle y avait été ajoutée
        removeFromDatabase(request);
        
        requests.splice(requestIndex, 1);
        localStorage.setItem('registrationRequests', JSON.stringify(requests));
        renderMembersTable(currentMembersFilter);
        showToast('Demande d\'enregistrement supprimée de la base de données', 'error');
        return;
      }
    }
  } catch (e) {
    console.error('Erreur lors de la suppression:', e);
  }
  
  showToast('Erreur: Membre non trouvé', 'error');
}

// Fonction pour supprimer de la base de données correspondante
function removeFromDatabase(request) {
  try {
    const entityData = request.entityData;
    if (!entityData) {
      console.error('Données d\'entité manquantes');
      return;
    }
    
    if (entityData.type === 'gie' && typeof gieStorage !== 'undefined') {
      // Chercher et supprimer de la base de données G.I.E
      const allGies = gieStorage.getAllGIE();
      const gieToRemove = allGies.find(g => 
        g.nom === entityData.nom && 
        g.president === entityData.president &&
        g.telephone === entityData.telephone
      );
      
      if (gieToRemove) {
        gieStorage.deleteGIE(gieToRemove.id);
        console.log('G.I.E supprimée de la base de données:', gieToRemove.nom);
      }
      
    } else if (entityData.type === 'association' && typeof associationStorage !== 'undefined') {
      // Chercher et supprimer de la base de données Association
      const allAssociations = associationStorage.getAllAssociations();
      const associationToRemove = allAssociations.find(a => 
        a.nom === entityData.nom && 
        a.president === entityData.president &&
        a.telephone === entityData.telephone
      );
      
      if (associationToRemove) {
        associationStorage.deleteAssociation(associationToRemove.id);
        console.log('Association supprimée de la base de données:', associationToRemove.nom);
      }
    }
    
    // Rafraîchir les données du dashboard
    refreshAllDashboardData();
    
  } catch (e) {
    console.error('Erreur lors de la suppression de la base de données:', e);
  }
}
let currentMembersFilter = 'approved';

// ==================== GESTION DES UTILISATEURS ====================

function renderUserTable() {
    const tbody = document.querySelector('#user-table tbody');
    if (!tbody) return;
    const users = (typeof userStorage !== 'undefined') ? userStorage.getAllUsers() : [];
    tbody.innerHTML = users.map(u => `
        <tr>
            <td>${u.nom}</td>
            <td>${u.email}</td>
            <td>${u.role}</td>
            <td>
                <button class="gie-action-btn" onclick="handleEditUser(${u.id})"><i class="fas fa-edit"></i></button>
                <button class="gie-action-btn" style="background:#e74c3c;" onclick="handleDeleteUser(${u.id})" ${(u.email === 'Mamadou@negus-agency.com' || u.email === 'admin@keurmassar.sn') ? 'disabled' : ''}><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function showUserForm(edit = false, user = null) {
    if (!requireSuperAdmin()) return;
    const form = document.getElementById('user-form');
    if (!form) return;
    form.style.display = 'block';
    if (edit && user) {
        document.getElementById('user-id').value = user.id;
        document.getElementById('user-nom').value = user.nom;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-role').value = user.role;
    } else {
        form.reset();
        document.getElementById('user-id').value = '';
    }
}

function hideUserForm() {
    const form = document.getElementById('user-form');
    if (form) form.style.display = 'none';
}

function handleEditUser(id) {
    if (typeof userStorage === 'undefined') return;
    const user = userStorage.getUserById(id);
    if (user) showUserForm(true, user);
}

function handleDeleteUser(id) {
    if (typeof userStorage === 'undefined') return;
    const user = userStorage.getUserById(id);
    if (user && (user.email === 'Mamadou@negus-agency.com' || user.email === 'admin@keurmassar.sn')) {
        alert('Admin Principal (Super Admin) ne peut pas être supprimé.');
        return;
    }
    if (confirm('Supprimer cet utilisateur ?')) {
        const ok = userStorage.deleteUser(id);
        if (ok) {
            renderUserTable();
        }
    }
}

function handleUserFormSubmit(e) {
    if (!requireSuperAdmin()) { e.preventDefault(); return; }
    e.preventDefault();
    if (typeof userStorage === 'undefined') return;
    const id = document.getElementById('user-id').value;
    const nom = document.getElementById('user-nom').value;
    const email = document.getElementById('user-email').value;
    const role = document.getElementById('user-role').value;
    const password = document.getElementById('user-password').value;

    // Forcer Admin Principal en Super Admin
    let data = { nom, email, role };
    if (!id) {
        data.password = password;
    }
    if (email === 'Mamadou@negus-agency.com' || email === 'admin@keurmassar.sn') {
        data.role = 'Super Admin';
    }

    try {
        if (id) {
            userStorage.updateUser(parseInt(id), data);
        } else {
            userStorage.addUser(data);
        }
    } catch (e) {
        alert(e.message || 'Erreur utilisateur');
        return;
    }
    hideUserForm();
    e.target.reset();
    renderUserTable();
}

// Gestion de la navigation entre les sections
function showSection(sectionId) {
    // Masquer toutes les sections
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Afficher la section demandée
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Mettre à jour le menu actif
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const activeMenuItem = document.querySelector(`[href="#${sectionId}"]`).parentElement;
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
    
    console.log(`Section ${sectionId} affichée`);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard admin initialisé');
    // Appliquer l'utilisateur courant et les permissions
    applyRolePermissions(getCurrentAdminUser());
    console.log('Base de données G.I.E. chargée:', (typeof gieDatabase !== 'undefined' ? gieDatabase.length : 'Non définie'), 'éléments');
    console.log('Base de données Associations chargée:', associationDatabase ? associationDatabase.length : 'Non définie', 'éléments');
    
    // Gestion du menu profil
    const profileToggle = document.getElementById('profile-toggle');
    const profileDropdown = document.getElementById('profile-dropdown');
    const profileLogout = document.getElementById('profile-logout-link');
    const profileView = document.getElementById('profile-view-link');
    const profileModal = document.getElementById('profile-modal');
    const profileBackdrop = document.getElementById('profile-backdrop');
    const profileCloseBtn = document.getElementById('profile-close-btn');
    const profileCancelBtn = document.getElementById('profile-cancel-btn');
    const profileForm = document.getElementById('profile-form');
    if (profileToggle && profileDropdown) {
        profileToggle.addEventListener('click', function(){
            profileDropdown.style.display = profileDropdown.style.display === 'none' || profileDropdown.style.display === '' ? 'block' : 'none';
        });
        document.addEventListener('click', function(e){
            if (!profileDropdown.contains(e.target) && !profileToggle.contains(e.target)) {
                profileDropdown.style.display = 'none';
            }
        });
    }
    if (profileLogout) {
        profileLogout.addEventListener('click', function(e){
            e.preventDefault();
            try { sessionStorage.removeItem('currentAdminUser'); } catch {}
            window.location.href = 'index.html';
        });
    }

    if (profileView && profileModal) {
        const openProfile = () => {
            profileDropdown && (profileDropdown.style.display = 'none');
            // Prefill
            const user = getCurrentAdminUser();
            if (user) {
                document.getElementById('profile-id').value = user.id;
                document.getElementById('profile-name').value = user.nom || '';
                document.getElementById('profile-email').value = user.email || '';
                document.getElementById('profile-role').value = user.role || '';
                document.getElementById('profile-current').value = '';
                document.getElementById('profile-new').value = '';
                document.getElementById('profile-confirm').value = '';
                const preview = document.getElementById('profile-avatar-preview');
                if (preview) {
                    preview.innerHTML = '';
                    const users = (typeof userStorage !== 'undefined') ? userStorage.getAllUsers() : [];
                    const fullUser = users.find(u => u.id === user.id);
                    if (fullUser && fullUser.avatar) {
                        const img = document.createElement('img');
                        img.src = fullUser.avatar;
                        preview.appendChild(img);
                    } else {
                        preview.innerHTML = '<span>Aperçu</span>';
                    }
                }
            }
            profileModal.style.display = 'block';
        };
        const closeProfile = () => { profileModal.style.display = 'none'; };
        profileView.addEventListener('click', function(e){ e.preventDefault(); openProfile(); });
        if (profileBackdrop) profileBackdrop.addEventListener('click', closeProfile);
        if (profileCloseBtn) profileCloseBtn.addEventListener('click', closeProfile);
        if (profileCancelBtn) profileCancelBtn.addEventListener('click', closeProfile);

        if (profileForm) {
            // Live preview on file select
            const fileInput = document.getElementById('profile-avatar');
            if (fileInput) {
                fileInput.addEventListener('change', function(){
                    const file = this.files && this.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = function(e){
                        const preview = document.getElementById('profile-avatar-preview');
                        if (preview) {
                            preview.innerHTML = '';
                            const img = document.createElement('img');
                            img.src = e.target.result;
                            preview.appendChild(img);
                        }
                    };
                    reader.readAsDataURL(file);
                });
            }

            profileForm.addEventListener('submit', function(e){
                e.preventDefault();
                if (typeof userStorage === 'undefined') return;
                const id = parseInt(document.getElementById('profile-id').value);
                const name = document.getElementById('profile-name').value.trim();
                const email = document.getElementById('profile-email').value.trim();
                const role = document.getElementById('profile-role').value.trim();
                const current = document.getElementById('profile-current').value;
                const pwd = document.getElementById('profile-new').value;
                const confirm = document.getElementById('profile-confirm').value;

                // Update basic info (name)
                let payload = { nom: name };

                // Handle password change if requested
                if (pwd || confirm) {
                    if (pwd.length < 4) { alert('Mot de passe trop court (min. 4).'); return; }
                    if (pwd !== confirm) { alert('La confirmation ne correspond pas.'); return; }
                    // Validate current password
                    const users = userStorage.getAllUsers();
                    const fullUser = users.find(u => u.id === id);
                    if (!fullUser || fullUser.password !== current) { alert('Mot de passe actuel incorrect.'); return; }
                    payload.password = pwd;
                }

                // Save avatar if selected
                const fileEl = document.getElementById('profile-avatar');
                const selectedFile = fileEl && fileEl.files && fileEl.files[0];
                if (selectedFile) {
                    const reader = new FileReader();
                    reader.onload = function(e){
                        userStorage.updateUserAvatar(id, e.target.result);
                        finalizeProfileUpdate();
                    };
                    reader.readAsDataURL(selectedFile);
                } else {
                    finalizeProfileUpdate();
                }

                function finalizeProfileUpdate(){
                    const updated = userStorage.updateUser(id, payload);
                    if (updated) {
                        try { sessionStorage.setItem('currentAdminUser', JSON.stringify({ id: updated.id, nom: updated.nom, email: updated.email, role: updated.role })); } catch {}
                        applyRolePermissions(updated);
                        // Update header avatar if exists
                        const users2 = userStorage.getAllUsers();
                        const fullUpdated = users2.find(u => u.id === id);
                        const avatarEl = document.getElementById('admin-avatar');
                        if (avatarEl) {
                            if (fullUpdated && fullUpdated.avatar) {
                                avatarEl.innerHTML = '';
                                const img = document.createElement('img');
                                img.src = fullUpdated.avatar;
                                avatarEl.appendChild(img);
                            } else {
                                avatarEl.textContent = (updated.nom || 'AD').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();
                            }
                        }
                        renderUserTable && renderUserTable();
                        alert('Profil mis à jour.');
                        profileModal.style.display = 'none';
                    } else {
                        alert('Erreur lors de la mise à jour.');
                    }
                }
            });
        }
    }

    // Gestion de la navigation
    const menuLinks = document.querySelectorAll('.sidebar-menu a[href^="#"]');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });
    
    // Tab members
    const tabPending = document.getElementById('members-tab-pending');
    const tabApproved = document.getElementById('members-tab-approved');
    const refreshBtn = document.getElementById('members-refresh');
    if (tabPending) tabPending.addEventListener('click', ()=>{ currentMembersFilter = 'pending'; renderMembersTable('pending'); });
    if (tabApproved) tabApproved.addEventListener('click', ()=>{ currentMembersFilter = 'approved'; renderMembersTable('approved'); });
    if (refreshBtn) refreshBtn.addEventListener('click', ()=> renderMembersTable(currentMembersFilter));

    // Afficher la section statistiques par défaut
    showSection('stats');
    
    // Initialiser le système de stockage G.I.E
    initializeGieDatabase();

    // Initialiser les utilisateurs (Super Admin pour Admin Principal)
    if (typeof userStorage !== 'undefined') {
        const users = userStorage.getAllUsers();
        // Normaliser le rôle de l'Admin Principal si besoin
        const admin = users.find(u => u.email === 'Mamadou@negus-agency.com');
        if (admin && admin.role !== 'Super Admin') {
            userStorage.updateUser(admin.id, { role: 'Super Admin' });
        }
        renderUserTable();
    }

    // Initialiser la base Associations depuis le stockage local si disponible, sinon fallback base statique
    if (typeof associationStorage !== 'undefined') {
        currentAssociationDatabase = associationStorage.getAllAssociations();
        filteredAssociationDatabase = [...currentAssociationDatabase];
    } else if (typeof associationDatabase !== 'undefined') {
        currentAssociationDatabase = [...associationDatabase];
        filteredAssociationDatabase = [...associationDatabase];
    }
    
    // Initialiser le tableau des G.I.E. avec un délai pour s'assurer que tout est chargé
    setTimeout(() => {
        console.log('Initialisation du tableau G.I.E...');
        renderGieTable();
        populateGieFilterOptions();
        console.log('Tableau G.I.E. initialisé avec', currentGieDatabase.length, 'éléments');
    }, 100);

    // Initialiser le tableau des Associations avec un délai pour s'assurer que tout est chargé
    setTimeout(() => {
        console.log('Initialisation du tableau Associations...');
        renderAssociationTable();
        populateAssociationFilterOptions();
        console.log('Tableau Associations initialisé avec', currentAssociationDatabase.length, 'éléments');
    }, 100);
    
    // Initial render of members when section exists
    if (document.getElementById('members')) {
      renderMembersTable('approved');
    }
    
    // Événements pour les filtres G.I.E.
    const searchInputGie = document.getElementById('gie-search');
    const communeFilterGie = document.getElementById('gie-commune-filter');
    const typeFilterGie = document.getElementById('gie-type-filter');
    const secteurFilterGie = document.getElementById('gie-secteur-filter');
    
    if (searchInputGie) searchInputGie.addEventListener('input', filterGieDatabase);
    if (communeFilterGie) communeFilterGie.addEventListener('change', filterGieDatabase);
    if (typeFilterGie) typeFilterGie.addEventListener('change', filterGieDatabase);
    if (secteurFilterGie) secteurFilterGie.addEventListener('change', filterGieDatabase);
    
    // Événements pour le formulaire G.I.E.
    const addBtnGie = document.getElementById('add-gie-btn');
    const cancelBtnGie = document.getElementById('gie-cancel-btn');
    const formGie = document.getElementById('gie-form');
    const exportBtnGie = document.getElementById('export-gie-btn');
    const exportPdfBtnGie = document.getElementById('export-pdf-btn');
    const printAllBtnGie = document.getElementById('print-all-btn');
    
    if (addBtnGie) addBtnGie.addEventListener('click', () => showGieForm(false));
    if (cancelBtnGie) cancelBtnGie.addEventListener('click', hideGieForm);
    if (formGie) formGie.addEventListener('submit', handleGieFormSubmit);
    if (exportBtnGie) exportBtnGie.addEventListener('click', exportGieDatabase);
    if (exportPdfBtnGie) exportPdfBtnGie.addEventListener('click', exportGieToPDF);
    if (printAllBtnGie) printAllBtnGie.addEventListener('click', printAllGIE);
    
    // Événements pour les filtres Associations
    const searchInputAssociation = document.getElementById('association-search');
    const communeFilterAssociation = document.getElementById('association-commune-filter');
    const typeFilterAssociation = document.getElementById('association-type-filter');
    const secteurFilterAssociation = document.getElementById('association-secteur-filter');
    const statutFilterAssociation = document.getElementById('association-statut-filter');

    if (searchInputAssociation) searchInputAssociation.addEventListener('input', filterAssociationDatabase);
    if (communeFilterAssociation) communeFilterAssociation.addEventListener('change', filterAssociationDatabase);
    if (typeFilterAssociation) typeFilterAssociation.addEventListener('change', filterAssociationDatabase);
    if (secteurFilterAssociation) secteurFilterAssociation.addEventListener('change', filterAssociationDatabase);
    if (statutFilterAssociation) statutFilterAssociation.addEventListener('change', filterAssociationDatabase);
    
    // Événements pour le formulaire Associations
    const addBtnAssociation = document.getElementById('add-association-btn');
    const cancelBtnAssociation = document.getElementById('association-cancel-btn');
    const formAssociation = document.getElementById('association-form');
    const exportBtnAssociation = document.getElementById('export-association-btn');
    const exportPdfBtnAssociation = document.getElementById('export-association-pdf-btn');
    const printAllBtnAssociation = document.getElementById('print-all-associations-btn');
    
    if (addBtnAssociation) addBtnAssociation.addEventListener('click', () => showAssociationForm(false));
    if (cancelBtnAssociation) cancelBtnAssociation.addEventListener('click', hideAssociationForm);
    if (formAssociation) formAssociation.addEventListener('submit', handleAssociationFormSubmit);
    if (exportBtnAssociation) exportBtnAssociation.addEventListener('click', exportAssociationDatabase);
    if (exportPdfBtnAssociation) exportPdfBtnAssociation.addEventListener('click', exportAssociationToPDF);
    if (printAllBtnAssociation) printAllBtnAssociation.addEventListener('click', printAllAssociations);
    
    // Événements pour les utilisateurs
    const addBtnUser = document.getElementById('user-add-btn');
    const cancelBtnUser = document.getElementById('user-cancel-btn');
    const formUser = document.getElementById('user-form');
    const exportBtnUser = document.getElementById('export-users-btn');
    const exportPdfBtnUser = document.getElementById('export-users-pdf-btn');
    const printAllBtnUser = document.getElementById('print-all-users-btn');

    if (addBtnUser) addBtnUser.addEventListener('click', () => showUserForm(false));
    if (cancelBtnUser) cancelBtnUser.addEventListener('click', hideUserForm);
    if (formUser) formUser.addEventListener('submit', handleUserFormSubmit);
    if (exportBtnUser) exportBtnUser.addEventListener('click', exportAssociationDatabase);
    if (exportPdfBtnUser) exportPdfBtnUser.addEventListener('click', exportAssociationToPDF);
    if (printAllBtnUser) printAllBtnUser.addEventListener('click', printAllAssociations)

    // Ajouter des raccourcis clavier
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K pour ouvrir la recherche
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('gie-search');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Échap pour fermer le formulaire
        if (e.key === 'Escape') {
            hideGieForm();
            hideAssociationForm(); // Masquer le formulaire des associations aussi
            hideUserForm(); // Masquer le formulaire des utilisateurs aussi
        }
    });
}); 