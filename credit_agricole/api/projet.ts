import { Projet } from "@/constants/data";
import { API_URL } from "./url";

export async function getAllProjets() : Promise<[]> {
  try {
    const res = await fetch(`${API_URL}/projets`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Une erreur est survenue sur le serveur");
    }
    console.log(data);
    return data;
  } catch (error) {
    console.error("Erreur dans getAllProjets :", error);
    throw error;
  }
}

export async function addProjet(projet : Projet) {
    try {
    const res = await fetch(`${API_URL}/projets`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projet),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Impossible de créer le projet");
    }
    return data;
  } catch (error) {
    console.error("Erreur dans addProjet :", error);
    throw error;
  }
}