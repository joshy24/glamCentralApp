import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TextInput,
  AsyncStorage,
} from "react-native";
import FormButton from "./Forms/Button";
import FormContainer from "./Forms/Container";
import FormLabel from "./Forms/Label";
import { Consumer, Context } from "../store/Provider";
import Dialogs from "../screens/Utility/Dialogs";
//import Toast from "react-native-simple-toast";
import Spinner from "react-native-loading-spinner-overlay";

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initilaize: true,
    };
  }

  static contextType = Context;

  componentDidMount() {
    const contextData = this.context;
  }

  static navigationOptions = {
    header: null,
  };

  gotoDashboard = () => {
    this.props.navigation.navigate("DashboardOne");
  };

  componentDidMount() {
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    this.props.context
      ._retrieveData("token")
      .then((userToken) => {
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate(
          userToken ? "DashboardOne" : "WalkThrough"
        );
      })
      .catch((error) => {
        //this.setState({ error });
      });
  };

  doNothing = () => {};

  render() {
    return <Consumer>{(context) => <Text>Loading...</Text>}</Consumer>;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF9391",
    flex: 1,
  },
});

const ForwardRef = React.forwardRef((props, ref) => (
  <Consumer>
    {(context) => <AuthLoadingScreen context={context} {...props} />}
  </Consumer>
));

export default ({ navigation }) => (
  <View style={styles.container}>
    <ForwardRef navigation={navigation} />
  </View>
);

//export default AuthLoadingScreen;
