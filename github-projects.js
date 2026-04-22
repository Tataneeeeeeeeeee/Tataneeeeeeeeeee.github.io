// ===========================
// GITHUB PROJECTS FETCHER
// ===========================

/**
 * Configuration - MODIFIER CES VALEURS AVEC VOS INFOS
 */
/**
 * Configuration - MODIFIER CES VALEURS AVEC VOS INFOS
 */
const GITHUB_CONFIG = {
    username: 'Tataneeeeeeeeeee',                    // Votre username GitHub
    organization: 'JJE-Corpo',                       // Votre organisation GitHub (optionnel)
    maxProjects: 50,                                  // Nombre max de projets à afficher
    excludeRepos: ['Tataneeeeeeeeeee.github.io', '.github'],   // Repos à ignorer
    sortBy: 'stars',                                 // 'stars', 'updated', 'name', 'pushed'
};

/**
 * Récupère les repos épinglés ET les autres repos
 */
async function fetchGitHubProjects() {
    const projectsContainer = document.getElementById('github-projects-container');
    
    if (!projectsContainer) {
        console.warn('Container #github-projects-container non trouvé');
        return;
    }

    try {
        // Afficher le loading avec meilleure présentation
        projectsContainer.innerHTML = `
            <div class="projects-loading">
                <div class="loading-spinner"></div>
                <p>Loading your awesome projects...</p>
            </div>
        `;

        // Récupérer les repos épinglés ET les autres
        let allRepos = [];
        
        // D'abord, essayer de récupérer les repos épinglés
        try {
            const pinnedRepos = await fetchPinnedRepos();
            allRepos = pinnedRepos.map(repo => ({ ...repo, isPinned: true }));
        } catch (error) {
            console.warn('Impossible de récupérer les repos épinglés (GraphQL)', error);
        }

        // Puis récupérer tous les autres repos
        const otherRepos = await fetchUserRepos();
        
        // Récupérer les repos de l'organisation si configurée
        let orgRepos = [];
        if (GITHUB_CONFIG.organization) {
            try {
                orgRepos = await fetchOrganizationRepos(GITHUB_CONFIG.organization);
                console.log(`📦 ${orgRepos.length} repos from organization "${GITHUB_CONFIG.organization}" loaded`);
            } catch (error) {
                console.warn(`Impossible de récupérer les repos de l'organisation ${GITHUB_CONFIG.organization}:`, error);
            }
        }
        
        if ((!otherRepos || otherRepos.length === 0) && orgRepos.length === 0) {
            if (allRepos.length === 0) {
                projectsContainer.innerHTML = `
                    <div class="projects-error">
                        <p>No projects found. Check your GitHub username configuration.</p>
                    </div>
                `;
                return;
            }
        } else {
            // Ajouter les repos qui ne sont pas déjà dans les épinglés
            const pinnedNames = allRepos.map(r => r.name);
            const userRepos = (otherRepos || []).filter(repo => !pinnedNames.includes(repo.name));
            const uniqueOrgRepos = orgRepos.filter(repo => !pinnedNames.includes(repo.name) && !userRepos.find(ur => ur.name === repo.name));
            allRepos = [...allRepos, ...userRepos, ...uniqueOrgRepos];
        }

        // Filtrer et trier
        const filtered = allRepos
            .filter(repo => !GITHUB_CONFIG.excludeRepos.includes(repo.name))
            .sort((a, b) => {
                // Les repos épinglés en premier
                const aPinned = a.isPinned || false;
                const bPinned = b.isPinned || false;
                
                if (aPinned && !bPinned) return -1;
                if (!aPinned && bPinned) return 1;
                
                // Puis trier selon les paramètres
                switch (GITHUB_CONFIG.sortBy) {
                    case 'stars':
                        return b.stargazers_count - a.stargazers_count;
                    case 'updated':
                        return new Date(b.updated_at) - new Date(a.updated_at);
                    case 'pushed':
                        return new Date(b.pushed_at) - new Date(a.pushed_at);
                    case 'name':
                        return a.name.localeCompare(b.name);
                    default:
                        return b.stargazers_count - a.stargazers_count;
                }
            })
            .slice(0, GITHUB_CONFIG.maxProjects);

        // Créer les cartes de projets
        const projectsHTML = filtered.map(repo => createProjectCard(repo)).join('');
        projectsContainer.innerHTML = projectsHTML;

        // Enable click events on project cards for modal
        const projectCards = projectsContainer.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            const detailsBtn = card.querySelector('.project-details-btn');
            if (detailsBtn) {
                detailsBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Extract project data and open modal
                    const repoName = card.getAttribute('data-repo-name');
                    const owner = card.getAttribute('data-owner');
                    const projectData = filtered.find(r => r.name === repoName);
                    
                    if (projectData) {
                        openProjectModal(projectData);
                    }
                });
            }
        });

        console.log(`✅ ${filtered.length} GitHub projects loaded (${allRepos.filter(r => r.isPinned).length} pinned)`);
    } catch (error) {
        console.error('Error loading GitHub projects:', error);
        projectsContainer.innerHTML = `
            <div class="projects-error">
                <p>Error loading projects. Please check your GitHub username in github-projects.js</p>
                <details>
                    <summary>Details</summary>
                    <pre>${escapeHtml(error.message)}</pre>
                </details>
            </div>
        `;
    }
}

