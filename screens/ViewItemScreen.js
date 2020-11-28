import React from 'react';
import { StyleSheet, Text, View,Button,Image } from 'react-native';


class LogoTitle extends React.Component {
  render() {
    return (
      <View>
        <Image
        source={require('./../assets/icon.png')}
        style={{ width: 30, height: 30 }}
      />
      <Text>View Item</Text>

      </View>
    );
  }
}


class ViewItemScreen extends React.Component{
  static navigationOptions = {
    headerTitle: <LogoTitle />,
    headerRight: (
      <Button
        onPress={() => alert('This is a button!')}
        title="Info"
        color="#fff"
      />
    )
};
  render(){  
      return (
            <View style={styles.container}>
            <Text>View Item Screen</Text>
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

export default ViewItemScreen;
