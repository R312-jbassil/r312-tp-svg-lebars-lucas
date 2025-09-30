// Endpoint pour mettre à jour un SVG dans PocketBase
import pb from '../../utils/pb';
import { Collections } from '../../utils/pocketbase-types';

export async function POST({ request }) {
    try {
        const data = await request.json();
        console.log('Update request data:', data);

        // Vérifier que l'ID est fourni
        if (!data.id) {
            return new Response(JSON.stringify({
                success: false,
                error: 'ID requis pour la mise à jour'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Préparer les données à mettre à jour
        const updateData = {};
        
        // Ajouter les champs modifiés seulement s'ils sont fournis
        if (data.name) updateData.name = data.name;
        if (data.code_svg) updateData.code_svg = data.code_svg;
        if (data.chat_history) updateData.chat_history = data.chat_history;
        if (data.creator) updateData.creator = data.creator;
        if (data.tags) updateData.tags = data.tags;

        console.log('Updating SVG with data:', updateData);

        // Mettre à jour l'enregistrement dans PocketBase
        const updatedRecord = await pb.collection(Collections.Svg).update(data.id, updateData);
        
        console.log('SVG updated successfully:', updatedRecord.id);

        return new Response(JSON.stringify({
            success: true,
            id: updatedRecord.id,
            message: 'SVG mis à jour avec succès'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Update error:', error);
        
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'Erreur lors de la mise à jour'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}