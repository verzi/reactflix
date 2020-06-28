import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput } from 'react-native';
import Screen from '../../components/common/Screen';
import { TouchableOpacity } from '../../components/common/TouchableOpacity';
import { Switch } from '../../components/common/Switch';

import { ROUTES } from '../../navigation/routes';

import Spinner from '../../components/common/Spinner';
import NotificationCard from '../../components/cards/NotificationCard';
import request from '../../services/apiBackend';

import styles from './styles';


import useUser from "../../hooks/useUser";



const SignUp = ({ navigation }) => {
  const { navigate } = navigation;
  const { user, updateUser } = useUser();

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(false);

  const onChangeFirstame = value => {
    setFirstname(value);
  };
  const onChangeLastname = value => {
    setLastname(value);
  };
  const onChangeEmail = value => {
    setEmail(value);
  };
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
        const data = await request(`users`, {
          firstname,
          lastname,
          email,
          username,
          password
        }, "POST");
        setIsLoading(false);
        setIsError(false);
        if (data.error || data.errors) {
         
          setIsError(true);
          setError(data.message);
        } else {
          updateUser(data);
          navigate(ROUTES.PROFILE);
        }
      } catch (err) {
        setIsLoading(false);
        setIsError(true);
      }
    }
  };

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
                <Text>Ingresa los datos de tu nueva cuenta</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre"
                  placeholderTextColor="#828282"
                  returnKeyType="next"
                  onChangeText={value => onChangeFirstame(value)}
                  value={firstname}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Apellido"
                  placeholderTextColor="#828282"
                  returnKeyType="next"
                  onChangeText={value => onChangeLastname(value)}
                  value={lastname}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#828282"
                  returnKeyType="next"
                  onChangeText={value => onChangeEmail(value)}
                  value={email}
                />
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
}

SignUp.navigationOptions = ({ navigation }) => {
  return {
    title: 'Registro'
  };
};

export default SignUp;
