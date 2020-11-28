import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  TextInput,
} from "react-native";
import { Icon, Header, Overlay } from "react-native-elements";
import { CheckBox } from "react-native-elements";
//import Toast from "react-native-simple-toast";
import CONSTANTS from "../config/constant";
import axios from "axios";
import Spinner from "react-native-loading-spinner-overlay";
import FormButton from "./Forms/Button";
import FormContainer from "./Forms/Container";
import * as Permissions from "expo-permissions";
import { Consumer, Context } from "../store/Provider";
import DropDownPicker from "react-native-dropdown-picker";
import allStates from "./Utility/states.json";
import RNPickerSelect from "react-native-picker-select";
import MultiSelect from "react-native-multiple-select";

var pageTitle;
var categoryName, appointmentDate;
var contextData;

class BookNowScreenTwo extends React.Component {
  constructor(props) {
    super(props);

    let systemStates = allStates.find((v) => {
      return v.live == true;
    });

    let allLGA = [];
    for (const key in systemStates.state.locals) {
      allLGA.push({
        label: systemStates.state.locals[key].name,
        value: systemStates.state.locals[key].name,
        name: systemStates.state.locals[key].name,
      });
    }

    this.state = {
      checked: false,
      spinner: false,
      stateName: "",
      lga: "",
      address: "",
      location: {},
      userState: "",
      userAddress: "",
      userLga: "",
      userName: "",
      searchSate: "",
      finalAddress: "",
      finalState: "",
      finalLGA: "",
      allLGA: allLGA,
      allStates: [
        {
          label: "Lagos",
          value: "Lagos",
          name: "Lagos",
        },
      ],
      showLGASearch: false,
      showStateSearch: false,
      selectedItems: [],

      address_source: 1
    };
  }

  static contextType = Context;

  static navigationOptions = ({ navigation }) => {
    pageTitle = navigation.getParam("title");
    appointmentDate = navigation.getParam("appointmentDate");
    return {
      title: navigation.getParam("title", "CLASSIC"),
      headerStyle: {
        backgroundColor: "#FF9391",
      },
      headerTintColor: "#000",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    };
  };

  /*New Stuff*/

  setAddressSource = (num) => {
     this.setState({
        address_source: num
     })
  }

  submitForm = () => {
    if (this.state.stateName == "") {
      contextData.showAlert("please enter state name");
      return;
    }

    if (this.state.lga == "") {
      contextData.showAlert("please enter your lga");
      return;
    }

    if (this.state.address == "") {
      contextData.showAlert("please enter your request address");
      return;
    }

    let loginData = {
      stateName: this.state.stateName,
      lga: this.state.lga,
      address: this.state.address,
    };

    this.props.screenThreeData(loginData);
  };

  componentDidMount() {
    contextData = this.context;
    contextData._storeData("appointmentDate", JSON.stringify(appointmentDate));

    const userData = contextData.userData;

    this.setState({
      userState: userData.state,
      userAddress: userData.address,
      userLga: userData.lga,
      userName: userData.firstname + " " + userData.lastname,
      finalAddress: userData.address,
      finalState: userData.state,
      finalLGA: userData.lga,
    });

    this.setState({
      // address: userData.address,
      stateName: "Lagos",
      // lga: userData.lga,
    });

    categoryName = contextData.categoryName;
    // console.log(contextData);
  }

  uncheckBox = (num) => {

    this.setAddressSource(num)

    switch(num){
       case 1:
         this.setState({
            finalAddress: this.state.userAddress,
            finalState: this.state.userState,
            finalLGA: this.state.userLga,
         });
         break;
       case 2:
         this.setState({
          finalAddress: this.state.address,
          finalState: this.state.stateName,
          finalLGA: this.state.lga,
         });
         break;
       case 3:
        this.setState({
            finalAddress: "",
            finalState: "",
            finalLGA: "",
         });

         this.getAddressFromGPS();
         break;
    }
  };

