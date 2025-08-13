document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Smooth scroll pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    // Ajoutez ces fonctions à votre fichier main.js existant

// Gestion du slider
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelector('.slide-dots');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    let currentSlide = 0;

    // Vérifier si les éléments existent avant de continuer
    if (!slides.length) return;

    // Créer les points pour chaque slide
    if (dots) {
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dots.appendChild(dot);
        });
    }

    function goToSlide(index) {
        if (slides[currentSlide]) {
            slides[currentSlide].classList.remove('active');
        }
        const currentDot = document.querySelectorAll('.dot')[currentSlide];
        if (currentDot) {
            currentDot.classList.remove('active');
        }
        
        currentSlide = index;
        
        if (slides[currentSlide]) {
            slides[currentSlide].classList.add('active');
        }
        const newDot = document.querySelectorAll('.dot')[currentSlide];
        if (newDot) {
            newDot.classList.add('active');
        }
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prev);
    }

    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    // Auto-play
    if (slides.length > 1) {
        setInterval(nextSlide, 5000);
    }
}
// Initialisation générale
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser la navigation
    initNavigation();
    
    // Initialiser le slider si les éléments existent
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        initSlider();
    }
    
    // Initialiser les animations AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }
    
    // Initialiser la carte si elle existe
    const mapContainer = document.getElementById('keurMassarMap');
    if (mapContainer && typeof L !== 'undefined') {
        initMap();
    }
    
    // Initialiser les statistiques
    const statsSection = document.querySelector('.impact-stats');
    if (statsSection) {
        // Déclencher l'animation des nombres quand la section est visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animation des nombres
                    const statNumbers = document.querySelectorAll('.stat-number');
                    statNumbers.forEach(number => {
                        const target = parseInt(number.getAttribute('data-target')) || 0;
                        animateValue(number, 0, target, 2000);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
});

// Fonction d'animation des valeurs
function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Fonction d'easing
        const easeOutQuad = t => t * (2 - t);
        const easedProgress = easeOutQuad(progress);
        
        const currentValue = Math.round(start + (end - start) * easedProgress);
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

// Fonction d'initialisation de la carte
function initMap() {
    const mapContainer = document.getElementById('keurMassarMap');
    if (!mapContainer) return;
    
    // Coordonnées approximatives de Keur Massar
    const keurMassarCoords = [14.7645, -17.3661];
    
    const map = L.map('keurMassarMap').setView(keurMassarCoords, 12);
    
    // Ajouter la couche de tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Ajouter des marqueurs pour les communes
    const communes = [
        { name: 'Yeumbeul Nord', coords: [14.7645, -17.3661] },
        { name: 'Yeumbeul Sud', coords: [14.7600, -17.3700] },
        { name: 'Keur Massar Nord', coords: [14.7680, -17.3620] },
        { name: 'Keur Massar Sud', coords: [14.7650, -17.3650] },
        { name: 'Malika', coords: [14.7700, -17.3600] },
        { name: 'Jaxaay-Parcelles', coords: [14.7750, -17.3550] }
    ];
    
    communes.forEach(commune => {
        const marker = L.marker(commune.coords).addTo(map);
        marker.bindPopup(`<b>${commune.name}</b><br>Commune de Keur Massar`);
    });
}

// Ajoutez ces fonctions à votre fichier main.js existant

function initNavigation() {
    const header = document.querySelector('.header-transparent');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Gestion du scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Menu mobile
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
    });

    // Gestion des dropdowns sur mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 968) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    // ... autres initialisations
});
// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser le slider
    initSlider();
    
    // Animation des témoignages
    const testimonials = document.querySelectorAll('.testimonial-card');
    testimonials.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

    // Animation au scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('keurMassarMap').setView([14.7645, -17.3276], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Données détaillées des communes
    const communes = {
        'yeumbeul-nord': {
            coords: [14.7742, -17.3673],
            nom: 'Yeumbeul Nord',
            superficie: '7,3 km²',
            population: '168 379 habitants',
            limites: 'Limitrophe à Malika, Yeumbeul Sud et Keur Massar Nord',
            quartiers: ['Yeumbeul Layenne', 'Thiaroye Kao', 'Aïnoumady']
        },
        'yeumbeul-sud': {
            coords: [14.7689, -17.3757],
            nom: 'Yeumbeul Sud',
            superficie: '6,8 km²',
            population: '157 635 habitants',
            limites: 'Limitrophe à Yeumbeul Nord et Keur Massar Sud',
            quartiers: ['Darou Salam', 'Médina', 'Diamalaye']
        },
        'keur-massar-nord': {
            coords: [14.7645, -17.3276],
            nom: 'Keur Massar Nord',
            superficie: '16,8 km²',
            population: '189 456 habitants',
            limites: 'Limitrophe à Yeumbeul Nord et Malika',
            quartiers: ['Darou Rakhmane', 'Ainoumady', 'Darou Salam']
        },
        'keur-massar-sud': {
            coords: [14.7589, -17.3234],
            nom: 'Keur Massar Sud',
            superficie: '18,2 km²',
            population: '176 542 habitants',
            limites: 'Limitrophe à Keur Massar Nord et Jaxaay-Parcelles',
            quartiers: ['Kamb', 'Boune', 'Ngom']
        },
        'malika': {
            coords: [14.7923, -17.3370],
            nom: 'Malika',
            superficie: '5,9 km²',
            population: '72 189 habitants',
            limites: 'Limitrophe à Yeumbeul Nord et Keur Massar Nord',
            quartiers: ['Malika Plage', 'Malika Village', 'Diamalaye']
        },
        'jaxaay-parcelles': {
            coords: [14.7534, -17.3089],
            nom: 'Jaxaay-Parcelles',
            superficie: '22,4 km²',
            population: '145 678 habitants',
            limites: 'Limitrophe à Keur Massar Sud',
            quartiers: ['Jaxaay 1', 'Jaxaay 2', 'Parcelles Assainies']
        }
    };

    // Style personnalisé pour les popups
    const customPopup = (commune) => {
        return `
            <div class="commune-popup">
                <h3>${commune.nom}</h3>
                <div class="commune-info">
                    <p><i class="fas fa-chart-area"></i> <strong>Superficie:</strong> ${commune.superficie}</p>
                    <p><i class="fas fa-users"></i> <strong>Population:</strong> ${commune.population}</p>
                    <p><i class="fas fa-border-all"></i> <strong>Limites:</strong> ${commune.limites}</p>
                    <p><i class="fas fa-map-marker-alt"></i> <strong>Quartiers principaux:</strong></p>
                    <ul>
                        ${commune.quartiers.map(q => `<li>${q}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    };

    // Options personnalisées pour les popups
    const customOptions = {
        maxWidth: 300,
        className: 'custom-popup'
    };

    // Ajouter les marqueurs sur la carte
    for (let key in communes) {
        const commune = communes[key];
        L.marker(commune.coords)
         .bindPopup(customPopup(commune), customOptions)
         .addTo(map);
    }

    // Interaction avec la liste des communes
    document.querySelectorAll('.communes-list li').forEach(item => {
        item.addEventListener('click', function() {
            const communeKey = this.dataset.commune;
            if (communes[communeKey]) {
                map.setView(communes[communeKey].coords, 14);
                // Mettre à jour les informations de la commune sélectionnée
                updateCommuneInfo(communes[communeKey]);
            }
        });
    });

    // Fonction pour mettre à jour les informations de la commune
    function updateCommuneInfo(commune) {
        const infoDiv = document.querySelector('.commune-details');
        if (infoDiv) {
            infoDiv.innerHTML = `
                <h3>${commune.nom}</h3>
                <p><i class="fas fa-chart-area"></i> Superficie: ${commune.superficie}</p>
                <p><i class="fas fa-users"></i> Population: ${commune.population}</p>
                <p><i class="fas fa-border-all"></i> Limites: ${commune.limites}</p>
            `;
        }
    }
});

