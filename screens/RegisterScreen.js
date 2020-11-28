import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
} from "react-native";
import FormButton from "./Forms/Button";
import FormContainer from "./Forms/Container";
import FormLabel from "./Forms/Label";
import Geolocation from "react-native-geolocation-service";
import * as Permissions from "expo-permissions";
import { Location } from "expo";
import { CheckBox, Overlay } from "react-native-elements";
import { Consumer, Context } from "../store/Provider";
//import Toast from "react-native-simple-toast";
import DatePicker from "react-native-datepicker";
import { BackHandler } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import CONSTANTS from "../config/constant";
import axios from "axios";
import { Icon, Header, Input } from "react-native-elements";
import { showMessage, hideMessage } from "react-native-flash-message";
import allStates from "./Utility/states.json";
import MultiSelect from "react-native-multiple-select";

function showAlert(title, type = "default") {
  showMessage({
    message: title,
    type: type,
  });
}

class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        currentSection: 1,
        location: {},
        registerData: {},
        spinnerSubmit: false,
    };
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== "granted") {
      showAlert("Location permission not granted");
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          this.setState({ location: position });
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 30000 }
      );
    }
  }

  componentWillUnmount() {}

  static navigationOptions = {
    title: "SIGN UP",
    headerStyle: {
      backgroundColor: "#FF9391",
      elevation: 0,
      borderBottomWidth: 1,
    },
    headerTintColor: "#000",
    headerTitleStyle: {
      fontWeight: "bold",
      fontSize: 28,
      marginLeft: 70,
    },
  };

  press = (nextPage) => {
    this.setState({
      currentSection: nextPage,
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.currentSection !== prevProps.currentSection) {
      // console.log(this.props.currentSection);
      // console.log(prevProps.currentSection);
    }
  }

  screenOneDataCallBack = (dataPassed) => {
    console.log("step 1", dataPassed);
    this.setState({
      registerData: dataPassed,
    });
  };

  screenTwoDataCallBack = (dataPassed) => {
    let updatedData = Object.assign(this.state.registerData, dataPassed);
    console.log("step 2", updatedData);
    this.setState({
      registerData: updatedData,
    });
  };

  screenThreeDataCallBack = async (dataPassed) => {
    let updatedData = Object.assign(this.state.registerData, dataPassed);

    updatedData.password_again = updatedData.password;
    updatedData.dob = updatedData.dateOfBirth;
    updatedData.phone_number = updatedData.phone;
    updatedData.state = updatedData.stateName;
    updatedData.city = updatedData.lga;
    updatedData.latitude = this.state.location.coords.latitude;
    updatedData.longitude = this.state.location.coords.longitude;

    console.log("step 3", updatedData);

    this.setState({
      registerData: updatedData,
    });

    axios
      .post(CONSTANTS.API_BASE_URL + "/signup", this.state.registerData)
      .then((response) => {
        //console.log(response.data);
        this.setState({
          spinnerSubmit: false,
        });

        showAlert("Your registration was successful. Kindly login to continue");
        this.props.navigation.navigate("Login");
      })
      .catch((err) => {
        console.log(err.data);
        this.setState({
          spinnerSubmit: false,
        });
        showAlert("Error occured during registration, try again!");
      });
  };

  gotoLogin = () => {
    this.props.navigation.navigate("Login");
  };

  render() {
    let currentView;

    if (this.state.currentSection === 3) {
      currentView = (
        <LoginScreenStepThree
          screenThreeData={this.screenThreeDataCallBack}
          location={this.state.location}
          currentSection={this.state.currentSection}
        />
      );
    } else if (this.state.currentSection === 2) {
      currentView = (
        <LoginScreenStepTwo
          screenTwoData={this.screenTwoDataCallBack}
          press={this.press}
          currentSection={this.state.currentSection}
        />
      );
    } else {
      currentView = (
        <LoginScreenStepOne
          screenOneData={this.screenOneDataCallBack}
          press={this.press}
          currentSection={this.state.currentSection}
        />
      );
    }

    return (
      <View style={styles.container}>
        <Header
          backgroundColor="#FF9391"
          placement="left"
          leftComponent={
            <LeftIconContainer pressNow={() => this.gotoLogin()} />
          }
          centerComponent={<CenterMenuComponent />}
        />
        <ScrollView style={styles.scroll}>
          <Spinner
            visible={this.state.spinnerSubmit}
            textContent={"Submitting..."}
            textStyle={styles.spinnerTextStyle}
          />

          {currentView}
        </ScrollView>
      </View>
    );
  }
}

