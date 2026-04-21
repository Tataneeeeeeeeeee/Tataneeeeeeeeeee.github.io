/**
 * ===========================
 * ICON MANAGEMENT MODULE
 * ===========================
 * 
 * Manages SVG icons from Devicon and custom SVG icons for skills and technologies.
 * Uses Devicon CDN for consistent, professional icon styling.
 */

// Devicon CDN base URL - provides high-quality SVG icons for technologies
const DEVICON_CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

/**
 * Skill icon mapping with Devicon paths and fallback colors
 * Format: { skillName: { name, class, color } }
 */
const SKILL_ICONS = {
    // Languages (with flag emojis)
    'French': { name: 'french', emoji: '🇫🇷', color: '#4169E1' },
    'English': { name: 'english', emoji: '🇬🇧', color: '#4169E1' },
    
    // Soft Skills (with emoji icons)
    'Leadership': { name: 'leadership', emoji: '👥', color: '#8b5cf6' },
    'Communication': { name: 'communication', emoji: '💬', color: '#3b82f6' },
    'Problem Solving': { name: 'problem-solving', emoji: '🧩', color: '#f59e0b' },
    'Teamwork': { name: 'teamwork', emoji: '🤝', color: '#10b981' },
    'Adaptability': { name: 'adaptability', emoji: '⚡', color: '#ef4444' },
    'Time Management': { name: 'time-management', emoji: '⏱️', color: '#06b6d4' },
    
    // Frontend Technologies
    'React': { name: 'react', folder: 'react', color: '#61dafb' },
    'Vue.js': { name: 'vue', folder: 'vuejs', color: '#4fc08d' },
    'Vue': { name: 'vue', folder: 'vuejs', color: '#4fc08d' },
    'TypeScript': { name: 'typescript', folder: 'typescript', color: '#3178c6' },
    'CSS / SASS': { name: 'sass', folder: 'sass', color: '#cc6699' },
    'SASS': { name: 'sass', folder: 'sass', color: '#cc6699' },
    'Tailwind CSS': { name: 'tailwindcss', folder: 'tailwindcss', color: '#06b6d4' },
    'JavaScript': { name: 'javascript', folder: 'javascript', color: '#f7df1e' },
    'HTML': { name: 'html5', folder: 'html5', color: '#e34c26' },
    'Responsive Design': { name: 'responsive', folder: 'html5', color: '#3498db' },

    // Backend Technologies
    'Node.js': { name: 'nodejs', folder: 'nodejs', color: '#68a063' },
    'Express.js': { name: 'express', folder: 'express', color: '#ffffff' },
    'Express': { name: 'express', folder: 'express', color: '#ffffff' },
    'Python': { name: 'python', folder: 'python', color: '#3776ab' },
    'Firebase': { name: 'firebase', folder: 'firebase', color: '#ffa726' },
    'PostgreSQL': { name: 'postgresql', folder: 'postgresql', color: '#336791' },
    'MongoDB': { name: 'mongodb', folder: 'mongodb', color: '#13aa52' },
    'MySQL': { name: 'mysql', folder: 'mysql', color: '#00758f' },
    'Django REST Framework': { name: 'django', folder: 'django', color: '#092e20' },
    'OAuth & Authentication': { name: 'oauth', folder: 'oauth', color: '#eb5424' },
    'SQL': { name: 'mysql', folder: 'mysql', color: '#00758f' },
    'SQL Databases': { name: 'mysql', folder: 'mysql', color: '#00758f' },
    'RESTful APIs': { name: 'restapi', folder: 'rest', color: '#3498db' },
    'API Design & Development': { name: 'restapi', folder: 'rest', color: '#3498db' },

    // Programming Languages
    'C': { name: 'c', folder: 'c', color: '#a8b9cc' },
    'C / CSFML': { name: 'c', folder: 'c', color: '#a8b9cc' },
    'C++': { name: 'cplusplus', folder: 'cplusplus', color: '#00599c' },
    'Rust': { name: 'rust', folder: 'rust', color: '#ce412b' },
    'Haskell': { name: 'haskell', folder: 'haskell', color: '#5e5086' },
    'Bash': { name: 'bash', folder: 'bash', color: '#4eaa25' },
    'Bash / Unix': { name: 'bash', folder: 'bash', color: '#4eaa25' },

    // DevOps & Tools
    'Git': { name: 'git', folder: 'git', color: '#f1502f' },
    'GitHub': { name: 'github', folder: 'github', color: '#181717' },
    'Git / GitHub': { name: 'github', folder: 'github', color: '#181717' },
    'Git & Version Control': { name: 'github', folder: 'github', color: '#181717' },
    'Docker': { name: 'docker', folder: 'docker', color: '#2496ed' },
    'AWS': { name: 'amazonwebservices', folder: 'amazonwebservices', color: '#ff9900' },
    'CI/CD': { name: 'githubactions', folder: 'githubactions', color: '#2088f0' },
    'Testing (Jest, Cypress)': { name: 'jest', folder: 'jest', color: '#15c213' },
    'Jest': { name: 'jest', folder: 'jest', color: '#15c213' },
    'Webpack': { name: 'webpack', folder: 'webpack', color: '#8dd6f9' },
    'Vite': { name: 'vitejs', folder: 'vitejs', color: '#646cff' },
    'Webpack / Vite': { name: 'vitejs', folder: 'vitejs', color: '#646cff' },
    'VSCode': { name: 'vscode', folder: 'vscode', color: '#007acc' },
    'CLion IDE': { name: 'clion', folder: 'clion', color: '#000000' },
    'Valgrind & Memory Analysis': { name: 'linux', folder: 'linux', color: '#fcc624' },
    'AddressSanitizer (Libasan)': { name: 'gcc', folder: 'gcc', color: '#a3c51c' },
    'Makefile & Build Systems': { name: 'cmake', folder: 'cmake', color: '#064f8c' },
};

