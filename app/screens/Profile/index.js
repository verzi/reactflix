import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput } from 'react-native';
import Screen from '../../components/common/Screen';
import { TouchableOpacity } from '../../components/common/TouchableOpacity';
import { Alert } from '../../components/common/Alert';
import { ROUTES } from '../../navigation/routes';

import Spinner from '../../components/common/Spinner';
import NotificationCard from '../../components/cards/NotificationCard';
import request from '../../services/apiBackend';

import styles from './styles';


import useUser from "../../hooks/useUser";

const Profile = ({ navigation }) => {
  
  const { navigate } = navigation;
  const { user, updateUser } = useUser();

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(false);

  const onChangeFirstame = value => {
    setFirstname(value);
  };
  const onChangeLastname = value => {
    setLastname(value);
  };

  const onReset = () => {
   
    setIsLoading('');
    setIsError('');
  };

  handleLogout = () => {
    updateUser(false);
  }

  handleSubmit = async () => {
    if (firstname && lastname) {
      try {
        setIsLoading(true);
        const data = await request(`users/${user.userProfile.id}`, {
          firstname,
          lastname
        }, "PUT", {"reactflix-access-token": user.token });
        setIsLoading(false);
        setIsError(false);
        if (data.error || data.errors) {
          setIsError(true);
          setError(data.message);
        } else {
          Alert({
            title: 'Aviso',
            description: 'Perfil actualizado con exito'
          });
        }
      } catch (err) {
        setIsLoading(false);
        setIsError(true);
      }
    }
  };


  useEffect(() => {
    if (!user) 
      navigation.replace(ROUTES.SIGNIN);
    else {
      onChangeFirstame(user.userProfile.firstname)
      onChangeLastname(user.userProfile.lastname)
    }
  }, []);

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
                    returnKeyType="done"
                    onChangeText={value => onChangeLastname(value)}
                    value={lastname}
                  />
                </View>

                <View style={styles.containerButton}>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => handleSubmit()}
                  >
                    <Text style={[styles.buttonText, styles.buttonTextSave]}>
                      Actualizar
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.section}>
                  <Text>Salir de la cuenta?</Text>

                  <View style={[styles.containerButton, { alignItems: 'flex-start' }]}>
                    <TouchableOpacity
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => handleLogout()}
                    >
                      <Text style={[styles.buttonText, styles.buttonTextSave]}>
                        Logout
                      </Text>
                    </TouchableOpacity>
                  </View>

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
          <View style={styles.section}>
            <Text>Identificate para acceder a tu cuenta</Text>
          </View>
          <View style={[styles.containerButton, { alignItems: 'flex-start' }]}>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => navigation.replace(ROUTES.SIGNIN)}
            >
              <Text style={[styles.buttonText, styles.buttonTextSave]}>
                Ingresar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};


Profile.navigationOptions = ({ navigation }) => {
  return {
    title: 'Perfil',
    headerLeft: null
  };
};

export default Profile;
