import {
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import FormSubmitButton from "./FormSubmitButton";
import AppLoader from "./AppLoader";
import FormHeader from "./FormHeader";
import FormInput from "./FormInput";
import { useLogin } from "../context/LoginProvider";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Octicons } from "react-native-vector-icons";
import client from "../api/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const JobDetails = ({ navigation }) => {
  const { profile, setProfile } = useLogin();
  const [loading, setLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState(profile.jobTitle);
  const [team, setTeam] = useState(profile.team);
  const [org, setOrg] = useState(profile.org);

  const updateUser = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      await client
        .post(
          "/update-profile",
          {
            update: {
              jobTitle,
              team,
              org,
            },
          },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((res) => {
          if (res.data.success) {
            setProfile(res.data.user);
            navigation.navigate("SelectInterests");
          } else {
            console.log(res.data.message);
          }
        });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      behavior="padding"
      enabled
    >
      <View
        style={{
          marginTop: 50,
          height: 63,
        }}
      >
        <FormHeader
          heading={"engage"}
          // leftHeading={"Welcome "}
          // rightHeading={"Back"}
          // subHeading={"engage"}
          // leftHeaderTranslateX={leftHeaderTranslateX}
          // rightHeaderOpacity={rightHeaderOpacity}
          // rightHeaderTranslateY={rightHeaderTranslateY}
        />
      </View>
      <View
        style={{
          width: "100%",
          paddingVertical: 10,
          position: "absolute",
          top: 50,
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
      <Text
        style={{
          fontFamily: "PlusJakartaSansExtraBold",
          fontSize: 25,
          textAlign: "center",
          marginVertical: Platform.OS === "ios" ? 45 : 20,
        }}
      >
        Job Details
      </Text>
      <Text
        style={{
          fontFamily: "PlusJakartaSansMedium",
          fontSize: 17,
          padding: 22,
        }}
      >
        Please provide us with some more details about your job at edgur:
      </Text>
      <View
        style={{
          flex: 1,
          display: "flex",
          marginBottom: 100,
          paddingHorizontal: 27,
          paddingVertical: 20,
          width: Dimensions.get("window").width,
        }}
      >
        <FormInput
          value={jobTitle}
          label="Job Title"
          placeholder="Job Title..."
          onChangeText={(value) => setJobTitle(value)}
        />

        <FormInput
          value={team}
          label="Team"
          placeholder="Team..."
          onChangeText={(value) => setTeam(value)}
        />

        <FormInput
          value={org}
          label="Company Org"
          placeholder="Company Org..."
          onChangeText={(value) => setOrg(value)}
        />
      </View>
      <FormSubmitButton
        title={`Save`}
        onPress={updateUser}
        secondaryOnPress={() => navigation.navigate("SelectInterests")}
        secondaryTitle={"Skip for now"}
      />
      {loading && <AppLoader />}
    </KeyboardAvoidingView>
  );
};

export default JobDetails;

const styles = StyleSheet.create({});
