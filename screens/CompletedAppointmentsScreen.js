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
import { Icon, Header, Overlay } from "react-native-elements";
import FormButton from "./Forms/Button";
import FormContainer from "./Forms/Container";
import axios from "axios";
import CONSTANTS from "../config/constant";
import { Consumer, Context } from "../store/Provider";
import Spinner from "react-native-loading-spinner-overlay";
//import Toast from "react-native-simple-toast";
import { Rating, AirbnbRating } from "react-native-elements";

var contextData;
class CompletedAppointmentsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      showCancelView: false,
      token: "",
      loadingOrders: true,
      currentItem: {},
      requestInfo: {},
      businessName: "",
      showRateOverlay: false,
      ratingValue: 0,
      refreshing: false,
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
    this.getOrdersNow(contextData.token);
    this.setState({
      token: contextData.token,
    });
  }

  getOrdersNow = async (token) => {
    try {
      let response = await axios.post(
        CONSTANTS.API_BASE_URL + "/completed_appointments",
        {},
        {
          headers: {
            Authorization: "Bearer:" + token,
          },
        }
      );
      //console.log("LIST", response.data);
      this.setState({
        orders: response.data,
        loadingOrders: false,
        refreshing: false,
      });
      //return response.data;
    } catch (err) {
      this.setState({ loadingOrders: false });
      console.log(err);
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
            Authorization: "Bearer:" + contextData.token,
          },
        }
      );
      console.log("status", response.data);
      this.setState({
        showCancelView: false,
      });
    } catch (err) {
      console.log(err);
      contextData.showAlert("Error occured processing request");

      this.setState({
        showCancelView: false,
      });
      //return [];
    }
  };

  rebook = () => {};

  rateStylist = (item) => {
    this.setState({
      businessName: item.stylist.name_of_business,
      requestInfo: item,
      showRateOverlay: true,
    });
  };

  ratingCompleted = (val) => {
    this.setState({ ratingValue: val });
  };

  rateNow = async () => {
    try {
      let response = await axios.post(
        CONSTANTS.API_BASE_URL + "/rate_stylist",
        {
          order_id: this.state.requestInfo._id,
          rating: this.state.ratingValue,
        },
        {
          headers: {
            Authorization: "Bearer:" + this.state.token,
          },
        }
      );
      console.log("status", response.data);
      this.setState({
        showRateOverlay: false,
      });

      contextData.showAlert("Rating was successful");

      this.getOrdersNow(this.state.token);
    } catch (err) {
      console.log(err);
      contextData.showAlert("Error occured processing request");

      this.setState({
        showRateOverlay: false,
      });
      //return [];
    }
  };

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });
    this.getOrdersNow(this.state.token);
  };

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
            isVisible={this.state.showRateOverlay}
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
                Rate {this.state.businessName}
              </Text>

              <Rating
                imageSize={30}
                startingValue={0}
                style={{ marginBottom: 20 }}
                onFinishRating={this.ratingCompleted}
              />

              <TouchableOpacity
                onPress={() => this.rateNow()}
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
                  Continue
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    showRateOverlay: false,
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
                      <Image
                        source={{ uri: item.stylist.valid_id }}
                        style={{ width: 40, height: 40 }}
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

                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 15,
                      }}
                    >
                      {/* <View style={styles.buttonContainer}>
                        <FormContainer>
                          <FormButton
                            label="Rebook"
                            styles={{ label: styles.buttonWhiteText }}
                            // onPress={() => this.changeRequestDate(item)}
                          />
                        </FormContainer>
                      </View> */}

                      <View style={{ marginTop: 5, marginBottom: 5 }}>
                        <Text style={{ fontSize: 11 }}>
                          User Rating
                        </Text>

                        {
                          item.user_rating ? 
                          <AirbnbRating
                              readonly
                              count={5}
                              defaultRating={item.user_rating ? item.user_rating : 0}
                              size={10}
                              showRating={false}
                            /> : <View></View>
                        }
                      </View>

                      <View style={{ marginTop: 5, marginBottom: 5 }}>
                        <Text style={{ fontSize: 11 }}>
                          Stylist Rating
                        </Text>

                        {
                          item.stylist_rating ? 
                          <AirbnbRating
                              readonly
                              count={5}
                              defaultRating={item.stylist_rating ? item.stylist_rating : 0}
                              size={10}
                              showRating={false}
                            /> : <View></View>
                        }
                      </View>
                        
                    </View>
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
                  Nothing found
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
            COMPLETED APPOINTMENTS
          </Text>
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

export default CompletedAppointmentsScreen;
