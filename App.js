/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";
import { Image, StyleSheet, Button, View, Text, FlatList } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import {BarChart, LineChart} from 'react-native-charts-wrapper';


class HomeScreen extends React.Component { 
  constructor(){
 
    super();
 
    global.chartValues = [];
  }
  state = {
    myState: true,
    data: '',
    isLoading: true,
    values: [{y: 2}, {y: 2}, {y: 4}]
      }
 updateState = () => {this.setState(previousState => (
  { myState: !previousState.myState }
))}
updateValue = () => {this.setState(
  {values: [{y: 7}, {y: 7}, {y: 8}]}
)}

componentDidMount(){
    return fetch('https://api.thingspeak.com/channels/760594/fields/1.json?results=3')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          dataSource: responseJson.feeds,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }



  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "#1a7da8" }}>
        <Text style={{flex: 0.2, alignItems: 'center', justifyContent: 'flex-start', color:"white"}}>
        WELCOME FELLAS, NEED SOME WEED?
        </Text>
        <Image
        style={{
          width: 200, height: 200
        }}
          source={require('./images/dishornored_symbol.jpg')}
        />
        <Button
          style={{backgroundColor: '#2196F3'}}
          title="Go to my charts"
          onPress={() => this.props.navigation.navigate('First')}
        />
        <Button
          style={{
            backgroundColor: '#2196F5',
            justifyContent: 'flex-end'
          }}
          title="Get out"
          onPress={this.updateState}
        />

        <Text onPress = {this.updateState}
        style={{color:"white"}}
        >
          {this.state.myState? 'PLEASE GET OUT OF MY LIFE' : 'JUST A JOKE, PLS STAY :3 ' }
        </Text>
        <View style={{flex: 1, paddingTop:20}}>
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <Text>Temperature: {item.field1}</Text>}
          keyExtractor={({created_at}, index) => created_at}
        />
      </View>
        {/* <Image
        style={{
          width: 600, height: 400
        }}
          source={require('./images/dishonored.jpeg')}
        /> */}
      </View>
    );
  }
}

class FirstScreen extends React.Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <BarChart style={styles.chart}
            data={{dataSets:[{label: "FIRST SCREEN", values: [{y: 1}, {y: 5}, {y: 6}, {y: 9}, {y: 6}]}]}}
          />
          <View style={styles.buttonContainer}>

            <View style={styles.buttonView}>
              <Button
              style={styles.button} 
              title="PREVIOUS PAGE"
              />
            </View>

            <View style={styles.buttonView}>
            <Button
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            title="MIDDLE FINGER"
            onPress={() => this.props.navigation.navigate('Belfast')}
            />
            </View>
            
            <Button
            style={{
              flex: 1,
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
            title="NEXT PAGE"
            onPress={() => this.props.navigation.navigate('Second')}
            />
            
          </View>
        </View>
      </View>
    );
  }
}


class SecondScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {values: [{y: 2}, {y: 2}, {y: 4}]};

    this. getDataUsingGet = this. getDataUsingGet.bind(this);
  }
  getDataUsingGet = () => {
    //GET request 
    fetch('https://api.thingspeak.com/channels/760594/fields/1.json?results=3', {
        method: 'GET'
        //Request Type 
    })
    .then((response) => response.json())
    //If response is in json then in success
    .then((responseJson) => {
        //Success 
        console.log(responseJson);
        for (var i = 0; i < responseJson.feeds.length; i++){
          console.log("FEED");
          var obj = responseJson.feeds[i];
          console.log(obj);
          console.log(obj.field1);   
          var temp = new Object();
          temp['y'] = Number(obj.field1);  
          
          this.setState({ 
            values: [...this.state.values, temp]
          })      
        }
	    
    })
    //If response is not in json then in error
    .catch((error) => {
        //Error 
        alert(JSON.stringify(error));
        console.error(error);
    });
  };
  
  updateValue = () => {this.setState(
        {values: [{y: 7}, {y: 12}, {y: 8}]}
      )}    
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <LineChart style={styles.chart}
            data={{dataSets:[{label: "SECOND SCREEN", values: this.state.values}]}}
          />
          <View style={styles.buttonContainer}>

            <View style={styles.buttonView}>
              <Button
              style={styles.button} 
              title="PREVIOUS PAGE"
              onPress={() => this.props.navigation.navigate('First')}
              />
            </View>

            <View style={styles.buttonView}>
            <Button
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            title="MIDDLE"
            onPress={this.getDataUsingGet}
            />
            </View>
            
            <Button
            style={{
              flex: 1,
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
            title="NEXT PAGE"
            onPress={this.updateValue}
            />
            
          </View>
        </View>
      </View>
    );
  }
}

class BelfastScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image
        style={{
          width: 400, height: 600
        }}
          source={require('./images/belfast.jpg')}></Image>

      </View>
    );
  }
}



const AppNavigator = createStackNavigator(
  {
  Home: HomeScreen,
  First: FirstScreen,
  Second: SecondScreen,
  Belfast: BelfastScreen,
  // Third: ThirdScreen,
  // Fourth: FourthScreen
  },
  {
    initialRouteName: "Home"
  }
);  

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2041',
  },


  firstrow: {
    flex: 1,
    backgroundColor: "#ffc857"
  },

  secondrow: {
    flex: 1,
    backgroundColor: "#4b3f72"
  },

  thirdrow: {
    flex: 1,
    backgroundColor: "#119da4"
  },

  fourthrow: {
    flex: 1,
    backgroundColor: "#19647e"
  },

  chart: {
    flex: 1
  },

  buttonContainer: {
    flex: 0.12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  button:{
    flex: 1
  },

  buttonView:{
    flex: 1,
    flexDirection: 'row'
  }
  
});