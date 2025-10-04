# Portfolio Website - Easy Maintenance Guide

## 📋 Quick Reference: Where to Edit What

| What You Want to Change | File to Edit | Example |
|------------------------|--------------|---------|
| Add a new project | `content/projects.json` | Add new object to array |
| Update About Me description | `content/about.json` | Edit the "description" field |
| Add/edit goals | `content/goals.json` | Add/edit array items |
| Add new blog post | `blog/posts.json` + create HTML file | See "Adding Blog Posts" |
| Update resume | `index.html` (Resume section) | Direct HTML editing |
| Change colors/styling | `css/style.css` | CSS modifications |

---

## 🎯 How to Make Common Changes

### ✅ Adding a New Project

**File:** `content/projects.json`

1. Open `content/projects.json`
2. Add a new object to the array:

```json
{
  "name": "Your Project Name",
  "description": "Brief description of what it does",
  "github": "https://github.com/YourUsername/repo-name",
  "blog": "blog-post-id-if-exists",
  "showBlogButton": false
}
```

3. Save the file - that's it! The project will appear automatically.

**Notes:**
- If `showBlogButton` is `true`, make sure the `blog` field has a valid blog post ID
- If the project doesn't have a GitHub link, omit the `github` field
- Projects appear in the order they're listed in the JSON file

---

### ✅ Editing Your About Section

**File:** `content/about.json`

Simply edit the text:

```json
{
  "name": "Navisha Shetty",
  "title": "Hello, I'm Navisha Shetty",
  "description": "Your new description here..."
}
```

**Note:** The same text exists in `index.html` as a fallback (for SEO and if JavaScript fails), but the JSON will override it when the page loads.

---

### ✅ Adding/Editing Goals

**File:** `content/goals.json`

Add or modify goals in the array:

```json
[
  {
    "title": "Your Goal Title",
    "description": "Detailed description of this goal"
  }
]
```

Goals appear in the order listed.

---

### ✅ Adding a New Blog Post

**Two types of blog posts:**

#### Type 1: Inline Blog Post (loads content in the portfolio)
For most blog posts, use this approach:

**Step 1:** Create the blog post HTML file

**Location:** `blog/posts/`

Create a new file: `blog/posts/your-post-name.html`

```html
<!-- Your Blog Post Content -->
<div class="blog-content">
    <h2>First Section</h2>
    <p>Your content here...</p>
    
    <h3>Subsection</h3>
    <p>More content...</p>
    
    <ul>
        <li>Bullet point 1</li>
        <li>Bullet point 2</li>
    </ul>
    
    <blockquote>
        "A quote if you want"
    </blockquote>
</div>
```

**Step 2:** Register in `blog/posts.json`

```json
{
  "id": "your-post-name",
  "title": "Your Blog Post Title",
  "date": "2025-10-03",
  "excerpt": "A brief summary that appears on the blog list page",
  "contentFile": "blog/posts/your-post-name.html",
  "tags": ["tag1", "tag2", "tag3"],
  "author": "Navisha Shetty"
}
```

#### Type 2: Standalone Page (like Flipped Interaction Pattern)
For interactive posts with their own styling, quizzes, etc:

**Step 1:** Create full HTML page in `blog/` folder

Create: `blog/your-interactive-post.html` (complete HTML with `<head>`, styles, scripts, etc.)

**Step 2:** Register with external link in `blog/posts.json`

```json
{
  "id": "your-interactive-post",
  "title": "Your Interactive Post Title",
  "date": "2025-10-03",
  "excerpt": "Brief summary",
  "externalLink": "blog/your-interactive-post.html",
  "tags": ["tag1", "tag2"],
  "author": "Navisha Shetty"
}
```

When clicked, this will navigate to the full standalone page instead of loading inline.

**Important:**
- Use `contentFile` for inline posts (loads in portfolio design)
- Use `externalLink` for standalone pages (navigates to full page)
- Date format must be `YYYY-MM-DD`

---

### ✅ Editing Resume

**File:** `index.html`

The resume section is still in `index.html` starting at:
```html
<!-- Resume Section - NO CHANGES -->
<section id="resume-section" class="section">
```

Edit the HTML directly for resume changes.

**Tip:** If you want to make the resume editable via JSON too, let me know!

---

## 📁 New File Structure

```
NavishaShetty.github.io/
├── content/                    [NEW FOLDER]
│   ├── projects.json          → All your projects
│   ├── about.json             → About section data
│   └── goals.json             → Your goals
│
├── blog/
│   ├── posts.json             → Blog post metadata
│   ├── flipped-interaction-pattern.html  → Full interactive page
│   └── posts/                 [NEW FOLDER]
│       ├── bess-agent.html                → BESS blog content
│       └── flipped-interaction-preview.html → Flipped pattern preview
│
├── assets/
│   └── resume.pdf
│
├── css/
│   └── style.css
│
├── js/
│   └── main.js                [MODIFIED - Loads from JSON]
│
└── index.html                 [MODIFIED - Simplified]
```

