import React, { Component } from 'react'
import {
  Text,
  View,
  Button,
  TextInput
} from 'react-native'

import FooterAndroid from './components/footer/FooterAndroid'
import styles from './MainViewStyles'

import { 
  bindAccelerometerLoop, 
  getAverageAcceleration,
  getAverageSpeed,
  startAccelerometer,
  stopAccelerometer
} from './utils/Accelerometer'

export default class MainViewAndroid extends Component {

  constructor() {

    super()

    bindAccelerometerLoop(this.sensorsLoop)

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

    if (active && accelerationHasBegun && ellapsedMilliseconds % 100 !== 0) {
      return false
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

    const { accelerationHasBegun, accelerationSamples, ellapsedMilliseconds } = this.state

    if (!accelerationHasBegun && !accelerationSamples) {

      this.setState({
        ellapsedMilliseconds: 10,
        accelerationSamples: [acceleration]
      })

    } else {
      this.computeCurrentSpeed()
    }
  }

  computeCurrentSpeed = () => {
    const { speedToReach, accelerationHasBegun, accelerationSamples, ellapsedMilliseconds } = this.state

    const newAccelerationSamples = accelerationSamples.length === 30
      ? [...accelerationSamples.slice(1), acceleration]
      : [...accelerationSamples, acceleration]

    const currentEllapsedMilliseconds = ellapsedMilliseconds + 10 

    const averageAcceleration = getAverageAcceleration(newAccelerationSamples)

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
      
      const averageSpeed = getAverageSpeed(averageAcceleration, currentEllapsedMilliseconds)

      if (averageSpeed > speedToReach) {

        stopAccelerometer();

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


  render() {
    const { speedInput, speedToReach, active, ellapsedMilliseconds, accelerationHasBegun, result } = this.state

    const disableBootButton = !speedToReach || active

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
        <FooterAndroid
          bootPress={this.onBootPress}
          resetPress={this.onResetPress}
          disableBootButton={disableBootButton}
          log={this.log}
        />
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
    stopAccelerometer()
    this.resetCounter()
  }

  startSensors = () => {

    startAccelerometer(10)

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