(function(){
  function getSiteUser(){
    try { 
      // Utiliser uniquement localStorage pour la persistance
      const raw = localStorage.getItem('currentSiteUser'); 
      return raw ? JSON.parse(raw) : null; 
    } catch { 
      return null; 
    }
  }

  function setSiteUser(user){
    try {
      if (user) {
        localStorage.setItem('currentSiteUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('currentSiteUser');
      }
    } catch (e) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', e);
    }
  }

  function applySiteTheme(){
    try {
      const t = localStorage.getItem('memberTheme');
      const user = getSiteUser();
      if (user && t === 'dark') document.body.classList.add('site-dark');
      else document.body.classList.remove('site-dark');
    } catch {}
  }

  function buildLink(href, icon, text){
    const a = document.createElement('a');
    a.href = href;
    a.className = 'login-btn';
    a.title = text;
    const i = document.createElement('i');
    i.className = icon;
    const span = document.createElement('span');
    span.textContent = text;
    a.appendChild(i); a.appendChild(span);
    return a;
  }

  function apply(){
    applySiteTheme();
    const isSub = location.pathname.indexOf('/pages/') !== -1;
    const prefix = isSub ? '../' : '';
    const navButtons = document.querySelector('.nav-buttons');
    const user = getSiteUser();
    
    if (!navButtons) return;

    // Remove duplicates by data marker
    const existingAdded = navButtons.querySelector('[data-siteauth-ui]');
    if (existingAdded) existingAdded.remove();

    // Clean previous injected logout
    const existingLogout = navButtons.querySelector('[data-siteauth-logout]');
    if (existingLogout) existingLogout.remove();

    if (user) {
      // Hide Espace membre link if present
      navButtons.querySelectorAll('a').forEach(a => {
        const href = (a.getAttribute('href')||'');
        if (href.endsWith('user-login.html')) a.style.display = 'none';
      });
      
      const wrap = document.createElement('span');
      wrap.setAttribute('data-siteauth-ui','1');
      wrap.style.display = 'inline-flex';
      wrap.style.gap = '8px';

      // Mon espace
      const space = buildLink(prefix + 'member-dashboard.html', 'fas fa-user', 'Mon espace');
      space.classList.add('site-space-link');
      wrap.appendChild(space);

      // Logout
      const logout = document.createElement('a');
      logout.href = '#';
      logout.className = 'login-btn';
      logout.title = 'Déconnexion';
      logout.setAttribute('data-siteauth-logout','1');
      const li = document.createElement('i'); 
      li.className = 'fas fa-sign-out-alt';
      const ls = document.createElement('span'); 
      ls.textContent = 'Déconnexion';
      logout.appendChild(li); 
      logout.appendChild(ls);
      
      logout.addEventListener('click', function(e){ 
        e.preventDefault(); 
        setSiteUser(null); // Utiliser la nouvelle fonction
        location.reload(); 
      });
      
      wrap.appendChild(logout);
      navButtons.appendChild(wrap);
    } else {
      // Ensure Espace membre link exists; if not, add one
      const hasMemberLink = Array.from(navButtons.querySelectorAll('a')).some(a => (a.getAttribute('href')||'').endsWith('user-login.html'));
      if (!hasMemberLink) {
        const member = buildLink(prefix + 'user-login.html', 'fas fa-user', 'Espace membre');
        member.setAttribute('data-siteauth-ui','1');
        navButtons.appendChild(member);
      }
    }
  }

  // Vérifier la connexion au chargement de la page
  function checkLoginStatus() {
    const user = getSiteUser();
    if (user) {
      // Si l'utilisateur est connecté et qu'on est sur la page de connexion, rediriger
      if (window.location.pathname.includes('user-login.html')) {
        window.location.href = 'index.html';
        return;
      }
    }
  }

  // Vérifier si l'utilisateur doit être connecté pour accéder à une page
  function requireLogin() {
    const user = getSiteUser();
    if (!user) {
      // Sauvegarder la page actuelle pour rediriger après connexion
      try {
        localStorage.setItem('postLoginRedirect', window.location.href);
      } catch {}
      // Rediriger vers la page de connexion
      const isSub = window.location.pathname.indexOf('/pages/') !== -1;
      const loginUrl = isSub ? '../user-login.html' : 'user-login.html';
      window.location.href = loginUrl;
      return false;
    }
    return true;
  }

  // Exposer les fonctions globalement pour les autres scripts
  window.siteAuth = {
    getSiteUser,
    setSiteUser,
    checkLoginStatus,
    requireLogin
  };

  document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    apply();
  });

  // Vérifier aussi au chargement de la page
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkLoginStatus);
  } else {
    checkLoginStatus();
  }
})(); 