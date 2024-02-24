import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";
import { is } from "date-fns/locale";
import { signOut } from "../api/user";

const LoginContext = createContext();

const LoginProvider = ({ navigation, children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [isRegistered, setIsRegistered] = useState(true);
  const [profile, setProfile] = useState({});
  const [loginPending, setLoginPending] = useState(false);

  const fetchUser = async () => {
    console.log(isLoggedIn, isVerified, isRegistered, loginPending);
    setLoginPending(true);
    const token = await AsyncStorage.getItem("token");
    if (token) {
      const res = await client.get("/profile", {
        headers: {
          Authorization: token,
        },
      });

      if (res.data.success) {
        setProfile(res.data.user);
        setIsLoggedIn(true);
        setIsVerified(res.data.user.isVerified);

        const companyId = res.data.user.company;
        console.log(companyId);
        if (companyId) {
          const companyRes = await client.get(`/companies/${companyId}`, {
            headers: {
              Authorization: token,
            },
          });
          console.log(companyRes.data);
          if (companyRes.data.success) {
            setIsRegistered(true);
          } else {
            setIsRegistered(false);
          }
        } else {
          setIsRegistered(false);
        }
      } else {
        await AsyncStorage.removeItem("token");
        setProfile({});
        setIsLoggedIn(false);
        setIsVerified(true);
        setIsRegistered(true);
      }
    }
    setLoginPending(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logOut = async () => {
    setLoginPending(true);
    const isLoggedOut = await signOut();

    if (isLoggedOut) {
      setIsLoggedIn(false);
      setIsVerified(true);
      setIsRegistered(true);
    }
    setLoginPending(false);
  };

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isVerified,
        setIsVerified,
        profile,
        setProfile,
        loginPending,
        setLoginPending,
        isRegistered,
        setIsRegistered,
        logOut,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);

export default LoginProvider;
