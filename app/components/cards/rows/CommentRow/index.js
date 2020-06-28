import React, { memo } from 'react';
import { View, Text, Image } from 'react-native';

import styles from './styles';
import {timeDifference} from '../../../../utils/dates'

const uninformed = 'Sin información';


const CommentRow = memo(
  ({item}) => (
    <View style={styles.container}>
      <Text numberOfLines={2} style={styles.heading}>
      Usuario  {item && item.user && item.user.username || uninformed} comento hace {timeDifference(new Date(),new Date(item.creationDatetime))}
      </Text>
      <Text style={styles.comment}>{item.comment}</Text>
      <Text style={styles.rating}>Calificado con {item.rating} estrellas</Text>
    </View>
  ),
  (prevProps, nextProps) => prevProps.item._id === nextProps.item._id 

);

export default CommentRow;
