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
import { Switch } from '../../common/Switch';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import request from '../../../services/apiBackend';


import useUser from "../../../hooks/useUser";

const UNINFORMED = 'Sin información';

const Filter = ({ title, selected, onChange }) => (
  <View style={styles.containerRow}>
    <Text style={styles.optionTitle} numberOfLines={2}>
      {title}
    </Text>
    <Switch
      value={selected}
      onValueChange={() => onChange(!selected)}
    />
  </View>
);

const ListModal = ({ isVisible, ListId, style, onClose, onFetch, onAlert }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [haveId, setHaveId] = useState(false);

  const [isVisibleList, setVisible] = useState(false);
  const [nameList, setNameList] = useState(null);
  const [usersList, setUsersList] = React.useState([]);
  const [usersListSelected, setUsersListSelected] = React.useState([]);

  const { user, updateUser } = useUser();


  useEffect(() => {
    // requestCommentInfo();
    requestUsersList()
  }, [ListId]);

  const requestUsersList = async () => {
    try {
      setIsLoading(true);

      const data = await request(`users`,
        {}, "GET", { "reactflix-access-token": user.token })
      setIsLoading(false);
      setIsError(false);

      if (data.length > 0) {
        const user_list = data.map(({ _id, firstname, lastname }) => ({ id: _id, name: firstname + ' ' + lastname }));
        setUsersList([
          // this is the parent or 'item'
          {
            name: 'Usuarios',
            id: 0,
            // these are the children or 'sub items'
            children: user_list
          }]);
      } else {
        console.log("no retorno users");
        console.log(data);
      }

    } catch (err) {
      console.log("Se produjo error en fetch usuario")
      console.log(err)
      setIsLoading(false);
      setIsError(true);
    }
  };
  const onSave = async () => {
    if (nameList) {
      try {
        setIsLoading(true);
        await request(`lists`,
          {
            "owner": user.userProfile.id,
            "name": nameList,
            "isPublic": isVisibleList,
            "authorizedUsers": usersListSelected.map(val => ({ user: val.toString() }))
          }, "POST", { "reactflix-access-token": user.token })


        setTimeout(() => onAlert(), 500);

        onReset();
        setIsLoading(false);
        setIsError(false);
        onFetch();
        onClose();

      } catch (err) {
        console.log(err)
        setIsLoading(false);
        setIsError(true);
      }
    }
  };

  onSelectedItemsChange = (selectedItems) => {
    setUsersListSelected(selectedItems);
  };
  const noResults = () => (
    <View key="a" style={styles.center}>
      <Text>No hay usuario</Text>
    </View>
  )

  const onReset = () => {
    setIsLoading('');
    setIsError('');
    setVisible(false);
    setNameList(null);
    setUsersListSelected([]);
  };

  return (
    <Modal isVisible={isVisible} style={style} onClose={onClose}>
      <View style={styles.containerModal}>
        {isLoading ? (
          <Spinner style={styles.containerCenter} />
        ) : isError ? (
          <ScrollView style={styles.containerScroll}>
            <NotificationCard icon="alert-octagon" onPress={onReset} />
          </ScrollView>
        ) : (
              <ScrollView style={styles.containerScroll}>
                <View style={styles.containerSection}>
                  <Text style={styles.titleInfo}>Nombre</Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 3,
                      borderColor: "#ddd",
                      padding: 5,
                    }}>
                    <TextInput
                      placeholder="Nombre de la lista"
                      onChangeText={text => setNameList(text)}
                      value={nameList}
                    />
                  </View>
                </View>
                <View style={styles.containerSection}>
                  <Text style={styles.titleInfo} numberOfLines={2}>
                    Visibilidad
                  </Text>
                  <Filter
                    title="Es publico"
                    selected={isVisibleList}
                    onChange={setVisible}
                  />
                </View>
                <View style={styles.containerSection}>
                  <Text style={styles.titleInfo} numberOfLines={2}>
                    Usuarios
                  </Text>
                  <SectionedMultiSelect
                    items={usersList}
                    uniqueKey="id"
                    subKey="children"
                    expandDropDowns={true}
                    selectText="Usuarios autorizados"
                    confirmText="Confirmar"
                    searchPlaceholderText="Buscar usuario"
                    selectedText="seleccionados"
                    noResultsComponent={noResults}
                    showDropDowns={true}
                    readOnlyHeadings={true}
                    modalWithSafeAreaView={true}
                    onSelectedItemsChange={onSelectedItemsChange}
                    selectedItems={usersListSelected}
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

export default ListModal;
