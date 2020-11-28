import React from "react";
//import RNPaystack from "react-native-paystack";
// RNPaystack.init({
//   publicKey: "pk_test_74edfd9d3c3ddda8aa83a097f4a835b2515046c7"
// });

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
  TextInput
} from "react-native";
import { Icon, Header, Input } from "react-native-elements";
import DatePicker from "react-native-datepicker";
import FormButton from "./Forms/Button";
import FormContainer from "./Forms/Container";
//import PaystackWebView from 'react-native-paystack-webview'



var requestInfo;
class MakePaymentNow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: "",
      confirmNow: false
    };
  }

  static navigationOptions = ({ navigation }) => {
    requestInfo = navigation.getParam("data");
    return {
      title: navigation.getParam("title", ""),
      headerStyle: {
        backgroundColor: "#FF9391"
      },
      headerTintColor: "#000",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    };
  };

  gotoScreen = () => {
    this.props.navigation.navigate("ViewItem");
  };

  showDatePicker = () => {
    this.datepicker.onPressDate();
  };

  handleConfirm = date => {
    this.setState({
      date: date
    });
  };

  makePayment = () => {
    this.props.navigation.navigate("CompletedPaymentScreen");
    //alert("No Payment integration added yet");
  };

  confirmPayment = () => {
    this.setState({
      confirmNow: true
    });
  };

  cancelPayment = () => {
    this.setState({
      confirmNow: false
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <ScrollView
            style={styles.ScrollView}
            showsVerticalScrollIndicator={false}
          >
            <View>
              {this.state.confirmNow ? (
                <View
                  style={{
                    marginTop: 30,
                    paddingTop: 40,
                    paddingBottom: 40,
                    paddingLeft: 15,
                    paddingRight: 15,
                    backgroundColor: "#F4B9B8"
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      marginTop: 25,
                      marginBottom: 20,
                      textAlign: "center"
                    }}
                  >
                    ARE YOU SURE?
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "center"
                    }}
                  >
                    <View style={styles.buttonContainer}>
                      <FormContainer style={styles.halfWidth}>
                        <FormButton
                          label="NO"
                          styles={{ label: styles.buttonWhiteText }}
                          onPress={() => this.cancelPayment()}
                        />
                      </FormContainer>
                    </View>

                    <View style={styles.buttonContainerRight}>
                      <FormContainer style={styles.halfWidth}>
                        <FormButton
                          label="YES"
                          styles={{ label: styles.buttonWhiteText }}
                          onPress={() => this.makePayment()}
                        />
                      </FormContainer>
                    </View>
                  </View>
                </View>
              ) : (
                <View>
                  <View style={{ marginTop: 40, marginBottom: 30 }}>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 23,
                        fontWeight: "bold"
                      }}
                    >
                      Payment Method
                    </Text>
                  </View>

                  <View
                    style={{
                      paddingTop: 40,
                      paddingBottom: 40,
                      paddingLeft: 15,
                      paddingRight: 15,
                      backgroundColor: "#F4B9B8"
                    }}
                  >
                    <FormContainer>
                      {/* <FormLabel text="Username or Email" /> */}
                      <TextInput
                        placeholder="Card number"
                        style={styles.textInput}
                        // value={this.state.address}
                        // onChange={this.handleAddressInput}
                      />
                    </FormContainer>

                    <FormContainer>
                      {/* <FormLabel text="Username or Email" /> */}
                      <TextInput
                        placeholder="CVV2"
                        style={styles.textInput}
                        // value={this.state.address}
                        // onChange={this.handleAddressInput}
                      />
                    </FormContainer>

                    <View>
                      <Text style={styles.makeBold}>EXPIRATION DATE</Text>
                    </View>

                    <View style={styles.divideEvenly}>
                      <View style={styles.child}>
                        <FormContainer>
                          {/* <FormLabel text="Username or Email" /> */}
                          <TextInput
                            placeholder="MM"
                            style={styles.textInput}
                            value={this.state.stateName}
                            onChange={this.handleStateNameInput}
                          />
                        </FormContainer>
                      </View>
                      <View style={styles.child}>
                        <FormContainer>
                          {/* <FormLabel text="Username or Email" /> */}
                          <TextInput
                            placeholder="YYY"
                            style={styles.textInput}
                            value={this.state.lga}
                            onChange={this.handleLGAInput}
                          />
                        </FormContainer>
                      </View>
                    </View>

                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <View style={styles.buttonContainer}>
                        <FormContainer style={styles.halfWidth}>
                          <FormButton
                            label="CANCEL"
                            styles={{ label: styles.buttonWhiteText }}
                            // onPress={() => this.gotoNext()}
                          />
                        </FormContainer>
                      </View>

                      <View style={styles.buttonContainerRight}>
                        <FormContainer style={styles.halfWidth}>
                          <FormButton
                            label="PROCEED"
                            styles={{ label: styles.buttonWhiteText }}
                            onPress={() => this.confirmPayment()}
                          />
                        </FormContainer>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              <View style={{ marginTop: 20 }}>
                <Text style={styles.notes}>Immediate Appointment:</Text>
                <Text style={styles.notes}>
                  Need the Glam central team quickly? No problem, we aim to
                  respond to you within an hour! *Due to the fast response of
                  our stylists, once immediate appointment has been accepted,
                  any cancelation will be charged in full to your card
                </Text>
                <Text style={styles.notes}>Cancellation Policy:</Text>
                <Text style={styles.notes}>
                  We are more than happy to assist you with any changes you
                  might need to make to an appointment. Please feel free to
                  email us at info@glamcentralng.com. *Bookings cancelled within
                  24hrs of your appointment will be charged in full to your
                  card.
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  notes: {
    color: "#000",
    fontWeight: "100",
    fontSize: 11,
    marginBottom: 7
  },
  ScrollView: {
    backgroundColor: "#FF9391"
  },

  makeBold: {
    fontWeight: "bold",
    color: "#000"
  },
  bioData: {
    flexDirection: "row",
    marginBottom: 27,
    marginTop: 27,
    alignContent: "center"
  },
  container: {
    flex: 1,
    backgroundColor: "#FF9391",
    paddingRight: 15,
    paddingLeft: 15
  },
  scroll: {
    backgroundColor: "#FF9391",
    padding: 13,
    flexDirection: "column"
  },
  textInput: {
    height: 40,
    fontSize: 30,
    backgroundColor: "#FFF",
    borderRadius: 12,
    fontSize: 12,
    paddingRight: 18,
    paddingLeft: 18
  },

  divideEvenly: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  child: {
    width: "48%"
  },

  buttonWhiteText: {
    fontSize: 20,
    backgroundColor: "#FFF",
    color: "#FF5B58",
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 12,
    width: "100%",
    textAlign: "center"
  },

  fullWidth: {
    width: "100%"
  },
  halfWidth: {
    width: "50%"
  },
  buttonContainer: {
    width: "35%",
    marginTop: 39
  },
  buttonContainerRight: {
    width: "35%",
    marginTop: 39,
    marginLeft: 30
  },
  dotItem: {
    borderRadius: 100,
    borderStyle: "solid",
    borderWidth: 1,
    height: 15,
    width: 15,
    backgroundColor: "#FAFF00",
    color: "#000",
    marginLeft: 100
  },
  checkboxStyle: {
    backgroundColor: "transparent",
    borderWidth: 0,
    marginBottom: 150,
    marginTop: 20
  },
  spinnerTextStyle: {
    color: "#FFF"
  }
});

export default MakePaymentNow;
