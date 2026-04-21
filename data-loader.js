// DOM Selectors
const SELECTORS = {
    presentationContent: '#presentation-content',
    languagesContent: '#languages-content',
    softSkillsContent: '#softSkills-content',
    passionsContent: '#passions-content',
    experienceTimeline: '#experience-timeline',
    educationTimeline: '#education-timeline',
    certificationsList: '#certifications-list',
    skillsGrid: '#skills .skills-grid'
};

let portfolioData = null;
let originalPortfolioData = null;

// Function to get translated text
function getTranslatedText(key) {
    if (typeof translations !== 'undefined' && typeof currentLanguage !== 'undefined') {
        return translations[currentLanguage][key] || key;
    }
    return key;
}

// Function to translate portfolio data
function translatePortfolioData() {
    if (!originalPortfolioData) return;
    
    // Deep clone the original data
    portfolioData = JSON.parse(JSON.stringify(originalPortfolioData));
    
    const lang = typeof currentLanguage !== 'undefined' ? currentLanguage : 'en';
    const trans = typeof translations !== 'undefined' ? translations[lang] : {};
    
    // Translate profile status and description
    if (portfolioData?.profile) {
        portfolioData.profile.profileStatus = trans.profileStatus || portfolioData.profile.profileStatus;
        portfolioData.profile.description = trans.heroDescription || portfolioData.profile.description;
    }
    
    // Translate about me section
    if (portfolioData?.aboutMe) {
        // Presentation
        if (portfolioData.aboutMe.presentation) {
            portfolioData.aboutMe.presentation.content = trans.presentationContent || portfolioData.aboutMe.presentation.content;
        }
        
        // Languages
        if (portfolioData.aboutMe.languages?.items) {
            portfolioData.aboutMe.languages.items = portfolioData.aboutMe.languages.items.map(item => {
                if (item.name === 'French') {
                    return { ...item, detail: trans.native || item.detail };
                } else if (item.name === 'English') {
                    return { ...item, detail: trans.toeic || item.detail };
                }
                return item;
            });
        }
        
        // Soft Skills
        if (portfolioData.aboutMe.softSkills?.items) {
            portfolioData.aboutMe.softSkills.items = portfolioData.aboutMe.softSkills.items.map(skill => {
                const skillMap = {
                    'Leadership': { name: trans.leadership || 'Leadership', description: trans.teamCoordination || skill.description },
                    'Communication': { name: trans.communication || 'Communication', description: trans.clearEffective || skill.description },
                    'Problem Solving': { name: trans.problemSolving || 'Problem Solving', description: trans.creativeAnalytical || skill.description },
                    'Teamwork': { name: trans.teamwork || 'Teamwork', description: trans.collaborativeSupport || skill.description },
                    'Adaptability': { name: trans.adaptability || 'Adaptability', description: trans.quickLearner || skill.description },
                    'Time Management': { name: trans.timeManagement || 'Time Management', description: trans.efficientProject || skill.description }
                };
                return skillMap[skill.name] || skill;
            });
        }
        
        // Passions
        if (portfolioData.aboutMe.passions?.items) {
            portfolioData.aboutMe.passions.items = portfolioData.aboutMe.passions.items.map(passion => {
                const passionMap = {
                    'Athletics': { name: trans.athletics || 'Athletics', detail: trans.competitiveAthletics || passion.detail },
                    'Climbing': { name: trans.climbing || 'Climbing', detail: trans.competitiveClimbing || passion.detail },
                    'Volunteer at TGS 2025–2026': { name: trans.volunteerTGS || 'Volunteer at TGS 2025–2026', detail: trans.communityEngagement || passion.detail }
                };
                return passionMap[passion.name] || passion;
            });
        }
    }
    
    // Translate experience
    if (portfolioData?.experience) {
        portfolioData.experience = portfolioData.experience.map(exp => {
            if (exp.title === 'Backend Developer (Internship)') {
                return {
                    ...exp,
                    title: trans.backendDeveloper || exp.title,
                    company: trans.bleemeo || exp.company,
                    description: trans.bleemeoDesc || exp.description
                };
            }
            return exp;
        });
    }
    
    // Translate education
    if (portfolioData?.education) {
        portfolioData.education = portfolioData.education.map(edu => {
            const eduMap = {
                'Engineering Degree in Computer Science': { degree: trans.engineeringDegree || edu.degree, details: trans.speakingWeb || edu.details },
                'Baccalauréat général (General Studies)': { degree: trans.baccalaureate || edu.degree, details: trans.honors || edu.details }
            };
            if (eduMap[edu.degree]) {
                return { ...edu, ...eduMap[edu.degree] };
            }
            if (edu.school === 'EPITECH - Institut européen de technologie') {
                edu.school = trans.epitech || edu.school;
            } else if (edu.school === 'Lycée général Saint-Sernin') {
                edu.school = trans.lycee || edu.school;
            }
            return edu;
        });
    }
    
    // Translate skill categories
    if (portfolioData?.skillCategories) {
        portfolioData.skillCategories = portfolioData.skillCategories.map(cat => {
            const catMap = {
                'languages': trans.programmingLanguages || cat.title,
                'backend': trans.backendFrameworks || cat.title,
                'tools': trans.developmentTools || cat.title,
                'debug': trans.debugging || cat.title
            };
            return { ...cat, title: catMap[cat.id] || cat.title };
        });
    }
    
    // Translate certifications
    if (portfolioData?.certifications) {
        portfolioData.certifications = portfolioData.certifications.map(cert => {
            const certMap = {
                'Backend Development & REST APIs': { title: trans.backendRest || cert.title, description: trans.specializedExpertise || cert.description },
                'Python & Web Technologies': { title: trans.pythonWeb || cert.title, description: trans.proficientPython || cert.description },
                'Software Development Professional': { title: trans.softwareDeveloper || cert.title, description: trans.epitechStudent || cert.description }
            };
            return certMap[cert.title] || cert;
        });
    }
}

