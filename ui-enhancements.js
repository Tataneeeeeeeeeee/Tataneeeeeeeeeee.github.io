/**
 * ===========================
 * UI ENHANCEMENTS MODULE
 * ===========================
 * 
 * Handles dynamic UI updates including:
 * - Skill icon loading from Devicon CDN
 * - Project detail modal management
 * - Loading states and animations
 */

// ===========================
// UTILITY FUNCTIONS
// ===========================

/**
 * Escapes HTML characters to prevent injection attacks
 */
function escapeHtmlLocal(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Formats large numbers (1000 → 1k, 1000000 → 1m)
 * @param {number} num - The number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
}

// ===========================
// SKILL ICONS LOADER
// ===========================

/**
 * Loads SVG icons for all skill items on page load
 * Replaces placeholder skill-icon-container spans with actual images
 */
function loadSkillIcons() {
    console.log('🎨 loadSkillIcons() started');
    
    // Load icons for regular skill items (skills grid)
    const skillItems = document.querySelectorAll('.skill-item[data-skill]');
    console.log('Found skill items:', skillItems.length);
    
    skillItems.forEach(item => {
        const skillName = item.getAttribute('data-skill');
        const iconContainer = item.querySelector('.skill-icon-container');
        
        if (!iconContainer) return;
        
        // Clear existing icons first to prevent duplicates
        iconContainer.innerHTML = '';
        
        // Create and set the icon image
        const img = createSkillIconElement(skillName, 28);
        iconContainer.appendChild(img);
    });
    
    // Load icons for soft skill cards
    const skillCards = document.querySelectorAll('.skill-card .skill-icon-container[data-skill]');
    console.log('Found skill cards:', skillCards.length);
    
    skillCards.forEach(container => {
        const skillName = container.getAttribute('data-skill');
        
        // Clear existing icons first to prevent duplicates
        container.innerHTML = '';
        
        // Create and set the icon image
        const img = createSkillIconElement(skillName, 32);
        container.appendChild(img);
    });
    
    // Load icons for soft skills in list (about section)
    const listSkillIcons = document.querySelectorAll('.about-list .skill-icon-container[data-skill]');
    console.log('Found soft skills in list:', listSkillIcons.length);
    
    listSkillIcons.forEach(container => {
        const skillName = container.getAttribute('data-skill');
        console.log('Loading icon for skill:', skillName);
        
        // Clear existing icons first to prevent duplicates
        container.innerHTML = '';
        
        // Create and set the icon image
        const img = createSkillIconElement(skillName, 20);
        if (img) {
            container.appendChild(img);
            console.log('Icon added for:', skillName);
        }
    });
    
    // Load icons for languages in list (about section)
    const languageIcons = document.querySelectorAll('.language-icon[data-language]');
    console.log('Found languages:', languageIcons.length);
    
    languageIcons.forEach(container => {
        const languageName = container.getAttribute('data-language');
        console.log('Loading icon for language:', languageName);
        
        // Clear existing icons first to prevent duplicates
        container.innerHTML = '';
        
        // Create and set the icon image
        const img = createSkillIconElement(languageName, 20);
        if (img) {
            container.appendChild(img);
            console.log('Icon added for:', languageName);
        }
    });
    
    console.log(`✅ Loaded icons for ${skillItems.length + skillCards.length + listSkillIcons.length + languageIcons.length} items`);
}

// ===========================
// PROJECT DETAIL MODAL
// ===========================

/**
 * Creates and initializes the project detail modal in the DOM
 */
