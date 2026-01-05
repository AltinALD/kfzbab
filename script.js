// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking on a link
const links = navLinks.querySelectorAll('a');
links.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Show/hide sticky call button on scroll
let lastScroll = 0;
const stickyCallBtn = document.getElementById('stickyCallBtn');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Show button after scrolling down a bit
    if (currentScroll > 300) {
        stickyCallBtn.style.opacity = '1';
        stickyCallBtn.style.visibility = 'visible';
    } else {
        stickyCallBtn.style.opacity = '0';
        stickyCallBtn.style.visibility = 'hidden';
    }
    
    lastScroll = currentScroll;
});

// Initialize sticky button as hidden
stickyCallBtn.style.opacity = '0';
stickyCallBtn.style.visibility = 'hidden';
stickyCallBtn.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';

// Hero Slideshow with fade effect
const heroImages = [
    'images/hero1.jpg',
    'images/hero2.jpg',
    'images/hero3.jpg',
    'images/hero4.jpg'
];

let heroIndex = 0;
let isChanging = false;
const heroSlideshow = document.querySelector('.hero-slideshow');

// Check if mobile device
const isMobile = window.innerWidth <= 768;

// Preload all images to avoid flash and ensure smooth transitions
const imagePromises = heroImages.map(src => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
    });
});

// Wait for all images to load before starting slideshow
Promise.all(imagePromises).then(() => {
    // Set the first image immediately
    if (heroSlideshow) {
        heroSlideshow.style.backgroundImage = `url('${heroImages[heroIndex]}')`;
        heroSlideshow.style.opacity = '1';
        
        // Start slideshow after a delay
        setTimeout(() => {
            startSlideshow();
        }, 4000); // Show first image for 4 seconds
    }
}).catch(error => {
    console.warn('Some hero images failed to load:', error);
    // Still set first image even if others fail
    if (heroSlideshow && heroImages[0]) {
        heroSlideshow.style.backgroundImage = `url('${heroImages[0]}')`;
        heroSlideshow.style.opacity = '1';
    }
});

function changeHeroBackground() {
    if (isChanging || !heroSlideshow) return;
    
    isChanging = true;
    
    // Fade out current image
    heroSlideshow.style.opacity = '0';
    
    setTimeout(() => {
        // Change background image during the fade
        heroSlideshow.style.backgroundImage = `url('${heroImages[heroIndex]}')`;
        
        // Small delay to ensure image starts loading
        requestAnimationFrame(() => {
            // Fade in new image
            heroSlideshow.style.opacity = '1';
            
            // Move to next image
            heroIndex = (heroIndex + 1) % heroImages.length;
            
            isChanging = false;
        });
    }, 400); // Half of transition duration for smoother effect
}

function startSlideshow() {
    if (!heroSlideshow) return;
    
    // Change slides every 5 seconds (adjust as needed)
    setInterval(() => {
        changeHeroBackground();
    }, 5000);
}

// Handle window resize for mobile/desktop detection
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Force re-render of background on orientation change (mobile)
        if (heroSlideshow && heroImages[heroIndex]) {
            const currentSrc = heroSlideshow.style.backgroundImage;
            heroSlideshow.style.backgroundImage = 'none';
            requestAnimationFrame(() => {
                heroSlideshow.style.backgroundImage = currentSrc;
            });
        }
    }, 250);
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>⏳</span> Wird gesendet...';
        formMessage.style.display = 'none';
        
        try {
            // Try to submit via PHP (if available)
            const response = await fetch('send-email.php', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    showFormMessage('Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.', 'success');
                    contactForm.reset();
                } else {
                    throw new Error(result.message || 'Fehler beim Senden');
                }
            } else {
                throw new Error('Server-Fehler');
            }
        } catch (error) {
            // Fallback: Show form data in console (for development)
            console.log('Form Data:', formObject);
            console.log('Form submission error:', error);
            
            // Show success message anyway (for demo purposes)
            // In production, remove this and handle the error properly
            showFormMessage('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.', 'success');
            contactForm.reset();
            
            // Uncomment below to show actual error:
            // showFormMessage('Fehler beim Senden der Nachricht. Bitte versuchen Sie es später erneut oder rufen Sie uns an.', 'error');
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// Improve mobile menu handling
document.addEventListener('DOMContentLoaded', function() {
    // Prevent body scroll when menu is open on mobile
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            const isActive = navLinks.classList.contains('active');
            document.body.style.overflow = isActive ? '' : 'hidden';
        });
        
        // Re-enable scroll when menu closes
        const menuLinks = navLinks.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                document.body.style.overflow = '';
            });
        });
        
        // Re-enable scroll when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                document.body.style.overflow = '';
            }
        });
    }
});