// Load data from JSON file and render portfolio
async function loadPortfolioData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`Failed to load data.json: ${response.status}`);
        }
        const data = await response.json();
        originalPortfolioData = data;
        
        // Translate data based on current language
        translatePortfolioData();
        
        loadProfileIcon();
        loadHeroDescription();
        renderAboutMe();
        renderExperience();
        renderEducation();
        renderCertifications();
        renderSkills();
        
        if (typeof initializeAboutMeTabs === 'function') {
            initializeAboutMeTabs();
        }
        
        if (typeof loadSkillIcons === 'function') {
            setTimeout(() => {
                loadSkillIcons();
            }, 100);
        }
    } catch (error) {
        console.error('Error loading portfolio data:', error);
    }
}

// Load and display profile status badge in navbar
function loadProfileIcon() {
    if (!portfolioData?.profile?.profileStatus) return;
    
    const statusElement = document.getElementById('profileStatusNav');
    if (statusElement) {
        statusElement.textContent = portfolioData.profile.profileStatus;
    }
}

// Load and display hero section description from JSON
function loadHeroDescription() {
    if (!portfolioData?.profile?.description) return;
    
    const heroDescriptionElement = document.getElementById('heroDescription');
    if (heroDescriptionElement) {
        heroDescriptionElement.textContent = portfolioData.profile.description;
    }
}

// Render About Me section with presentation, languages, skills, and passions
function renderAboutMe() {
    if (!portfolioData?.aboutMe) return;
    
    const aboutMe = portfolioData.aboutMe;

    // Presentation
    if (aboutMe.presentation) {
        const content = document.querySelector(SELECTORS.presentationContent);
        if (content) {
            content.innerHTML = `<p>${aboutMe.presentation.content}</p>`;
        }
    }

    // Languages
    if (aboutMe.languages) {
        const content = document.querySelector(SELECTORS.languagesContent);
        if (content) {
            let html = '<ul class="about-list">';
            aboutMe.languages.items.forEach(lang => {
                html += `
                    <li>
                        <span class="list-icon language-icon" data-language="${lang.name}"></span>
                        <strong>${lang.name}</strong> – ${lang.detail}
                    </li>
                `;
            });
            html += '</ul>';
            content.innerHTML = html;
        }
    }

    // Soft Skills
    if (aboutMe.softSkills) {
        const content = document.querySelector(SELECTORS.softSkillsContent);
        if (content) {
            let html = '<ul class="about-list">';
            aboutMe.softSkills.items.forEach(skill => {
                html += `
                    <li>
                        <span class="list-icon skill-icon-container" data-skill="${skill.name}"></span>
                        <strong>${skill.name}</strong> – ${skill.description}
                    </li>
                `;
            });
            html += '</ul>';
            content.innerHTML = html;
        }
    }

    // Passions
    if (aboutMe.passions) {
        const content = document.querySelector(SELECTORS.passionsContent);
        if (content) {
            let html = '<ul class="about-list">';
            aboutMe.passions.items.forEach(passion => {
                html += `<li><strong>${passion.name}</strong> – ${passion.detail}</li>`;
            });
            html += '</ul>';
            content.innerHTML = html;
        }
    }
}

