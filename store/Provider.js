import React, { Component } from "react";
import axios from "axios";
import Dialogs from "../screens/Utility/Dialogs";
import CONSTANTS from "../config/constant";
import { AsyncStorage } from "react-native";
import io from "socket.io-client";
import dateFormat from "dateformat";
import { showMessage, hideMessage } from "react-native-flash-message";

const Context = React.createContext();

class Provider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      userData: {},
      token: "",
      dialogVisible: false,
      addressData: {},
      loggingIn: false,
      loginSuccessful: "",
      services: [],
      selectedServices: [],
      searchStylists: [],
      categoryName: "",
    };
  }

  showAlert = (title, type = "default", body = "") => {
    if (body) {
      showMessage({
        message: title,
        description: body,
        duration: 5000,
        type: type,
        backgroundColor: "#000", // background color
        color: "#fff", // text color
      });
    } else {
      showMessage({
        message: title,
        type: type,
        backgroundColor: "#000", // background color
        color: "#fff", // text color
      });
    }
  };

  formatDate = (date, format = "dddd, mmmm dS, yyyy, h:MM TT") => {
    //let dd = Date.parse(date);
    let now = new Date(date);
    return dateFormat(now, "dddd, mmmm dS, yyyy, h:MM TT");
  };

  showFailedLoginState = () => {
    this.showAlert("Invalid phone number/password");
    this.setState({
      loginSuccessful: "",
    });
  };

  resetStateNow = () => {
    this.setState({
      loginSuccessful: "",
      loggedIn: false,
      loggingIn: false,
    });
  };

  saveCategoryName = (name) => {
    this.setState({
      categoryName: name,
    });
  };

  sendSocketNotification(userLGA, userId, token) {
    const socket = io("http://glam-central.herokuapp.com");

    socket.on("connect", function (res) {
      socket.on("stylist_connected", function (data) {
        console.log("Just connected");
        console.log(data);
      });

      socket.on("stylist_disconnected", function (data) {
        console.log("Just disconnected");
        console.log(data);
      });

      socket.on("invalid_token", function () {
        //Logout user now
        //console.log("invalid token received");
      });
      //console.log(res);
      socket.emit(
        "online_acknowledgement",
        userId,
        token,
        userLGA,
        "user",
        function (d) {
          //console.log(d);
        }
      );
    });
  }

  logInNow = async (email, password) => {
    //console.log(this.props.navigation);
    //this.props.navigation.navigate('Register')
    if (email == "") {
      this.showAlert("Please enter your phone");
      return "input_error";
    }

    if (password == "") {
      this.showAlert("Please enter your password");
      return "input_error";
    }

    this.setState({
      loggingIn: true,
    });

    axios

      .post(CONSTANTS.API_BASE_URL + "/login", {
        phone_number: email,
        password: password,
      })
      .then((response) => {
        this.setState({
          loggingIn: false,
        });

        let res = response.data;
        if (res.msg == "success") {
          this.setState({
            loginSuccessful: 12,
            token: res.token,
            userData: res.user,
          });

          this._storeData("token", res.token);
          this._storeData("user", JSON.stringify(res.user));

          return "yes";
        } else {
          this.showFailedLoginState();
          return "no";
        }
      })
      .catch((e) => {
        console.log(e.response.data);
        this.setState({
          loggingIn: false,
        });
        this.showFailedLoginState();
        return "no";
      });

    //alert("email: "+email+", password: "+password);
  };

  signUp(email, password, firstname, lastname, confirm_password) {
    // axios.post("https://api.agrostorm.io/api/v1/packages", {
    //   headers: {
    //         'Authorization': 'token-from-auth-api'
    //       }
    //   }).then((response) => {
    //   console.log(response.data);
    // })
  }

  _storeData = async (type, data) => {
    try {
      await AsyncStorage.setItem(type, data);
      if (type == "user") {
        this.setState({
          userData: res.user,
        });
      }

      if (type == "token") {
        this.setState({
          token: res.token,
        });
      }
    } catch (error) {
      // Error saving data
    }
  };

  _retrieveData = async (type) => {
    try {
      const value = await AsyncStorage.getItem(type);
      if (value !== null) {
        // We have data!!
        return value;
      }

      return null;
    } catch (error) {
      // Error retrieving data
    }
  };

  setToken = async () => {
    const value = await AsyncStorage.getItem("token");

    if (value !== null) {
      this.setState({
        token: value,
      });
    }
  };

  componentDidMount() {
    AsyncStorage.getItem("token")
      .then((token) => {
        //console.log("TOKEN", token);
        this.setState({ token: token });
      })
      .catch((error) => {
        //this.setState({ error })
      });

    AsyncStorage.getItem("user")
      .then((user) => {
        this.setState({ userData: JSON.parse(user) });
      })
      .catch((error) => {
        //this.setState({ error })
      });

    AsyncStorage.getItem("services")
      .then((services) => {
        this.setState({ services: JSON.parse(services) });
      })
      .catch((error) => {
        //this.setState({ error })
      });
  }

  clearUserData = () => {
    this.setState({ userData: {}, token: "" });
  };

  // componentDidMount() {
  //   //this.getServices();
  // }

  getAddressFromGPS = async (latitude, longitude) => {
    axios
      .post(CONSTANTS.API_BASE_URL + "/address", {
        lat: latitude,
        lon: longitude,
      })
      .then((response) => {
        // console.log(response.data);
        // return response.data
        this.setState({
          addressData: response.data,
        });
      });
  };

  getServices = () => {
    console.log(this.state.token);

    AsyncStorage.getItem("token")
      .then((token) => {
        console.log(token);
        axios
          .get(CONSTANTS.API_BASE_URL + "/services", {
            headers: {
              Authorization: "Bearer:" + this.state.token,
            },
          })
          .then((response) => {
            //console.log(response.data);
            // console.log("Services success")

            this._storeData("services", JSON.stringify(response.data));
            this.setState({
              services: response.data,
            });
          })
          .catch((e) => {
            // console.log("Services error")
            // console.log(e)
          });
      })
      .catch((error) => {
        //this.setState({ error })
      });
  };

  getStylistNow = async () => {
    try {
      let response = await axios.get(
        CONSTANTS.API_BASE_URL + "/search_stylists?admin_area=Alimosho",
        {
          headers: {
            Authorization: "Bearer:" + this.state.token,
          },
        }
      );
      return response.data;
    } catch (err) {
      return [];
    }
  };

  saveLoginResponse = (token, user) => {
    this.setState({
      token: token,
      userData: user,
    });
  };

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          logInNow: this.logInNow,
          signUp: this.signUp,
          getAddressFromGPS: this.getAddressFromGPS,
          getServices: this.getServices,
          _retrieveData: this._retrieveData,
          getStylistNow: this.getStylistNow,
          sendSocketNotification: this.sendSocketNotification,
          _storeData: this._storeData,
          saveCategoryName: this.saveCategoryName,
          clearUserData: this.clearUserData,
          saveLoginResponse: this.saveLoginResponse,
          formatDate: this.formatDate,
          showAlert: this.showAlert,
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

const Consumer = Context.Consumer;

export { Provider, Consumer, Context };
