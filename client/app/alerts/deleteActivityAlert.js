import { Alert, StyleSheet, Text, View } from "react-native";
import React from "react";

const deleteActivityAlert = (activity, deleteFunction) =>
  Alert.alert(
    "Delete",
    `Are you sure you want to cancel activity \"${activity.name}\"?`,
    [
      { text: "Delete", onPress: deleteFunction },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]
  );

export default deleteActivityAlert;