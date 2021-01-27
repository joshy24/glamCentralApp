import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  AsyncStorage,
} from "react-native";

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer'

import WelcomeScreen from "./screens/WelcomeScreen";
import DashboardScreenNew from "./screens/DashboardScreenNew";
import Icon from "@expo/vector-icons/Ionicons";
import ViewItemScreen from "./screens/ViewItemScreen";
import AppIntroSlider from "react-native-app-intro-slider";
import { Button, ThemeProvider } from "react-native-elements";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { Provider } from "./store/Provider";
import CategoryScreen from "./screens/CategoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import BookNowScreenOne from "./screens/BookNowScreenOne";
import BookNowScreenTwo from "./screens/BookNowScreenTwo";
import BookNowScreenThree from "./screens/BookNowScreenThree";
import BookNowScreenFour from "./screens/BookNowScreenFour";
import BookNowScreenFive from "./screens/BookNowScreenFive";
import BookNowScreenSix from "./screens/BookNowScreenSix";
import AppointmentsScreen from "./screens/AppointmentsScreen";
import RebookStylistScreen from "./screens/RebookStylistScreen";
import ContactUsScreen from "./screens/ContactUsScreen";
import FindStylistScreen from "./screens/FindStylistScreen";
import FAQScreen from "./screens/FAQScreen";
import AuthLoadingScreen from "./screens/AuthLoadingScreen";
import MakePaymentNow from "./screens/MakePaymentNow";
import CompletedPaymentScreen from "./screens/CompletedPaymentScreen";
import CustomSidebarMenu from "./screens/CustomSidebarMenu";
import ChangeAppointmentDate from "./screens/ChangeAppointmentDate";
import CompletedAppointmentsScreen from "./screens/CompletedAppointmentsScreen";
import MakePaymentNowWebView from "./screens/MakePaymentNowWebView";
import Payment from "./screens/Payment";
import FlashMessage from "react-native-flash-message";

class WalkThroughScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show_Main_App: false,
    };
  }

  on_Done_all_slides = () => {
    this.setState({ show_Main_App: true });
  };

  on_Skip_slides = () => {
    this.setState({ show_Main_App: true });
  };
  _renderItem = ({ item }) => {
    return (
      <Image
        style={{ flex: 1, width: null, height: null, resizeMode: "contain" }}
        source={props.image}
      />
    );
  };

  renderItemNow = ({ item }) => {
    const { navigate } = this.props.navigation;
    let view;
    if (item.key == "k1") {
      view = (
        <ImageBackground style={styles.parent} source={item.image}>
          <View style={styles.MainContainer}>
            <Text style={styles.title}>{item.title} </Text>
            {/* <Text style={styles.description}>{item.text}</Text> */}
            <View style={styles.buttons}>
              <Button
                titleStyle={styles.red}
                onPress={() => navigate("Register")}
                buttonStyle={styles.button}
                title="SIGN UP"
              />
              <Button
                titleStyle={styles.red}
                onPress={() => navigate("Login")}
                buttonStyle={styles.button}
                title="LOGIN"
              />
            </View>
          </View>
        </ImageBackground>
      );
    } else if (item.key == "k2") {
      view = (
        <ImageBackground style={styles.parent} source={item.image}>
          <View style={styles.MainContainer}>
            <View style={{ position: "absolute", top: "10%" }}>
              <Text
                style={{
                  fontSize: 14,
                  color: "#000",
                  fontWeight: "bold",
                  textAlign: "center",
                  marginTop: 60,
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: "#000",
                  fontWeight: "100",
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                {item.text}
              </Text>
            </View>
            <View style={styles.buttons}>
              <Button
                titleStyle={styles.red}
                onPress={() => navigate("Register")}
                buttonStyle={styles.button}
                title="SIGN UP"
              />
              <Button
                titleStyle={styles.red}
                onPress={() => navigate("Login")}
                buttonStyle={styles.button}
                title="LOGIN"
              />
            </View>
          </View>
        </ImageBackground>
      );
    } else if (item.key == "k6") {
      view = (
        <ImageBackground style={styles.parent} source={item.image}>
          <View style={styles.MainContainer}>
            <View style={{ position: "absolute", bottom: "30%" }}>
              <Text style={styles.bigtitle}>{item.title}</Text>
              <Text style={styles.description}>{item.text}</Text>
            </View>
            <View style={styles.buttons}>
              <Button
                titleStyle={styles.red}
                onPress={() => navigate("Register")}
                buttonStyle={styles.button}
                title="SIGN UP"
              />
              <Button
                titleStyle={styles.red}
                onPress={() => navigate("Login")}
                buttonStyle={styles.button}
                title="LOGIN"
              />
            </View>
          </View>
        </ImageBackground>
      );
    } else if (item.key == "k5") {
      view = (
        <ImageBackground style={styles.parent} source={item.image}>
          <View style={styles.MainContainer}>
            <View style={{ position: "absolute", top: "10%" }}>
              <Text style={styles.bigtitle}>{item.title}</Text>
              <Text style={styles.description}>{item.text}</Text>
            </View>
            <View style={styles.buttons}>
              <Button
                titleStyle={styles.red}
                onPress={() => navigate("Register")}
                buttonStyle={styles.button}
                title="SIGN UP"
              />
              <Button
                titleStyle={styles.red}
                onPress={() => navigate("Login")}
                buttonStyle={styles.button}
                title="LOGIN"
              />
            </View>
          </View>
        </ImageBackground>
      );
    } else if (item.key == "k7") {
      view = (
        <ImageBackground style={styles.parent} source={item.image}>
          <View style={styles.MainContainer}>
            <View style={{ position: "absolute", bottom: "18%" }}>
              <Text style={styles.bigtitle}>{item.title}</Text>
              <Text style={styles.description}>{item.text}</Text>
            </View>
            <View style={styles.buttons}>
              <Button
                titleStyle={styles.red}
                onPress={() => navigate("Register")}
                buttonStyle={styles.button}
                title="SIGN UP"
              />
              <Button
                titleStyle={styles.red}
                onPress={() => navigate("Login")}
                buttonStyle={styles.button}
                title="LOGIN"
              />
            </View>
          </View>
        </ImageBackground>
      );
    }

    return view;
  };

  render() {
    return (
      <AppIntroSlider
        showDoneButton={false}
        dotStyle={{
          backgroundColor: "transparent",
          borderColor: "#FF5B58",
          borderWidth: 1,
          borderStyle: "solid",
        }}
        activeDotStyle={{ backgroundColor: "#FF5B58" }}
        paginationStyle={styles.pagination}
        showPrevButton={false}
        showNextButton={false}
        renderItem={this.renderItemNow}
        slides={slides}
        onDone={this.on_Done_all_slides}
        // showSkipButton={true}
        // onSkip={this.on_Skip_slides}
      />
    );
  }
}

const styles = StyleSheet.create({
  parent: {
    resizeMode: "cover",
    flex: 1,
  },
  MainContainer: {
    flex: 1,
    paddingTop: 20,
    alignItems: "center",
    padding: 70,
  },
  description: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "100",
    textAlign: "center",
    marginTop: 10,
  },
  title: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 60,
  },
  bigtitle: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 60,
  },
  text: {
    color: "#fff",
    fontSize: 20,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "cover",
  },
  buttons: {
    position: "absolute",
    bottom: 0,
    zIndex: 6,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 150,
  },
  red: {
    color: "#FF5B58",
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    padding: 5,
    paddingRight: 40,
    paddingLeft: 40,
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 15,
  },
  pagination: {
    position: "absolute",
    bottom: 130,
  },
});

const slides = [
  {
    key: "k1",
    title: "tap to learn how it works",
    text: "Best ecommerce in the world",
    image: require("./images/slide1.png"),
    titleStyle: styles.title,
    textStyle: styles.text,
    imageStyle: styles.image,
    backgroundColor: "red",
  },
  {
    key: "k2",
    title: "1. Get Glam Central services NOW",
    text:
      "Select a style and have a hair, makeup or nail stylist sent to your door.",
    image: require("./images/slide6.png"),
    titleStyle: styles.title,
    textStyle: styles.text,
    imageStyle: styles.image,
    backgroundColor: "#F4B1BA",
  },
  {
    key: "k6",
    title: "2. BOOK your Appointment",
    text:
      "Book an immediate appointment or schedule one for later. Then provuide us with your location and payment method.",
    image: require("./images/slide7.png"),
    titleStyle: styles.title,
    textStyle: styles.text,
    imageStyle: styles.image,
    backgroundColor: "#F4B1BA",
  },
  {
    key: "k5",
    title: "3. Receive CONFIRMATION",
    text: "Get a notification that your spot appointment has been booked.",
    image: require("./images/slide2.png"),
    titleStyle: styles.title,
    textStyle: styles.text,
    imageStyle: styles.image,
    backgroundColor: "#F4B1BA",
  },
  {
    title: "That’s it!",
    key: "k7",
    text:
      "If you choose an immediate appointment, your stylist will be on their way. After your appointment, be sure to rate your stylist.",
    image: require("./images/slide3.png"),
    titleStyle: styles.title,
    textStyle: styles.text,
    imageStyle: styles.image,
    backgroundColor: "#F4B1BA",
  },
];

