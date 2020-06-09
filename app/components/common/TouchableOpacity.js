import React from 'react';
import { TouchableOpacity } from 'react-native';

const TouchableOpacityCustom = ({
  activeOpacity = 0.5,
  style = {},
  onPress = () => null,
  onLongPress = () => null,
  children = null
}) => (
  <TouchableOpacity
    activeOpacity={activeOpacity}
    style={style}
    onPress={onPress}
    onLongPress={onLongPress}
  >
    {children}
  </TouchableOpacity>
);

export { TouchableOpacityCustom as TouchableOpacity };
