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
import { Icon, Header } from "react-native-elements";

class ContactUsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: "contact us",
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

  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor="#FF9391"
          placement="left"
          leftComponent={<LeftIconContainer pressNow={this.toggleMenu} />}
          // rightComponent={{
          //   text: "CONTACT US",
          //   style: { color: "#000", fontWeight: "bold" }
          // }}
          rightComponent={<CenterMenuComponent />}
        />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            justifyContent: "center"
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 10,
              marginBottom: 15,
              marginLeft: 20,
              marginRight: 20
            }}
          >
            <Text
              style={{
                color: "#FF5B58",
                fontWeight: "bold",
                textAlign: "center",
                fontSize: 20
              }}
            >
              EMAIL US
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 10,
              marginBottom: 10,
              marginLeft: 20,
              marginRight: 20
            }}
          >
            <Text
              style={{
                color: "#FF5B58",
                fontWeight: "bold",
                textAlign: "center",
                fontSize: 20
              }}
            >
              TEXT US
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: "#000",
              fontWeight: "100",
              fontSize: 12,
              textAlign: "center",
              padding: 18
            }}
          >
            The prettySpot App is available via text from 7:00AM - 9:00PM
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
            flexDirection: "row"
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
            CONTACT US
          </Text>
          <Icon type="font-awesome" name="envelope-o" size={20} />
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

export default ContactUsScreen;
