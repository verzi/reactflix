import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Picker, ActionSheetIOS, Button, TextInput, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

import Spinner from '../../common/Spinner';
import NotificationCard from '../../cards/NotificationCard';
import { Modal } from '../Modal';
import { TouchableOpacity } from '../../common/TouchableOpacity';
import { Alert } from '../../common/Alert';
import { darkBlue } from '../../../utils/colors';
import styles from './styles';

import request from '../../../services/apiBackend';


import useUser from "../../../hooks/useUser";

const UNINFORMED = 'Sin información';

const TextArea = (props) => (
  <TextInput
    {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
    editable
    maxLength={40}
  />
);

const CommentModal = ({ isVisible, MovieId, style, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [haveId, setHaveId] = useState(false);

  const [rating, setRating] = useState(1);
  const [comment, setComment] = React.useState('');

  const { user, updateUser } = useUser();


  useEffect(() => {
    requestCommentInfo();
  }, [MovieId]);

  const requestCommentInfo = async () => {
    try {
      if (MovieId) {
        setIsLoading(true);

        const data = await request(`users/${user.userProfile.id}/movies/${MovieId}/comments`,
          {}, "GET", { "reactflix-access-token": user.token })
        setIsLoading(false);
        setIsError(false);

        if (data.length > 0) {
          setHaveId(data[0]._id);
          setComment(data[0].comment)
          setRating(data[0].rating)
        }

      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setIsError(true);
    }
  };
  const onSave = async () => {

    try {
      if (MovieId) {
        setIsLoading(true);
        if (!haveId) {
          await request(`comments`,
            {
              "movieId": MovieId,
              "comment": comment,
              "user": user.userProfile.id,
              "rating": rating
            }, "POST", { "reactflix-access-token": user.token })

            Alert({
              title: 'Aviso',
              description: 'Comentario agregado con exito'
            });

        } else {
          await request(`comments/${haveId}`,
            {
              "comment": comment,
              "rating": rating
            }, "PUT", { "reactflix-access-token": user.token })

            Alert({
              title: 'Aviso',
              description: 'Comentario actualizado con exito'
            });
        }

        setIsLoading(false);
        setIsError(false);

      }
    } catch (err) {
      console.log(err)
      setIsLoading(false);
      setIsError(true);
    }
  };
  const onPress = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancelar", "1", "2", "3", "4", "5"],
        destructiveButtonIndex: rating,
        cancelButtonIndex: 0
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
        } else {
          setRating(buttonIndex);
        }
      }
    );

  return (
    <Modal isVisible={isVisible} style={style} onClose={onClose}>
      <View style={styles.containerModal}>
        {isLoading ? (
          <Spinner style={styles.containerCenter} />
        ) : isError ? (
          <ScrollView style={styles.containerScroll}>
            <NotificationCard icon="alert-octagon" onPress={requestTeamInfo} />
          </ScrollView>
        ) : (
              <ScrollView style={styles.containerScroll}>
                <Text style={styles.titleInfo}>Rating</Text>
                {Platform.OS === 'ios' ? (
                  <Button onPress={onPress} title="Elegir un rating" />) : (
                    <Picker
                      mode="disalog"
                      selectedValue={rating}
                      style={{ height: 30, width: 150 }}
                      onValueChange={(itemValue, itemIndex) => setRating(itemValue)}
                    >
                      <Picker.Item label="1" value="1" />
                      <Picker.Item label="2" value="2" />
                      <Picker.Item label="3" value="3" />
                      <Picker.Item label="4" value="4" />
                      <Picker.Item label="5" value="5" />
                    </Picker>)}
                <Text style={styles.titleInfo}>Comentario</Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 3,
                    borderColor: "#ddd",
                    padding: 5,
                    height: 80
                  }}>
                  <TextArea
                    multiline
                    numberOfLines={2}
                    onChangeText={text => setComment(text)}
                    value={comment}
                  />
                </View>
              </ScrollView>
            )}
        <View style={styles.containerButton}>
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={onClose}
          >
            <Feather
              name="chevron-down"
              size={styles.icon.fontSize}
              color={darkBlue}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonSave]}
            onPress={() => onSave()}
          >
            <Text style={[styles.buttonText, styles.buttonTextSave]}>
              Aplicar
            </Text>
          </TouchableOpacity>
        </View>


      </View>
    </Modal >
  );
};

export default CommentModal;