// ===== AMÉLIORATIONS POUR LA SECTION MOT DU PRÉSIDENT =====

// Fonction d'initialisation pour la section président
function initPresidentSection() {
    const presidentSection = document.querySelector('.president-message');
    if (!presidentSection) return;

    // Animation de la photo du président au scroll
    const presidentImage = presidentSection.querySelector('.president-image img');
    const presidentText = presidentSection.querySelector('.president-text');
    
    // Effet de parallaxe léger pour la photo
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (presidentImage && isElementInViewport(presidentSection)) {
            presidentImage.style.transform = `translateY(${rate}px)`;
        }
    });

    // Animation du texte au survol
    if (presidentText) {
        presidentText.addEventListener('mouseenter', () => {
            presidentText.style.transform = 'scale(1.02)';
            presidentText.style.transition = 'transform 0.3s ease';
        });

        presidentText.addEventListener('mouseleave', () => {
            presidentText.style.transform = 'scale(1)';
        });
    }

    // Animation de la signature
    const signature = presidentSection.querySelector('.president-signature');
    if (signature) {
        // Animation d'apparition de la signature
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    signature.style.opacity = '0';
                    signature.style.transform = 'translateX(50px)';
                    signature.style.transition = 'all 0.8s ease';
                    
                    setTimeout(() => {
                        signature.style.opacity = '1';
                        signature.style.transform = 'translateX(0)';
                    }, 500);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(signature);
    }

    // Effet de focus sur la photo au clic
    if (presidentImage) {
        presidentImage.addEventListener('click', () => {
            // Créer une modal pour afficher la photo en grand
            createImageModal(presidentImage.src, 'M. Babacar GUEYE - Président du Conseil Départemental de Keur Massar');
        });
    }

    // Animation des guillemets
    const quoteLeft = presidentSection.querySelector('.fa-quote-left');
    const quoteRight = presidentSection.querySelector('.fa-quote-right');
    
    if (quoteLeft && quoteRight) {
        // Animation des guillemets au survol
        presidentText.addEventListener('mouseenter', () => {
            quoteLeft.style.transform = 'rotate(-10deg) scale(1.1)';
            quoteRight.style.transform = 'rotate(10deg) scale(1.1)';
            quoteLeft.style.transition = 'transform 0.3s ease';
            quoteRight.style.transition = 'transform 0.3s ease';
        });

        presidentText.addEventListener('mouseleave', () => {
            quoteLeft.style.transform = 'rotate(0deg) scale(1)';
            quoteRight.style.transform = 'rotate(0deg) scale(1)';
        });
    }

    // Effet de lecture automatique du texte (optionnel)
    const messageContent = presidentSection.querySelector('.message-content');
    if (messageContent) {
        // Ajouter un bouton de lecture audio
        addAudioButton(presidentSection, messageContent);
    }
}

