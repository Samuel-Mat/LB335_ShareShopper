import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { initializeApp } from "firebase/app";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getFirestore,
  collection,
  getDoc,
  doc,
  where,
  query,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Toast from "react-native-root-toast";
import Checkbox from "expo-checkbox";
import SelectDropdown from "react-native-select-dropdown";
import * as Location from "expo-location";

import firebaseConfig from "../firebaseConfig";
import TextInputField from "./TextInputField";
import ActiveButton from "./ActiveButton";
import PassiveButton from "./PassiveButton";
import AddUserModal from "./AddUserModal";
import AddProductModal from "./AddProductModal";
import ChangeListNameModal from "./ChangeListNameModal";
import AddLocationModal from "./AddLocationModal";

export default function DetailScreen({ navigateBack, listdata }) {
  const [list, setList] = useState({});
  const [produkte, setProdukte] = useState([]);
  const [selectedPlace, setPlace] = useState({});
  const [addUserVisibility, setAddUserVisibility] = useState(false);
  const [addProductVisibility, setAddProductVisibility] = useState(false);
  const [changeNameVisibility, setChangeNameVisibility] = useState(false);
  const [addLocationVisibility, setAddLocationVisibility] = useState(false);
  const [removedProduct, setDelete] = useState({});
  const [productLocations, setLocations] = useState([]);
  const db = getFirestore(firebaseConfig);
  const auth = getAuth();

  console.log(auth.currentUser.uid);

  async function getData() {
    console.log(
      "======================reload================================="
    );
    const q = query(collection(db, "Listen"), where("id", "==", listdata));

    try {
      const docRef = doc(db, "Listen", listdata);
      const document = await getDoc(docRef);
      setList(document.data());
      setProdukte(document.data().Produkte);
      setLocations(document.data().Orte.slice(1));
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  }

  async function deleteProduct() {
    try {
      const product = doc(db, "Listen", listdata);

      await updateDoc(product, {
        Produkte: arrayRemove(removedProduct),
      });
      Toast.show("Deleted Product", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
        backgroundColor: "green",
        opacity: 100,
      });
      getData();
    } catch (e) {
      Toast.show("Bad Request \n " + e.message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        backgroundColor: "red",
        opacity: 100,
      });
    }
  }

  async function SortProductsBy() {
    if (selectedPlace && Object.keys(selectedPlace).length > 0) {
      if (selectedPlace.Name == "GPS") {
        let sortedList = [];
        let noPlace = [];
        const currentPlace = await Location.getCurrentPositionAsync({}).then(
          (location) => {
            return location;
          }
        );
        console.log(currentPlace);
        let placeRanking = GetNearestPlace(currentPlace);

        placeRanking.forEach((place) => {
          produkte.forEach((element) => {
            if (element.Ort == place.Name) {
              sortedList.push(element);
            }
            if (element.Ort == {}) {
              noPlace.push(element);
            }
          });
        });
        sortedList = sortedList.concat(noPlace);
        setProdukte(sortedList);
      } else {
        let correctProducts = [];
        let otherProducts = [];
        produkte.forEach((element) => {
          if (element.Ort == selectedPlace.Name) {
            correctProducts.push(element);
          } else {
            otherProducts.push(element);
          }
        });

        const sortedList = correctProducts.concat(otherProducts);
        console.log(sortedList);
        setProdukte(sortedList);
        console.log("Produkte:" + produkte[0].Name);
      }
    }
  }

  function GetNearestPlace(currentPlace) {
    //Jeden Platz - meine Location
    let placesCompared = [];
    //Latitude und longitude mal rechnen
    //auf positive Zahl
    //nach grösse sortieren klein -> Gross
    productLocations.forEach((element) => {
      let comparedLatitude =
        element.Geopunkt.latitude - currentPlace.coords.latitude;
      let comparedLongitude =
        element.Geopunkt.longitude - currentPlace.coords.longitude;

      let distance = Math.sqrt(comparedLatitude ** 2 + comparedLongitude ** 2);

      placesCompared.push({ Name: element.Name, Distance: distance });
    });
    console.log(placesCompared);
    placesCompared = placesCompared.sort((a, b) => a.Distance - b.Distance);
    console.log(placesCompared);
    return placesCompared;
  }

  async function ChangeGekauft(value, product) {
    try {
      const listDoc = doc(db, "Listen", listdata);
      const productList = produkte;
      const index = productList.findIndex((item) => item === product);

      if (index !== -1) {
        productList[index].Gekauft = value;
        await updateDoc(listDoc, {
          Produkte: productList,
        });
        Toast.show("changed Product", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
          backgroundColor: "green",
          opacity: 100,
        });
        getData();
      }
    } catch (e) {
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
  }, []);

  useEffect(() => {
    if (selectedPlace != {}) {
      SortProductsBy();
    }
  }, [selectedPlace]);

  useEffect(() => {
    if (removedProduct && Object.keys(removedProduct).length > 0) {
      console.log(removedProduct);
      deleteProduct();
    }
  }, [removedProduct]);

  return (
    <ScrollView style={styles.scrollV}>
      <View style={styles.content}>
        <ChangeListNameModal
          visibility={changeNameVisibility}
          id={listdata}
          setVisibility={setChangeNameVisibility}
          reload={getData}
        ></ChangeListNameModal>
        <AddUserModal
          visibility={addUserVisibility}
          id={listdata}
          setVisibility={setAddUserVisibility}
          reload={getData}
        ></AddUserModal>
        <AddLocationModal
          visibility={addLocationVisibility}
          id={listdata}
          setVisibility={setAddLocationVisibility}
          reload={getData}
        ></AddLocationModal>
        <AddProductModal
          visibility={addProductVisibility}
          id={listdata}
          setVisibility={setAddProductVisibility}
          locations={productLocations}
          reload={getData}
        ></AddProductModal>
        <View style={styles.headerBar}>
          <Text style={styles.header}>{list.Name}</Text>
          <Pressable
            style={styles.changeNamebtn}
            onPress={() => {
              setChangeNameVisibility(true);
            }}
          >
            <Image
              style={styles.changeNameImg}
              source={require("../assets/edit.png")}
            ></Image>
          </Pressable>
        </View>
        <View style={styles.locationBar}>
          <SelectDropdown
            defaultButtonText="Set Location"
            buttonTextStyle={styles.dropdownText}
            rowTextStyle={styles.dropdownText}
            dropdownStyle={styles.dropdown}
            rowStyle={styles.dropdownRow}
            buttonStyle={styles.dropdown}
            data={list.Orte}
            onSelect={(selectedItem, index) => {
              setPlace(selectedItem);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.Name;
            }}
            rowTextForSelection={(item, index) => {
              return item.Name;
            }}
          />
          <Pressable
            style={styles.addLocbtn}
            onPress={() => {
              setAddLocationVisibility(true);
            }}
          >
            <Text style={styles.addLocText}>Add Loc</Text>
          </Pressable>
        </View>
        <View style={styles.centered}>
          <View style={styles.main}>
            <FlatList
              style={styles.list}
              data={produkte}
              renderItem={({ item }) => (
                <View style={styles.container}>
                  <Checkbox
                    style={styles.check}
                    value={item.Gekauft}
                    onValueChange={async (value) => {
                      await ChangeGekauft(value, item);
                    }}
                  ></Checkbox>
                  <Text style={styles.itemText}>
                    {item.Menge} {item.Name} | {item.Ort}
                  </Text>
                  <Pressable
                    style={styles.deletebtn}
                    onPress={async () => {
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
            <View style={styles.btnrow}>
              <Pressable
                style={styles.abtn}
                onPress={() => {
                  setAddUserVisibility(true);
                }}
              >
                <Text style={styles.btntext}>Add User</Text>
              </Pressable>
              <Pressable
                style={styles.abtn}
                onPress={() => {
                  setAddProductVisibility(true);
                }}
              >
                <Text style={styles.btntext}>Add Product</Text>
              </Pressable>
            </View>
            <PassiveButton
              text={"Go Back"}
              onPress={navigateBack}
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
    width: "100%",
    height: "100%",
    backgroundColor: "#070A0D",
  },
  headerBar: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginTop: 100,
    marginBottom: 50,
  },
  header: {
    fontSize: 40,
    color: "white",
    marginLeft: "10%",
    fontWeight: 300,
  },
  dropdown: {
    backgroundColor: "#18212F",
    borderColor: "#6482AF",
    borderWidth: 1,
    width: "40%",
  },
  dropdownText: {
    color: "white",
  },
  dropdownRow: {
    borderBottomColor: "none",
    borderColor: "#6482AF",
    borderWidth: 1,
  },
  addLocbtn: {
    backgroundColor: "#6482AF",
    marginLeft: "25%",
    width: "25%",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  addLocText: {
    color: "white",
  },
  main: {
    width: "100%",
    height: "60%",
    marginBottom: 50,
    alignItems: "center",
  },
  locationBar: {
    display: "flex",
    flexDirection: "row",
    width: "90%",
    marginLeft: "10%",
    marginBottom: 10,
  },
  itemText: {
    color: "white",
    marginLeft: 10,
    width: "70%",
    fontSize: 18,
  },
  container: {
    display: "flex",
    width: "100%",
    borderColor: "#6482AF",
    borderWidth: 1,
    height: 50,
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: "#18212F",
    flexDirection: "row",
  },
  list: {
    width: "80%",
  },
  delete: {
    backgroundColor: "#6482AF",
    borderRadius: 5,
    padding: 18,
  },
  abtn: {
    backgroundColor: "#6482AF",
    height: "100%",
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    margin: 10,
    width: "40%",
  },
  btntext: {
    color: "white",
    fontSize: 18,
  },
  btnrow: {
    height: "10%",
    marginBottom: "5%",
    display: "flex",
    flexDirection: "row",
  },
  centered: {
    height: "100%",
    alignItems: "center",
    paddingBottom: 250,
  },
  check: {
    marginLeft: 10,
  },
  changeNamebtn: {
    backgroundColor: "#6482AF",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
    borderRadius: 5,
  },
  changeNameImg: {
    width: 20,
  },
  btnContainer: {
    height: "100%",
    width: "100%",
    alignItems: "center",
  },
});
