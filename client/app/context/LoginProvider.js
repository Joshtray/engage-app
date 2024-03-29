import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";
import { is } from "date-fns/locale";
import { signOut } from "../api/user";

const LoginContext = createContext();

const LoginProvider = ({ navigation, children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [profile, setProfile] = useState({});
  const [loginPending, setLoginPending] = useState(false);
  const [registered, setRegistered] = useState(null);

  const fetchUser = async () => {
    setLoginPending(true);
    const token = await AsyncStorage.getItem("token");
    if (token) {
      await client
        .get("/profile", {
          headers: {
            Authorization: token,
          },
        })
        .then(async (res) => {
          if (res.data.success) {
            setProfile(res.data.user);
            setIsLoggedIn(true);
            setIsVerified(res.data.user.isVerified);
          } else {
            await AsyncStorage.removeItem("token");
            setProfile({});
            setIsLoggedIn(false);
            setIsVerified(null);
            setRegistered(null);
          }
        })
        .catch((e) => {
          console.log("Error:", e);
        });
    }
    setLoginPending(false);
  };

  const isRegistered = async () => {
    setLoginPending(true);
    const token = await AsyncStorage.getItem("token");
    await client
      .get("/is-registered", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setRegistered(res.data.registered);
        }
      })
      .catch((e) => {
        console.log("Error:", e.response.data);
      });
    setLoginPending(false);
  };

  useEffect(() => {
    isRegistered();
  }, [isLoggedIn]);

  useEffect(() => {
    fetchUser();
  }, []);

  const logOut = async () => {
    setLoginPending(true);
    const isLoggedOut = await signOut();

    if (isLoggedOut) {
      setIsLoggedIn(false);
      setIsVerified(null);
      setRegistered(null);
      setProfile({});
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
        registered,
        fetchUser,
        logOut,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);

export default LoginProvider;
