import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from "react-native";
import {
  Octicons,
  FontAwesome,
  SimpleLineIcons,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { format } from "date-fns";
import FormSubmitButton from "./FormSubmitButton";
import {
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLogin } from "../context/LoginProvider";
import client from "../api/client";
import deleteActivityAlert from "../alerts/deleteActivityAlert";
import * as ImagePicker from "expo-image-picker";
import AppLoader from "./AppLoader";
import DateTimePicker from "@react-native-community/datetimepicker";
import { updateError } from "../utils/methods";
import CustomDateTimePicker from "./CustomDateTimePicker";

const EditActivity = ({ route, navigation }) => {
  const { loginPending, setLoginPending, profile, setProfile } = useLogin();
  const { activity } = route.params;

  const [image, setImage] = useState(activity.image);
  const [newImage, setNewImage] = useState(false);
  const [name, setName] = useState(activity.name);
  const [description, setDescription] = useState(activity.description);
  const [location, setLocation] = useState(activity.location);
  const [date, setDate] = useState(new Date(activity.date));
  const [time, setTime] = useState(new Date(activity.date));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateActivity = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      console.log(newImage);
      const data = {
        id: activity._id,
        name,
        description,
        location,
        image: newImage
          ? {
              name: new Date() + "_activity",
              type: "image/jpg",
              uri: image,
            }
          : null,
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

      console.log(formData(data));
      await client
        .post("/update-activity", formData(data), {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        })
        .then(function (response) {
          if (response.data.success) {
            navigation.navigate("MyActivity", {
              activity: response.data.activity,
            });
          } else {
            updateError(response.data.message, setError);
          }
        })
        .catch(function (error) {
          updateError(
            error?.response?.data?.message || error.message,
            setError
          );
        });
    } catch (error) {
      updateError(error.message, setError);
      console.log(error);
    }
    setLoading(false);
  };

  const openImageLibrary = async () => {
    setLoading(true);
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

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
        setNewImage(true);
        console.log(result.assets[0].uri);
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setImage(activity.image);
      setName(activity.name);
      setDescription(activity.description);
      setLocation(activity.location);
      setDate(new Date(activity.date));
      setTime(new Date(activity.date));
      setError("");
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={{
        height: "100%",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
      behavior="padding"
    >
      {image ? (
        <Image
          source={{ uri: image }}
          style={{ width: "100%", height: "40%" }}
        />
      ) : (
        <View
          style={{
            width: "100%",
            height: "40%",
            backgroundColor: "#A2B7D3",
          }}
        ></View>
      )}
      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 0)",
          "rgba(255, 255, 255, 0.4)",
          "rgba(255, 255, 255, 0.8)",
          "#FFFFFF",
        ]}
        locations={[0.7102, 0.8229, 0.918, 1]}
        style={{
          width: "100%",
          height: "40%",
          position: "absolute",
          top: 0,
        }}
      ></LinearGradient>
      <TouchableOpacity
        style={{
          width: "100%",
          height: "40%",
          position: "absolute",
          top: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={openImageLibrary}
      >
        <MaterialCommunityIcons
          name="image-edit-outline"
          size={70}
          color="#FFFFFF90"
        />
      </TouchableOpacity>
      {error && (
        <Text style={{ color: "red", fontSize: 14, textAlign: "center" }}>
          {error}
        </Text>
      )}
      <ScrollView>
        <TextInput
          style={{
            fontFamily: "PlusJakartaSansSemiBold",
            fontSize: 25,
            textAlign: "center",
            borderWidth: 1.5,
            borderRadius: 5,
            borderColor: "#A2B7D3",
            marginHorizontal: "15%",
            paddingVertical: 10,
          }}
          placeholder="Activity Title"
          value={name}
          onChangeText={(value) => setName(value)}
          // onFocus={() => setInputColor("#0B2C7F")}
          // onBlur={() => setInputColor("#95989D")}
        />
        <View
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderColor: "#A2B7D3",
              borderTopWidth: 1,
              borderBottomWidth: 1,
              width: "50%",
              height: "100%",
              position: "absolute",
            }}
          ></View>
          <View
            style={{
              padding: 10,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 2.5,
              }}
            >
              <FontAwesome name="calendar" size={20} color="#0B2C7F" />
              <Text
                style={{
                  fontFamily: "PlusJakartaSansBold",
                  fontSize: 16,
                  color: "#0B2C7F",
                  marginLeft: 5,
                }}
              >
                Date:{" "}
              </Text>
              {Platform.OS === "ios" ? (
                <DateTimePicker
                  mode="date"
                  value={date}
                  onChange={(event) => {
                    setDate(new Date(event.nativeEvent.timestamp));
                  }}
                />
              ) : (
                <CustomDateTimePicker
                  mode="date"
                  value={date}
                  onChange={(event) => {
                    setDate(new Date(event.nativeEvent.timestamp));
                  }}
                />
              )}
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 2.5,
              }}
            >
              <Feather name="clock" size={20} color="#0B2C7F" />
              <Text
                style={{
                  fontFamily: "PlusJakartaSansBold",
                  fontSize: 16,
                  color: "#0B2C7F",
                  marginLeft: 5,
                }}
              >
                Time:{" "}
              </Text>
              {Platform.OS === "ios" ? (
                <DateTimePicker
                  mode="time"
                  value={time}
                  onChange={(event) => {
                    setTime(new Date(event.nativeEvent.timestamp));
                  }}
                />
              ) : (
                <CustomDateTimePicker
                  mode="time"
                  value={time}
                  onChange={(event) => {
                    setTime(new Date(event.nativeEvent.timestamp));
                  }}
                />
              )}
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 2.5,
              }}
            >
              <SimpleLineIcons name="location-pin" size={20} color="#0B2C7F" />
              <Text
                style={{
                  fontFamily: "PlusJakartaSansBold",
                  fontSize: 16,
                  color: "#0B2C7F",
                  marginRight: 10,
                  marginLeft: 5,
                }}
              >
                Location:{" "}
              </Text>
              <TextInput
                style={{
                  fontFamily: "PlusJakartaSansMedium",
                  fontSize: 16,
                  borderWidth: 1.5,
                  borderRadius: 5,
                  borderColor: "#A2B7D3",
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  maxWidth: "70%",
                }}
                value={location}
                placeholder="Choose a location"
                onChangeText={(value) => setLocation(value)}
              />
            </View>
          </View>
        </View>
        <View>
          <TextInput
            style={{
              fontFamily: "PlusJakartaSans",
              fontSize: 18,
              textAlign: "left",
              padding: 30,
              marginBottom: 100,
              borderWidth: 1.5,
              borderRadius: 5,
              borderColor: "#A2B7D3",
              paddingVertical: 10,
              minHeight: 200,
              marginHorizontal: 10,
            }}
            value={description}
            placeholder="Description"
            onChangeText={(value) => setDescription(value)}
            multiline={true}
          />
        </View>
      </ScrollView>
      <FormSubmitButton
        title="Save"
        style={styles.editButton}
        onPress={updateActivity}
      />
      <LinearGradient
        colors={["#000000", "rgba(0, 0, 0, 0)"]}
        style={{
          width: "100%",
          paddingVertical: 10,
          paddingTop: 50,
          position: "absolute",
          top: 0,
        }}
      >
        <TouchableOpacity
          style={{
            width: "100%",
            paddingHorizontal: 30,
          }}
          onPress={() => navigation.goBack()}
        >
          <Octicons name="chevron-left" size={40} color="#FFF" />
        </TouchableOpacity>
      </LinearGradient>
      {loading && <AppLoader />}
    </KeyboardAvoidingView>
  );
};

export default EditActivity;

const styles = StyleSheet.create({});
