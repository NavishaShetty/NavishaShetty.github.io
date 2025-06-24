# Portfolio Website

## Overview

This is a static portfolio website built with vanilla HTML, CSS, and JavaScript. It features a single-page application (SPA) architecture with client-side routing, showcasing a personal portfolio with three main sections: About Me, Blog, and Resume. The site uses a simple Python HTTP server for local development and hosting.

## System Architecture

### Frontend Architecture
- **Single Page Application (SPA)**: Client-side routing implemented in vanilla JavaScript
- **Modular CSS**: Organized stylesheet with component-based styling using CSS Grid and Flexbox
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with interactive features
- **Responsive Design**: Mobile-first approach with flexible layouts

### Backend Architecture
- **Static File Server**: Python's built-in HTTP server serves static files
- **No Database**: Content is stored in JSON files for blog posts and static HTML/CSS for other content
- **File-based Content Management**: Blog posts are managed through JSON configuration

## Key Components

### 1. Navigation System
- **Client-side Router**: JavaScript-based routing without page refreshes
- **Active State Management**: Visual feedback for current section
- **Browser History Integration**: Supports back/forward navigation

### 2. Content Sections
- **About Me**: Hero section with project showcase
- **Blog**: Paginated blog posts with tag filtering
- **Resume**: PDF viewer with print functionality

### 3. Blog System
- **JSON-based Storage**: Blog posts stored in `blog/posts.json`
- **Pagination Support**: Client-side pagination for blog posts
- **Tag System**: Content categorization and filtering
- **Search Functionality**: Client-side content search

### 4. UI Components
- **Feather Icons**: External icon library for consistent iconography
- **Google Fonts**: Inter font family for modern typography
- **Print Styles**: Optimized CSS for resume printing

## Data Flow

1. **Initial Load**: 
   - HTML loads with default "About" section visible
   - JavaScript initializes the PortfolioApp class
   - Blog posts are fetched from JSON file
   - Feather icons are initialized

2. **Navigation**:
   - User clicks navigation link
   - JavaScript prevents default link behavior
   - Route change updates URL and shows corresponding section
   - Active states are updated across navigation

3. **Blog Interaction**:
   - Posts are filtered and paginated client-side
   - Search queries filter posts in real-time
   - Individual post views are handled through routing

## External Dependencies

### CDN Resources
- **Google Fonts**: Inter font family for typography
- **Feather Icons**: Icon library for UI elements

### NPM Dependencies
- **http-server**: Alternative Node.js-based static file server
- **Various supporting packages**: Color conversion, async utilities, authentication helpers

## Deployment Strategy

### Development Environment
- **Python HTTP Server**: `python -m http.server 5000` for local development
- **Replit Integration**: Configured with workflows for easy development
- **Hot Reload**: Manual refresh required for changes

### Production Deployment
- **Static Hosting Compatible**: Can be deployed to any static hosting service
- **No Build Process**: Direct deployment of source files
- **CDN Friendly**: All external resources loaded from CDNs

### Alternative Serving Options
- **Node.js Server**: http-server package available as alternative
- **Cross-platform Support**: Both Python and Node.js options available

## Development Considerations

### Strengths
- **Simple Architecture**: Easy to understand and maintain
- **Fast Loading**: Minimal dependencies and optimized assets
- **SEO Friendly**: Static HTML with proper meta tags
- **Cross-platform**: Works on any system with Python or Node.js

### Limitations
- **No CMS**: Content updates require direct file editing
- **Client-side Only**: No server-side processing capabilities
- **Limited Scalability**: JSON-based blog storage not suitable for large content volumes
- **No Authentication**: All content is publicly accessible

### Future Enhancement Opportunities
- **Content Management System**: Could integrate with headless CMS
- **Build Process**: Could add bundling and optimization
- **Backend Integration**: Could add dynamic content features
- **Database Integration**: Could migrate from JSON to proper database

## Changelog

- June 24, 2025: Updated portfolio with Navisha Shetty's resume details, added BESS Coding Agent project, and created detailed blog post about the project
- June 23, 2025: Initial setup with portfolio structure and blog functionality

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Updates

- Enhanced About Me section with detailed background in MLOps, AI systems, and cloud-native technologies
- Updated Current Goals to reflect focus on AI-integrated systems, DevOps/MLOps mastery, and open source contributions
- Personalized all content with Navisha's actual resume information and career aspirations
- Added real projects from GitHub including BESS Coding Agent
- Created comprehensive blog post about the BESS Coding Agent journey
- Updated skills section with relevant AI/ML and data engineering technologies
- Integrated actual work experience from LG Energy Solution, TekSystems, and Pitney Bowes
- Improved professional summary to highlight hands-on engineering background and open-source mindset