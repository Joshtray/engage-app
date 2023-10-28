import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

const FormInput = (props) => {
    const { label, placeholder } = props
  return <>
    <Text style={{ fontWeight: "bold", fontFamily: "PlusJakartaSans"}}>{label}</Text>
    <TextInput {...props} placeholder={placeholder}
        style={styles.input}
      /></>
}

export default FormInput

const styles = StyleSheet.create({input: {
    borderWidth: 1,
    borderColor: "#1b1b33",
    height: 35,
    borderRadius: 8,
    fontSize: 16,
    paddingLeft: 10,
    marginBottom: 20,
    fontFamily: "PlusJakartaSans", 
  }})