# 🎯 Professional Developer Portfolio

A modern, fully responsive portfolio website built with HTML, CSS, and JavaScript.

## ✨ Key Features

✅ **Responsive Design** - Mobile-friendly on all devices  
✅ **Dark/Light Mode** - Theme toggle with localStorage persistence  
✅ **Smooth Animations** - Modern UI with CSS animations  
✅ **Project Showcase** - Display your best work with descriptions  
✅ **Skills Section** - Organized technology categories  
✅ **Contact Form** - Functional email contact form  
✅ **Social Links** - GitHub, LinkedIn, Twitter, Email links  
✅ **Zero Dependencies** - Pure vanilla HTML, CSS, JavaScript  

## 🚀 Quick Start

1. **Customize Content**
   - Edit `index.html` with your name, bio, projects, and skills
   - Update social links and contact email

2. **Customize Design**
   - Modify colors in `style.css` (CSS variables at the top)
   - Adjust fonts, spacing, and animations to match your style

3. **Deploy to GitHub Pages**
   ```bash
   git remote add origin https://github.com/yourusername/yourusername.github.io.git
   git branch -M main
   git push -u origin main
   ```

## 📁 Files

- `index.html` - Page structure and content
- `style.css` - Styling with CSS custom properties
- `script.js` - Interactivity and dark mode toggle
- `DEPLOYMENT.md` - Detailed deployment and customization guide

## 🎨 Customization

### Basic Content
- **Hero Section**: Update your name and title
- **About**: Write your professional bio
- **Projects**: Add your featured projects with GitHub links
- **Skills**: List your technologies and tools
- **Contact**: Update email and social links

### Colors
Open `style.css` and edit these variables (lines 5-8):
```css
--color-primary: #3b82f6;        /* Blue */
--color-secondary: #10b981;      /* Green */
--color-accent: #f59e0b;         /* Amber */
```

## 📱 Responsive Breakpoints

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (480px - 767px)
- Small Mobile (<480px)

## 🌙 Dark Mode

- Automatic theme toggle in navbar
- User preference saved to browser
- Smooth transitions between themes

## 📧 Email Form

Currently simulates form submission. To make it functional:

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