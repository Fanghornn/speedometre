import React, { Component } from 'react'
import { View } from 'react-native'

import Button from '../ButtonAndroid'
import styles from './FooterAndroidStyles'

export default class FooterAndroid extends Component {

	render() {

		const { bootPress, resetPress, logPress, disableBootButton } = this.props

    const bootButtonStyles = disableBootButton
      ? [styles.footerBtn, styles.disabledBtn]
      : styles.footerBtn

		return (
			<View style={styles.footer}>
				<Button
					onPress={bootPress}
					disabled={disableBootButton}
					style={bootButtonStyles}
					text="Démarrer"
				/>

				<Button
					onPress={logPress}
					style={styles.footerBtn}
					text="Log"
				/>

				<Button
					onPress={resetPress}
					style={styles.footerBtn}
					text="Stopper"
				/>
			</View>
		)
	}
}