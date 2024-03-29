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
import RegisteredActivityListing from "./RegisteredActivityListing";

const Activities = ({ navigation }) => {
  const { loginPending, setLoginPending, profile, fetchUser } =
    useLogin();
  const [activities, setActivities] = useState([]);
  const [registeredActivities, setRegisteredActivities] = useState({});

  const getActivities = async () => {
    setLoginPending(true);
    const token = await AsyncStorage.getItem("token");
    let registeredActivityMap = {};
    await client
      .get("/registered-activities", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        if (response.data.success) {
          response.data.activities.forEach((activity) => {
            registeredActivityMap[activity._id] = activity;
          });
          setRegisteredActivities(registeredActivityMap);
        }
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });

    await client
      .get("/activities", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        let activityMap = [];
        if (res.data.success) {
          res.data.activities.forEach((activity) => {
            if (!registeredActivityMap[activity._id]) {
              activityMap.push(activity);
            }
          });
          setActivities(activityMap);
        }
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
    setLoginPending(false);
  };

  useEffect(() => {
    fetchUser();
    getActivities();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchUser();
      getActivities();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View
          style={{
            width: "100%",
            flex: 1,
            paddingHorizontal: 20,
            // borderWidth: 1
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 15,
              borderWidth: 1,
              borderColor: "#A2B7D3",
              height: 50,
              width: "100%",
              marginBottom: 30,
              backgroundColor: "#FAFAFA",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                columnGap: 10,
              }}
            >
              <FontAwesome
                name="search"
                size={20}
                color="#3C3C43"
                opacity={0.6}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: "#3C3C43",
                  opacity: 0.6,
                  fontFamily: "PlusJakartaSansMedium",
                }}
              >
                Find a new activity!
              </Text>
            </View>
            <TextInput
              // {...props}
              style={{
                // borderWidth: 1,
                width: "100%",
                textAlign: "center",
                height: "100%",
                fontSize: 16,
                fontFamily: "PlusJakartaSansBold",
                position: "absolute",
                backgroundColor: "transparent",
              }}
              // onFocus={() => setInputColor("#0B2C7F")}
              // onBlur={() => setInputColor("#95989D")}
            />
          </View>
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
              Your upcoming activities:
            </Text>
            {loginPending ||
              (registeredActivities &&
              Object.keys(registeredActivities).length > 0 ? (
                <ScrollView
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    columnGap: 20,
                  }}
                  horizontal
                  pagingEnabled
                  contentContainerStyle={{
                    justifyContent: "center",
                  }}
                  showsHorizontalScrollIndicator={false}
                >
                  {Object.keys(registeredActivities).map((id) => (
                    <RegisteredActivityListing
                      activity={registeredActivities[id]}
                      key={id}
                      navigation={navigation}
                    />
                  ))}
                </ScrollView>
              ) : (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "PlusJakartaSansMedium",
                      color: "#3C3C43",
                      opacity: 0.6,
                      fontSize: 16,
                    }}
                  >
                    No activities yet
                  </Text>
                </View>
              ))}
          </View>
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
              Recommended for you:
            </Text>
            {loginPending ||
              (activities && Object.keys(activities).length > 0 ? (
                <ScrollView
                  style={{ width: "100%" }}
                  showsVerticalScrollIndicator={false}
                >
                  {activities.map((activity) => (
                    <ActivityListing
                      navigation={navigation}
                      getActivities={getActivities}
                      activity={activity}
                      key={activity._id}
                    />
                  ))}
                </ScrollView>
              ) : (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "PlusJakartaSansMedium",
                      color: "#3C3C43",
                      opacity: 0.6,
                      fontSize: 16,
                    }}
                  >
                    No activities yet
                  </Text>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
      <TouchableHighlight
        style={{
          backgroundColor: "#0B2C7F",
          paddingVertical: 20,
          margin: 20,
          borderRadius: 100,
          width: 80,
          height: 80,
          position: "absolute",
          bottom: 0,
          right: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          navigation.navigate("CreateActivity");
        }}
      >
        <Entypo name="plus" size={30} color="white" />
      </TouchableHighlight>
    </>
  );
};

export default Activities;

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
