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
import { Consumer, Context } from "../store/Provider";

var pageTitle = "";

class CategoryScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCategory: [],
      pageTitle: ""
    };
  }

  static navigationOptions = ({ navigation }) => {
    pageTitle = navigation.getParam("title");

    return {
      title: navigation.getParam("title", "MAKEUP styles"),
      headerStyle: {
        backgroundColor: "#FF9391"
      },
      headerTintColor: "#000",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    };
  };

  static contextType = Context;

  componentDidMount() {
      const contextData = this.context;
      let services = contextData.services;

      pageTitle = pageTitle.toLowerCase();
      var selectedCategory = services.find(ele => 
        pageTitle.indexOf(ele.name.toLowerCase()) > -1
      );

      this.setState({
        selectedCategory: selectedCategory.services
      });
  }

  gotoScreen = data => {
      this.props.navigation.navigate("BookNowScreenOne", {
        data: data,
        title: data.name,
        generalCategoryTitle: pageTitle
      });
  };

  render() {
    return (
      <Consumer>
        {context => (
          <View style={styles.container}>
            <SafeAreaView>
              <ScrollView
                style={styles.ScrollView}
                showsVerticalScrollIndicator={false}
              >
                {this.state.selectedCategory.map((val, i) => {
                  return (
                    <TouchableOpacity
                      key={i}
                      style={styles.child}
                      onPress={() => this.gotoScreen(val)}
                    >
                      <View style={styles.leftSide}>
                        <Image
                          source={{uri:val.image}}
                          style={{ width: "100%", height: 150 }}
                        />
                      </View>
                      <View style={styles.rightSide}>
                        <ImageBackground
                          source={require("../images/home/bg.png")}
                          style={{
                            width: "100%",
                            height: "100%",
                            overflow: "hidden"
                          }}
                        >
                          <View>
                            <Text style={styles.bigText}>{val.name}</Text>
                          </View>
                        </ImageBackground>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </SafeAreaView>
          </View>
        )}
      </Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF9391",
    flex: 1
  },
  ScrollView: {
    backgroundColor: "#FF9391"
  },
  child: {
    flex: 1,
    backgroundColor: "#FF9391",
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "#FF5B58"
  },
  center: {
    textAlign: "center"
  },
  leftSide: {
    width: "30%"
  },

  rightSide: {
    textAlign: "center",
    width: "70%",
    paddingLeft: 30,
    paddingTop: 50
  },
  bigText: {
    fontSize: 22,
    fontWeight: "400",
    textAlign: "center"
  },
  smallText: {
    fontSize: 11.5,
    lineHeight: 14,
    fontWeight: "100",
    textAlign: "center"
  }
});

export default CategoryScreen;
