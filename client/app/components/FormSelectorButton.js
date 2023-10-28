import { StyleSheet, Text, Animated, TouchableWithoutFeedback } from 'react-native'
import React from 'react'

const FormSelectorButton = ({ title, backgroundColor, style, onPress }) => {
  return <TouchableWithoutFeedback onPress={onPress}>
  <Animated.View style={{...style, ...styles.container, backgroundColor}}>
    <Text style={styles.title}>{title}</Text>
  </Animated.View>
</TouchableWithoutFeedback>
}

export default FormSelectorButton

const styles = StyleSheet.create({
    container: {height: 45, width: '50%', justifyContent: 'center', alignItems: 'center' },
    title: {color: 'white', fontSize: 16, fontFamily: "PlusJakartaSans",  }
})