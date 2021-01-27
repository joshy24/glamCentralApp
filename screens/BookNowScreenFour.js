import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  Vibration,
  Platform,
} from "react-native";
import {
  Icon,
  Header,
  Rating,
  AirbnbRating,
  Button,
  Overlay,
} from "react-native-elements";
import DatePicker from "react-native-datepicker";
import axios from "axios";
import GLAM_CONSTANTS from "../config/glam_constants";
import { Consumer, Context } from "../store/Provider";
//import Toast from "react-native-simple-toast";
import * as Notifications from 'expo-notifications';
import EventBus from "react-native-event-bus"

var selectedStylist;
var contextData;
var address;

/*
{"_id":{"$oid":"5fd12b70d83ed100175ba0db"},
"date":{"$date":"2020-12-09T20:53:00.000Z"},
"stylist_confirmed":true,
"customer_confirmed":true,
"stylist":{"$oid":"5fa950e962811600171086f1"},
"service":{"$oid":"5fa94f3c62811600171086b8"},
"total_cost":10000,
"user":{"$oid":"5fa99f0935a05e0017d97aca"},
"type":"today",
"number_of_people":1,
"number":"1607543664861",
"address":"28,David Ogundele street, ipaja, lagos",
"status":"fulfilled",
"category":"5fa94f3c62811600171086b8",
"created":{"$date":"2020-12-09T19:54:24.862Z"},
"__v":0,
"customer_comment":"Great work",
"user_rating":4}
*/

let cancelToken;

