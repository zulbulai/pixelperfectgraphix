class PixelPerfectGraphix {
    constructor() {
        this.currentStep = 1;
        this.selectedPlan = 'quarterly';
        this.currentTestimonial = 0;
        this.testimonialInterval = null;
        this.countdownInterval = null;
        this.isMenuOpen = false;
        
        this.planPrices = {
            monthly: { price: 49, period: 'month', savings: 0, originalPrice: 49 },
            quarterly: { price: 99, period: '3 months', savings: 48, originalPrice: 147 },
            annual: { price: 299, period: 'year', savings: 289, originalPrice: 588 }
        };
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApp());
        } else {
            this.setupApp();
        }
    }

    setupApp() {
        this.setupEventListeners();
        this.setupStickyHeader();
        this.setupHamburgerMenu();
        this.setupCounterAnimations();
        this.setupTemplateFilters();
        this.setupTestimonialCarousel();
        this.setupFAQAccordion();
        this.setupModalHandlers();
        this.setupFormValidation();
        this.setupScrollAnimations();
        this.setupSmoothScrolling();
        this.startCountdownTimer();
        this.setupPaymentHandling();
        
        console.log('PixelPerfect Graphix - Advanced subscription website loaded! 🎨');
    }

    setupEventListeners() {
        // Global click handlers
        document.addEventListener('click', (e) => {
            // Close menu when clicking outside
            if (this.isMenuOpen && !e.target.closest('.slide-menu') && !e.target.closest('.menu-toggle')) {
                this.closeMenu();
            }
        });

        // Keyboard handlers
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeTemplateModal();
                if (this.isMenuOpen) {
                    this.closeMenu();
                }
            }
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }

    setupStickyHeader() {
        const header = document.getElementById('header');
        if (!header) return;

        let lastScrollY = window.scrollY;
        
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial call
    }

    setupHamburgerMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const menuClose = document.getElementById('menuClose');
        const slideMenu = document.getElementById('slideMenu');
        const menuOverlay = document.getElementById('menuOverlay');

        if (menuToggle) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });
        }

        if (menuClose) {
            menuClose.addEventListener('click', () => {
                this.closeMenu();
            });
        }

        if (menuOverlay) {
            menuOverlay.addEventListener('click', () => {
                this.closeMenu();
            });
        }

        // Menu link clicks
        document.querySelectorAll('.menu-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                this.closeMenu();
                
                setTimeout(() => {
                    const element = document.querySelector(target);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 300);
            });
        });
    }

    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const slideMenu = document.getElementById('slideMenu');
        const menuOverlay = document.getElementById('menuOverlay');

        this.isMenuOpen = true;
        menuToggle?.classList.add('active');
        slideMenu?.classList.add('active');
        menuOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const slideMenu = document.getElementById('slideMenu');
        const menuOverlay = document.getElementById('menuOverlay');

        this.isMenuOpen = false;
        menuToggle?.classList.remove('active');
        slideMenu?.classList.remove('active');
        menuOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    setupCounterAnimations() {
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('animated');
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.stat-number[data-count]').forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2500;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                return;
            }
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
        };

        updateCounter();
    }

    setupTemplateFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const templateItems = document.querySelectorAll('.template-item');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const category = button.getAttribute('data-category');
                
                // Filter templates with animation
                templateItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    if (category === 'all' || itemCategory === category) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    setupTestimonialCarousel() {
        this.startTestimonialAutoplay();
    }

    startTestimonialAutoplay() {
        this.testimonialInterval = setInterval(() => {
            this.nextTestimonial();
        }, 5000);
    }

    stopTestimonialAutoplay() {
        if (this.testimonialInterval) {
            clearInterval(this.testimonialInterval);
        }
    }

    showTestimonial(index) {
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.dot');
        
        if (slides.length === 0) return;

        // Update current testimonial
        this.currentTestimonial = index;

        // Update slides
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // Restart autoplay
        this.stopTestimonialAutoplay();
        this.startTestimonialAutoplay();
    }

    nextTestimonial() {
        const slides = document.querySelectorAll('.testimonial-slide');
        const nextIndex = (this.currentTestimonial + 1) % slides.length;
        this.showTestimonial(nextIndex);
    }

    prevTestimonial() {
        const slides = document.querySelectorAll('.testimonial-slide');
        const prevIndex = this.currentTestimonial === 0 ? slides.length - 1 : this.currentTestimonial - 1;
        this.showTestimonial(prevIndex);
    }

    setupFAQAccordion() {
        document.querySelectorAll('.faq-question').forEach(button => {
            button.addEventListener('click', () => {
                const faqItem = button.closest('.faq-item');
                const isActive = faqItem.classList.contains('active');

                // Close all FAQ items
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });

                // Toggle current item
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
        });
    }

    setupModalHandlers() {
        // Subscription buttons
        document.querySelectorAll('button[onclick*="openModal"], button[onclick*="selectPlan"]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const onclick = button.getAttribute('onclick');
                if (onclick?.includes('selectPlan')) {
                    const match = onclick.match(/selectPlan\('([^']+)'\)/);
                    if (match) {
                        this.selectPlan(match[1]);
                    }
                } else {
                    this.openModal();
                }
            });
        });

        // Template preview buttons
        document.querySelectorAll('button[onclick*="previewTemplate"]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const onclick = button.getAttribute('onclick');
                const match = onclick.match(/previewTemplate\('([^']+)'\)/);
                if (match) {
                    this.previewTemplate(match[1]);
                }
            });
        });

        // Modal close handlers
        document.querySelectorAll('.modal-close').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
                this.closeTemplateModal();
            });
        });

        // Modal overlay clicks
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                    this.closeTemplateModal();
                }
            });
        });
    }

    openModal() {
        const modal = document.getElementById('subscriptionModal');
        if (!modal) return;

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Reset to first step
        this.currentStep = 1;
        this.updateModalStep();
        
        // Focus first input after animation
        setTimeout(() => {
            const firstInput = modal.querySelector('input[type="text"]');
            firstInput?.focus();
        }, 300);

        this.showNotification('💡 Choose your perfect plan and start creating amazing content!', 'info');
    }

    closeModal() {
        const modal = document.getElementById('subscriptionModal');
        if (!modal) return;

        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    selectPlan(planType) {
        this.selectedPlan = planType;
        
        // Update radio button
        const planRadio = document.querySelector(`input[name="plan"][value="${planType}"]`);
        if (planRadio) {
            planRadio.checked = true;
        }

        this.openModal();
        this.showNotification(`✅ ${this.getPlanDisplayName(planType)} selected! Complete your subscription.`, 'success');
    }

    getPlanDisplayName(planType) {
        const names = {
            monthly: 'Monthly Plan (₹49/month)',
            quarterly: 'Quarterly Plan (₹99/3 months) - Most Popular!',
            annual: 'Annual Plan (₹299/year) - Best Value!'
        };
        return names[planType] || names.monthly;
    }

    previewTemplate(templateId) {
        const modal = document.getElementById('templateModal');
        if (!modal) return;

        // Template data (in a real app, this would come from an API)
        const templates = {
            'instagram-1': {
                title: 'Modern Instagram Post Template',
                description: 'Perfect for business announcements, product launches, and brand updates. Clean, professional design that drives engagement.',
                category: 'Instagram Posts'
            },
            'facebook-1': {
                title: 'Professional Facebook Cover Template',
                description: 'Brand-focused Facebook cover design that makes a strong first impression and showcases your business professionally.',
                category: 'Facebook Covers'
            },
            'linkedin-1': {
                title: 'Corporate LinkedIn Banner Template',
                description: 'Professional networking banner perfect for executives and businesses looking to establish credibility.',
                category: 'LinkedIn Banners'
            },
            'story-1': {
                title: 'Engaging Story Template',
                description: 'Eye-catching story design perfect for daily posts, behind-the-scenes content, and customer engagement.',
                category: 'Stories'
            }
        };

        const template = templates[templateId] || templates['instagram-1'];
        
        // Update modal content
        document.getElementById('templateTitle').textContent = template.title;
        document.getElementById('templateDescription').textContent = template.description;
        document.getElementById('templatePreviewPlaceholder').textContent = `${template.category} Preview`;

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeTemplateModal() {
        const modal = document.getElementById('templateModal');
        if (!modal) return;

        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    updateModalStep() {
        // Update progress indicator
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            step.classList.toggle('active', index < this.currentStep);
        });

        // Show current step
        document.querySelectorAll('.modal-step').forEach((step, index) => {
            step.classList.toggle('active', index === this.currentStep - 1);
        });

        // Update order summary if on payment step
        if (this.currentStep === 3) {
            this.updateOrderSummary();
        }
    }

    nextStep() {
        if (this.currentStep === 1) {
            // Validate plan selection
            const selectedPlan = document.querySelector('input[name="plan"]:checked');
            if (!selectedPlan) {
                this.showNotification('Please select a plan to continue.', 'error');
                return;
            }
            this.selectedPlan = selectedPlan.value;
        } else if (this.currentStep === 2) {
            // Validate form
            if (!this.validateCurrentStep()) {
                return;
            }
        }

        this.currentStep = Math.min(3, this.currentStep + 1);
        this.updateModalStep();
    }

    prevStep() {
        this.currentStep = Math.max(1, this.currentStep - 1);
        this.updateModalStep();
    }

    validateCurrentStep() {
        const form = document.getElementById('subscriptionForm');
        if (!form) return true;

        const requiredFields = form.querySelectorAll('input[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            const value = field.value.trim();
            this.clearFieldError(field);

            if (!value) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else if (field.type === 'email' && !this.isValidEmail(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        });

        if (!isValid) {
            this.showNotification('Please fill in all required fields correctly.', 'error');
        }

        return isValid;
    }

    setupFormValidation() {
        const form = document.getElementById('subscriptionForm');
        if (!form) return;

        // Real-time validation
        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        this.clearFieldError(field);

        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }

        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Please enter a valid email address');
            return false;
        }

        field.classList.remove('error');
        return true;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        this.clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: var(--color-error);
            font-size: var(--font-size-sm);
            margin-top: var(--space-4);
            font-weight: var(--font-weight-medium);
        `;
        
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    updateOrderSummary() {
        const plan = this.planPrices[this.selectedPlan];
        const planNames = {
            monthly: 'Monthly Plan',
            quarterly: 'Quarterly Plan',
            annual: 'Annual Plan'
        };

        document.getElementById('selectedPlan').textContent = planNames[this.selectedPlan];
        document.getElementById('selectedPrice').textContent = `₹${plan.price}`;
        
        // Apply discount for first-time users
        const discountAmount = 20;
        const totalPrice = plan.price - discountAmount;
        document.getElementById('totalPrice').textContent = `₹${totalPrice}`;
    }

    setupPaymentHandling() {
        const paymentBtn = document.getElementById('paymentBtn');
        if (paymentBtn) {
            paymentBtn.addEventListener('click', () => {
                this.processPayment();
            });
        }
    }

    processPayment() {
        if (!this.validateCurrentStep()) {
            return;
        }

        const paymentBtn = document.getElementById('paymentBtn');
        paymentBtn.classList.add('loading');
        paymentBtn.disabled = true;

        // Get form data
        const formData = new FormData(document.getElementById('subscriptionForm'));
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            business: formData.get('business'),
            plan: this.selectedPlan
        };

        // Simulate payment processing
        setTimeout(() => {
            this.handlePaymentSuccess(userData);
            paymentBtn.classList.remove('loading');
            paymentBtn.disabled = false;
        }, 3000);

        this.showNotification('Processing your payment securely...', 'info');
    }

    handlePaymentSuccess(userData) {
        this.closeModal();
        
        const plan = this.getPlanDisplayName(userData.plan);
        this.showNotification(
            `🎉 Welcome to PixelPerfect Graphix! Your ${plan} is now active. Check your email for login details and access instructions.`,
            'success',
            8000
        );

        // Reset form
        document.getElementById('subscriptionForm')?.reset();
        this.currentStep = 1;

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Show success message in modal area (for demo purposes)
        this.showSuccessMessage(userData);
    }

    showSuccessMessage(userData) {
        // This would typically redirect to a success page or dashboard
        setTimeout(() => {
            alert(`🎉 Success!\n\nWelcome ${userData.name}!\nYour subscription is now active.\n\nLogin details have been sent to ${userData.email}\n\nYou can now access 5000+ premium templates!`);
        }, 1000);
    }

    startCountdownTimer() {
        let timeLeft = 24 * 60 * 60 - 1; // 23:59:59

        const updateTimer = () => {
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;

            const timerDisplay = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} left`;

            const timerElement = document.getElementById('countdown');
            if (timerElement) {
                timerElement.textContent = timerDisplay;
            }

            timeLeft--;

            if (timeLeft < 0) {
                timeLeft = 24 * 60 * 60 - 1; // Reset to 23:59:59
            }
        };

        updateTimer();
        this.countdownInterval = setInterval(updateTimer, 1000);
    }

    setupScrollAnimations() {
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements for scroll animations
        document.querySelectorAll('.template-item, .feature-card, .pricing-card, .benefit-item, .step-item').forEach(element => {
            observer.observe(element);
        });
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.getElementById('header')?.offsetHeight || 80;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    showNotification(message, type = 'info', duration = 5000) {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icons[type] || icons.info}</span>
                <span class="notification-text">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;

        // Add notification styles if not already present
        this.addNotificationStyles();

        document.body.appendChild(notification);

        // Show notification with animation
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, duration);
    }

    addNotificationStyles() {
        if (document.querySelector('#notification-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--color-surface);
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-lg);
                z-index: 3000;
                max-width: 400px;
                min-width: 300px;
                opacity: 0;
                transform: translateX(100%);
                transition: all var(--duration-normal) var(--ease-standard);
                overflow: hidden;
            }
            
            .notification.show {
                opacity: 1;
                transform: translateX(0);
            }
            
            .notification-success { border-left: 4px solid var(--color-success); }
            .notification-error { border-left: 4px solid var(--color-error); }
            .notification-info { border-left: 4px solid var(--color-primary); }
            .notification-warning { border-left: 4px solid var(--color-warning); }
            
            .notification-content {
                display: flex;
                align-items: flex-start;
                padding: var(--space-16);
                gap: var(--space-12);
            }
            
            .notification-icon {
                font-size: var(--font-size-xl);
                flex-shrink: 0;
                margin-top: 2px;
            }
            
            .notification-text {
                color: var(--color-text);
                font-size: var(--font-size-sm);
                line-height: var(--line-height-normal);
                flex-grow: 1;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: var(--font-size-xl);
                color: var(--color-text-secondary);
                cursor: pointer;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                flex-shrink: 0;
                transition: all var(--duration-fast) var(--ease-standard);
            }
            
            .notification-close:hover {
                background: var(--color-secondary);
                color: var(--color-text);
            }
            
            @media (max-width: 768px) {
                .notification {
                    right: var(--space-16);
                    left: var(--space-16);
                    max-width: none;
                    min-width: auto;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    // Cleanup method
    destroy() {
        if (this.testimonialInterval) {
            clearInterval(this.testimonialInterval);
        }
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    }
}

// Initialize the application
const app = new PixelPerfectGraphix();

// Global functions for backward compatibility and direct onclick handlers
window.openModal = () => app.openModal();
window.closeModal = () => app.closeModal();
window.selectPlan = (plan) => app.selectPlan(plan);
window.previewTemplate = (id) => app.previewTemplate(id);
window.closeTemplateModal = () => app.closeTemplateModal();
window.nextStep = () => app.nextStep();
window.prevStep = () => app.prevStep();
window.processPayment = () => app.processPayment();
window.showTestimonial = (index) => app.showTestimonial(index);
window.nextTestimonial = () => app.nextTestimonial();
window.prevTestimonial = () => app.prevTestimonial();

// Make app globally available for debugging
window.app = app;

// Performance and error handling
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
    console.log('✅ PixelPerfect Graphix - All features loaded and ready!');
});

// Touch device detection
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('touch-device');
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.message);
    // In production, you might want to send this to an error tracking service
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    app.destroy();
});

// Additional utility functions
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

// Lazy loading for better performance
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize lazy loading
setupLazyLoading();

console.log('🚀 PixelPerfect Graphix - Professional subscription website loaded successfully!');