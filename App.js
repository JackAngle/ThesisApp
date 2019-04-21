/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";
import { ToastAndroid, Alert, Image, StyleSheet, Button, View, Text, FlatList, Dimensions, TouchableHighlight, processColor } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import {BarChart, LineChart} from 'react-native-charts-wrapper';
import NetInfo from "@react-native-community/netinfo";

let windowWidth = Dimensions.get('window').width;

class HomeScreen extends React.Component { 
  static navigationOptions = {
    title: 'Home',
    headerStyle: {
      backgroundColor: '#1a7da8',
    },
    headerTintColor: '#000',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  constructor(){
    super();
  }
  state = {
    myState: true,
    data: '',
    isConnected: false
  }

componentDidMount(){
    NetInfo.getConnectionInfo().then(data => {
    console.log("Connection type", data.type);
    console.log("Connection effective type", data.effectiveType);
    if (data.type === 'none') {
      alert("No internet connection")
  } else {
    this.setState({isConnected: true});
    console.log(this.state.isConnected);
  }
    });
    // return fetch('https://api.thingspeak.com/channels/760594/fields/1.json?results=3')
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     console.log(responseJson);
    //     this.setState({
    //       isLoading: false,
    //       dataSource: responseJson.feeds,
    //     }, function(){

    //     });

    //   })
    //   .catch((error) =>{
    //     console.error(error);
    //   });
  }

  checkIn = () => {
    if(this.state.isConnected){
      this.props.navigation.navigate('First');
    }
    else {
      ToastAndroid.show('No internet connection', ToastAndroid.LONG);
    }
  }

  render() {
    return (
      <View style={{ 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        backgroundColor: "#1c87ce",
        flexDirection: 'column' }}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', width: windowWidth, borderWidth: 3, borderColor: '#0a2059', borderStyle: 'solid', backgroundColor: '#468096'}}>
              <Text style={{
                flex: 0.5,  
                color:"white",
                fontWeight: 'bold',
                fontSize: 45,
                textAlign: "center"
                }}>
                JACK ANGLE'S {"\n"}
                THESIS APP
              </Text>
          </View>
          
          <View style={{flex: 1}}>
            <TouchableHighlight onPress={this.checkIn}>
                <Image
                  style={{
                    flex: 1,
                    // width: 300, height: 300
                    resizeMode: 'contain'
                }}
                  source={require('./images/dishornored_symbol.jpg')}
                />
            </TouchableHighlight>
          </View>
            
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', width: windowWidth}}>
          <Text style={{
                flex: 0.5,  
                color:"white",
                fontWeight: 'bold',
                fontSize: 23,
                textAlign: "center"
                }}>
                CLICK THE IMAGE TO CONTINUE
              </Text>
          </View>

        </View>
    );
  }
}

class FirstScreen extends React.Component {
  static navigationOptions = {
    title: '1st Sensor',
    headerStyle: {
      backgroundColor: '#1a7da8',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  constructor(props) {
    super(props);
    this.state = {values: []};

    //this. getDataUsingGet = this. getDataUsingGet.bind(this);
  }

  getDataUsingGet = () => {
    ToastAndroid.show('A pikachu appeared nearby !', ToastAndroid.LONG);
    //GET request 
    fetch('https://api.thingspeak.com/channels/760594/fields/1.json', {
        method: 'GET'
        //Request Type 
    })
    .then((response) => response.json())
    //If response is in json then in success
    .then((responseJson) => {
        //Success 
        console.log(responseJson);
        this.setState({ 
          values: []
        })    
        for (var i = 0; i < responseJson.feeds.length; i++){
          console.log("FEED");
          var obj = responseJson.feeds[i];
          console.log(obj);
          console.log(obj.field1);   

          /*Create {x: , y: } */
          var temp = new Object();
          //temp['x'] = Number(4);
          temp['y'] = Number(obj.field1);  
          
          /*Add it to values array */
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

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <BarChart 
            style={styles.chart}
            data={{dataSets:[{label: "FIRST SCREEN", values: this.state.values}]}}
            touchEnabled={true}
            onSelect = {this.getDataUsingGet}
          />

          <View style={styles.buttonContainer}>
            <View style={styles.buttonView}>
              {/* <Button
              style={styles.button} 
              title="PREVIOUS PAGE"
              onPress={this.getDataUsingGet}
              /> */}
            </View>

            <View style={styles.buttonView}>
            {/* <Button
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            title="MIDDLE FINGER"
            onPress={() => this.props.navigation.navigate('Belfast')}
            /> */}
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
  static navigationOptions = {
    title: '2nd Sensor',
    headerStyle: {
      backgroundColor: '#1a7da8',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  constructor(props) {
    super(props);
    this.state = {
      temperatureValues: [],
      humidityValues: []
    };

    //this. getDataUsingGet = this. getDataUsingGet.bind(this);
  }
  getDataUsingGet = () => {
    ToastAndroid.show('A hentai kamen appeared nearby !', ToastAndroid.LONG);
    //GET request 
    fetch('https://api.thingspeak.com/channels/760594/feeds.json', {
        method: 'GET'
        //Request Type 
    })
    .then((response) => response.json())
    //If response is in json then in success
    .then((responseJson) => {
        //Success 
        console.log(responseJson);
        this.setState({ 
          temperatureValues: [],
          humidityValues: []
        })     
        for (var i = 0; i < responseJson.feeds.length; i++){
          console.log("FEED");
          var obj = responseJson.feeds[i];
          console.log(obj);
          console.log(obj.field1);   
          console.log(obj.field2); 

          /*Create {x: , y: } */
          let temp = new Object();
          let humid = new Object();
          //temp['x'] = Number(4);
          if (obj.field1 != null){
            temp['y'] = Number(obj.field1); 
          } else{
            temp['y'] = 0; 
          }
          if (obj.field2 != null){
            humid['y'] = Number(obj.field2); 
          } 
          else{
            humid['y'] = 0; 
          }
          
          /*Add it to values array */
          this.setState({ 
            temperatureValues: [...this.state.temperatureValues, temp],
            humidityValues: [...this.state.humidityValues, humid]
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
  
  // updateValue = () => {this.setState(
  //       {values: [{y: 7}, {y: 12}, {y: 8}]}
  //     )}    
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <LineChart 
            style={styles.chart}
            data={{dataSets:[{label: "Temperature (Celcius)", values: this.state.temperatureValues, 
              config: {circleColor:processColor('white'),
              drawValues: false,
              drawCircleHole: false,
              circleRadius: 2,
              highlightColor: processColor('orange'),
              color:processColor('darkblue'),
              drawFilled: true,
              fillGradient: {
                colors: [processColor('darkblue'), processColor('aqua')],
                orientation: "TOP_BOTTOM"
              },
              fillAlpha: 1500
            }}, 

              {label: "Humidity (%)", values: this.state.humidityValues,
              config: {circleColor:processColor('white'),
              drawValues: false,
              drawCircleHole: false,
              circleRadius: 2,
              color:processColor('green'),
              drawFilled: true,
              fillGradient: {
                colors: [processColor('darkgreen'), processColor('greenyellow')],
                positions: [0, 0.5],
                angle: 90,
                orientation: "TOP_BOTTOM"
              },
              fillAlpha: 1500
            }
            }]}}

            yAxis= {{ left:{ axisMaximum: 100, axisMinimum: 0 }, right:{ axisMaximum: 100, axisMinimum: 0 }}}
            chartDescription={{ text: "DATE" }}
            touchEnabled={true}
            onSelect = {this.getDataUsingGet}
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
            {/* <Button
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            title="MIDDLE"
            onPress={this.getDataUsingGet}
            /> */}
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