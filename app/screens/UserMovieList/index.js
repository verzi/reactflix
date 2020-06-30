import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Button, FlatList } from 'react-native';

import Screen from '../../components/common/Screen';
import { TouchableOpacity } from '../../components/common/TouchableOpacity';
import { Switch } from '../../components/common/Switch';
import ListModal from '../../components/modals/ListModal';
import { Entypo } from '@expo/vector-icons';
import { Alert } from '../../components/common/Alert';
import Spinner from '../../components/common/Spinner';
import NotificationCard from '../../components/cards/NotificationCard';
import request from '../../services/apiBackend';

import SectionRow from '../../components/cards/rows/SectionRow';
import styles from './styles';

import { darkBlue } from '../../utils/colors';

import useUser from "../../hooks/useUser";
import { ROUTES } from '../../navigation/routes';

const UserMovieList = ({ navigation }) => {


  const { navigate } = navigation;

  const { user, updateUser } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(false);
  const [list, setList] = useState([]);


  const [isRefresh, setIsRefresh] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  const [id, setId] = useState(false);

  const fetch = async () => {
    try {
      let data = false;
      setIsLoading(true);
      if (user)
        data = await request(`users/${user.userProfile.id}/lists`, false, "GET", { "reactflix-access-token": user.token });
      else
        data = await request(`public-lists`);
      setIsLoading(false);
      setIsError(false);
      if (data.error) {
        setIsError(true);
        setError("Los datos ingresados son incorrectos");
      } else {
        setList(data);
      }

    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setIsError(true);
    }
  }

  const handleVisibleModal = () => {
    setIsVisible(!isVisible);
  };

  const handleNewList = () => {
    if (user)
      setIsVisible(!isVisible);
    else
      Alert({
        title: 'Aviso',
        description: 'Necesitas ingresar para crear una lista'
      });
  }

  useEffect(() => {
    setIsLoading(true);
    fetch();
  }, [user]);

  handleRefresh = async () => {
    await setIsRefresh(true);
    await fetch();
    await setIsRefresh(false);
  };

  const onAlert = () => {
    Alert({
      title: 'Aviso',
      description: 'Lista agregada con exito'
    });

  }

  const renderListEmpty = () => (
    <View>
      <Text style={{textAlign: "center"}}>Sin listas</Text>
    </View>
  );

  return (
    <Screen>
      <View style={styles.container}>
        {isLoading ? (
          <Spinner style={styles.containerCenter} />
        ) : isError ? (
          <ScrollView style={styles.containerScroll}>
            <NotificationCard icon="alert-octagon" textButton="Reintentar" textError={error} onPress={() => fetch()} />
          </ScrollView>
        ) : (
              <View style={styles.containerList}>
                  <View style={styles.containerMainText}>
                    <Text style={styles.textMain} numberOfLines={1}>
                      {user ? "Mis listas" : "Listas publicas"}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.buttonGrid
                      ]}
                      onPress={handleNewList}
                    >
                      <Entypo name="new-message" size={22} color={darkBlue} />
                    </TouchableOpacity>
                  </View>
                <FlatList
                  data={list}
                  keyExtractor={item => item._id.toString()}
                  refreshing={isRefresh}
                  onRefresh={handleRefresh}
                  ListEmptyComponent={renderListEmpty}
                  renderItem={({ item, key }) =>
                    <TouchableOpacity
                      key={key}
                      style={styles.item}
                      onPress={() => navigation.navigate(ROUTES.USER_MOVIE_LIST_DETAIL, { listId: item._id })}
                    >
                      <Text style={styles.itemText}>{item.name}</Text>
                    </TouchableOpacity>
                  }
                />


              </View>


            )
        }

        <ListModal
          isVisible={isVisible}
          ListId={id}
          style={styles.bottomModal}
          onFetch={fetch}
          onClose={handleVisibleModal}
          onAlert={onAlert}
        />
      </View>
    </Screen>
  );
};

export default UserMovieList;
