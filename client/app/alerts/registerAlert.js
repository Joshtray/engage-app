import { Alert } from "react-native";

const registerAlert = (activity, registerFunction) =>
  Alert.alert("Register", `Register for ${activity.name}?`, [
    { text: "Register", onPress: registerFunction },
    {
      text: "Cancel",
      style: "cancel",
    },
  ]);

export default registerAlert;