class LoginScreenStepThree extends React.Component {
  constructor(props) {
    super(props);
    //console.log(props)

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
      stateName: "Lagos",
      lga: "",
      address: "",
      allLGA: allLGA,
      selectedItems: [],
      showLGASearch: false
    };
  }
  submitForm = () => {
    if (this.state.stateName == "") {
      showAlert("Please enter state name");
      return;
    }

    if (this.state.lga == "") {
      showAlert("Please enter your lga");
      return;
    }

    if (this.state.address == "") {
      showAlert("Please enter your request address");
      return;
    }

    let loginData = {
      stateName: this.state.stateName,
      lga: this.state.lga,
      address: this.state.address,
    };

    this.props.screenThreeData(loginData);
  };

  componentDidMount() {}

  uncheckBoxLocation = () => {
    if (!this.state.checked) {
      this.getAddressFromGPS();
      this.setState({
        spinner: true,
      });
    }

    this.setState({
      checked: !this.state.checked,
    });
  };

  getAddressFromGPS = async () => {
    if (this.props.location.coords.longitude) {
      axios
        .post(CONSTANTS.API_BASE_URL + "/address", {
          lat: this.props.location.coords.latitude,
          lng: this.props.location.coords.longitude,
        })
        .then((response) => {
          console.log(response.data);

          this.setState({
            stateName: response.data.state,
            lga: response.data.lga,
            address: response.data.address,
            spinner: false,
          });
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            spinner: false,
          });
        });
    } else {
      showAlert("Please turn on your location settings to continue");
    }
  };

  handleStateNameInput = (e) => {
    const itemText = e.nativeEvent.text;
    this.setState({
      stateName: itemText,
    });
  };

  handleLGAInput = (e) => {
    const itemText = e.nativeEvent.text;
    this.setState({
      lga: itemText,
    });
  };

  handleAddressInput = (e) => {
    const itemText = e.nativeEvent.text;
    this.setState({
      address: itemText,
    });
  };

  render() {
    return (
      <Consumer>
        {(context) => (
          <View>

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

            <Spinner
              visible={this.state.spinner}
              textContent={"Fetching..."}
              textStyle={styles.spinnerTextStyle}
            />
            <View style={styles.dots}>
              <View style={styles.dotsChild}></View>
              <View style={styles.dotsChild}></View>
              <View style={styles.dotActive}></View>
            </View>
            <View style={styles.divideEvenly}>
              <View style={styles.child}>
                <FormContainer>
                  {/* <FormLabel text="Username or Email" /> */}
                  <TextInput
                    placeholder="State"
                    style={styles.textInput}
                    value={this.state.stateName}
                    onChange={this.handleStateNameInput}
                  />
                </FormContainer>
              </View>
              <View style={styles.child}>
                <TouchableOpacity
                    onPress={() => this.setState({ showLGASearch: true })}
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

            <FormContainer>
              {/* <FormLabel text="Username or Email" /> */}
              <TextInput
                placeholder="Address"
                style={styles.textInput}
                value={this.state.address}
                onChange={this.handleAddressInput}
              />
            </FormContainer>

            <CheckBox
              center
              onPress={() => this.uncheckBoxLocation()}
              title="Use Current Location"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              containerStyle={styles.checkboxStyle}
              checkedColor="#000"
              uncheckedColor="#000"
              checked={this.state.checked}
            />

            <View style={styles.buttonContainer}>
              <FormContainer style={styles.fullWidth}>
                <FormButton
                  label="FINISH"
                  styles={{ label: styles.buttonWhiteText }}
                  onPress={() => this.submitForm()}
                />
              </FormContainer>
            </View>
          </View>
        )}
      </Consumer>
    );
  }
}

