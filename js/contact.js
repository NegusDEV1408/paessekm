// Configuration globale
const CONFIG = {
    currentStep: 1,
    totalSteps: 3,
    maxMessageLength: 1000,
    mapCenter: [14.778491997055875, -17.31354165659888], // Coordonnées du Conseil départemental de Keur Massar
    mapZoom: 16
};

// État global de l'application
let appState = {
    formData: {},
    map: null,
    isSubmitting: false
};

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    initializeMap();
    initializeAOS();
    updateOfficeStatus();
});

// Initialisation de l'application
function initializeApp() {
    updateProgressBar();
    setupFAQ();
    setupCharacterCounter();
    setupFormValidation();
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Formulaire
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Champs de formulaire
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });

    // Compteur de caractères
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        messageTextarea.addEventListener('input', updateCharacterCounter);
    }

    // Boutons de navigation du formulaire
    const nextButtons = document.querySelectorAll('.btn-next');
    nextButtons.forEach(btn => {
        btn.addEventListener('click', nextStep);
    });

    const prevButtons = document.querySelectorAll('.btn-prev');
    prevButtons.forEach(btn => {
        btn.addEventListener('click', prevStep);
    });

    // FAQ
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', toggleFAQ);
    });

    // Liens de contact
    setupContactLinks();
}

// Gestion du formulaire multi-étapes
function nextStep() {
    if (validateCurrentStep()) {
        if (CONFIG.currentStep < CONFIG.totalSteps) {
            CONFIG.currentStep++;
            updateFormDisplay();
            updateProgressBar();
        }
    }
}

function prevStep() {
    if (CONFIG.currentStep > 1) {
        CONFIG.currentStep--;
        updateFormDisplay();
        updateProgressBar();
    }
}

function updateFormDisplay() {
    // Masquer toutes les étapes
    const steps = document.querySelectorAll('.form-step');
    steps.forEach(step => {
        step.classList.remove('active');
    });

    // Afficher l'étape actuelle
    const currentStepElement = document.querySelector(`[data-step="${CONFIG.currentStep}"]`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }

    // Mettre à jour les boutons
    updateNavigationButtons();

    // Si c'est l'étape de confirmation, remplir les détails
    if (CONFIG.currentStep === 3) {
        fillConfirmationDetails();
    }
}

function updateProgressBar() {
    const progressSteps = document.querySelectorAll('.progress-step');
    
    progressSteps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber < CONFIG.currentStep) {
            step.classList.add('completed');
        } else if (stepNumber === CONFIG.currentStep) {
            step.classList.add('active');
        }
    });
}

function updateNavigationButtons() {
    const prevButtons = document.querySelectorAll('.btn-prev');
    const nextButtons = document.querySelectorAll('.btn-next');
    const submitButton = document.querySelector('.btn-submit');

    // Boutons précédent
    prevButtons.forEach(btn => {
        btn.style.display = CONFIG.currentStep > 1 ? 'flex' : 'none';
    });

    // Boutons suivant
    nextButtons.forEach(btn => {
        btn.style.display = CONFIG.currentStep < CONFIG.totalSteps ? 'flex' : 'none';
    });

    // Bouton d'envoi
    if (submitButton) {
        submitButton.style.display = CONFIG.currentStep === CONFIG.totalSteps ? 'flex' : 'none';
    }
}

// Validation du formulaire
function validateCurrentStep() {
    const currentStepElement = document.querySelector(`[data-step="${CONFIG.currentStep}"]`);
    if (!currentStepElement) return false;

    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = field.parentNode.querySelector('.error-message');

    // Réinitialiser l'erreur
    clearFieldError(field);

    // Validation selon le type de champ
    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
        case 'nom':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Le nom doit contenir au moins 2 caractères';
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Veuillez entrer une adresse email valide';
            }
            break;

        case 'telephone':
            if (value && !/^[\+]?[0-9\s\-\(\)]{8,}$/.test(value)) {
                isValid = false;
                errorMessage = 'Veuillez entrer un numéro de téléphone valide';
            }
            break;

        case 'sujet':
            if (!value) {
                isValid = false;
                errorMessage = 'Veuillez sélectionner un sujet';
            }
            break;

        case 'message':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Le message doit contenir au moins 10 caractères';
            } else if (value.length > CONFIG.maxMessageLength) {
                isValid = false;
                errorMessage = `Le message ne peut pas dépasser ${CONFIG.maxMessageLength} caractères`;
            }
            break;
    }

    // Afficher l'erreur si nécessaire
    if (!isValid && errorMessage) {
        showFieldError(field, errorMessage);
    }

    // Mettre à jour l'apparence du champ
    field.classList.toggle('error', !isValid);
    field.classList.toggle('valid', isValid && value);

    return isValid;
}