// Fonction pour créer une modal d'image
function createImageModal(imageSrc, title) {
    // Supprimer la modal existante si elle existe
    const existingModal = document.querySelector('.image-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <img src="${imageSrc}" alt="${title}">
                </div>
            </div>
        </div>
    `;

    // Styles CSS pour la modal
    const style = document.createElement('style');
    style.textContent = `
        .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }
        .modal-content {
            background: white;
            border-radius: 15px;
            max-width: 90%;
            max-height: 90%;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: modalSlideIn 0.3s ease;
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #eee;
        }
        .modal-header h3 {
            margin: 0;
            color: var(--primary-color);
        }
        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            padding: 5px;
        }
        .modal-close:hover {
            color: var(--primary-color);
        }
        .modal-body img {
            max-width: 100%;
            max-height: 70vh;
            display: block;
        }
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    // Fermer la modal
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
    });

    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === modal.querySelector('.modal-overlay')) {
            modal.remove();
        }
    });

    // Fermer avec la touche Escape
    document.addEventListener('keydown', function closeModal(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', closeModal);
        }
    });
}

// Fonction pour ajouter un bouton de lecture audio
function addAudioButton(section, content) {
    const audioButton = document.createElement('button');
    audioButton.className = 'audio-button';
    audioButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    audioButton.title = 'Écouter le message';
    
    // Styles pour le bouton audio
    const style = document.createElement('style');
    style.textContent = `
        .audio-button {
            position: absolute;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10;
        }
        .audio-button:hover {
            background: var(--accent-color);
            transform: scale(1.1);
        }
        .audio-button.playing {
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    
    document.head.appendChild(style);
    section.appendChild(audioButton);

    // Fonctionnalité de lecture audio (utilise l'API Web Speech)
    audioButton.addEventListener('click', () => {
        if ('speechSynthesis' in window) {
            const text = content.textContent;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'fr-FR';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            
            audioButton.classList.add('playing');
            audioButton.innerHTML = '<i class="fas fa-pause"></i>';
            
            utterance.onend = () => {
                audioButton.classList.remove('playing');
                audioButton.innerHTML = '<i class="fas fa-volume-up"></i>';
            };
            
            speechSynthesis.speak(utterance);
        } else {
            alert('La lecture audio n\'est pas supportée par votre navigateur.');
        }
    });
}

// Fonction utilitaire pour vérifier si un élément est visible
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Initialiser la section président quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser le slider
    initSlider();
    
    // Initialiser la section président
    initPresidentSection();
    
    // Initialiser le formulaire d'enregistrement
    initRegistrationForm();
    
    // Initialiser les améliorations du footer
    initFooterEnhancements();
});

// ===== GESTION DU FORMULAIRE D'ENREGISTREMENT =====

function initRegistrationForm() {
    const form = document.getElementById('registrationForm');
    if (!form) return;

    // Validation en temps réel
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearError);
    });

    // Gestion de la soumission du formulaire
    form.addEventListener('submit', handleFormSubmission);

    // Animation des cartes d'information
    animateInfoCards();

    // Validation des checkboxes personnalisées
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkmark = this.nextElementSibling;
            if (this.checked) {
                checkmark.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    checkmark.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Supprimer les erreurs précédentes
    clearFieldError(field);
    
    // Validation selon le type de champ
    let isValid = true;
    let errorMessage = '';
    
    switch(fieldName) {
        case 'org-name':
            if (value.length < 3) {
                isValid = false;
                errorMessage = 'Le nom doit contenir au moins 3 caractères';
            }
            break;
            
        case 'president':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Le nom du dirigeant doit contenir au moins 2 caractères';
            }
            break;
            
        case 'phone':
            const phoneRegex = /^(\+221|221)?[0-9]{9}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Veuillez entrer un numéro de téléphone valide';
            }
            break;
            
        case 'email':
            if (value && !isValidEmail(value)) {
                isValid = false;
                errorMessage = 'Veuillez entrer une adresse email valide';
            }
            break;
            
        case 'members':
            if (value && parseInt(value) < 1) {
                isValid = false;
                errorMessage = 'Le nombre de membres doit être supérieur à 0';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(field, message) {
    // Créer l'élément d'erreur
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        animation: slideInError 0.3s ease-out;
    `;
    
    // Ajouter l'erreur après le champ
    field.parentNode.appendChild(errorDiv);
    
    // Ajouter la classe d'erreur au champ
    field.style.borderColor = '#dc3545';
    field.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
}

