import { Button, StyleSheet, Text, View, TextInput, Image } from "react-native";

export default function Header() {
  return (
    <View style={styles.main}>
      <Text style={styles.text}>ShareShopper</Text>
      <Image
        source={require("../assets/ShareShopper_Logo.png")}
        style={styles.logo}
      ></Image>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#070A0D",
    display: "flex",
    flexDirection: "row",
    marginTop: "5%",
    alignItems: "center",
    width: "100%",
    height: "10%",
  },
  text: {
    color: "white",
    fontSize: 24,
    width: "40%",
    marginLeft: "8%",
    marginRight: "30%",
  },
  logo: {
    width: 100,
    height: 100,
  },
});
