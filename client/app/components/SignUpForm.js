import { Dimensions, StyleSheet, Text, View } from "react-native";
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

const SignUpForm = ({ navigation }) => {
  const {setIsLoggedIn, setProfile, setLoginPending} = useLogin();

  const [userInfo, setUserInfo] = useState({
    fullname: "James",
    email: "james@email.com",
    password: "password",
    confirmPassword: "password",
  });
  const [error, setError] = useState("");

  const { fullname, email, password, confirmPassword } = userInfo;

  const handleOnChangeText = (value, inputType) => {
    setUserInfo({ ...userInfo, [inputType]: value });
  }

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
  }

  const submitForm = async () => {
    setLoginPending(true);
    if (isValidForm()) {
        const res = await client.post('/create-user', userInfo);

        if (res.data.success) {
            const signInRes = await signIn(email, password);

            if (signInRes.data.success) {
              setProfile(signInRes.data.user);
              setIsLoggedIn(true);
              navigation.dispatch(
                  StackActions.replace('ImageUpload')
              )
            }
            else {
                updateError(signInRes.data.message, setError);
            }
        }
        else {
            updateError(res.data.message, setError);
        }
    }
    setLoginPending(false);
  }

  return (
    <FormContainer>
        {error && <Text style={{color: 'red', fontSize: 18, textAlign: "center"}}>{error}</Text>}
      <FormInput
        value={fullname}
        label="Full Name"
        onChangeText={(value) => handleOnChangeText(value, "fullname")}
        placeholder="John Smith"
      />
      <FormInput
        value={email}
        autoCapitalize="none"
        label="Email"
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
      <FormSubmitButton title="Sign Up" onPress={submitForm} />
    </FormContainer>
  );
};

export default SignUpForm;

const styles = StyleSheet.create({});
