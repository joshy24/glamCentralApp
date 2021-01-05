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
  ImageBackground
} from "react-native";
import { Icon, Header, Input } from "react-native-elements";
import { Consumer, Context } from "../store/Provider";
import DatePicker from "react-native-datepicker";

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    let userInfo = props.context.userData;
    this.state = {
      firstname: userInfo.firstname,
      lastname: userInfo.lastname,
      phoneNumber: userInfo.phone_number,
      email: userInfo.email,
      dob: userInfo.dob,
      address: userInfo.address
    };
  }

  static navigationOptions = {
    title: "my account",
    headerStyle: {
      backgroundColor: "#f4511e"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  gotoScreen = () => {
    this.props.navigation.navigate("ViewItem");
  };

  toggleMenu = () => {
    this.props.navigation.toggleDrawer();
  };

  updateProfile = () => {
    alert("updating");
  };

  showDatePicker = () => {
    this.datepicker.onPressDate();
  };

  handleConfirm = date => {
    this.setState({
      dob: date
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor="#FF9391"
          placement="left"
          leftComponent={
            <LeftIconContainer pressNow={() => this.toggleMenu()} />
          }
          centerComponent={<CenterMenuComponent />}
        />
        <ScrollView style={{ marginTop: 15 }}>
          <View style={styles.formGroup}>
            <View style={{ flexDirection: "row", width: "100%" }}>
              <View style={{ width: "50%" }}>
                <Input
                  label="FIRST NAME"
                  labelStyle={styles.label}
                  inputContainerStyle={{ borderBottomColor: "#000" }}
                  value={this.state.firstname}
                  onChange={e => {
                    this.setState({
                      firstname: e.nativeEvent.text
                    });
                  }}
                />
              </View>
              <View style={{ width: "50%" }}>
                <Input
                  label="LAST NAME"
                  labelStyle={styles.label}
                  inputContainerStyle={{ borderBottomColor: "#000" }}
                  value={this.state.lastname}
                />
              </View>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Input
              label="MOBILE NUMBER"
              labelStyle={styles.label}
              leftIconContainerStyle={styles.iconInput}
              inputContainerStyle={{ borderBottomColor: "#000" }}
              leftIcon={{
                size: 12,
                type: "font-awesome",
                name: "phone"
              }}
              value={this.state.phoneNumber}
            />
          </View>
          <View style={styles.formGroup}>
            <Input
              label="EMAIL ADDRESS"
              labelStyle={styles.label}
              leftIconContainerStyle={styles.iconInput}
              inputContainerStyle={{ borderBottomColor: "#000" }}
              leftIcon={{ size: 12, type: "font-awesome", name: "envelope" }}
              value={this.state.email}
            />
          </View>

          <View style={styles.formGroup}>
            <Input
              label="ADDRESS"
              labelStyle={styles.label}
              leftIconContainerStyle={styles.iconInput}
              inputContainerStyle={{ borderBottomColor: "#000" }}
              leftIcon={{ size: 12, type: "font-awesome", name: "address-card" }}
              value={this.state.address}
            />
          </View>

          <DatePicker
            ref={d => {
              this.datepicker = d;
            }}
            style={{
              width: "100%",
              backgroundColor: "#fff",
              borderRadius: 12,
              display: "none"
            }}
            date={this.state.dob}
            mode="date"
            placeholder="Date of birth"
            // format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            onDateChange={date => {
              this.handleConfirm(date);
            }}
          />

          <TouchableOpacity
            onPress={() => this.showDatePicker()}
            style={styles.formGroup}
          >
            <Input
              label="DATE OF BIRTH"
              labelStyle={styles.label}
              leftIconContainerStyle={styles.iconInput}
              inputContainerStyle={{ borderBottomColor: "#000" }}
              leftIcon={{
                size: 12,
                type: "font-awesome",
                name: "calendar-o"
              }}
              disabled={true}
              value={this.state.dob}
            />
          </TouchableOpacity>

          <View style={styles.formGroup}>
            <Text style={styles.title}>CHANGE PASSWORD</Text>
            <Input
              label="NEW PASSWORD"
              labelStyle={styles.label}
              leftIconContainerStyle={styles.iconInput}
              inputContainerStyle={{ borderBottomColor: "#000" }}
              leftIcon={{ size: 12, type: "font-awesome", name: "lock" }}
            />

            <Input
              label="OLD PASSWORD"
              labelStyle={styles.label}
              leftIconContainerStyle={styles.iconInput}
              inputContainerStyle={{ borderBottomColor: "#000" }}
              leftIcon={{ size: 12, type: "font-awesome", name: "lock" }}
            />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 10,
              margin: 20
            }}
            onPress={() => this.updateProfile()}
          >
            <Text
              style={{
                color: "#FF5B58",
                fontWeight: "400",
                textAlign: "center",
                fontSize: 18
              }}
            >
              FINISH
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    marginBottom: 10,
    color: "#000",
    fontWeight: "100",
    paddingLeft: 10
  },
  formGroup: {
    marginBottom: 20
  },
  label: {
    color: "#000",
    fontWeight: "100",
    fontSize: 10
  },
  iconInput: {
    marginRight: 10
  },
  inputStyle: {
    borderBottomColor: "#000"
  },
  container: {
    backgroundColor: "#FF9391",
    flex: 1
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
    shadowRadius: 10
  },
  center: {
    textAlign: "center"
  },
  leftSide: {
    width: "40%"
  },
  leftImage: {
    textAlign: "center",
    width: "30%"
  },
  rightSide: {
    textAlign: "center",
    width: "60%",
    paddingLeft: 30,
    paddingTop: 50
  },
  rightImage: {
    textAlign: "center",
    width: "70%",
    paddingLeft: 10,
    paddingTop: 50,
    paddingRight: 50
  },
  bigText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center"
  },
  smallText: {
    fontSize: 11.5,
    lineHeight: 14,
    fontWeight: "100",
    textAlign: "center"
  }
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
          flexDirection: "row"
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
            alignContent: "center"
          }}
        >
          <Text
            style={{
              color: "#000",
              fontWeight: "bold",
              textAlign: "center",
              marginRight: 15
            }}
          >
            MY ACCOUNT
          </Text>
          <Icon type="font-awesome" name="user-circle-o" size={20} />
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

const ForwardRef = () =>
  React.forwardRef((props, ref) => (
    <Consumer>
      {context => <ProfileScreen context={context} {...props} />}
    </Consumer>
  ));

export default ForwardRef(ProfileScreen);
