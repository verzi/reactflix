import { StyleSheet } from 'react-native';

import { fontSizeResponsive, height } from '../../../utils/dimensions';

import { white, darkBlue, blue } from '../../../utils/colors';

const styles = StyleSheet.create({
  containerModal: {
    backgroundColor: white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: 450
  },
  containerScroll: {
    padding: 22,
    paddingTop: 0,
    marginTop: 22
  },
  containerPicker: {
    paddingTop: 0,
    marginTop: -10,
    paddingBottom: 0,
    height: 150,
  },
  containerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  photo: {
    borderRadius: 8
  },
  containerMainText: {
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  titleInfo: {
    fontSize: fontSizeResponsive(2.4),
    fontWeight: 'bold',
    color: darkBlue,
    marginBottom: 7
  },
  titleName: {
    fontSize: fontSizeResponsive(2.6),
    fontWeight: 'bold',
    color: darkBlue,
    marginBottom: 10
  },
  textItens: {
    marginLeft: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  textSmall: {
    fontSize: fontSizeResponsive(2.1),
    color: blue
  },
  textJustify: {
    textAlign: 'justify'
  },
  textLineHeight: {
    lineHeight: 20
  },
  containerTitleMargin: {
    marginBottom: 7
  },
  containerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: white,
    borderWidth: 1,
    borderColor: darkBlue,
    paddingVertical: 9.1,
    borderRadius: 100,
    width: '60%'
  },
  icon: {
    fontSize: fontSizeResponsive(2.8)
  },
  textarea: {
    borderWidth: 1,
    height: 100,
  },
  containerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 22
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100
  },
  buttonClose: {
    backgroundColor: white,
    borderWidth: 1,
    borderColor: darkBlue,
    paddingVertical: 9.1,
    flex: 0.23
  },
  buttonSave: {
    backgroundColor: darkBlue,
    borderWidth: 1,
    borderColor: darkBlue,
    flex: 0.67
  },
  buttonText: {
    fontSize: fontSizeResponsive(2.1),
    textAlign: 'center'
  },
  buttonTextSave: {
    color: white,
    fontWeight: 'bold'
  },
  containerSection: {
    marginBottom: 25
  },
  containerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
    paddingHorizontal: 10
  },
  optionSectionTitle: {
    fontSize: fontSizeResponsive(2.4),
    color: darkBlue,
    fontWeight: 'bold',
    width: '100%'
  },
  optionTitle: {
    fontSize: fontSizeResponsive(2.3),
    color: darkBlue,
    width: '80%'
  },
});

export default styles;
