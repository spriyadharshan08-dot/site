// The Boys Adventure Travel - Main JavaScript
// Interactive components and animations

document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeTypedText();
    initializeQuiz();
    initializeCarousel();
    initializeFilters();
    initializeScrollReveal();
    initializeNavigation();
});

// Initialize Typed.js for hero text
function initializeTypedText() {
    const typed = new Typed('#typed-text', {
        strings: [
            'The Boys',
            'Adventure Awaits',
            'Forge Your Legend',
            'Brotherhood Calls'
        ],
        typeSpeed: 80,
        backSpeed: 60,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });
}

// Initialize scroll reveal animations
function initializeScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Initialize navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.md\\:hidden button');
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'fixed inset-0 bg-white z-50 transform translate-x-full transition-transform duration-300 md:hidden';
    mobileMenu.innerHTML = `
        <div class="flex justify-end p-6">
            <button id="close-menu" class="text-gray-700">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
        <div class="flex flex-col items-center space-y-8 py-12">
            <a href="index.html" class="text-2xl font-medium text-gray-700 hover:text-orange-600">Home</a>
            <a href="destinations.html" class="text-2xl font-medium text-gray-700 hover:text-orange-600">Destinations</a>
            <a href="about.html" class="text-2xl font-medium text-gray-700 hover:text-orange-600">About</a>
            <a href="contact.html" class="text-2xl font-medium text-gray-700 hover:text-orange-600">Contact</a>
        </div>
    `;
    
    document.body.appendChild(mobileMenu);
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('translate-x-full');
        });
    }
    
    const closeMenuBtn = document.getElementById('close-menu');
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('translate-x-full');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize adventure filters
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const destinationCards = document.querySelectorAll('.destination-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-orange-600', 'text-white');
                btn.classList.add('bg-white', 'text-gray-700');
            });
            
            button.classList.add('active', 'bg-orange-600', 'text-white');
            button.classList.remove('bg-white', 'text-gray-700');
            
            // Filter cards with animation
            destinationCards.forEach((card, index) => {
                const categories = card.getAttribute('data-category');
                const shouldShow = filter === 'all' || categories.includes(filter);
                
                if (shouldShow) {
                    setTimeout(() => {
                        card.style.display = 'block';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(30px)';
                        
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    }, index * 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-30px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Initialize personality quiz
function initializeQuiz() {
    let currentQuestion = 1;
    let answers = {};
    
    const quizOptions = document.querySelectorAll('.quiz-option');
    const quizQuestions = document.querySelectorAll('.quiz-question');
    const quizResults = document.getElementById('quiz-results');
    const quizDots = document.querySelectorAll('.quiz-dot');
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            const question = this.closest('.quiz-question');
            const questionNum = question.getAttribute('data-question');
            const value = this.getAttribute('data-value');
            
            // Remove selected class from siblings
            question.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Store answer
            answers[questionNum] = value;
            
            // Move to next question after delay
            setTimeout(() => {
                if (currentQuestion < 3) {
                    question.classList.remove('active');
                    currentQuestion++;
                    
                    const nextQuestion = document.querySelector(`[data-question="${currentQuestion}"]`);
                    if (nextQuestion) {
                        nextQuestion.classList.add('active');
                        updateQuizDots();
                    }
                } else {
                    // Show results
                    showQuizResults();
                }
            }, 800);
        });
    });
    
    function updateQuizDots() {
        quizDots.forEach((dot, index) => {
            if (index < currentQuestion) {
                dot.classList.add('bg-orange-600');
                dot.classList.remove('bg-gray-300');
            }
        });
    }
    
    function showQuizResults() {
        const resultContent = document.getElementById('result-content');
        const recommendation = getRecommendation(answers);
        
        // Hide all questions
        quizQuestions.forEach(q => q.classList.remove('active'));
        
        // Show results
        resultContent.innerHTML = `
            <div class="text-center">
                <div class="text-6xl mb-6">${recommendation.emoji}</div>
                <h4 class="text-2xl font-bold mb-4 text-orange-600">${recommendation.title}</h4>
                <p class="text-lg mb-6 text-gray-700">${recommendation.description}</p>
                <div class="bg-white p-6 rounded-xl shadow-lg">
                    <h5 class="font-bold mb-3">Recommended Package:</h5>
                    <div class="flex items-center justify-between">
                        <div>
                            <h6 class="font-semibold">${recommendation.package}</h6>
                            <p class="text-gray-600">${recommendation.duration} • ${recommendation.price}</p>
                        </div>
                        <button class="btn-primary px-6 py-2 rounded-full font-medium" onclick="window.location.href='destinations.html'">
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        quizResults.classList.remove('hidden');
        
        // Animate results
        anime({
            targets: '#quiz-results',
            opacity: [0, 1],
            translateY: [50, 0],
            duration: 800,
            easing: 'easeOutQuart'
        });
    }
    
    function getRecommendation(answers) {
        const recommendations = {
            'small-extreme-budget': {
                emoji: '🏔️',
                title: 'Extreme Mountain Explorer',
                description: 'You crave intense challenges with your closest friends, seeking adrenaline without breaking the bank.',
                package: 'Desert Off-Road Adventure',
                duration: '8 Days',
                price: '$4,800'
            },
            'large-extreme-luxury': {
                emoji: '⚡',
                title: 'Elite Adventure Commander',
                description: 'You want the ultimate extreme experience with your full squad, where money is no object.',
                package: 'Extreme Sports Marathon',
                duration: '12 Days',
                price: '$9,500'
            },
            'small-cultural-premium': {
                emoji: '🏛️',
                title: 'Cultural Explorer',
                description: 'You value authentic experiences and cultural immersion with a small group of friends.',
                package: 'Bhutan Snowman Trek',
                duration: '10 Days',
                price: '$6,200'
            },
            'large-luxury-luxury': {
                emoji: '🏝️',
                title: 'Luxury Adventure Leader',
                description: 'You want premium experiences with your entire crew in the most exclusive settings.',
                package: 'Private Island Retreat',
                duration: '7 Days',
                price: '$12,000'
            }
        };
        
        // Default recommendation based on most common patterns
        const answerKey = `${answers['1']}-${answers['2']}-${answers['3']}`;
        return recommendations[answerKey] || recommendations['large-extreme-luxury'];
    }
    
    // Make restartQuiz globally available
    window.restartQuiz = function() {
        currentQuestion = 1;
        answers = {};
        
        // Reset UI
        quizResults.classList.add('hidden');
        quizQuestions.forEach((q, index) => {
            q.classList.remove('active');
            if (index === 0) q.classList.add('active');
        });
        
        quizOptions.forEach(option => {
            option.classList.remove('selected');
        });
        
        quizDots.forEach((dot, index) => {
            if (index === 0) {
                dot.classList.add('bg-orange-600');
                dot.classList.remove('bg-gray-300');
            } else {
                dot.classList.remove('bg-orange-600');
                dot.classList.add('bg-gray-300');
            }
        });
    };
}

// Initialize carousel
function initializeCarousel() {
    const carousel = document.getElementById('adventure-carousel');
    if (carousel) {
        new Splide(carousel, {
            type: 'loop',
            perPage: 1,
            perMove: 1,
            gap: '2rem',
            autoplay: true,
            interval: 5000,
            pauseOnHover: true,
            arrows: false,
            pagination: true,
            breakpoints: {
                768: {
                    perPage: 1,
                    gap: '1rem'
                }
            }
        }).mount();
    }
}

// Initialize animations
function initializeAnimations() {
    // Animate destination cards on hover
    const destinationCards = document.querySelectorAll('.destination-card');
    
    destinationCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.02,
                rotateY: 5,
                duration: 300,
                easing: 'easeOutQuart'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                rotateY: 0,
                duration: 300,
                easing: 'easeOutQuart'
            });
        });
    });
    
    // Animate buttons on hover
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.05,
                duration: 200,
                easing: 'easeOutQuart'
            });
        });
        
        button.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 200,
                easing: 'easeOutQuart'
            });
        });
    });
    
    // Add click handlers for adventure cards
    destinationCards.forEach(card => {
        const learnMoreBtn = card.querySelector('button');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const packageName = card.querySelector('h3').textContent;
                const packagePrice = card.querySelector('.text-orange-600').textContent;
                
                // Create modal or redirect to booking page
                showPackageModal(packageName, packagePrice);
            });
        }
    });
}

// Show package modal
function showPackageModal(packageName, packagePrice) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-md w-full transform scale-95 opacity-0 transition-all duration-300">
            <h3 class="text-2xl font-bold mb-4 text-center">${packageName}</h3>
            <p class="text-gray-600 mb-6 text-center">Starting from ${packagePrice} per person</p>
            <div class="space-y-4 mb-6">
                <div class="flex items-center space-x-3">
                    <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <span>Expert local guides</span>
                </div>
                <div class="flex items-center space-x-3">
                    <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <span>Premium equipment included</span>
                </div>
                <div class="flex items-center space-x-3">
                    <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <span>24/7 support during trip</span>
                </div>
            </div>
            <div class="flex space-x-4">
                <button class="btn-primary flex-1 py-3 rounded-full font-semibold" onclick="window.location.href='contact.html'">
                    Book Now
                </button>
                <button class="border-2 border-gray-300 text-gray-700 flex-1 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors" onclick="closeModal()">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate modal in
    setTimeout(() => {
        const modalContent = modal.querySelector('.bg-white');
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
    
    // Close modal on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Make closeModal globally available
    window.closeModal = function() {
        const modalContent = modal.querySelector('.bg-white');
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
        
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    };
}

// Add scroll-triggered parallax effect
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-bg');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add loading animation
window.addEventListener('load', function() {
    // Hide loading screen if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
    
    // Animate hero elements
    anime.timeline({
        easing: 'easeOutExpo',
        duration: 1000
    })
    .add({
        targets: '.hero-bg .relative',
        opacity: [0, 1],
        translateY: [50, 0],
        delay: 300
    })
    .add({
        targets: '.floating-element',
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 800,
        delay: anime.stagger(200)
    }, '-=500');
});

// Add smooth page transitions
document.querySelectorAll('a[href$=".html"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        
        // Add exit animation
        anime({
            targets: 'body',
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInQuart',
            complete: () => {
                window.location.href = href;
            }
        });
    });
});

// Add entrance animation for new pages
window.addEventListener('pageshow', function() {
    anime({
        targets: 'body',
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutQuart'
    });
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimization
const optimizedScrollHandler = throttle(function() {
    // Handle scroll events efficiently
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could implement error reporting here
});

// Service worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}