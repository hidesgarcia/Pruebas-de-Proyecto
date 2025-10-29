// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = this.querySelectorAll('span');
            if (mobileMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Course category filtering
    const categories = document.querySelectorAll('.category');
    const courseCards = document.querySelectorAll('.course-card');
    
    categories.forEach(category => {
        category.addEventListener('click', function() {
            // Remove active class from all categories
            categories.forEach(cat => cat.classList.remove('active'));
            
            // Add active class to clicked category
            this.classList.add('active');
            
            const categoryValue = this.getAttribute('data-category');
            
            // Filter courses
            courseCards.forEach(card => {
                if (categoryValue === 'all' || card.getAttribute('data-category') === categoryValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Testimonial slider
    const testimonialDots = document.querySelectorAll('.dot');
    const testimonialSlider = document.querySelector('.testimonial-slider');
    
    if (testimonialDots.length > 0 && testimonialSlider) {
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                // Remove active class from all dots
                testimonialDots.forEach(d => d.classList.remove('active'));
                
                // Add active class to clicked dot
                this.classList.add('active');
                
                // Scroll to corresponding testimonial
                const scrollAmount = index * 380; // 350px width + 30px gap
                testimonialSlider.scrollTo({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            });
        });
        
        // Auto-advance testimonials
        let currentTestimonial = 0;
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonialDots.length;
            testimonialDots[currentTestimonial].click();
        }, 5000);
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            if (searchTerm.length > 2) {
                // In a real implementation, this would make an API call
                // For now, we'll just log the search term
                console.log('Searching for:', searchTerm);
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
        }
    });
});