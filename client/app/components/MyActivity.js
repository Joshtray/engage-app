import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  Octicons,
  FontAwesome,
  SimpleLineIcons,
  Feather,
  Ionicons,
} from "react-native-vector-icons";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { format } from "date-fns";
import FormSubmitButton from "./FormSubmitButton";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLogin } from "../context/LoginProvider";
import client from "../api/client";
import deleteActivityAlert from "../alerts/deleteActivityAlert";

const MyActivity = ({ route, navigation }) => {
  const { loginPending, setLoginPending, profile } = useLogin();
  const { activity } = route.params;

  const deleteActivity = async () => {
    try {
      setLoginPending(true);
      const token = await AsyncStorage.getItem("token");
      const res = await client.post(
        "/delete-activity",
        { id: activity._id },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (res.data.success) {
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
    }
    await Notifications.cancelScheduledNotificationAsync(activity._id);
    setLoginPending(false);
  };

  return (
    <View
      style={{
        height: "100%",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Image
        source={
          activity.image
            ? {
                uri: activity.image,
              }
            : require("../../assets/activity-image.png")
        }
        style={{ width: "100%", height: "40%" }}
      />
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
      >
        <View
          style={{
            width: "100%",
            position: "absolute",
            top: "90%",
            color: "black",
          }}
        >
          <Text
            style={{
              fontFamily: "PlusJakartaSansSemiBold",
              fontSize: 25,
              textAlign: "center",
            }}
          >
            {activity.name}
          </Text>
        </View>
      </LinearGradient>
      <ScrollView>
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
                  marginRight: 10,
                }}
              >
                Date:{" "}
              </Text>
              <Text
                style={{
                  fontFamily: "PlusJakartaSansMedium",
                  fontSize: 16,
                }}
              >
                {format(new Date(activity.date), "do MMMM, yyyy")}
              </Text>
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
                  marginRight: 10,
                }}
              >
                Time:{" "}
              </Text>
              <Text
                style={{
                  fontFamily: "PlusJakartaSansMedium",
                  fontSize: 16,
                }}
              >
                {format(new Date(activity.date), "HH:mm")}
              </Text>
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
              <Text
                style={{
                  fontFamily: "PlusJakartaSansMedium",
                  fontSize: 16,
                }}
              >
                {activity.location}
              </Text>
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
              <Ionicons name="people-outline" size={20} color="#0B2C7F" />
              <Text
                style={{
                  fontFamily: "PlusJakartaSansBold",
                  fontSize: 16,
                  color: "#0B2C7F",
                  marginRight: 10,
                  marginLeft: 5,
                }}
              >
                Participants:{" "}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "PlusJakartaSansMedium",
                }}
              >
                6/10
              </Text>
            </View>
          </View>
        </View>
        <Text
          style={{
            fontFamily: "PlusJakartaSans",
            fontSize: 18,
            textAlign: "left",
            width: "100%",
            padding: 30,
            marginBottom: 100,
          }}
        >
          {activity.description}
        </Text>
      </ScrollView>
      <FormSubmitButton
        twoButton={true}
        title="Edit"
        onPress={() => {
          navigation.navigate("EditActivity", { activity });
        }}
        title2="Cancel Activity"
        onPress2={() => deleteActivityAlert(activity, deleteActivity)}
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
    </View>
  );
};

export default MyActivity;

const styles = StyleSheet.create({
  editButton: {
    height: "100%",
    flex: 1,
    margin: 10,
    backgroundColor: "#FFF",
    borderColor: "#0B2C7F",
    borderWidth: 2,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    height: "100%",
    flex: 1,
    margin: 10,
    backgroundColor: "#EA4335",
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
  },
});
