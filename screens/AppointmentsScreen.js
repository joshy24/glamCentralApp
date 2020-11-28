import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  RefreshControl,
} from "react-native";
import { Icon, Header, Overlay, Rating, AirbnbRating } from "react-native-elements";
import FormButton from "./Forms/Button";
import FormContainer from "./Forms/Container";
import axios from "axios";
import CONSTANTS from "../config/constant";
import { Consumer, Context } from "../store/Provider";
import Spinner from "react-native-loading-spinner-overlay";
//import Toast from "react-native-simple-toast";

var contextData;
class AppointmentsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      showCancelView: false,
      showCompletedView: false,
      token: "",
      loadingOrders: true,
      currentItem: {},
      refreshing: false,
      rating: 0,
      comment: ""
    };
  }

  static contextType = Context;

  static navigationOptions = {
    header: null,
    // title: "my appointments",
    // headerStyle: {
    //   backgroundColor: "#f4511e"
    // },
    // headerTintColor: "#fff",
    // headerTitleStyle: {
    //   fontWeight: "bold"
    // }
  };

  gotoScreen = () => {
    this.props.navigation.navigate("ViewItem");
  };

  toggleMenu = () => {
    this.props.navigation.toggleDrawer();
  };

  componentDidMount() {
    contextData = this.context;
    this.setState({
      token: contextData.token,
    });
    this.getOrdersNow(contextData.token);
  }

  getOrdersNow = async (token) => {
    try {
      let response = await axios.post(
        CONSTANTS.API_BASE_URL + "/appointments",
        {},
        {
          headers: {
            Authorization: "Bearer:" + token,
          },
        }
      );
      this.setState({
        orders: response.data,
        loadingOrders: false,
        refreshing: false,
      });
      //return response.data;
    } catch (err) {
      this.setState({ loadingOrders: false });
      //return [];
    }
  };

  cancelRequest = async () => {
    const orderId = this.state.currentItem._id;

    try {
      let response = await axios.post(
        CONSTANTS.API_BASE_URL + "/cancel_order",
        { order_id: orderId },
        {
          headers: {
            Authorization: "Bearer:" + this.state.token,
          },
        }
      );

      this.setState({
        showCancelView: false,
      });

      if(response.data.response === "not found"){
        contextData.showAlert("The Booking was not found");
        return;
      }

      this.getOrdersNow(this.state.token);

      contextData.showAlert("The Booking was cancelled successfully");
      
    } catch (err) {
      contextData.showAlert("Error occured processing request");

      this.setState({
        showCancelView: false,
      });
      //return [];
    }
  };

  completeRequest = async () => {
    const orderId = this.state.currentItem._id;

    try {
      let response = await axios.post(
        CONSTANTS.API_BASE_URL + "/rate_stylist",
        { order_id: orderId, comment: this.state.comment, rating : this.state.rating },
        {
          headers: {
            Authorization: "Bearer:" + this.state.token,
          },
        }
      );

      this.setState({
        showCompletedView: false,
      });

      switch(response.data.response){
         case "success":
           contextData.showAlert("Rating successfully applied");
           break;
         case "not found":
           contextData.showAlert("The Booking was not found");
           break;
         case "already rated":
          contextData.showAlert("You have already rated the performance of the stylist");
           break;  
      }

      this.getOrdersNow(this.state.token);

    } catch (err) {
      contextData.showAlert("Error occured processing request");

      this.setState({
        showCompletedView: false,
      });
      //return [];
    }
  };

  cancelAppointment = (item) => {
    this.setState({
      showCancelView: true,
      currentItem: item,
    });
  };

  changeRequestDate = (item) => {
    //console.log(item);
    this.setState({
      showCancelView: false,
      showCompletedView: true,
      currentItem: item,
    });
  };

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });
    this.getOrdersNow(this.state.token);
  };

  handleCommentInput = (e) => {
    const itemText = e.nativeEvent.text;
    this.setState({
      comment: itemText,
    });
  };

  onRatingChanged = (rating) => {
     console.log({rating});
     this.setState({
       rating: rating
     })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor="#FF9391"
          placement="left"
          leftComponent={<LeftIconContainer pressNow={this.toggleMenu} />}
          rightComponent={<CenterMenuComponent />}
        />
        <SafeAreaView>
          <Spinner
            visible={this.state.loadingOrders}
            textContent={"Loading..."}
            textStyle={{ color: "#000" }}
          />
          <Overlay
            overlayStyle={{ height: "50%" }}
            isVisible={this.state.showCancelView}
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
              <Text
                style={{
                  fontSize: 20,
                  marginTop: 15,
                  marginBottom: 10,
                  textAlign: "center",
                }}
              >
                Are you sure you want to cancel your appointment?
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  marginBottom: 5,
                  marginTop: 15,
                  textAlign: "center",
                }}
              >
                Note:
              </Text>
              <Text
                style={{ fontSize: 13, textAlign: "center", marginBottom: 20 }}
              >
                If you cancel this appointment you will be charged 10%
                cancelation fee
              </Text>

              <View></View>

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
                  Yes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    showCancelView: false,
                  })
                }
                style={{
                  backgroundColor: "#fff",
                  borderColor: "#000",
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 12,
                  width: "80%",
                  marginTop: 10,
                }}
              >
                <Text
                  style={{ color: "#000", fontSize: 16, textAlign: "center" }}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </Overlay>

          <Overlay
            overlayStyle={{ height: "90%" }}
            isVisible={this.state.showCompletedView}
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
              <Text
                style={{
                  fontSize: 20,
                  marginTop: 15,
                  marginBottom: 10,
                  textAlign: "center",
                }}
              >
                Thank you for using Glam Central
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  marginBottom: 5,
                  marginTop: 15,
                  textAlign: "center",
                }}
              >
                Note:
              </Text>
              <Text
                style={{ fontSize: 13, textAlign: "center", marginBottom: 20 }}
              >
                Once you tap on the confirm button, Glam Central will know that the stylist fulfiled the appointment
              </Text>

              <Text
                style={{ fontSize: 15, textAlign: "center", marginBottom: 20, marginTop: 16 }}
              >
                Please rate the stylists work
              </Text>
              
              <Rating
                  ratingCount={5}
                  defaultRating={this.state.rating}
                  size={25}
                  showRating={true}
                  onFinishRating = {this.onRatingChanged}
                />

              <Text
                style={{ fontSize: 15, textAlign: "center", marginTop: 27 }}
              >
                Please Leave a Comment
              </Text>

              <FormContainer>
                {/* <FormLabel text="Username or Email" /> */}
                <TextInput
                  placeholder="Type your comment here"
                  style={styles.textInput}
                  value={this.state.comment}
                  onChange={this.handleCommentInput}
                />
              </FormContainer>

              <TouchableOpacity
                onPress={() => this.completeRequest()}
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
                  Confirm
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    showCompletedView: false,
                  })
                }
                style={{
                  backgroundColor: "#fff",
                  borderColor: "#000",
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 12,
                  width: "80%",
                  marginTop: 10,
                }}
              >
                <Text
                  style={{ color: "#000", fontSize: 16, textAlign: "center" }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </Overlay>

          <ScrollView
            style={styles.ScrollView}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
          >
            {!this.state.loadingOrders && this.state.orders.length > 0 ? (
              this.state.orders.map((item, i) => {
                return (
                  <View style={styles.list} key={i}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                        }}
                      >
                        <Text style={{ paddingRight: 15, fontSize: 11 }}>
                          {item.service.name}
                        </Text>
                        {/* <Text style={{ paddingRight: 15, fontSize: 11 }}>
                          Make Up
                        </Text>
                        <Text style={{ paddingRight: 15, fontSize: 11 }}>
                          Classic
                        </Text> */}
                      </View>
                      {/* <Text style={{ fontSize: 11 }}>5/5/2020, 2:30pm</Text> */}
                      <Text style={{ fontSize: 11 }}>
                        {contextData.formatDate(item.date)}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 15,
                        marginBottom: 5,
                      }}
                    >
                      <Text style={{ fontSize: 11 }}>
                        {item.stylist.name_of_business}
                      </Text>

                      <AirbnbRating
                          readonly
                          count={5}
                          defaultRating={item.user_rating ? item.user_rating : 0}
                          size={10}
                          showRating={false}
                        />

                      <Image
                        source={{ uri: item.stylist.valid_id }}
                        style={{ width: 50, height: 50 }}
                      />
                    </View>
                    <View style={{ marginTop: 5, marginBottom: 5 }}>
                      <Text style={{ fontSize: 11, fontWeight: "bold" }}>
                        Price: N{" "}
                        {item.total_cost
                          ? item.total_cost
                          : item.service.price_range}
                      </Text>
                    </View>
                    <View style={{ marginTop: 5, marginBottom: 5 }}>
                      <Text style={{ fontSize: 11 }}>
                        Includes:{" "}
                        {item.stylist.services[0].price_one.whats_included}{" "}
                        {item.stylist.services[1].price_one.whats_included}{" "}
                        {item.stylist.services[2].price_one.whats_included}
                      </Text>
                    </View>
                    <View style={{ marginTop: 5, marginBottom: 5 }}>
                      <Text style={{ fontSize: 11 }}>
                        Address: {item.user.address}
                      </Text>
                    </View>

                    {
                      (!item.user_rating && item.customer_confirmed == false) ? 

                      <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 15,
                      }}
                    >
                      <View style={styles.buttonContainer}>
                        <FormContainer>
                          <FormButton
                            label="Completed"
                            styles={{ label: styles.buttonWhiteText }}
                            onPress={() => {
                              this.setState({
                                currentItem: item,
                                showCompletedView: true
                              })
                            }}
                          />
                        </FormContainer>
                      </View>

                      <View style={styles.buttonContainer}>
                        <FormContainer>
                          <FormButton
                            label="Cancel Appointment"
                            styles={{ label: styles.buttonWhiteText }}
                            onPress={() => this.cancelAppointment(item)}
                          />
                        </FormContainer>
                      </View>
                    </View> : <View></View>
                    }
                  </View>
                );
              })
            ) : (
              <View></View>
            )}

            {!this.state.loadingOrders && this.state.orders.length == 0 ? (
              <View
                style={{
                  marginTop: "50%",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 15,
                  }}
                >
                  No pending order found
                </Text>
              </View>
            ) : (
              <View></View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF9391",
    flex: 1,
  },
  ScrollView: {
    marginBottom: 100,
  },
  list: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 12,
  },
  textInput: {
    height: 80,
    width: "80%",
    fontSize: 30,
    backgroundColor: "#FFF",
    borderColor: "#FF9391",
    borderRadius: 12,
    fontSize: 12,
    paddingRight: 18,
    paddingLeft: 18,
  },
  child: {
    flex: 1,
    backgroundColor: "#FF9391",
    flexDirection: "row",
    paddingTop: 0,
    paddingBottom: 15,
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
  },
  buttonContainer: {
    width: "45%",
  },
  buttonWhiteText: {
    fontSize: 11,
    backgroundColor: "#FFF",
    color: "#FF5B58",
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 12,
    width: "100%",
    textAlign: "center",
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
          }}
        >
          <Text
            style={{
              color: "#000",
              fontWeight: "bold",
              textAlign: "center",
              marginRight: 15,
            }}
          >
            MY APPOINTMENTS
          </Text>
          <Image
            source={require("../images/appointment.png")}
            style={{ width: 18, height: 18 }}
          />
          {/* <Icon type="font-awesome" name="envelope-o" size={20} /> */}
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
    return <Icon name="menu" color="#000" onPress={this.onPress} />;
  }
}

export default AppointmentsScreen;