// Render Experience section from portfolio data
function renderExperience() {
    if (!portfolioData?.experience) return;
    
    const experienceTimeline = document.querySelector(SELECTORS.experienceTimeline);
    if (!experienceTimeline) return;
    
    experienceTimeline.innerHTML = '';
    
    portfolioData.experience.forEach(exp => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <h4 class="experience-title">${exp.title}</h4>
                <p class="experience-company">${exp.company}</p>
                <p class="experience-date">${exp.dateStart} - ${exp.dateEnd}</p>
                <p class="experience-description">${exp.description}</p>
            </div>
        `;
        experienceTimeline.appendChild(timelineItem);
    });
}

// Render Education section from portfolio data
function renderEducation() {
    if (!portfolioData?.education) return;
    
    const educationTimeline = document.querySelector(SELECTORS.educationTimeline);
    if (!educationTimeline) return;
    
    educationTimeline.innerHTML = '';
    
    portfolioData.education.forEach(edu => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <h4 class="education-degree">${edu.degree}</h4>
                <p class="education-school">${edu.school}</p>
                <p class="education-date">${edu.dateStart} - ${edu.dateEnd}</p>
                <p class="education-details">${edu.details}</p>
            </div>
        `;
        educationTimeline.appendChild(timelineItem);
    });
}

// Render Certifications section from portfolio data
function renderCertifications() {
    if (!portfolioData?.certifications) return;
    
    const certificationsList = document.querySelector(SELECTORS.certificationsList);
    if (!certificationsList) return;
    
    certificationsList.innerHTML = '';
    
    portfolioData.certifications.forEach(cert => {
        const certItem = document.createElement('div');
        certItem.className = 'certification-item';
        certItem.innerHTML = `
            <span class="certification-badge">✓</span>
            <div>
                <h4>${cert.title}</h4>
                <p class="certification-date">${cert.description}</p>
            </div>
        `;
        certificationsList.appendChild(certItem);
    });
}

// Render Skills section with categories from portfolio data
function renderSkills() {
    if (!portfolioData?.skills) return;
    
    const skillsSection = document.querySelector(SELECTORS.skillsGrid);
    if (!skillsSection) return;
    
    skillsSection.innerHTML = '';
    
    const skillCategories = portfolioData.skillCategories || [
        { id: 'languages', title: 'Programming Languages' },
        { id: 'backend', title: 'Backend Frameworks & Tools' },
        { id: 'tools', title: 'Development Tools & Debugging' }
    ];
    
    skillCategories.forEach(category => {
        if (!portfolioData.skills[category.id]) return;
        
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'skill-category';
        
        let skillsList = '<h3 class="skill-category-title">' + category.title + '</h3>';
        skillsList += '<ul class="skill-list" data-category="' + category.id + '">';
        
        portfolioData.skills[category.id].forEach(skill => {
            skillsList += `
                <li class="skill-item" data-skill="${skill.name}">
                    <span class="skill-icon skill-icon-container"></span>
                    <span class="skill-name">${skill.name}</span>
                </li>
            `;
        });
        
        skillsList += '</ul>';
        categoryDiv.innerHTML = skillsList;
        skillsSection.appendChild(categoryDiv);
    });
}

// Update page title with profile information
function updateProfileMeta() {
    if (!portfolioData?.profile) return;
    
    const { name, title } = portfolioData.profile;
    document.title = `${name} - ${title}`;
}

// Load portfolio on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadPortfolioData();
        updateProfileMeta();
    });
} else {
    loadPortfolioData();
    updateProfileMeta();
}

// Update portfolio data and re-render sections
function updatePortfolioData(newData) {
    portfolioData = { ...portfolioData, ...newData };
    renderExperience();
    renderEducation();
    renderCertifications();
    renderSkills();
    if (typeof loadSkillIcons === 'function') {
        setTimeout(() => loadSkillIcons(), 50);
    }
}

// Add new experience entry
function addExperience(experience) {
    if (!portfolioData) portfolioData = {};
    if (!portfolioData.experience) portfolioData.experience = [];
    portfolioData.experience.push(experience);
    renderExperience();
}

// Add new education entry
function addEducation(education) {
    if (!portfolioData) portfolioData = {};
    if (!portfolioData.education) portfolioData.education = [];
    portfolioData.education.push(education);
    renderEducation();
}

// Add new certification entry
function addCertification(certification) {
    if (!portfolioData) portfolioData = {};
    if (!portfolioData.certifications) portfolioData.certifications = [];
    portfolioData.certifications.push(certification);
    renderCertifications();
}

// Add new skill to a category
function addSkill(category, skill) {
    if (!portfolioData?.skills) return;
    if (!portfolioData.skills[category]) portfolioData.skills[category] = [];
    portfolioData.skills[category].push(skill);
    renderSkills();
    if (typeof loadSkillIcons === 'function') {
        setTimeout(() => loadSkillIcons(), 50);
    }
}