/**
 * Gets the icon URL for a skill from Devicon CDN
 * @param {string} skillName - Name of the skill
 * @param {string} size - Size of icon ('original', 'plain', 'plain-wordmark') default: 'original'
 * @returns {string} URL to the SVG icon
 */
function getSkillIconUrl(skillName, size = 'original') {
    const iconData = SKILL_ICONS[skillName];
    if (!iconData) {
        return null;
    }
    return `${DEVICON_CDN}/${iconData.folder}/${iconData.name}-${size}.svg`;
}

/**
 * Gets color associated with a skill
 * @param {string} skillName - Name of the skill
 * @returns {string} Hex color code
 */
function getSkillColor(skillName) {
    const iconData = SKILL_ICONS[skillName];
    return iconData ? iconData.color : '#6b7280';
}

/**
 * Creates an SVG img element for a skill
 * @param {string} skillName - Name of the skill
 * @param {number} size - Size in pixels (default: 24)
 * @returns {HTMLElement} img element with the icon loaded
 */
function createSkillIconElement(skillName, size = 24) {
    const iconData = SKILL_ICONS[skillName];
    
    // If skill has emoji, create emoji element
    if (iconData && iconData.emoji) {
        const span = document.createElement('span');
        span.className = 'skill-emoji-icon';
        span.textContent = iconData.emoji;
        span.style.fontSize = `${size}px`;
        span.style.lineHeight = '1';
        return span;
    }
    
    const img = document.createElement('img');
    const iconUrl = getSkillIconUrl(skillName);
    
    if (!iconUrl) {
        // Fallback: create a placeholder if icon not found
        const span = document.createElement('span');
        span.textContent = '📦';
        span.className = 'skill-icon-missing';
        return span;
    }
    
    img.src = iconUrl;
    img.alt = skillName;
    img.className = 'skill-svg-icon';
    img.style.width = `${size}px`;
    img.style.height = `${size}px`;
    img.loading = 'lazy';
    
    return img;
}

/**
 * Creates an inline SVG icon HTML string for a skill
 * (useful when you need HTML string instead of DOM element)
 * @param {string} skillName - Name of the skill
 * @param {number} size - Size in pixels (default: 24)
 * @returns {string} HTML img tag as string
 */
function getSkillIconHTML(skillName, size = 24) {
    const iconUrl = getSkillIconUrl(skillName);
    if (!iconUrl) {
        return `<span class="skill-icon-placeholder">📦</span>`;
    }
    return `<img src="${iconUrl}" alt="${skillName}" class="skill-svg-icon" width="${size}" height="${size}" loading="lazy" />`;
}

/**
 * Gets icon data (useful for direct manipulation or styling)
 * @param {string} skillName - Name of the skill
 * @returns {Object|null} Icon data object or null if not found
 */
function getSkillIconData(skillName) {
    return SKILL_ICONS[skillName] || null;
}

/**
 * Get all available skill names
 * @returns {Array<string>} Array of all skill names in the mapping
 */
function getAllSkillNames() {
    return Object.keys(SKILL_ICONS);
}

/**
 * Checks if a skill has an icon defined
 * @param {string} skillName - Name of the skill
 * @returns {boolean} True if skill icon exists
 */
function hasSkillIcon(skillName) {
    return skillName in SKILL_ICONS;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getSkillIconUrl,
        getSkillColor,
        createSkillIconElement,
        getSkillIconHTML,
        getSkillIconData,
        getAllSkillNames,
        hasSkillIcon,
        SKILL_ICONS,
    };
}