function initProjectDetailModal() {
    // Check if modal already exists
    if (document.getElementById('projectDetailModal')) {
        return;
    }
    
    const modalHTML = `
        <div id="projectDetailModal" class="modal" style="display: none;">
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close" aria-label="Close modal">&times;</button>
                
                <div class="modal-header">
                    <h2 class="modal-title" id="modalProjectTitle">Loading...</h2>
                    <a id="modalGithubLink" href="#" class="modal-github-link" target="_blank" rel="noopener noreferrer">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        View on GitHub
                    </a>
                </div>

                <!-- Modal Tabs Navigation -->
                <div class="modal-tabs">
                    <button class="modal-tab-btn active" data-tab="overview">Overview</button>
                    <button class="modal-tab-btn" data-tab="readme">README</button>
                    <button class="modal-tab-btn" data-tab="releases">Releases</button>
                    <button class="modal-tab-btn" data-tab="languages">Languages</button>
                    <button class="modal-tab-btn" data-tab="topics">Topics</button>
                </div>

                <div class="modal-body">
                    <!-- OVERVIEW TAB -->
                    <div class="modal-tab-content active" id="tab-overview">
                        <!-- Project Stats -->
                        <div class="project-detail-stats">
                            <div class="stat-item">
                                <span class="stat-icon">⭐</span>
                                <div>
                                    <p class="stat-label">Stars</p>
                                    <p class="stat-value" id="modalStars">0</p>
                                </div>
                            </div>
                            <div class="stat-item">
                                <span class="stat-icon">🍴</span>
                                <div>
                                    <p class="stat-label">Forks</p>
                                    <p class="stat-value" id="modalForks">0</p>
                                </div>
                            </div>
                            <div class="stat-item">
                                <span class="stat-icon">👁️</span>
                                <div>
                                    <p class="stat-label">Watchers</p>
                                    <p class="stat-value" id="modalWatchers">0</p>
                                </div>
                            </div>
                        </div>

                        <!-- Project Description -->
                        <div class="modal-section">
                            <h3 class="modal-section-title">Description</h3>
                            <p class="project-detail-description" id="modalDescription">No description available</p>
                        </div>
                    </div>

                    <!-- README TAB -->
                    <div class="modal-tab-content" id="tab-readme">
                        <div class="project-readme" id="modalReadme">
                            <p class="readme-loading">Loading README...</p>
                        </div>
                    </div>

                    <!-- RELEASES TAB -->
                    <div class="modal-tab-content" id="tab-releases">
                        <div class="project-releases" id="modalReleases">
                            <p class="releases-loading">Loading releases...</p>
                        </div>
                    </div>

                    <!-- LANGUAGES TAB -->
                    <div class="modal-tab-content" id="tab-languages">
                        <div class="modal-section">
                            <h3 class="modal-section-title">Languages Used</h3>
                            <div class="project-languages" id="modalLanguages">
                                <span class="language-badge">Loading...</span>
                            </div>
                        </div>
                    </div>

                    <!-- TOPICS TAB -->
                    <div class="modal-tab-content" id="tab-topics">
                        <div class="modal-section">
                            <h3 class="modal-section-title">Topics & Tags</h3>
                            <div class="project-topics" id="modalTopics">
                                <span class="topic-tag">github</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Setup modal event listeners
    setupModalEventListeners();
}

/**
 * Sets up event listeners for modal interactions
 */
function setupModalEventListeners() {
    const modal = document.getElementById('projectDetailModal');
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    // Close on X button click
    closeBtn.addEventListener('click', closeProjectModal);
    
    // Close on overlay click
    overlay.addEventListener('click', closeProjectModal);
    
    // Prevent closing when clicking on modal content
    modal.querySelector('.modal-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display !== 'none') {
            closeProjectModal();
        }
    });
    
    // Setup tab switching
    const tabButtons = modal.querySelectorAll('.modal-tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = btn.getAttribute('data-tab');
            switchModalTab(tabName);
        });
    });
}

/**
 * Switches between modal tabs
 * @param {string} tabName - The name of the tab to switch to
 */
function switchModalTab(tabName) {
    const modal = document.getElementById('projectDetailModal');
    
    console.log('🔄 Switching to tab: ' + tabName);
    
    // Remove active class from all tabs
    modal.querySelectorAll('.modal-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Remove active class from all tab contents
    modal.querySelectorAll('.modal-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Add active class to clicked tab button
    const activeBtn = modal.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Add active class to corresponding tab content
    const activeContent = modal.querySelector(`#tab-${tabName}`);
    if (activeContent) {
        activeContent.classList.add('active');
        console.log('✅ Tab switched to ' + tabName);
    } else {
        console.error('❌ Tab content not found: #tab-' + tabName);
    }
}

/**
 * Opens the project detail modal with specified project data
 * @param {Object} projectData - Project information from GitHub API
 */
function openProjectModal(projectData) {
    const modal = document.getElementById('projectDetailModal');
    
    console.log('📂 Opening project modal for:', projectData.name);
    
    if (!modal) {
        console.error('❌ Project modal not initialized');
        return;
    }
    
    try {
        // Populate modal with project data
        console.log('✍️ Populating modal data...');
        document.getElementById('modalProjectTitle').textContent = projectData.name;
        document.getElementById('modalGithubLink').href = projectData.html_url;
        document.getElementById('modalDescription').textContent = projectData.description || 'No description available';
        document.getElementById('modalStars').textContent = formatNumber(projectData.stargazers_count || 0);
        document.getElementById('modalForks').textContent = formatNumber(projectData.forks_count || 0);
        document.getElementById('modalWatchers').textContent = formatNumber(projectData.watchers_count || 0);
        
        console.log('✅ Basic data populated');
        
        // Populate languages
        populateLanguages(projectData);
        
        // Populate topics
        populateTopics(projectData);
        
        console.log('✅ Languages and topics populated');
        
        // Fetch and populate additional data
        fetchProjectDetails(projectData);
        
        // Show modal with animation
        modal.style.display = 'flex';
        console.log('🎬 Modal display set to flex, computed style:', window.getComputedStyle(modal).display);
        
        requestAnimationFrame(() => {
            modal.classList.add('show');
            console.log('✨ Modal show class added');
        });
        
        console.log('✅ Modal displayed');
    } catch (err) {
        console.error('❌ Error opening modal:', err);
        console.trace(err);
    }
}

