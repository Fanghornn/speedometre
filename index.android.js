import React, { Component } from 'react'
import {
  AppRegistry
} from 'react-native'

import MainViewAndroid from './src/MainViewAndroid'

export default class acceleration extends Component {

  render() {
    return (
      <MainViewAndroid/>
    )
  }

}

AppRegistry.registerComponent('acceleration', () => acceleration)