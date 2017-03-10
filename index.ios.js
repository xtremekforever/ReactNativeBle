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
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
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
    noble.on('discover', this._onDiscover.bind(this));

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

  _onDiscover(peripheral) {
    console.log('peripheral discovered (' + peripheral.id +
                ' with address <' + peripheral.address +  ', ' + peripheral.addressType + '>,' +
                ' connectable ' + peripheral.connectable + ',' +
                ' RSSI ' + peripheral.rssi + ':');
    console.log('\thello my local name is:');
    console.log('\t\t' + peripheral.advertisement.localName);

    if (peripheral.advertisement.manufacturerData) {
      console.log('\there is my manufacturer data:');
      console.log('\t\t' + JSON.stringify(peripheral.advertisement.manufacturerData.toString('hex')));
    }

    if (peripheral.advertisement.localName) {
      var devices = this.state.bleDevices;
      //if (devices.indexOf(peripheral.advertisement.localName) != -1) {
        devices.push(peripheral.advertisement.localName + "(" + peripheral.rssi + ")");
      //}

      this.setState({
        bleDevices: devices,
        mainDataSource: this.state.mainDataSource.cloneWithRows(devices)
      });
    }

    console.log();
  };
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
