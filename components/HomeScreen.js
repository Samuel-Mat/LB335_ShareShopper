import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  PixelRatio,
  ScrollView,
  SafeAreaView,
  Pressable,
  LogBox,
} from "react-native";
import { initializeApp } from "firebase/app";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getFirestore,
  collection,
  getDocs,
  where,
  query,
  doc,
  updateDoc,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Toast from "react-native-root-toast";

import firebaseConfig from "../firebaseConfig";
import TextInputField from "./TextInputField";
import ActiveButton from "./ActiveButton";
import PassiveButton from "./PassiveButton";

export default function HomeScreen({
  navigateToList,
  newListNavigation,
  setList,
  onpressPassive,
}) {
  const [lists, setLists] = useState([]);
  const db = getFirestore(firebaseConfig);
  const [removedList, setDelete] = useState({});

  const auth = getAuth();

  async function getData() {
    const q = query(
      collection(db, "Listen"),
      where("Admin", "==", auth.currentUser.uid)
    );
    const q2 = query(
      collection(db, "Listen"),
      where("Nutzer", "array-contains", auth.currentUser.email)
    );
    try {
      let listen = [];
      const querySnapshot = await getDocs(q);
      const querySnapshot2 = await getDocs(q2);

      querySnapshot.forEach((doc) => {
        //console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        listen.push({ id: doc.id, data: JSON.stringify(doc.data()) });
      });
      querySnapshot2.forEach((doc) => {
        //console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        listen.push({ id: doc.id, data: JSON.stringify(doc.data()) });
      });
      setLists(listen);
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  }

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  async function deleteList() {
    try {
      const product = doc(db, "Listen", removedList.id);
      if (JSON.parse(removedList.data).Admin == auth.currentUser.uid) {
        console.log("delete");
        await deleteDoc(product);

        Toast.show("Deleted List", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
          backgroundColor: "green",
          opacity: 100,
        });
      }
      if (JSON.parse(removedList.data).Admin != auth.currentUser.uid) {
        console.log("remove User");
        await updateDoc(product, {
          Nutzer: arrayRemove(auth.currentUser.email),
        });

        Toast.show("Removed List", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
          backgroundColor: "green",
          opacity: 100,
        });
      }
      setDelete({});
      getData();
    } catch (e) {
      setDelete({});
      Toast.show("Bad Request \n " + e.message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        backgroundColor: "red",
        opacity: 100,
      });
    }
  }

  useEffect(() => {
    // Hier getData nur einmal beim Mounten der Komponente aufrufen
    getData();
    console.log(lists);
  }, []);

  useEffect(() => {
    if (removedList && Object.keys(removedList).length > 0) {
      console.log("----------------Removelist:" + removedList);
      deleteList();
    }
  }, [removedList]);

  return (
    <ScrollView style={styles.scrollV}>
      <View style={styles.content}>
        <View style={styles.headerBar}>
          <Text style={styles.header}>Shoppinglists</Text>
          <Pressable
            onPress={async () => {
              console.log("=======================refresh");
              await getData();
            }}
          >
            <Image
              style={styles.delete}
              source={require("../assets/refresh.png")}
            ></Image>
          </Pressable>
        </View>
        <View style={styles.centered}>
          <View style={styles.main}>
            <FlatList
              style={styles.list}
              data={lists}
              renderItem={({ item }) => (
                <View style={styles.container}>
                  <Text
                    style={styles.itemText}
                    onPress={async () => {
                      await setList(item.id);
                      navigateToList();
                    }}
                  >
                    {JSON.parse(item.data).Name}
                  </Text>
                  <Pressable
                    onPress={() => {
                      setDelete(item);
                    }}
                  >
                    <Image
                      style={styles.delete}
                      source={require("../assets/delete.png")}
                    ></Image>
                  </Pressable>
                </View>
              )}
            />
          </View>
          <View style={styles.btnContainer}>
            <ActiveButton
              style={styles.btn}
              text="New Shoppinglist"
              onPress={newListNavigation}
            ></ActiveButton>
            <PassiveButton
              text={"Log out"}
              onPress={() => {
                signOut(auth);
                onpressPassive();
              }}
            ></PassiveButton>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollV: {
    height: "100%",
    width: "100%",
    backgroundColor: "#070A0D",
  },
  content: {
    display: "flex",
    width: "100%",
    height: "100%",
    backgroundColor: "#070A0D",
    marginBottom: 80,
  },
  header: {
    fontSize: PixelRatio.getFontScale() * 29,
    color: "white",
    marginLeft: "10%",
    fontWeight: 300,
    width: "65%",
    marginRight: "5%",
  },
  headerBar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 100,
    marginBottom: "10%",
  },
  main: {
    width: "100%",
    height: "40%",
    marginBottom: 50,
    alignItems: "center",
  },
  itemText: {
    color: "white",
    width: "80%",
    fontSize: 24,
  },
  container: {
    display: "flex",
    width: "100%",
    borderColor: "#6482AF",
    borderWidth: 1,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#18212F",
    flexDirection: "row",
    paddingBottom: "2%",
    paddingTop: "2%",
  },
  list: {
    width: "80%",
  },
  delete: {
    backgroundColor: "#6482AF",
    borderRadius: 5,
    padding: 22,
  },
  btnContainer: {
    height: "100%",
    width: "100%",
    alignItems: "center",
  },
  centered: {
    height: "100%",
    alignItems: "center",
  },
});
