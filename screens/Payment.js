import React from "react";
import PaystackWebView from "react-native-paystack-webview";
import { Alert, View } from "react-native";

const Payment = ({ route, navigation }) => {

  return (
    <View style={{ flex: 1 }}>
      <PaystackWebView
        buttonText="Pay Now"
        showPayButton={false}
        paystackKey="pk_test_74edfd9d3c3ddda8aa83a097f4a835b2515046c7"
        amount={120000}
        channels={JSON.stringify(["card"])}
        billingEmail="joshuamajeb24@gmail.com"
        billingMobile="08098336959"
        billingName="Oluwatobi Shokunbi"
        ActivityIndicatorColor="green"
        SafeAreaViewContainer={{ marginTop: 5 }}
        SafeAreaViewContainerModal={{ marginTop: 5 }}
        onCancel={(e) => {
          // handle response here
          Alert.alert("Payment was cancelled", "The payment was cancelled");
        }}
        onSuccess={(res) => {
          // handle response here
          Alert.alert("Payment was successful", "The payment was successful");
        }}
        autoStart={true}
      />
    </View>
  );
}

export default Payment;