/**
 * Closes the project detail modal
 */
function closeProjectModal() {
    const modal = document.getElementById('projectDetailModal');
    if (!modal) return;
    
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

/**
 * Populates the languages section of the modal
 * @param {Object} projectData - Project data
 */
function populateLanguages(projectData) {
    const container = document.getElementById('modalLanguages');
    console.log('🌐 populateLanguages called, container:', container);
    
    if (!container) {
        console.error('❌ modalLanguages container not found!');
        return;
    }
    
    container.innerHTML = '';
    
    if (!projectData.language) {
        container.innerHTML = '<span class="language-badge">Not specified</span>';
        console.log('✅ No language specified');
        return;
    }
    
    const langBadge = document.createElement('span');
    langBadge.className = 'language-badge';
    langBadge.textContent = projectData.language;
    
    if (hasSkillIcon(projectData.language)) {
        const icon = createSkillIconElement(projectData.language, 16);
        langBadge.insertBefore(icon, langBadge.firstChild);
    }
    
    container.appendChild(langBadge);
    console.log('✅ Languages populated - ' + projectData.language);
}

/**
 * Populates the topics/tags section of the modal
 * @param {Object} projectData - Project data
 */
function populateTopics(projectData) {
    const container = document.getElementById('modalTopics');
    console.log('🏷️ populateTopics called, container:', container);
    
    if (!container) {
        console.error('❌ modalTopics container not found!');
        return;
    }
    
    container.innerHTML = '';
    
    const topics = projectData.topics || [];
    
    if (topics.length === 0) {
        container.innerHTML = '<span class="topic-tag">no-topics</span>';
        console.log('✅ No topics');
        return;
    }
    
    topics.slice(0, 8).forEach(topic => {
        const tag = document.createElement('span');
        tag.className = 'topic-tag';
        tag.textContent = topic;
        container.appendChild(tag);
    });
    console.log('✅ Topics populated - ' + topics.length + ' topics');
}

/**
 * Fetches additional project details (releases, README)
 * @param {Object} projectData - Project data with owner and repo info
 */
async function fetchProjectDetails(projectData) {
    const owner = projectData.owner?.login || projectData.owner;
    const repo = projectData.name;
    
    console.log('📥 Fetching project details for ' + repo + ' (' + owner + ')');
    
    try {
        // Fetch releases
        await fetchProjectReleases(owner, repo);
        console.log('✅ Releases fetched');
        
        // Fetch README
        await fetchProjectReadme(owner, repo);
        console.log('✅ README fetched');
    } catch (err) {
        console.error('❌ Error fetching project details:', err);
    }
}

/**
 * Fetches and displays the latest releases for a project
 * @param {string} owner - GitHub username
 * @param {string} repo - Repository name
 */
async function fetchProjectReleases(owner, repo) {
    const container = document.getElementById('modalReleases');
    
    try {
        const url = `https://api.github.com/repos/${owner}/${repo}/releases?per_page=10`;
        const response = await fetch(url);
        
        // Handle specific error codes
        if (response.status === 404) {
            container.innerHTML = '<p class="no-releases">No releases found for this repository</p>';
            return;
        }
        
        if (response.status === 403) {
            container.innerHTML = '<p class="no-releases">Rate limit exceeded. Please try again later.</p>';
            return;
        }
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const releases = await response.json();
        
        if (!releases || releases.length === 0) {
            container.innerHTML = '<p class="no-releases">No releases yet</p>';
            return;
        }
        
        let releasesHTML = '';
        releases.forEach((release, index) => {
            const date = new Date(release.created_at).toLocaleDateString();
            const releaseId = `release-${index}`;
            
            // Parse markdown if marked is available, otherwise use plain text
            let bodyHTML = '<p>No description</p>';
            if (release.body) {
                if (typeof marked !== 'undefined') {
                    bodyHTML = marked.parse(release.body);
                } else {
                    // Fallback to escaped text if marked is not loaded
                    bodyHTML = '<pre>' + escapeHtmlLocal(release.body) + '</pre>';
                }
            }
            
            releasesHTML += `
                <div class="release-accordion">
                    <button class="release-accordion-btn" data-release-id="${releaseId}">
                        <div class="release-accordion-header">
                            <span class="release-accordion-title">${escapeHtmlLocal(release.tag_name)}</span>
                            <span class="release-accordion-date">${date}</span>
                        </div>
                        <span class="release-accordion-icon">▼</span>
                    </button>
                    <div class="release-accordion-body" id="${releaseId}">
                        <div class="release-body-content">
                            <div class="release-notes-markdown">${bodyHTML}</div>
                            <a href="${release.html_url}" class="release-link" target="_blank" rel="noopener noreferrer">View Full Release →</a>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = releasesHTML;
        
        // Add event listeners to accordion buttons
        container.querySelectorAll('.release-accordion-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const releaseId = this.getAttribute('data-release-id');
                toggleReleaseAccordion(releaseId);
            });
        });
        
        console.log('✅ Releases retrieved and parsed - ' + releases.length + ' releases');
        
        // Highlight code blocks if highlight.js is available
        if (typeof hljs !== 'undefined') {
            container.querySelectorAll('pre code').forEach(block => {
                hljs.highlightElement(block);
            });
        }
    } catch (error) {
        console.error('Error fetching releases:', error);
        container.innerHTML = '<p class="releases-error">Could not load releases</p>';
    }
}

/**
 * Toggle release accordion visibility
 * @param {string} elementId - The ID of the accordion body to toggle
 */
function toggleReleaseAccordion(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.classList.toggle('active');
}

/**
 * Fetches and displays the README for a project
 * @param {string} owner - GitHub username
 * @param {string} repo - Repository name
 */
async function fetchProjectReadme(owner, repo) {
    const container = document.getElementById('modalReadme');
    
    try {
        const url = `https://api.github.com/repos/${owner}/${repo}/readme`;
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3.raw'
            }
        });
        
        if (response.status === 404) {
            container.innerHTML = '<p class="readme-error">No README found for this repository</p>';
            return;
        }
        
        if (response.status === 403) {
            container.innerHTML = '<p class="readme-error">Rate limit exceeded. Please try again later.</p>';
            return;
        }
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const readmeText = await response.text();
        
        let readmeHTML;
        
        // Use marked.js if available, otherwise show plain text
        if (typeof marked !== 'undefined') {
            readmeHTML = marked.parse(readmeText);
        } else {
            // Fallback: show as plain text in a pre tag
            readmeHTML = `<pre>${escapeHtmlLocal(readmeText)}</pre>`;
        }
        
        container.innerHTML = `
            <div class="readme-content-wrapper">
                <div class="readme-content markdown-body">${readmeHTML}</div>
            </div>
        `;
        
        console.log('✅ README retrieved and parsed');
        
        // Highlight code blocks if highlight.js is available
        if (typeof hljs !== 'undefined') {
            container.querySelectorAll('pre code').forEach(block => {
                hljs.highlightElement(block);
            });
        }
    } catch (error) {
        console.error('Error fetching README:', error);
        container.innerHTML = '<p class="readme-error">No README file found</p>';
    }
}

