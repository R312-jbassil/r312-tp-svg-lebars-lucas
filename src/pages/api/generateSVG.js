const BASE_URL = import.meta.env.OR_URL; // URL de l'API OpenRouter
const OR_TOKEN = import.meta.env.OR_TOKEN;

import { OpenAI } from "openai";

export const POST = async ({ request }) => {
    // Affiche la requête dans la console pour le débogage
    console.log(request);

    // Extraction des messages et du modèle du corps de la requête
    const { messages, model } = await request.json();
    
    // Initialisation du client OpenAI avec l'URL de base et le token d'API
    const client = new OpenAI({
        baseURL: BASE_URL, // URL de l'API
        apiKey: OR_TOKEN, // Token d'accès pour l'API
    });
    
    // Création du message système pour guider le modèle
    let SystemMessage = 
        {
            role: "system", // Rôle du message
            content: `You are an expert SVG code generator. Your task is to generate valid, complete SVG code based on user descriptions.

IMPORTANT RULES:
1. ALWAYS respond with valid SVG code wrapped in <svg> tags
2. Set appropriate viewBox and dimensions (e.g., viewBox="0 0 300 200" width="300" height="200")
3. Use semantic element names and include meaningful id attributes
4. Generate visually appealing, well-structured SVG graphics
5. Include proper styling with fill, stroke, and other SVG attributes
6. Do NOT include any explanatory text, markdown formatting, or code blocks
7. Respond ONLY with the SVG code, nothing else

Example format:
<svg viewBox="0 0 300 200" width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- SVG elements here -->
</svg>`, // Contenu du message
        };
    
    // Mapping des modèles vers les noms d'API - Modèles optimisés pour la génération de code
    const modelMapping = {
        "gpt-4o-mini": "openai/gpt-4o-mini", 
        "gpt-4o": "openai/gpt-4o",
        "claude-3.5-sonnet": "anthropic/claude-3.5-sonnet",
        "deepseek-coder": "deepseek/deepseek-coder",
        "qwen-coder": "qwen/qwen-2.5-coder-32b-instruct",
        "codellama": "meta-llama/codellama-34b-instruct",
        "mistral-7b": "mistralai/mistral-7b-instruct:free",
        "llama-3.1": "meta-llama/llama-3.1-8b-instruct:free"
    };
    
    // Utilise le modèle sélectionné ou un modèle par défaut optimisé pour le code
    const selectedModel = modelMapping[model] || "openai/gpt-4o-mini";
    console.log("Using model:", selectedModel);
    
    // Appel à l'API pour générer le code SVG en utilisant le modèle spécifié
    const chatCompletion = await client.chat.completions.create({
        model: selectedModel, // Nom du modèle à utiliser
        messages: [SystemMessage, ...messages], // Messages envoyés au modèle, incluant le message système et l'historique des messages
        temperature: 0.7, // Équilibre créativité/cohérence
        max_tokens: 2000, // Limite pour éviter des réponses trop longues
        top_p: 1.0 // Diversité des réponses
    });
    
    // Récupération du message généré par l'API
    const message = chatCompletion.choices[0].message || "";
    
    // Affiche le message généré dans la console pour le débogage
    console.log("Generated SVG:", message);
    
    // Nettoyage et extraction du code SVG
    let svgContent = message.content || "";
    
    // Supprime les blocs de code markdown s'ils existent
    if (svgContent.includes('```')) {
        svgContent = svgContent.replace(/```[\w]*\n?/g, '').replace(/```/g, '');
    }
    
    // Recherche d'un élément SVG dans le message généré
    const svgMatch = svgContent.match(/<svg[\s\S]*?<\/svg>/i);
    
    if (svgMatch) {
        // Vérifier que le SVG a les attributs essentiels
        let svg = svgMatch[0];
        
        // Ajouter les attributs manquants si nécessaire
        if (!svg.includes('viewBox') && !svg.includes('width') && !svg.includes('height')) {
            svg = svg.replace('<svg', '<svg viewBox="0 0 300 200" width="300" height="200"');
        }
        
        // Ajouter le namespace xmlns s'il n'est pas présent
        if (!svg.includes('xmlns')) {
            svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        
        message.content = svg;
    } else if (svgContent.trim().startsWith('<') && svgContent.includes('svg')) {
        // Si le contenu semble être du SVG mais n'a pas les balises complètes
        let svg = svgContent.trim();
        
        if (!svg.includes('xmlns')) {
            svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        
        message.content = svg;
    } else {
        // Sinon, générer un SVG d'erreur avec un message d'aide
        console.log("Échec de génération SVG, contenu reçu:", svgContent);
        message.content = `<svg viewBox="0 0 300 200" width="300" height="200" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="200" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
            <circle cx="50" cy="60" r="20" fill="#f59e0b"/>
            <text x="50" y="66" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">!</text>
            <text x="150" y="90" text-anchor="middle" fill="#92400e" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
                Génération SVG échouée
            </text>
            <text x="150" y="110" text-anchor="middle" fill="#92400e" font-family="Arial, sans-serif" font-size="12">
                Essayez une description plus simple
            </text>
            <text x="150" y="130" text-anchor="middle" fill="#92400e" font-family="Arial, sans-serif" font-size="12">
                ou changez de modèle IA
            </text>
        </svg>`;
    }
    
    // Retourne une réponse JSON contenant le SVG généré
    return new Response(JSON.stringify({ svg: message }), {
        headers: { "Content-Type": "application/json" }, // Définit le type de contenu de la réponse
    });
};