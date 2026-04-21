# 🎯 Professional Developer Portfolio

A modern, fully responsive portfolio website built with vanilla HTML, CSS, and JavaScript. No dependencies, no build tools required.

## ✨ Key Features

✅ **Responsive Design** - Mobile-friendly on all devices  
✅ **Dark/Light Mode** - Theme toggle with localStorage persistence  
✅ **Auto-Load GitHub Projects** - Dynamically fetch and display your repos  
✅ **Skills with Icons** - SVG icons from Devicon for professional appearance  
✅ **Smooth Animations** - Modern UI with CSS transitions  
✅ **JSON Data System** - Centralized, modular data management  
✅ **Contact Form** - Functional email contact with validation  
✅ **Zero Dependencies** - 100% vanilla HTML, CSS, JavaScript  

---

## 🚀 Quick Start

### 1. Local Development
```bash
# Simply open in browser or run a local server
python -m http.server 8000
# Then visit http://localhost:8000
```

### 2. Configure GitHub Projects
Edit `github-projects.js` and update:
```javascript
const GITHUB_CONFIG = {
    username: 'your-github-username',  // ← YOUR USERNAME
    maxProjects: 6,
    excludeRepos: [],
    sortBy: 'stars'
};
```

### 3. Update Your Data
Edit `data.json` with your portfolio information:
- Profile (name, title, bio)
- Experience (jobs, internships)
- Education (degrees)
- Certifications (achievements)
- Skills (organized by category)

### 4. Deploy to GitHub Pages
```bash
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git branch -M main
git push -u origin main
```

---

## 📁 Project Structure

```
.
├── index.html                # Main HTML file
├── style.css                 # All styling and animations
├── script.js                 # Core interactivity
├── data.json                 # Centralized portfolio data
├── data-loader.js            # JSON data management
├── advanced-data-functions.js # Utility functions
├── github-projects.js        # GitHub API integration
├── icons.js                  # Skill icon mappings
├── ui-enhancements.js        # UI interaction enhancements
└── README.md                 # This file
```

---

## 📋 Configuration Guide

### GitHub Projects (github-projects.js)

```javascript
const GITHUB_CONFIG = {
    username: 'your-username',           // Required: Your GitHub username
    maxProjects: 6,                      // How many projects to display
    excludeRepos: ['portfolio-repo'],    // Repos to hide
    sortBy: 'stars'                      // 'stars' | 'updated' | 'pushed' | 'name'
};
```

**Sort Options:**
- `stars` - Most popular projects first
- `updated` - Most recently modified first
- `pushed` - Latest pushes first
- `name` - Alphabetical order

### Portfolio Data (data.json)

```json
{
  "profile": {
    "name": "Your Name",
    "title": "Your Title",
    "description": "Short description",
    "about": "Longer bio"
  },
  "experience": [{
    "id": 1,
    "title": "Job Title",
    "company": "Company Name",
    "dateStart": "Jan 2025",
    "dateEnd": "Present",
    "description": "What you did..."
  }],
  "education": [{
    "id": 1,
    "degree": "Bachelor's",
    "school": "University Name",
    "dateStart": "2020",
    "dateEnd": "2024",
    "details": "Major/specialization"
  }],
  "certifications": [{
    "id": 1,
    "title": "Certification Name",
    "description": "Details..."
  }],
  "skills": {
    "languages": [{"name": "Python", "icon": "python"}],
    "backend": [{"name": "Django", "icon": "django"}],
    "tools": [{"name": "Git", "icon": "git"}]
  }
}
```

### Add Custom Skills

Edit `icons.js` to add new skill icons:
```javascript
'Your Skill': { name: 'devicon-name', folder: 'folder', color: '#hexcolor' }
```