function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    
    field.style.borderColor = '#e9ecef';
    field.style.boxShadow = 'none';
}

function clearError(event) {
    const field = event.target;
    clearFieldError(field);
}

function handleFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validation complète du formulaire
    if (!validateForm(form)) {
        return;
    }
    
    // Afficher l'état de chargement
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enregistrement en cours...';
    submitBtn.disabled = true;
    
    // Simuler l'envoi du formulaire (remplacer par votre logique d'API)
    setTimeout(() => {
        // Succès
        showSuccessMessage(form);
        
        // Réinitialiser le formulaire
        form.reset();
        
        // Restaurer le bouton
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
    }, 2000);
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'Ce champ est obligatoire');
            isValid = false;
        }
    });
    
    // Validation spéciale pour les checkboxes
    const termsCheckbox = form.querySelector('#terms');
    if (termsCheckbox && !termsCheckbox.checked) {
        showFieldError(termsCheckbox, 'Vous devez accepter les conditions d\'utilisation');
        isValid = false;
    }
    
    return isValid;
}

function showSuccessMessage(form) {
    // Créer le message de succès
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Enregistrement Réussi !</h3>
            <p>Votre organisation a été enregistrée avec succès. Nous vous contacterons dans les 24h pour finaliser votre inscription.</p>
            <button class="close-success">Fermer</button>
        </div>
    `;
    
    // Styles pour le message de succès
    successDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    `;
    
    const successContent = successDiv.querySelector('.success-content');
    successContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        text-align: center;
        max-width: 400px;
        margin: 1rem;
        animation: scaleIn 0.3s ease-out;
    `;
    
    successContent.querySelector('i').style.cssText = `
        font-size: 3rem;
        color: #28a745;
        margin-bottom: 1rem;
    `;
    
    successContent.querySelector('h3').style.cssText = `
        color: #28a745;
        margin-bottom: 1rem;
    `;
    
    successContent.querySelector('p').style.cssText = `
        color: #666;
        margin-bottom: 1.5rem;
        line-height: 1.6;
    `;
    
    const closeBtn = successContent.querySelector('.close-success');
    closeBtn.style.cssText = `
        background: #28a745;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s ease;
    `;
    
    closeBtn.addEventListener('click', () => {
        successDiv.remove();
    });
    
    // Fermer en cliquant en dehors
    successDiv.addEventListener('click', (e) => {
        if (e.target === successDiv) {
            successDiv.remove();
        }
    });
    
    document.body.appendChild(successDiv);
    
    // Auto-fermeture après 5 secondes
    setTimeout(() => {
        if (document.body.contains(successDiv)) {
            successDiv.remove();
        }
    }, 5000);
}

function animateInfoCards() {
    const infoCards = document.querySelectorAll('.info-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    infoCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
}

// Animations CSS supplémentaires
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInError {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    /* Styles pour les améliorations du footer */
    .footer-section {
        transition: all 0.3s ease;
    }
    
    .footer-section:hover {
        transform: translateY(-5px);
    }
    
    .social-btn {
        transition: all 0.3s ease;
    }
    
    .social-btn:hover {
        transform: translateY(-3px) scale(1.1);
    }
    
    .newsletter-form {
        position: relative;
    }
    
    .newsletter-form .success-message {
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--success-color);
        color: white;
        padding: 8px 12px;
        border-radius: 5px;
        font-size: 0.8rem;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    }
    
    .newsletter-form .success-message.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .footer-logo {
        transition: all 0.3s ease;
    }
    
    .footer-logo:hover {
        transform: scale(1.05);
    }
    
    .contact-info p {
        transition: all 0.3s ease;
    }
    
    .contact-info p:hover {
        transform: translateX(5px);
        color: var(--secondary-color);
    }
    
    .footer-bottom-links a {
        transition: all 0.3s ease;
    }
    
    .footer-bottom-links a:hover {
        color: var(--accent-color);
        text-decoration: underline;
    }
    
    .scroll-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    
    .scroll-to-top.visible {
        opacity: 1;
        visibility: visible;
    }
    
    .scroll-to-top:hover {
        background: var(--secondary-color);
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }
    
    .footer-stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        margin-top: 2rem;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
    }
    
    .footer-stat {
        text-align: center;
        color: white;
    }
    
    .footer-stat-number {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--accent-color);
        display: block;
    }
    
    .footer-stat-label {
        font-size: 0.8rem;
        opacity: 0.9;
    }
`;
document.head.appendChild(style);

// ===== AMÉLIORATIONS DU FOOTER =====

function initFooterEnhancements() {
    const footer = document.querySelector('footer');
    if (!footer) return;

    // Ajouter le bouton de retour en haut
    addScrollToTopButton();
    
    // Améliorer la newsletter
    enhanceNewsletter();
    
    // Améliorer les liens sociaux
    enhanceSocialLinks();
    
    // Ajouter des statistiques au footer
    addFooterStats();
    
    // Améliorer les liens de contact
    enhanceContactLinks();
    
    // Animation d'apparition du footer
    animateFooterAppearance();
    
    // Gestion du scroll pour le bouton retour en haut
    handleScrollToTop();
}

function addScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollButton.title = 'Retour en haut';
    scrollButton.setAttribute('aria-label', 'Retour en haut de la page');
    
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(scrollButton);
}

