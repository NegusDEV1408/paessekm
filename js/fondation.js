// JavaScript pour la page Fondation
document.addEventListener('DOMContentLoaded', function() {
    initializeDonationForm();
    initializeContactForm();
    initializeAnimations();
    initializeSmoothScrolling();
});

// Initialisation du formulaire de don
function initializeDonationForm() {
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('custom-amount');
    const donationForm = document.querySelector('.donation-form');

    // Gestion des boutons de montant
    amountButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            amountButtons.forEach(b => b.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');

            const amount = this.getAttribute('data-amount');
            
            if (amount === 'custom') {
                customAmountInput.style.display = 'block';
                customAmountInput.focus();
            } else {
                customAmountInput.style.display = 'none';
                customAmountInput.value = '';
            }
        });
    });

    // Gestion du formulaire de don
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const donorName = document.getElementById('donor-name').value;
            const donorEmail = document.getElementById('donor-email').value;
            const donorPhone = document.getElementById('donor-phone').value;
            const donationMessage = document.getElementById('donation-message').value;
            
            // Récupérer le montant sélectionné
            const activeButton = document.querySelector('.amount-btn.active');
            let amount = 0;
            
            if (activeButton) {
                const buttonAmount = activeButton.getAttribute('data-amount');
                if (buttonAmount === 'custom') {
                    amount = customAmountInput.value;
                } else {
                    amount = buttonAmount;
                }
            }

            // Validation
            if (!donorName || !donorEmail || !amount) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }

            if (amount <= 0) {
                alert('Veuillez sélectionner un montant valide.');
                return;
            }

            // Simulation d'envoi du don
            showDonationConfirmation(donorName, amount);
            
            // Réinitialiser le formulaire
            this.reset();
            amountButtons.forEach(btn => btn.classList.remove('active'));
            customAmountInput.style.display = 'none';
        });
    }
}

// Affichage de la confirmation de don
function showDonationConfirmation(name, amount) {
    const confirmationMessage = `
        Merci ${name} pour votre don de ${amount} FCFA !
        
        Votre générosité contribue directement à l'amélioration de notre communauté.
        Vous recevrez bientôt un email de confirmation.
        
        Ensemble, nous construisons un avenir meilleur pour Keur Massar.
    `;
    
    alert(confirmationMessage);
}

// Initialisation du formulaire de contact
function initializeContactForm() {
    const contactForm = document.querySelector('.message-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const contactName = document.getElementById('contact-name').value;
            const contactEmail = document.getElementById('contact-email').value;
            const contactSubject = document.getElementById('contact-subject').value;
            const contactMessage = document.getElementById('contact-message').value;
            
            // Validation
            if (!contactName || !contactEmail || !contactSubject || !contactMessage) {
                alert('Veuillez remplir tous les champs.');
                return;
            }

            // Validation email
            if (!isValidEmail(contactEmail)) {
                alert('Veuillez entrer une adresse email valide.');
                return;
            }

            // Simulation d'envoi du message
            showContactConfirmation(contactName);
            
            // Réinitialiser le formulaire
            this.reset();
        });
    }
}

// Affichage de la confirmation de contact
function showContactConfirmation(name) {
    const confirmationMessage = `
        Merci ${name} pour votre message !
        
        Nous avons bien reçu votre demande et nous vous répondrons dans les plus brefs délais.
        
        L'équipe de la Fondation Keur Massar Social
    `;
    
    alert(confirmationMessage);
}

// Validation d'email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialisation des animations
function initializeAnimations() {
    // Animation des cartes au scroll
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

    // Observer les éléments à animer
    const animatedElements = document.querySelectorAll('.mission-card, .value-item, .project-card, .impact-card, .team-member');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
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
        const increment = finalNumber / 50; // Animation sur 50 étapes
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

// Défilement fluide pour les ancres
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animation des barres de progression des projets
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// Initialiser les animations des barres de progression
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(animateProgressBars, 1000);
});

// Effet de parallaxe pour la section hero
function initializeParallax() {
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroBackground.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Initialiser l'effet parallaxe
document.addEventListener('DOMContentLoaded', function() {
    initializeParallax();
});

// Gestion des événements de partage
function initializeShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const projectCard = this.closest('.project-card');
            const projectTitle = projectCard.querySelector('h3').textContent;
            const projectDescription = projectCard.querySelector('p').textContent;
            const url = window.location.href;
            
            const shareData = {
                title: projectTitle,
                text: projectDescription,
                url: url
            };
            
            if (navigator.share) {
                navigator.share(shareData);
            } else {
                // Fallback pour les navigateurs qui ne supportent pas l'API de partage
                const shareText = `${projectTitle} - ${projectDescription} - ${url}`;
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(shareText).then(() => {
                        alert('Informations du projet copiées dans le presse-papiers !');
                    });
                } else {
                    alert(`Partagez ce projet : ${shareText}`);
                }
            }
        });
    });
}

// Initialiser les boutons de partage
document.addEventListener('DOMContentLoaded', function() {
    initializeShareButtons();
});

// Compteur de dons en temps réel
function updateDonationCounter() {
    const donationCounter = document.querySelector('.donation-counter');
    if (donationCounter) {
        let currentAmount = 0;
        const targetAmount = 50000000; // 50M FCFA
        
        const timer = setInterval(() => {
            currentAmount += Math.random() * 1000;
            if (currentAmount >= targetAmount) {
                currentAmount = targetAmount;
                clearInterval(timer);
            }
            
            const formattedAmount = new Intl.NumberFormat('fr-FR').format(Math.floor(currentAmount));
            donationCounter.textContent = `${formattedAmount} FCFA`;
        }, 100);
    }
}

// Initialiser le compteur de dons
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateDonationCounter, 2000);
});

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