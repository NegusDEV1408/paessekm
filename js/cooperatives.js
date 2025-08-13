// JavaScript pour la page Coopératives
document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    initializeShareButtons();
    initializeFavoriteButtons();
    initializeAdhesionForm();
    initializePagination();
    initializeAnimations();
    initializeSmoothScrolling();
});

// Initialisation des filtres
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cooperatives = document.querySelectorAll('.cooperative-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            filterCooperatives(category);
        });
    });
}

// Filtrage des coopératives
function filterCooperatives(category) {
    const cooperatives = document.querySelectorAll('.cooperative-card');
    
    cooperatives.forEach(cooperative => {
        const cooperativeCategory = cooperative.getAttribute('data-category');
        
        if (category === 'tout' || cooperativeCategory === category) {
            cooperative.style.display = 'block';
            cooperative.style.animation = 'fadeIn 0.5s ease-in-out';
        } else {
            cooperative.style.animation = 'fadeOut 0.3s ease-in-out';
            setTimeout(() => {
                cooperative.style.display = 'none';
            }, 300);
        }
    });
    
    updateCooperativeCount();
}



// Initialisation des boutons de partage
function initializeShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const cooperativeCard = this.closest('.cooperative-card');
            const title = cooperativeCard.querySelector('h3').textContent;
            const description = cooperativeCard.querySelector('.cooperative-description').textContent;
            const url = window.location.href;
            
            const shareData = {
                title: title,
                text: description,
                url: url
            };
            
            if (navigator.share) {
                navigator.share(shareData);
            } else {
                // Fallback pour les navigateurs qui ne supportent pas l'API de partage
                const shareText = `${title} - ${description} - ${url}`;
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(shareText).then(() => {
                        showNotification('Coopérative copiée dans le presse-papiers !', 'success');
                    });
                } else {
                    showNotification(`Partagez cette coopérative : ${shareText}`, 'info');
                }
            }
        });
    });
}

// Initialisation des boutons favoris
function initializeFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const cooperativeCard = this.closest('.cooperative-card');
            const title = cooperativeCard.querySelector('h3').textContent;
            
            // Toggle favorite
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.color = '#e74c3c';
                showNotification(`"${title}" ajouté aux favoris`, 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.color = 'var(--text-secondary)';
                showNotification(`"${title}" retiré des favoris`, 'info');
            }
        });
    });
}

// Initialisation du formulaire d'adhésion
function initializeAdhesionForm() {
    const adhesionForm = document.querySelector('.adhesion-form');
    
    if (adhesionForm) {
        adhesionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = this.querySelector('#adhesion-name');
            const emailInput = this.querySelector('#adhesion-email');
            const phoneInput = this.querySelector('#adhesion-phone');
            const communeInput = this.querySelector('#adhesion-commune');
            const cooperativeInput = this.querySelector('#adhesion-cooperative');
            const skillsInput = this.querySelector('#adhesion-skills');
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const phone = phoneInput.value.trim();
            const commune = communeInput.value;
            const cooperative = cooperativeInput.value;
            const skills = skillsInput.value.trim();
            
            // Validation
            if (!name || !email || !phone || !commune || !cooperative) {
                showNotification('Veuillez remplir tous les champs obligatoires', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Veuillez entrer une adresse email valide', 'error');
                return;
            }
            
            if (!isValidPhone(phone)) {
                showNotification('Veuillez entrer un numéro de téléphone valide', 'error');
                return;
            }
            
            // Simulation d'envoi
            showNotification(`Merci ${name} ! Votre demande d'adhésion a été envoyée. Nous vous contacterons bientôt.`, 'success');
            
            // Réinitialiser le formulaire
            this.reset();
        });
    }
}

