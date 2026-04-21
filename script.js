// DOM Selectors
const DOM = {
    themeToggle: document.getElementById('themeToggle'),
    languageToggle: document.getElementById('languageToggle'),
    hamburger: document.querySelector('.hamburger'),
    navMenu: document.querySelector('.nav-menu'),
    navLinks: document.querySelectorAll('.nav-link'),
    contactForm: document.getElementById('contactForm'),
    formNote: document.getElementById('formNote'),
    navbar: document.querySelector('.navbar'),
    sections: document.querySelectorAll('section[id]')
};

// Theme Management
function initTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon();
    }

    DOM.themeToggle?.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateThemeIcon();
}

function updateThemeIcon() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const icon = DOM.themeToggle?.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = isDarkMode ? '☀️' : '🌙';
    }
}

// Language Management
const translations = {
    en: {
        home: 'Home',
        about: 'About',
        career: 'Career',
        projects: 'Projects',
        skills: 'Skills',
        contact: 'Contact',
        heroTitle: 'Ethan VERT-FOREST',
        heroSubtitle: 'Backend Developer & Tech Enthusiast',
        viewMyWork: 'View My Work',
        getInTouch: 'Get In Touch',
        yearsOfCoding: 'Years Coding',
        projectsDone: 'Projects Done',
        technologies: 'Technologies',
        aboutMe: 'About Me',
        presentation: 'Presentation',
        languages: 'Languages',
        softSkills: 'Soft Skills',
        passions: 'Passions',
        careerEducation: 'Career & Education',
        professionalExperience: 'Professional Experience',
        education: 'Education',
        certificationsAchievements: 'Certifications & Achievements',
        featuredProjects: 'Featured Projects',
        skillsTechnologies: 'Skills & Technologies',
        getInTouchSection: 'Get In Touch',
        connectWithMe: 'Connect With Me',
        sendMessage: 'Send Me a Message',
        yourName: 'Your Name',
        yourEmail: 'Your Email',
        yourMessage: 'Your message...',
        sendButton: 'Send Message',
        thankYouMessage: 'Thank you! Your message has been sent successfully.',
        errorMessage: 'Something went wrong. Please try again later.',
        // Data translations
        profileStatus: 'Available',
        french: 'French',
        english: 'English',
        native: 'Native',
        toeic: 'TOEIC score: 700',
        leadership: 'Leadership',
        teamCoordination: 'Team coordination and decision-making',
        communication: 'Communication',
        clearEffective: 'Clear and effective communication',
        problemSolving: 'Problem Solving',
        creativeAnalytical: 'Creative and analytical thinking',
        teamwork: 'Teamwork',
        collaborativeSupport: 'Collaborative and supportive approach',
        adaptability: 'Adaptability',
        quickLearner: 'Quick learner in new environments',
        timeManagement: 'Time Management',
        efficientProject: 'Efficient project organization',
        athletics: 'Athletics',
        competitiveAthletics: 'Competitive level for 5 years',
        climbing: 'Climbing',
        competitiveClimbing: 'Competitive level for 4 years',
        volunteerTGS: 'Volunteer at TGS 2025–2026',
        communityEngagement: 'Community engagement and contribution',
        backendDeveloper: 'Backend Developer (Internship)',
        bleemeo: 'Bleemeo',
        bleemeoDesc: 'Actively participated in backend development and tool improvement within the technical team. Created a Microsoft Teams bot for automated notifications, developed an MCP server for external API interaction with secure authentication, added features and fixed bugs on existing services, and collaborated on code reviews and technical documentation.',
        engineeringDegree: 'Engineering Degree in Computer Science',
        epitech: 'EPITECH - Institut européen de technologie',
        speakingWeb: 'Specializing in web development and backend technologies',
        baccalaureate: 'Baccalauréat général (General Studies)',
        lycee: 'Lycée général Saint-Sernin',
        honors: 'Honors: Mention bien (Honours degree)',
        programmingLanguages: 'Programming Languages',
        backendFrameworks: 'Backend Frameworks & Tools',
        developmentTools: 'Development Tools',
        debugging: 'Debugging',
        backendRest: 'Backend Development & REST APIs',
        specializedExpertise: 'Specialized expertise in Django and FastAPI',
        pythonWeb: 'Python & Web Technologies',
        proficientPython: 'Proficient in Python, JavaScript, and modern frameworks',
        softwareDeveloper: 'Software Development Professional',
        epitechStudent: 'EPITECH Engineering Student • Ongoing Projects',
        heroDescription: "I'm Ethan, a third-year computer science student at EPITECH (2024-2029). I've been passionate about technology and coding since childhood, starting my journey with small projects in middle school. Now, I'm deeply engaged in the tech ecosystem, working on scalable backend solutions and exploring the latest technologies. Based in Toulouse, France, I'm driven by the challenge of solving complex problems through clean, collaborative code.",
        presentationContent: "I'm a third-year computer science student at Epitech with a lifelong passion for technology. I've been coding since childhood and started building real projects in middle school. Today, I'm deeply invested in the tech ecosystem, constantly exploring new technologies, best practices, and ways to create elegant solutions to complex problems. I believe in continuous learning and the power of collaborative development."
    },
    fr: {
        home: 'Accueil',
        about: 'À propos',
        career: 'Carrière',
        projects: 'Projets',
        skills: 'Compétences',
        contact: 'Contact',
        heroTitle: 'Ethan VERT-FOREST',
        heroSubtitle: 'Développeur Backend & Passionné par la Technologie',
        viewMyWork: 'Voir mon travail',
        getInTouch: 'Entrer en contact',
        yearsOfCoding: 'Ans de codage',
        projectsDone: 'Projets réalisés',
        technologies: 'Technologies',
        aboutMe: 'À propos de moi',
        presentation: 'Présentation',
        languages: 'Langues',
        softSkills: 'Compétences non techniques',
        passions: 'Passions',
        careerEducation: 'Carrière & Éducation',
        professionalExperience: 'Expérience professionnelle',
        education: 'Éducation',
        certificationsAchievements: 'Certifications & Réalisations',
        featuredProjects: 'Projets en vedette',
        skillsTechnologies: 'Compétences & Technologies',
        getInTouchSection: 'Entrer en contact',
        connectWithMe: 'Connectez-vous avec moi',
        sendMessage: 'Envoyez-moi un message',
        yourName: 'Votre nom',
        yourEmail: 'Votre email',
        yourMessage: 'Votre message...',
        sendButton: 'Envoyer le message',
        thankYouMessage: 'Merci ! Votre message a été envoyé avec succès.',
        errorMessage: 'Une erreur est survenue. Veuillez réessayer plus tard.',
        // Data translations
        profileStatus: 'Disponible',
        french: 'Français',
        english: 'Anglais',
        native: 'Natif',
        toeic: 'Score TOEIC : 700',
        leadership: 'Leadership',
        teamCoordination: 'Coordination d\'équipe et prise de décision',
        communication: 'Communication',
        clearEffective: 'Communication claire et efficace',
        problemSolving: 'Résolution de problèmes',
        creativeAnalytical: 'Réflexion créative et analytique',
        teamwork: 'Travail en équipe',
        collaborativeSupport: 'Approche collaborative et solidaire',
        adaptability: 'Adaptabilité',
        quickLearner: 'Apprenti rapide dans de nouveaux environnements',
        timeManagement: 'Gestion du temps',
        efficientProject: 'Organisation efficace des projets',
        athletics: 'Athlétisme',
        competitiveAthletics: 'Niveau compétitif depuis 5 ans',
        climbing: 'Escalade',
        competitiveClimbing: 'Niveau compétitif depuis 4 ans',
        volunteerTGS: 'Bénévole à TGS 2025–2026',
        communityEngagement: 'Engagement communautaire et contribution',
        backendDeveloper: 'Développeur Backend (Stage)',
        bleemeo: 'Bleemeo',
        bleemeoDesc: 'Participation active au développement backend et à l\'amélioration des outils au sein de l\'équipe technique. Création d\'un bot Microsoft Teams pour les notifications automatisées, développement d\'un serveur MCP pour l\'interaction avec des API externes avec authentification sécurisée, ajout de fonctionnalités et correction de bugs sur les services existants, et collaboration sur les revues de code et la documentation technique.',
        engineeringDegree: 'Diplôme d\'ingénieur en informatique',
        epitech: 'EPITECH - Institut européen de technologie',
        speakingWeb: 'Spécialisation en développement web et technologies backend',
        baccalaureate: 'Baccalauréat général',
        lycee: 'Lycée général Saint-Sernin',
        honors: 'Mentions : Mention bien (Diplôme avec distinction)',
        programmingLanguages: 'Langages de programmation',
        backendFrameworks: 'Frameworks & Outils Backend',
        developmentTools: 'Outils de développement',
        debugging: 'Débogage',
        backendRest: 'Développement Backend & APIs REST',
        specializedExpertise: 'Expertise spécialisée en Django et FastAPI',
        pythonWeb: 'Python & Technologies Web',
        proficientPython: 'Proficient en Python, JavaScript et frameworks modernes',
        softwareDeveloper: 'Professionnel du développement logiciel',
        epitechStudent: 'Étudiant EPITECH • Projets en cours',
        heroDescription: "Je suis Ethan, étudiant en troisième année d'informatique à EPITECH (2024-2029). Je suis passionné par la technologie et le codage depuis l'enfance, ayant commencé mon parcours avec de petits projets au collège. Aujourd'hui, je suis profondément impliqué dans l'écosystème technologique, travaillant sur des solutions backend évolutives et explorant les dernières technologies. Basé à Toulouse, en France, je suis motivé par le défi de résoudre des problèmes complexes grâce à un code propre et collaboratif.",
        presentationContent: "Je suis étudiant en troisième année d'informatique à EPITECH avec une passion de toute une vie pour la technologie. J'ai commencé à coder depuis l'enfance et j'ai construit mes premiers vrais projets au collège. Aujourd'hui, je suis profondément investi dans l'écosystème technologique, explorant constamment les nouvelles technologies, les meilleures pratiques et les moyens de créer des solutions élégantes à des problèmes complexes. Je crois à l'apprentissage continu et au pouvoir du développement collaboratif."
    }
};