class LoginScreenStepTwo extends React.Component {
  constructor(props) {
    super(props);
    this.gotoPageNow = this.gotoPage.bind(this, false);
    this.state = {
      checked: false,
      firstname: "",
      lastname: "",
      phone: "",
      date: "",
    };
  }

  gotoPage = () => {
    if (this.state.firstname == "") {
      showAlert("please enter your first name");
      return;
    }

    if (this.state.lastname == "") {
      showAlert("please enter your last name");
      return;
    }

    if (this.state.phone == "") {
      showAlert("please enter your phone number");
      return;
    }

    if (this.state.date == "") {
      showAlert("please enter your date of birth");
      return;
    }

    if (this.state.checked == "") {
      showAlert("please accept the terms and condition to proceed");
      return;
    }

    let loginData = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      phone: this.state.phone,
      dateOfBirth: this.state.date,
    };

    this.props.screenTwoData(loginData);

    this.props.press(3);
  };

  handleFirstNameInput = (e) => {
    const itemText = e.nativeEvent.text;
    this.setState({
      firstname: itemText,
    });
  };

  handleLastNameInput = (e) => {
    const itemText = e.nativeEvent.text;
    this.setState({
      lastname: itemText,
    });
  };

  handlePhoneInput = (e) => {
    const itemText = e.nativeEvent.text;
    this.setState({
      phone: itemText,
    });
  };

  uncheckBox = () => {
    this.setState({
      checked: !this.state.checked,
    });
  };

  render() {
    return (
      <View>
        <View style={styles.dots}>
          <View style={styles.dotsChild}></View>
          <View style={styles.dotActive}></View>
          <View style={styles.dotsChild}></View>
        </View>
        <View style={styles.divideEvenly}>
          <View style={styles.child}>
            <FormContainer>
              {/* <FormLabel text="Username or Email" /> */}
              <TextInput
                placeholder="First Name"
                style={styles.textInput}
                value={this.state.firstname}
                onChange={this.handleFirstNameInput}
              />
            </FormContainer>
          </View>
          <View style={styles.child}>
            <FormContainer>
              {/* <FormLabel text="Username or Email" /> */}
              <TextInput
                placeholder="Last Name"
                style={styles.textInput}
                value={this.state.lastname}
                onChange={this.handleLastNameInput}
              />
            </FormContainer>
          </View>
        </View>

        <FormContainer>
          {/* <FormLabel text="Username or Email" /> */}
          <TextInput
            placeholder="Mobile Number"
            style={styles.textInput}
            value={this.state.phone}
            onChange={this.handlePhoneInput}
          />
        </FormContainer>

        <DatePicker
          style={{ width: "100%", backgroundColor: "#fff", borderRadius: 12 }}
          date={this.state.date}
          mode="date"
          placeholder="Date of Birth"
          format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={false}
          onDateChange={(date) => {
            this.setState({ date: date });
          }}
        />

        <CheckBox
          center
          onPress={this.uncheckBox}
          title="I agree to the Terms & Condtions and Privacy Policy"
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          containerStyle={styles.checkboxStyle}
          checkedColor="#000"
          uncheckedColor="#000"
          checked={this.state.checked}
        />

        <View style={styles.buttonContainer}>
          <FormContainer style={styles.fullWidth}>
            <FormButton
              label="NEXT"
              styles={{ label: styles.buttonWhiteText }}
              onPress={this.gotoPageNow}
            />
          </FormContainer>
        </View>
      </View>
    );
  }
}

class LoginScreenStepOne extends React.Component {
  constructor(props) {
    super(props);

    this.gotoPageNow = this.gotoPage.bind(this, false);
    this.state = {
      email: "",
      password: "",
      confirmPass: "",
    };
  }