function showFieldError(field, message) {
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearFieldError(field) {
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    field.classList.remove('error');
}

function setupFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Validation en temps réel
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                validateField(input);
            }
        });
    });
}

// Compteur de caractères
function setupCharacterCounter() {
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        updateCharacterCounter();
    }
}

function updateCharacterCounter() {
    const messageTextarea = document.getElementById('message');
    const charCountElement = document.getElementById('charCount');
    
    if (messageTextarea && charCountElement) {
        const currentLength = messageTextarea.value.length;
        charCountElement.textContent = currentLength;
        
        // Changer la couleur selon la longueur
        const percentage = (currentLength / CONFIG.maxMessageLength) * 100;
        if (percentage > 90) {
            charCountElement.style.color = '#e74c3c';
        } else if (percentage > 75) {
            charCountElement.style.color = '#f39c12';
        } else {
            charCountElement.style.color = '#7f8c8d';
        }
    }
}

// Confirmation du formulaire
function fillConfirmationDetails() {
    const formData = new FormData(document.getElementById('contactForm'));
    
    // Remplir les détails de confirmation
    const confirmFields = ['nom', 'email', 'sujet', 'message'];
    confirmFields.forEach(fieldName => {
        const confirmElement = document.getElementById(`confirm-${fieldName}`);
        if (confirmElement) {
            let value = formData.get(fieldName);
            
            // Traitement spécial pour certains champs
            if (fieldName === 'sujet') {
                value = getSubjectLabel(value);
            } else if (fieldName === 'message') {
                value = value.length > 100 ? value.substring(0, 100) + '...' : value;
            }
            
            confirmElement.textContent = value || 'Non renseigné';
        }
    });
}

function getSubjectLabel(value) {
    const subjects = {
        'information': 'Demande d\'information',
        'partenariat': 'Proposition de partenariat',
        'suggestion': 'Suggestion d\'amélioration',
        'reclamation': 'Réclamation',
        'inscription': 'Demande d\'inscription',
        'autre': 'Autre'
    };
    return subjects[value] || value;
}

// Soumission du formulaire
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (appState.isSubmitting) return;
    
    if (!validateCurrentStep()) {
        showNotification('Veuillez corriger les erreurs dans le formulaire', 'error');
        return;
    }

    appState.isSubmitting = true;
    
    // Simuler l'envoi du formulaire
    showNotification('Envoi en cours...', 'info');
    
    const formData = new FormData(event.target);
    const submitButton = event.target.querySelector('.btn-submit');
    
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
    }

    // Simulation d'un délai d'envoi
    setTimeout(() => {
        // Sauvegarder le message dans le localStorage
        const messageData = {
            id: 'MSG_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            nom: formData.get('nom'),
            email: formData.get('email'),
            sujet: formData.get('sujet'),
            message: formData.get('message'),
            urgence: formData.get('urgence'),
            newsletter: formData.get('newsletter') === 'on',
            dateEnvoi: new Date().toISOString(),
            statut: 'new',
            lu: false,
            repondu: false
        };
        
        // Récupérer les messages existants
        const existingMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        existingMessages.unshift(messageData); // Ajouter au début
        localStorage.setItem('contactMessages', JSON.stringify(existingMessages));
        
        console.log('Message sauvegardé:', messageData);
        console.log('Données du formulaire:', Object.fromEntries(formData));
        
        showNotification('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.', 'success');
        
        // Réinitialiser le formulaire
        event.target.reset();
        CONFIG.currentStep = 1;
        updateFormDisplay();
        updateProgressBar();
        
        appState.isSubmitting = false;
        
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer le message';
        }
    }, 2000);
}

// Notifications
function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Ajouter au DOM
    document.body.appendChild(notification);

    // Animation d'entrée
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Auto-suppression après 5 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// FAQ
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => toggleFAQ(item));
        }
    });
}

function toggleFAQ(item) {
    const isActive = item.classList.contains('active');
    
    // Fermer tous les autres éléments FAQ
    document.querySelectorAll('.faq-item').forEach(faqItem => {
        faqItem.classList.remove('active');
    });
    
    // Ouvrir l'élément cliqué s'il n'était pas déjà ouvert
    if (!isActive) {
        item.classList.add('active');
    }
}