let currentLanguage = localStorage.getItem('language') || 'en';

function initLanguage() {
    setLanguage(currentLanguage);
    DOM.languageToggle?.addEventListener('click', toggleLanguage);
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'fr' : 'en';
    localStorage.setItem('language', currentLanguage);
    setLanguage(currentLanguage).catch(err => console.error('Error changing language:', err));
}

async function setLanguage(lang) {
    currentLanguage = lang;
    
    // Update language button
    if (DOM.languageToggle) {
        DOM.languageToggle.querySelector('.language-text').textContent = lang.toUpperCase();
    }
    
    // Update navigation links
    const navTexts = {
        home: translations[lang].home,
        about: translations[lang].about,
        career: translations[lang].career,
        projects: translations[lang].projects,
        skills: translations[lang].skills,
        contact: translations[lang].contact
    };
    
    DOM.navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#home') link.textContent = navTexts.home;
        else if (href === '#about') link.textContent = navTexts.about;
        else if (href === '#career') link.textContent = navTexts.career;
        else if (href === '#projects') link.textContent = navTexts.projects;
        else if (href === '#skills') link.textContent = navTexts.skills;
        else if (href === '#contact') link.textContent = navTexts.contact;
    });
    
    // Update section titles
    updateSectionTitles(lang);
    updateFormText(lang);
    updateHeroSection(lang);
    
    // Reload and translate portfolio data
    if (typeof loadPortfolioData === 'function') {
        await loadPortfolioData();
        // Re-update section titles after data is loaded to ensure all elements are present
        updateSectionTitles(lang);
    }
}

