import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import FormSubmitButton from "./FormSubmitButton";
import AppLoader from "./AppLoader";
import SelectInterestButton from "./SelectInterestButton";
import client from "../api/client";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import FormHeader from "./FormHeader";
import { Octicons } from "react-native-vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SelectInterests = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(new Set());
  const getTags = async () => {
    try {
      await client
        .get("/tags")
        .then((res) => {
          if (res.data.success) {
            setTags(res.data.tags);
          }
        })
        .catch((e) => {
          console.log("Error in getting tags: ", e);
        });
    } catch (e) {
      console.log("Error in getting tags: ", e);
    } finally {
      setLoading(false);
    }
  };

  const updateInterests = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      await client
        .post(
          "/update-profile",
          {
            update: {
              interests: Array.from(selectedTags),
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
            navigation.navigate("ScheduleMatch");
          } else {
            console.log(res.data.message);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getTags();
  }, []);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        marginBottom: 50,
      }}
    >
      <View style={{ marginTop: 50, height: 63 }}>
        <FormHeader heading={"engage"} />
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
          onPress={() => navigation.navigate("JobDetails")}
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
        Pick your interests
      </Text>
      <Text
        style={{
          fontFamily: "PlusJakartaSansMedium",
          fontSize: 17,
          padding: 20,
          paddingBottom: 15,
        }}
      >
        Select at least 5 interests to get started:
      </Text>
      <Text
        style={{
          fontFamily: "PlusJakartaSansMedium",
          fontSize: 15,
          padding: 20,
          paddingTop: 15,
        }}
      >
        These will be used to match you with employees that share similar
        interests with you.
      </Text>
      <FlatList
        data={tags}
        keyExtractor={(item) => item._id} //has to be unique
        renderItem={({ item }) => (
          <SelectInterestButton
            tag={item}
            selected={selectedTags.has(item._id)}
            setSelectedTags={setSelectedTags}
          />
        )} //method to render the data in the way you want using styling u need
        horizontal={false}
        numColumns={2}
        style={{
          width: "100%",
          height: "60%",
          paddingTop: 20,
        }}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
      />
      <FormSubmitButton
        title={`Continue   (${selectedTags.size})`}
        onPress={updateInterests}
        disabled={selectedTags.size < 5}
      />
      {loading && <AppLoader />}
    </View>
  );
};

export default SelectInterests;

const styles = StyleSheet.create({});
