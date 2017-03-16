/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  PermissionsAndroid,
  DeviceEventEmitter,
  TouchableOpacity,
  TextInput
} from 'react-native'

import { SensorManager } from 'NativeModules'

export default class acceleration extends Component {

  constructor() {

    super()

    DeviceEventEmitter.addListener('Accelerometer', this.sensorsLoop)

    this.state = {
      speedInput: null,
      speedToReach: null,
      ellapsedMilliseconds: 0,
      active: false,
      accelerationHasBegun: false,
      accelerationSamples: null,
      result: null
    }
  }

  shouldComponentUpdate(_, nextState) {
    const { ellapsedMilliseconds, active, accelerationHasBegun } = nextState

    if (active && accelerationHasBegun) {
      if (ellapsedMilliseconds % 100 === 0) {
        return true
      } else {
        return false
      }
    }

    return true
  }

  sensorsLoop = (points) => {
    const { active } = this.state
    const { z } = points

    if (active) {
      this.readAcceleration(z)
    }
  }

  readAcceleration = (acceleration) => {
    const { accelerationHasBegun, accelerationSamples, ellapsedMilliseconds, speedToReach } = this.state

    if (!accelerationHasBegun && !accelerationSamples) {

      this.setState({
        ellapsedMilliseconds: 10,
        accelerationSamples: [acceleration]
      })

    } else {

      const newAccelerationSamples = accelerationSamples.length === 30
        ? [...accelerationSamples.slice(1), acceleration]
        : [...accelerationSamples, acceleration]

      const currentEllapsedMilliseconds = ellapsedMilliseconds + 10 

      const averageAcceleration = this.getAverageAcceleration(newAccelerationSamples)

      if (!accelerationHasBegun) {

        const didAccelerationBegun = (averageAcceleration > 0.6)

        const newEllapsedMilliseconds = didAccelerationBegun
          ? 0
          : currentEllapsedMilliseconds

        this.setState({
          ellapsedMilliseconds: newEllapsedMilliseconds,
          accelerationHasBegun: didAccelerationBegun,
          accelerationSamples: newAccelerationSamples
        })

      } else {
        
        const averageSpeed = this.getAverageSpeed(averageAcceleration, currentEllapsedMilliseconds)

        if (averageSpeed > speedToReach) {

          SensorManager.stopAccelerometer();

          this.setState({
            active: false,
            accelerationHasBegun: false,
            accelerationSamples: null,
            ellapsedMilliseconds: currentEllapsedMilliseconds,
            result: averageSpeed
          })

        } else {

          this.setState({
            ellapsedMilliseconds: currentEllapsedMilliseconds,
            accelerationSamples: newAccelerationSamples
          })
        }
      }
    }
  }

  getAverageAcceleration = (samples) => {
    return (samples.reduce((prevSample,currSample) => prevSample + currSample) / 30)
  }

  getAverageSpeed = (averageAcceleration , ellapsedMilliseconds) => {
    const secondsEllapsed = ellapsedMilliseconds / 1000

    return averageAcceleration * secondsEllapsed
  }

  render() {
    const { speedInput, speedToReach, active, ellapsedMilliseconds, accelerationHasBegun, result } = this.state

    const disableBootButton = !speedToReach || active

    const bootButtonStyles = disableBootButton
      ? [styles.footerBtn, styles.disabledBtn]
      : styles.footerBtn

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Détecteur de vitesse
        </Text>

        <Text style={styles.speedDisclaimer}>
          Indiquez la vitesse que vous souhaitez atteindre
        </Text>

        <View style={styles.speedInputContainer}>
          {speedInput === null ? (
            <TextInput
              style={styles.speedInput}
              defaultValue={"0"}
              onChangeText={this.onChangeSpeed}
              editable={!active}
              onBlur={this.onBlurSpeed}
            />
          ) : ( 
            <TextInput
              style={styles.speedInput}
              value={speedInput.toString()}
              onChangeText={this.onChangeSpeed}
              editable={!active}
              onBlur={this.onBlurSpeed}
            />
          )}
          <Text style={styles.speedUnit}>
            Km/h
          </Text>
        </View>
        <View style={styles.resultContainer}>
          {(accelerationHasBegun || result) && (
            <Text style={styles.resultText}>
              { `${this.getEllapsedSeconds()} secondes` }
            </Text>
          )}
        </View>
        <View style={styles.footer}>
          <TouchableOpacity onPress={this.onBootPress}>
            <Text
              style={bootButtonStyles}
              disabled={disableBootButton}
            >
              Démarrer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.log}>
            <Text
              style={styles.footerBtn}
            >
              log
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onResetPress}>
            <Text 
              style={styles.footerBtn}
            >
              Stopper
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  onChangeSpeed = (speedInput) => {
    this.setState({
      speedInput
    })
  }

  onBlurSpeed = () => {
    const { speedInput } = this.state
    
    if (isNaN(+speedInput)) {
      this.setState({
        speedInput: null,
        speedToReach: null
      })
    } else {
      this.setState({
        speedInput: +speedInput,
        speedToReach: Number(Number(+speedInput / 3.6).toFixed(1))
      })
    }
  }

  onBootPress = () => {
    this.resetCounter()
    this.startSensors()
  }

  onResetPress = () => {
    SensorManager.stopAccelerometer()
    this.resetCounter()
  }

  startSensors = () => {

    SensorManager.startAccelerometer(10)

    this.setState({
      active: true  
    })
  }

  resetCounter = () => {
    this.setState({
      ellapsedMilliseconds: 0,
      active: false,
      accelerationHasBegun: false,
      accelerationSamples: null,
      result: null
    })
  }

  getEllapsedSeconds = () => {
    const { ellapsedMilliseconds } = this.state

    return (ellapsedMilliseconds / 1000).toFixed(1)
  }

  log = () => {
    console.log(this.state)
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#151515',
  },
  welcome: {
    fontSize: 40,
    textAlign: 'center',
    color: '#1565C0',
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 30
  },
  speedDisclaimer: {
    fontSize: 25,
    textAlign: 'center',
    color: '#1976D2',
    marginBottom: 30,
    marginLeft: 10,
    marginRight: 10
  },
  speedInputContainer: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  speedInput: {
    backgroundColor: '#202020',
    color: '#1976D2',
    borderRadius: 3,
    fontSize: 17,
    width: 100
  },
  speedUnit: {
    color: '#2196F3',
    fontSize: 20,
    margin: 10
  },
  resultContainer: {
    flex: 1
  },
  resultText: {
    fontSize: 30,
    color: '#2196F3'
  },
  footer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginBottom:30
  },
  footerBtn: {
    backgroundColor: '#2196F3',
    borderRadius: 3,
    fontSize: 25,
    padding: 15
  },
  disabledBtn: {
    backgroundColor: 'grey'
  }
})

AppRegistry.registerComponent('acceleration', () => acceleration)