// Validation d'email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validation de téléphone
function isValidPhone(phone) {
    const phoneRegex = /^(\+221|221)?[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Initialisation de la pagination
function initializePagination() {
    const pageNumbers = document.querySelectorAll('.page-number');
    const prevButton = document.querySelector('.prev-page');
    const nextButton = document.querySelector('.next-page');
    
    pageNumbers.forEach(number => {
        number.addEventListener('click', function() {
            pageNumbers.forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            
            // Simulation de changement de page
            const page = this.textContent;
            showNotification(`Navigation vers la page ${page}`, 'info');
        });
    });
    
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            if (!this.disabled) {
                showNotification('Navigation vers la page précédente', 'info');
            }
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            showNotification('Navigation vers la page suivante', 'info');
        });
    }
}

// Initialisation des animations
function initializeAnimations() {
    // Animation des coopératives au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer les coopératives
    const cooperatives = document.querySelectorAll('.cooperative-card');
    
    cooperatives.forEach(cooperative => {
        cooperative.style.opacity = '0';
        cooperative.style.transform = 'translateY(30px)';
        cooperative.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(cooperative);
    });

    // Animation des statistiques
    animateStatistics();
}

// Animation des statistiques
function animateStatistics() {
    const statNumbers = document.querySelectorAll('.stat-number, .impact-number');
    
    statNumbers.forEach(stat => {
        const finalNumber = parseInt(stat.textContent.replace(/\D/g, ''));
        const suffix = stat.textContent.replace(/\d/g, '');
        
        let currentNumber = 0;
        const increment = finalNumber / 50;
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                currentNumber = finalNumber;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(currentNumber) + suffix;
        }, 50);
    });
}

// Mise à jour du compteur de coopératives
function updateCooperativeCount() {
    const visibleCooperatives = document.querySelectorAll('.cooperative-card[style*="block"], .cooperative-card:not([style*="none"])');
    const count = visibleCooperatives.length;
    
    console.log(`${count} coopérative(s) trouvée(s)`);
}

// Affichage des notifications
function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Styles pour la notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Bouton de fermeture
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
    
    // Auto-fermeture après 5 secondes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Obtenir l'icône de notification
function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Obtenir la couleur de notification
function getNotificationColor(type) {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    return colors[type] || colors.info;
}

