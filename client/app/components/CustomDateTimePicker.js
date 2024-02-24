import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";

const CustomDateTimePicker = ({ mode, onChange, value }) => {
  const [show, setShow] = useState(false);

  return (
    <SafeAreaView>
      <TouchableOpacity
        onPress={() => setShow(!show)}
        style={{
          backgroundColor: "#EFEFF1",
          borderRadius: 7,
          padding: 7,
          paddingHorizontal: 12,
          marginLeft: 10,
        }}
      >
        <Text
          style={{
            fontSize: 17,
          }}
        >
          {mode === "date"
            ? format(value, "MMM dd, yyyy")
            : format(value, "HH:mm")}
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={value}
          mode={mode}
          onChange={(event) => {
            setShow(false);
            onChange(event);
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default CustomDateTimePicker;

const styles = StyleSheet.create({});
