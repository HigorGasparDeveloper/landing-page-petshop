/**
 * ==========================================================================
 * PETHAVEN PREMIUM - APPLICATION CONTROLLER (SOLID / OOP Architecture)
 * ==========================================================================
 */

/**
 * Class representing the Scroll Reveal Animation Manager
 * Responsibility: Handle viewport intersection observer and apply reveal classes.
 */
class ScrollRevealObserver {
    constructor(targetSelector = '.reveal', activeClass = 'active') {
        this.targetSelector = targetSelector;
        this.activeClass = activeClass;
        this.observer = null;
    }

    /**
     * Initialize the IntersectionObserver with optimized parameters
     */
    init() {
        const targets = document.querySelectorAll(this.targetSelector);
        if (targets.length === 0) return;

        const observerOptions = {
            root: null, // Viewport
            rootMargin: '0px 0px -60px 0px', // Trigger slightly before element is fully visible
            threshold: 0.1 // 10% element visibility
        };

        this.observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(this.activeClass);
                    // Unobserve after element is revealed to save browser resources
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        targets.forEach(target => this.observer.observe(target));
    }
}

/**
 * Class representing the Header and Mobile Navigation Interaction Manager
 * Responsibility: Toggle mobile menu state, manage header on scroll, and perform smooth scrolls.
 */
class NavigationHandler {
    constructor() {
        this.headerElement = document.getElementById('app-header');
        this.menuButton = document.getElementById('menu-button');
        this.menuNavigation = document.querySelector('.nav-desktop');
        this.menuLinks = document.querySelectorAll('a[href^="#"]');
        this.isScrolling = false;
    }

    /**
     * Bind events and initialize logic
     */
    init() {
        this.setupMobileMenu();
        this.setupScrollListener();
        this.setupSmoothScroll();
    }

    /**
     * Toggle Mobile Menu visibility and ARIA state
     */
    setupMobileMenu() {
        if (!this.menuButton || !this.menuNavigation) return;

        this.menuButton.addEventListener('click', () => {
            const isExpanded = this.menuButton.getAttribute('aria-expanded') === 'true';
            
            // Toggle DOM states
            this.menuButton.setAttribute('aria-expanded', !isExpanded);
            this.menuNavigation.classList.toggle('active');
        });

        // Close menu when clicking outside for better mobile UX
        document.addEventListener('click', (event) => {
            const isClickInside = this.headerElement.contains(event.target);
            if (!isClickInside && this.menuNavigation.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    /**
     * Close the mobile navigation drawer
     */
    closeMobileMenu() {
        this.menuButton.setAttribute('aria-expanded', 'false');
        this.menuNavigation.classList.remove('active');
    }

    /**
     * Monitor scrolling and toggle header styles with throttle to save CPU
     */
    setupScrollListener() {
        window.addEventListener('scroll', () => {
            if (!this.isScrolling) {
                window.requestAnimationFrame(() => {
                    this.handleHeaderScrollState();
                    this.isScrolling = false;
                });
                this.isScrolling = true;
            }
        }, { passive: true }); // Optimized scroll performance
    }

    /**
     * Apply scrolled styles based on window scroll position
     */
    handleHeaderScrollState() {
        if (!this.headerElement) return;

        if (window.scrollY > 40) {
            this.headerElement.classList.add('scrolled');
        } else {
            this.headerElement.classList.remove('scrolled');
        }
    }

    /**
     * Establish keyboard-accessible smooth scrolling for internal anchors
     */
    setupSmoothScroll() {
        this.menuLinks.forEach(anchor => {
            anchor.addEventListener('click', (event) => {
                event.preventDefault();
                
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;

                // Close mobile menu if open
                this.closeMobileMenu();

                // Smooth Scroll with exact offset alignment
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update keyboard focus to destination target for accessibility compliance
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus({ preventScroll: true });
            });
        });
    }
}

/**
 * Class representing the FAQ accordion interaction manager
 * Responsibility: Ensure only one details accordion is open at a time for cohesive reading UX.
 */
class FAQAccordionHandler {
    constructor(faqItemsSelector = 'details.faq-item') {
        this.faqItemsSelector = faqItemsSelector;
    }

    /**
     * Initialize accordion single-open behavior
     */
    init() {
        const accordionItems = document.querySelectorAll(this.faqItemsSelector);
        if (accordionItems.length === 0) return;

        accordionItems.forEach(currentAccordion => {
            currentAccordion.addEventListener('toggle', (event) => {
                // Only act when accordion is opened
                if (currentAccordion.open) {
                    accordionItems.forEach(otherAccordion => {
                        if (otherAccordion !== currentAccordion && otherAccordion.open) {
                            otherAccordion.removeAttribute('open');
                        }
                    });
                }
            });
        });
    }
}

/**
 * Application Bootstrap orchestrator
 * Responsibility: Initialize all sub-controllers safely.
 */
class ApplicationBootstrap {
    static run() {
        document.addEventListener('DOMContentLoaded', () => {
            try {
                // Initialize Scroll Animation Reveal Observer
                const revealObserver = new ScrollRevealObserver();
                revealObserver.init();

                // Initialize Navigation Interaction controller
                const navigation = new NavigationHandler();
                navigation.init();

                // Initialize FAQ Accordion manager
                const faqAccordion = new FAQAccordionHandler();
                faqAccordion.init();
                
                console.log('PetHaven Premium Application successfully initialized.');
            } catch (error) {
                console.error('Fatal initialization error:', error);
            }
        });
    }
}

// Launch application execution
ApplicationBootstrap.run();