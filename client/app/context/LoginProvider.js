import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const LoginContext = createContext();

const LoginProvider = ({ navigation, children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState({});
  const [loginPending, setLoginPending] = useState(false);

  const fetchUser = async () => {
    setLoginPending(true);
    const token = await AsyncStorage.getItem("token")
    if (token) {
        const res = await client.get('/profile', {
            headers: {
                Authorization: token
            }
        })

        if (res.data.success) {
            setProfile(res.data.user);
            setIsLoggedIn(true);
        }
        else {
            await AsyncStorage.removeItem("token");
            setProfile({});
            setIsLoggedIn(false);
        }
    };
    setLoginPending(false)
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        profile,
        setProfile,
        loginPending,
        setLoginPending,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);

export default LoginProvider;
