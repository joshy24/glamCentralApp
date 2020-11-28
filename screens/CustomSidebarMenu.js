//This is an example code for Navigation Drawer with Custom Side bar//
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Alert,
  AsyncStorage,
} from "react-native";
import { Icon } from "react-native-elements";
import { Consumer, Context } from "../store/Provider";

export default class CustomSidebarMenu extends Component {
  constructor() {
    super();
    //Setting up the Main Top Large Image of the Custom Sidebar
    // this.proileImage =
    //   "https://aboutreact.com/wp-content/uploads/2018/07/sample_img.png";
    //Array of the sidebar navigation option with icon and screen to navigate
    //This screens can be any screen defined in Drawer Navigator in App.js
    //You can find the Icons from here https://material.io/tools/icons/
    this.items = [
      {
        navOptionThumb: "home",
        navOptionName: "Home",
        screenToNavigate: "Home",
      },
      {
        navOptionThumb: "face",
        navOptionName: "Account",
        screenToNavigate: "Account",
      },
      {
        navOptionThumb: "library-books",
        navOptionName: "Appointments",
        screenToNavigate: "Appointments",
      },
      {
        navOptionThumb: "refresh",
        navOptionName: "Completed Appointments",
        screenToNavigate: "CompletedAppointments",
      },
      // {
      //   navOptionThumb: "refresh",
      //   navOptionName: "Rebook Stylist",
      //   screenToNavigate: "RebookStylist",
      // },
      {
        navOptionThumb: "message",
        navOptionName: "Contact Us",
        screenToNavigate: "ContactUs",
      },
      {
        navOptionThumb: "search",
        navOptionName: "Find Stylist",
        screenToNavigate: "FindStylist",
      },
      {
        navOptionThumb: "build",
        navOptionName: "FAQ",
        screenToNavigate: "FAQ",
      },
    ];
  }

  render() {
    return (
      <Consumer>
        {(context) => (
          <View style={styles.sideMenuContainer}>
            {/*Setting up Navigation Options from option array using loop*/}
            <View style={{ width: "100%" }}>
              {this.items.map((item, key) => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingTop: 15,
                    paddingBottom: 15,
                    backgroundColor: "#E98980",
                    borderBottomWidth: 1,
                    borderColor: "#797979",
                    borderTopWidth: 1,
                    marginTop: 3,
                  }}
                  key={key}
                >
                  <View style={{ marginRight: 10, marginLeft: 20 }}>
                    {global.currentScreenIndex === key ? (
                      <Icon name={item.navOptionThumb} size={25} color="#fff" />
                    ) : (
                      <Icon name={item.navOptionThumb} size={25} color="#000" />
                    )}
                  </View>
                  <Text
                    style={{
                      fontSize: 15,
                      color:
                        global.currentScreenIndex === key ? "white" : "black",
                    }}
                    onPress={() => {
                      global.currentScreenIndex = key;
                      this.props.navigation.navigate(item.screenToNavigate);
                    }}
                  >
                    {item.navOptionName}
                  </Text>
                </View>
              ))}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingTop: 10,
                  paddingBottom: 10,
                  borderBottomWidth: 1,
                  borderColor: "#797979",
                  borderTopWidth: 1,
                  marginTop: 3,
                }}
              >
                <View style={{ marginRight: 10, marginLeft: 20 }}>
                  <Icon name={"lock-open"} size={25} color="#000" />
                </View>
                <Text
                  style={{
                    fontSize: 15,
                  }}
                  onPress={() =>
                    Alert.alert(
                      "Log out",
                      "Do you want to continue with logout?",
                      [
                        {
                          text: "Cancel",
                          onPress: () => {
                            return null;
                          },
                        },
                        {
                          text: "Confirm",
                          onPress: () => {
                            AsyncStorage.clear();
                            context.clearUserData();
                            this.props.navigation.navigate("Login");
                          },
                        },
                      ],
                      { cancelable: false }
                    )
                  }
                >
                  Log out
                </Text>
              </View>
            </View>
          </View>
        )}
      </Consumer>
    );
  }
}
const styles = StyleSheet.create({
  sideMenuContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E98980",
    alignItems: "center",
    paddingTop: 20,
  },
  sideMenuProfileIcon: {
    resizeMode: "center",
    width: 150,
    height: 150,
    marginTop: 20,
    borderRadius: 150 / 2,
  },
});
