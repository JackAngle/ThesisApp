/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";
import { ToastAndroid, Alert, Image, StyleSheet, Button, View, Text, TextInput, ImageBackground, Dimensions, TouchableHighlight, processColor } from 'react-native';
import { createStackNavigator, createAppContainer, createMaterialTopTabNavigator } from "react-navigation";

import NetInfo from "@react-native-community/netinfo";
import Moment from 'moment';
import PureChart from 'react-native-pure-chart';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryLine, VictoryScatter } from "victory-native";

let windowWidth = Dimensions.get('window').width;
let windowHeight = Dimensions.get('window').height;
const urlHeader = 'https://api.thingspeak.com/channels/';
const urlFooter = '/feeds.json';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'WELCOME',
    headerStyle: {
      backgroundColor: 'lawngreen',
    },
    headerTintColor: '#000',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  constructor() {
    super();
    global.ThingSpeakURL = 'https://api.thingspeak.com/channels/760594/feeds.json';
    this.state = {
      myState: true,
      text: '',
      isConnected: false,
      data: ''
    }
  }




  componentDidMount() {
    NetInfo.getConnectionInfo().then(data => {
      console.log("Connection type", data.type);
      console.log("Connection effective type", data.effectiveType);
      if (data.type == 'none' || data.type == 'unknown') {
        Alert.alert("No internet connection")
      } else {
        this.setState({ isConnected: true });
        console.log(this.state.isConnected);
      }
    }
    );

    const netInfoListener = data => {
      if (data.type == 'none' || data.type == 'unknown') {
        this.setState({ isConnected: false });
        ToastAndroid.show('Connection error! Return to Home', ToastAndroid.LONG);
        this.props.navigation.navigate('Home');

      } else {
        this.setState({ isConnected: true });
      }
    }

    const subscription = NetInfo.addEventListener('connectionChange', netInfoListener);

  }

  checkIn = () => {
    if (this.state.isConnected) {
      { this.props.navigation.navigate('First') };
    }
    else {
      ToastAndroid.show('No internet connection', ToastAndroid.LONG);
    }
  }

  checkURL = () => {
    return fetch(global.ThingSpeakURL, {
      method: 'GET'
      //Request Type 
    })
      .then((response) => {
        if (response.status === 200) {
          this.props.navigation.navigate('Home02');
        } else {
          ToastAndroid.show('Failed! Try again', ToastAndroid.LONG);
        }
      }
      )
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <ImageBackground
        source={require('./images/waterfall.jpg')}
        imageStyle={{ resizeMode: 'stretch' }}
        style={{
          flex: 1,
          alignSelf: 'stretch',
          width: null,
          resizeMode: 'stretch'
        }}>
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{
              flex: 0.5,
              color: "white",
              fontWeight: 'bold',
              fontSize: 38,
              textAlign: "center"
            }}>
              HỆ THỐNG THU THẬP {"\n"}
              DỮ LIỆU QUA WIFI
              </Text>
          </View>

          {/* <View style={{flex: 1}}>
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
             */}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{
              flex: 0.5,
              color: "white",
              fontWeight: 'bold',
              fontSize: 20,
              textAlign: "center"
            }}>
              ENTER THINGSPEAK CHANNEL'S ID
              </Text>

            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <TextInput
                editable={true}
                maxLength={20}
                clearTextOnFocus={true}
                placeholder="ENTER HERE"
                placeholderTextColor="white"
                onChangeText={(text) => this.setState({ text })}
                value={this.state.text}
              >

              </TextInput>
              <Button
                title="SUBMIT"
                // disabled={this.state.isFetching}
                onPress={() => {
                  if (!this.state.text.length) {
                    global.ThingSpeakURL = urlHeader + "760594" + urlFooter;
                  } else {
                    global.ThingSpeakURL = urlHeader + this.state.text + urlFooter;
                  }
                  if (this.state.isConnected) {
                    // this.props.navigation.navigate('Home02');
                    ToastAndroid.show('Connecting...', ToastAndroid.LONG);
                    this.checkURL();
                  } else {
                    ToastAndroid.show('No internet connection', ToastAndroid.LONG);
                  }

                }}
              />
            </View>
          </View>

          <View style={{
            flex: 0.5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}></View>

          <View style={{
            flex: 0.5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}></View>
        </View>


      </ImageBackground>

    );
  }
}


