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

import NetInfo from "@react-native-community/netinfo";
import Moment from 'moment';
import PureChart from 'react-native-pure-chart';

let windowWidth = Dimensions.get('window').width;
let windowHeight = Dimensions.get('window').height;

class HomeScreen extends React.Component {
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
    state = {
      myState: true,
      data: '',
      isConnected: false
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

  render() {
    return (
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#1c87ce",
        flexDirection: 'column'
      }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: windowWidth, borderWidth: 3, borderColor: '#0a2059', borderStyle: 'solid', backgroundColor: 'gold' }}>
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
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: windowWidth, backgroundColor: 'black' }}>
          <Text style={{
            flex: 0.5,
            color: 'white',
            fontWeight: 'bold',
            fontSize: 23,
            textAlign: "center"
          }}>
            CHỌN SENSOR MUỐN XEM {"\n"}
            (cần kết nối Internet)
              </Text>
        </View>

        <View style={{
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
              onPress={() => this.props.navigation.navigate('First')}
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
              onPress={() => this.props.navigation.navigate('Second')}
            >
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                2ND SENSOR
              </Text>
            </TouchableHighlight>
          </View>
        </View>

        <View style={{
          flex: 0.5,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}>

          <View style={{ flex: 1, backgroundColor: 'yellow', borderWidth: 3, borderColor: 'black' }}>
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
          </View>

          <View style={{ flex: 1, backgroundColor: 'yellow', borderWidth: 3, borderColor: 'black' }}>
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={() => this.props.navigation.navigate('Fourth')}
            >
              <Text style={{ color: "black", fontWeight: 'bold', }}>
                4TH SENSOR
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
        onPress={() => navigation.navigate('Home')}
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
      temperatureValues: [0],
      humidityValues: [0],
      isFetching: false
    };

  }

  getDataUsingGet = () => {
    this.setState({ isFetching: true }, () => { console.log("Before fetching: " + this.state.isFetching) });
    ToastAndroid.show('Loading...', ToastAndroid.LONG);
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

        for (let i = 0; i < responseJson.feeds.length; i++) {
          // console.log("FEED");
          let obj = responseJson.feeds[i];
          let dateTimeTemp = obj.created_at;


          /*Create {x: , y: } */
          let temp = new Object();
          let humid = new Object();
          if (obj.field1 != null) {

            temp['y'] = Number(obj.field1);
            temp['x'] = Moment(dateTimeTemp).format("DD/MM HH:mm:ss");
            console.log(temp.x);
            this.setState({
              temperatureValues: [...this.state.temperatureValues, temp]
            })
          }
          if (obj.field2 != null) {

            humid['y'] = Number(obj.field2);
            humid['x'] = Moment(dateTimeTemp).format("DD/MM HH:mm:ss");
            this.setState({
              humidityValues: [...this.state.humidityValues, humid]
            })
          }
        }

        /*Check if length of data equals to 0 then set value 0 to chart so that the chart can be display */
        if (!this.state.temperatureValues.length) {
          this.setState({
            temperatureValues: [0]
          })
        }
        if (!this.state.humidityValues.length) {
          this.setState({
            humidityValues: [0]
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
        alert(JSON.stringify(error));
        this.setState({ isFetching: false }, () => { console.log("After fetching: " + this.state.isFetching) });
        console.error(error);
      });
  };

  render() {
    const { navigation } = this.props.navigation;

    return (
      <View style={{ flex: 1, backgroundColor: 'dodgerblue' }}>
        <View style={styles.container}>
          <View style={{ flex:9, backgroundColor: 'deepskyblue', borderWidth: 3, borderColor: 'green' }}>
            <PureChart
              style={{ flex: 8 }}
              showEvenNumberXaxisLabel={false}
              xAxisColor={'black'}
              yAxisColor={'black'}
              xAxisGridLineColor={'blue'}
              yAxisGridLineColor={'red'}
              data={this.state.temperatureValues}
              type='line' />
            <TouchableHighlight
              style={{
                flex: 1,
                alignItems: 'flex-start',
                justifyContent: 'center'
              }}>
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                TEMPERATURE(&deg;C)
              </Text>
            </TouchableHighlight>
          </View>
          <View style={{ flex: 1, backgroundColor: 'black', borderWidth: 3, borderColor: 'orange' }}>

          </View>
        </View>

        <View style={styles.container}>
          <View style={{ flex: 9, backgroundColor: 'deepskyblue', borderWidth: 3, borderColor: 'green' }}>
            <PureChart
              style={{ flex: 8 }}
              showEvenNumberXaxisLabel={false}
              xAxisColor={'black'}
              yAxisColor={'black'}
              xAxisGridLineColor={'blue'}
              yAxisGridLineColor={'red'}
              data={this.state.humidityValues}
              type='line' />
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'flex-start',
                justifyContent: 'center'
              }}>
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                HUMIDITY(%)
              </Text>
            </TouchableHighlight>
          </View>
          <View style={{ flex: 1, backgroundColor: 'black', borderWidth: 3, borderColor: 'orange' }}>

          </View>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonView}>
            {/* <Button
              style={styles.button} 
              title="PREVIOUS SENSOR"
              onPress={this.getDataUsingGet}
              /> */}
          </View>
          <View style={[styles.buttonView, { alignItems: 'center', backgroundColor: 'dodgerblue' }]}>
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Button
                title="LOAD DATA"
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
              onPress={() => this.props.navigation.navigate('Second')}
            >
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                NEXT SENSOR
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
        onPress={() => navigation.navigate('Home')}
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
      temperatureValues: [0],
      humidityValues: [0],
      isFetching: false
    };
  }
  getDataUsingGet = () => {

    this.setState({ isFetching: true }, () => { console.log("Before fetching: " + this.state.isFetching) });
    ToastAndroid.show('Loading data from server! >W<', ToastAndroid.LONG);
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
        for (let i = 0; i < responseJson.feeds.length; i++) {
          // console.log("FEED");
          let obj = responseJson.feeds[i];
          // console.log(obj);
          // console.log(obj.field1);   
          // console.log(obj.field2); 
          let dateTimeTemp = obj.created_at;

          /*Create {x: , y: } */
          let temp = new Object();
          let humid = new Object();
          if (obj.field3 != null) {
            temp['y'] = Number(obj.field3);
            temp['x'] = Moment(dateTimeTemp).format("DD/MM HH:mm:ss");
            this.setState({
              temperatureValues: [...this.state.temperatureValues, temp]
            })
          }
          if (obj.field4 != null) {
            humid['y'] = Number(obj.field4);
            humid['x'] = Moment(dateTimeTemp).format("DD/MM HH:mm:ss");
            this.setState({
              humidityValues: [...this.state.humidityValues, humid]
            })
          }
        }

        /*Check if length of data equals to 0 then set value 0 to chart so that the chart can be display */
        if (!this.state.temperatureValues.length) {
          this.setState({
            temperatureValues: [0]
          })
        }
        if (!this.state.humidityValues.length) {
          this.setState({
            humidityValues: [0]
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
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={{ flex: 9, backgroundColor: 'deepskyblue', borderWidth: 3, borderColor: 'green' }}>
            <PureChart
              style={{ flex: 8 }}
              showEvenNumberXaxisLabel={false}
              xAxisColor={'black'}
              yAxisColor={'black'}
              xAxisGridLineColor={'blue'}
              yAxisGridLineColor={'red'}
              data={this.state.temperatureValues}
              type='line' />
            <TouchableHighlight
              style={{
                flex: 1,
                alignItems: 'flex-start',
                justifyContent: 'center'
              }}>
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                TEMPERATURE(&deg;C)
              </Text>
            </TouchableHighlight>
          </View>
          <View style={{ flex: 1, backgroundColor: 'black', borderWidth: 3, borderColor: 'orange' }}>

          </View>
        </View>

        <View style={styles.container}>
          <View style={{ flex: 9, backgroundColor: 'deepskyblue', borderWidth: 3, borderColor: 'green' }}>
            <PureChart
              style={{ flex: 8 }}
              showEvenNumberXaxisLabel={false}
              xAxisColor={'black'}
              yAxisColor={'black'}
              xAxisGridLineColor={'blue'}
              yAxisGridLineColor={'red'}
              data={this.state.humidityValues}
              type='line' />
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'flex-start',
                justifyContent: 'center'
              }}>
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                HUMIDITY(%)
              </Text>
            </TouchableHighlight>
          </View>
          <View style={{ flex: 1, backgroundColor: 'black', borderWidth: 3, borderColor: 'orange' }}>

          </View>
        </View>

        <View style={styles.buttonContainer}>

          <View style={[styles.buttonView, { alignItems: 'center', backgroundColor: 'dodgerblue' }]}>
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={() => this.props.navigation.navigate('First')}
            >
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                PREVIOUS SENSOR
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
                title="LOAD DATA"
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
              onPress={() => this.props.navigation.navigate('Third')}
            >
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                NEXT SENSOR
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
        onPress={() => navigation.navigate('Home')}
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
      temperatureValues: [0],
      humidityValues: [0],
      isFetching: false
    };
  }

  getDataUsingGet = () => {

    this.setState({ isFetching: true }, () => { console.log("Before fetching: " + this.state.isFetching) });
    ToastAndroid.show('Loading data from server! >W<', ToastAndroid.LONG);
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
        for (let i = 0; i < responseJson.feeds.length; i++) {
          // console.log("FEED");
          let obj = responseJson.feeds[i];
          // console.log(obj);
          // console.log(obj.field1);   
          // console.log(obj.field2); 
          let dateTimeTemp = obj.created_at;

          /*Create {x: , y: } */
          let temp = new Object();
          let humid = new Object();
          if (obj.field5 != null) {
            temp['y'] = Number(obj.field5);
            temp['x'] = Moment(dateTimeTemp).format("DD/MM HH:mm:ss");
            this.setState({
              temperatureValues: [...this.state.temperatureValues, temp]
            })
          }
          if (obj.field6 != null) {
            humid['y'] = Number(obj.field6);
            humid['x'] = Moment(dateTimeTemp).format("DD/MM HH:mm:ss");
            this.setState({
              humidityValues: [...this.state.humidityValues, humid]
            })
          }
        }

        /*Check if length of data equals to 0 then set value 0 to chart so that the chart can be display */
        if (!this.state.temperatureValues.length) {
          this.setState({
            temperatureValues: [0]
          })
        }
        if (!this.state.humidityValues.length) {
          this.setState({
            humidityValues: [0]
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

  // updateValue = () => {this.setState(
  //       {values: [{y: 7}, {y: 12}, {y: 8}]}
  //     )}    
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={{ flex: 9, backgroundColor: 'deepskyblue', borderWidth: 3, borderColor: 'green' }}>
            <PureChart
              style={{ flex: 8 }}
              showEvenNumberXaxisLabel={false}
              xAxisColor={'black'}
              yAxisColor={'black'}
              xAxisGridLineColor={'blue'}
              yAxisGridLineColor={'red'}
              data={this.state.temperatureValues}
              type='line' />
            <TouchableHighlight
              style={{
                flex: 1,
                alignItems: 'flex-start',
                justifyContent: 'center'
              }}>
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                TEMPERATURE(&deg;C)
              </Text>
            </TouchableHighlight>
          </View>
          <View style={{ flex: 1, backgroundColor: 'black', borderWidth: 3, borderColor: 'orange' }}>
          </View>
        </View>

        <View style={styles.container}>
          <View style={{ flex: 9, backgroundColor: 'deepskyblue', borderWidth: 3, borderColor: 'green' }}>
            <PureChart
              style={{ flex: 8 }}
              showEvenNumberXaxisLabel={false}
              xAxisColor={'black'}
              yAxisColor={'black'}
              xAxisGridLineColor={'blue'}
              yAxisGridLineColor={'red'}
              data={this.state.humidityValues}
              type='line' />
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'flex-start',
                justifyContent: 'center'
              }}>
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                HUMIDITY(%)
              </Text>
            </TouchableHighlight>
          </View>
          <View style={{ flex: 1, backgroundColor: 'black', borderWidth: 3, borderColor: 'orange' }}>

          </View>
        </View>

        <View style={styles.buttonContainer}>

          <View style={[styles.buttonView, { alignItems: 'center', backgroundColor: 'dodgerblue' }]}>
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={() => this.props.navigation.navigate('Second')}
            >
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                PREVIOUS SENSOR
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
                title="LOAD DATA"
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
              onPress={() => this.props.navigation.navigate('Fourth')}
            >
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                NEXT SENSOR
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
        onPress={() => navigation.navigate('Home')}
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
      temperatureValues: [0],
      humidityValues: [0],
      isFetching: false
    };
  }
  getDataUsingGet = () => {

    this.setState({ isFetching: true }, () => { console.log("Before fetching: " + this.state.isFetching) });
    ToastAndroid.show('Loading data from server! >W<', ToastAndroid.LONG);
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
        for (let i = 0; i < responseJson.feeds.length; i++) {
          // console.log("FEED");
          let obj = responseJson.feeds[i];
          // console.log(obj);
          // console.log(obj.field1);   
          // console.log(obj.field2); 
          let dateTimeTemp = obj.created_at;

          /*Create {x: , y: } */
          let temp = new Object();
          let humid = new Object();
          if (obj.field7 != null) {
            temp['y'] = Number(obj.field7);
            temp['x'] = Moment(dateTimeTemp).format("DD/MM HH:mm:ss");
            this.setState({
              temperatureValues: [...this.state.temperatureValues, temp]
            })
          }
          if (obj.field8 != null) {
            humid['y'] = Number(obj.field8);
            humid['x'] = Moment(dateTimeTemp).format("DD/MM HH:mm:ss");
            this.setState({
              humidityValues: [...this.state.humidityValues, humid]
            })
          }
        }

        /*Check if length of data equals to 0 then set value 0 to chart so that the chart can be display */
        if (!this.state.temperatureValues.length) {
          this.setState({
            temperatureValues: [0]
          })
        }
        if (!this.state.humidityValues.length) {
          this.setState({
            humidityValues: [0]
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
    return (
      <View style={{ flex: 1, backgroundColor: 'dodgerblue' }}>
        <View style={styles.container}>
          <View style={{ flex: 9, backgroundColor: 'deepskyblue', borderWidth: 3, borderColor: 'green' }}>
            <PureChart
              style={{ flex: 8 }}
              showEvenNumberXaxisLabel={false}
              xAxisColor={'black'}
              yAxisColor={'black'}
              xAxisGridLineColor={'blue'}
              yAxisGridLineColor={'red'}
              data={this.state.temperatureValues}
              type='line' />
            <TouchableHighlight
              style={{
                flex: 1,
                alignItems: 'flex-start',
                justifyContent: 'center'
              }}>
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                TEMPERATURE(&deg;C)
              </Text>
            </TouchableHighlight>
          </View>
          <View style={{ flex: 1, backgroundColor: 'black', borderWidth: 3, borderColor: 'orange' }}>

          </View>
        </View>

        <View style={styles.container}>
          <View style={{ flex: 9, backgroundColor: 'deepskyblue', borderWidth: 3, borderColor: 'green' }}>
            <PureChart
              style={{ flex: 8 }}
              showEvenNumberXaxisLabel={false}
              xAxisColor={'black'}
              yAxisColor={'black'}
              xAxisGridLineColor={'blue'}
              yAxisGridLineColor={'red'}
              data={this.state.humidityValues}
              type='line' />
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'flex-start',
                justifyContent: 'center'
              }}>
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                HUMIDITY(%)
              </Text>
            </TouchableHighlight>
          </View>
          <View style={{ flex: 1, backgroundColor: 'black', borderWidth: 3, borderColor: 'orange' }}>
          </View>
        </View>

        <View style={styles.buttonContainer}>

          <View style={[styles.buttonView, { alignItems: 'center', backgroundColor: 'dodgerblue' }]}>
            <TouchableHighlight
              style={{
                flex: 1, alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={() => this.props.navigation.navigate('Third')}
            >
              <Text style={{ color: "white", fontWeight: 'bold', }}>
                PREVIOUS SENSOR
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
                title="LOAD DATA"
                disabled={this.state.isFetching}
                onPress={this.getDataUsingGet}
              />
            </TouchableHighlight>
          </View>
          
          <View style={[styles.buttonView, { alignItems: 'center' }]}>
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



const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    First: FirstScreen,
    Second: SecondScreen,
    Belfast: BelfastScreen,
    Third: ThirdScreen,
    Fourth: FourthScreen
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