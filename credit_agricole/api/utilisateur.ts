import { Projet, Utilisateur } from "@/constants/data";
import { API_URL } from "./url";



export async function addUser(utilisateur : Utilisateur) {
    try {
    const res = await fetch(`${API_URL}/utilisateurs`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(utilisateur),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Impossible de créer l'utilisateur");
    }
    return data;
  } catch (error) {
    console.error("Erreur dans addUser :", error);
    throw error;
  }
}

export async function login({ email, password }: { email: string, password: string }) {
  try {
    const res = await fetch(`${API_URL}/utilisateurs/login`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      // ATTENTION : Ton backend (prompt précédent) attendait "passwd", pas "password"
      // Je fais le mapping ici pour que ça marche :
      body: JSON.stringify({ 
        email: email, 
        passwd: password 
      }),
    });

    const data = await res.json();

    // Si le serveur renvoie une erreur (404, 401, 500...), on lève une exception
    if (!res.ok) {
      throw new Error(data.message || "Erreur lors de la connexion");
    }

    // On retourne les données de l'utilisateur pour les utiliser dans l'app
    return data;

  } catch (error) {
    console.error("Erreur Login:", error);
    throw error; // On renvoie l'erreur pour l'afficher dans l'UI (Alert)
  }
}