// Portfolio JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Navigation functionality
    const navbar = document.getElementById('navbar');
    const navMenu = document.getElementById('nav-menu');
    const navHamburger = document.getElementById('nav-hamburger');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navHamburger && navMenu) {
        navHamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navHamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) navMenu.classList.remove('active');
            if (navHamburger) navHamburger.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navbar && !navbar.contains(event.target)) {
            if (navMenu) navMenu.classList.remove('active');
            if (navHamburger) navHamburger.classList.remove('active');
        }
    });

    // Smooth scrolling for navigation links - COMPLETELY REWRITTEN
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const href = this.getAttribute('href');
            console.log('Navigation clicked:', href); // Debug log
            
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1); // Remove the #
                const targetSection = document.getElementById(targetId);
                
                console.log('Target section:', targetSection); // Debug log
                
                if (targetSection) {
                    // Calculate offset
                    const navbarHeight = navbar ? navbar.offsetHeight : 80;
                    const elementPosition = targetSection.offsetTop;
                    const offsetPosition = elementPosition - navbarHeight - 20;
                    
                    console.log('Scrolling to:', offsetPosition); // Debug log
                    
                    // Scroll to the section
                    window.scrollTo({
                        top: Math.max(0, offsetPosition),
                        behavior: 'smooth'
                    });
                    
                    // Update active state immediately
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    this.classList.add('active');
                } else {
                    console.log('Section not found:', targetId); // Debug log
                }
            }
        });
    });

    // Active navigation link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 120;

        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });

        if (currentSection) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }
    }

    // Contact form handling - COMPLETELY REWRITTEN
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        // Add real-time validation
        const formFields = contactForm.querySelectorAll('.form-control');
        formFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                // Clear error styling when user starts typing
                this.style.borderColor = '';
                const errorMsg = this.parentNode.querySelector('.field-error');
                if (errorMsg) {
                    errorMsg.remove();
                }
            });
        });

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            console.log('Form submitted'); // Debug log
            
            // Clear all previous error messages
            clearAllErrors();
            
            // Get form data
            const name = contactForm.querySelector('#name').value.trim();
            const email = contactForm.querySelector('#email').value.trim();
            const subject = contactForm.querySelector('#subject').value.trim();
            const message = contactForm.querySelector('#message').value.trim();
            
            console.log('Form data:', { name, email, subject, message }); // Debug log
            
            // Validation
            let hasErrors = false;
            
            if (!name) {
                showFieldError('name', 'Name is required');
                hasErrors = true;
            }
            
            if (!email) {
                showFieldError('email', 'Email is required');
                hasErrors = true;
            } else if (!isValidEmail(email)) {
                showFieldError('email', 'Please enter a valid email address');
                hasErrors = true;
            }
            
            if (!subject) {
                showFieldError('subject', 'Subject is required');
                hasErrors = true;
            }
            
            if (!message) {
                showFieldError('message', 'Message is required');
                hasErrors = true;
            }
            
            console.log('Has errors:', hasErrors); // Debug log
            
            if (hasErrors) {
                showGeneralMessage('Please correct the errors above and try again.', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                showGeneralMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
                contactForm.reset();
                clearAllErrors();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }

    // Form validation helpers
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name');
        
        clearFieldError(field);
        
        if (!value) {
            showFieldError(fieldName, `${capitalize(fieldName)} is required`);
            return false;
        }
        
        if (fieldName === 'email' && !isValidEmail(value)) {
            showFieldError(fieldName, 'Please enter a valid email address');
            return false;
        }
        
        return true;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFieldError(fieldName, message) {
        const field = document.querySelector(`#${fieldName}`) || document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.style.borderColor = 'var(--color-error)';
            field.style.borderWidth = '2px';
            
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            errorElement.style.cssText = `
                color: var(--color-error);
                font-size: var(--font-size-sm);
                margin-top: var(--space-6);
                font-weight: var(--font-weight-medium);
            `;
            
            field.parentNode.appendChild(errorElement);
        }
    }

    function clearFieldError(field) {
        field.style.borderColor = '';
        field.style.borderWidth = '';
        const errorMsg = field.parentNode.querySelector('.field-error');
        if (errorMsg) {
            errorMsg.remove();
        }
    }

    function clearAllErrors() {
        document.querySelectorAll('.field-error').forEach(el => el.remove());
        document.querySelectorAll('.general-message').forEach(el => el.remove());
        
        contactForm.querySelectorAll('.form-control').forEach(field => {
            field.style.borderColor = '';
            field.style.borderWidth = '';
        });
    }

    function showGeneralMessage(message, type) {
        // Remove existing general messages
        document.querySelectorAll('.general-message').forEach(el => el.remove());
        
        const messageElement = document.createElement('div');
        messageElement.className = `general-message status status--${type}`;
        messageElement.textContent = message;
        messageElement.style.marginTop = 'var(--space-16)';
        messageElement.style.fontSize = 'var(--font-size-sm)';
        
        contactForm.parentNode.insertBefore(messageElement, contactForm.nextSibling);
        
        if (type === 'success') {
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 5000);
        }
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Scroll event listener with throttling
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateActiveNavLink();
                updateNavbarBackground();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Navbar background opacity on scroll
    function updateNavbarBackground() {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.backgroundColor = 'rgba(252, 252, 249, 0.98)';
                navbar.style.backdropFilter = 'blur(15px)';
            } else {
                navbar.style.backgroundColor = 'rgba(252, 252, 249, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            }
        }
    }

    // Handle placeholder links
    const placeholderLinks = document.querySelectorAll('a[href="#"]');
    placeholderLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const linkText = this.textContent.trim();
            let message = '';
            
            if (linkText.includes('Download Resume') || linkText.includes('Resume')) {
                message = 'Resume download would be available in the full version of this portfolio.';
            } else if (this.querySelector('[data-lucide="github"]') || linkText.includes('GitHub')) {
                message = 'GitHub repository links would be available in the live version.';
            } else {
                message = 'This is a demo link. In a real portfolio, this would open the actual resource.';
            }
            
            showToast(message);
        });
    });

    // Toast notification system
    function showToast(message) {
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: var(--color-surface);
            color: var(--color-text);
            padding: var(--space-12) var(--space-16);
            border-radius: var(--radius-base);
            border: 1px solid var(--color-border);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            max-width: 320px;
            font-size: var(--font-size-sm);
            transform: translateX(100%);
            transition: transform var(--duration-normal) var(--ease-standard);
            line-height: 1.4;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);

        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 4000);
    }

    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Hero content animation
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-tagline, .hero-buttons, .social-links');
    heroElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 200 + (index * 150));
    });

    // Profile image animation
    const profilePlaceholder = document.querySelector('.profile-placeholder');
    if (profilePlaceholder) {
        profilePlaceholder.style.opacity = '0';
        profilePlaceholder.style.transform = 'scale(0.8)';
        profilePlaceholder.style.transition = 'all 1s ease';
        
        setTimeout(() => {
            profilePlaceholder.style.opacity = '1';
            profilePlaceholder.style.transform = 'scale(1)';
        }, 800);
    }

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (navMenu) navMenu.classList.remove('active');
            if (navHamburger) navHamburger.classList.remove('active');
        }
    });

    // Initialize
    updateActiveNavLink();
    
    console.log('Portfolio website loaded successfully!');
    console.log('Available sections:', Array.from(document.querySelectorAll('section[id]')).map(s => s.id));
});

// Initialize EmailJS
(function() {
    emailjs.init("OzemafLITf_VyJ8XX"); // Replace with your public key
})();

// Handle form submission
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("contact-form").addEventListener("submit", function(e) {
        e.preventDefault();

        emailjs.sendForm("service_iqtmvg6", "template_9tn5ppo", this)
            .then(function() {
                alert("Message sent successfully!");
                document.getElementById("contact-form").reset();
            }, function(error) {
                console.error("EmailJS Error:", error);
                alert("Failed to send message. Please try again.");
            });
    });
});