class BookNowScreenFour extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: "",
      showOverLay: false,
      counter: 60,
      bookPrice: 0,
      whats_included: "",
      showIncluded: false,
      showReviews: false,
      userToken: "",
      appointmentDate: "",
      userId: "",
      category: "",
      orderInfo: "",
      fullStylistData: {},
      selectedService: "",
      selectedStylist: {},
      count: 0,
      interval: {}
    };
  }


  static contextType = Context;
  static navigationOptions = ({ navigation }) => {

    selectedStylist = navigation.getParam("selectedStylist");
    address = navigation.getParam("address");

    return {
      title: navigation.getParam("title", "CLASSIC"),
      headerStyle: {
        backgroundColor: "#FF9391",
      },
      headerTintColor: "#000",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    };
  };

  startPolling = () => {
      this.setState({
        count: 0,
        interval: {}
      })

      this.state.interval = setInterval(() => {
        if (this.state.count >= 20) {
          clearInterval(this.state.interval);
          return;
        }
  
        this.setState(state => {
            var c = state.count
            return {
              count: c+1
            }
        })

        var dataRequest = {
            order_id: this.state.orderInfo
        }


        if (typeof cancelToken != typeof undefined) {
          cancelToken.cancel("Operation canceled due to new request.");
        }

        cancelToken = axios.CancelToken.source();

        //check if stylist responded
        axios
            .post(GLAM_CONSTANTS.API_BASE_URL + "/check_stylist_response", dataRequest, {
              headers: {
                Authorization: "Bearer:" + this.state.userToken,
              },
              cancelToken: cancelToken.token
            })
            .then((response) => {
                switch(response.data.response){
                    case "declined":
                        Notifications.dismissAllNotificationsAsync()

                        if (typeof cancelToken != typeof undefined) {
                          cancelToken.cancel("Operation canceled");
                        }
                  
                        clearInterval(this.state.interval);

                        this.setState({
                          showOverLay: false,
                        });
                
                        contextData.showAlert(
                          "Request rejected by Stylist, please select another stylist"
                        );
                  
                        this.cancelRequest();
                    break;
                    case "agreed":
                        Notifications.dismissAllNotificationsAsync()

                        if (typeof cancelToken != typeof undefined) {
                          cancelToken.cancel("Operation canceled");
                        }
                  
                        clearInterval(this.state.interval);

                        this.setState({
                          showOverLay: false,
                        });
                  
                        this.props.navigation.navigate("BookNowScreenFive", {
                          data: this.state.fullStylistData,
                          order: this.state.orderInfo
                        });
                    break;
                    case "not_responded":

                    break;
                }
            })
            .catch((err) => {
                console.log(err);
                //self.props.navigation.navigate("BookNowScreenFive");
                contextData.showAlert(
                  "Error occured processing request, try again later"
                );
                self.setState({
                  showOverLay: false,
                });
                //clearInterval(intervalStuff);
            });

      }, 3000); //Every 3 seconds
  }

  gotoScreen = () => {
    this.props.navigation.navigate("ViewItem");
  };

  showDatePicker = () => {
    this.datepicker.onPressDate();
  };

  handleConfirm = (date) => {
    this.setState({
      date: date,
    });
  };

  bookNow = () => {
    this.setState({
      showOverLay: true,
    });

    let requestType = "future";
    if (this.state.appointmentDate.today) {
      requestType = "today";
    }

    let dataRequest = {
      user: this.state.userId,
      stylist: selectedStylist._id,
      category: this.state.category,
      service: this.state.selectedService.service,
      total_cost: this.state.bookPrice,
      type: requestType,
      date: this.state.appointmentDate.date,
      number_of_people: 1,
      address: address
    };

    axios
      .post(GLAM_CONSTANTS.API_BASE_URL + "/book_stylist", dataRequest, {
        headers: {
          Authorization: "Bearer:" + this.state.userToken,
        },
      })
      .then((response) => {
        
        if(response.data.response === "no_fcm_token"){
            this.setState({
              showOverLay: false,
            });
            contextData.showAlert(
              "Please select another stylist to fulfill your request."
            );
            return;
        }
        
        if(response.data.response === "booking_present"){
            this.setState({
              showOverLay: false,
            });
            contextData.showAlert(
              "That stylist is booked for the selected date, Please select another stylist or pick another date."
            );
            return;
        }

        dataRequest.stylistData = selectedStylist;
        dataRequest.order_id = response.data.response;

        const contextData = this.context;

        contextData._storeData("fullStylistData", JSON.stringify(dataRequest));
        contextData._storeData("orderInfo", response.data.response);

        self.setState({
          fullStylistData: dataRequest,
          orderInfo: response.data.response,
        });
        
        //we wait for the stylists response at this moment
        //we setup the polling at this point 
        this.startPolling()
        

        // self.props.navigation.navigate("BookNowScreenFive", {
        //   data: dataRequest
        // });
        //clearInterval(intervalStuff);
      })
      .catch((err) => {
          console.log(err.response);
          //self.props.navigation.navigate("BookNowScreenFive");
          contextData.showAlert(
            "Error occured processing request, try again later"
          );
          self.setState({
            showOverLay: false,
          });
          //clearInterval(intervalStuff);
      });
  };

  showIncluded = () => {
    this.setState({
      showIncluded: !this.state.showIncluded,
    });
  };

  showReviews = () => {
    this.setState({
      showReviews: !this.state.showReviews,
    });
  };

  setPrice = (price, wi) => {
    this.setState({
      bookPrice: price,
      whats_included: wi
    });
  };

  cancelRequest = () => {
    this.setState({
      showOverLay: false,
    });

    if (this.state.orderInfo) {
      console.log(this.state.orderInfo);
      axios
        .post(
          GLAM_CONSTANTS.API_BASE_URL + "/cancel_order",
          { order_id: this.state.orderInfo },
          {
            headers: {
              Authorization: "Bearer:" + this.state.userToken,
            },
          }
        )
        .then((response) => {
          contextData.showAlert("Request cancelled successfully");

          // self.props.navigation.navigate("BookNowScreenFive", {
          //   data: dataRequest
          // });
          //clearInterval(intervalStuff);
        })
        .catch((err) => {
          console.log(err.response);
          //self.props.navigation.navigate("BookNowScreenFive");
          contextData.showAlert("Error occured cancelling request");
        });
    } else {
      contextData.showAlert("Request cancelled successfully");
    }
  };

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
        token = await Notifications.getExpoPushTokenAsync();
        console.log("EXPO token", token);
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
      contextData.showAlert(JSON.stringify(err));
    }
  };

  _handleNotification = (notification) => {
      var self = this.state

      try{
          Vibration.vibrate();
          //console.log(notification);
          //console.log(this.state.orderInfo); //Current request order ID
      
          if (
            notification.data.stylist_response == "agreed" &&
            notification.data.order
          ) {
            //contextData.showAlert("Booking Accepted");
            //Accpted
            this.setState({
              showOverLay: false,
            });
      
            this.props.navigation.navigate("BookNowScreenFive", {
              data: this.state.fullStylistData,
              order: this.state.orderInfo
            });
          } else if (
            notification.data.stylist_response == "declined" &&
            notification.data.order
          ) {
            contextData.showAlert(
              "Request rejected by Stylist, please try again later"
            );
      
            this.cancelRequest();
          }
      }
      catch(e){
        contextData.showAlert(JSON.stringify(e));
      }
  };*/

  componentDidMount() {
    // register push notifications
    //this.registerForPushNotificationsAsync();

    /*this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );*/

    EventBus.getInstance().addListener("stylist_response", this.listener = data => {

      Notifications.dismissAllNotificationsAsync()

      if (typeof cancelToken != typeof undefined) {
        cancelToken.cancel("Operation canceled");
      }

      clearInterval(this.state.interval);


      // handle the event
      if(data.order_id  && data.response === "agreed"){
        this.setState({
          showOverLay: false,
        });
  
        this.props.navigation.navigate("BookNowScreenFive", {
          data: this.state.fullStylistData,
          order: this.state.orderInfo
        });
      }
      else if(data.order_id && data.response === "declined"){
        this.setState({
          showOverLay: false,
        });

        contextData.showAlert(
          "Request rejected by Stylist, please select another stylist"
        );
  
        this.cancelRequest();
      }
    })

    contextData = this.context;
    self = this;
    contextData._retrieveData("user").then(function (res) {
      let res_ = JSON.parse(res);
      self.setState({ userId: res_._id });
    });

    contextData._retrieveData("token").then(function (token) {
      self.setState({ userToken: token });
    });

    contextData._retrieveData("appointmentDate").then((appointmentDate_) => {
      self.setState({ appointmentDate: JSON.parse(appointmentDate_) });
    });

    contextData._retrieveData("categoryInfo").then((categoryInfo_) => {
      //console.log(categoryInfo_);
      let cat = JSON.parse(categoryInfo_);
      self.setState({ category: cat._id });
    });

    contextData._retrieveData('categoryInfo')
          .then(categoryInfo => {
              categoryInfo = JSON.parse(categoryInfo)

              selectedStylist.services.map(service => {
                if(categoryInfo._id.toString() === service.service.toString()){
                  self.setState({
                    selectedService: service,
                    bookPrice: service.price_one.price,
                    whats_included: service.price_one.whats_included
                  })
                }
              })
              
          })
          .catch(err => {
            console.log(err)
          })

  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener);
  }

  render() {
    //console.log(selectedStylist);
    return (
      <View style={styles.container}>
        <Overlay
          overlayStyle={{ height: "50%" }}
          isVisible={this.state.showOverLay}
        >
          <View
            style={{
              flexDirection: "column",
              flex: 1,
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../images/home/spin.gif")}
              style={{ width: 100, height: 100 }}
            />
            <Text
              style={{
                fontSize: 17,
                marginTop: 15,
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Waiting For Confirmation from{" "}
              {selectedStylist.name_of_business
                ? selectedStylist.name_of_business
                : "N/A"}
            </Text>
            {/* <Text style={{ fontSize: 22, fontWeight: "bold" }}>
              {this.state.counter}
            </Text> */}
            <TouchableOpacity
              onPress={() => this.cancelRequest()}
              style={{
                backgroundColor: "#000",
                padding: 10,
                borderRadius: 12,
                width: "80%",
              }}
            >
              <Text
                style={{ color: "#fff", fontSize: 16, textAlign: "center" }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </Overlay>

        <ScrollView>
          <View>
            <Image
              source={{ uri: selectedStylist.image_of_business }}
              style={{ width: "100%", height: 240 }}
            />
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                padding: 13,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#fff",
              }}
            >
              <View style={{ width: "60%", flex: 1, flexDirection: "column" }}>
                <Text
                  style={{ fontSize: 14, color: "#000", fontWeight: "500" }}
                >
                  {selectedStylist.name_of_business
                    ? selectedStylist.name_of_business
                    : "N/A"}
                </Text>
                <View
                  style={{
                    marginTop: 8,
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                  }}
                >
                  <Text style={{ fontSize: 12 }}>{selectedStylist.rating ? selectedStylist.rating : 0}</Text>
                  <AirbnbRating
                    readonly
                    count={5}
                    defaultRating={selectedStylist.rating ? selectedStylist.rating : 0}
                    size={10}
                    showRating={false}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                  }}
                >
                  {selectedStylist.online ? (
                    <View
                      style={{
                        marginTop: 8,
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "flex-start",
                      }}
                    >
                        <View style={styles.dotItem}></View>
                        <View style={{ marginLeft: 3 }}>
                          <Text style={{ fontSize: 12 }}>online</Text>
                        </View>
                    </View>
                  ) : (
                    <View
                      style={{
                        marginTop: 8,
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "flex-start",
                      }}
                    >
                        <View style={styles.dotItemOffline}></View>
                        <View style={{ marginLeft: 3 }}>
                          <Text style={{ fontSize: 12 }}>offline</Text>
                        </View>
                    </View>
                  )}
                </View>
              </View>
              <View style={{ width: "20%" }}></View>
              
            </View>
            <View
              style={{
                padding: 13,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#fff",
              }}
            >
              <Text style={{ fontSize: 12 }}>
                {selectedStylist.description_of_business}
              </Text>
            </View>
            <View
              style={{
                padding: 13,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#fff",
              }}
            >
              <View>
                <Text style={{ fontSize: 14, textAlign: "center" }}>
                  PRICE RANGE
                </Text>
              </View>
              
              {
                this.state.selectedService ? 

                <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setPrice(this.state.selectedService.price_one.price, this.state.selectedService.price_one.whats_included);
                  }}
                >
                  <Text style={styles.price}>
                  ₦{this.state.selectedService.price_one.price}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.setPrice(this.state.selectedService.price_two.price, this.state.selectedService.price_two.whats_included);
                  }}
                >
                  <Text style={styles.price}>
                  ₦{this.state.selectedService.price_two.price}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.setPrice(
                      this.state.selectedService.price_three.price, this.state.selectedService.price_three.whats_included
                    );
                  }}
                >
                  <Text style={styles.price}>
                  ₦{this.state.selectedService.price_three.price}
                  </Text>
                </TouchableOpacity>

                {/* <Text style={styles.price}>
                  N{selectedStylist.services[0].price_one.price}
                </Text>
                <Text style={styles.price}>
                  N{selectedStylist.services[0].price_two.price}
                </Text>
                <Text style={styles.price}>
                  N{selectedStylist.services[0].price_three.price}
                </Text> */}
              </View>
              : <View></View>
              }

            </View>
            <View
              style={{
                padding: 13,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#fff",
              }}
            >
                <TouchableOpacity onPress={this.showIncluded}>
                   <View 
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}>
                      <Text style={{ fontSize: 13 }}>What’s Included?</Text>
                      {this.state.showIncluded ? (
                        <Icon
                          name="chevron-down"
                          type="font-awesome"
                          color="#000"
                        />
                      ) : (
                        <Icon name="chevron-up" type="font-awesome" color="#000" />
                      )}
                   </View>
                </TouchableOpacity>
            </View>

            {this.state.showIncluded ? (
              <View
                style={{
                  backgroundColor: "#F4B9B8",
                  paddingTop: 20,
                  paddingBottom: 20,
                  paddingRight: 30,
                  paddingLeft: 30,
                  flex: 1,
                  flexDirection: "column",
                }}
              >
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <Icon
                    name="check"
                    type="font-awesome"
                    color="#000"
                    size={14}
                  />
                  <Text style={styles.includedText}>
                    {this.state.whats_included}
                  </Text>
                </View>
              </View>
            ) : (
              <View></View>
            )}

            <View
              style={{
                padding: 13,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#fff",
              }}
            >
              
              <TouchableOpacity onPress={this.showReviews}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}>
                    <Text style={{ fontSize: 13 }}>Customer Reviews</Text>
                    {this.state.showReviews ? (
                      <Icon
                        name="chevron-down"
                        type="font-awesome"
                        color="#000"
                      />
                    ) : (
                      <Icon
                        name="chevron-up"
                        type="font-awesome"
                        color="#000"
                      />
                    )}
                  </View>
              </TouchableOpacity>
            </View>
            {this.state.showReviews ? (
              <View
                style={{
                  backgroundColor: "#F4B9B8",
                  paddingTop: 20,
                  paddingBottom: 20,
                  paddingRight: 30,
                  paddingLeft: 30,
                  flex: 1,
                }}
              >
                {
                  (this.state.selectedService.reviews && this.state.selectedService.reviews.length > 0) 

                  ? this.state.selectedService.reviews.map((review,index) => {
                    return <View

                    key={index}

                    style={{
                      flex: 1,
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      marginBottom: 18
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>{review.name}</Text>
                    <AirbnbRating
                      readonly
                      count={5}
                      defaultRating={review.rating}
                      size={10}
                      showRating={false}
                    />
                    <Text style={{ fontSize: 10 }}>
                      {review.comment}
                    </Text>
                  </View>
                }) : 

                <View style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 16,
                  marginBottom: 16
                }}>
                  <Text>No reviews present</Text>
                </View>

                }
              </View>
            ) : (
              <View></View>
            )}

            <TouchableOpacity
              onPress={() => this.bookNow()}
              style={{
                backgroundColor: "#fff",
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: 10,
                paddingRight: 10,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#FF5B58",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                BOOK NOW (₦{this.state.bookPrice})
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  includedText: {
    marginLeft: 30,
    fontSize: 15,
  },
  price: {
    fontSize: 18,
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
    color: "#FF9391",
    fontWeight: "800",
  },
  header: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    paddingTop: 12,
    paddingBottom: 12,
  },
  firstText: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  FisrtInnerText: {
    textAlign: "center",
    fontWeight: "500",
  },
  container: {
    backgroundColor: "#FF9391",
    flex: 1,
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
    paddingLeft: 10,
  },
  buttonBigtext: {
    fontSize: 21,
    textAlign: "center",
    color: "#FAFF00",
  },
  buttonSmalltext: {
    fontSize: 10,
    textAlign: "center",
    color: "#FAFF00",
  },
  center: {
    textAlign: "center",
  },
  bottomPart: {
    fontSize: 10,
    paddingRight: 13,
    paddingLeft: 13,
    marginTop: 10,
    letterSpacing: 0.5,
    fontWeight: "200",
  },
  dotItem: {
    borderRadius: 100,
    height: 12,
    width: 12,
    backgroundColor: "#1FD33B",
    marginTop: 4
  },
  dotItemOffline: {
    borderRadius: 100,
    height: 12,
    width: 12,
    backgroundColor: "red",
    marginTop: 4
  },
});
export default BookNowScreenFour;
