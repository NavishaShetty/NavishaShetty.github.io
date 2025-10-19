// Portfolio Application JavaScript File

class PortfolioApp {
    constructor() {
        this.currentRoute = 'about';
        this.blogPosts = [];
        this.currentPage = 1;
        this.postsPerPage = 5;
        this.currentBlogPost = null;
        this.viewingBlogPost = false;
        
        // Data storage for content loaded from JSON
        this.projects = [];
        this.aboutData = {};
        this.goals = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAllContent(); 
        this.handleInitialRoute();
        this.initializeFeatherIcons();
    }

    // Load all content from JSON files
    async loadAllContent() {
        try {
            await Promise.all([
                this.loadProjects(),
                this.loadAboutData(),
                this.loadGoals(),
                this.loadBlogPosts()
            ]);
            this.renderAboutSection(); 
        } catch (error) {
            console.error('Error loading content:', error);
        }
    }

    async loadProjects() {
        try {
            const response = await fetch('content/projects.json');
            this.projects = await response.json();
            this.renderProjects();
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }

    async loadAboutData() {
        try {
            const response = await fetch('content/about.json');
            this.aboutData = await response.json();
        } catch (error) {
            console.error('Error loading about data:', error);
        }
    }

    async loadGoals() {
        try {
            const response = await fetch('content/goals.json');
            this.goals = await response.json();
            this.renderGoals();
        } catch (error) {
            console.error('Error loading goals:', error);
        }
    }

    renderAboutSection() {
        const heroTitle = document.querySelector('.hero-title');
        const heroDescription = document.querySelector('.hero-description');
        
        if (heroTitle && this.aboutData.title) {
            heroTitle.textContent = this.aboutData.title;
        }
        if (heroDescription && this.aboutData.description) {
            heroDescription.textContent = this.aboutData.description;
        }
    }

    renderProjects() {
        const projectsList = document.querySelector('.projects-list');
        if (!projectsList || this.projects.length === 0) return;

        const projectsHTML = this.projects.map(project => `
            <div class="project-card">
                <h3 class="project-name">${this.escapeHtml(project.name)}</h3>
                <p class="project-description">${this.escapeHtml(project.description)}</p>
                <div class="project-buttons">
                    ${project.github ? `
                        <a href="${project.github}" class="btn btn-primary" target="_blank">
                            <i data-feather="github"></i>
                            GitHub
                        </a>
                    ` : ''}
                    ${project.showBlogButton && project.blog ? `
                        <a href="#blog/${project.blog}" class="btn btn-secondary" onclick="event.preventDefault(); portfolioApp.navigateTo('blog'); setTimeout(() => portfolioApp.openBlogPost('${project.blog}'), 100);">
                            <i data-feather="edit"></i>
                            Blog
                        </a>
                    ` : ''}
                </div>
            </div>
        `).join('');

        projectsList.innerHTML = projectsHTML;
        this.initializeFeatherIcons();
    }

    renderGoals() {
        const goalsList = document.querySelector('.goals-list');
        if (!goalsList || this.goals.length === 0) return;

        const goalsHTML = this.goals.map(goal => `
            <div class="goal-item">
                <h3 class="goal-title">${this.escapeHtml(goal.title)}</h3>
                <p class="goal-description">${this.escapeHtml(goal.description)}</p>
            </div>
        `).join('');

        goalsList.innerHTML = goalsHTML;
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

        // Back to blog button
        document.getElementById('back-to-blog').addEventListener('click', () => {
            this.showBlogList();
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
        
        if (hash.startsWith('blog/')) {
            const postId = hash.substring(5);
            this.navigateTo('blog', false);
            setTimeout(() => {
                this.openBlogPost(postId);
            }, 500);
        } else if (hash && validRoutes.includes(hash)) {
            this.navigateTo(hash, false);
        } else {
            this.navigateTo('about', false);
        }
    }

    navigateTo(route, updateHistory = true) {
        if (route === this.currentRoute && !this.viewingBlogPost) return;

        if (route !== 'blog') {
            this.viewingBlogPost = false;
            this.currentBlogPost = null;
        }

        if (updateHistory) {
            history.pushState({ route }, '', `#${route}`);
        }

        this.updateNavigation(route);
        this.showSection(route);
        this.currentRoute = route;

        if (route === 'blog') {
            if (this.blogPosts.length === 0) {
                this.loadBlogPosts();
            } else {
                this.showBlogList();
            }
        }
    }

    handleRouteChange() {
        const hash = window.location.hash.substring(1) || 'about';
        
        if (hash.startsWith('blog/')) {
            const postId = hash.substring(5);
            if (this.currentRoute !== 'blog') {
                this.navigateTo('blog', false);
            }
            setTimeout(() => {
                this.openBlogPost(postId);
            }, 500);
        } else {
            this.navigateTo(hash, false);
        }
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
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        setTimeout(() => {
            const targetSection = document.getElementById(`${route}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
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
            console.log('Blog posts loaded:', this.blogPosts.length);
            this.renderBlogPosts();
            return Promise.resolve();
        } catch (error) {
            console.error('Error loading blog posts:', error);
            this.renderBlogError();
            return Promise.reject(error);
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
            <article class="blog-post" onclick="portfolioApp.openBlogPost('${post.id}')">
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
        
        if (this.currentPage > 1) {
            paginationHTML += `
                <button class="btn btn-secondary" onclick="portfolioApp.changePage(${this.currentPage - 1})">
                    Previous
                </button>
            `;
        }

        for (let i = 1; i <= totalPages; i++) {
            const isActive = i === this.currentPage ? 'btn-primary' : 'btn-secondary';
            paginationHTML += `
                <button class="btn ${isActive}" onclick="portfolioApp.changePage(${i})">
                    ${i}
                </button>
            `;
        }

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
        
        document.getElementById('blog-posts').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    openBlogPost(postId) {
        if (this.blogPosts.length === 0) {
            this.loadBlogPosts().then(() => {
                this.openBlogPost(postId);
            });
            return;
        }

        const post = this.blogPosts.find(p => p.id === postId);
        if (!post) {
            console.error('Blog post not found:', postId);
            console.log('Available posts:', this.blogPosts.map(p => p.id));
            return;
        }

        if (post.externalLink) {
            window.location.href = post.externalLink;
            return;
        }

        history.pushState({ route: 'blog', postId }, '', `#blog/${postId}`);

        this.currentBlogPost = post;
        this.viewingBlogPost = true;

        document.getElementById('blog-list-view').style.display = 'none';
        
        const blogPostView = document.getElementById('blog-post-view');
        blogPostView.style.display = 'block';

        document.getElementById('blog-post-title').textContent = post.title;
        document.getElementById('blog-post-meta').innerHTML = `
            <span>Published on ${this.formatDate(post.date)}</span>
            ${post.author ? `<span> • By ${this.escapeHtml(post.author)}</span>` : ''}
        `;
        
        const tagsContainer = document.getElementById('blog-post-tags');
        if (post.tags && post.tags.length > 0) {
            tagsContainer.innerHTML = post.tags.map(tag => 
                `<span class="blog-tag">${this.escapeHtml(tag)}</span>`
            ).join('');
        } else {
            tagsContainer.innerHTML = '';
        }

        this.loadBlogPostContent(post);

        this.initializeFeatherIcons();

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    async loadBlogPostContent(post) {
        const contentContainer = document.getElementById('blog-post-content');
        
        if (!post.contentFile) {
            contentContainer.innerHTML = '<p>Content file not specified for this post.</p>';
            return;
        }

        try {
            const response = await fetch(post.contentFile);
            if (!response.ok) {
                throw new Error('Failed to load blog content');
            }
            const content = await response.text();
            contentContainer.innerHTML = content;
            this.initializeFeatherIcons();
        } catch (error) {
            console.error('Error loading blog content:', error);
            contentContainer.innerHTML = `
                <div class="blog-content">
                    <p>Sorry, we couldn't load this blog post content. Please try again later.</p>
                    <p><em>Published on ${this.formatDate(post.date)} • Tagged: ${post.tags ? post.tags.join(', ') : 'No tags'}</em></p>
                </div>
            `;
        }
    }

    showBlogList() {
        this.viewingBlogPost = false;
        this.currentBlogPost = null;
        
        history.pushState({ route: 'blog' }, '', '#blog');

        document.getElementById('blog-list-view').style.display = 'block';
        document.getElementById('blog-post-view').style.display = 'none';

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
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
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    smoothScrollTo(targetId) {
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    handleContactForm(formData) {
        console.log('Contact form submitted:', formData);
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    }

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

// Additional utility functions
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

    document.querySelectorAll('.project-card, .goal-item, .blog-post').forEach(el => {
        observer.observe(el);
    });
}

function trackPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`Page load time: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupScrollAnimations();
    trackPerformance();
});

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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}