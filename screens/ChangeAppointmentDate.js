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
import { Icon, Header, Overlay } from "react-native-elements";
import DatePicker from "react-native-datepicker";
import { Consumer, Context } from "../store/Provider";
//import Toast from "react-native-simple-toast";
import axios from "axios";
import CONSTANTS from "../config/constant";

var pageTitle, generalCategoryTitle, categoryInfo;
var contextData;
class ChangeAppointmentDate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: "",
      time: "",
      showOverLay: false,
      counter: 60,
      appointmentDate: {},
      token: "",
    };
  }

  static navigationOptions = ({ navigation }) => {
    pageTitle = navigation.getParam("title");
    categoryInfo = navigation.getParam("data");
    generalCategoryTitle = navigation.getParam("generalCategoryTitle");
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

  static contextType = Context;

  componentDidMount() {
    contextData = this.context;
    this.setState({
      token: contextData.token,
    });
    // contextData.saveCategoryName(generalCategoryTitle);
    // contextData._storeData("categoryInfo", JSON.stringify(categoryInfo));
  }

  gotoScreen = () => {
    this.props.navigation.navigate("ViewItem");
  };

  showDatePicker = () => {
    this.datepicker.onPressDate();
  };

  showDatePicker2 = () => {
    this.datepicker2.onPressDate();
  };

  handleConfirmFuture = (date) => {
    console.log(date);
    this.setState({
      date: date,
      appointmentDate: {
        today: false,
        date: date,
      },
    });

    this.reBookNow();

    // this.props.navigation.navigate("BookNowScreenTwo", {
    //   title: pageTitle,
    //   appointmentDate: {
    //     today: false,
    //     date: date
    //   }
    // });
  };

  formatDate = (date) => {
    //2020-04-30 13:42
    let d = new Date(date);
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  };

  handleConfirmImmediately = (time) => {
    let formattedDate = this.formatDate(new Date());
    console.log(formattedDate);
    this.setState({
      time: time,
      appointmentDate: {
        today: true,
        date: formattedDate + " " + time,
      },
    });

    this.reBookNow();

    // this.props.navigation.navigate("BookNowScreenTwo", {
    //   title: pageTitle,
    //   appointmentDate: { today: true, date: formattedDate + " " + time }
    // });
  };

  cancelRequest = () => {
    this.setState({
      showOverLay: false,
    });
  };

  reBookNow = async () => {
    this.setState({
      showOverLay: true,
    });
    let requestType = "future";
    if (this.state.appointmentDate.today) {
      requestType = "today";
    }

    console.log(this.state.appointmentDate);
  };

  cancelRequestNow = () => {
    this.setState({
      showOverLay: false,
    });

    this.props.navigation.navigate("AppointmentsScreen");
  };

  changeDate = async () => {
    try {
      let response = await axios.post(
        CONSTANTS.API_BASE_URL + "/change_order_date",
        {
          order_id: categoryInfo._id,
          new_date: this.state.appointmentDate.date,
        },
        {
          headers: {
            Authorization: "Bearer:" + this.state.token,
          },
        }
      );
      console.log("Data", response.data);
      this.setState({ showOverLay: false });
      contextData.showAlert("Request date changed successfully");
      this.props.navigation.navigate("AppointmentsScreen");

      //return response.data;
    } catch (err) {
      this.setState({ showOverLay: false });
      contextData.showAlert("Error occured processing request");
      console.log(err);
      //return [];
    }
  };

  render() {
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
            <Text
              style={{
                fontSize: 20,
                marginTop: 15,
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Are you sure you want to change the appointment date to{" "}
              {this.state.appointmentDate.date}?
            </Text>

            <TouchableOpacity
              onPress={() => this.changeDate()}
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
              onPress={() => this.cancelRequestNow()}
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
        {/* <Overlay
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
                fontWeight: "bold",
              }}
            >
              Waiting For Confirmation from Lois
            </Text>
            {/* <Text style={{ fontSize: 22, fontWeight: "bold" }}>
              {this.state.counter}
            </Text> 
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
        </Overlay> */}

        <DatePicker
          ref={(d) => {
            this.datepicker = d;
          }}
          style={{
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: 12,
            display: "none",
          }}
          date={this.state.date}
          mode="datetime"
          placeholder="Appointment Date"
          // format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={false}
          onDateChange={(date) => {
            this.handleConfirmFuture(date);
          }}
        />

        <DatePicker
          ref={(d) => {
            this.datepicker2 = d;
          }}
          style={{
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: 12,
            display: "none",
          }}
          date={this.state.time}
          mode="time"
          placeholder="Appointment Time"
          // format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={false}
          onDateChange={(date) => {
            this.handleConfirmImmediately(date);
          }}
        />

        <View style={styles.firstText}>
          <Text style={styles.FisrtInnerText}>When would you like to book</Text>
          <Text style={styles.FisrtInnerText}>your appointment?</Text>
        </View>

        <TouchableOpacity
          style={styles.child}
          onPress={() => this.showDatePicker2()}
        >
          <Text style={styles.buttonBigtext}>IMMEDIATELY</Text>
          <Text style={styles.buttonSmalltext}>
            The next available stylist will be right with you.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.child}
          onPress={() => this.showDatePicker()}
        >
          <Text style={styles.buttonBigtext}>FUTURE DATE</Text>
          <Text style={styles.buttonSmalltext}>
            Schedule your appointment for a future date.
          </Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.bottomPart}>Immediate Appointment:</Text>
          <Text style={styles.bottomPart}>
            Need the Glam central team quickly? No problem, we aim to respond to
            you within an hour! *Due to the fast response of our stylists, once
            immediate appointment has been accepted, any cancelation will be
            charged in full to your card
          </Text>
          <Text style={styles.bottomPart}>Cancellation Policy:</Text>
          <Text style={styles.bottomPart}>
            We are more than happy to assist you with any changes you might need
            to make to an appointment. Please feel free to email us at
            info@glamcentralng.com. *Bookings cancelled within 24hrs of your
            appointment will be charged in full to your card.
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
});

export default ChangeAppointmentDate;
