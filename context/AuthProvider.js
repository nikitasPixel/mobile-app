import React, { useState } from "react";
import AuthContext from "./AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Env from "./Env"

const AuthProvider = ({ children }) => {
    
    const [user_data, setUserData] = useState(Env.DEFAULT_USER_DATA);
    
    const storeUserData = async user_data => {
        try {
            await AsyncStorage.setItem(Env.PREV_LOGIN, "1");
            await AsyncStorage.setItem(Env.SECURE_DATA_KEY, JSON.stringify(user_data)).then(() => setUserData(user_data));
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <AuthContext.Provider value = {{user_data, storeUserData, setUserData}}>{children}</AuthContext.Provider>
    );
}

export default AuthProvider;