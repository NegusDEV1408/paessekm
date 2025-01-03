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
});