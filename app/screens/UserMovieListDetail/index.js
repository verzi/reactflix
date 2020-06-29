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
import requestBackend from '../../services/apiBackend';
import request from '../../services/api';

import MovieListRow from '../../components/cards/rows/MovieListRow';
import SectionRow from '../../components/cards/rows/SectionRow';
import styles from './styles';
import MovieRow from '../../components/cards/rows/MovieRowNew';
import { darkBlue } from '../../utils/colors';

import useUser from "../../hooks/useUser";
import { ROUTES } from '../../navigation/routes';

const UserMovieListDetail = ({ navigation }) => {

  const { listId } = navigation.state.params;
  const { navigate } = navigation;

  const { user, updateUser } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(false);
  const [listName, setListName] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [listMovies, setListMovies] = useState([]);

  const fetch = async () => {
    try {

      setIsLoading(true);
      let data = await requestBackend(`lists/${listId}`);

      setIsLoading(false);
      setIsError(false);
      if (data.error) {
        console.log(data)
        setIsError(true);
        setError("Los datos ingresados son incorrectos");
      } else {
        setListName(data.name)
        if (data.movies.length > 0) {
          let NewList = await resolveMoviesFetch(data.movies);
          setListMovies(NewList)
        }

      }

    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setIsError(true);
    }
  }

  const resolveMoviesFetch = async (list) => {
    return Promise.all(list.map(item => requestMoviesList(item.movieId)))
  }

  const requestMoviesList = async (id) => {
    try {

      const data = await request(`movie/${id}`);
      return data;

    } catch (err) {
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRefresh(false);
      setIsError(true);
    }
  }


  const handleVisibleModal = () => {
    setIsVisible(!isVisible);
  };



  useEffect(() => {
    fetch();
  }, [user]);

  renderItem = (item, type, isSearch, numColumns, navigate) => (
    <MovieRow
      item={item}
      type={type}
      isSearch={isSearch}
      numColumns={numColumns}
      navigate={navigate}
    />
  );
  const renderListEmpty = () => (
    <View>
      <Text style={styles.subTitleInfo}>Sin peliculas agregadas aún</Text>
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
                  Lista {listName}
                  </Text>
                </View>
                <MovieListRow
                  data={listMovies}
                  type="normal"
                  isSearch={false}
                  ListEmptyComponent={renderListEmpty}
                  keyGrid={1}
                  numColumns={1}
                  navigate={navigate}
                  renderItem={renderItem}
                />


              </View>


            )
        }
      </View>
    </Screen>
  );
};

export default UserMovieListDetail;
