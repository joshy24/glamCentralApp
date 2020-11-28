import React from 'react';
import { StyleSheet, Text, View,Button,SafeAreaView, ScrollView,Image,TouchableOpacity,ImageBackground  } from 'react-native';
import { Icon,Header } from 'react-native-elements'

class RebookStylistScreen extends React.Component{
    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        title: 'rebook with a stylist',
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
    };

    gotoScreen = ()=>{
      this.props.navigation.navigate('ViewItem')
    }
    toggleMenu = () => {
      this.props.navigation.toggleDrawer();
    };
  render(){  
      return (
            <View style={styles.container}>
              <Header
                backgroundColor="#FF9391"
                placement="center"
                leftComponent={<LeftIconContainer pressNow={this.toggleMenu} />}
                centerComponent={{ text: 'REBOOK STYLIST', style: { color: '#000' } }}
              />
              <Text>Account</Text>
            </View>
        );
  }
}


const styles = StyleSheet.create({
  container:{
    backgroundColor:"#FF9391",
    flex: 1
  },  
  child:{
    flex: 1,
    backgroundColor:"#FF9391",
    flexDirection:"row",
    paddingTop:0,
    paddingBottom:15,
    elevation:4,
    marginTop:1,
    marginBottom:5,
shadowOffset: { width: 10, height: 10 },
shadowColor: "blue",
shadowOpacity: 0.5,
shadowRadius: 10,
  },
  center:{
    textAlign:"center"
  },
  leftSide:{
    width:"40%"
  },
  leftImage:{
    textAlign:"center",
    width:"30%"
  },
  rightSide:{
    textAlign:"center",
    width:"60%",
    paddingLeft:30,
    paddingTop:50
  },
  rightImage:{
    textAlign:"center",
    width:"70%",
    paddingLeft:10,
    paddingTop:50,
    paddingRight:50
  },
  bigText:{
    fontSize:30,
    fontWeight:"bold",
    textAlign:"center"
  },
  smallText:{
    fontSize: 11.5,
    lineHeight: 14,
    fontWeight:"100",
    textAlign:"center"
  }


});

class LeftIconContainer extends React.Component {
  constructor(props) {
    super(props);
 }

 onPress = () => {
    this.props.pressNow();
  };

  render() {
    return (
      <Icon
        name="menu"
        color="#000"
        onPress={this.onPress}
      />
    );
  }

}


export default RebookStylistScreen;
