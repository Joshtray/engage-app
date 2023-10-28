import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "./client";

export const signIn = async (email, password) => {
    try {
        const res = await client.post("/sign-in", { email, password });

        if (res.data.success) {
            await AsyncStorage.setItem("token", res.data.token);
        }
        return res;
    }
    catch (error) {
        console.log(error);
    }
}

export const signOut = async () => {
    try {
        const token = await AsyncStorage.getItem("token");

        if (token) {
            const res = await client.get("/sign-out", {
                headers: {
                    Authorization: token
                }
            });

            if (res.data.success) {
                await AsyncStorage.removeItem("token");
                return true;
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}