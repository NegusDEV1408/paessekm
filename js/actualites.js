document.addEventListener('DOMContentLoaded', function() {
    // Gestion des filtres de catégories
    const filterButtons = document.querySelectorAll('.categories-filter button');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            const category = this.dataset.category;
            filterArticles(category);
        });
    });

    // Gestion du formulaire newsletter
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Simulation d'envoi à l'API
            console.log(`Newsletter inscription pour: ${email}`);
            alert('Merci pour votre inscription à la newsletter !');
            this.reset();
        });
    }

    // Fonction de filtrage des articles
    function filterArticles(category) {
        const articles = document.querySelectorAll('.article-card');
        
        articles.forEach(article => {
            if (category === 'tout') {
                article.style.display = 'block';
            } else {
                const articleCategory = article.querySelector('.category').textContent.toLowerCase();
                article.style.display = articleCategory === category ? 'block' : 'none';
            }
        });
    }

    // Animation au scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.article-card').forEach(card => {
        observer.observe(card);
    });

    // Gestion du menu mobile et du scroll du header
    const header = document.querySelector('.header-transparent');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Gestion du scroll pour le header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Gestion du menu mobile
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });

        // Fermer le menu quand on clique sur un lien
        const navItems = document.querySelectorAll('.nav-item a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                navLinks.classList.remove('active');
            });
        });

        // Fermer le menu quand on clique en dehors
        document.addEventListener('click', function(e) {
            if (!header.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }
});