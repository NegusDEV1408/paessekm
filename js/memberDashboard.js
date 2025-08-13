(function(){
  function getCurrentSiteUser(){
    try { const raw = sessionStorage.getItem('currentSiteUser'); return raw ? JSON.parse(raw) : null; } catch { return null; }
  }
  function applyTheme(){
    try { const t = localStorage.getItem('memberTheme'); if (t === 'dark') document.body.classList.add('member-dark'); else document.body.classList.remove('member-dark'); } catch {}
  }
  function setAvatar(user){
    const avatarEl = document.getElementById('member-avatar');
    if (!avatarEl) return;
    avatarEl.innerHTML = '';
    try {
      const listRaw = localStorage.getItem('siteUsers');
      const list = listRaw ? JSON.parse(listRaw) : [];
      const full = list.find(u => u.id === user.id);
      if (full && full.avatar) { const img = document.createElement('img'); img.src = full.avatar; avatarEl.appendChild(img); return; }
    } catch {}
    const initials = (user && (user.name || '')).split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase() || 'ME';
    avatarEl.textContent = initials;
  }
  function render(){
    applyTheme();
    const user = getCurrentSiteUser();
    const nameEl = document.getElementById('member-name');
    const typeEl = document.getElementById('member-type');
    const card = document.getElementById('member-entity-card');
    const logoutBtn = document.getElementById('member-logout');
    const editBtn = document.getElementById('member-edit');
    const welcome = document.getElementById('member-welcome');
    const themeToggle = document.getElementById('theme-toggle');
    const actionEdit = document.getElementById('action-edit-profile');
    const actionAvatar = document.getElementById('action-change-avatar');

    if (themeToggle){
      themeToggle.addEventListener('click', function(){
        const isDark = document.body.classList.toggle('member-dark');
        try { localStorage.setItem('memberTheme', isDark ? 'dark' : 'light'); } catch {}
      });
    }

    if (!user){
      if (nameEl) nameEl.textContent = 'Invité';
      if (typeEl) typeEl.textContent = 'Non connecté';
      if (welcome) welcome.textContent = 'Veuillez vous connecter via Espace membre';
      if (card) card.innerHTML = '<p>Veuillez vous connecter via l\'Espace membre.</p>';
      if (logoutBtn) logoutBtn.style.display = 'none';
      if (editBtn) editBtn.style.display = 'none';
      return;
    }

    if (nameEl) nameEl.textContent = user.name || 'Membre';
    if (welcome) welcome.textContent = `Bienvenue, ${user.name || 'Membre'}`;
    if (typeEl) typeEl.textContent = user.type === 'GIE' ? 'G.I.E' : 'Association';
    setAvatar(user);

    let entity = null;
    if (user.type === 'GIE' && typeof gieDatabase !== 'undefined') {
      entity = gieDatabase.find(g => g.id === user.entityId);
    } else if (user.type === 'ASSO' && typeof associationDatabase !== 'undefined') {
      entity = associationDatabase.find(a => a.id === user.entityId);
    }

    // Summary cards
    const setText = (id, text) => { const el = document.getElementById(id); if (el) el.innerHTML = `<strong>${el.querySelector('strong')?.textContent || ''}</strong><br><span class="muted">${text || '—'}</span>`; };
    if (entity) {
      const entityName = entity.nom || user.name;
      setText('summary-entity', entityName);
      setText('summary-type', entity.type);
      setText('summary-commune', entity.commune);
      setText('summary-secteur', entity.secteur);
    }

    // Render details
    if (!entity){
      if (card) card.innerHTML = '<p>Entité introuvable. Contactez l\'administration.</p>';
      return;
    }

    if (card){
      const statut = (entity.statut || '').toLowerCase();
      const statusClass = statut.includes('actif') ? 'status-actif' : 'status-en';
      const hasPhone = !!(entity.telephone && String(entity.telephone).trim());
      card.innerHTML = `
        <div class="member-grid">
          <div class="member-card"><strong>Nom</strong><br/><span class="value">${entity.nom || ''}</span></div>
          <div class="member-card"><strong>Type</strong><br/>
            <span class="badge badge-type"><i class="fas fa-tag"></i> ${entity.type || ''}</span>
          </div>
          <div class="member-card"><strong>Commune</strong><br/>
            <span class="badge badge-commune"><i class="fas fa-map-marker-alt"></i> ${entity.commune || ''}</span>
          </div>
          <div class="member-card"><strong>Adresse</strong><br/><span class="value">${entity.adresse || ''}</span></div>
          <div class="member-card"><strong>Téléphone</strong><br/>
            ${hasPhone ? `<span class=\"badge badge-verified\"><i class=\"fas fa-check\"></i> Vérifié</span> <span class=\"value\">${entity.telephone}</span>` : `<span class=\"value\">—</span>`}
          </div>
          <div class="member-card"><strong>Président(e)</strong><br/><span class="value">${entity.president || ''}</span></div>
          <div class="member-card"><strong>Membres</strong><br/><span class="value">${entity.nombre || ''}</span></div>
          <div class="member-card"><strong>Secteur</strong><br/>
            <span class="badge badge-secteur"><i class="fas fa-briefcase"></i> ${entity.secteur || ''}</span>
          </div>
          <div class="member-card"><strong>Date création</strong><br/><span class="value">${entity.dateCreation || ''}</span></div>
          <div class="member-card"><strong>Statut</strong><br/>
            <span class="badge badge-status ${statusClass}"><i class="fas fa-circle"></i> ${entity.statut || ''}</span>
          </div>
        </div>
      `;
    }

    if (logoutBtn){
      logoutBtn.addEventListener('click', function(){
        try { sessionStorage.removeItem('currentSiteUser'); } catch {}
        window.location.href = 'user-login.html';
      });
    }

    if (editBtn){
      const modal = document.getElementById('site-profile-modal');
      const backdrop = document.getElementById('site-profile-backdrop');
      const closeBtn = document.getElementById('site-profile-close');
      const cancelBtn = document.getElementById('site-profile-cancel');
      const form = document.getElementById('site-profile-form');
      const open = ()=>{ // prefill
        document.getElementById('site-profile-id').value = user.id;
        document.getElementById('site-profile-name').value = user.name || '';
        document.getElementById('site-profile-email').value = user.email || '';
        document.getElementById('site-profile-current').value = '';
        document.getElementById('site-profile-new').value = '';
        document.getElementById('site-profile-confirm').value = '';
        const prev = document.getElementById('site-profile-avatar-preview');
        if (prev) {
          prev.textContent = 'Aperçu';
          try {
            const raw = localStorage.getItem('siteUsers');
            const list = raw ? JSON.parse(raw) : [];
            const full = list.find(u => u.id === user.id);
            if (full && full.avatar) {
              prev.innerHTML = '';
              const img = document.createElement('img'); img.src = full.avatar; img.style.width='100%'; img.style.height='100%'; img.style.objectFit='cover'; prev.appendChild(img);
            }
          } catch {}
        }
        modal.style.display = 'block';
      };
      const close = ()=>{ modal.style.display = 'none'; };
      editBtn.addEventListener('click', open);
      if (actionEdit) actionEdit.addEventListener('click', open);
      if (actionAvatar) actionAvatar.addEventListener('click', ()=>{ open(); setTimeout(()=>{ const f=document.getElementById('site-profile-avatar'); f && f.focus(); }, 50); });
      if (backdrop) backdrop.addEventListener('click', close);
      if (closeBtn) closeBtn.addEventListener('click', close);
      if (cancelBtn) cancelBtn.addEventListener('click', close);

      form.addEventListener('submit', function(e){
        e.preventDefault();
        const id = parseInt(document.getElementById('site-profile-id').value);
        const name = document.getElementById('site-profile-name').value.trim();
        const current = document.getElementById('site-profile-current').value;
        const pwd = document.getElementById('site-profile-new').value;
        const confirm = document.getElementById('site-profile-confirm').value;

        // Validate + update via siteUserStorage
        try {
          const raw = localStorage.getItem('siteUsers');
          const list = raw ? JSON.parse(raw) : [];
          const idx = list.findIndex(u => u.id === id);
          if (idx === -1) throw new Error('Utilisateur introuvable');
          if (pwd || confirm) {
            if (pwd.length < 4) throw new Error('Mot de passe trop court (min. 4)');
            if (pwd !== confirm) throw new Error('La confirmation ne correspond pas');
            if (list[idx].password !== current) throw new Error('Mot de passe actuel incorrect');
            list[idx].password = pwd;
          }
          list[idx].name = name;

          // Save avatar if selected
          const fileEl = document.getElementById('site-profile-avatar');
          const file = fileEl && fileEl.files && fileEl.files[0];
          if (file) {
            // convert to dataURL sync via FileReader in submit is tricky; do simple async then finalize
            const reader = new FileReader();
            reader.onload = function(ev){
              list[idx].avatar = ev.target.result;
              localStorage.setItem('siteUsers', JSON.stringify(list));
              sessionStorage.setItem('currentSiteUser', JSON.stringify({ ...user, name }));
              alert('Profil mis à jour.');
              close();
              location.reload();
            };
            reader.readAsDataURL(file);
            return; // stop; will continue in onload
          }

          localStorage.setItem('siteUsers', JSON.stringify(list));
          sessionStorage.setItem('currentSiteUser', JSON.stringify({ ...user, name }));
          alert('Profil mis à jour.');
          close();
          location.reload();
        } catch(err) {
          alert(err.message || 'Erreur lors de la mise à jour');
        }
      });

      // Live preview when selecting avatar
      const fileInput = document.getElementById('site-profile-avatar');
      if (fileInput) {
        fileInput.addEventListener('change', function(){
          const file = this.files && this.files[0]; if (!file) return;
          const reader = new FileReader();
          reader.onload = function(ev){
            const prev = document.getElementById('site-profile-avatar-preview');
            if (prev) { prev.innerHTML=''; const img=document.createElement('img'); img.src=ev.target.result; img.style.width='100%'; img.style.height='100%'; img.style.objectFit='cover'; prev.appendChild(img); }
          };
          reader.readAsDataURL(file);
        });
      }
    }
  }

  document.addEventListener('DOMContentLoaded', render);
})(); 