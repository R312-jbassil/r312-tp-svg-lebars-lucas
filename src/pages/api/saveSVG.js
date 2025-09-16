// src/pages/api/saveSVG.js
import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.POCKETBASE_URL);

export const POST = async ({ request }) => {
    try {
        const { title, prompt, svg_code, created_by, tags } = await request.json();
        
        // Validation des données
        if (!title || !prompt || !svg_code) {
            return new Response(JSON.stringify({ 
                error: "Titre, prompt et code SVG sont requis" 
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Création de l'enregistrement dans PocketBase
        const record = await pb.collection('svg_creations').create({
            title: title.trim(),
            prompt: prompt.trim(),
            svg_code: svg_code.trim(),
            created_by: created_by || 'Anonyme',
            tags: tags || ''
        });

        return new Response(JSON.stringify({ 
            success: true, 
            id: record.id,
            message: "SVG sauvegardé avec succès !" 
        }), {
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error('Error saving SVG:', error);
        return new Response(JSON.stringify({ 
            error: "Erreur lors de la sauvegarde : " + error.message 
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};