/**
 * Makes project cards clickable to open the detail modal
 * Call this after projects are loaded from GitHub
 */
function enableProjectModalLinks() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Make the entire card clickable
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            // Don't open modal if clicking the GitHub link directly
            if (e.target.closest('.project-link')) {
                return;
            }
            
            // Extract project data from card
            const projectName = card.querySelector('.project-title').textContent;
            const description = card.querySelector('.project-description').textContent;
            const githubLink = card.querySelector('.project-link').href;
            
            // Parse owner and repo from GitHub URL
            const urlParts = githubLink.split('/');
            const owner = urlParts[3];
            const repo = urlParts[4];
            
            // Try to get more data from card if available
            const projectData = {
                name: projectName,
                description: description,
                html_url: githubLink,
                owner: { login: owner },
                stargazers_count: parseInt(card.querySelector('.project-stat')?.textContent) || 0,
                forks_count: 0,
                watchers_count: 0,
                language: card.querySelector('.project-language')?.textContent.trim() || null,
                topics: Array.from(card.querySelectorAll('.tech-tag')).map(tag => tag.textContent),
            };
            
            openProjectModal(projectData);
        });
    });
}

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 UI Enhancements initializing...');
    
    // Load skill icons
    loadSkillIcons();
    
    // Initialize project modal
    try {
        initProjectDetailModal();
        const modal = document.getElementById('projectDetailModal');
        if (modal) {
            console.log('✅ Project modal initialized and exists in DOM');
            console.log('Modal:', modal);
        } else {
            console.error('❌ Project modal not found in DOM after initialization');
        }
    } catch (err) {
        console.error('❌ Error initializing project modal:', err);
    }
    
    // Enable project card clicks after a slight delay to ensure projects are loaded
    setTimeout(() => {
        try {
            enableProjectModalLinks();
            console.log('✅ Project modal links enabled');
        } catch (err) {
            console.error('❌ Error enabling project modal links:', err);
        }
    }, 1000);
    
    console.log('✅ UI enhancements loaded');
});

// Make functions globally available for github-projects.js
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.enableProjectModalLinks = enableProjectModalLinks;
window.switchModalTab = switchModalTab;
window.toggleReleaseAccordion = toggleReleaseAccordion;
