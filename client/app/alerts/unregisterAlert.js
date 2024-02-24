import { Alert } from "react-native";

const unregisterAlert = (activity, unregisterFunction) =>
  Alert.alert(
    "Unregister",
    `Are you sure you want to unregister from "${activity.name}"?`,
    [
      { text: "Unregister", onPress: unregisterFunction },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]
  );

export default unregisterAlert;
