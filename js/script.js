// ===================================
// WWF Website — Shared JavaScript
// ===================================

// Mobile Menu Toggle
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.menu-toggle');
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
}

// Close mobile menu when a link is clicked
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            const navLinks = document.querySelector('.nav-links');
            const menuToggle = document.querySelector('.menu-toggle');
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.stat-item, .program-card, .mv-card, .testimonial-card, .gallery-item, .gallery-masonry-item, .team-card, .value-card, .report-card, .volunteer-card, .support-card, .faq-item, .timeline-item').forEach(el => {
        observer.observe(el);
    });

    // Counter animation for stats
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = counter.getAttribute('data-target');
                    if (!target) return;
                    const targetNum = parseInt(target.replace(/[^0-9]/g, ''));
                    const suffix = target.replace(/[0-9]/g, '');
                    let current = 0;
                    const increment = Math.ceil(targetNum / 60);
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= targetNum) {
                            current = targetNum;
                            clearInterval(timer);
                        }
                        counter.textContent = current.toLocaleString() + suffix;
                    }, 30);
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    // Scroll to top button
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        });
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // FAQ accordion
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');
            // Close all
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            // Open clicked (if it wasn't already open)
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ===================================
    // IMAGE CAROUSEL
    // ===================================
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');

    if (carouselTrack && prevBtn && nextBtn && dotsContainer) {
        const slides = carouselTrack.querySelectorAll('.carousel-slide');
        let currentSlide = 0;
        let autoPlayTimer = null;

        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        function goToSlide(index) {
            currentSlide = index;
            carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
            // Update dots
            dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            goToSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            goToSlide(currentSlide);
        }

        nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
        prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });

        // Auto-play
        function startAutoPlay() {
            autoPlayTimer = setInterval(nextSlide, 5000);
        }

        function resetAutoPlay() {
            clearInterval(autoPlayTimer);
            startAutoPlay();
        }

        startAutoPlay();

        // Pause on hover
        carouselTrack.closest('.carousel-wrapper').addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
        carouselTrack.closest('.carousel-wrapper').addEventListener('mouseleave', startAutoPlay);

        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;

        carouselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carouselTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
                resetAutoPlay();
            }
        }, { passive: true });
    }

    // ===================================
    // HERO CAROUSEL (Mobile — Auto-scroll)
    // ===================================
    const heroTrack = document.getElementById('heroCarouselTrack');
    const heroDots = document.getElementById('heroCarouselDots');

    if (heroTrack && heroDots) {
        const heroSlides = heroTrack.querySelectorAll('.hero-carousel-slide');
        let heroIndex = 0;
        let heroTimer = null;

        // Create dots
        heroSlides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('hero-carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.addEventListener('click', () => { heroGoTo(i); heroResetAuto(); });
            heroDots.appendChild(dot);
        });

        function heroGoTo(idx) {
            heroIndex = idx;
            heroTrack.style.transform = `translateX(-${heroIndex * 100}%)`;
            heroDots.querySelectorAll('.hero-carousel-dot').forEach((d, i) => {
                d.classList.toggle('active', i === heroIndex);
            });
        }

        function heroNext() {
            heroGoTo((heroIndex + 1) % heroSlides.length);
        }

        function heroStartAuto() {
            heroTimer = setInterval(heroNext, 3000);
        }

        function heroResetAuto() {
            clearInterval(heroTimer);
            heroStartAuto();
        }

        heroStartAuto();

        // Touch swipe support
        let hTouchStart = 0;
        heroTrack.addEventListener('touchstart', (e) => {
            hTouchStart = e.changedTouches[0].screenX;
        }, { passive: true });

        heroTrack.addEventListener('touchend', (e) => {
            const diff = hTouchStart - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) heroGoTo((heroIndex + 1) % heroSlides.length);
                else heroGoTo((heroIndex - 1 + heroSlides.length) % heroSlides.length);
                heroResetAuto();
            }
        }, { passive: true });
    }

    // ===================================
    // GALLERY FILTER TABS
    // ===================================
    const filterTabs = document.querySelectorAll('.gallery-tab');
    const galleryItems = document.querySelectorAll('.gallery-masonry-item');

    if (filterTabs.length > 0 && galleryItems.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filter = tab.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.classList.remove('hidden');
                        // Re-trigger animation
                        item.classList.remove('visible');
                        setTimeout(() => observer.observe(item), 50);
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ===================================
    // LIGHTBOX MODAL
    // ===================================
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    if (lightboxModal && galleryItems.length > 0) {
        let currentLightboxIndex = 0;
        let visibleItems = [];

        function updateVisibleItems() {
            visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
        }

        function openLightbox(index) {
            updateVisibleItems();
            currentLightboxIndex = index;
            const item = visibleItems[currentLightboxIndex];
            const img = item.querySelector('img');
            const overlay = item.querySelector('.gallery-overlay');

            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.textContent = overlay ? overlay.querySelector('h4').textContent : img.alt;
            lightboxModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        function lightboxNavigate(direction) {
            updateVisibleItems();
            currentLightboxIndex = (currentLightboxIndex + direction + visibleItems.length) % visibleItems.length;
            const item = visibleItems[currentLightboxIndex];
            const img = item.querySelector('img');
            const overlay = item.querySelector('.gallery-overlay');

            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.textContent = overlay ? overlay.querySelector('h4').textContent : img.alt;
        }

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                updateVisibleItems();
                const visibleIndex = visibleItems.indexOf(item);
                if (visibleIndex !== -1) {
                    openLightbox(visibleIndex);
                }
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', () => lightboxNavigate(-1));
        lightboxNext.addEventListener('click', () => lightboxNavigate(1));

        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightboxModal.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') lightboxNavigate(-1);
            if (e.key === 'ArrowRight') lightboxNavigate(1);
        });
    }
});
