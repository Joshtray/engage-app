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
import { useLogin } from "../context/LoginProvider";
import { FontAwesome, Entypo, Octicons } from "react-native-vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import RegisteredActivityListing from "./RegisteredActivityListing";
import SearchBar from "./SearchBar";

const Activities = ({ navigation }) => {
  const { loginPending, setLoginPending, fetchUser } = useLogin();
  const [activities, setActivities] = useState([]);
  const [registeredActivities, setRegisteredActivities] = useState({});
  const [query, setQuery] = useState("");

  const getActivities = async () => {
    setLoginPending(true);
    setQuery("");
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

  const searchActivities = async () => {
    if (!query) {
      return;
    }
    navigation.navigate("SearchResults", {
      query,
    });
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
          }}
        >
          <SearchBar
            handleSearch={searchActivities}
            query={query}
            setQuery={setQuery}
          />
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
              marginBottom: 80,
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
