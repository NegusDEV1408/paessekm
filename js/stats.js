// Fonction pour vérifier si un élément est visible dans la fenêtre
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Animation des nombres
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(number => {
        const target = parseInt(number.getAttribute('data-target'));
        const duration = 2000; // 2 secondes
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const updateNumber = () => {
            current += increment;
            if (current < target) {
                number.textContent = Math.round(current);
                requestAnimationFrame(updateNumber);
            } else {
                number.textContent = target;
            }
        };
        
        updateNumber();
    });
}

// Observer pour déclencher l'animation quand la section est visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Fonction pour réinitialiser les nombres
function resetNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(number => {
        number.textContent = '0';
    });
}

// Fonction pour gérer le scroll et déclencher l'animation
function handleScroll() {
    const statsSection = document.querySelector('.impact-stats');
    if (isElementInViewport(statsSection)) {
        animateNumbers();
        // Supprimer l'écouteur d'événement après la première animation
        window.removeEventListener('scroll', handleScroll);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.impact-stats');
    if (statsSection) {
        observer.observe(statsSection);
        
        // Backup scroll listener au cas où IntersectionObserver n'est pas supporté
        window.addEventListener('scroll', handleScroll);
        
        // Vérifier si la section est déjà visible au chargement
        if (isElementInViewport(statsSection)) {
            animateNumbers();
        }
    }
});

// Animation plus fluide avec easing
function easeOutQuad(t) {
    return t * (2 - t);
}

// Version améliorée de l'animation des nombres
function animateNumbersSmooth() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(number => {
        const target = parseInt(number.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();
        
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easedProgress = easeOutQuad(progress);
            const currentValue = Math.round(easedProgress * target);
            
            number.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        requestAnimationFrame(updateNumber);
    });
}

// Fonction pour formater les grands nombres
function formatNumber(number) {
    return new Intl.NumberFormat('fr-FR').format(number);
}

// Ajouter des animations CSS pour les icônes
document.querySelectorAll('.stat-icon').forEach(icon => {
    icon.addEventListener('mouseover', () => {
        icon.style.transform = 'scale(1.2)';
        icon.style.transition = 'transform 0.3s ease';
    });
    
    icon.addEventListener('mouseout', () => {
        icon.style.transform = 'scale(1)';
    });
});