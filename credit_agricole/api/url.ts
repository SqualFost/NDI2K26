import Constants from "expo-constants";

const getBaseUrl = () => {
    const debuggerHost = Constants.expoConfig?.hostUri;
    const localhost = debuggerHost?.split(":")[0];

    if (!localhost) {
        return "http://localhost:3001"; // Enlevé le dernier slash pour être propre
    }

    return `http://${localhost}:3001`;
};

// On exporte l'URL racine pour les images
export const BASE_URL = getBaseUrl(); 

// On exporte l'URL API pour les requêtes de données
export const API_URL = BASE_URL + "/api";