---

## 🚀 Deployment (GitHub Pages)

Your portfolio is a **static website** - just HTML, CSS, and JavaScript files. GitHub Pages serves these directly.

### What You Need:
- Just push your code to GitHub
- Enable GitHub Pages in repository settings
- Access at: `https://navishashetty.github.io`

### What You DON'T Need:
- ❌ `package.json` (only for local development)
- ❌ `package-lock.json` (only for local development)
- ❌ Any build process
- ❌ A backend server

**Can delete safely:**
- `package.json`
- `package-lock.json`
- `replit.md`

---

## 🔧 What Changed in This Refactor

### Before (Old Way):
- ❌ All projects hardcoded in `index.html` - copy/paste HTML to add projects
- ❌ Blog content hardcoded in `main.js` - edit JavaScript to add blog posts
- ❌ About section hardcoded in `index.html`
- ❌ Goals hardcoded in `index.html`

### After (New Way):
- ✅ Projects in `content/projects.json` - just add JSON object
- ✅ Blog content in separate HTML files - create file + register in JSON
- ✅ About section in `content/about.json` - edit text
- ✅ Goals in `content/goals.json` - add/edit JSON objects

### Key Improvements:
1. **No More HTML/JavaScript Editing** for most changes
2. **Simple JSON Files** for content management
3. **Separate Blog Files** for easier writing
4. **Cleaner Code** - removed 200+ lines from `main.js`

---

## 🛠️ Testing Locally

### Option 1: Python (Simplest)
```bash
python -m http.server 5000
```
Then visit: `http://localhost:5000`

### Option 2: VS Code Live Server Extension
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

### Option 3: Double-click (May not work for blog posts)
Just double-click `index.html` - works but blog posts may not load due to CORS.

---

## 🐛 Troubleshooting

### Blog Posts Not Showing Up
- Check `blog/posts.json` for correct `contentFile` path
- Make sure the HTML file exists at that path
- Check browser console (F12) for errors

### Projects Not Appearing
- Check `content/projects.json` for valid JSON syntax
- Use a JSON validator: https://jsonlint.com/
- Check browser console for errors

### Styles Look Broken
- Make sure `css/style.css` path is correct in `index.html`
- Clear browser cache (Ctrl+Shift+R)

### Changes Not Showing on GitHub Pages
- GitHub Pages can take 1-5 minutes to update
- Clear your browser cache
- Try incognito/private browsing mode

---

## 📝 JSON Tips

### Valid JSON:
```json
{
  "name": "Value",
  "number": 123,
  "array": ["item1", "item2"]
}
```

### Common Mistakes:
- ❌ Trailing comma: `["item1", "item2",]`
- ❌ Single quotes: `{'name': 'value'}`
- ❌ Comments: `// not allowed in JSON`
- ✅ Always use double quotes
- ✅ No trailing commas
- ✅ Validate with jsonlint.com

---

## 💡 Future Enhancements (Optional)

If you want to make it even easier:
1. **Resume in JSON** - Convert resume section to JSON format
2. **Blog Post Template** - Create a template file for new posts
3. **Image Management** - Add images folder with instructions
4. **Contact Form** - Add contact form integration
5. **Analytics** - Add Google Analytics tracking

Let me know if you want any of these!

---

## 📞 Quick Help

**Q: How do I add a project without a GitHub link?**
A: Just omit the `github` field from the JSON object.

**Q: Can I reorder projects?**
A: Yes! Projects appear in the order they're listed in `projects.json`.

**Q: How do I hide a blog post?**
A: Remove it from `blog/posts.json` (the HTML file can stay).

**Q: Can I use Markdown for blog posts?**
A: Currently HTML only, but we could add Markdown support if needed.

**Q: What if I break something?**
A: Git is your friend! Just revert to the last working commit.

---

## ✅ Checklist After Refactoring

- [ ] Create `content/` folder
- [ ] Create `content/projects.json`
- [ ] Create `content/about.json`
- [ ] Create `content/goals.json`
- [ ] Create `blog/posts/` folder
- [ ] Create `blog/posts/bess-agent.html`
- [ ] Update `blog/posts.json`
- [ ] Replace `js/main.js` with new version
- [ ] Update `index.html`
- [ ] Delete `package.json` (optional)
- [ ] Delete `package-lock.json` (optional)
- [ ] Test locally
- [ ] Push to GitHub
- [ ] Verify on GitHub Pages

---

**Last Updated:** October 3, 2025
**Maintainer:** Navisha Shetty
**GitHub:** https://github.com/NavishaShetty