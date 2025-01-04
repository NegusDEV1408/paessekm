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

    // Créer les points pour chaque slide
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dots.appendChild(dot);
    });

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        document.querySelectorAll('.dot')[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        slides[currentSlide].classList.add('active');
        document.querySelectorAll('.dot')[currentSlide].classList.add('active');
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
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Auto-play
    setInterval(nextSlide, 5000);
}
// Ajoutez ces fonctions à votre fichier main.js existant

function initNavigation() {
    const header = document.querySelector('.header-transparent');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const searchBtn = document.querySelector('.search-btn');
    const searchOverlay = document.querySelector('.search-overlay');
    const closeSearch = document.querySelector('.close-search');
    const themeToggle = document.querySelector('.theme-toggle');

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

    // Recherche
    searchBtn.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        searchOverlay.querySelector('input').focus();
    });

    closeSearch.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
    });

    // Fermer la recherche avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchOverlay.classList.remove('active');
        }
    });

    // Thème sombre/clair
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
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
    // Initialisation existante...
    
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