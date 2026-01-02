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
