import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import client from "../api/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLogin } from "../context/LoginProvider";
import { Octicons } from "react-native-vector-icons";

const EventListing = ({ event }) => {
  // const { setLoginPending } = useLogin();
  // const { event, joined , getEvents } = props;
  return (
    <View
      key={event.id}
      style={{
        width: "100%",
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
            event.imageUri
              ? {
                  uri: event.imageUri,
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
          display: "flex",
          flexDirection: "row",
          height: "40%",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: 10,
            paddingLeft: 15,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#0B2C7F",
              fontFamily: "PlusJakartaSansSemiBold",
            }}
          >
            {event.name}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 12,
              fontFamily: "PlusJakartaSansMedium",
            }}
          >
            {event.description}
          </Text>
        </View>
        <View
          style={{
            marginRight: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <Octicons name="plus" size={30} color="#0B2C7F" /> */}
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            // onPress={joined ? () => {} : async () => {
            //   setLoginPending(true);
            //   const token = await AsyncStorage.getItem("token");
            //   const res = await client.post(
            //     "/join",
            //     { id: event._id },
            //     {
            //       method: "POST",
            //       headers: {
            //         "Content-Type": "application/json",
            //         Authorization: token,
            //       },
            //     }
            //   );
            //   if (res.data.success) {
            //     getEvents();
            //   } else {
            //     console.log(res.data.message);
            //   }
            //   setLoginPending(false);
            // }}
          >
            {/* <Octicons
              name="chevron-right"
              size={30}
              color="#0B2C7F"
            /> */}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EventListing;

const styles = StyleSheet.create({});
