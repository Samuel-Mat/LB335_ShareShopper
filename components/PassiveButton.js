import { Button, Pressable, StyleSheet, Text, View } from "react-native";

export default function PassiveButton({ text, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.main}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#35495F",
    height: "10%",
    width: "50%",
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
