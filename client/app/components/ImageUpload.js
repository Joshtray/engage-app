import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import client from "../api/client";
import { useLogin } from "../context/LoginProvider";
import { StackActions } from "@react-navigation/native";
import UploadProgress from "./UploadProgress";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateError } from "../utils/methods";
import AppLoader from "./AppLoader";
import FormSubmitButton from "./FormSubmitButton";

const ImageUpload = (props) => {
  const { profile, setIsLoggedIn, setIsVerified } = useLogin();

  const [image, setImage] = useState(profile.avatar);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const openImageLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    setImage(result.assets[0].uri);
  };

  const uploadImage = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("profile", {
      name: new Date() + "_profile",
      type: "image/jpg",
      uri: image,
    });

    try {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        const response = await client.post("/upload-profile", formData, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
          onUploadProgress: ({ loaded, total }) => {
            console.log(loaded, total);
            setProgress(loaded / total);
          },
        });

        if (response.data.success) {
          setProfile({ ...profile, avatar: image });
          props.navigation.dispatch(StackActions.replace("DrawerNavigator"));
        }
      } else {
        setIsLoggedIn(false);
        setIsVerified(false);
      }
    } catch (err) {
      updateError(err.message, setError);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        {error && (
          <Text style={{ color: "red", fontSize: 18, textAlign: "center" }}>
            {error}
          </Text>
        )}
        <View>
          <TouchableOpacity
            onPress={openImageLibrary}
            style={styles.uploadButtonContainer}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <Text style={styles.uploadButton}>Upload Profile Image</Text>
            )}
            {progress ? <UploadProgress progress={progress} /> : null}
          </TouchableOpacity>
          <Text
            style={styles.skip}
            onPress={() =>
              props.navigation.dispatch(StackActions.replace("DrawerNavigator"))
            }
          >
            Skip
          </Text>
        </View>
        {image && (
          <FormSubmitButton
            onPress={uploadImage}
            disabled={progress > 0}
            title="Upload"
          />
        )}
      </View>
      {loading && <AppLoader />}
    </>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  uploadButtonContainer: {
    borderRadius: 125 / 2,
    height: 125,
    width: 125,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    overflow: "hidden",
  },
  uploadButton: {
    textAlign: "center",
    fontSize: 16,
    opacity: 0.3,
    fontWeight: "bold",
    fontFamily: "PlusJakartaSans",
  },
  skip: {
    textAlign: "center",
    padding: 20,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "PlusJakartaSans",
    textTransform: "uppercase",
    letterSpacing: 2,
    opacity: 0.5,
  },
});
