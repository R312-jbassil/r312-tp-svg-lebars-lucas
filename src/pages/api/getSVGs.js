// src/pages/api/getSVGs.js
import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.POCKETBASE_URL);

export const GET = async ({ url }) => {
    try {
        const searchParams = new URL(url).searchParams;
        const page = parseInt(searchParams.get('page')) || 1;
        const perPage = parseInt(searchParams.get('perPage')) || 20;

        // Récupération des SVG avec pagination
        const records = await pb.collection('svg_creations').getList(page, perPage, {
            sort: '-created',
        });

        return new Response(JSON.stringify({
            success: true,
            data: records.items,
            totalItems: records.totalItems,
            totalPages: records.totalPages,
            page: records.page
        }), {
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error('Error fetching SVGs:', error);
        return new Response(JSON.stringify({ 
            error: "Erreur lors de la récupération : " + error.message 
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};