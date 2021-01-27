import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import PaystackWebView from "react-native-paystack-webview";
import axios from "axios";
import GLAM_CONSTANTS from "../config/glam_constants";
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
            GLAM_CONSTANTS.API_BASE_URL + "/verify_transaction",
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
          paystackKey="pk_live_f25f5a6abe3fbba01aa72117f5b9ef5bbbeac316"
          amount={requestInfo.total_cost}
          billingEmail={loggedInUser.email}
          billingMobile={loggedInUser.phone_number}
          billingName={loggedInUser.firstname + " " + loggedInUser.lastname}
          ActivityIndicatorColor="green"
          SafeAreaViewContainer={{ marginTop: 5 }}
          SafeAreaViewContainerModal={{ marginTop: 5 }}
          onCancel={(e) => {
            // handle response here
            if (e && e.data && e.data.transactionRef.status == "success") {
              this.confirmPaymentNow(e.data.transactionRef.reference);
            } else {
              // alert("Error");
              contextData.showAlert("Payment was cancelled", "danger");
            
              this.cancelPayment(e);
            }
          }}
          onSuccess={(res) => {
            // handle response here
            this.confirmPaymentNow(res.data.transactionRef.reference);
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
