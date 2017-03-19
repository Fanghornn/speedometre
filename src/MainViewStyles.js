import { StyleSheet } from 'react-native'

export default StyleSheet.create({
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
  }
})