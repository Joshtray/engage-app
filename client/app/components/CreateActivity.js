import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLogin } from "../context/LoginProvider";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormInput from "./FormInput";
import FormHeader from "./FormHeader";
import FormContainer from "./FormContainer";
import client from "../api/client";
import { updateError } from "../utils/methods";
import FormSubmitButton from "./FormSubmitButton";
import { Octicons, MaterialCommunityIcons } from "react-native-vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import AppLoader from "./AppLoader";
import CustomDateTimePicker from "./CustomDateTimePicker";

const CreateActivity = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [keyboardShown, setKeyboardShown] = useState(false);

  const { setIsLoggedIn, profile } = useLogin();
  const navigation = useNavigation();

  const handleSubmit = async () => {
    setLoading(true);

    const data = {
      name,
      description,
      location,
      image: {
        name: new Date() + "_activity",
        type: "image/jpg",
        uri: image,
      },
      // Combine date and time into one date object
      date: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
        time.getSeconds()
      ).toISOString(),
    };
    const formData = (object) =>
      Object.keys(data).reduce((formData, key) => {
        formData.append(key, data[key]);
        return formData;
      }, new FormData());

    const token = await AsyncStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      await client
        .post("/create-activity", formData(data), {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        })
        .then((res) => {
          if (res.data.success) {
            navigation.goBack();
          }
        })
        .catch(function (error) {
          updateError(
            error?.response?.data?.message || error.message,
            setError
          );
        });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const openImageLibrary = async () => {
    setLoading(true);
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

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }

    setLoading(false);
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardShown(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardShown(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <FormContainer
      style={{
        height: "100%",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        paddingTop: 50,
        paddingHorizontal: 0,
      }}
    >
      <View
        style={{
          width: "100%",
          paddingVertical: 10,
        }}
      >
        <TouchableOpacity
          style={{
            width: "100%",
            paddingHorizontal: 30,
          }}
          onPress={() => navigation.goBack()}
        >
          <Octicons name="chevron-left" size={40} color="#0B2C7F" />
        </TouchableOpacity>
      </View>

      <Text
        style={{
          fontFamily: "PlusJakartaSansBold",
          fontSize: 25,
          textAlign: "left",
          width: "100%",
          padding: 30,
        }}
      >
        Post a new activity:
      </Text>
      <ScrollView
        style={{
          display: "flex",
          flex: 1,
          paddingTop: 20,
        }}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            marginBottom: 100,
            paddingHorizontal: 27,
            width: Dimensions.get("window").width,
          }}
        >
          {error && (
            <Text style={{ color: "red", fontSize: 14, textAlign: "center" }}>
              {error}
            </Text>
          )}

          <Text
            style={{
              fontFamily: "PlusJakartaSansBold",
              fontSize: 16,
              color: "#95989D",
              marginBottom: 10,
            }}
          >
            Pick an image...
          </Text>
          <TouchableOpacity
            onPress={openImageLibrary}
            style={styles.uploadImageContainer}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: "100%", height: "100%", borderRadius: 15 }}
              />
            ) : (
              <MaterialCommunityIcons
                name="image-plus"
                size={50}
                color="#95989D"
              />
            )}
          </TouchableOpacity>

          <FormInput
            value={name}
            label="Activity Title"
            placeholder="Activity Title"
            onChangeText={(value) => setName(value)}
          />

          <FormInput
            value={description}
            label="Description"
            placeholder="Description"
            onChangeText={(value) => setDescription(value)}
          />

          <FormInput
            value={location}
            label="Location"
            placeholder="Location"
            onChangeText={(value) => setLocation(value)}
          />

          <Text
            style={{
              textAlign: "left",
              fontFamily: "PlusJakartaSansBold",
              color: "#95989D",
              fontSize: 16,
              marginBottom: 10,
            }}
          >
            Date and Time
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 100,
            }}
          >
            <CustomDateTimePicker
              mode="date"
              value={date}
              onChange={(event) => {
                setDate(new Date(event.nativeEvent.timestamp));
              }}
              minimumDate={new Date()}
            />
            <CustomDateTimePicker
              mode="time"
              value={time}
              onChange={(event) => {
                setTime(new Date(event.nativeEvent.timestamp));
              }}
            />
          </View>
        </View>
      </ScrollView>
      {!keyboardShown && (
        <FormSubmitButton onPress={handleSubmit} title="Create Activity" />
      )}
      {loading && <AppLoader />}
    </FormContainer>
  );
};

export default CreateActivity;

const styles = StyleSheet.create({
  uploadImageContainer: {
    borderWidth: 1,
    height: 200,
    borderRadius: 15,
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "PlusJakartaSans",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#95989D",
  },
});
