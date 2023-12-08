import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import client from "../api/client";
import ActivityListing from "./ActivityListing";
import AppLoader from "./AppLoader";
import { ScrollView } from "react-native-gesture-handler";
import { Entypo } from "react-native-vector-icons";
import { useLogin } from "../context/LoginProvider";
import { FontAwesome, SimpleLineIcons } from "react-native-vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";

const Home = ({ navigation }) => {
  // const { loginPending, setLoginPending } = useLogin();
  // const [activities, setActivities] = useState([]);
  // const [myActivities, setMyActivities] = useState({});

  // const getActivities = async () => {
  //   setLoginPending(true);
  //   const token = await AsyncStorage.getItem("token");
  //   const response = await client.get("/my-activities", {
  //     headers: {
  //       Authorization: token,
  //     },
  //   });
  //   let myActivityMap = {};
  //   if (response.data.success) {
  //     response.data.activities.forEach((activity) => {
  //       myActivityMap[activity._id] = activity;
  //     });
  //     setMyActivities(myActivityMap);
  //   }

  //   const res = await client.get("/activities");
  //   let activityMap = [];
  //   if (res.data.success) {
  //     res.data.activities.forEach((activity) => {
  //       if (!myActivityMap[activity._id]) {
  //         activityMap.push(activity);
  //       }
  //     });
  //     setActivities(activityMap);
  //   }
  //   setLoginPending(false);
  // };

  // useEffect(() => {
  //   getActivities();
  // }, []);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     getActivities();
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  return (
    <>
      <ScrollView style={styles.container}>
        <View
          style={{
            width: "100%",
            flex: 1,
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              marginBottom: 20,
              minHeight: 150,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                lineHeight: 50,
                fontFamily: "PlusJakartaSansSemiBold",
              }}
            >
              Your next match:
            </Text>

            <View
              // key={id}
              style={{
                width: "100%",
                height: 120,
                marginRight: 20,
                marginVertical: 5,
                borderWidth: 1,
                borderRadius: 20,
                borderColor: "#A2B7D3",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "PlusJakartaSansBold",
                  fontSize: 16,
                }}
              >
                Coming soon!
              </Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                // lineHeight: 50,
                fontFamily: "PlusJakartaSansBold",
                textTransform: "uppercase",
                marginTop: 50,
                marginBottom: 0,
              }}
            >
              Lunch Roulette
            </Text>
            <Text
              style={{
                fontSize: 14,
                // lineHeight: 50,
                color: "#0B2C7F",
                fontFamily: "PlusJakartaSansBold",
                textTransform: "uppercase",
                // margin: 50,
              }}
            >
              {format(new Date(), "EEEE, MMMM do")}
            </Text>
            <View
              style={{
                backgroundColor: "#0B2C7F",
                borderRadius: 20,
                height: 160,
                width: "100%",
                margin: 20,
                marginVertical: 5,
                borderWidth: 1,
                borderRadius: 20,
                borderColor: "#A2B7D3",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "PlusJakartaSansBold",
                  fontSize: 16,
                }}
              >
                Coming soon!
              </Text>
            </View>
            <Text
              style={{
                marginTop: 20,
                fontSize: 16,
                fontFamily: "PlusJakartaSansMedium",
                color: "#0B2C7F",
              }}
            >
              Generate new pairing
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    // alignItems: "center",
    // justifyContent: "flex-start",
    fontFamily: "PlusJakartaSans",
    backgroundColor: "white",
    paddingTop: 50,
    paddingBottom: 100,
  },
});
