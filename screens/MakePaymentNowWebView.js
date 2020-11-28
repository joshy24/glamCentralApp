import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import PaystackWebView from "react-native-paystack-webview";
import axios from "axios";
import CONSTANTS from "../config/constant";
import { Consumer, Context } from "../store/Provider";
//import Toast from "react-native-simple-toast";

var requestInfo;
var loggedInUser, userToken, contextData;
var order;

class MakePaymentNowWebView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {err: ""};
  }

  static contextType = Context;

  static navigationOptions = ({ navigation }) => {
      try{
        requestInfo = navigation.getParam("data");
        loggedInUser = navigation.getParam("user");
        userToken = navigation.getParam("token");
        order = navigation.getParam("order");
  
        return {
            title: navigation.getParam("title", ""),
            headerStyle: {
              backgroundColor: "#FF9391",
            },
            headerTintColor: "#000",
            headerTitleStyle: {
              fontWeight: "bold",
            },
        };
      }
      catch(err){

      }
  };

  componentDidMount() {
      try{
        contextData = this.context;
      }
      catch(err){

      }
  }

  confirmPaymentNow = (v) => {
    //let orderId = requestInfo.order_id;
    // alert("confirming now")

    try{
      axios
        .post(
          CONSTANTS.API_BASE_URL + "/verify_transaction",
          { reference: v, order_id: order },
          {
            headers: {
              Authorization: "Bearer:" + userToken,
            },
          }
        )
        .then((response) => {
          this.props.navigation.navigate("CompletedPaymentScreen");
        })
        .catch((err) => {
          //this.props.navigation.navigate("Home");
          contextData.showAlert("Error occured verifying payment");
        });
    }
    catch(err){
      contextData.showAlert(JSON.stringify(err));
    }
  };

  cancelPayment = (e) => {
    this.props.navigation.navigate("BookNowScreenFive", { data: requestInfo });
  };

  render() {
    return (
      <View style={styles.container}>
        <PaystackWebView
          buttonText="Pay Now"
          showPayButton={false}
          paystackKey="pk_test_74edfd9d3c3ddda8aa83a097f4a835b2515046c7"
          amount={requestInfo.total_cost}
          billingEmail={loggedInUser.email}
          billingMobile={loggedInUser.phone_number}
          billingName={loggedInUser.firstname + " " + loggedInUser.lastname}
          ActivityIndicatorColor="green"
          SafeAreaViewContainer={{ marginTop: 5 }}
          SafeAreaViewContainerModal={{ marginTop: 5 }}
          onCancel={(e) => {
            // handle response here
            if (e && e.data && e.data.status == "success") {
              this.confirmPaymentNow(e.data.reference);
            } else {
              // alert("Error");
              contextData.showAlert("Payment was cancelled", "danger");
            
              this.cancelPayment(e);
            }
          }}
          onSuccess={(res) => {
            // handle response here
            this.confirmPaymentNow(res.data.reference);
          }}
          autoStart={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "#FFF",
      marginTop: 20
  },
});

export default MakePaymentNowWebView;
