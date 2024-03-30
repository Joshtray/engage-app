import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../api/client";
import AppLoader from "./AppLoader";
import ConnectionRequestListing from "./ConnectionRequestListing";
import { ScrollView } from "react-native-gesture-handler";

const ConnectionRequests = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  const getRequests = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    await client
      .get("/connection-requests", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setRequests(res.data.requests);
        }
      })
      .catch((e) => {
        console.log("Error in getting connection requests: ", e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getRequests();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getRequests();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading ? (
        <Text
          style={{
            fontFamily: "PlusJakartaSansMedium",
            color: "#3C3C43",
            opacity: 0.6,
            fontSize: 16,
          }}
        >
          Loading....
        </Text>
      ) : requests?.length ? (
        <ScrollView
          style={{
            width: "100%",
            height: "100%",
          }}
          contentContainerStyle={{
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          {requests.map((requestUser) => (
            <ConnectionRequestListing
              key={requestUser._id}
              user={requestUser}
              navigation={navigation}
              getRequests={getRequests}
            />
          ))}
        </ScrollView>
      ) : (
        <Text
          style={{
            fontFamily: "PlusJakartaSansMedium",
            color: "#3C3C43",
            opacity: 0.6,
            fontSize: 16,
          }}
        >
          No connection requests
        </Text>
      )}
    </View>
  );
};

export default ConnectionRequests;

const styles = StyleSheet.create({});