  gotoPage = () => {
    if (this.state.email == "") {
      showAlert("please enter your email");
      return;
    }

    if (this.state.password == "") {
      showAlert("please enter your password");
      return;
    }

    if (this.state.confirmPass == "") {
      showAlert("please re-enter your password");
      return;
    }

    if (this.state.password != this.state.confirmPass) {
      showAlert("Your password does not match confirm password");
      return;
    }

    let loginData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPass,
    };

    this.props.screenOneData(loginData);

    this.props.press(2);
  };

  handleEmailInput = (e) => {
    const itemText = e.nativeEvent.text;
    this.setState({
      email: itemText,
    });
  };

  handlePasswordInput = (e) => {
    const itemText = e.nativeEvent.text;
    this.setState({
      password: itemText,
    });
  };

  handleConfirmPasswordInput = (e) => {
    const itemText = e.nativeEvent.text;
    this.setState({
      confirmPass: itemText,
    });
  };

  render() {
    return (
      <View>
        <View style={styles.dots}>
          <View style={styles.dotActive}></View>
          <View style={styles.dotsChild}></View>
          <View style={styles.dotsChild}></View>
        </View>
        <FormContainer>
          {/* <FormLabel text="Username or Email" /> */}
          <TextInput
            placeholder="Email Address"
            style={styles.textInput}
            value={this.state.email}
            onChange={this.handleEmailInput}
          />
        </FormContainer>
        <FormContainer>
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            style={styles.textInput}
            value={this.state.password}
            onChange={this.handlePasswordInput}
          />
        </FormContainer>
        <FormContainer>
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry={true}
            style={styles.textInput}
            value={this.state.confirmPass}
            onChange={this.handleConfirmPasswordInput}
          />
        </FormContainer>

        <View style={styles.buttonContainer}>
          <FormContainer style={styles.fullWidth}>
            <FormButton
              label="NEXT"
              styles={{ label: styles.buttonWhiteText }}
              onPress={this.gotoPageNow}
            />
          </FormContainer>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF9391",
    flex: 1,
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
    borderWidth: 1,
    borderColor: "#707070",
    borderStyle: "solid",
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
    marginTop: 39,
  },
  dots: {
    flexDirection: "row",
    marginBottom: 27,
    marginTop: 27,
    justifyContent: "center",
    alignContent: "center",
  },
  dotsChild: {
    borderRadius: 100,
    borderStyle: "solid",
    borderWidth: 1,
    height: 10,
    width: 10,
    color: "#000",
    marginRight: 10,
    marginLeft: 10,
  },
  dotActive: {
    borderRadius: 100,
    borderStyle: "solid",
    borderWidth: 1,
    height: 10,
    width: 10,
    marginRight: 10,
    marginLeft: 10,
    backgroundColor: "#000",
  },

  checkboxStyle: {
    backgroundColor: "transparent",
    borderWidth: 0,
    marginBottom: 150,
    marginTop: 50,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});

const ForwardRef = () =>
  React.forwardRef((props, ref) => (
    <Consumer>
      {(context) => <RegisterScreen context={context} {...props} />}
    </Consumer>
  ));

class CenterMenuComponent extends React.Component {
  render() {
    return (
      <View
        style={{
          maxWidth: 500,
          width: 250,
          position: "relative",
          flex: 1,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            position: "absolute",
            bottom: 18,
            width: "100%",
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Text
            style={{
              color: "#000",
              fontWeight: "bold",
              textAlign: "center",
              marginRight: 15,
              fontSize: 20,
            }}
          >
            SIGN UP
          </Text>
        </View>
      </View>
    );
  }
}

class LeftIconContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  onPress = () => {
    this.props.pressNow();
  };

  render() {
    return (
      <Icon size={40} name="chevron-left" color="#000" onPress={this.onPress} />
    );
  }
}

export default ForwardRef(RegisterScreen);
