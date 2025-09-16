// src/pages/api/generateSVG.js
import { OpenAI } from 'openai';

// Récupération des variables d'environnement
const HF_TOKEN = import.meta.env.HF_TOKEN;
const HF_URL = import.meta.env.HF_URL;
const NOM_MODEL = import.meta.env.NOM_MODEL;

// Fonction exportée pour gérer les requêtes POST
export const POST = async ({ request }) => {
    console.log('Request received:', request); // Affiche la requête dans la console pour le débogage
    
    try {
        // Extraction du prompt du corps de la requête
        const { prompt } = await request.json();
        console.log('Prompt received:', prompt);
        
        // Vérification que les variables d'environnement sont définies
        if (!HF_TOKEN || !HF_URL || !NOM_MODEL) {
            console.error('Missing environment variables:', { HF_TOKEN: !!HF_TOKEN, HF_URL: !!HF_URL, NOM_MODEL: !!NOM_MODEL });
            return new Response(JSON.stringify({ error: "Configuration manquante" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
        
        // Initialisation du client OpenAI avec l'URL de base et le token d'API
        const client = new OpenAI({
            baseURL: HF_URL,
            apiKey: HF_TOKEN,
        });
        
        console.log('Creating chat completion with model:', NOM_MODEL);
        
        // Création de la completion de chat
        const chatCompletion = await client.chat.completions.create({
            model: NOM_MODEL,
            messages: [
                {
                    role: "system", 
                    content: "You are an expert SVG code generator. Generate clean, valid SVG code based on user descriptions. Always return ONLY the SVG code without any explanation, markdown formatting, or additional text. The SVG should be well-formed and include appropriate viewBox, width, and height attributes." 
                },
                {
                    role: "user",
                    content: `Create an SVG for: ${prompt}`,    
                },
            ],
            max_tokens: 1000,
            temperature: 0.7,
        });

        // Récupération du message généré par l'API
        const message = chatCompletion.choices[0].message.content || "";
        console.log('Generated message:', message); // Affiche le message généré dans la console pour le débogage
        
        // Recherche d'un élément SVG dans le message généré
        const svgMatch = message.match(/<svg[\s\S]*?<\/svg>/i);
        
        // Retourne une réponse JSON contenant le SVG ou une chaîne vide si aucun SVG n'est trouvé
        return new Response(JSON.stringify({ svg: svgMatch ? svgMatch[0] : message }), {
            headers: { "Content-Type": "application/json" },
        });
        
    } catch (error) {
        console.error('Error generating SVG:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};