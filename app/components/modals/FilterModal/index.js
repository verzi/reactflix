import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Modal } from '../Modal';
import { TouchableOpacity } from '../../common/TouchableOpacity';
import { Switch } from '../../common/Switch';

import { darkBlue } from '../../../utils/colors';
import styles from './styles';

const Filter = ({ title, type, selected, onChange }) => (
  <View style={styles.containerRow}>
    <Text style={styles.optionTitle} numberOfLines={2}>
      {title}
    </Text>
    <Switch
      value={type === selected}
      onValueChange={() => onChange(type, title)}
    />
  </View>
);

const FilterModal = ({ isVisible, filter, onVisible, onFilter, style }) => {
  const [filters, setFilters] = useState({
    type: filter.filterType,
    name: filter.filterName
  });
  const { type, name } = filters;

  changeValues = (type, name) => {
    setFilters({ type, name });
  };

  return (
    <Modal isVisible={isVisible} onClose={onVisible} style={style}>
      <View style={styles.containerModal}>
        <Text style={styles.modalTitle}>Filtros</Text>
        <ScrollView>
          <View style={styles.containerScroll}>
            <View style={styles.containerSection}>
              <Text style={styles.optionSectionTitle} numberOfLines={2}>
                Fecha de lanzamiento
              </Text>
              <Filter
                title="Más nuevas"
                type="release_date.desc"
                selected={type}
                onChange={changeValues}
              />
              <Filter
                title="Más viejas"
                type="release_date.asc"
                selected={type}
                onChange={changeValues}
              />
            </View>
            <View style={styles.containerSection}>
              <Text style={styles.optionSectionTitle} numberOfLines={2}>
                Popularidad
              </Text>
              <Filter
                title="Más popular"
                type="popularity.desc"
                selected={type}
                onChange={changeValues}
              />
              <Filter
                title="Menos popular"
                type="popularity.asc"
                selected={type}
                onChange={changeValues}
              />
            </View>
            <View>
              <Text style={styles.optionSectionTitle} numberOfLines={2}>
                Ingresos
              </Text>
              <Filter
                title="Mayores ingresos"
                type="revenue.desc"
                selected={type}
                onChange={changeValues}
              />
              <Filter
                title="Menores ingresos"
                type="revenue.asc"
                selected={type}
                onChange={changeValues}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.containerButton}>
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={onVisible}
          >
            <Feather
              name="chevron-down"
              size={styles.icon.fontSize}
              color={darkBlue}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonSave]}
            onPress={() => onFilter(type, name, false)}
          >
            <Text style={[styles.buttonText, styles.buttonTextSave]}>
              Confirmar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;