// const AppStackNavigator = createStackNavigator({
//   //  Dashboard:DashboardScreen,
//   //  ViewItem:ViewItemScreen,
// });

const DashboardStack = createStackNavigator({
  Home: {
    screen: DashboardScreenNew,
    options:{ headerShown: false}
  },
  Category: {
    screen: CategoryScreen,
  },
  BookNowScreenOne: {
    screen: BookNowScreenOne,
  },
  BookNowScreenTwo: {
    screen: BookNowScreenTwo,
  },
  BookNowScreenThree: {
    screen: BookNowScreenThree,
  },
  BookNowScreenFour: {
    screen: BookNowScreenFour,
  },
});

const PendingAppointments = createStackNavigator({
  AppointmentsScreen: { screen: AppointmentsScreen },
  ChangeAppointmentDate: { screen: ChangeAppointmentDate },
});

const CompletedAppointments = createStackNavigator({
  CompletedAppointmentsScreen: { screen: CompletedAppointmentsScreen },
});

const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: DashboardStack,
    Account: ProfileScreen,
    Appointments: PendingAppointments,
    CompletedAppointments: CompletedAppointments,
    RebookStylist: RebookStylistScreen,
    ContactUs: ContactUsScreen,
    FindStylist: FindStylistScreen,
    FAQ: FAQScreen,
  },
  {
    contentComponent: CustomSidebarMenu,
    // contentComponent: props => (
    //   <View style={{ flex: 1, paddingTop: 20 }}>
    //     <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
    //       <DrawerItems {...props} />
    //       <TouchableOpacity
    //         onPress={() =>
    //           Alert.alert(
    //             "Log out",
    //             "Do you want to continue with logout?",
    //             [
    //               {
    //                 text: "Cancel",
    //                 onPress: () => {
    //                   return null;
    //                 }
    //               },
    //               {
    //                 text: "Confirm",
    //                 onPress: () => {
    //                   AsyncStorage.clear();
    //                   props.navigation.navigate("Login");
    //                 }
    //               }
    //             ],
    //             { cancelable: false }
    //           )
    //         }
    //       >
    //         <Text style={{ margin: 16, fontWeight: "bold", color: "#000" }}>
    //           Logout
    //         </Text>
    //       </TouchableOpacity>
    //     </SafeAreaView>
    //   </View>
    // ),
    // drawerOpenRoute: "DrawerOpen",
    // drawerCloseRoute: "DrawerClose",
    // drawerToggleRoute: "DrawerToggle",
    // drawerBackgroundColor: "#E98980",
    // overlayColor: "#6b52ae",
    // contentOptions: {
    //   activeTintColor: "#000"
    // }
  }
);

const AppSwitchNavigator = createSwitchNavigator(
  {
    Welcome: { screen: WelcomeScreen },
    CompletedPaymentScreen: { screen: CompletedPaymentScreen },
    BookNowScreenFive: {
      screen: BookNowScreenFive,
    },
    MakePaymentNow: {
      screen: MakePaymentNow,
    },
    MakePaymentNowWebView: {
      screen: MakePaymentNowWebView,
    },
    //Auth: { screen: AppStackNavigator },
    WalkThrough: {
      screen: WalkThroughScreen,
    },
    DashboardOne: { screen: AppDrawerNavigator },
    AuthLoadingScreen: { screen: AuthLoadingScreen },
    Login: { screen: LoginScreen },
    Register: { screen: RegisterScreen },
  },
  {
    initialRouteName: "AuthLoadingScreen",
  }
);

const AppNavigator = createAppContainer(AppSwitchNavigator);

export default class App extends React.Component {
  render() {
    var show_Main_App = false;

    return (
      <Provider>
        <AppNavigator />
        <FlashMessage position="bottom" />
      </Provider>
    );
  }
}
