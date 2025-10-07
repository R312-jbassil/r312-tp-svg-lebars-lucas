// src/pages/api/signup.js
import pb from "../../utils/pb";
import { Collections } from "../../utils/pocketbase-types";

export const POST = async ({ request }) => {
    // Récupère l'email et le mot de passe envoyés dans la requête
    const { email, password } = await request.json();
    try {
        // Crée un nouvel utilisateur dans PocketBase
        const user = await pb.collection(Collections.Users).create({
            email,
            password,
            passwordConfirm: password
        });
        return new Response(JSON.stringify({ user }), { status: 201 });
    } catch (err) {
        console.error("Erreur d'inscription :", err);
        let message = "Erreur lors de l'inscription";
        if (err?.data?.data?.email?.message) {
            message = err.data.data.email.message;
        }
        return new Response(JSON.stringify({ error: message }), { status: 400 });
    }
};
