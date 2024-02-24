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
import registerAlert from "../alerts/registerAlert";
import unregisterAlert from "../alerts/unregisterAlert";

const Activity = ({ route, navigation }) => {
  const { loginPending, setLoginPending, profile, setProfile } = useLogin();
  const { activity, owner } = route.params;
  const [joined, setJoined] = useState(false);

  const joinActivity = async () => {
    setLoginPending(true);
    const token = await AsyncStorage.getItem("token");
    console.log(activity._id);
    await client
      .post(
        "/register",
        { id: activity._id },
        {
          method: "POST",
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setProfile({
            ...profile,
            activities: [...profile.activities, activity._id],
          });
          navigation.goBack();
        } else {
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
    setLoginPending(false);
  };

  const leaveActivity = async () => {
    setLoginPending(true);
    const token = await AsyncStorage.getItem("token");
    await client
      .post(
        "/unregister",
        { id: activity._id },
        {
          method: "POST",
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setProfile({
            ...profile,
            activities: profile.activities.filter(
              (act) => act !== activity._id
            ),
          });
          navigation.goBack();
        } else {
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
    setLoginPending(false);
  };

  const checkIfJoined = () => {
    const joinedActivities = profile.activities;
    // Check if joinedActivities has the activity id or has an object with the activity id
    if (joinedActivities?.includes(activity._id)) {
      setJoined(true);
    }
  };

  useEffect(() => {
    checkIfJoined();
  }, [profile]);

  return (
    <View
      style={{
        height: Dimensions.get("window").height,
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Image
        source={{ uri: activity.image }}
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
        <TouchableOpacity
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
          onPress={() => {
            navigation.navigate("Profile", { user: owner });
          }}
        >
          <Image
            source={
              owner.avatar
                ? { uri: owner.avatar }
                : require("../../assets/icon.png")
            }
            style={{
              width: 25,
              height: 25,
              borderRadius: 100,
              marginRight: 10,
            }}
          />
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              fontFamily: "PlusJakartaSansSemiBold",
            }}
          >
            {owner.fullname}
          </Text>
        </TouchableOpacity>
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
        title={joined ? "Unregister" : "Join"}
        onPress={() =>
          joined
            ? unregisterAlert(activity, leaveActivity)
            : registerAlert(activity, joinActivity)
        }
        style={
          joined && {
            backgroundColor: "#EA4335",
          }
        }
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

export default Activity;

const styles = StyleSheet.create({});
