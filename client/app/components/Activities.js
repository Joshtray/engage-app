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

const Activities = ({ navigation }) => {
  const { loginPending, setLoginPending } = useLogin();
  const [activities, setActivities] = useState([]);
  const [myActivities, setMyActivities] = useState({});

  const getActivities = async () => {
    setLoginPending(true);
    const token = await AsyncStorage.getItem("token");
    const response = await client.get("/my-activities", {
      headers: {
        Authorization: token,
      },
    });
    let myActivityMap = {};
    if (response.data.success) {
      response.data.activities.forEach((activity) => {
        myActivityMap[activity._id] = activity;
      });
      setMyActivities(myActivityMap);
    }

    const res = await client.get("/activities");
    let activityMap = [];
    if (res.data.success) {
      res.data.activities.forEach((activity) => {
        if (!myActivityMap[activity._id]) {
          activityMap.push(activity);
        }
      });
      setActivities(activityMap);
    }
    setLoginPending(false);
  };

  useEffect(() => {
    getActivities();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
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
              ((myActivities && Object.keys(myActivities).length > 0) ? (
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
                  {Object.keys(myActivities).map((id) => (
                    <View
                      key={id}
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
                          backgroundColor: "#A2B7D3",
                          borderTopLeftRadius: 20,
                          borderTopRightRadius: 20,
                        }}
                      >
                        <Image
                          source={{
                            uri: "https://img.freepik.com/free-photo/people-having-fun-wedding-hall_1303-19593.jpg?w=1800&t=st=1702013128~exp=1702013728~hmac=3de0e03364fbdec43b157e208a9765e85ea06fe930ac4b33b459ed05c9388871",
                          }}
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
                            {format(
                              new Date(myActivities[id].date),
                              "HH:MM     dd-MMM-yy"
                            )}
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontSize: 16,
                            color: "#0B2C7F",
                            fontFamily: "PlusJakartaSansSemiBold",
                          }}
                        >
                          {myActivities[id].name}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View
                  style={{
                    // width: "100%",
                    // width: 100,
                    // height: 100,
                    // borderWidth: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                  }}
                >
                  <Text style={{
                    fontFamily: "PlusJakartaSansMedium",
                    color: "#3C3C43",
                    opacity: 0.6,
                    fontSize: 16,
                  }}>No activities yet</Text>
                </View>
              ))}
          </View>
          <View>
            <Text
              style={{
                fontSize: 20,
                lineHeight: 50,
                fontFamily: "PlusJakartaSansSemiBold",
              }}
            >
              Recommended for you:
            </Text>
            {loginPending || (
              <ScrollView
                style={{ width: "100%" }}
                showsVerticalScrollIndicator={false}
              >
                {activities.map((activity) => (
                  <ActivityListing
                    navigation={navigation}
                    getActivities={getActivities}
                    {...activity}
                    key={activity._id}
                  />
                ))}
              </ScrollView>
            )}
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
