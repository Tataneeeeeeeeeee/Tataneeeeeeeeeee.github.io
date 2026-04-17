# Professional GitHub Portfolio Website

A modern, responsive, and feature-rich portfolio website built with vanilla HTML, CSS, and JavaScript. Perfect for showcasing your projects, skills, and professional experience.

## ✨ Features

- **Responsive Design**: Fully mobile-friendly layout that works on all devices
- **Dark/Light Mode Toggle**: Switch between themes with preferences saved to localStorage
- **Smooth Scrolling Navigation**: Seamless navigation between sections
- **Modern Animations**: Eye-catching animations and transitions throughout
- **Project Showcase**: Display your projects with descriptions, technologies, and GitHub links
- **Skills Section**: Organized skill categories with visual indicators
- **Contact Form**: Functional contact form with validation and feedback
- **Social Links**: Quick links to your GitHub, LinkedIn, Twitter, and email
- **Semantic HTML**: Clean, accessible, and SEO-friendly markup
- **Well-Commented Code**: Easy to understand and customize

## 📁 Project Structure

```
.
├── index.html          # Main HTML file with all sections
├── style.css          # Styling with CSS custom properties and animations
├── script.js          # JavaScript for interactivity and functionality
└── README.md          # This file
```

## 🚀 Getting Started

### Local Development

1. **Clone or download** the repository
2. **Open `index.html`** in your web browser
3. **Customize** the content with your information

No build tools or dependencies required - it's pure HTML, CSS, and JavaScript!

## 🎨 Customization Guide

### Basic Content Updates

#### 1. **Hero Section** (index.html, lines 45-59)
```html
<h1 class="hero-title">Hi, I'm John Doe</h1>
<p class="hero-subtitle">Full Stack Developer & Creative Problem Solver</p>
```
Replace "John Doe" with your name and customize your title.

#### 2. **About Me Section** (index.html, lines 77-92)
Update the about text to reflect your background, experience, and goals.

#### 3. **Projects Section** (index.html, lines 117-168)
- Update project titles, descriptions, and GitHub links
- Modify technology tags
- Add or remove project cards as needed

#### 4. **Skills Section** (index.html, lines 199-265)
- Customize skill categories
- Update skill icons (using emojis) and names
- Add or remove skills

#### 5. **Contact Section** (index.html, lines 331-347)
- Update your email address in the form and social links
- Update GitHub, LinkedIn, and Twitter profile URLs
- Customize the contact message

#### 6. **Navbar Branding** (index.html, line 16)
Replace the logo text with your name or brand.

### Color Customization

Edit the CSS custom properties in `style.css` (lines 5-35):

```css
--color-primary: #3b82f6;        /* Main brand color */
--color-primary-dark: #1e40af;   /* Darker variant */
--color-secondary: #10b981;       /* Accent color 1 */
--color-accent: #f59e0b;          /* Accent color 2 */
```

### Font and Typography

Modify font properties in `style.css`:
```css
--font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
--font-size-base: 1rem;           /* Adjust base size for all text */
```

### Spacing and Layout

Update spacing variables for margins and padding:
```css
--spacing-sm: 1rem;
--spacing-md: 1.5rem;
--spacing-lg: 2rem;
--spacing-xl: 3rem;
```

## 📱 Responsive Breakpoints

The site has responsive designs for:
- **Desktop**: Full layout with multi-column grids
- **Tablet** (≤768px): Adjusted spacing and single-column layouts
- **Mobile** (≤480px): Optimized font sizes and touch-friendly elements

## 🌙 Dark Mode

- Dark/Light mode toggle in the navbar
- User preference saved to browser's localStorage
- Smooth transition between themes

## 🎯 Dark Mode CSS Variables

The site uses CSS custom properties that automatically update in dark mode:

```css
body.dark-mode {
    --bg-primary: #0f172a;       /* Dark background */
    --text-primary: #f1f5f9;     /* Light text */
    /* ... other dark mode colors ... */
}
```

