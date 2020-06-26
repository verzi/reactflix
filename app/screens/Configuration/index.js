import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput } from 'react-native';
import Screen from '../../components/common/Screen';
import { TouchableOpacity } from '../../components/common/TouchableOpacity';
import { Switch } from '../../components/common/Switch';

import Spinner from '../../components/common/Spinner';
import NotificationCard from '../../components/cards/NotificationCard';
import request from '../../services/apiBackend';

import styles from './styles';


import useUser from "../../hooks/useUser";

const Configuration = () => {

  const { user, updateUser } = useUser();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(false);

  onChangeUsername = value => {
    setUsername(value);
  };

  onChangePassword = value => {
    setPassword(value);
  };

  const onReset = () => {
    setUsername('');
    setPassword('');
    setIsLoading('');
    setIsError('');
  };

  handleSubmit = async () => {
    if (username && password) {
      try {
        setIsLoading(true);
        const data = await request(`users/login`, {
          username,
          password
        }, "POST");
        setIsLoading(false);
        setIsError(false);
        if (data.error) {
          setIsError(true);
          setError("Los datos ingresados son incorrectos");
        } else {
          updateUser(data);
        }
        console.log(user);
        console.log(data)

      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setIsError(true);
      }
    }
  };

  if (user)
    return (
      <Screen>
        <ScrollView style={styles.bgWhite}>
          <View style={styles.container}>
            {isLoading ? (
              <Spinner style={styles.containerCenter} />
            ) : isError ? (
              <ScrollView style={styles.containerScroll}>
                <NotificationCard icon="alert-octagon" textButton="Reintentar" textError={error} onPress={() => onReset()} />
              </ScrollView>
            ) : (
              <ScrollView style={styles.containerScroll}>
                <View style={styles.section}>
                  <Text>Hola {user.userProfile.firstname}, estos son tus datos.</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Usuario"
                    placeholderTextColor="#828282"
                    returnKeyType="next"
                    onChangeText={value => onChangeUsername(value)}
                    value={username}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#828282"
                    returnKeyType="done"
                    textContentType="newPassword"
                    secureTextEntry
                    onChangeText={value => onChangePassword(value)}
                    value={password}
                  />
                </View>

                <View style={styles.containerButton}>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => handleSubmit()}
                  >
                    <Text style={[styles.buttonText, styles.buttonTextSave]}>
                      Confirmar
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
                )}
          </View>
        </ScrollView>
      </Screen>
    );
  return (
    <Screen>
      <ScrollView style={styles.bgWhite}>
        <View style={styles.container}>
          {isLoading ? (
            <Spinner style={styles.containerCenter} />
          ) : isError ? (
            <ScrollView style={styles.containerScroll}>
              <NotificationCard icon="alert-octagon" textButton="Reintentar" textError={error} onPress={() => onReset()} />
            </ScrollView>
          ) : (
            <ScrollView style={styles.containerScroll}>
              <View style={styles.section}>
                <Text>Ingresa los datos de tu cuenta</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Usuario"
                  placeholderTextColor="#828282"
                  returnKeyType="next"
                  onChangeText={value => onChangeUsername(value)}
                  value={username}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor="#828282"
                  returnKeyType="done"
                  textContentType="newPassword"
                  secureTextEntry
                  onChangeText={value => onChangePassword(value)}
                  value={password}
                />
              </View>

              <View style={styles.containerButton}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => handleSubmit()}
                >
                  <Text style={[styles.buttonText, styles.buttonTextSave]}>
                    Confirmar
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
              )}
        </View>
      </ScrollView>
    </Screen>
  );
};

export default Configuration;
