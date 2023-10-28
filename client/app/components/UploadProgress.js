import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import * as Progress from 'react-native-progress'

const UploadProgress = ({ progress }) => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
        <Progress.Circle size={100} progress={progress} />
    </View>
  );
};

export default UploadProgress;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1,
  },
});
