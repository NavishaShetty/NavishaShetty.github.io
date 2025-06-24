// Portfolio Application JavaScript
class PortfolioApp {
    constructor() {
        this.currentRoute = 'about';
        this.blogPosts = [];
        this.currentPage = 1;
        this.postsPerPage = 5;
        this.currentBlogPost = null;
        this.viewingBlogPost = false;
        
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
        
        // Check if it's a blog post route (blog/post-id)
        if (hash.startsWith('blog/')) {
            const postId = hash.substring(5);
            this.navigateTo('blog', false);
            // Wait a bit longer to ensure blog posts are loaded
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

        // Reset blog post view when navigating to different sections
        if (route !== 'blog') {
            this.viewingBlogPost = false;
            this.currentBlogPost = null;
        }

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
        
        // Check if it's a blog post route
        if (hash.startsWith('blog/')) {
            const postId = hash.substring(5);
            if (this.currentRoute !== 'blog') {
                this.navigateTo('blog', false);
            }
            // Wait a bit longer to ensure blog posts are loaded
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
        // If blog posts haven't been loaded yet, load them first
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

        // Update URL to include blog post
        history.pushState({ route: 'blog', postId }, '', `#blog/${postId}`);

        this.currentBlogPost = post;
        this.viewingBlogPost = true;

        // Hide blog list view
        document.getElementById('blog-list-view').style.display = 'none';
        
        // Show blog post view
        const blogPostView = document.getElementById('blog-post-view');
        blogPostView.style.display = 'block';

        // Populate blog post content
        document.getElementById('blog-post-title').textContent = post.title;
        document.getElementById('blog-post-meta').innerHTML = `
            <span>Published on ${this.formatDate(post.date)}</span>
            ${post.author ? `<span> • By ${this.escapeHtml(post.author)}</span>` : ''}
        `;
        
        // Render tags
        const tagsContainer = document.getElementById('blog-post-tags');
        if (post.tags && post.tags.length > 0) {
            tagsContainer.innerHTML = post.tags.map(tag => 
                `<span class="blog-tag">${this.escapeHtml(tag)}</span>`
            ).join('');
        } else {
            tagsContainer.innerHTML = '';
        }

        // Render content
        document.getElementById('blog-post-content').innerHTML = this.renderBlogPostContent(post);

        // Re-initialize Feather icons for the new content
        this.initializeFeatherIcons();

        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    showBlogList() {
        this.viewingBlogPost = false;
        this.currentBlogPost = null;
        
        // Update URL
        history.pushState({ route: 'blog' }, '', '#blog');

        // Show blog list view
        document.getElementById('blog-list-view').style.display = 'block';
        
        // Hide blog post view
        document.getElementById('blog-post-view').style.display = 'none';

        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    renderBlogPostContent(post) {
        // Special content for BESS Coding Agent post
        if (post.id === 'bess-coding-agent-journey') {
            return `
                <div class="blog-content">
                    <h2>The Journey Begins</h2>
                    <p>Just wrapped up the DeepLearning.ai "Building & Evaluating AI Agents" course, and I'm excited to share what I learned by building something real.</p>
                    
                    <p>Agents feel like the next inflection point: they don't just answer questions, they use tools to get real work done. After the course, I pointed that power at something from my day-job—battery energy storage trading—and the result is <strong>BESS-Coding-Agent</strong>.</p>

                    <h2>What It Does</h2>
                    <p>The BESS Coding Agent is designed to solve real-world problems in energy trading:</p>
                    
                    <ul>
                        <li><strong>Connects to Modo Energy's Day-Ahead-Market API</strong> for real-time energy pricing data</li>
                        <li><strong>Uses SmolAgents LLM + custom tools</strong> to analyze energy prices and market conditions</li>
                        <li><strong>Provides actionable insights</strong> telling storage owners exactly when to charge, when to discharge, and what the cycle profit looks like</li>
                        <li><strong>Chat UI interface</strong> for natural language interaction with complex energy data</li>
                        <li><strong>Phoenix dashboard integration</strong> streams every tool call and model decision for easy debugging</li>
                    </ul>

                    <h2>Technical Implementation</h2>
                    <p>Building this agent involved several key technical decisions:</p>
                    
                    <h3>SmolAgents Framework</h3>
                    <p>I chose SmolAgents for its lightweight approach to building LLM-powered agents. It provided the perfect balance between functionality and simplicity for this project.</p>

                    <h3>Custom Tool Development</h3>
                    <p>Created specialized tools for:</p>
                    <ul>
                        <li>API integration with Modo Energy's pricing feeds</li>
                        <li>Battery optimization calculations</li>
                        <li>Profit analysis and reporting</li>
                        <li>Market condition assessment</li>
                    </ul>

                    <h3>Observability with Phoenix</h3>
                    <p>Integrated Phoenix tracing to monitor every decision the agent makes. This transparency is crucial when dealing with financial trading decisions.</p>

                    <blockquote>
                        "Conversational chatbots were just the beginning; agents turn 'nice answers' into actions."
                    </blockquote>

                    <h2>Why I'm Excited</h2>
                    <p>After seeing this work on a real dataset, I'm re-thinking how AI can slot into every workflow I touch. The ability to have natural conversations about complex energy market data and get actionable trading recommendations feels transformative.</p>

                    <p>This project demonstrates that agents aren't just fancy chatbots—they're tools that can understand context, use specialized tools, and provide real business value.</p>

                    <h2>Key Learnings</h2>
                    <ol>
                        <li><strong>Tool Design Matters</strong>: The quality of your custom tools directly impacts agent performance</li>
                        <li><strong>Observability is Critical</strong>: When dealing with financial data, you need to see every decision step</li>
                        <li><strong>Domain Knowledge Integration</strong>: Combining LLM capabilities with industry-specific logic creates powerful solutions</li>
                        <li><strong>User Experience Focus</strong>: A chat interface makes complex data accessible to non-technical users</li>
                    </ol>

                    <h2>What's Next</h2>
                    <p>This feels like chapter 1 of something bigger. I'm keen to keep learning, ship more agent-powered helpers, and—hopefully—make software a lot more fun (and useful!) along the way.</p>

                    <p>The intersection of AI agents and specialized domains like energy trading opens up endless possibilities. I'm excited to explore more applications and continue pushing the boundaries of what's possible.</p>

                    <h3>Try It Yourself</h3>
                    <p>If you're curious about the implementation details or want to experiment with the code, check out the <a href="https://github.com/NavishaShetty/BESS-Coding-Agent" target="_blank">GitHub repository</a>. I'd love to hear your thoughts or ideas for improvement!</p>
                    
                    <p><em>Published on ${this.formatDate(post.date)} • Tagged: ${post.tags ? post.tags.join(', ') : 'No tags'}</em></p>
                </div>
            `;
        }
        
        // Default content for other posts
        return `
            <div class="blog-content">
                <h2>Introduction</h2>
                <p>${this.escapeHtml(post.excerpt)}</p>
                
                <h2>Main Content</h2>
                <p>This is where the full blog post content would appear. In a real application, you would:</p>
                
                <ul>
                    <li>Store full content in separate markdown or HTML files</li>
                    <li>Fetch the content via AJAX when a post is opened</li>
                    <li>Use a content management system or static site generator</li>
                    <li>Parse markdown to HTML for rich formatting</li>
                </ul>

                <blockquote>
                    "${this.escapeHtml(post.excerpt)}"
                </blockquote>

                <h3>Key Points</h3>
                <p>Here are some key takeaways from this post:</p>
                
                <ol>
                    <li>Understanding the core concepts</li>
                    <li>Practical implementation strategies</li>
                    <li>Best practices and common pitfalls</li>
                    <li>Future considerations and next steps</li>
                </ol>

                <h3>Code Example</h3>
                <pre><code>// Example code snippet
function exampleFunction() {
    console.log('This is a sample code block');
    return 'You can add syntax highlighting here';
}</code></pre>

                <h2>Conclusion</h2>
                <p>Thank you for reading this blog post. In a real implementation, this content would be much more comprehensive and would include the actual article content, images, and interactive elements.</p>
                
                <p><em>Published on ${this.formatDate(post.date)} • Tagged: ${post.tags ? post.tags.join(', ') : 'No tags'}</em></p>
            </div>
        `;
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
