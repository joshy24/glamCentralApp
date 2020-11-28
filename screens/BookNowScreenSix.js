import React from 'react';
import { StyleSheet, Text, View,Button,SafeAreaView, ScrollView,Image,TouchableOpacity,ImageBackground  } from 'react-native';
import { Icon,Header } from 'react-native-elements'
import DatePicker from 'react-native-datepicker'

class BookNowScreenSix extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
          date: "",
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
        title: navigation.getParam('title', 'CLASSIC'),
        headerStyle: {
          backgroundColor: '#FF9391',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }
    }

   

    gotoScreen = ()=>{
      this.props.navigation.navigate('ViewItem')
    }

    showDatePicker = () => {
      this.datepicker.onPressDate()
    };
  
   
  
   handleConfirm = date => {
      this.setState({
        date:date
      })
    };



  render(){  
      return (
      <View style={styles.container}>

           <DatePicker
            ref={(d) => { this.datepicker = d }}
            style={{width: "100%",backgroundColor:"#fff",borderRadius: 12,display:"none"}}
            date={this.state.date}
            mode="datetime"
            placeholder="Appointment Date"
           // format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            onDateChange={(date) => {this.handleConfirm(date)}}
          />


         

        <View style={styles.firstText}>
          <Text style={styles.FisrtInnerText}>When would you like to book</Text>
          <Text style={styles.FisrtInnerText}>your appointment?</Text>
        </View>


          <TouchableOpacity style={styles.child} onPress={()=>this.showDatePicker()}>
               <Text style={styles.buttonBigtext}>IMMEDIATELY</Text>
               <Text  style={styles.buttonSmalltext}>The next available stylist will be right with you.</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.child} onPress={()=>this.showDatePicker()}>
               <Text  style={styles.buttonBigtext}>FUTURE DATE</Text>
               <Text  style={styles.buttonSmalltext}>Schedule your appointment for a future date.</Text>
          </TouchableOpacity>

        <View>
          <Text style={styles.bottomPart}>Immediate Appointment:</Text>
          <Text style={styles.bottomPart}>Need the Glam central team quickly? No problem, we aim to respond
to you within an hour! *Due to the fast response of our stylists, once immediate appointment has been accepted, any cancelation will be charged in full to your card</Text>
        <Text style={styles.bottomPart}>Cancellation Policy:</Text>
        <Text style={styles.bottomPart}>We are more than happy to assist you with any changes you might need to make to an appointment. Please feel free to email us at info@glamcentralng.com. *Bookings cancelled within 24hrs of your appointment will be charged in full to your card.</Text>
        </View>

      </View>
        );
  }
}


const styles = StyleSheet.create({
  firstText:{
    paddingTop:20,
    paddingBottom:20,
  },  
  FisrtInnerText:{
    textAlign:"center",
    fontWeight:"500"
  },  
    container:{
      backgroundColor:"#FF9391",
      flex:1
    },
    child:{
      borderRadius:12,
      backgroundColor:"#000",
      marginTop:15,
      marginBottom:15,
      marginRight:13,
      marginLeft:13,
      paddingTop:15,
      paddingBottom:15,
      paddingRight:10,
      paddingLeft:10
    },
    buttonBigtext:{
      fontSize:21,
      textAlign:"center",
      color:"#FAFF00",
    },  
    buttonSmalltext:{
      fontSize:10,
      textAlign:"center",
      color:"#FAFF00",
    },  
    center:{
      textAlign:"center"
    },
    bottomPart:{
      fontSize:10,
      paddingRight:13,
      paddingLeft:13,
      marginTop:10,
      letterSpacing:0.5,
      fontWeight:"200"
    }
  
  });

export default BookNowScreenSix;
