import { Button, Pressable, StyleSheet, Text, View } from "react-native";

export default function ActiveButton({ text, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.main}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#6482AF",
    height: "10%",
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    marginBottom: 20,
  },
  text: {
    color: "white",
    fontSize: 24,
  },
});
