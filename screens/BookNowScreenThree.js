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
} from "react-native";
import { Icon, Header, Rating, AirbnbRating } from "react-native-elements";
import DatePicker from "react-native-datepicker";
import { Consumer, Context } from "../store/Provider";
import axios from "axios";
import CONSTANTS from "../config/constant";
import Spinner from "react-native-loading-spinner-overlay";

var pageTitle;
var addressData = {};
var categoryInfo = {};

class BookNowScreenThree extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: "",
      rating: 2,
      stylists: [],
      loadingStylist: false,
      token: "",
    };
  }

  static navigationOptions = ({ navigation }) => {
    pageTitle = navigation.getParam("title");
    
    addressData = {
      state: navigation.getParam("finalState"),
      address: navigation.getParam("finalAddress"),
      lga: navigation.getParam("finalLGA"),
      categoryName: navigation.getParam("categoryName"),
    };

    return {
      title: navigation.getParam("categoryName", "CLASSIC"),
      headerStyle: {
        backgroundColor: "#FF9391",
      },
      headerTintColor: "#000",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    };
  };

  static contextType = Context;

  gotoScreen = (index) => {
    let selectedStylist = this.state.stylists[index];
    //console.log(selectedStylist);
    this.props.navigation.navigate("BookNowScreenFour", {
      title: pageTitle,
      address: addressData.address,
      selectedStylist: selectedStylist,
    });
  };

  async componentDidMount() {
    const contextData = this.context;
    
    let userInfo = contextData.userData;
    
    categoryInfo = await contextData._retrieveData('categoryInfo');
    categoryInfo = JSON.parse(categoryInfo)
    
    if(categoryInfo){
        this.getStylistNow(contextData.token, categoryInfo._id);
    }

    contextData.sendSocketNotification(
      addressData.lga,
      //"Alimosho",
      userInfo._id,
      contextData.token
    );

    this.setState({ token: contextData.token });

    contextData._storeData("bookingInfo", JSON.stringify(addressData));
  }

  refreshAgain = () => {
    this.getStylistNow(this.state.token, categoryInfo._id);
  };

  getStylistNow = async (token, service_id) => {
    this.setState({ loadingStylist: true });
    // console.log("Address info: ", addressData);
    try {
      let response = await axios.get(
        CONSTANTS.API_BASE_URL +
          "/search_stylists?admin_area=" +
          addressData.lga + "&service_id="+service_id,
        //"Alimosho",
        {
          headers: {
            Authorization: "Bearer:" + token,
          },
        }
      );
       
      this.setState({
        stylists: response.data ? response.data : [],
        loadingStylist: false,
      });
      //return response.data;
    } catch (err) {
      console.log("Error:", err);
      this.setState({ loadingStylist: false });

      //console.log(err);
      //return [];
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{pageTitle}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Spinner
            visible={this.state.loadingStylist}
            textContent={"Loading..."}
            textStyle={{ color: "#000" }}
          />
          {!this.state.loadingStylist &&
            this.state.stylists.map((item, i) => {
              return (
                <TouchableOpacity key={i} onPress={() => this.gotoScreen(i)}>
                  <Image
                    source={{ uri: item.image_of_business }}
                    style={{ width: "100%", height: 240 }}
                  />
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      padding: 10,
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderColor: "#fff",
                    }}
                  >
                    <View
                      style={{
                        width: "60%",
                        flex: 1,
                        flexDirection: "column",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          color: "#000",
                          fontWeight: "500",
                        }}
                      >
                        {item.name_of_business}
                      </Text>
                      <View
                        style={{
                          marginTop: 8,
                          flex: 1,
                          flexDirection: "row",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Text style={{ fontSize: 10 }}>{item.rating}</Text>
                        <AirbnbRating
                          readonly
                          count={5}
                          defaultRating={item.rating ? item.rating : 0}
                          size={10}
                          showRating={false}
                        />
                      </View>

                      {item.online ? (
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
                            <Text style={{ fontSize: 8 }}>online</Text>
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
                            <Text style={{ fontSize: 8 }}>offline</Text>
                          </View>
                        </View>
                      )}
                    </View>
                    <View style={{ width: "20%" }}></View>
                    <View style={{ width: "20%" }}>
                      <View
                        style={{
                          marginTop: -20,
                          flex: 1,
                          flexDirection: "column",
                          alignContent: "center",
                          justifyContent: "center",
                        }}
                      ></View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

          {!this.state.loadingStylist && this.state.stylists.length == 0 ? (
            <View style={{ marginTop: 50 }}>
              <Text style={{ textAlign: "center", fontSize: 17 }}>
                No stylist found
              </Text>
              <TouchableOpacity onPress={() => this.refreshAgain()}>
                <Text
                  style={{
                    backgroundColor: "#fff",
                    color: "#FF9391",
                    padding: 5,
                    margin: "30%",
                    borderRadius: 6,
                    textAlign: "center",
                    marginTop: 25,
                  }}
                >
                  Try again
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View></View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    height: 8,
    width: 8,
    backgroundColor: "#1FD33B",
    marginTop: 3,
  },
  dotItemOffline: {
    borderRadius: 100,
    height: 8,
    width: 8,
    backgroundColor: "red",
    marginTop: 3,
  },
});

// const ForwardRef = () =>
//   React.forwardRef((props, ref) => (
//     <Consumer>
//       {context => <BookNowScreenThree context={context} {...props} />}
//     </Consumer>
//   ));

//export default ForwardRef(BookNowScreenThree);

export default BookNowScreenThree;
