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

const RegisteredActivityListing = ({ activity, id, navigation }) => {
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
  useEffect(() => {
    getOwner();
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
            uri:
              activity.image ||
              "https://img.freepik.com/free-photo/people-having-fun-wedding-hall_1303-19593.jpg?w=1800&t=st=1702013128~exp=1702013728~hmac=3de0e03364fbdec43b157e208a9765e85ea06fe930ac4b33b459ed05c9388871",
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
            {format(new Date(activity.date), "HH:MM     dd-MMM-yy")}
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
