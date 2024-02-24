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
import { Entypo, Feather } from "react-native-vector-icons";
import { useLogin } from "../context/LoginProvider";
import { Ionicons } from "react-native-vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";

const Home = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [match, setMatch] = useState({});

  const getMatch = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      await client
        .get("/generate-match", {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          if (res.data.success) {
            setMatch(res.data.match);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMatch();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getMatch();
    });

    return unsubscribe;
  }, [navigation]);

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
                height: 150,
                borderWidth: 1,
                borderRadius: 20,
                borderColor: "#A2B7D3",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {loading ? (
                <Text
                  style={{
                    fontFamily: "PlusJakartaSansBold",
                    fontSize: 16,
                    color: "#0B2C7F",
                  }}
                >
                  Loading...
                </Text>
              ) : (
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      width: "100%",
                      flex: 1,
                      padding: 20,
                    }}
                  >
                    <Image
                      source={{
                        uri: match.avatar,
                      }}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                      }}
                    />
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        marginLeft: 20,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "PlusJakartaSansBold",
                          fontSize: 16,
                          color: "#0B2C7F",
                        }}
                      >
                        {match.fullname}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "PlusJakartaSans",
                          fontSize: 12,
                        }}
                      >
                        {match.email}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "35%",
                      width: "100%",
                      borderBottomLeftRadius: 20,
                      borderBottomRightRadius: 20,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        width: "50%",
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "50%",
                          width: "100%",
                          borderRightWidth: 0.5,
                          borderColor: "#A2B7D3",
                        }}
                      >
                        <Feather name="check" size={24} color="#34A853" />
                        <Text
                          style={{
                            fontFamily: "PlusJakartaSansSemiBold",
                            fontSize: 14,
                            marginLeft: 10,
                          }}
                        >
                          Accept
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        width: "50%",
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "50%",
                          width: "100%",
                          borderLeftWidth: 0.5,
                          borderColor: "#A2B7D3",
                        }}
                      >
                        <Ionicons name="close" size={24} color="#EA4335" />
                        <Text
                          style={{
                            fontFamily: "PlusJakartaSansSemiBold",
                            fontSize: 14,
                            marginLeft: 10,
                          }}
                        >
                          Reject
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
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
