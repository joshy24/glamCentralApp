import React from 'react';
import Dialog from "react-native-dialog";

class Dialogs extends React.Component{

    constructor(props){
        super(props)
        this.state = 
            {
                visibleDialog:true
            }   
    }

closeDialog=()=>{
    this.setState({
        visibleDialog:true
    })

}

render(){
        return (
                <Dialog.Container visible={this.state.visibleDialog}>
                        <Dialog.Title>Test</Dialog.Title>
                        <Dialog.Description>
                        Welcome to Glad
                        </Dialog.Description>
                        <Dialog.Button label="Ok" onPress={this.closeDialog} />
                </Dialog.Container>
            )

        }


}

export default Dialogs;