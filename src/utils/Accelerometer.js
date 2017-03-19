import { DeviceEventEmitter } from 'react-native'
import { SensorManager } from 'NativeModules'

export function bindAccelerometerLoop(callback) {
	DeviceEventEmitter.addListener('Accelerometer', callback)
}

export function startAccelerometer(ms) {
	SensorManager.startAccelerometer(ms)
}

export function stopAccelerometer() {
	SensorManager.stopAccelerometer()
}

export function getAverageAcceleration(samples) {
	return (samples.reduce((prevSample,currSample) => prevSample + currSample) / 30)
}

export function getAverageSpeed(averageAcceleration , ellapsedMilliseconds){
	const secondsEllapsed = ellapsedMilliseconds / 1000
	return averageAcceleration * secondsEllapsed
}