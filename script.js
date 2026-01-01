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
