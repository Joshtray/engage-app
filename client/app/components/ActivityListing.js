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
import AppLoader from "./AppLoader";
import { format, set } from "date-fns";
import {
  FontAwesome,
  Feather,
  SimpleLineIcons,
  Ionicons,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLogin } from "../context/LoginProvider";

const ActivityListing = (props) => {
  const { navigation, getActivities } = props;
  const { setLoginPending } = useLogin();
  const [ownerAvatar, setOwnerAvatar] = useState("");
  const [ownerName, setOwnerName] = useState("");

  const getOwner = async () => {
    const res = await client.get(`/users/${props.owner}`);
    if (res.data.success) {
      setOwnerAvatar(res.data.user.avatar);
      setOwnerName(res.data.user.fullname);
    }
  };
  useEffect(() => {
    getOwner();
  }, []);
  return (
    <>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          // justifyContent: "space-between",
          columnGap: 10,
          alignItems: "center",
          padding: 2,
          borderColor: "#A2B7D3",
          borderWidth: 0.5,
          borderRadius: 20,
          marginVertical: 10,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 80,
              minHeight: 100,
              maxHeight: 120,
            }}
          >
            <Image
              resizeMode="cover"
              source={{
                uri: "https://img.freepik.com/free-photo/people-having-fun-wedding-hall_1303-19593.jpg?w=1800&t=st=1702013128~exp=1702013728~hmac=3de0e03364fbdec43b157e208a9765e85ea06fe930ac4b33b459ed05c9388871",
              }}
              style={{
                maxWidth: "100%",
                height: "100%",
                borderRadius: 20,
                borderBottomRightRadius: 0,
                borderTopRightRadius: 0,
              }}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            paddingVertical: 10,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              rowGap: 5,
              marginBottom: 10,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                height: "100%",
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 16,
                  fontFamily: "PlusJakartaSansBold",
                  flex: 1,
                  height: "100%",
                }}
              >
                {props.name}
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                marginRight: 20,
              }}
            >
              {ownerAvatar ? (
                <Image
                  source={{ uri: ownerAvatar }}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 100,
                    marginRight: 5,
                  }}
                />
              ) : (
                <Image
                  source={require("../../assets/icon.png")}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 100,
                    marginRight: 5,
                  }}
                />
              )}
              <Text
                style={{
                  fontSize: 12,
                  textAlign: "center",
                  fontFamily: "PlusJakartaSansSemiBold",
                }}
              >
                {ownerName}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              rowGap: 5,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 5,
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "65%",
                }}
              >
                <FontAwesome name="calendar" size={14} color="#0B2C7F" />
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: "PlusJakartaSansMedium",
                    fontSize: 12,
                    flex: 1,
                  }}
                >
                  {format(new Date(props.date), "do MMM, yyyy")}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 5,
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "35%",
                }}
              >
                <Feather name="clock" size={14} color="#0B2C7F" />
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 12,
                    fontFamily: "PlusJakartaSansMedium",
                    flex: 1,
                  }}
                >
                  {format(new Date(props.date), "HH:mm")}
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 5,
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "65%",
                }}
              >
                <SimpleLineIcons
                  name="location-pin"
                  size={14}
                  color="#0B2C7F"
                />
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 12,
                    fontFamily: "PlusJakartaSansMedium",
                    flex: 1,
                  }}
                >
                  {props.location}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 5,
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "35%",
                }}
              >
                <Ionicons name="people-outline" size={14} color="#0B2C7F" />
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 12,
                    fontFamily: "PlusJakartaSansMedium",
                    flex: 1,
                  }}
                >
                  6/10
                </Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderRadius: 10,
            marginRight: 10,
            borderColor: "rgba(162, 183, 211, 0.5)",
          }}
          onPress={async () => {
            setLoginPending(true);
            const token = await AsyncStorage.getItem("token");
            const res = await client.post(
              "/register",
              { id: props._id },
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
              }
            );
            if (res.data.success) {
              getActivities()
            } else {
              console.log(res.data.message);
            }
            setLoginPending(false);
          }}
        >
          <MaterialCommunityIcons
            name="pencil-plus-outline"
            size={30}
            color="#0B2C7F"
          />
        </TouchableOpacity>
        {/* <View style={{}}>
          <Text
            style={{
              fontSize: 10,
              textAlign: "right",
              fontFamily: "PlusJakartaSans",
            }}
          >
            {format(new Date(props.date), "yyyy/MM/dd HH:mm")}
          </Text>
          <Text
            style={{
              fontSize: 10,
              textAlign: "right",
              fontFamily: "PlusJakartaSans",
            }}
          >
            {props.location}
          </Text>
        </View> */}
      </View>
    </>
  );
};

export default ActivityListing;

const styles = StyleSheet.create({});
