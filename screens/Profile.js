import React, {Component} from "react";
import {
    View,
    Text,
    StyleSheet
}from "react-native";

class Profile extends Component{
    render(){
        return(){
            <View style={StyleSheet.container}>
                <Text>Profile</Text>
            </View>
        };
    }
}

export default Profile;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItem: "center",
        justifyContent: "center"
    }
})