import Constants from "expo-constants";

const getBaseUrl = () => {

    const debuggerHost = Constants.expoConfig?.hostUri;
    const localhost = debuggerHost?.split(":")[0];

    if (!localhost) {
        // Cas de secours (par ex: simulateur iOS qui gère bien localhost)
        return "http://localhost:3001/";
    }

    return `http://${localhost}:3001`;
};

export const API_URL = getBaseUrl()+"/api";