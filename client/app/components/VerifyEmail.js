import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import FormSelectorButton from "./FormSelectorButton";
import FormHeader from "./FormHeader";
import axios from "axios";
import AppLoader from "./AppLoader";
import { useLogin } from "../context/LoginProvider";
import client from "../api/client";
import FormSubmitButton from "./FormSubmitButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions } from "@react-navigation/native";
import { MaterialCommunityIcons } from "react-native-vector-icons";

const VerifyEmail = ({ navigation }) => {
  const [alert, setAlert] = useState("");
  const [alertType, setAlertType] = useState(null);
  const {
    setIsLoggedIn,
    setIsVerified,
    setIsRegistered,
    loginPending,
    setLoginPending,
    logOut,
  } = useLogin();

  const width = Dimensions.get("window").width;

  const fetchApi = async () => {
    try {
      const response = await client.get("/");
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const refreshPage = async () => {
    setLoginPending(true);
    const token = await AsyncStorage.getItem("token");
    if (token) {
      const res = await client.get("/profile", {
        headers: {
          Authorization: token,
        },
      });
      if (res.data.success) {
        setIsVerified(res.data.user.isVerified);
        if (res.data.user.isVerified) {
          const companyId = res.data.user.company;
          if (companyId) {
            const companyRes = await client.get(`/companies/${companyId}`, {
              headers: {
                Authorization: res.data.token,
              },
            });

            if (companyRes.data.success) {
              setIsRegistered(true);
            } else {
              setIsRegistered(false);
            }
          } else {
            setIsRegistered(false);
          }
        } else {
          setAlert("Email has not yet been verified");
          setAlertType("alert");
        }
      }
    }
    setLoginPending(false);
  };

  useEffect(() => {
    fetchApi();
  }, []);

  return (
    <>
      <View
        style={{
          flex: 1,
          paddingTop: 50,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <View style={{ height: 100 }}>
          <FormHeader heading={"engage"} />
        </View>
        <Text
          style={{
            fontFamily: "PlusJakartaSansBold",
            fontSize: 25,
            textAlign: "center",
            marginVertical: Platform.OS === "ios" ? 45 : 20,
          }}
        >
          Verify your company email
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            // borderColor: "#0B2C7F",
            // borderWidth: 1,
            position: "absolute",
            top: 200,
            left: 20,
            right: 20,
            bottom: 200,
          }}
        >
          <View
            style={{
              marginBottom: 20,
              borderRadius: 100,
              backgroundColor: "#E7F0FF",
              padding: 30,
              // shadowColor: "#000",
              // shadowOffset: {
              //   width: 0,
              //   height: 1,
              // },
              // shadowOpacity: 0.1,
              // shadowRadius: 4.65,
              // elevation: 7,
            }}
          >
            <MaterialCommunityIcons
              name="email-check-outline"
              size={80}
              color="#0B2C7F"
            />
          </View>
          <Text
            style={{
              fontFamily: "PlusJakartaSansMedium",
              fontSize: 14,
              color: alertType === "alert" ? "orange" : "green",
              marginBottom: 20,
            }}
          >
            {alert}
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "PlusJakartaSansMedium",
              fontSize: 17,
              padding: 20,
            }}
          >
            You should have received an email with a verification link. Please
            click on the link to verify your email.
          </Text>
          <Text
            style={{
              marginTop: 20,
              color: "#0B2C7F",
              fontFamily: "PlusJakartaSansBold",
              fontSize: 16,
            }}
            onPress={async () => {
              setLoginPending(true);
              try {
                const token = await AsyncStorage.getItem("token");
                if (token) {
                  const res = await client.get("/send-verification-email", {
                    headers: {
                      Authorization: token,
                    },
                  });

                  if (res.data.success) {
                    setAlert("Verification email sent!");
                    setAlertType("success");
                  }
                }
              } catch (error) {
                console.log(error);
              }
              setLoginPending(false);
            }}
          >
            Resend verification email
          </Text>
        </View>

        <Text
          style={{
            color: "#0B2C7F",
            position: "absolute",
            bottom: 20,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "PlusJakartaSansMedium",
            fontSize: 14,
          }}
          onPress={logOut}
        >
          Sign in with a different account
        </Text>
        <FormSubmitButton title="Refresh" onPress={refreshPage} />
      </View>
      {loginPending && <AppLoader />}
    </>
  );
};

export default VerifyEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  borderLeft: {
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
  },
  borderRight: {
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
  },
});
