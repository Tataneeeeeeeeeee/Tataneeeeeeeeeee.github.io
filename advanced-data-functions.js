// Advanced utility functions for portfolio data management

// Remove experience entry by ID
function removeExperience(id) {
  if (!portfolioData?.experience) return;
  portfolioData.experience = portfolioData.experience.filter(exp => exp.id !== id);
  renderExperience();
}

// Remove education entry by ID
function removeEducation(id) {
  if (!portfolioData?.education) return;
  portfolioData.education = portfolioData.education.filter(edu => edu.id !== id);
  renderEducation();
}

// Remove certification entry by ID
function removeCertification(id) {
  if (!portfolioData?.certifications) return;
  portfolioData.certifications = portfolioData.certifications.filter(cert => cert.id !== id);
  renderCertifications();
}

// Update experience entry with new values
function updateExperience(id, updates) {
  if (!portfolioData?.experience) return;
  const exp = portfolioData.experience.find(e => e.id === id);
  if (exp) {
    Object.assign(exp, updates);
    renderExperience();
  }
}

// Download portfolio data as JSON file
function downloadDataAsJSON() {
  const dataStr = JSON.stringify(portfolioData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'portfolio-data.json';
  link.click();
  URL.revokeObjectURL(url);
}

// Import portfolio data from JSON file
function importDataFromFile(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      portfolioData = data;
      renderExperience();
      renderEducation();
      renderCertifications();
      renderSkills();
      if (typeof loadSkillIcons === 'function') {
        setTimeout(() => loadSkillIcons(), 50);
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  };
  reader.readAsText(file);
}

// Get statistics about portfolio data
function getPortfolioStats() {
  if (!portfolioData) return null;
  
  return {
    totalExperience: portfolioData.experience?.length || 0,
    totalEducation: portfolioData.education?.length || 0,
    totalCertifications: portfolioData.certifications?.length || 0,
    totalSkills: Object.values(portfolioData.skills || {})
      .reduce((total, category) => total + category.length, 0),
    skillsByCategory: Object.keys(portfolioData.skills || {})
      .reduce((acc, key) => ({ ...acc, [key]: portfolioData.skills[key].length }), {})
  };
}

// Search for experience entries by query
function searchExperience(query) {
  if (!portfolioData?.experience) return [];
  
  const lowerQuery = query.toLowerCase();
  return portfolioData.experience.filter(exp => 
    exp.title.toLowerCase().includes(lowerQuery) ||
    exp.company.toLowerCase().includes(lowerQuery) ||
    exp.description.toLowerCase().includes(lowerQuery)
  );
}

// Search for skills by query
function searchSkill(query) {
  if (!portfolioData?.skills) return [];
  
  const lowerQuery = query.toLowerCase();
  const results = [];
  
  Object.keys(portfolioData.skills).forEach(category => {
    portfolioData.skills[category].forEach(skill => {
      if (skill.name.toLowerCase().includes(lowerQuery)) {
        results.push({ category, ...skill });
      }
    });
  });
  
  return results;
}

// Get currently active experience entries
function getActiveExperience() {
  if (!portfolioData?.experience) return [];
  return portfolioData.experience.filter(exp => 
    exp.dateEnd === 'Present' || exp.dateEnd === 'Actuel'
  );
}

// Get experience within date range
function getExperienceDuring(startYear, endYear) {
  if (!portfolioData?.experience) return [];
  
  return portfolioData.experience.filter(exp => {
    const start = parseInt(exp.dateStart.split(' ')[1] || exp.dateStart.split('-')[0]);
    const end = parseInt(exp.dateEnd.split(' ')[1] || exp.dateEnd.split('-')[0]);
    return start <= endYear && end >= startYear;
  });
}

// Validate portfolio data structure
function validatePortfolioData() {
  const errors = [];
  
  if (!portfolioData.profile) errors.push('Missing profile section');
  if (!portfolioData.experience || portfolioData.experience.length === 0) 
    errors.push('No experiences found');
  if (!portfolioData.skills) errors.push('Missing skills section');
  
  portfolioData.experience?.forEach((exp, idx) => {
    if (!exp.id || !exp.title || !exp.company) 
      errors.push(`Experience ${idx} missing required fields`);
  });
  
  if (errors.length === 0) {
    return true;
  } else {
    console.error('Validation errors:', errors);
    return false;
  }
}

// Reset portfolio data to default (reloads from data.json)
function resetToDefaultData() {
  loadPortfolioData();
}

// Add new skill category
function addSkillCategory(id, title) {
  if (!portfolioData) return false;
  if (!portfolioData.skillCategories) {
    portfolioData.skillCategories = [];
  }
  
  if (portfolioData.skillCategories.find(cat => cat.id === id)) {
    console.warn(`Category "${id}" already exists!`);
    return false;
  }
  
  portfolioData.skillCategories.push({ id, title });
  
  if (!portfolioData.skills) {
    portfolioData.skills = {};
  }
  portfolioData.skills[id] = [];
  
  renderSkills();
  if (typeof loadSkillIcons === 'function') {
    setTimeout(() => loadSkillIcons(), 50);
  }
  return true;
}

// Remove skill category by ID
function removeSkillCategory(id) {
  if (!portfolioData?.skillCategories) return false;
  
  const initialLength = portfolioData.skillCategories.length;
  portfolioData.skillCategories = portfolioData.skillCategories.filter(cat => cat.id !== id);
  
  if (portfolioData.skills?.[id]) {
    delete portfolioData.skills[id];
  }
  
  if (portfolioData.skillCategories.length < initialLength) {
    renderSkills();
    if (typeof loadSkillIcons === 'function') {
      setTimeout(() => loadSkillIcons(), 50);
    }
    return true;
  } else {
    console.warn(`Category "${id}" not found!`);
    return false;
  }
}

// Update skill category title
function updateSkillCategory(id, newTitle) {
  if (!portfolioData?.skillCategories) return false;
  
  const category = portfolioData.skillCategories.find(cat => cat.id === id);
  if (category) {
    category.title = newTitle;
    renderSkills();
    if (typeof loadSkillIcons === 'function') {
      setTimeout(() => loadSkillIcons(), 50);
    }
    return true;
  } else {
    console.warn(`Category "${id}" not found!`);
    return false;
  }
}

// Get all skill categories
function getSkillCategories() {
  return portfolioData?.skillCategories || [];
}

// Add skill to a category
function addSkillToCategory(categoryId, skillName, iconName) {
  if (!portfolioData?.skills) return false;
  
  if (!portfolioData.skills[categoryId]) {
    console.warn(`Category "${categoryId}" does not exist!`);
    return false;
  }
  
  portfolioData.skills[categoryId].push({
    name: skillName,
    icon: iconName || skillName.toLowerCase()
  });
  
  renderSkills();
  if (typeof loadSkillIcons === 'function') {
    setTimeout(() => loadSkillIcons(), 50);
  }
  return true;
}

// ===========================
// EXEMPLES D'UTILISATION CONSOLE
// ===========================

/*
// Ajouter une expérience:
addExperience({
  "id": 2,
  "title": "New Role",
  "company": "New Company",
  "dateStart": "Jan 2026",
  "dateEnd": "Present",
  "description": "..."
});

// Supprimer une expérience:
removeExperience(1);

// Éditer une expérience:
updateExperience(1, { title: "Updated Title" });

// Obtenir des statistiques:
getPortfolioStats();

// Rechercher:
searchExperience("backend");
searchSkill("python");

// Valider:
validatePortfolioData();

// Exporter:
downloadDataAsJSON();

// Obtenir les expériences actuelles:
getActiveExperience();
*/

console.log('Advanced portfolio data functions loaded! 🚀');
