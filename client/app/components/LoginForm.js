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

const LoginForm = ({ navigation }) => {
  const {setIsLoggedIn, setProfile, setLoginPending} = useLogin();
  const [userInfo, setUserInfo] = useState({
    email: "email@email.com",
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
            }
            else {
                updateError(res.data.message, setError);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    setLoginPending(false);
  };

  return (
    <FormContainer>
        {error && <Text style={{color: 'red', fontSize: 18, fontFamily: "PlusJakartaSans", textAlign: "center"}}>{error}</Text>}
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
      <FormSubmitButton onPress={submitForm} title="Login" />
    </FormContainer>
  );
};

export default LoginForm;

const styles = StyleSheet.create({});
