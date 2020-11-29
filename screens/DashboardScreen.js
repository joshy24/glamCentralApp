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
  Vibration,
  Platform,
} from "react-native";
import { Icon, Header, Rating, AirbnbRating } from "react-native-elements";
import { Consumer, Context } from "../store/Provider";

import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import axios from "axios";
import CONSTANTS from "../config/constant";

import EventBus from "react-native-event-bus"


var contextData;
class DashboardScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expoPushToken: "",
      token: "",
      notification: {},
    };
  }

  static navigationOptions = {
    header: null,
    // headerShown: false
    //title: 'Dashboard',
    // headerStyle: {
    //   backgroundColor: '#FF9391',
    // },
    // headerTintColor: '#000',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    // },
    // headerLeft: (
    //   <Icon
    //   color="#A8095B"
    //   containerStyle={{marginLeft}}
    //   name='bars'
    //   type='font-awesome'
    //   color='#f50'
    //   onPress={() => console.log('hello')} />
    // ),
  };

  static contextType = Context;

  savePushToken = (token) => {
      if(this.state.token && this.state.token.length > 0){
        axios
          .post(
            CONSTANTS.API_BASE_URL + "/save_fcm_token",
            {
              fcm_token: token,
            },
            {
              headers: {
                Authorization: "Bearer:" + this.state.token,
              },
            }
          )
          .then((response) => {
            // return response.data
          })
          .catch((err) => {
            console.log(err)
          });
      }
  };

  registerForPushNotificationsAsync = async () => {
    try{
        if (Constants.isDevice) {
          const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
          );
          let finalStatus = existingStatus;
          if (existingStatus !== "granted") {
            const { status } = await Permissions.askAsync(
              Permissions.NOTIFICATIONS
            );
            finalStatus = status;
          }
          if (finalStatus !== "granted") {
            alert("Failed to get push token for push notification!");
            return;
          }
          token = await Notifications.getExpoPushTokenAsync();
    
          if(token && token.length > 0){
            console.log("EXPO token", token);
            this.setState({ expoPushToken: token });
            this.savePushToken(token);
          }
        } else {
          alert("Must use physical device for Push Notifications");
        }
    
        if (Platform.OS === "android") {
          Notifications.createChannelAndroidAsync("default", {
            name: "default",
            sound: true,
            priority: "max",
            vibrate: [0, 250, 250, 250],
          });
        }
    }
    catch(err){

    }
  };

  _handleNotification = (notification) => {
    
    //console.log("received new notification");
    
    this.setState({ notification: notification });

        //console.log(notification);
        //console.log(this.state.orderInfo); //Current request order ID
    
    if (
        notification.data.stylist_response
      ) {

          EventBus.getInstance().fireEvent("stylist_response", {
              response: notification.data.stylist_response,
              order_id: notification.data.order
          })

      }
  };

  
  componentDidMount() {
      contextData = this.context;
      contextData.getServices();

      //console.log(token);

      this.setState({
        token: contextData.token,
      });
      
      this.registerForPushNotificationsAsync();

      this._notificationSubscription = Notifications.addListener(
        this._handleNotification
      );
  }

  gotoScreen = () => {
    this.props.navigation.navigate("ViewItem");
  };

  toggleMenu = () => {
    this.props.navigation.toggleDrawer();
  };

  gotoPage = (page) => {
    this.props.navigation.navigate("Category", { title: page });
  };

  gotoTest = () => {
    this.props.navigation.navigate("MakePaymentNowWebView");
  };

  showEventNumber = () => {
    alert("Kindly call the number for event booking: 09079679939");
  };

  render() {
    return (
      <Consumer>
        {(context) => (
          <View style={{ flex: 1 }}>
            <Header
              backgroundColor="#FF9391"
              placement="left"
              leftComponent={<LeftIconContainer pressNow={this.toggleMenu} />}
              // centerComponent={{
              //   text: "glamCentral",
              //   style: { color: "#A8095B" }
              // }}
              centerComponent={<CenterMenuComponent />}
            />

            <ScrollView style={styles.ScrollView}>
              <View>
                {/* <AirbnbRating count={11} defaultRating={4} size={10} /> */}
              </View>
              <TouchableOpacity
                style={styles.child}
                onPress={() => this.gotoPage("MAKE UP styles")}
                //onPress={() => this.gotoTest()}
              >
                <View style={styles.leftSide}>
                  <Image
                    source={require("../images/home/makeup.png")}
                    style={{
                      width: 200,
                      height: 200,
                      borderRadius: 200,
                      marginLeft: -30,
                      borderWidth: 5,
                      borderColor: "#000",
                      marginTop: -5,
                    }}
                  />
                </View>
                <View style={styles.rightSide}>
                  {/* <ImageBackground
                    source={require("../images/home/bg.png")}
                    style={{
                      resizeMode: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  > */}
                  <View>
                    <Text style={styles.bigText}>MAKE UP</Text>
                  </View>
                  <View>
                    <Text style={styles.smallText}>
                      From a perfect pout to a full face, you’ll be red carpet
                      ready day to night.
                    </Text>
                  </View>
                  {/* </ImageBackground> */}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.child}
                onPress={() => this.gotoPage("HAIR styles")}
              >
                <View style={styles.rightImage}>
                  {/* <ImageBackground
                    source={require("../images/home/bg.png")}
                    style={{
                      resizeMode: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  > */}
                  <View>
                    <Text style={styles.bigText}>HAIR</Text>
                  </View>
                  <View>
                    <Text style={styles.smallText}>
                      From the basic blow-dry to curls, waves, straightening,
                      and even braids and up dos.
                    </Text>
                  </View>
                  {/* </ImageBackground> */}
                </View>
                <View style={styles.leftImage}>
                  <Image
                    source={require("../images/home/hair.png")}
                    style={{
                      width: 200,
                      height: 200,
                      borderRadius: 200,
                      marginLeft: -50,
                      borderWidth: 5,
                      borderColor: "#000",
                      marginTop: -5,
                    }}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.child}
                onPress={() => this.gotoPage("NAILS styles")}
              >
                <View style={styles.leftSide}>
                  <Image
                    source={require("../images/home/nails.png")}
                    style={{
                      width: 200,
                      height: 200,
                      borderRadius: 200,
                      marginLeft: -30,
                      borderWidth: 5,
                      marginTop: -5,
                      borderColor: "#000",
                    }}
                  />
                </View>
                <View style={styles.rightSide}>
                  {/* <ImageBackground
                    source={require("../images/home/bg.png")}
                    style={{
                      resizeMode: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  > */}
                  <View>
                    <Text style={styles.bigText}>NAILS</Text>
                  </View>
                  <View>
                    <Text style={styles.smallText}>
                      Whether it be a simple manicure or polish change, we’ll
                      send a manicurist to you.
                    </Text>
                  </View>
                  {/* </ImageBackground> */}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.child}
                onPress={() => this.showEventNumber()}
              >
                <View
                  style={{ flex: 1, flexDirection: "row", maxWidth: "100%" }}
                >
                  <View
                    style={{
                      paddingTop: 30,
                      paddingBottom: 30,
                      paddingRight: 10,
                      paddingLeft: 10,
                      width: "40%",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "400",
                        textAlign: "center",
                      }}
                    >
                      CONNECT TO CONCIERGE
                    </Text>
                  </View>

                  <View
                    style={{
                      paddingTop: 30,
                      paddingBottom: 30,
                      flex: 1,
                      flexDirection: "column",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      EVENT BOOKINGS
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "100",
                        textAlign: "center",
                        fontStyle: "italic",
                      }}
                    >
                      Book GlamCentral stylist for those special occasions and
                      events
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
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
  },
  ScrollView: {
    backgroundColor: "#FF9391",
  },
  child: {
    flex: 1,
    backgroundColor: "#FF9391",
    flexDirection: "row",
    paddingTop: 0,
    elevation: 4,
    marginTop: 1,
    marginBottom: 5,
    shadowOffset: { width: 10, height: 10 },
    shadowColor: "blue",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  center: {
    textAlign: "center",
  },
  leftSide: {
    width: "40%",
  },
  leftImage: {
    textAlign: "center",
    width: "30%",
  },
  rightSide: {
    textAlign: "center",
    width: "60%",
    paddingLeft: 30,
    paddingTop: 50,
  },
  rightImage: {
    textAlign: "center",
    width: "70%",
    paddingLeft: 10,
    paddingTop: 50,
    paddingRight: 50,
  },
  bigText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  smallText: {
    fontSize: 11.5,
    lineHeight: 14,
    fontWeight: "100",
    textAlign: "center",
    fontStyle: "italic",
  },
});

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
              color: "#A8095B",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 18,
            }}
          >
            Glam
          </Text>
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 18,
            }}
          >
            Central
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
    return <Icon name="menu" color="#A8095B" onPress={this.onPress} />;
  }
}

export default DashboardScreen;