// Initialisation du défilement fluide
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.main-nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Fonctions pour les actions des coopératives
function showCooperativeDetails(cooperativeId) {
    const cooperatives = {
        1: {
            name: "Coopérative Agricole Jaxaay",
            description: "Spécialisée dans l'agriculture urbaine et la production maraîchère biologique.",
            members: 45,
            established: 2019,
            commune: "Jaxaay-Parcelles",
            activities: ["Maraîchage", "Agriculture biologique", "Production locale"],
            contact: "+221 77 345 6789",
            email: "coop@jaxaay-agri.sn",
            achievements: ["Certification bio obtenue en 2021", "Approvisionnement de 3 marchés locaux", "Formation de 20 nouveaux agriculteurs"]
        },
        2: {
            name: "Coopérative de Transformation Alimentaire",
            description: "Transformation et valorisation des produits agricoles locaux.",
            members: 32,
            established: 2020,
            commune: "Yeumbeul Sud",
            activities: ["Transformation", "Conditionnement", "Export"],
            contact: "+221 77 567 8901",
            email: "gie@transformation-alimentaire.km",
            achievements: ["Export vers 2 pays voisins", "Création de 15 emplois", "Formation en HACCP"]
        },
        3: {
            name: "Coopérative Artisanale Traditionnelle",
            description: "Préservation et promotion de l'artisanat traditionnel sénégalais.",
            members: 28,
            established: 2018,
            commune: "Keur Massar Sud",
            activities: ["Tissage", "Poterie", "Vannerie"],
            contact: "+221 77 789 0123",
            email: "info@artisanat-traditionnel.km",
            achievements: ["Participation à 5 salons internationaux", "Formation de 30 artisans", "Création d'une boutique en ligne"]
        },
        4: {
            name: "Coopérative de Services Numériques",
            description: "Services numériques et formation en informatique pour la jeunesse.",
            members: 35,
            established: 2021,
            commune: "Malika",
            activities: ["Formation", "Développement web", "Support informatique"],
            contact: "+221 77 901 2345",
            email: "contact@numerique-keur-massar.km",
            achievements: ["Formation de 100 jeunes", "Création de 25 sites web", "Partenariat avec 3 entreprises"]
        },
        5: {
            name: "Coopérative d'Élevage Malika",
            description: "Élevage traditionnel et moderne de volailles et petits ruminants.",
            members: 40,
            established: 2017,
            commune: "Malika",
            activities: ["Élevage", "Volaille", "Petits ruminants"],
            contact: "+221 77 012 3456",
            email: "info@elevage-malika.km",
            achievements: ["Production de 5000 volailles/an", "Formation de 25 éleveurs", "Certification sanitaire"]
        },
        6: {
            name: "Coopérative de Pêche Traditionnelle",
            description: "Pêche traditionnelle et transformation des produits de la mer.",
            members: 55,
            established: 2016,
            commune: "Yeumbeul Nord",
            activities: ["Pêche", "Transformation", "Commercialisation"],
            contact: "+221 77 234 5678",
            email: "coop@peche-traditionnelle.km",
            achievements: ["Approvisionnement de 4 marchés", "Formation de 40 pêcheurs", "Équipement moderne"]
        }
    };
    
    const cooperative = cooperatives[cooperativeId];
    if (cooperative) {
        const details = `
            <h3>${cooperative.name}</h3>
            <p><strong>Description :</strong> ${cooperative.description}</p>
            <p><strong>Membres :</strong> ${cooperative.members}</p>
            <p><strong>Créée en :</strong> ${cooperative.established}</p>
            <p><strong>Commune :</strong> ${cooperative.commune}</p>
            <p><strong>Activités :</strong> ${cooperative.activities.join(', ')}</p>
            <p><strong>Contact :</strong> ${cooperative.contact}</p>
            <p><strong>Email :</strong> ${cooperative.email}</p>
            <p><strong>Réalisations :</strong></p>
            <ul>
                ${cooperative.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
            </ul>
        `;
        
        showNotification(`Détails de ${cooperative.name} affichés dans la console`, 'info');
        console.log(details);
    }
}

function contactCooperative(cooperativeId) {
    const cooperatives = {
        1: { name: "Coopérative Agricole Jaxaay", contact: "+221 77 345 6789", email: "coop@jaxaay-agri.sn" },
        2: { name: "Coopérative de Transformation Alimentaire", contact: "+221 77 567 8901", email: "gie@transformation-alimentaire.km" },
        3: { name: "Coopérative Artisanale Traditionnelle", contact: "+221 77 789 0123", email: "info@artisanat-traditionnel.km" },
        4: { name: "Coopérative de Services Numériques", contact: "+221 77 901 2345", email: "contact@numerique-keur-massar.km" },
        5: { name: "Coopérative d'Élevage Malika", contact: "+221 77 012 3456", email: "info@elevage-malika.km" },
        6: { name: "Coopérative de Pêche Traditionnelle", contact: "+221 77 234 5678", email: "coop@peche-traditionnelle.km" }
    };
    
    const cooperative = cooperatives[cooperativeId];
    if (cooperative) {
        const contactInfo = `
            Contact de ${cooperative.name}
            
            Téléphone : ${cooperative.contact}
            Email : ${cooperative.email}
        `;
        
        showNotification(`Contact de ${cooperative.name} affiché dans la console`, 'info');
        console.log(contactInfo);
    }
}

// CSS pour les animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(20px); }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1rem;
        padding: 0;
        margin-left: auto;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`;
document.head.appendChild(style);

// Gestion du menu mobile et du scroll du header
document.addEventListener('DOMContentLoaded', function() {
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