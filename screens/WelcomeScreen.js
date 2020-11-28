import React from 'react';
import { StyleSheet, Text, View,Button } from 'react-native';

class WelcomeScreen extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
            <Button style={{ paddingBottom:20,color:"green"}} title="Login" onPress={()=>this.props.navigation.navigate("Dashboard")} />
            <Button style={{margin:10}} title="SignUp" onPress={()=>alert("signUp")} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default WelcomeScreen;