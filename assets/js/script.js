const menuButton = document.getElementById("menu-button");
const menu = document.getElementById("menu");
const header = document.querySelector(".app-header");
const menuBars = document.querySelectorAll(".bar");

/**
 * Toggle mobile menu visibility
 */
const toggleMenu = () => {
    menu.classList.toggle("active");
    
    // Animate hamburger icon
    const animations = ['animation-first-bar', 'animation-second-bar', 'animation-third-bar'];
    menuBars.forEach((bar, index) => {
        bar.classList.toggle(animations[index]);
    });
};

/**
 * Handle header style on scroll
 */
const handleScroll = () => {
    if (window.scrollY > 50) {
        header.style.padding = "10px 5%";
        header.style.background = "rgba(255, 255, 255, 0.95)";
        header.style.boxShadow = "var(--shadow-md)";
    } else {
        header.style.padding = "0 5%";
        header.style.background = "rgba(255, 255, 255, 0.8)";
        header.style.boxShadow = "var(--shadow-sm)";
    }
};

/**
 * Smooth scroll for navigation links
 */
const setupSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close menu if open (mobile)
                if (menu.classList.contains("active")) {
                    toggleMenu();
                }
                
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
};

// Event Listeners
menuButton.addEventListener('click', toggleMenu);
window.addEventListener('scroll', handleScroll);
document.addEventListener('DOMContentLoaded', setupSmoothScroll);