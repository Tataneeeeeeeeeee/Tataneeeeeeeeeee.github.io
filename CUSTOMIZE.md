# 🎨 Customization Guide

Quick reference for personalizing your portfolio.

---

## 1️⃣ Update Your Name & Title

**File**: `index.html`

Find and replace:
```html
<!-- Line ~47 -->
<h1 class="hero-title">Hi, I'm John Doe</h1>
<p class="hero-subtitle">Full Stack Developer & Creative Problem Solver</p>

<!-- Also update navbar branding (line ~16) -->
<a href="#home" class="logo-text">John Doe</a>
```

---

## 2️⃣ Change Your Bio

**File**: `index.html` (About Section, lines 77-92)

Replace the paragraphs with your story:
```html
<p>I'm a passionate full-stack developer with 5+ years of experience...</p>
```

---

## 3️⃣ Add Your Projects

**File**: `index.html` (Project Cards, lines 117-168)

Each project has this structure:
```html
<div class="project-card">
    <div class="project-header">
        <h3 class="project-title">Project Name</h3>
        <a href="https://github.com/yourprofile/repo-name" class="project-link">...</a>
    </div>
    <p class="project-description">Brief description of what this project does.</p>
    <div class="project-tech">
        <span class="tech-tag">Technology 1</span>
        <span class="tech-tag">Technology 2</span>
    </div>
</div>
```

**To duplicate a project:**
1. Copy an entire `<div class="project-card">...</div>` block
2. Paste it after the last project card
3. Update title, description, GitHub link, and technologies

---

## 4️⃣ Update Skills

**File**: `index.html` (Skills Section, lines 199-265)

Each skill has this format:
```html
<li>
    <span class="skill-icon">⚛️</span>
    <span class="skill-name">React</span>
</li>
```

**Common skill icons:**
- ⚛️ React
- 💚 Vue.js
- 🟢 Node.js
- 🐍 Python
- 🗄️ Database/Firebase
- 📦 Git
- 🎨 Design
- 🧪 Testing
- ☁️ Cloud/AWS

---

## 5️⃣ Update Contact Information

**File**: `index.html`

### Email Address
```html
<!-- Line ~331 -->
<input type="email" id="email" name="email" placeholder="Your Email" ...>

<!-- Line ~345 -->
<a href="mailto:your.email@example.com">your.email@example.com</a>
```

### Social Links
Update these URLs (lines 282-310):
```html
<a href="https://github.com/yourusername" ...>GitHub</a>
<a href="https://linkedin.com/in/yourprofile" ...>LinkedIn</a>
<a href="https://twitter.com/yourhandle" ...>Twitter</a>
<a href="mailto:your.email@example.com">Email</a>
```

---

## 6️⃣ Change Colors

**File**: `style.css` (Lines 5-8)

```css
:root {
    /* Change these primary colors */
    --color-primary: #3b82f6;         /* Main blue - change to your preference */
    --color-primary-dark: #1e40af;    /* Darker blue for hover */
    --color-secondary: #10b981;       /* Green accents */
    --color-accent: #f59e0b;          /* Amber/orange accents */
}
```

### Popular color combinations:
```css
/* Purple theme */
--color-primary: #a855f7;
--color-primary-dark: #7e22ce;

/* Teal theme */
--color-primary: #14b8a6;
--color-primary-dark: #0d9488;

/* Red theme */
--color-primary: #ef4444;
--color-primary-dark: #dc2626;

/* Indigo theme */
--color-primary: #6366f1;
--color-primary-dark: #4f46e5;
```

---

## 7️⃣ Adjust Fonts

**File**: `style.css` (Lines 13-14)

```css
/* Change the default font */
--font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...;

/* Common alternatives: */
/* Google: 'Poppins', 'Playfair Display', 'Inter' */
/* System: Georgia, Courier New, Trebuchet MS */
```

To use Google Fonts:
1. Add to `<head>` in `index.html`:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
   ```
2. Update in `style.css`:
   ```css
   --font-family: 'Poppins', sans-serif;
   ```

---

## 8️⃣ Change Spacing & Sizes

**File**: `style.css` (Lines 11-12)

```css
--spacing-sm: 1rem;      /* Small gaps */
--spacing-md: 1.5rem;    /* Medium gaps */
--spacing-lg: 2rem;      /* Large gaps */
--spacing-xl: 3rem;      /* Extra large gaps */
--spacing-2xl: 4rem;     /* Hero/section spacing */

--font-size-base: 1rem;  /* Base text size - increase for larger text */
```

Increase `--font-size-base` to `1.125rem` for larger text globally.

---

## 9️⃣ Customize Animations

**File**: `style.css`

### Slow down animations (lines 35):
```css
/* Change 0.3s to 0.5s for slower transitions */
--transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
```

### Adjust hover effects:
```css
/* Line ~237 - Button hover movement */
.btn-primary:hover {
    transform: translateY(-2px);  /* Change -2px to -4px for bigger lift */
}

/* Line ~486 - Card hover */
.project-card:hover {
    transform: translateY(-8px);  /* Card lift on hover */
}
```

---

## 🔟 Update Meta Information

**File**: `index.html` (Lines 5-6)

```html
<title>Your Name - Your Title</title>
<meta name="description" content="Brief description of who you are and what you do">
```

This shows up when your portfolio is shared and in search results.

---

## 1️⃣1️⃣ Mobile Menu (Hamburger)

**No customization needed!** The mobile menu automatically appears on small screens (≤768px) and is fully functional.

---

## 1️⃣2️⃣ Dark Mode

**No customization needed!** Dark mode automatically works and saves user preference.

To adjust dark mode colors, edit (lines 38-46 in `style.css`):
```css
body.dark-mode {
    --bg-primary: #0f172a;       /* Dark background */
    --bg-secondary: #1e293b;
    --text-primary: #f1f5f9;     /* Light text */
    --text-secondary: #cbd5e1;
    /* ... other colors ... */
}
```

---

## 🎯 Customization Checklist

- [ ] Update your name and title
- [ ] Write your bio
- [ ] Add your projects (update links & descriptions)
- [ ] List your skills
- [ ] Update email address
- [ ] Update social media links
- [ ] Change color scheme
- [ ] Adjust fonts (optional)
- [ ] Update meta title & description
- [ ] Test on mobile devices
- [ ] Test dark mode toggle
- [ ] Deploy to GitHub Pages

---

## 🚀 Ready?

Once customized, deploy by following instructions in `DEPLOYMENT.md`

Happy customizing! 🎨
