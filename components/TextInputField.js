import { Button, StyleSheet, Text, View, TextInput } from "react-native";

export default function TextInputField({ label, value }) {
  return (
    <View style={styles.main}>
      <Text style={styles.text}>{label}</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => (value = text)}
      ></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#070A0D",
    marginLeft: "10%",
    marginBottom: 60,
  },
  text: {
    color: "white",
  },
  input: {
    color: "white",
    fontSize: 20,
    marginTop: 10,
    width: "80%",
    height: 50,
    backgroundColor: "#18212F",
    padding: 10,
  },
});
