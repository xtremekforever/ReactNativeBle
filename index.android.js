/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  Button,
  ListView,
  StyleSheet,
  Text,
  View
} from 'react-native';

var noble = require('react-native-ble');

export default class ReactNativeBle extends Component {
  constructor() {
    super()

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      scanText: 'Initializing...',
      buttonText: "Turn ON",
      bleDevices: [],
      mainDataSource: ds
    }
  }

  render() {
    /*return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Double tap R on your keyboard to reload,{'\n'}
          Shake or press menu button for dev menu
        </Text>
      </View>
    );*/
    return (
      <View style={styles.container}>
        <Text style={styles.instructions}>
          {this.state.scanText}
        </Text>
        <View style={styles.devices}>
          <ListView dataSource={this.state.mainDataSource} renderRow={(rowData) => <Text onPress={this.onDevicePressed.bind(this, rowData)} style={styles.deviceRow}>{rowData}</Text>}/>
        </View>
        <Button onPress={this.onButtonPress} title={this.state.buttonText} color="#841584"/>
      </View>
    );
  }

  onButtonPress = () => {
    Alert.alert('Button has been pressed!');
  };

  onDevicePressed = (device) => {
    Alert.alert('Device pressed: ' + device);
  };

  componentWillMount() {
    noble.on('stateChange', this._onStateChange.bind(this));
    //noble.on('discover', this._onDiscover.bind(this));

    this.setState({scanText: "Waiting for poweredOn event..."});
  }

  _onStateChange(state) {
    if (state === 'poweredOn') {
      noble.startScanning();
      this.setState({scanText: "Scanning for devices.."});
    } else {
      noble.stopScanning();
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  devices: {
    height: "25%",
    width: "70%",
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    margin: 10
  },
  deviceRow: {
    textAlign: 'center',
    padding: 5
  }
});

AppRegistry.registerComponent('ReactNativeBle', () => ReactNativeBle);
