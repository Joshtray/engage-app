import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import FormContainer from "./FormContainer";
import FormInput from "./FormInput";
import FormSubmitButton from "./FormSubmitButton";
import { isValidEmail, isValidObjField, updateError } from "../utils/methods";
import client from "../api/client";
import { StackActions } from "@react-navigation/native";
import { useLogin } from "../context/LoginProvider";
import { signIn } from "../api/user";

const LoginForm = ({ navigation, scrollView }) => {
  const {
    setIsLoggedIn,
    setProfile,
    setIsVerified,
    setLoginPending,
    setIsRegistered,
  } = useLogin();
  const [userInfo, setUserInfo] = useState({
    email: "jessey@uni.minerva.edu",
    password: "password",
  });
  const [error, setError] = useState("");

  const { email, password } = userInfo;

  const handleOnChangeText = (value, inputType) => {
    setUserInfo({ ...userInfo, [inputType]: value });
  };

  const isValidForm = () => {
    if (!isValidObjField(userInfo)) {
      return updateError("Please fill in all fields", setError);
    }
    if (!isValidEmail(email)) {
      return updateError("Please enter a valid email", setError);
    }
    if (!password.trim() || password.length < 8) {
      return updateError("Please enter a valid password", setError);
    }
    return true;
  };

  const submitForm = async () => {
    setLoginPending(true);
    if (isValidForm()) {
      try {
        const res = await signIn(email, password);

        if (res.data.success) {
          setProfile(res.data.user);
          setIsLoggedIn(true);
          

          const companyId = res.data.user.company;
          if (companyId) {
            const companyRes = await client.get(`/companies/${companyId}`, {
              headers: {
                Authorization: res.data.token,
              },
            });
            console.log(companyRes.data)
            if (companyRes.data.success) {
              setIsRegistered(true);
            } else {
              setIsRegistered(false);
            }
          } else {
            setIsRegistered(false);
          }
          setIsVerified(res.data.user.isVerified);
        } else {
          updateError(res.data.message, setError);
        }
      } catch (error) {
        console.log(error);
      }
    }

    setLoginPending(false);
  };

  return (
    <FormContainer>
      <Text
        style={{
          fontFamily: "PlusJakartaSansBold",
          fontSize: 25,
          textAlign: "center",
          marginVertical: Platform.OS === "ios" ? 45 : 15,
        }}
      >
        Sign In
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
        value={email}
        label="Email"
        placeholder="example@email.com"
        onChangeText={(value) => handleOnChangeText(value, "email")}
        autoCapitalize="none"
      />
      <FormInput
        value={password}
        label="Password"
        placeholder="********"
        onChangeText={(value) => handleOnChangeText(value, "password")}
        autoCapitalize="none"
        secureTextEntry
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
        Don't have an account?{" "}
        <Text
          style={{ color: "#0B2C7F" }}
          onPress={() =>
            scrollView.current.scrollTo({ x: Dimensions.get("window").width })
          }
        >
          Sign up
        </Text>
      </Text>
      <FormSubmitButton onPress={submitForm} title="Sign in" />
    </FormContainer>
  );
};

export default LoginForm;

const styles = StyleSheet.create({});
