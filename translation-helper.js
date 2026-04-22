/**
 * ===========================
 * TRANSLATION HELPER MODULE
 * ===========================
 * 
 * Provides modular, dynamic translation system
 * Loads translations from translations.json and provides utility functions
 */

let translationsData = null;

/**
 * Load translations from translations.json
 */
async function loadTranslations() {
    try {
        const response = await fetch('translations.json');
        if (!response.ok) {
            throw new Error(`Failed to load translations: ${response.status}`);
        }
        translationsData = await response.json();
        console.log('✅ Translations loaded');
    } catch (error) {
        console.error('Error loading translations.json:', error);
        translationsData = { en: {}, fr: {} };
    }
}

/**
 * Get a translation value by path (e.g., 'ui.home' or 'data.languages.French')
 * @param {string} path - Dot-separated path to translation
 * @param {string} lang - Language code ('en' or 'fr')
 * @returns {string} Translated value or original path if not found
 */
function getTranslation(path, lang = 'en') {
    if (!translationsData || !translationsData[lang]) {
        return path;
    }

    const keys = path.split('.');
    let current = translationsData[lang];

    for (let key of keys) {
        if (current && typeof current === 'object' && key in current) {
            current = current[key];
        } else {
            return path; // Return original path if translation not found
        }
    }

    return current || path;
}

/**
 * Translate a data item (object with name/detail and description properties)
 * @param {object} item - The item to translate (e.g., {name: 'Leadership', description: '...'})
 * @param {string} category - Category path in translations (e.g., 'data.softSkills')
 * @param {string} lang - Language code
 * @returns {object} Translated item
 */
function translateDataItem(item, category, lang = 'en') {
    if (!item || !item.name) return item;

    const translationPath = `${category}.${item.name}`;
    const translation = translationsData?.[lang];
    
    if (!translation) return item;

    // Navigate to the translation
    const keys = translationPath.split('.');
    let current = translation;

    for (let key of keys) {
        if (current && typeof current === 'object' && key in current) {
            current = current[key];
        } else {
            return item; // Return original if translation not found
        }
    }

    // If found a translation object, use it
    if (typeof current === 'object') {
        return { ...item, ...current };
    }

    return item;
}

/**
 * Translate an array of items
 * @param {array} items - Array of items to translate
 * @param {string} category - Category path in translations
 * @param {string} lang - Language code
 * @returns {array} Array of translated items
 */
function translateItems(items, category, lang = 'en') {
    if (!Array.isArray(items)) return items;
    return items.map(item => translateDataItem(item, category, lang));
}

console.log('✅ Translation Helper loaded');
