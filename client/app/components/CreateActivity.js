import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLogin } from "../context/LoginProvider";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormInput from "./FormInput";
import FormHeader from "./FormHeader";
import FormContainer from "./FormContainer";
import client from "../api/client";
import { updateError } from "../utils/methods";

const CreateActivity = () => {
  const [name, setName] = useState("Test");
  const [description, setDescription] = useState("testing...");
  const [location, setLocation] = useState("test location");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [error, setError] = useState("");

  const { setIsLoggedIn } = useLogin();
  const navigation = useNavigation();

  const handleSubmit = async () => {
    const data = {
      name,
      description,
      location,
      // Combine date and time into one date object
      date: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
        time.getSeconds()
      ),
    };

    const token = await AsyncStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const res = await client.post("/create-activity", data, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      });

      if (res.data.success) {
        navigation.goBack();
      } else {
        updateError(res.data.message, setError);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{display: "flex", justifyContent: "center", alignItems: "center", flex: 1}}>
      <FormHeader
        leftHeading={"Create an Activity"}
        rightHeading={"Back"}
        subHeading={""}
      />
      <FormContainer
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          padding: 30,
        }}
      >
        {error && <Text style={{color: 'red', fontSize: 18, textAlign: "center"}}>{error}</Text>}
        <FormInput
          value={name}
          label="Activity Name"
          placeholder="Activity Name"
          onChangeText={(value) => setName(value)}
        />

        <FormInput
          value={description}
          label="Description"
          placeholder="Description"
          onChangeText={(value) => setDescription(value)}
        />

        <FormInput
          value={location}
          label="Location"
          placeholder="Location"
          onChangeText={(value) => setLocation(value)}
        />

        <Text style={{ textAlign: "center", fontWeight: "bold" }}>
          Date and Time
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 100,
          }}
        >
          <DateTimePicker
            mode="date"
            value={date}
            onChange={(event) => {
              setDate(new Date(event.nativeEvent.timestamp));
            }}
          />
          <DateTimePicker
            mode="time"
            value={time}
            onChange={(event) => {
              setTime(new Date(event.nativeEvent.timestamp));
            }}
          />
        </View>

        <Button title="Submit" onPress={handleSubmit} />
      </FormContainer>
    </View>
  );
};

export default CreateActivity;