function updateHeroSection(lang) {
    const heroTitle = document.querySelector('.hero-title .highlight');
    const heroSubtitle = document.querySelector('.hero-subtitle .subtitle-blue');
    const statLabels = document.querySelectorAll('.stat-label');
    const heroButtons = document.querySelectorAll('.hero-buttons .btn span:first-child');
    
    if (heroTitle) heroTitle.textContent = translations[lang].heroTitle;
    if (heroSubtitle) heroSubtitle.textContent = translations[lang].heroSubtitle;
    
    if (statLabels[0]) statLabels[0].textContent = translations[lang].yearsOfCoding;
    if (statLabels[1]) statLabels[1].textContent = translations[lang].projectsDone;
    if (statLabels[2]) statLabels[2].textContent = translations[lang].technologies;
    
    // Update hero buttons
    if (heroButtons[0]) heroButtons[0].textContent = translations[lang].viewMyWork;
    if (heroButtons[1]) heroButtons[1].textContent = translations[lang].getInTouch;
}

function updateSectionTitles(lang) {
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        if (title.textContent.includes('About')) {
            title.textContent = translations[lang].aboutMe;
        } else if (title.textContent.includes('Career')) {
            title.textContent = translations[lang].careerEducation;
        } else if (title.textContent.includes('Featured')) {
            title.textContent = translations[lang].featuredProjects;
        } else if (title.textContent.includes('Skills')) {
            title.textContent = translations[lang].skillsTechnologies;
        } else if (title.textContent.includes('Get In Touch')) {
            title.textContent = translations[lang].getInTouchSection;
        }
    });
    
    // Update about tabs
    const aboutTabs = document.querySelectorAll('.about-tab-btn');
    aboutTabs.forEach(tab => {
        const dataTab = tab.getAttribute('data-tab');
        if (dataTab === 'presentation') tab.textContent = translations[lang].presentation;
        else if (dataTab === 'languages') tab.textContent = translations[lang].languages;
        else if (dataTab === 'softSkills') tab.textContent = translations[lang].softSkills;
        else if (dataTab === 'passions') tab.textContent = translations[lang].passions;
    });
    
    // Update card titles
    const cardTitles = document.querySelectorAll('.card-title');
    cardTitles.forEach(title => {
        if (title.textContent.includes('Professional')) {
            title.innerHTML = title.innerHTML.replace(/Professional Experience/, translations[lang].professionalExperience);
        } else if (title.textContent.includes('Education')) {
            title.innerHTML = title.innerHTML.replace(/Education/, translations[lang].education);
        } else if (title.textContent.includes('Certifications')) {
            title.innerHTML = title.innerHTML.replace(/Certifications.*/, translations[lang].certificationsAchievements);
        }
    });
}

