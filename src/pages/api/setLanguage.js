export async function POST({ request, cookies, redirect }) {
  try {
    const formData = await request.formData();
    const selectedLanguage = formData.get("language");
    const returnUrl = formData.get("returnUrl") || "/";
    
    if (selectedLanguage) {
      // Sauvegarder la langue dans un cookie
      cookies.set("language", selectedLanguage, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 an
        sameSite: "strict",
        httpOnly: false
      });
    }
    
    // Redirection vers la page d'origine
    return redirect(returnUrl);
  } catch (error) {
    console.error("Erreur lors du changement de langue:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}