class HomeScreen02 extends React.Component {
  static navigationOptions = {
    title: 'HOME',
    headerStyle: {
      backgroundColor: 'lawngreen',
    },
    headerTintColor: '#000',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  constructor() {
    super();
    this.state = {
      myState: true,
      text: '',
      isConnected: false,
      data: '',
      temperatureValues01: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
      humidityValues01: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
      temperatureValues02: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
      humidityValues02: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
      temperatureValues03: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
      humidityValues03: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
      temperatureValues04: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
      humidityValues04: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
    }
  }

  getDataUsingGet = () => {
    this.setState({ isFetching: true }, () => { console.log("Before fetching: " + this.state.isFetching) });
    ToastAndroid.show('Loading...', ToastAndroid.LONG);
    //GET request 
    fetch(global.ThingSpeakURL, {
      method: 'GET'
      //Request Type 
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        //Success 
        console.log(responseJson);

        let tempArray01 = [];
        let humidArray01 = [];
        let tempArray02 = [];
        let humidArray02 = [];
        let tempArray03 = [];
        let humidArray03 = [];
        let tempArray04 = [];
        let humidArray04 = [];


        for (let i = 0; i < responseJson.feeds.length; i++) {
          // console.log("FEED");
          let obj = responseJson.feeds[i];
          let dateTimeTemp = obj.created_at;


          /*Create {x: , y: } 01*/
          let temp01 = new Object();
          let humid01 = new Object();
          if (obj.field1 != null) {

            temp01['y'] = Number(obj.field1);
            temp01['x'] = new Date(dateTimeTemp);
            tempArray01 = [...tempArray01, temp01]

          }
          if (obj.field2 != null) {

            humid01['y'] = Number(obj.field2);
            humid01['x'] = new Date(dateTimeTemp);
            humidArray01 = [...humidArray01, humid01]
          }

          /*Create {x: , y: } 02*/
          let temp02 = new Object();
          let humid02 = new Object();
          if (obj.field3 != null) {

            temp02['y'] = Number(obj.field3);
            temp02['x'] = new Date(dateTimeTemp);
            tempArray02 = [...tempArray02, temp02]

          }
          if (obj.field4 != null) {

            humid02['y'] = Number(obj.field4);
            humid02['x'] = new Date(dateTimeTemp);
            humidArray02 = [...humidArray02, humid02]
          }

          /*Create {x: , y: } 03*/
          let temp03 = new Object();
          let humid03 = new Object();
          if (obj.field5 != null) {

            temp03['y'] = Number(obj.field5);
            temp03['x'] = new Date(dateTimeTemp);
            tempArray03 = [...tempArray03, temp03]

          }
          if (obj.field6 != null) {

            humid03['y'] = Number(obj.field6);
            humid03['x'] = new Date(dateTimeTemp);
            humidArray03 = [...humidArray03, humid03]
          }

          /*Create {x: , y: } 04*/
          let temp04 = new Object();
          let humid04 = new Object();
          if (obj.field7 != null) {

            temp04['y'] = Number(obj.field7);
            temp04['x'] = new Date(dateTimeTemp);
            tempArray04 = [...tempArray04, temp04]

          }
          if (obj.field8 != null) {

            humid04['y'] = Number(obj.field8);
            humid04['x'] = new Date(dateTimeTemp);
            humidArray04 = [...humidArray04, humid04]
          }
        }

        /*Assign temporary values to states */
        if (tempArray01.length > 0) {
          this.setState({
            temperatureValues01: tempArray01,
          })
        }
        if (humidArray01.length > 0) {
          this.setState({
            humidityValues01: humidArray01,
          })
        }
        if (tempArray02.length > 0) {
          this.setState({
            temperatureValues02: tempArray02,
          })
        }
        if (humidArray02.length > 0) {
          this.setState({
            humidityValues02: humidArray02,
          })
        }
        if (tempArray03.length > 0) {
          this.setState({
            temperatureValues03: tempArray03,
          })
        }
        if (humidArray03.length > 0) {
          this.setState({
            humidityValues03: humidArray03,
          })
        }
        if (tempArray04.length > 0) {
          this.setState({
            temperatureValues04: tempArray04,
          })
        }
        if (humidArray04.length > 0) {
          this.setState({
            humidityValues04: humidArray04,
          })
        }

        this.setState({ isFetching: false }, () => {
          console.log("After fetching: " + this.state.isFetching),
            console.log(JSON.stringify(this.state.temperatureValues01)),
            console.log(JSON.stringify(this.state.humidityValues01)),
            this.props.navigation.navigate('Sensor', {
              temp01: this.state.temperatureValues01,
              humid01: this.state.humidityValues01,
              temp02: this.state.temperatureValues02,
              humid02: this.state.humidityValues02,
              temp03: this.state.temperatureValues03,
              humid03: this.state.humidityValues03,
              temp04: this.state.temperatureValues04,
              humid04: this.state.humidityValues04,
            })
        });

      })
      //If response is not in json then in error
      .catch((error) => {
        //Error 
        this.setState({ isFetching: false }, () => { console.log("After fetching: " + this.state.isFetching) });
        console.error(error);
      });
  };

  render() {
    return (
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#1c87ce",
        flexDirection: 'column'
      }}>
        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center', width: windowWidth, backgroundColor: 'gold' }}>
          <ImageBackground
            source={require('./images/iotTheme.jpg')}
            imageStyle={{ resizeMode: 'stretch' }}
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'stretch',
              width: null,
              resizeMode: 'stretch'
            }}>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{
                flex: 1,
                color: "white",
                fontWeight: 'bold',
                fontSize: 38,
                position: 'absolute',
                textAlign: "center"
              }}>
                HỆ THỐNG THU THẬP {"\n"}
                DỮ LIỆU QUA WIFI
              </Text>
            </View>
          </ImageBackground>
        </View>
        {/* <View style={{
          flex: 0.5,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}>

          <View style={{ flex: 1, backgroundColor: 'black', borderWidth: 3, borderColor: 'yellow' }}>
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={() => this.props.navigation.navigate('First', {
                temperature: this.state.temperatureValue01,
                humidity: this.state.humidityValue01,
              })}
            >
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                1ST SENSOR
              </Text>
            </TouchableHighlight>
          </View>

          <View style={{ flex: 1, backgroundColor: 'black', borderWidth: 3, borderColor: 'yellow' }}>
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={() => this.props.navigation.navigate('Second', {
                temperature: this.state.temperatureValue02,
                humidity: this.state.humidityValue02,
              })}
            >
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                2ND SENSOR
              </Text>
            </TouchableHighlight>
          </View>
        </View> */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: windowWidth, backgroundColor: 'black' }}>
          <Image
            style={{
              flex: 1,
              aspectRatio: 1,
              resizeMode: 'contain'
            }}
            source={require('./images/wifi.png')}
          />
        </View>
        <View style={{
          flex: 0.3,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* <View style={{ flex: 1, backgroundColor: 'yellow', borderWidth: 3, borderColor: 'black' }}>
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={() => this.props.navigation.navigate('Third')}
            >
              <Text style={{ color: "black", fontWeight: 'bold', }}>
                3RD SENSOR
              </Text>
            </TouchableHighlight>
          </View> */}
          <View style={{ flex: 1, backgroundColor: 'darkslateblue', borderWidth: 5, borderColor: 'indigo' }}>
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={this.getDataUsingGet}
            >
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                GO TO CHARTS
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}


class FirstScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: '1st Sensor',
    headerRight: (
      <Button
        onPress={() => navigation.navigate('Home02')}
        title="HOME"
        color="green"
      />
    ),
    headerStyle: {
      backgroundColor: '#1a7da8',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  });

  constructor(props) {
    super(props);

    this.state = {
      temperatureValues: this.props.navigation.dangerouslyGetParent().getParam('temp01', [{ x: 0, y: 0 }, { x: 0, y: 0 }]),
      humidityValues: this.props.navigation.dangerouslyGetParent().getParam('humid01', [{ x: 0, y: 0 }, { x: 0, y: 0 }]),
      isFetching: false
    };

  }


  getDataUsingGet = () => {
    this.setState(
      {
        temperatureValues: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
        humidityValues: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
        isFetching: true
      },
      () => { console.log("Before fetching: " + this.state.isFetching) }
    );
    ToastAndroid.show('Loading...', ToastAndroid.LONG);
    //GET request 
    fetch(global.ThingSpeakURL, {
      method: 'GET'
      //Request Type 
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        //Success 
        console.log(responseJson);

        let tempArray = [];
        let humidArray = [];

        for (let i = 0; i < responseJson.feeds.length; i++) {
          // console.log("FEED");
          let obj = responseJson.feeds[i];
          let dateTimeTemp = obj.created_at;


          /*Create {x: , y: } */
          let temp = new Object();
          let humid = new Object();
          if (obj.field1 != null) {

            temp['y'] = Number(obj.field1);
            temp['x'] = new Date(dateTimeTemp);
            console.log(temp.x);
            tempArray = [...tempArray, temp]

          }
          if (obj.field2 != null) {

            humid['y'] = Number(obj.field2);
            humid['x'] = new Date(dateTimeTemp);
            humidArray = [...humidArray, humid]
          }
        }


        if (tempArray.length > 0) {
          this.setState({
            temperatureValues: tempArray,
          })
        }

        if (humidArray.length > 0) {
          this.setState({
            humidityValues: humidArray,
          })
        }

        this.setState({ isFetching: false }, () => {
          console.log("After fetching: " + this.state.isFetching),
            console.log(JSON.stringify(this.state.temperatureValues)),
            console.log(JSON.stringify(this.state.humidityValues))
        });
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error 
        this.setState({ isFetching: false }, () => { console.log("After fetching: " + this.state.isFetching) });
        console.error(error);
      });
  };

  render() {
    const { navigation } = this.props;


    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <VictoryChart height={windowHeight / 3} theme={VictoryTheme.material}
            // 
            scale={{ x: "time" }}>
            <VictoryScatter
              style={{ data: { fill: 'green' } }}
              size={4}
              data={this.state.temperatureValues}
              x="x" y="y"
            />
            <VictoryLine
              style={{
                data: { stroke: "#c43a31", strokeWidth: 2 },
                parent: { border: "1px solid #ccc" }
              }}
              data={this.state.temperatureValues}
              x="x" y="y"
            />
          </VictoryChart>
          <TouchableHighlight
            style={{
              flex: 1, alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Text style={{ color: "white", fontWeight: 'bold', }}>
              TEMPERATURE(&deg;C)
              </Text>
          </TouchableHighlight>
        </View>
        <View style={styles.container}>
          <VictoryChart height={windowHeight / 3} theme={VictoryTheme.material}
            // 
            scale={{ x: "time" }}>
            <VictoryScatter
              style={{ data: { fill: 'green' } }}
              size={4}
              data={this.state.humidityValues}
              x="x" y="y"
            />
            <VictoryLine
              style={{
                data: { stroke: "#c43a31", strokeWidth: 2 },
                parent: { border: "1px solid #ccc" }
              }}
              data={this.state.humidityValues}
              x="x" y="y"
            />
          </VictoryChart>
          <TouchableHighlight
            style={{
              flex: 1, alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Text style={{ color: "white", fontWeight: 'bold', }}>
              HUMIDITY(%)
              </Text>
          </TouchableHighlight>
        </View>

        <View style={styles.buttonContainer}>
          <View style={[styles.buttonView, { alignItems: 'center', backgroundColor: 'dodgerblue' }]}>
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'center',
                justifyContent: 'center'
              }}
            // onLongPress={() => this.props.navigation.navigate('Belfast')}
            >
              <Text style={{ color: "white", fontWeight: 'bold', }}>

              </Text>
            </TouchableHighlight>
          </View>
          <View style={[styles.buttonView, { alignItems: 'center', backgroundColor: 'dodgerblue' }]}>
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Button
                title="UPDATE DATA"
                disabled={this.state.isFetching}
                onPress={
                  this.getDataUsingGet
                }
              />
            </TouchableHighlight>
          </View>

          <View style={[styles.buttonView, { alignItems: 'center', backgroundColor: 'dodgerblue' }]}>
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'center',
                justifyContent: 'center'
              }}
            // onPress={() => this.props.navigation.navigate('Second')}
            >
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                {/* NEXT SENSOR */}
              </Text>
            </TouchableHighlight>
          </View>
        </View>

      </View>
    );
  }
}


class SecondScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: '2nd Sensor',
    headerRight: (
      <Button
        onPress={() => navigation.navigate('Home02')}
        title="HOME"
        color="green"
      />
    ),
    headerStyle: {
      backgroundColor: '#1a7da8',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  });
  constructor(props) {
    super(props);
    this.state = {
      temperatureValues: this.props.navigation.dangerouslyGetParent().getParam('temp02', [{ x: 0, y: 0 }, { x: 0, y: 0 }]),
      humidityValues: this.props.navigation.dangerouslyGetParent().getParam('humid02', [{ x: 0, y: 0 }, { x: 0, y: 0 }]),
      isFetching: false
    };
  }
  getDataUsingGet = () => {

    this.setState(
      {
        temperatureValues: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
        humidityValues: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
        isFetching: true
      },
      () => { console.log("Before fetching: " + this.state.isFetching) }
    );
    ToastAndroid.show('Loading data from server! >W<', ToastAndroid.LONG);
    //GET request 
    fetch(global.ThingSpeakURL, {
      method: 'GET'
      //Request Type 
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        //Success 
        console.log(responseJson);
        let tempArray = [];
        let humidArray = [];

        for (let i = 0; i < responseJson.feeds.length; i++) {
          // console.log("FEED");
          let obj = responseJson.feeds[i];
          let dateTimeTemp = obj.created_at;


          /*Create {x: , y: } */
          let temp = new Object();
          let humid = new Object();
          if (obj.field3 != null) {

            temp['y'] = Number(obj.field3);
            temp['x'] = new Date(dateTimeTemp);
            console.log(temp.x);
            tempArray = [...tempArray, temp]

          }
          if (obj.field4 != null) {

            humid['y'] = Number(obj.field4);
            humid['x'] = new Date(dateTimeTemp);
            humidArray = [...humidArray, humid]
          }
        }


        if (tempArray.length > 0) {
          this.setState({
            temperatureValues: tempArray,
          })
        }

        if (humidArray.length > 0) {
          this.setState({
            humidityValues: humidArray,
          })
        }
        this.setState({ isFetching: false }, () => { console.log("After fetching: " + this.state.isFetching) });
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error 
        alert(JSON.stringify(error));
        this.setState({ isFetching: false }, () => { console.log("Error fetching: " + this.state.isFetching) });
        console.error(error);
      });

  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <VictoryChart height={windowHeight / 3} theme={VictoryTheme.material}
            // 
            scale={{ x: "time" }}>
            <VictoryScatter
              style={{ data: { fill: 'green' } }}
              size={4}
              data={this.state.temperatureValues}
              x="x" y="y"
            />
            <VictoryLine
              style={{
                data: { stroke: "#c43a31", strokeWidth: 2 },
                parent: { border: "1px solid #ccc" }
              }}

              data={this.state.temperatureValues}
              x="x" y="y"
            />
          </VictoryChart>
          <TouchableHighlight
            style={{
              flex: 1, alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Text style={{ color: "white", fontWeight: 'bold', }}>
              TEMPERATURE(&deg;C)
              </Text>
          </TouchableHighlight>
        </View>
        <View style={styles.container}>
          <VictoryChart height={windowHeight / 3} theme={VictoryTheme.material}
            // 
            scale={{ x: "time" }}>
            <VictoryScatter
              style={{ data: { fill: 'green' } }}
              size={4}
              data={this.state.humidityValues}
              x="x" y="y"
            />
            <VictoryLine
              style={{
                data: { stroke: "#c43a31", strokeWidth: 2 },
                parent: { border: "1px solid #ccc" }
              }}
              data={this.state.humidityValues}
              x="x" y="y"
            />
          </VictoryChart>
          <TouchableHighlight
            style={{
              flex: 1, alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Text style={{ color: "white", fontWeight: 'bold', }}>
              HUMIDITY(%)
              </Text>
          </TouchableHighlight>
        </View>

        <View style={styles.buttonContainer}>

          <View style={[styles.buttonView, { alignItems: 'center', backgroundColor: 'dodgerblue' }]}>
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'center',
                justifyContent: 'center'
              }}
            // onPress={() => this.props.navigation.navigate('First')}
            >
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                {/* PREVIOUS SENSOR */}
              </Text>
            </TouchableHighlight>
          </View>

          <View style={[styles.buttonView, { alignItems: 'center', backgroundColor: 'dodgerblue' }]}>
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Button
                title="UPDATE DATA"
                disabled={this.state.isFetching}
                onPress={this.getDataUsingGet}
              />
            </TouchableHighlight>
          </View>

          <View style={[styles.buttonView, { alignItems: 'center', backgroundColor: 'dodgerblue' }]}>
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'center',
                justifyContent: 'center'
              }}
            // onPress={() => this.props.navigation.navigate('Third')}
            >
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                {/* NEXT SENSOR */}
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}

class ThirdScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: '3rd Sensor',
    headerRight: (
      <Button
        onPress={() => navigation.navigate('Home02')}
        title="HOME"
        color="green"
      />
    ),
    headerStyle: {
      backgroundColor: '#1a7da8',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  });
  constructor(props) {
    super(props);
    this.state = {
      temperatureValues: this.props.navigation.dangerouslyGetParent().getParam('temp03', [{ x: 0, y: 0 }, { x: 0, y: 0 }]),
      humidityValues: this.props.navigation.dangerouslyGetParent().getParam('humid03', [{ x: 0, y: 0 }, { x: 0, y: 0 }]),
      isFetching: false
    };
  }

  getDataUsingGet = () => {

    this.setState(
      {
        temperatureValues: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
        humidityValues: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
        isFetching: true
      },
      () => { console.log("Before fetching: " + this.state.isFetching) }
    );
    ToastAndroid.show('Loading data from server! >W<', ToastAndroid.LONG);
    //GET request 
    fetch(global.ThingSpeakURL, {
      method: 'GET'
      //Request Type 
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        //Success 
        console.log(responseJson);
        let tempArray = [];
        let humidArray = [];

        for (let i = 0; i < responseJson.feeds.length; i++) {
          // console.log("FEED");
          let obj = responseJson.feeds[i];
          let dateTimeTemp = obj.created_at;


          /*Create {x: , y: } */
          let temp = new Object();
          let humid = new Object();
          if (obj.field5 != null) {

            temp['y'] = Number(obj.field5);
            temp['x'] = new Date(dateTimeTemp);
            console.log(temp.x);
            tempArray = [...tempArray, temp]

          }
          if (obj.field6 != null) {

            humid['y'] = Number(obj.field6);
            humid['x'] = new Date(dateTimeTemp);
            humidArray = [...humidArray, humid]
          }
        }


        if (tempArray.length > 0) {
          this.setState({
            temperatureValues: tempArray,
          })
        }

        if (humidArray.length > 0) {
          this.setState({
            humidityValues: humidArray,
          })
        }
        this.setState({ isFetching: false }, () => { console.log("After fetching: " + this.state.isFetching) });
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error 
        alert(JSON.stringify(error));
        this.setState({ isFetching: false }, () => { console.log("Error fetching: " + this.state.isFetching) });
        console.error(error);
      });

  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <VictoryChart height={windowHeight / 3} theme={VictoryTheme.material}
            // 
            scale={{ x: "time" }}>
            <VictoryScatter
              style={{ data: { fill: 'green' } }}
              size={4}
              data={this.state.temperatureValues}
              x="x" y="y"
            />
            <VictoryLine
              style={{
                data: { stroke: "#c43a31", strokeWidth: 2 },
                parent: { border: "1px solid #ccc" }
              }}

              data={this.state.temperatureValues}
              x="x" y="y"

            />
          </VictoryChart>
          <TouchableHighlight
            style={{
              flex: 1, alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Text style={{ color: "white", fontWeight: 'bold', }}>
              TEMPERATURE(&deg;C)
              </Text>
          </TouchableHighlight>
        </View>
        <View style={styles.container}>
          <VictoryChart height={windowHeight / 3} theme={VictoryTheme.material}
            // 
            scale={{ x: "time" }}>
            <VictoryScatter
              style={{ data: { fill: 'green' } }}
              size={4}
              data={this.state.humidityValues}
              x="x" y="y"
            />
            <VictoryLine
              style={{
                data: { stroke: "#c43a31", strokeWidth: 2 },
                parent: { border: "1px solid #ccc" }
              }}

              data={this.state.humidityValues}
              x="x" y="y"

            />
          </VictoryChart>
          <TouchableHighlight
            style={{
              flex: 1, alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Text style={{ color: "white", fontWeight: 'bold', }}>
              HUMIDITY(%)
              </Text>
          </TouchableHighlight>
        </View>

        <View style={styles.buttonContainer}>

          <View style={[styles.buttonView, { alignItems: 'center', backgroundColor: 'dodgerblue' }]}>
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'center',
                justifyContent: 'center'
              }}
            // onPress={() => this.props.navigation.navigate('First')}
            >
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                {/* PREVIOUS SENSOR */}
              </Text>
            </TouchableHighlight>
          </View>

          <View style={[styles.buttonView, { alignItems: 'center', backgroundColor: 'dodgerblue' }]}>
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Button
                title="UPDATE DATA"
                disabled={this.state.isFetching}
                onPress={this.getDataUsingGet}
              />
            </TouchableHighlight>
          </View>

          <View style={[styles.buttonView, { alignItems: 'center', backgroundColor: 'dodgerblue' }]}>
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'center',
                justifyContent: 'center'
              }}
            // onPress={() => this.props.navigation.navigate('Third')}
            >
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                {/* NEXT SENSOR */}
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}

class FourthScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: '4th Sensor',
    headerRight: (
      <Button
        onPress={() => navigation.navigate('Home02')}
        title="HOME"
        color="green"
      />
    ),
    headerStyle: {
      backgroundColor: '#1a7da8',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  });
  constructor(props) {
    super(props);
    this.state = {
      temperatureValues: this.props.navigation.dangerouslyGetParent().getParam('temp04', [{ x: 0, y: 0 }, { x: 0, y: 0 }]),
      humidityValues: this.props.navigation.dangerouslyGetParent().getParam('humid04', [{ x: 0, y: 0 }, { x: 0, y: 0 }]),
      isFetching: false
    };
  }

  getDataUsingGet = () => {

    this.setState(
      {
        temperatureValues: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
        humidityValues: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
        isFetching: true
      },
      () => { console.log("Before fetching: " + this.state.isFetching) }
    );
    ToastAndroid.show('Loading data from server! >W<', ToastAndroid.LONG);
    //GET request 
    fetch(global.ThingSpeakURL, {
      method: 'GET'
      //Request Type 
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        //Success 
        console.log(responseJson);
        let tempArray = [];
        let humidArray = [];

        for (let i = 0; i < responseJson.feeds.length; i++) {
          // console.log("FEED");
          let obj = responseJson.feeds[i];
          let dateTimeTemp = obj.created_at;


          /*Create {x: , y: } */
          let temp = new Object();
          let humid = new Object();
          if (obj.field7 != null) {

            temp['y'] = Number(obj.field7);
            temp['x'] = new Date(dateTimeTemp);
            console.log(temp.x);
            tempArray = [...tempArray, temp]

          }
          if (obj.field8 != null) {

            humid['y'] = Number(obj.field8);
            humid['x'] = new Date(dateTimeTemp);
            humidArray = [...humidArray, humid]
          }
        }


        if (tempArray.length > 0) {
          this.setState({
            temperatureValues: tempArray,
          })
        }

        if (humidArray.length > 0) {
          this.setState({
            humidityValues: humidArray,
          })
        }
        this.setState({ isFetching: false }, () => { console.log("After fetching: " + this.state.isFetching) });
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error 
        alert(JSON.stringify(error));
        this.setState({ isFetching: false }, () => { console.log("Error fetching: " + this.state.isFetching) });
        console.error(error);
      });

  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <VictoryChart height={windowHeight / 3} theme={VictoryTheme.material}
            // 
            scale={{ x: "time" }}>
            <VictoryScatter
              style={{ data: { fill: 'green' } }}
              size={4}
              data={this.state.temperatureValues}
              x="x" y="y"
            />
            <VictoryLine
              style={{
                data: { stroke: "#c43a31", strokeWidth: 2 },
                parent: { border: "1px solid #ccc" }
              }}

              data={this.state.temperatureValues}
              x="x" y="y"

            />
          </VictoryChart>
          <TouchableHighlight
            style={{
              flex: 1, alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Text style={{ color: "white", fontWeight: 'bold', }}>
              TEMPERATURE(&deg;C)
              </Text>
          </TouchableHighlight>
        </View>
        <View style={styles.container}>
          <VictoryChart height={windowHeight / 3} theme={VictoryTheme.material}
            // 
            scale={{ x: "time" }}>
            <VictoryScatter
              style={{ data: { fill: 'green' } }}
              size={4}
              data={this.state.humidityValues}
              x="x" y="y"
            />
            <VictoryLine
              style={{
                data: { stroke: "#c43a31", strokeWidth: 2 },
                parent: { border: "1px solid #ccc" }
              }}

              data={this.state.humidityValues}
              x="x" y="y"

            />
          </VictoryChart>
          <TouchableHighlight
            style={{
              flex: 1, alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Text style={{ color: "white", fontWeight: 'bold', }}>
              HUMIDITY(%)
              </Text>
          </TouchableHighlight>
        </View>

        <View style={styles.buttonContainer}>

          <View style={[styles.buttonView, { alignItems: 'center', backgroundColor: 'dodgerblue' }]}>
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'center',
                justifyContent: 'center'
              }}
            // onPress={() => this.props.navigation.navigate('First')}
            >
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                {/* PREVIOUS SENSOR */}
              </Text>
            </TouchableHighlight>
          </View>

          <View style={[styles.buttonView, { alignItems: 'center', backgroundColor: 'dodgerblue' }]}>
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Button
                title="UPDATE DATA"
                disabled={this.state.isFetching}
                onPress={this.getDataUsingGet}
              />
            </TouchableHighlight>
          </View>

          <View style={[styles.buttonView, { alignItems: 'center', backgroundColor: 'dodgerblue' }]}>
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'center',
                justifyContent: 'center'
              }}
              onLongPress={() => this.props.navigation.navigate('Belfast')}
            >
              <Text style={{ color: "white", fontWeight: 'bold', }}>

              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}




class BelfastScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image
          style={{
            width: windowWidth, height: windowHeight
          }}
          source={require('./images/hokusai.jpg')}></Image>

      </View>
    );
  }
}

const SensorScreen = createMaterialTopTabNavigator(
  {
    First: FirstScreen,
    Second: SecondScreen,
    Third: ThirdScreen,
    Fourth: FourthScreen
  }
)


const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Home02: HomeScreen02,
    Belfast: BelfastScreen,
    Sensor: {
      screen: SensorScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Sensor Screen',
        headerRight: (
          <Button
            onPress={() => navigation.navigate('Home02')}
            title="HOME"
            color="green"
          />
        ),
        headerStyle: {
          backgroundColor: '#1a7da8',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })
    }
    // First: FirstScreen,
    // Second: SecondScreen,   
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
    flex: 0.2,
    flexDirection: 'row'
  },

  button: {
    flex: 1
  },

  buttonView: {
    flex: 1,
    flexDirection: 'row'
  }

});