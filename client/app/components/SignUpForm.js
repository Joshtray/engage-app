import { Dimensions, StyleSheet, Text, View, Platform } from "react-native";
import React, { useState } from "react";
import FormContainer from "./FormContainer";
import FormInput from "./FormInput";
import FormSubmitButton from "./FormSubmitButton";
import { isValidEmail, isValidObjField, updateError } from "../utils/methods";
import axios from "axios";
import client from "../api/client";
import { StackActions } from "@react-navigation/native";
import { useLogin } from "../context/LoginProvider";
import { signIn } from "../api/user";
import { ScrollView } from "react-native-gesture-handler";

const SignUpForm = ({ navigation, scrollView }) => {
  const { setIsLoggedIn, setProfile, setLoginPending, setIsVerified } =
    useLogin();

  const [userInfo, setUserInfo] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const { fullname, email, password, confirmPassword } = userInfo;

  const handleOnChangeText = (value, inputType) => {
    setUserInfo({ ...userInfo, [inputType]: value });
  };

  const isValidForm = () => {
    if (!isValidObjField(userInfo)) {
      return updateError("Please fill in all fields", setError);
    }
    if (!fullname.trim() || fullname.length < 3) {
      return updateError("Please enter a valid full name", setError);
    }
    if (!isValidEmail(email)) {
      return updateError("Please enter a valid email", setError);
    }
    if (!password.trim() || password.length < 8) {
      return updateError("Please enter a valid password", setError);
    }
    if (password !== confirmPassword) {
      return updateError("Passwords do not match", setError);
    }
    return true;
  };

  const submitForm = async () => {
    setLoginPending(true);
    if (isValidForm()) {
      const res = await client.post("/create-user", userInfo);

      if (res.data.success) {
        const signInRes = await signIn(email, password);

        if (signInRes.data.success) {
          setProfile(signInRes.data.user);
          setIsLoggedIn(true);
          setIsVerified(signInRes.data.user.isVerified);
        } else {
          updateError(signInRes.data.message, setError);
        }
      } else {
        updateError(res.data.message, setError);
      }
    }
    setLoginPending(false);
  };

  return (
    <View
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: Dimensions.get("window").width,
      }}
    >
      <ScrollView
        style={{
          maxHeight: Dimensions.get("window").height - 300,
          paddingHorizontal: 27,
          zIndex: 1,
          backgroundColor: "#fff",
        }}
      >
        <Text
          style={{
            fontFamily: "PlusJakartaSansBold",
            fontSize: 25,
            textAlign: "center",
            marginVertical: Platform.OS === "ios" ? 45 : 20,
          }}
        >
          Create your account
        </Text>
        <Text
          style={{
            color: "red",
            fontSize: 14,
            fontFamily: "PlusJakartaSans",
            textAlign: "center",
          }}
        >
          {error}
        </Text>
        <FormInput
          value={fullname}
          label="Full Name"
          onChangeText={(value) => handleOnChangeText(value, "fullname")}
          placeholder="John Smith"
        />
        <FormInput
          value={email}
          autoCapitalize="none"
          label="Company/Organization Email"
          onChangeText={(value) => handleOnChangeText(value, "email")}
          placeholder="example@email.com"
        />
        <FormInput
          value={password}
          autoCapitalize="none"
          secureTextEntry
          label="Password"
          onChangeText={(value) => handleOnChangeText(value, "password")}
          placeholder="********"
        />
        <FormInput
          value={confirmPassword}
          autoCapitalize="none"
          secureTextEntry
          label="Confirm Password"
          onChangeText={(value) => handleOnChangeText(value, "confirmPassword")}
          placeholder="********"
        />
        <Text
          style={{
            fontFamily: "PlusJakartaSansSemiBold",
            fontSize: 14,
            textAlign: "center",
            marginVertical: 30,
            color: "#95989D",
          }}
        >
          Already have an account?{" "}
          <Text
            style={{ color: "#0B2C7F" }}
            onPress={() => scrollView.current.scrollTo({ x: 0 })}
          >
            Sign in
          </Text>
        </Text>
      </ScrollView>
      <FormSubmitButton title="Sign Up" onPress={submitForm} />
    </View>
  );
};

export default SignUpForm;

const styles = StyleSheet.create({});