function handleScrollToTop() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (!scrollButton) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });
}

function enhanceNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;
    
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const submitButton = newsletterForm.querySelector('button');
    
    if (!emailInput || !submitButton) return;
    
    // Validation en temps réel
    emailInput.addEventListener('input', function() {
        const email = this.value.trim();
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        
        if (email && !isValid) {
            this.style.borderColor = '#dc3545';
            this.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
        } else {
            this.style.borderColor = '';
            this.style.boxShadow = '';
        }
    });
    
    // Gestion de la soumission
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNewsletterMessage('Veuillez entrer une adresse email valide', 'error');
            return;
        }
        
        // Simuler l'envoi
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitButton.disabled = true;
        
        setTimeout(() => {
            showNewsletterMessage('Inscription réussie ! Vous recevrez nos actualités.', 'success');
            emailInput.value = '';
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
            submitButton.disabled = false;
        }, 1500);
    });
}

function showNewsletterMessage(message, type) {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;
    
    // Supprimer les messages précédents
    const existingMessage = newsletterForm.querySelector('.newsletter-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `newsletter-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 8px 12px;
        border-radius: 5px;
        font-size: 0.8rem;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        z-index: 10;
    `;
    
    newsletterForm.appendChild(messageDiv);
    
    // Afficher le message
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 100);
    
    // Masquer le message après 3 secondes
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 300);
    }, 3000);
}

function enhanceSocialLinks() {
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.classList.contains('facebook') ? 'Facebook' :
                           this.classList.contains('twitter') ? 'Twitter' :
                           this.classList.contains('linkedin') ? 'LinkedIn' :
                           this.classList.contains('instagram') ? 'Instagram' : 'Réseau social';
            
            // Animation de clic
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Simuler l'ouverture du lien
            showSocialLinkMessage(platform);
        });
        
        // Effet de survol amélioré
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

function showSocialLinkMessage(platform) {
    const message = document.createElement('div');
    message.className = 'social-link-message';
    message.innerHTML = `
        <div class="message-content">
            <i class="fas fa-external-link-alt"></i>
            <span>Ouverture de ${platform}...</span>
        </div>
    `;
    
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 0.9rem;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(message);
    
    // Afficher le message
    setTimeout(() => {
        message.style.opacity = '1';
        message.style.transform = 'translateX(0)';
    }, 100);
    
    // Masquer le message après 2 secondes
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 300);
    }, 2000);
}

function addFooterStats() {
    const footer = document.querySelector('footer');
    if (!footer) return;
    
    const footerContent = footer.querySelector('.footer-content');
    if (!footerContent) return;
    
    // Vérifier si les stats existent déjà
    if (footer.querySelector('.footer-stats')) return;
    
    const statsDiv = document.createElement('div');
    statsDiv.className = 'footer-stats';
    statsDiv.innerHTML = `
        <div class="footer-stat">
            <span class="footer-stat-number" data-target="650">0</span>
            <span class="footer-stat-label">Organisations</span>
        </div>
        <div class="footer-stat">
            <span class="footer-stat-number" data-target="6">0</span>
            <span class="footer-stat-label">Communes</span>
        </div>
        <div class="footer-stat">
            <span class="footer-stat-number" data-target="15">0</span>
            <span class="footer-stat-label">Secteurs</span>
        </div>
        <div class="footer-stat">
            <span class="footer-stat-number" data-target="24">0</span>
            <span class="footer-stat-label">Heures</span>
        </div>
    `;
    
    footerContent.appendChild(statsDiv);
    
    // Animer les statistiques
    animateFooterStats();
}

function animateFooterStats() {
    const statNumbers = document.querySelectorAll('.footer-stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target')) || 0;
                animateValue(entry.target, 0, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(number => {
        observer.observe(number);
    });
}

function enhanceContactLinks() {
    const contactInfo = document.querySelector('.contact-info');
    if (!contactInfo) return;
    
    const contactItems = contactInfo.querySelectorAll('p');
    
    contactItems.forEach(item => {
        item.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const text = this.textContent.trim();
            
            if (icon && icon.classList.contains('fa-phone')) {
                // Copier le numéro de téléphone
                const phoneNumber = text.replace(/[^\d+]/g, '');
                copyToClipboard(phoneNumber, 'Numéro de téléphone copié !');
            } else if (icon && icon.classList.contains('fa-envelope')) {
                // Copier l'email
                const email = text.trim();
                copyToClipboard(email, 'Email copié !');
            } else if (icon && icon.classList.contains('fa-map-marker-alt')) {
                // Afficher l'adresse
                showAddressInfo(text);
            }
        });
        
        // Ajouter un curseur pointer
        item.style.cursor = 'pointer';
    });
}

function copyToClipboard(text, message) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyMessage(message);
        }).catch(() => {
            // Fallback pour les navigateurs plus anciens
            fallbackCopyToClipboard(text, message);
        });
    } else {
        fallbackCopyToClipboard(text, message);
    }
}

function fallbackCopyToClipboard(text, message) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyMessage(message);
    } catch (err) {
        console.error('Erreur lors de la copie:', err);
    }
    
    document.body.removeChild(textArea);
}

function showCopyMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'copy-message';
    messageDiv.textContent = message;
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--success-color);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 0.9rem;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(messageDiv);
    
    // Afficher le message
    setTimeout(() => {
        messageDiv.style.opacity = '1';
    }, 100);
    
    // Masquer le message après 2 secondes
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 300);
    }, 2000);
}

function showAddressInfo(address) {
    const infoDiv = document.createElement('div');
    infoDiv.className = 'address-info';
    infoDiv.innerHTML = `
        <div class="address-content">
            <h4><i class="fas fa-map-marker-alt"></i> Notre Adresse</h4>
            <p>${address}</p>
            <div class="address-actions">
                <button class="btn-map" onclick="openInMaps()">
                    <i class="fas fa-map"></i> Voir sur la carte
                </button>
                <button class="btn-copy" onclick="copyAddress('${address}')">
                    <i class="fas fa-copy"></i> Copier
                </button>
            </div>
        </div>
    `;
    
    infoDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 400px;
        width: 90%;
    `;
    
    const overlay = document.createElement('div');
    overlay.className = 'address-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(infoDiv);
    
    // Fermer en cliquant sur l'overlay
    overlay.addEventListener('click', () => {
        overlay.remove();
        infoDiv.remove();
    });
    
    // Fermer avec Escape
    document.addEventListener('keydown', function closeAddress(e) {
        if (e.key === 'Escape') {
            overlay.remove();
            infoDiv.remove();
            document.removeEventListener('keydown', closeAddress);
        }
    });
}

function animateFooterAppearance() {
    const footer = document.querySelector('footer');
    if (!footer) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    footer.style.opacity = '0';
    footer.style.transform = 'translateY(20px)';
    footer.style.transition = 'all 0.8s ease';
    
    observer.observe(footer);
}

// Fonctions globales pour les boutons d'adresse
window.openInMaps = function() {
    const address = 'Keur Massar, Dakar, Sénégal';
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
};

window.copyAddress = function(address) {
    copyToClipboard(address, 'Adresse copiée !');
};