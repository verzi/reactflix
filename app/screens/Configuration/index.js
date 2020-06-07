import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import Constants from 'expo-constants';
import { Feather } from '@expo/vector-icons';

import { Alert } from '../../components/common/Alert';
import { Share } from '../../components/common/Share';
import Screen from '../../components/common/Screen';
import { TouchableOpacity } from '../../components/common/TouchableOpacity';
import { Switch } from '../../components/common/Switch';

import { getItem, setItem } from '../../utils/asyncStorage';

import { darkBlue } from '../../utils/colors';

import styles from './styles';

const Configuration = () => {
  const [hasAdultContent, setHasAdultContent] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const adultContentStorage = await getItem(
          '@ConfigKey',
          'hasAdultContent'
        );

        setHasAdultContent(adultContentStorage);
      } catch (error) {
        showError();
      }
    })();
  }, [hasAdultContent]);

  showError = () => {
    Alert({
      title: 'Atención',
      description: 'Ups!, ha ocurrido un problema, por favor intenta nuevamente más tarde.'
    });
  };

  handleChangeAdultContent = async value => {
    try {
      setHasAdultContent(value);
      await setItem('@ConfigKey', `{"hasAdultContent": ${value}}`);
    } catch (error) {
      showError();
    }
  };

  handleShare = () => {
    Share({
      message: 'Más información sobre películas y series \u{1F37F}',
      url: 'https://www.themoviedb.org/',
      title: 'Reactflix',
      dialogTitle: 'Más información sobre películas y series \u{1F37F}'
    });
  };

  handleRating = () => {
    Alert({
      title: 'Atención',
      description:
        '¿Te gustó, no?… mínimo nos merecemos un 10 :)'
    });
  };

  return (
    <Screen>
      <ScrollView style={styles.bgWhite}>
        <View style={styles.container}>
          <View style={styles.section}>
            <Text
              style={[styles.itemText, styles.sectionText]}
              numberOfLines={2}
            >
              Interface
            </Text>
            <View style={[styles.item, styles.itemNoBorder]}>
              <Text style={styles.itemText} numberOfLines={2}>
                Incluír contenido para adultos
              </Text>
              <Switch
                value={hasAdultContent}
                onValueChange={handleChangeAdultContent}
              />
            </View>
          </View>
          <View>
            <Text
              style={[styles.itemText, styles.sectionText]}
              numberOfLines={2}
            >
              Application
            </Text>
            <TouchableOpacity onPress={handleShare}>
              <View style={styles.item}>
                <Text style={styles.itemText} numberOfLines={2}>
                  ¡Compartí con tus amigos!
                </Text>
                <Feather
                  name="share"
                  size={22}
                  color={darkBlue}
                  style={styles.icon}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRating}>
              <View style={styles.item}>
                <Text style={styles.itemText} numberOfLines={2}>
                  Calificar esta app
                </Text>
                <Feather
                  name="star"
                  size={22}
                  color={darkBlue}
                  style={styles.icon}
                />
              </View>
            </TouchableOpacity>
            <View style={[styles.item, styles.itemNoBorder]}>
              <Text style={styles.itemTextVersion} numberOfLines={2}>
                Versión {Constants.manifest.version}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default Configuration;
