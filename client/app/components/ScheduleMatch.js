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
import MatchFrequencyButton from "./MatchFrequencyButton";
import CustomDateTimePicker from "./CustomDateTimePicker";
import DayofMonth from "./DayOfMonth";
import DayofWeek from "./DayOfWeek";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Octicons } from "react-native-vector-icons";

const ScheduleMatch = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [frequency, setFrequency] = useState("");
  const [timeOfDay, setTimeOfDay] = useState(new Date());
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(0);
  const [selectedDayOfMonth, setSelectedDayOfMonth] = useState(0);
  const frequencies = ["Daily", "Weekly", "Monthly"];
  const daysofWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const generateCronSchedule = () => {
    switch (frequency) {
      case "Daily":
        return `${timeOfDay.getMinutes()} ${timeOfDay.getHours()} * * *`;
      case "Weekly":
        return `0 0 * * ${daysofWeek.indexOf(selectedDayOfWeek)}`;
      case "Monthly":
        // TO DO: Account for days that don't exist in certain months
        return `0 0 ${selectedDayOfMonth} * *`;
      default:
        return "";
    }
  };

  const updateMatchSchedule = async (cronSchedule) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      await client
        .post(
          "/update-match-schedule",
          {
              schedule: cronSchedule,
            // schedule: "*/5 * * * *",
          },
          {
            headers: {
              Authorization: token,
            },
          }
        )

        .then((res) => {
          console.log(res.data);
          if (res.data.success) {
            console.log("Match schedule updated successfully");
            navigation.navigate("Home");
          } else {
            console.log("Error in updating match schedule: ", res.data.message);
          }
        })
        .catch((e) => {
          console.log("Error in updating match schedule: ", e);
        });
    } catch (e) {
      console.log("Error in updating match schedule: ", e);
    } finally {
      setLoading(false);
    }
  };

  const scheduleSelector = () => {
    switch (frequency) {
      case "Daily":
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontFamily: "PlusJakartaSansMedium",
              }}
            >
              Time of day:
            </Text>
            <CustomDateTimePicker
              value={timeOfDay}
              mode={"time"}
              onChange={(event) => {
                setTimeOfDay(new Date(event.nativeEvent.timestamp));
              }}
            />
          </View>
        );
      case "Weekly":
        return (
          <View>
            <Text
              style={{
                fontSize: 17,
                fontFamily: "PlusJakartaSansMedium",
              }}
            >
              Day of the week:
            </Text>
            <FlatList
              data={daysofWeek}
              keyExtractor={(item) => item} //has to be unique
              renderItem={({ item }) => (
                <DayofWeek
                  dayOfWeek={item}
                  selected={selectedDayOfWeek === item}
                  setSelectedDayOfWeek={setSelectedDayOfWeek}
                />
              )} //method to render the data in the way you want using styling u need
              horizontal={false}
              numColumns={7}
              style={{
                width: "100%",
                height: "60%",
                paddingTop: 20,
              }}
              contentContainerStyle={{
                justifyContent: "center",
              }}
            />
          </View>
        );
      case "Monthly":
        return (
          <View>
            <Text
              style={{
                fontSize: 17,
                fontFamily: "PlusJakartaSansMedium",
              }}
            >
              Day of the month:
            </Text>
            <FlatList
              data={[
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
              ]}
              keyExtractor={(item) => item} //has to be unique
              renderItem={({ item }) => (
                <DayofMonth
                  dayOfMonth={item}
                  selected={selectedDayOfMonth === item}
                  setSelectedDayOfMonth={setSelectedDayOfMonth}
                />
              )} //method to render the data in the way you want using styling u need
              horizontal={false}
              numColumns={7}
              style={{
                width: "100%",
                height: "60%",
                paddingTop: 20,
              }}
              contentContainerStyle={{
                justifyContent: "center",
              }}
            />
          </View>
        );
      default:
        return;
    }
  };
  useEffect(() => {}, []);

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
          onPress={() => navigation.navigate("SelectInterests")}
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
        Schedule matches
      </Text>
      <Text
        style={{
          fontFamily: "PlusJakartaSansMedium",
          fontSize: 17,
          padding: 20,
        }}
      >
        How frequently would you like to receive match recommendations?:
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          padding: 20,
        }}
      >
        {frequencies.map((f) => (
          <MatchFrequencyButton
            key={f}
            frequency={f}
            selected={frequency === f}
            setFrequency={setFrequency}
          />
        ))}
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 30,
        }}
      >
        {scheduleSelector()}
      </View>
      <FormSubmitButton
        title={`Save`}
        onPress={() => {
          const cronSchedule = generateCronSchedule();
          console.log("Cron Schedule: ", cronSchedule);
          updateMatchSchedule(cronSchedule);
        }}
        disabled={!frequency}
      />
      {loading && <AppLoader />}
    </View>
  );
};

export default ScheduleMatch;

const styles = StyleSheet.create({});
