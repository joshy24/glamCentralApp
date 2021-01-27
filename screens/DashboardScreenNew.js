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

import * as Notifications from 'expo-notifications';
//import { Notifications } from "expo";
//import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import axios from "axios";
import GLAM_GLAM_CONSTANTS from "../config/glam_constants";

import EventBus from "react-native-event-bus"


//TODO 
//Move notification code to App.js
//try using a functional component for this
//test on another persons device

const DashboardScreenNew = ({navigation, props}) =>  {

  const [expoPushToken, setExpoPushToken] = React.useState("");  
  const [token, setToken] = React.useState("");  
  const [notification, setNotification] = React.useState({})

  const contextData = React.useContext(Context);

  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  React.useEffect(() => {
    
    contextData.getServices();

    getSocketData();
    
    registerForPushNotificationsAsyncNew();

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log({notification})
        setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log({response});

      if (
        response.notification.request.content.data.stylist_response
      ) {

          EventBus.getInstance().fireEvent("stylist_response", {
              response: response.notification.request.content.data.stylist_response,
              order_id: response.notification.request.content.data.order
          })

      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const getSocketData = async() => {
    var tok = await (contextData._retrieveData("token"));

    var user = await (contextData._retrieveData("user"))

    user = JSON.parse(user)

    console.log(user._id)

    contextData.sendSocketNotification(user.lga, user._id, tok);
  }

  const savePushToken = (tk) => {
      if(token && token.length > 0){
        axios
          .post(
            GLAM_GLAM_CONSTANTS.API_BASE_URL + "/save_fcm_token",
            {
              fcm_token: tk,
            },
            {
              headers: {
                Authorization: "Bearer:" + token,
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

  const registerForPushNotificationsAsyncNew = async() => {
      let tk;
      if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }

        //let experienceId = GLAM_GLAM_CONSTANTS.EXPERIENCE_ID

        tk = (await Notifications.getExpoPushTokenAsync()).data;
        
        if(tk && tk.length > 0){
          console.log("EXPO token", tk);
          alert('Token Discovered');
          setExpoPushToken(tk);
          savePushToken(tk);
        }
      } else {
        alert('Must use physical device for Push Notifications');
      }
    
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    
      return token;
  }

  /*registerForPushNotificationsAsync = async () => {
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
            var token = await Notifications.getExpoPushTokenAsync();
      
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
  };*/
  
  const _handleNotification = (notify) => {

      //console.log("received new notification");
      console.log({notify})
    
      setNotification(notify);

        //console.log(notification);
        //console.log(this.state.orderInfo); //Current request order ID
    
      if (
        notify.data.stylist_response
      ) {

          EventBus.getInstance().fireEvent("stylist_response", {
              response: notify.data.stylist_response,
              order_id: notify.data.order
          })

      }
  };
  
  /*componentDidMount() {
      contextData = this.context;
      contextData.getServices();

      contextData.sendSocketNotification(contextData.userData.lga, contextData.userData._id, contextData.token)
      
      //console.log(token);

      this.setState({
        token: contextData.token,
      });

      try{
          Notifications.addNotificationReceivedListener( notification => {
            console.log({notification});
            this._handleNotification(notification)
          });
      }
      catch(err){
          console.log(err)
      }

      Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);

        if (
          response.notification.request.content.data.stylist_response
        ) {
  
            EventBus.getInstance().fireEvent("stylist_response", {
                response: response.notification.request.content.data.stylist_response,
                order_id: response.notification.request.content.data.order
            })
  
        }
      });

      //Notifications.addListener( 
      //  this._handleNotification
      //);
      
      this.registerForPushNotificationsAsyncNew();
  }*/

  const gotoScreen = () => {
    navigation.navigate("ViewItem");
  };

  const toggleMenu = () => {
    navigation.toggleDrawer();
  };

  const gotoPage = (page) => {
    navigation.navigate("Category", { title: page });
  };

  const gotoTest = () => {
    navigation.navigate("MakePaymentNowWebView");
  };

  const showEventNumber = () => {
    alert("Kindly call the number for event booking: 09079679939");
  };

  
    return (
      <Consumer>
        {(context) => (
          <View style={{ flex: 1 }}>
            <Header
              backgroundColor="#FF9391"
              placement="left"
              leftComponent={<LeftIconContainer pressNow={toggleMenu} />}
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
                onPress={() => gotoPage("MAKEUP styles")}
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
                    <Text style={styles.bigText}>MAKEUP</Text>
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
                onPress={() => gotoPage("HAIR styles")}
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
                onPress={() => gotoPage("NAILS styles")}
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
                onPress={() => showEventNumber()}
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


//Removes the header for this screen
DashboardScreenNew.navigationOptions = {
    header: null
};

const CenterMenuComponent  = () => {
  
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

const LeftIconContainer  = (props) => {
  return <Icon name="menu" color="#A8095B" onPress={props.pressNow} />;
}

export default DashboardScreenNew;
