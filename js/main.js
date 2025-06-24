// Portfolio Application JavaScript
class PortfolioApp {
    constructor() {
        this.currentRoute = 'about';
        this.blogPosts = [];
        this.currentPage = 1;
        this.postsPerPage = 5;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadBlogPosts();
        this.handleInitialRoute();
        this.initializeFeatherIcons();
    }

    setupEventListeners() {
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = e.target.getAttribute('data-route');
                if (route) {
                    this.navigateTo(route);
                }
            });
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.handleRouteChange();
        });

        // Handle internal blog navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-route]')) {
                e.preventDefault();
                const route = e.target.getAttribute('data-route');
                this.navigateTo(route);
            }
        });

        // Print functionality
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                if (this.currentRoute === 'resume') {
                    e.preventDefault();
                    window.print();
                }
            }
        });
    }

    handleInitialRoute() {
        const hash = window.location.hash.substring(1);
        const validRoutes = ['about', 'blog', 'resume'];
        
        if (hash && validRoutes.includes(hash)) {
            this.navigateTo(hash, false);
        } else {
            this.navigateTo('about', false);
        }
    }

    navigateTo(route, updateHistory = true) {
        if (route === this.currentRoute) return;

        // Update URL
        if (updateHistory) {
            history.pushState({ route }, '', `#${route}`);
        }

        // Update navigation
        this.updateNavigation(route);
        
        // Show section with animation
        this.showSection(route);
        
        this.currentRoute = route;

        // Load content if needed
        if (route === 'blog' && this.blogPosts.length === 0) {
            this.loadBlogPosts();
        }
    }

    handleRouteChange() {
        const hash = window.location.hash.substring(1) || 'about';
        this.navigateTo(hash, false);
    }

    updateNavigation(activeRoute) {
        document.querySelectorAll('.nav-link').forEach(link => {
            const route = link.getAttribute('data-route');
            if (route === activeRoute) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    showSection(route) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section with delay for smooth transition
        setTimeout(() => {
            const targetSection = document.getElementById(`${route}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    async loadBlogPosts() {
        try {
            const response = await fetch('blog/posts.json');
            if (!response.ok) {
                throw new Error('Failed to load blog posts');
            }
            
            this.blogPosts = await response.json();
            this.renderBlogPosts();
        } catch (error) {
            console.error('Error loading blog posts:', error);
            this.renderBlogError();
        }
    }

    renderBlogPosts() {
        const blogContainer = document.getElementById('blog-posts');
        if (!blogContainer) return;

        if (this.blogPosts.length === 0) {
            this.renderBlogEmpty();
            return;
        }

        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const postsToShow = this.blogPosts.slice(startIndex, endIndex);

        const blogHTML = postsToShow.map(post => `
            <article class="blog-post" onclick="this.openBlogPost('${post.id}')">
                <h2 class="blog-post-title">${this.escapeHtml(post.title)}</h2>
                <div class="blog-post-meta">
                    <span>Published on ${this.formatDate(post.date)}</span>
                </div>
                <p class="blog-post-excerpt">${this.escapeHtml(post.excerpt)}</p>
            </article>
        `).join('');

        blogContainer.innerHTML = blogHTML;
        this.renderPagination();
    }

    renderBlogEmpty() {
        const blogContainer = document.getElementById('blog-posts');
        blogContainer.innerHTML = `
            <div class="empty-state">
                <h3>No Blog Posts Yet</h3>
                <p>Blog posts will appear here once they are published.</p>
            </div>
        `;
    }

    renderBlogError() {
        const blogContainer = document.getElementById('blog-posts');
        blogContainer.innerHTML = `
            <div class="empty-state">
                <h3>Unable to Load Blog Posts</h3>
                <p>There was an error loading the blog posts. Please try again later.</p>
            </div>
        `;
    }

    renderPagination() {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(this.blogPosts.length / this.postsPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '<div class="pagination-controls">';
        
        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `
                <button class="btn btn-secondary" onclick="portfolioApp.changePage(${this.currentPage - 1})">
                    Previous
                </button>
            `;
        }

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const isActive = i === this.currentPage ? 'btn-primary' : 'btn-secondary';
            paginationHTML += `
                <button class="btn ${isActive}" onclick="portfolioApp.changePage(${i})">
                    ${i}
                </button>
            `;
        }

        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `
                <button class="btn btn-secondary" onclick="portfolioApp.changePage(${this.currentPage + 1})">
                    Next
                </button>
            `;
        }

        paginationHTML += '</div>';
        paginationContainer.innerHTML = paginationHTML;
    }

    changePage(page) {
        this.currentPage = page;
        this.renderBlogPosts();
        
        // Scroll to blog posts
        document.getElementById('blog-posts').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    openBlogPost(postId) {
        // This would typically open a detailed view of the blog post
        // For now, we'll just show an alert
        const post = this.blogPosts.find(p => p.id === postId);
        if (post) {
            alert(`This would open the full blog post: "${post.title}"`);
        }
    }

    formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    initializeFeatherIcons() {
        // Initialize Feather icons after DOM content is loaded
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    // Utility method to handle smooth scrolling for internal links
    smoothScrollTo(targetId) {
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Method to handle contact form submissions (if added later)
    handleContactForm(formData) {
        // This would handle contact form submission
        console.log('Contact form submitted:', formData);
    }

    // Method to toggle theme (if dark mode is added later)
    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    }

    // Method to load saved theme preference
    loadThemePreference() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

// Additional utility functions for enhanced functionality

// Lazy loading for images (if added later)
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Scroll-triggered animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.project-card, .goal-item, .blog-post').forEach(el => {
        observer.observe(el);
    });
}

// Performance monitoring
function trackPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`Page load time: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
        });
    }
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', () => {
    setupScrollAnimations();
    trackPerformance();
});

// Service Worker registration for PWA capabilities (if added later)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}