## 📧 Email Form Integration

### Current Implementation
The form validates input and shows success/error messages. To make it fully functional:

#### Option 1: Formspree (Recommended - No Backend)
1. Go to [formspree.io](https://formspree.io)
2. Create an account and new form
3. Get your form ID
4. Update the form action in `index.html`:
```html
<form class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

#### Option 2: EmailJS (Client-Side)
1. Sign up at [emailjs.com](https://www.emailjs.com)
2. Add to `script.js`:
```javascript
emailjs.init("YOUR_PUBLIC_KEY");

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        await emailjs.sendForm(
            'service_id',
            'template_id',
            contactForm
        );
        showFormMessage('Email sent successfully!', 'success');
    } catch (error) {
        showFormMessage('Failed to send email', 'error');
    }
});
```

#### Option 3: Backend API
Replace the form submission in `script.js` with your backend endpoint:
```javascript
const response = await fetch('https://your-backend.com/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
});
```

## 🚢 Deploy to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a repository named: `yourusername.github.io`
3. Make sure to replace `yourusername` with your actual GitHub username

### Step 2: Initialize Git (if needed)

```bash
# Navigate to your project folder
cd path/to/portfolio

# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Portfolio website"
```

### Step 3: Push to GitHub

```bash
# Add remote origin (replace yourusername)
git remote add origin https://github.com/yourusername/yourusername.github.io.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 4: Verify Deployment

1. Wait 1-2 minutes for GitHub to build your site
2. Visit `https://yourusername.github.io`
3. Your portfolio is now live! 🎉

### Updating Your Site

```bash
# Make changes, then:
git add .
git commit -m "Update portfolio content"
git push
```

Changes will be live within seconds!

## 🔧 Troubleshooting

### Site Not Appearing
- Ensure repository name is exactly `yourusername.github.io`
- Check GitHub Pages settings in repository Settings > Pages
- Verify files are in the root directory

### Images Not Loading
- Use relative paths: `./images/photo.jpg`
- Keep images in the same directory as `index.html` or in a subfolder
- Verify image file extensions are correct

### Styles Not Applying
- Hard refresh your browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Verify CSS file path is correct

### Dark Mode Not Working
- Check browser supports localStorage
- Clear localStorage if having issues: Open DevTools > Console > `localStorage.clear()`

## 📚 Resources

- [HTML Documentation](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS Guide](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [JavaScript Basics](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [GitHub Pages Docs](https://pages.github.com/)
- [GitHub Pages Custom Domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

## 🎯 SEO Optimization Tips

1. **Update Meta Tags** in `index.html`:
   ```html
   <title>Your Name - Job Title</title>
   <meta name="description" content="Your professional summary">
   ```

2. **Add Keywords** to meta tags
3. **Update OG Tags** for social media sharing:
   ```html
   <meta property="og:title" content="Your Name">
   <meta property="og:description" content="Your professional description">
   <meta property="og:image" content="https://yoursite.com/preview.jpg">
   ```

4. **Add Schema Markup** for rich snippets
5. **Use Semantic HTML** (already implemented ✅)

## 💡 Tips for Success

1. **Keep Content Updated**: Regularly update projects and skills
2. **Add Project Images**: Create a folder for project screenshots
3. **Write Compelling Copy**: Make your descriptions engaging
4. **Get Feedback**: Have others review your portfolio for clarity and impact
5. **Monitor Analytics**: Add Google Analytics to track visitors
6. **Mobile Testing**: Test on various devices before deployment
7. **Accessibility**: Ensure good color contrast and keyboard navigation

## 🤝 MIT License

This portfolio template is free to use and modify for your personal use.

## 🙏 Attribution

Built with ❤️ using vanilla HTML, CSS, and JavaScript.

---

**Happy Building! 🚀**

If you found this template helpful, consider giving it a star on GitHub!