// Carte interactive
function initializeMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    try {
        // Initialiser la carte Leaflet
        appState.map = L.map('map').setView(CONFIG.mapCenter, CONFIG.mapZoom);

        // Ajouter la couche de tuiles OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(appState.map);

        // Ajouter un marqueur pour le bureau
        const officeMarker = L.marker(CONFIG.mapCenter).addTo(appState.map);
        
        // Popup du marqueur
        officeMarker.bindPopup(`
            <div class="map-popup">
                <h3>Bureau Conseil Départemental de Keur Massar</h3>
                <p><i class="fas fa-map-marker-alt"></i> Route de Rufisque, Keur Massar, Dakar, Sénégal</p>
                <p><i class="fas fa-clock"></i> Lun-Ven: 9h-17h, Sam: 9h-13h</p>
                <div class="popup-actions">
                    <a href="tel:+221771234567" class="popup-btn">
                        <i class="fas fa-phone"></i> Appeler
                    </a>
                    <a href="https://maps.app.goo.gl/4C6HVUZXtEX9NnGQ8" target="_blank" rel="noopener" class="popup-btn">
                        <i class="fas fa-directions"></i> Itinéraire
                    </a>
                </div>
            </div>
        `);

        // Ouvrir le popup par défaut
        officeMarker.openPopup();

    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la carte:', error);
        mapElement.innerHTML = `
            <div class="map-error">
                <i class="fas fa-map-marked-alt"></i>
                <p>Impossible de charger la carte</p>
                <a href="https://maps.app.goo.gl/4C6HVUZXtEX9NnGQ8" target="_blank" rel="noopener" class="map-link">
                    Voir sur Google Maps
                </a>
            </div>
        `;
    }
}

// Statut du bureau
function updateOfficeStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
    const hour = now.getHours();
    
    const isOpen = (day >= 1 && day <= 5 && hour >= 9 && hour < 17) || 
                   (day === 6 && hour >= 9 && hour < 13);
    
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    
    if (statusDot && statusText) {
        if (isOpen) {
            statusDot.classList.add('open');
            statusText.textContent = 'Ouvert actuellement';
            statusText.style.color = 'var(--success-color)';
        } else {
            statusDot.classList.remove('open');
            statusText.textContent = 'Fermé actuellement';
            statusText.style.color = 'var(--accent-color)';
        }
    }
}

// Liens de contact
function setupContactLinks() {
    // Liens téléphone
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Ajouter un événement de suivi si nécessaire
            console.log('Appel téléphonique:', link.href);
        });
    });

    // Liens email
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Ajouter un événement de suivi si nécessaire
            console.log('Email envoyé:', link.href);
        });
    });
}

// Initialisation d'AOS (Animate On Scroll)
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
}

// Styles CSS pour les notifications
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 400px;
    border-left: 4px solid var(--secondary-color);
    border-top: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
}

.notification.show {
    transform: translateX(0);
}

.notification.success {
    border-left-color: var(--success-color);
    background: linear-gradient(135deg, rgba(39, 174, 96, 0.05), rgba(39, 174, 96, 0.02));
}

.notification.error {
    border-left-color: var(--accent-color);
    background: linear-gradient(135deg, rgba(255, 177, 0, 0.05), rgba(255, 177, 0, 0.02));
}

.notification.warning {
    border-left-color: var(--warning-color);
    background: linear-gradient(135deg, rgba(243, 156, 18, 0.05), rgba(243, 156, 18, 0.02));
}

.notification-content {
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
}

.notification-content i {
    font-size: 1.2rem;
}

.notification.success .notification-content i {
    color: var(--success-color);
    animation: pulse 2s infinite;
}

.notification.error .notification-content i {
    color: var(--accent-color);
    animation: shake 0.5s ease-in-out;
}

.notification.warning .notification-content i {
    color: var(--warning-color);
    animation: bounce 1s ease-in-out;
}

.notification-content span {
    flex: 1;
    font-size: 0.9rem;
    line-height: 1.4;
}

.notification-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.2rem;
    border-radius: 3px;
    transition: var(--transition);
}

.notification-close:hover {
    background: var(--bg-light);
    color: var(--text-primary);
}

/* Styles pour les champs de formulaire */
.form-group input.error,
.form-group select.error,
.form-group textarea.error {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.form-group input.valid,
.form-group select.valid,
.form-group textarea.valid {
    border-color: var(--success-color);
    box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
}

/* Styles pour la carte */
.map-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-secondary);
    text-align: center;
    padding: 2rem;
}

.map-error i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.map-link {
    margin-top: 1rem;
    padding: 0.8rem 1.5rem;
    background: var(--secondary-color);
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: var(--transition);
}

.map-link:hover {
    background: var(--primary-color);
}

/* Styles pour le popup de la carte */
.map-popup {
    text-align: center;
    min-width: 200px;
}

.map-popup h3 {
    margin: 0 0 0.5rem 0;
    color: var(--text-primary);
    font-size: 1rem;
}

.map-popup p {
    margin: 0.3rem 0;
    font-size: 0.8rem;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
}

.popup-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
}

.popup-btn {
    flex: 1;
    padding: 0.5rem;
    background: var(--secondary-color);
    color: white;
    text-decoration: none;
    border-radius: 3px;
    font-size: 0.8rem;
    transition: var(--transition);
}

.popup-btn:hover {
    background: var(--primary-color);
}
</style>
`;

// Ajouter les styles au head
document.head.insertAdjacentHTML('beforeend', notificationStyles);

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