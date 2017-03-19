import { StyleSheet } from 'react-native'

export default StyleSheet.create({
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