/**
 * Récupère les repos épinglés via GraphQL
 */
async function fetchPinnedRepos() {
    const query = `
        query {
            user(login: "${GITHUB_CONFIG.username}") {
                pinnedItems(first: 10, types: REPOSITORY) {
                    nodes {
                        ... on Repository {
                            name
                            description
                            url
                            homepageUrl
                            stargazers {
                                totalCount
                            }
                            forkCount
                            languages(first: 1) {
                                nodes {
                                    name
                                }
                            }
                            repositoryTopics(first: 5) {
                                nodes {
                                    topic {
                                        name
                                    }
                                }
                            }
                            pushedAt
                            updatedAt
                            owner {
                                login
                            }
                        }
                    }
                }
            }
        }
    `;

    try {
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query })
        });

        const data = await response.json();

        if (data.errors) {
            console.warn('Erreur GraphQL:', data.errors);
            return [];
        }

        if (!data.data || !data.data.user || !data.data.user.pinnedItems) {
            return [];
        }

        // Transformer les données GraphQL au format REST pour compatibilité
        return data.data.user.pinnedItems.nodes.map(repo => ({
            name: repo.name,
            description: repo.description,
            html_url: repo.url,
            language: repo.languages.nodes[0]?.name || null,
            stargazers_count: repo.stargazers.totalCount,
            forks_count: repo.forkCount,
            topics: repo.repositoryTopics.nodes.map(t => t.topic.name),
            pushed_at: repo.pushedAt,
            updated_at: repo.updatedAt,
        }));
    } catch (error) {
        console.warn('Impossible de récupérer les repos épinglés:', error);
        return [];
    }
}

/**
 * Récupère les repos publics via l'API REST
 */
async function fetchUserRepos() {
    const url = `https://api.github.com/users/${GITHUB_CONFIG.username}/repos`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }
    
    return await response.json();
}

/**
 * Récupère les repos publics d'une organisation via l'API REST
 */
async function fetchOrganizationRepos(orgName) {
    const url = `https://api.github.com/orgs/${orgName}/repos`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }
    
    return await response.json();
}

/**
 * Récupère le contenu du README d'un repo
 */
async function fetchReadme(owner, repo) {
    try {
        // Essayer de récupérer README.md
        const url = `https://api.github.com/repos/${owner}/${repo}/readme`;
        
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3.raw'
            }
        });
        
        if (!response.ok) {
            return null;
        }
        
        const content = await response.text();
        
        // Retourner les premières 300 caractères du README
        const excerpt = content
            .split('\n')
            .slice(0, 5)
            .join('\n')
            .substring(0, 300);
        
        return excerpt;
    } catch (error) {
        console.log(`Impossible de récupérer le README pour ${repo}`);
        return null;
    }
}

/**
 * Récupère les langages du repo
 */
