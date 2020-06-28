import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Button, TextInput } from 'react-native';

import Screen from '../../components/common/Screen';
import { TouchableOpacity } from '../../components/common/TouchableOpacity';
import { Switch } from '../../components/common/Switch';

import Spinner from '../../components/common/Spinner';
import NotificationCard from '../../components/cards/NotificationCard';
import request from '../../services/apiBackend';

import SectionRow from '../../components/cards/rows/SectionRow';
import styles from './styles';


import useUser from "../../hooks/useUser";

const UserMovieList = ({ navigation }) => {


  const { navigate } = navigation;

  const { user, updateUser } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(false);
  const [list, setList] = useState([]);

  const fetch = async () => {
    try {
      setIsLoading(true);
      let data = false;
      if (user)
        data = await request(`users/${user.userProfile.id}/lists`, false, "GET", { "reactflix-access-token": user.token });
      else
        data = await request(`public-lists`);
      setIsLoading(false);
      setIsError(false);
      if (data.error) {
        console.log(data)
        setIsError(true);
        setError("Los datos ingresados son incorrectos");
      } else {
        console.log(data);
        setList(data);
      }
      console.log(user);
      console.log(data)

    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setIsError(true);
    }
  }
  useEffect(() => {
    fetch();
  }, [user]);

  if (user)
    return (
      <Screen>
        <ScrollView style={styles.bgWhite}>
          <View style={styles.container}>
            {isLoading ? (
              <Spinner style={styles.containerCenter} />
            ) : isError ? (
              <ScrollView style={styles.containerScroll}>
                <NotificationCard icon="alert-octagon" textButton="Reintentar" textError={error} onPress={() => fetch()} />
              </ScrollView>
            ) : (
                  <ScrollView style={styles.containerScroll}>
                    <View style={styles.section}>
                      <SectionRow title="Mis Listas">
                        <ScrollView
                          style={styles.containerList}
                        >
                          {list.map((item, key) => (
                            <TouchableOpacity
                              key={key}
                              style={styles.item}
                              onPress={() => false}
                            >
                              <Text style={styles.itemText}>{item.name}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </SectionRow>
                    </View>
                  </ScrollView>
                )
            }
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
              <NotificationCard icon="alert-octagon" textButton="Reintentar" textError={error || undefined} onPress={() => fetch()} />
            </ScrollView>
          ) : (
                <ScrollView style={styles.containerScroll}>
                  <View style={styles.section}>
                    <SectionRow title="Listas publicas">
                      <ScrollView
                        style={styles.containerList}
                      >
                        {list.map((item, key) => (
                          <TouchableOpacity
                            key={key}
                            style={styles.item}
                            onPress={() => false}
                          >
                            <Text style={styles.itemText}>{item.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </SectionRow>
                  </View>
                </ScrollView>
              )}
        </View>
      </ScrollView>
    </Screen>
  )
};

export default UserMovieList;