function updateFormText(lang) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const sendBtn = document.querySelector('.contact-form button');
    const contactSubtitle = document.querySelector('.contact-subtitle');
    const formTitle = document.querySelector('.contact-form-title');
    const socialTitle = document.querySelector('.contact-links-title');
    
    if (nameInput) nameInput.placeholder = translations[lang].yourName;
    if (emailInput) emailInput.placeholder = translations[lang].yourEmail;
    if (messageInput) messageInput.placeholder = translations[lang].yourMessage;
    if (sendBtn) sendBtn.textContent = translations[lang].sendButton;
    if (formTitle) {
        formTitle.textContent = translations[lang].sendMessage;
    }
    if (socialTitle) {
        socialTitle.textContent = translations[lang].connectWithMe;
    }
}

// Mobile Navigation Management
function initMobileMenu() {
    DOM.hamburger?.addEventListener('click', () => {
        DOM.navMenu?.classList.toggle('active');
    });

    DOM.navLinks.forEach(link => {
        link.addEventListener('click', () => {
            DOM.navMenu?.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            DOM.navMenu?.classList.remove('active');
        }
    });
}

// Smooth Scrolling Navigation
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Contact Form Handling
function initContactForm() {
    DOM.contactForm?.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name')?.value,
        email: document.getElementById('email')?.value,
        message: document.getElementById('message')?.value
    };
    
    if (!formData.name || !formData.email || !formData.message) {
        showFormMessage('Please fill in all fields', 'error');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showFormMessage('Please enter a valid email address', 'error');
        return;
    }
    
    try {
        await simulateFormSubmission(formData);
        showFormMessage(translations[currentLanguage].thankYouMessage, 'success');
        DOM.contactForm?.reset();
    } catch (error) {
        showFormMessage(translations[currentLanguage].errorMessage, 'error');
    }
}

function showFormMessage(message, type) {
    if (!DOM.formNote) return;
    DOM.formNote.textContent = message;
    DOM.formNote.className = `form-note ${type}`;
    DOM.formNote.style.display = 'block';
    
    setTimeout(() => {
        DOM.formNote.style.display = 'none';
    }, 5000);
}

function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 500);
    });
}

// Animation Observers
function initAnimationObservers() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-category, .project-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
}

// Navbar Shadow on Scroll
function initNavbarShadow() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            DOM.navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            DOM.navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
    });
}

// Active Navigation Link Highlighting
function initActiveNavigation() {
    const navActiveObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    DOM.navLinks.forEach(link => {
                        link.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
                    });
                    
                    const activeLink = document.querySelector(`a[href="#${entry.target.id}"]`);
                    if (activeLink) {
                        activeLink.style.color = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
                    }
                }
            });
        },
        { threshold: 0.3 }
    );

    DOM.sections.forEach(section => {
        navActiveObserver.observe(section);
    });
}

// Expand/Collapse Functionality
function initExpandButtons() {
    const expandButtons = document.querySelectorAll('.expand-btn');

    expandButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (!targetElement) return;
            
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', !isExpanded);
            
            if (isExpanded) {
                targetElement.style.maxHeight = targetElement.scrollHeight + 'px';
                setTimeout(() => {
                    targetElement.style.maxHeight = '0';
                    targetElement.style.opacity = '0';
                }, 10);
            } else {
                targetElement.style.maxHeight = '0';
                targetElement.style.opacity = '0';
                targetElement.style.overflow = 'hidden';
                targetElement.style.transition = 'max-height 0.3s ease-out, opacity 0.3s ease-out';
                
                setTimeout(() => {
                    targetElement.style.maxHeight = targetElement.scrollHeight + 'px';
                    targetElement.style.opacity = '1';
                }, 10);
            }
        });
    });
}

// Initialize About Me Tabs
function initializeAboutMeTabs() {
    const tabButtons = document.querySelectorAll('.about-tab-btn');
    const tabPanes = document.querySelectorAll('.about-tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            button.classList.add('active');
            const activePane = document.querySelector(`.about-tab-pane[data-tab="${tabName}"]`);
            if (activePane) {
                activePane.classList.add('active');
            }
        });
    });
}

// Initialize all features
function initializeApp() {
    initTheme();
    initLanguage();
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initAnimationObservers();
    initNavbarShadow();
    initActiveNavigation();
    initExpandButtons();
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
