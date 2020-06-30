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


import SectionedMultiSelect from 'react-native-sectioned-multi-select';

import useUser from "../../hooks/useUser";

const Profile = ({ navigation }) => {

  const { navigate } = navigation;
  const { user, updateUser } = useUser();

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [genresSelected, setGenresSelected] = useState([]);
  const [genresListData, setGenresData] = useState([]);

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
        let genresforSave = genresSelected.map(id => ({ movieGenre: genresListData.filter(obj => obj.id == id).map(filteredObj => filteredObj._id) }));

        const data = await request(`users/${user.userProfile.id}`, {
          firstname: firstname,
          lastname: lastname,
          "movieGenres": genresforSave
        }, "PUT", { "reactflix-access-token": user.token });
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
        console.log(err)
        setIsLoading(false);
        setIsError(true);
      }
    }
  };

  const onGenreChange = (selectedItems) => {
    setGenresSelected(selectedItems);
  };

  const fetchGenres = async () => {
    try {
      setIsLoading(true);
      const data = await request(`movies/genres`,
        {}, "GET", { "reactflix-access-token": user.token })
      setIsLoading(false);
      setIsError(false);

      if (data.length > 0) {
        setGenresData(data);
        if (user.userProfile.movieGenres.length > 0) {
          let rawGenre = user.userProfile.movieGenres
          let myGenres = rawGenre.map(({ movieGenre }) => movieGenre.id)
          setGenresSelected(myGenres)
        }
      }

    } catch (err) {
      setIsLoading(false);
      setIsError(true);
    }
  };


  useEffect(() => {
    console.log("vuelvo a entrar")
    if (!user)
      navigation.replace(ROUTES.SIGNIN);
    else {
      onChangeFirstame(user.userProfile.firstname)
      onChangeLastname(user.userProfile.lastname)
      fetchGenres();
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
                <NotificationCard icon="alert-octagon" textButton="Reintentar" texftError={error} onPress={() => onReset()} />
              </ScrollView>
            ) : (
                  <ScrollView style={styles.containerScroll}>
                    <View style={styles.section}>
                      <Text>Hola {user.userProfile.firstname}, estos son tus datos.</Text>

                      <View style={[styles.containerSection, {marginTop: 50}]}>
                        <Text style={styles.titleInfo} numberOfLines={2}>
                          Nombre
                        </Text>
                        <View
                          style={{
                            borderWidth: 1,
                            borderRadius: 3,
                            borderColor: "#ddd",
                            padding: 5,
                          }}>
                          <TextInput
                            placeholder="Nombre"
                            placeholderTextColor="#828282"
                            returnKeyType="next"
                            onChangeText={value => onChangeFirstame(value)}
                            value={firstname}
                          />
                        </View>
                      </View>
                      <View style={styles.containerSection}>
                        <Text style={styles.titleInfo} numberOfLines={2}>
                          Apellido
                        </Text>
                        <View
                          style={{
                            borderWidth: 1,
                            borderRadius: 3,
                            borderColor: "#ddd",
                            padding: 5,
                          }}>
                        <TextInput
                          placeholder="Apellido"
                          placeholderTextColor="#828282"
                          returnKeyType="done"
                          onChangeText={value => onChangeLastname(value)}
                          value={lastname}
                        />
                      </View>
                      </View>
                      <View style={styles.containerSection}>
                        <Text style={styles.titleInfo} numberOfLines={2}>
                          Generos favoritos
                        </Text>
                        <SectionedMultiSelect
                          items={genresListData}
                          uniqueKey="id"
                          subKey="children"
                          expandDropDowns={true}
                          selectText="Generos favoritos"
                          confirmText="Confirmar"
                          searchPlaceholderText="Buscar Genero"
                          selectedText="seleccionados"
                          showDropDowns={true}
                          readOnlyHeadings={false}
                          modalWithSafeAreaView={true}
                          onSelectedItemsChange={onGenreChange}
                          selectedItems={genresSelected}
                        />
                      </View>
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
