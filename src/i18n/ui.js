export const languages = {
  fr: 'Français',
  en: 'English',
};

export const defaultLang = 'fr';

export const ui = {
  en: {
    nav: {
      home: 'Home',
      generator: 'Generator',
      gallery: 'Gallery',
      language: 'Language',
    },
    index: {
        title: 'Welcome to SVG Generator',
        description: 'Create and render SVGs from prompts.',
        button: 'Go to SVG Generator',
    },
    generator: {
        title: 'SVG Generator',
        contentPlaceholder: 'SVG content will be displayed here',
        codePlaceholder: 'SVG code will be displayed here',
        promptLabel: 'Enter your prompt:',
        generateButton: 'Generate SVG',
        editButton: 'Edit',
        viewButton: 'View',
        preview: 'SVG Preview',
        noSvg: 'No SVG generated',
        description: 'Enter a description and click "Generate SVG"',
        conversation: 'Conversation',
        noConversation: 'No conversation',
        historyDesc: 'Exchange history will appear here',
        placeholder: 'Enter a description to generate an SVG...',
        generate: 'Generate',
        edit: 'Edit',
        copy: 'Copy SVG',
        save: 'Save',
    },
    gallery: {
        title: 'SVG Gallery',
        viewDetails: 'View Details',
        backToLibrary: 'Back to Library',
        createdBy: 'Created by',
        createdOn: 'Created on:',
        subtitle: 'Your creations',
        found: 'found',
        preview: 'SVG Preview',
        chatHistory: 'Chat History',
        copyCode: 'Copy Code',
        download: 'Download',
        promptUser: 'User Prompt',
        user: 'User',
        assistant: 'AI Assistant',
        svgGenerated: 'Generated SVG Code',
    }
  },
  fr: {
    nav: {
      home: 'Accueil',
      generator: 'Générateur',
      gallery: 'Galerie',
      language: 'Langue',
    },
    index: {
        title: 'Bienvenue sur le générateur SVG',
        description: 'Créez et affichez des SVG à partir d\'invites.',
        button: 'Aller au générateur SVG',
    },
    generator: {
        title: 'Générateur SVG',
        contentPlaceholder: 'Le contenu SVG sera affiché ici',
        codePlaceholder: 'Le code SVG sera affiché ici',
        promptLabel: 'Entrez votre invite :',
        generateButton: 'Générer le SVG',
        editButton: 'Éditer',
        viewButton: 'Voir',
        preview: 'Aperçu SVG',
        noSvg: 'Aucun SVG généré',
        description: 'Entrez une description et cliquez sur "Générer SVG"',
        conversation: 'Conversation',
        noConversation: 'Aucune conversation',
        historyDesc: 'L\'historique des échanges apparaîtra ici',
        placeholder: 'Entrez une description pour générer un SVG...',
        generate: 'Générer',
        edit: 'Éditer',
        copy: 'Copier SVG',
        save: 'Sauvegarder',
    },
    gallery: {
        title: 'Galerie SVG',
        viewDetails: 'Voir les détails',
        backToLibrary: 'Retour à la bibliothèque',
        createdBy: 'Créé par',
        createdOn: 'Créé le :',
        subtitle: 'Vos créations',
        found: 'trouvées',
        preview: 'Aperçu SVG',
        chatHistory: 'Historique des échanges',
        copyCode: 'Copier le code',
        download: 'Télécharger',
        promptUser: 'Prompt utilisateur',
        user: 'Utilisateur',
        assistant: 'Assistant IA',
        svgGenerated: 'Code SVG généré',
    }
  },
};

// Fonction utilitaire pour récupérer une traduction
export function useTranslations(lang = defaultLang) {
  return function t(key) {
    const keys = key.split('.');
    let value = ui[lang] || ui[defaultLang];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };
}

// Fonction pour obtenir la langue depuis une requête Astro
export function getLangFromUrl(url) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang;
  return defaultLang;
}

// Fonction pour obtenir la langue depuis les cookies
export function getLangFromCookie(cookies) {
  const langCookie = cookies.get('language')?.value;
  if (langCookie && langCookie in ui) return langCookie;
  return defaultLang;
}