import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { TouchableOpacity } from '../../common/TouchableOpacity';

import { width } from '../../../utils/dimensions';

import { darkBlue } from '../../../utils/colors';

import styles from './styles';

const NotificationCard = ({
  style = styles.containerError,
  icon = 'alert-octagon',
  textError = 'Ups!, ha ocurrido un problema, por favor intenta nuevamente más tarde.',
  textButton = 'Cargar',
  onPress = null
}) => (
  <View style={style}>
    <Feather name={icon} size={width * 0.2} color={darkBlue} />
    <Text style={styles.errorInfo}>{textError}</Text>
    {onPress && (
      <TouchableOpacity style={styles.loadingButton} onPress={onPress}>
        <Text style={styles.loadingText}>{textButton}</Text>
      </TouchableOpacity>
    )}
  </View>
);

export default NotificationCard;