  getAddressFromGPS = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== "granted") {
      contextData.showAlert("Location permission not granted");
    } else {
      this.setState({
        checked: !this.state.checked,
        spinner: !this.state.spinner,
      });
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({ location: position });

          if (position.coords.longitude) {
            let dataRequest = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            axios
              .post(CONSTANTS.API_BASE_URL + "/address", dataRequest)
              .then((response) => {
                //console.log(response.data);

                if (response.data.state != "") {
                  this.setState({
                    searchSate: response.data.state,
                  });
                }
                this.setState({
                  spinner: !this.state.spinner,
                  stateName: response.data.state,
                  lga: response.data.lga,
                  address: response.data.address,
                });

                this.setState({
                  finalAddress: response.data.address,
                  finalState: response.data.state,
                  finalLGA: response.data.lga,
                });
              })
              .catch((err) => {
                //console.log(err.response);
                this.setState({
                  spinner: !this.state.spinner,
                });
              });
          }
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 30000 }
      );
    }
  };

  handleStateNameInput = (e) => {
    const itemText = e.nativeEvent.text;
    this.setState({
      stateName: itemText,
      checked: false,
    });
  };

  handleLGAInput = (e) => {
    const itemText = e.nativeEvent.text;
    this.setState({
      lga: itemText,
      checked: false,
    });
  };

  handleAddressInput = (e) => {
    const itemText = e.nativeEvent.text;
    this.setState({
      address: itemText,
      checked: false,
    });
  };

  gotoNext = () => {

    if(!this.state.finalAddress || !this.state.finalLGA || !this.state.finalState ){
      contextData.showAlert("Pleaase enter a valid address to proceed");
      return;
    }
    else{
      this.props.navigation.navigate("BookNowScreenThree", {
        title: pageTitle,
        stateName: this.state.searchSate,
        finalAddress: this.state.finalAddress,
        finalState: this.state.finalState,
        finalLGA: this.state.finalLGA,
        categoryName: categoryName,
      });
    }


    /*if (this.state.checked) {
      this.props.navigation.navigate("BookNowScreenThree", {
        title: pageTitle,
        stateName: this.state.searchSate,
        finalAddress: this.state.finalAddress,
        finalState: this.state.finalState,
        finalLGA: this.state.finalLGA,
        categoryName: categoryName,
      });
    } else if (!this.state.checked && this.state.address) {
      this.props.navigation.navigate("BookNowScreenThree", {
        title: pageTitle,
        stateName: this.state.stateName,
        finalAddress: this.state.address,
        finalState: this.state.stateName,
        finalLGA: this.state.lga,
        categoryName: categoryName,
      });
    } else {
      this.props.navigation.navigate("BookNowScreenThree", {
        title: pageTitle,
        stateName: this.state.finalState,
        finalAddress: this.state.finalAddress,
        finalState: this.state.finalState,
        finalLGA: this.state.finalLGA,
        categoryName: categoryName,
      });
    }*/

  };

  render() {
    let { userName, userAddress, userLga, userState } = this.state;

    return (
      <View style={styles.container}>
        <SafeAreaView>
          <Overlay
            overlayStyle={{ height: "100%", width: "100%" }}
            isVisible={this.state.showStateSearch}
          >
            <View
              style={{
                flexDirection: "column",
                flex: 1,
              }}
            >
              <Text style={{ marginBottom: 15, fontWeight: "bold" }}>
                Select state
              </Text>
              {/* <DropDownPicker
                items={this.state.allStates}
                defaultValue={"Lagos"}
                containerStyle={{ height: 40, width: "100%" }}
                style={{
                  border: 0,
                  backgroundColor: "#fff",
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}
                itemStyle={{
                  justifyContent: "flex-start",
                }}
                // placeholder="Search for state"
                //searchable={true}
                searchablePlaceholder="Type in keyword..."
                dropDownStyle={{ backgroundColor: "#fff" }}
                onChangeItem={(item) =>
                  this.setState({
                    stateName: item.value,
                    showStateSearch: false,
                  })
                }
              /> */}

              <MultiSelect
                hideTags
                items={this.state.allStates}
                uniqueKey="name"
                ref={(component) => {
                  this.multiSelect = component;
                }}
                // fixedHeight={true}
                single={true}
                onSelectedItemsChange={(item) =>
                  this.setState({
                    stateName: item[0],
                    showStateSearch: false,
                  })
                }
                selectedItems={this.state.selectedItems}
                selectText="Select states"
                searchInputPlaceholderText="Search..."
                onChangeInput={(text) => console.log("selected this ")}
                //altFontFamily="ProximaNova-Light"
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                displayKey="name"
                searchInputStyle={{ color: "#CCC" }}
                submitButtonColor="#CCC"
                submitButtonText="Submit"
              />
            </View>
          </Overlay>

          <Overlay
            overlayStyle={{ height: "100%", width: "100%" }}
            isVisible={this.state.showLGASearch}
          >
            <View
              style={{
                flexDirection: "column",
                flex: 1,
              }}
            >
              <Text style={{ marginBottom: 15, fontWeight: "bold" }}>
                Local Government Area (LGA)
              </Text>
              {/* <DropDownPicker
                items={this.state.allLGA}
                defaultValue={""}
                containerStyle={{ height: 40, width: "100%" }}
                style={{
                  border: 0,
                  backgroundColor: "#fff",
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  height: 100,
                }}
                itemStyle={{
                  justifyContent: "flex-start",
                }}
                placeholder=""
                searchable={true}
                searchablePlaceholder="Type in keyword..."
                dropDownStyle={{
                  backgroundColor: "#fff",
                  height: 700,
                  marginTop: 2,
                }}
                onChangeItem={(item) =>
                  this.setState({
                    lga: item.value,
                    showLGASearch: false,
                  })
                }
              /> */}

              <MultiSelect
                hideTags
                items={this.state.allLGA}
                uniqueKey="name"
                ref={(component) => {
                  this.multiSelect = component;
                }}
                // fixedHeight={true}
                single={true}
                onSelectedItemsChange={(item) =>
                  this.setState({
                    lga: item[0],
                    finalLGA: item[0],
                    showLGASearch: false,
                  })
                }
                selectedItems={this.state.selectedItems}
                selectText="Select LGA"
                searchInputPlaceholderText="Search..."
                onChangeInput={(text) => console.log("selected somthing")}
                //altFontFamily="ProximaNova-Light"
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                displayKey="name"
                searchInputStyle={{ color: "#CCC" }}
                submitButtonColor="#CCC"
                submitButtonText="Submit"
              />
            </View>
          </Overlay>

          <ScrollView
            style={styles.ScrollView}
            showsVerticalScrollIndicator={false}
          >
            <View>
              <Spinner
                visible={this.state.spinner}
                textContent={"Fetching..."}
                textStyle={styles.spinnerTextStyle}
              />

              <View style={styles.checkBoxContainerStyle}>
                  <CheckBox
                    onPress={() => this.uncheckBox(1)}
                    title="Use Address on Account"
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={styles.checkBoxStyle}
                    checkedColor="#000"
                    uncheckedColor="#000"
                    checked={this.state.address_source == 1}
                  />
              </View>

              <View style={styles.bioData}>
                <View style={{ width: "60%" }}>
                  <Text style={styles.makeBold}>{userName}</Text>
                  <Text style={styles.makeBold}>{userAddress},</Text>
                  <Text style={styles.makeBold}>
                    {userLga}, {userState}
                  </Text>
                </View>
              </View>

              <View style={styles.checkBoxContainerStyle}>
                  <CheckBox
                    onPress={() => this.uncheckBox(2)}
                    title="Use a different Address (Enter Manually)"
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={styles.checkBoxStyle}
                    checkedColor="#000"
                    uncheckedColor="#000"
                    checked={this.state.address_source == 2}
                  />
              </View>

              <FormContainer>
                {/* <FormLabel text="Username or Email" /> */}
                <TextInput
                  placeholder="Enter an Address"
                  style={styles.textInput}
                  value={this.state.address}
                  onChange={this.handleAddressInput}
                  editable={this.state.address_source == 2}
                />
              </FormContainer>

              <View style={styles.divideEvenly}>
                <View style={styles.child}>
                  {/* <FormContainer>
                    <TextInput
                      onFocus={() => this.setState({ showStateSearch: true })}
                      // editable={false}
                      placeholder="State"
                      style={styles.textInput}
                      value={this.state.stateName}
                      // onChange={this.handleStateNameInput}
                    />
                  </FormContainer> */}
                  <TouchableOpacity
                    onPress={() => this.setState({ showStateSearch: true })}
                    disabled={this.state.address_source != 2}
                  >
                    <Text
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: 12,
                        color: "#000",
                        padding: 10,
                        paddingLeft: 15,
                      }}
                    >
                      {this.state.stateName ? this.state.stateName : "LGA"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.child}>
                  {/* <FormContainer>
                    <TextInput
                      onFocus={() => this.setState({ showLGASearch: true })}
                      placeholder="LGA"
                      style={styles.textInput}
                      value={this.state.lga}
                      // onChange={this.handleLGAInput}
                    />
                  </FormContainer> */}
                  <TouchableOpacity
                    onPress={() => this.setState({ showLGASearch: true })}
                    disabled={this.state.address_source != 2}
                  >
                    <Text
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: 12,
                        color: "#000",
                        padding: 10,
                        paddingLeft: 15,
                      }}
                    >
                      {this.state.lga ? this.state.lga : "Select LGA"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.checkBoxContainerStyle}>
                  <CheckBox
                    onPress={() => this.uncheckBox(3)}
                    title="Use Current Location"
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={styles.checkBoxStyle}
                    checkedColor="#000"
                    uncheckedColor="#000"
                    checked={this.state.address_source == 3}
                  />
              </View>

              <View style={styles.buttonContainer}>
                <FormContainer style={styles.fullWidth}>
                  <FormButton
                    label="NEXT"
                    styles={{ label: styles.buttonWhiteText }}
                    onPress={() => this.gotoNext()}
                  />
                </FormContainer>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ScrollView: {
    backgroundColor: "#FF9391",
  },

  makeBold: {
    fontWeight: "bold",
    color: "#000",
  },
  bioData: {
    flexDirection: "row",
    marginBottom: 27
  },
  container: {
    flex: 1,
    backgroundColor: "#FF9391",
    paddingRight: 15,
    paddingLeft: 15,
  },
  scroll: {
    backgroundColor: "#FF9391",
    padding: 13,
    flexDirection: "column",
  },
  textInput: {
    height: 40,
    fontSize: 30,
    backgroundColor: "#FFF",
    borderRadius: 12,
    fontSize: 12,
    paddingRight: 18,
    paddingLeft: 18,
  },

  divideEvenly: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  child: {
    width: "48%",
  },

  buttonWhiteText: {
    fontSize: 20,
    backgroundColor: "#FFF",
    color: "#FF5B58",
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 12,
    width: "100%",
    textAlign: "center",
  },

  fullWidth: {
    width: "100%",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 10,
    marginTop: 70
  },
  dotItem: {
    borderRadius: 100,
    borderStyle: "solid",
    borderWidth: 1,
    height: 15,
    width: 15,
    backgroundColor: "#FAFF00",
    color: "#000",
    marginLeft: 100,
  },
  checkBoxStyle: {
    backgroundColor: "transparent",
    borderWidth: 0,
    marginTop: 20,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  checkBoxContainerStyle: {
      flexDirection: "row",
      justifyContent: "flex-start",
      paddingStart: 0,
      marginStart: 0
  }
});

export default BookNowScreenTwo;
