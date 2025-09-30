// src/pages/api/saveSVG.js - Hybride fonctionnel + style prof
import pb from "../../utils/pb.js";
import { Collections } from "../../utils/pocketbase-types.js";

export const POST = async ({ request }) => {
    try {
        const data = await request.json();
        console.log("Received data to save:", data); // Style prof
        
        const { title, prompt, svg_code, created_by, tags, name, chat_history, code_svg } = data;
        
        // Support both old format (title, prompt, svg_code) and new format (name, chat_history, code_svg)
        const svgName = name || title;
        let svgChatHistory = chat_history || prompt;
        const svgCode = code_svg || svg_code;
        
        // Traiter le chat_history pour respecter la limite de 1000 caractères
        if (typeof svgChatHistory !== 'string') {
            // Si c'est un tableau (promptList), on prend seulement le dernier prompt utilisateur
            if (Array.isArray(svgChatHistory)) {
                const lastUserPrompt = svgChatHistory.filter(msg => msg.role === 'user').pop();
                svgChatHistory = lastUserPrompt ? lastUserPrompt.content : 'Prompt généré automatiquement';
            } else {
                svgChatHistory = 'Prompt généré automatiquement';
            }
        }
        
        // Tronquer à 1000 caractères max pour respecter la contrainte PocketBase
        if (svgChatHistory.length > 1000) {
            svgChatHistory = svgChatHistory.substring(0, 997) + '...';
        }
        
        // Validation des données
        if (!svgName || !svgChatHistory || !svgCode) {
            console.log("Validation failed:", { svgName, svgChatHistory: !!svgChatHistory, svgCode: !!svgCode });
            return new Response(JSON.stringify({ 
                success: false,
                error: "Nom, chat_history et code SVG sont requis" 
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Préparer les données à insérer - seulement les champs essentiels
        const recordData = {
            name: svgName.trim(),
            chat_history: svgChatHistory.trim(),
            code_svg: svgCode.trim()
        };

        // Ajouter les champs optionnels seulement s'ils sont fournis
        if (created_by) {
            recordData.creator = created_by.trim();
        }
        if (tags) {
            recordData.tags = tags.trim();
        }

        console.log("Attempting to create record with data:", recordData);

        // Création de l'enregistrement dans PocketBase - Style prof avec utils
        const record = await pb.collection(Collections.Svg).create(recordData);

        console.log("SVG saved with ID:", record.id); // Style prof

        return new Response(JSON.stringify({ 
            success: true, 
            id: record.id,
            message: "SVG sauvegardé avec succès !" 
        }), {
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error('Error saving SVG:', error); // Style prof
        console.error('Error details:', error.response || error.message);
        
        // Extraire le message d'erreur plus détaillé si possible
        let errorMessage = error.message;
        if (error.response && error.response.data) {
            errorMessage = JSON.stringify(error.response.data);
        }
        
        return new Response(JSON.stringify({ 
            success: false, // Style prof
            error: "Erreur lors de la sauvegarde : " + errorMessage
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};