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
  ImageBackground
} from "react-native";
import { Icon, Header } from "react-native-elements";
import DatePicker from "react-native-datepicker";
import { Consumer, Context } from "../store/Provider";

var requestInfo, order;
var contextData;
class BookNowScreenFive extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: "",
      userInfo:{},
      token:""
    };
  }

  static navigationOptions = ({ navigation }) => {
    requestInfo = navigation.getParam("data");
    order = navigation.getParam("order");

    

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

  showDatePicker = () => {
    this.datepicker.onPressDate();
  };

  handleConfirm = date => {
    this.setState({
      date: date
    });
  };

  makePayment = () => {
    //alert("No Payment integration added yet");
    this.props.navigation.navigate("MakePaymentNowWebView", { data: requestInfo,user:this.state.userInfo, token:this.state.token, order });
  };

  static contextType = Context;

  componentDidMount() {
          contextData = this.context; 

          this.setState({
            userInfo:contextData.userData,
            token:contextData.token
          })
  }


  

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require("../images/home/done.png")}
          style={{ width: 103, height: 103 }}
        />
        <Text
          style={{
            fontWeight: "bold",
            marginBottom: 150,
            marginTop: 20,
            paddingRight: 70,
            paddingLeft: 70,
            textAlign: "center"
          }}
        >
          Your Appointment with {requestInfo.stylistData.name_of_business} have
          been booked for {requestInfo.date}
        </Text>

        <TouchableOpacity
          onPress={() => this.makePayment()}
          style={{
            backgroundColor: "#fff",
            padding: 15,
            borderRadius: 12,
            width: "80%"
          }}
        >
          <Text style={{ color: "#FF5B58", fontSize: 20, textAlign: "center" }}>
            MAKE PAYMENT
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  firstText: {
    paddingTop: 20,
    paddingBottom: 20
  },
  FisrtInnerText: {
    textAlign: "center",
    fontWeight: "500"
  },
  container: {
    backgroundColor: "#FF9391",
    flex: 1,
    flexDirection: "column",
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  child: {
    borderRadius: 12,
    backgroundColor: "#000",
    marginTop: 15,
    marginBottom: 15,
    marginRight: 13,
    marginLeft: 13,
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 10,
    paddingLeft: 10
  },
  buttonBigtext: {
    fontSize: 21,
    textAlign: "center",
    color: "#FAFF00"
  },
  buttonSmalltext: {
    fontSize: 10,
    textAlign: "center",
    color: "#FAFF00"
  },
  center: {
    textAlign: "center"
  },
  bottomPart: {
    fontSize: 10,
    paddingRight: 13,
    paddingLeft: 13,
    marginTop: 10,
    letterSpacing: 0.5,
    fontWeight: "200"
  }
});

export default BookNowScreenFive;
