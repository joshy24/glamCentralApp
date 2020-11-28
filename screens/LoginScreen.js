import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TextInput,
} from "react-native";
import FormButton from "./Forms/Button";
import FormContainer from "./Forms/Container";
import FormLabel from "./Forms/Label";
import { Consumer, Context } from "../store/Provider";
import Dialogs from "../screens/Utility/Dialogs";
//import Toast from "react-native-simple-toast";
import Spinner from "react-native-loading-spinner-overlay";
import { Icon, Header, Input } from "react-native-elements";
import axios from "axios";
import CONSTANTS from "../config/constant";

var contextData;
class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSection: 1,
      email: "",
      password: "",
      initilaize: true,
      loggingIn: false,
    };
  }

  static contextType = Context;

  componentDidMount() {
    contextData = this.context;
  }

  static navigationOptions = {
    title: "LOGIN",
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

  handleInputEmail = (e) => {
    const itemText = e.nativeEvent.text;
    this.setState({
      email: itemText,
    });
  };

  handleInputPassword = (e) => {
    const itemText = e.nativeEvent.text;
    this.setState({
      password: itemText,
    });
  };

  gotoDashboard = () => {
    this.props.navigation.navigate("DashboardOne");
  };

  gotoSignUp = () => {
    this.props.navigation.navigate("Register");
  };

  logInNow = async (phone, password) => {
    if (phone == "") {
      contextData.showAlert("Please enter your phone");
      return "input_error";
    }

    if (password == "") {
      contextData.showAlert("Please enter your password");
      return "input_error";
    }

    this.setState({
      loggingIn: true,
    });

    axios

      .post(CONSTANTS.API_BASE_URL + "/login", {
        phone_number: phone,
        password: password,
      })
      .then((response) => {
        this.setState({
          loggingIn: false,
        });

        let res = response.data;
        if (res.msg == "success") {
          //console.log(res.user);
          this.setState({
            token: res.token,
            userData: res.user,
          });
          this.props.context.saveLoginResponse(res.token, res.user);
          this.props.context._storeData("token", res.token);
          this.props.context._storeData("user", JSON.stringify(res.user));
          this.props.navigation.navigate("DashboardOne");
        } else {
          this.showFailedLoginState();
        }
      })
      .catch((e) => {
        //console.log("Login error");
        //console.log(e.response);
        if (e.response.status == 400 || e.response.status == 404) {
          this.showFailedLoginState();
        } else {
          contextData.showAlert("Error occured processing request");
        }
        this.setState({
          loggingIn: false,
        });
      });

    // let response = await this.props.context.logInNow(phone, password);
    // if (response == "yes") {
    //   this.props.navigation.navigate("DashboardOne");
    // }
  };

  showFailedLoginState = () => {
    contextData.showAlert("Invalid phone number/password");
  };

  doNothing = () => {};

  render() {
    return (
      <Consumer>
        {(context) => (
          <View style={styles.container}>
            <Header
              backgroundColor="#FF9391"
              placement="left"
              leftComponent={
                <LeftIconContainer pressNow={() => this.gotoSignUp()} />
              }
              centerComponent={<CenterMenuComponent />}
            />

            <ScrollView style={styles.scroll}>
              <Spinner
                visible={this.state.loggingIn}
                textContent={"Logging In..."}
              />

              {/* {this.state.initilaize
              ? () => context.resetStateNow()
              : this.setState({ initilaize: false })} */}

              <View style={styles.pushUp}>
                <FormContainer>
                  {/* <FormLabel text="Username or Email" /> */}
                  <TextInput
                    value={this.state.email}
                    onChange={this.handleInputEmail}
                    placeholder="Phone number"
                    style={styles.textInput}
                  />
                </FormContainer>
                <FormContainer>
                  <TextInput
                    value={this.state.password}
                    onChange={this.handleInputPassword}
                    placeholder="Password"
                    secureTextEntry={true}
                    style={styles.textInput}
                  />
                </FormContainer>
              </View>

              <View style={styles.buttonContainer}>
                <FormContainer style={styles.fullWidth}>
                  <FormButton
                    label="SUBMIT"
                    styles={{ label: styles.buttonWhiteText }}
                    onPress={() =>
                      this.logInNow(this.state.email, this.state.password)
                    }
                    //onPress={() => this.gotoDashboard()}
                  />
                </FormContainer>
              </View>
            </ScrollView>
          </View>
        )}
      </Consumer>
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
    marginTop: 106,
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

  pushUp: {
    marginTop: 63,
  },
});

const ForwardRef = () =>
  React.forwardRef((props, ref) => (
    <Consumer>
      {(context) => <LoginScreen context={context} {...props} />}
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
            LOGIN
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

export default ForwardRef(LoginScreen);

//export default LoginScreen;
