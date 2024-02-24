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
// import { signOut } from "../api/user";
import { FontAwesome5 } from "react-native-vector-icons";

const CompanyNotFound = ({ navigation }) => {
  const { setIsLoggedIn, loginPending, setLoginPending, logOut } = useLogin();

  const fetchApi = async () => {
    try {
      const response = await client.get("/");
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
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
          Company not found!
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
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
            }}
          >
            <FontAwesome5 name="frown" size={80} color="#0B2C7F" />
          </View>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "PlusJakartaSansMedium",
              fontSize: 17,
              padding: 20,
            }}
          >
            Sorry, the domain of the email you signed up with is not yet
            registered on{" "}
            <Text
              style={{
                color: "#0B2C7F",
                fontFamily: "PlusJakartaSansExtraBold",
              }}
            >
              engage
            </Text>
            .
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "PlusJakartaSansMedium",
              fontSize: 15,
            }}
          >
            If your company is already registered, please make sure you are
            signed in with your company email.
          </Text>
        </View>

        <FormSubmitButton
          title="Sign in with a different account"
          onPress={logOut}
        />
      </View>
      {loginPending && <AppLoader />}
    </>
  );
};

export default CompanyNotFound;

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
