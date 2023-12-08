import axios from "axios";
import Constants from "expo-constants";

const { expoConfig } = Constants;

export default axios.create({ 
    baseURL: `http://${expoConfig?.hostUri
    ? expoConfig.hostUri.split(`:`).shift()
    : `localhost`}:8000`
});
