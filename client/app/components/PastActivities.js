import { Dimensions, StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Octicons } from "react-native-vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../api/client";
import { useLogin } from "../context/LoginProvider";
import PastActivityListing from "./PastActivityListing";

const PastActivities = ({ navigation }) => {
  const { loginPending, setLoginPending, fetchUser } = useLogin();
  const [pastActivities, setPastActivities] = useState(null);

  const getPastActivities = async () => {
    setLoginPending(true);
    const token = await AsyncStorage.getItem("token");
    const response = await client.get("/past-activities", {
      headers: {
        Authorization: token,
      },
    });
    if (response.data.success) {
      setPastActivities(response.data.activities);
    }
    setLoginPending(false);
  };

  useEffect(() => {
    fetchUser();
    getPastActivities();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchUser();
      getPastActivities();
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <View
      style={{
        height: "100%",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        paddingTop: 50,
      }}
    >
      <View
        style={{
          width: "100%",
          paddingVertical: 10,
        }}
      >
        <TouchableOpacity
          style={{
            width: "100%",
            paddingHorizontal: 30,
          }}
          onPress={() => navigation.goBack()}
        >
          <Octicons name="chevron-left" size={40} color="#0B2C7F" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: "100%",
          flex: 1,
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "PlusJakartaSansBold",
            fontSize: 25,
            textAlign: "left",
            width: "100%",
            marginBottom: 50,
          }}
        >
          Past activities:
        </Text>
        {loginPending ||
          (pastActivities ? (
            <ScrollView
              style={{ width: "100%" }}
              showsVerticalScrollIndicator={false}
            >
              {pastActivities.map((activity) => (
                <PastActivityListing activity={activity} key={activity._id} />
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
  );
};

export default PastActivities;

const styles = StyleSheet.create({});