Uses [Devicon CDN](https://devicon.dev/) (40+ technologies pre-configured).

### Customize Colors

Edit `style.css` CSS variables (lines 5-8):
```css
--color-primary: #3b82f6;        /* Main color */
--color-primary-dark: #1e40af;   /* Hover color */
--color-secondary: #10b981;      /* Accent 1 */
--color-accent: #f59e0b;         /* Accent 2 */
```

Popular combinations:
```css
/* Purple */ --color-primary: #a855f7;
/* Teal */   --color-primary: #14b8a6;
/* Red */    --color-primary: #ef4444;
```

### Email Form Integration

The form validates locally. To make it functional, choose one:

**Option 1: Formspree (Recommended)**
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```
1. Sign up at [formspree.io](https://formspree.io)
2. Create form and get your ID
3. Update form action above

**Option 2: EmailJS (Client-side)**
```javascript
emailjs.init("YOUR_PUBLIC_KEY");
contactForm.addEventListener('submit', async (e) => {
    await emailjs.sendForm('service_id', 'template_id', contactForm);
});
```

---

## 💡 Usage Examples

### Adding a New Skill

**In `data.json`:**
```json
"languages": [
  {"name": "Python", "icon": "python"},
  {"name": "Go", "icon": "go"}     // ← New skill
]
```

**In `icons.js`** (if icon doesn't exist):
```javascript
'Go': { name: 'go', folder: 'go', color: '#00add8' }
```

Refresh browser - skill appears automatically!

### Sorting GitHub Projects by Different Criteria

**Most recent work:**
```javascript
sortBy: 'pushed'
```

**Latest updates:**
```javascript
sortBy: 'updated'
```

**Alphabetical:**
```javascript
sortBy: 'name'
```

### Hiding Test/Learning Repos

```javascript
excludeRepos: [
  'your-username.github.io',  // Portfolio itself
  'learning-javascript',       // Learning projects
  'test-repo',                 // Test repos
  'temp-*'                     // Temporary repos
]
```

---

## 📱 Responsive Design

Automatic responsive layouts:
- **Desktop** (1200px+) - Multi-column grids
- **Tablet** (768-1199px) - 2-column layouts
- **Mobile** (480-767px) - Single column
- **Small Mobile** (<480px) - Optimized spacing

No manual adjustments needed - CSS handles it!

---

## 🌙 Dark Mode

- Toggle button in navbar
- User preference saved to browser (localStorage)
- Smooth transitions
- Full support for both themes

To customize dark mode colors, edit `style.css` (lines 38-46):
```css
body.dark-mode {
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --text-primary: #f1f5f9;
}
```

---

## 🎨 Customization Tips

### Keep It Simple
- 2-3 paragraphs max in About
- 3-5 "best" projects, not all of them
- Group skills by category

### Visual Hierarchy
- Clear headings
- Plenty of white space
- High text contrast
- Touch targets ≥ 48px

### Mobile First
- Test on actual mobile devices
- Tap-friendly buttons
- Readable font sizes
- Stack all sections vertically

### Trust Signals
- Keep portfolio updated (last modified date helps)
- Include testimonials or certifications
- Show active GitHub contributions
- Professional email address

---

## 🔄 Maintenance Checklist

### Monthly
- [ ] Update featured projects
- [ ] Fix any broken links
- [ ] Review contact form
- [ ] Check for typos

### Quarterly
- [ ] Add new projects
- [ ] Update skills if learned new tech
- [ ] Test on different browsers/devices

### Yearly
- [ ] Review design freshness
- [ ] Update bio/experience
- [ ] Consider design refresh

---

## 🚫 Common Issues

| Problem | Solution |
|---------|----------|
| Data not displaying | Ensure `data.json` format is valid (check [jsonlint.com](https://jsonlint.com)) |
| Changes not appearing | Hard refresh: `Ctrl+Shift+R` or clear cache |
| Skills not showing icons | Check skill name matches exactly in `icons.js` |
| GitHub projects blank | Verify username in `github-projects.js` and public repos exist |

---

## 📚 Resources

- [CSS-Tricks](https://css-tricks.com/) - CSS reference
- [MDN Web Docs](https://developer.mozilla.org/) - HTML/CSS/JS docs
- [Web.dev](https://web.dev/) - Performance optimization
- [Devicon](https://devicon.dev/) - Technology icons
- [GitHub Pages Docs](https://pages.github.com/) - Deployment help

---

## 📧 Email Form

**Option 1: Formspree (Easiest)**
1. Sign up at formspree.io
2. Update form action in index.html with your form ID

**Option 2: EmailJS**
1. Sign up at emailjs.com
2. Add initialization code to script.js

**Option 3: Backend API**
- Update form submission code in script.js

See `DEPLOYMENT.md` for detailed instructions.

## 🌐 Deploy to GitHub Pages

1. Create repo: `yourusername.github.io`
2. Push files to main branch
3. Visit `yourusername.github.io` - Done! 🎉

Full instructions in `DEPLOYMENT.md`

## 🎯 Next Steps

1. ✏️ Personalize all content sections
2. 🎨 Adjust colors and typography
3. 🔗 Add your social media links
4. 📧 Set up email form integration
5. 🚀 Deploy to GitHub Pages
6. 📊 Add Google Analytics (optional)

## 📚 Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [GitHub Pages Docs](https://pages.github.com/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

## 💡 Tips

- Keep your portfolio updated with recent projects
- Test on mobile devices before deploying
- Use good quality screenshots for projects
- Write clear, concise project descriptions
- Include relevant technologies for each project

---

**Ready to showcase your work? Let's go! 🚀**

For detailed customization and deployment instructions, see `DEPLOYMENT.md`