async function fetchLanguages(owner, repo) {
    try {
        const url = `https://api.github.com/repos/${owner}/${repo}/languages`;
        const response = await fetch(url);
        
        if (!response.ok) {
            return [];
        }
        
        const languages = await response.json();
        return Object.keys(languages);
    } catch (error) {
        return [];
    }
}

/**
 * Crée une carte de projet HTML avec support pour modal
 * @param {Object} repo - Données du projet depuis GitHub API
 * @returns {string} HTML de la carte projet
 */
function createProjectCard(repo) {
    // Déterminer l'icône et la couleur basée sur le langage principal
    const primaryLanguage = repo.language || 'Unknown';
    
    // Vérifier si le repo est épinglé (depuis GitHub)
    const isPinned = repo.isPinned || false;
    const pinnedBadge = isPinned ? '<span class="pinned-badge" title="Repo épinglé">📌</span>' : '';

    return `
        <div class="project-card" data-repo-name="${escapeHtml(repo.name)}" data-owner="${escapeHtml(repo.owner?.login || '')}">
            <div class="project-header">
                <h3 class="project-title">${escapeHtml(repo.name)}</h3>
                <div class="project-header-actions">
                    ${pinnedBadge}
                    <a href="${repo.html_url}" class="project-link" target="_blank" rel="noopener noreferrer" title="Voir sur GitHub" aria-label="Open on GitHub">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-1.02-2.44l2.58-2.58a3.37 3.37 0 0 0 0-4.77l-2.58-2.58a3.37 3.37 0 0 0-4.77 0l-2.58 2.58a3.37 3.37 0 0 0-2.44 1.02m0 0a3.37 3.37 0 0 1-2.44-1.02"></path>
                        </svg>
                    </a>
                </div>
            </div>
            
            <p class="project-description">
                ${repo.description ? escapeHtml(repo.description) : '<span class="no-description">No description available</span>'}
            </p>
            
            <div class="project-meta">
                ${primaryLanguage && primaryLanguage !== 'null' && hasSkillIcon(primaryLanguage) ? `
                    <span class="project-language">
                        <span class="language-icon">${getSkillIconHTML(primaryLanguage, 16)}</span>
                        ${escapeHtml(primaryLanguage)}
                    </span>
                ` : primaryLanguage && primaryLanguage !== 'null' ? `
                    <span class="project-language">
                        ${escapeHtml(primaryLanguage)}
                    </span>
                ` : ''}
                
                ${repo.stargazers_count > 0 ? `
                    <span class="project-stat">
                        <span style="font-size: 16px;">⭐</span>
                        ${formatNumber(repo.stargazers_count)}
                    </span>
                ` : ''}
                
                ${repo.forks_count > 0 ? `
                    <span class="project-stat">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="18" r="3"></circle>
                            <circle cx="6" cy="6" r="3"></circle>
                            <circle cx="18" cy="6" r="3"></circle>
                            <path d="M18 9v2c0 .5-.5 1-1 1H7c-.5 0-1-.5-1-1V9"></path>
                            <path d="M12 12v6"></path>
                        </svg>
                        ${formatNumber(repo.forks_count)}
                    </span>
                ` : ''}  
                
                ${repo.subscribers_count > 0 ? `
                    <span class="project-stat">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        ${formatNumber(repo.subscribers_count)}
                    </span>
                ` : ''}
            </div>

            <div class="project-tech">
                ${repo.topics && repo.topics.length > 0 ? 
                    repo.topics.slice(0, 3).map(topic => `
                        <span class="tech-tag">${escapeHtml(topic)}</span>
                    `).join('') : 
                    '<span class="tech-tag">github</span>'
                }
            </div>
            
            <div class="project-footer">
                <button class="project-details-btn" aria-label="View project details">
                    <span>View Details</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
        </div>
    `;
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

/**
 * Escapes HTML characters to prevent injection attacks
 */
function escapeHtml(text) {
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
 * Initializes GitHub projects on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 GitHub Projects module loading...');
    fetchGitHubProjects();
});

console.log('✅ GitHub Projects Fetcher loaded');
