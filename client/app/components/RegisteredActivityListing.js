import {
  StyleSheet,
  Text,
  View,
  Image,
  Touchable,
  TouchableHighlight,
} from "react-native";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { TouchableOpacity } from "react-native-gesture-handler";
import client from "../api/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLogin } from "../context/LoginProvider";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const RegisteredActivityListing = ({ activity, navigation }) => {
  const [owner, setOwner] = useState({});
  const { profile } = useLogin();

  const getOwner = async () => {
    const token = await AsyncStorage.getItem("token");
    const res = await client.get(`/users/${activity.owner}`, {
      headers: {
        Authorization: token,
      },
    });
    if (res.data.success) {
      setOwner(res.data.user);
    }
  };

  const scheduleNotification = async () => {
    // await Notifications.getAllScheduledNotificationsAsync().then((res) => {
    //   console.log("Scheduled notifications: ", res);
    // });
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        identifier: activity._id,
        content: {
          title: `Upcoming activity: \"${activity.name}\"!`,
          body: "You have a company activity coming up soon! Manage it in the app.",
        },
        // Set trigger date to 24 hours before the activity date
        trigger: new Date(new Date(activity.date) - 86400000),
      });
    } catch (error) {
      console.log(`Error, ${error}`);
    }
  };

  useEffect(() => {
    getOwner();
    scheduleNotification();
  }, []);
  return (
    <TouchableOpacity
      onPress={() => {
        if (activity.owner === profile._id) {
          navigation.navigate("MyActivity", { activity });
        } else {
          navigation.navigate("Activity", { activity, owner });
        }
      }}
      key={activity._id}
      style={{
        width: 150,
        height: 150,
        marginRight: 20,
        marginVertical: 5,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: "#A2B7D3",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: "100%",
          height: "60%",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
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
          style={{
            width: "100%",
            height: "100%",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        />
      </View>
      <View
        style={{
          width: "100%",
          height: "40%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          // alignItems: "center",
          alignItems: "space-between",
          padding: 10,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            columnGap: 5,
          }}
        >
          {/* <SimpleLineIcons
                            name="location-pin"
                            size={14}
                            color="#0B2C7F"
                          /> */}
          <Text
            numberOfLines={1}
            style={{
              fontSize: 12,
              fontFamily: "PlusJakartaSansMedium",
              textAlign: "center",
            }}
          >
            {format(new Date(activity.date), "HH:mm     dd-MMM-yy")}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 16,
            color: "#0B2C7F",
            fontFamily: "PlusJakartaSansSemiBold",
          }}
        >
          {activity.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RegisteredActivityListing;

const styles = StyleSheet.create({});
