import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ReadMore from 'react-native-read-more-text';

import { Alert } from '../../components/common/Alert';
import { Share } from '../../components/common/Share';
import Screen from '../../components/common/Screen';
import Spinner from '../../components/common/Spinner';
import NotificationCard from '../../components/cards/NotificationCard';
import PosterRow from '../../components/cards/rows/PosterRow';
import PersonModal from '../../components/modals/PersonModal';
import CommentModal from '../../components/modals/CommentModal';
import PersonListRow from '../../components/cards/rows/PersonListRow';

import CommentListRow from '../../components/cards/rows/CommentListRow';

import CommentRow from '../../components/cards/rows/CommentRow';
import PersonRow from '../../components/cards/rows/PersonRow';
import SectionRow from '../../components/cards/rows/SectionRow';
import MainInfoRow from '../../components/cards/rows/MainInfoRow';
import { TouchableOpacity } from '../../components/common/TouchableOpacity';

import request from '../../services/api';
import requestBackend from '../../services/apiBackend';

import { getImageApi } from '../../utils/images';
import { convertMinsToHrsMins } from '../../utils/time';
import { convertToUpperCaseFirstLetter } from '../../utils/letters';
import { convertToDate } from '../../utils/dates';
import { convertToDolar } from '../../utils/currency';
import { convertToGenres } from '../../utils/genre';
import { sliceArrayLength } from '../../utils/array';

import isoLanguage from '../../data/iso.json';

import { darkBlue } from '../../utils/colors';
import styles from './styles';

import SectionedMultiSelect from 'react-native-sectioned-multi-select';

import useUser from "../../hooks/useUser";

const UNINFORMED = 'Sin información';
const INITIAL_INFO = {
  id: '',
  backdropPath: '',
  title: '',
  voteAverage: 0,
  video: [],
  overview: UNINFORMED,
  cast: [],
  crew: [],
  productionCompanies: [],
  images: [],
  infosDetail: {
    Duration: UNINFORMED,
    Genre: UNINFORMED,
    Language: UNINFORMED,
    Release: UNINFORMED,
    Budget: UNINFORMED,
    Revenue: UNINFORMED,
    Adult: UNINFORMED
  }
};
const ADULT_RATE = {
  true: 'No',
  false: 'Si'
};

const renderReadMoreFooter = (text, handlePress) => (
  <TouchableOpacity onPress={handlePress}>
    <Text style={styles.readMore}>{text}</Text>
  </TouchableOpacity>
);

const MovieDetails = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleComment, setIsVisibleComment] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [creditId, setCreditId] = useState(null);

  const [listRaw, setListRaw] = useState([]);
  const [info, setInfo] = useState(INITIAL_INFO);

  const comboList = React.useRef();

  const [dataList, setDataList] = React.useState([]);
  const [usersListSelected, setUsersListSelected] = React.useState([]);

  const [rating, setRating] = useState(null);
  const [comments, setComments] = useState([]);

  const { user, updateUser } = useUser();

  useEffect(() => {
    navigation.setParams({ handleShare });
    requestMoviesInfo();
  }, []);

  const requestRatingComment = async () => {
    const { id } = navigation.state.params;
    const dataComments = await requestBackend(`movies/${id}/comments`, {}, 'GET');
    const dataRating = await requestBackend(`movies/${id}/reactflix-rating`, {}, 'GET');
    if (user) {
      const listdata = await requestBackend(`users/${user.userProfile.id}/owned-lists`, false, "GET", { "reactflix-access-token": user.token });
      if (listdata.length > 0) {
        setListRaw(listdata);
        const user_list = listdata.map(({ _id, name }) => ({ id: _id, name: name }));
        setDataList(user_list);
      }
    }
    console.log(dataComments)
    setComments(dataComments);
    setRating(dataRating);
  }
  const requestMoviesInfo = async () => {
    try {
      setIsLoading(true);

      const { id } = navigation.state.params;
      const data = await request(`movie/${id}`, {
        include_image_language: 'en,null',
        append_to_response: 'credits,videos,images'
      });
      await requestRatingComment();
    
      setIsLoading(false);
      setIsError(false);
      setInfo({
        id,
        backdropPath: data.backdrop_path || INITIAL_INFO.backdropPath,
        title: data.title || INITIAL_INFO.title,
        voteAverage: data.vote_average || INITIAL_INFO.voteAverage,
        video: data.videos.results[0] || INITIAL_INFO.video,
        overview: data.overview || INITIAL_INFO.overview,
        cast: sliceArrayLength(data.credits.cast, 15),
        crew: sliceArrayLength(data.credits.crew, 15),
        productionCompanies: sliceArrayLength(data.production_companies, 10),
        images: formatImageUrl(data.images.backdrops),
        infosDetail: getInfosDetail(data)
      });
    } catch (err) {
      console.log(err)
      setIsLoading(false);
      setIsError(true);
    }
  };

  /* eslint-disable camelcase */
  const getInfosDetail = ({
    runtime = 0,
    genres = '',
    original_language = '',
    release_date = '',
    budget = 0,
    revenue = 0,
    adult = ''
  }) => ({
    Duration: convertMinsToHrsMins(runtime),
    Genre: convertToGenres(sliceArrayLength(genres, 2)),
    Language: convertToUpperCaseFirstLetter(isoLanguage[original_language]),
    Release: convertToDate(release_date),
    Budget: convertToDolar(budget),
    Revenue: convertToDolar(revenue),
    Adult: ADULT_RATE[adult] || UNINFORMED
  });
  /* eslint-enable camelcase */

  const formatImageUrl = images =>
    sliceArrayLength(images, 15).map(item =>
      getImageApi(item.file_path, 'url', 'original')
    );

  const handleVisibleModal = () => {
    setIsVisible(!isVisible);
  };


  let handleVisibleModalComment = () => {
    if (user)
      setIsVisibleComment(!isVisibleComment);
    else
      Alert({
        title: 'Aviso',
        description: 'Debes loguearte para poder comentar'
      });
  };

  const handlePerson = id => {
    setCreditId(id);
    handleVisibleModal();
  };

  const handleImage = () => {
    setShowImage(!showImage);
  };

  const handleShare = (title, id) => {
    if (isError) {
      Alert({
        title: 'Atención',
        description: 'Ups!, ha ocurrido un problema, por favor intenta nuevamente más tarde.'
      });
    } else {
      Share({
        message: `${title}, para saber todo de éste título \u{1F37F}`,
        url: `https://www.themoviedb.org/movie/${id}`,
        title: 'Reactflix',
        dialogTitle: `${title}, para saber todo de éste título \u{1F37F}`
      });
    }
  };

  const handleVisibleAdd = () => {
    if (user)
      comboList.current._toggleSelector()
    else
      Alert({
        title: 'Aviso',
        description: 'Debes loguearte para poder agregar una pelicula'
      });

  }


  const onSelectedItemsChange = (selectedItems) => {
    // onSaveMovieList(selectedItems)
    setTimeout(() => onSaveMovieList(selectedItems[0]), 500);

  };

  const onSaveMovieList = async (listId) => {
    const { id } = navigation.state.params || {};
    if (listId && user) {
      try {
        let actualMovies = listRaw.filter(obj => obj._id == listId).map(filteredObj => filteredObj.movies)[0]
        console.log(actualMovies)
        let ifExist = actualMovies.filter(obj => obj.movieId == id);
        if (ifExist.length > 0) {
          actualMovies = actualMovies.filter(obj => obj.movieId != id);
        } else {
          actualMovies.push({ "movieId": id })
        }
        const requestListChange = await requestBackend(`lists/${listId}`, { "movies": actualMovies }, 'PUT', { "reactflix-access-token": user.token });
        if (requestListChange) {
          if (ifExist.length > 0) {
            Alert({
              title: 'Aviso',
              description: 'Pelicula eliminada de la lista'
            });
          } else {
            Alert({
              title: 'Aviso',
              description: 'Pelicula agregada a la lista'
            });
          }
        } else {
          Alert({
            title: 'Aviso',
            description: 'No se pudo agregar la pelicula a la lista'
          });
        }
      } catch (err) {
        console.log(err)
        Alert({
          title: 'Aviso',
          description: 'No se pudo agregar la pelicula a la lista'
        });
      }
    }
  }



  const renderCommentItem = (item) => (
    <CommentRow item={item} />
  );

  const renderItem = (item, type, handleTeamDetail) => (
    <PersonRow item={item} type={type} onTeamDetail={handleTeamDetail} />
  );

  const renderListEmpty = () => (
    <View>
      <Text style={styles.subTitleInfo}>Sin información</Text>
    </View>
  );

  {
    const {
      id,
      backdropPath,
      voteAverage,
      video,
      title,
      infosDetail,
      overview,
      cast,
      crew,
      productionCompanies,
      images
    } = info;
    const { navigate } = navigation;

    return (
      <Screen>
        <View style={styles.container}>
          {isLoading ? (
            <Spinner />
          ) : isError ? (
            <NotificationCard
              icon="alert-octagon"
              onPress={requestMoviesInfo}
            />
          ) : (
                <ScrollView>
                  <PosterRow
                    title={title}
                    backdropPath={backdropPath}
                    voteAverage={voteAverage}
                    images={images}
                    video={video}
                    navigate={navigate}
                    showImage={showImage}
                    onPress={handleImage}
                    handleComment={handleVisibleModalComment}
                    handleAdd={handleVisibleAdd}
                    rating={rating}
                  />
                  <View style={styles.containerMovieInfo}>
                    <MainInfoRow data={infosDetail} />
                    <SectionRow title="Sinópsis">
                      <ReadMore
                        numberOfLines={3}
                        renderTruncatedFooter={handlePress =>
                          renderReadMoreFooter('Ver más', handlePress)
                        }
                        renderRevealedFooter={handlePress =>
                          renderReadMoreFooter('Ver menos', handlePress)
                        }
                      >
                        <Text style={styles.subTitleInfo}>{overview}</Text>
                      </ReadMore>
                    </SectionRow>
                    <SectionRow title="Reparto principal">
                      <PersonListRow
                        data={cast}
                        type="character"
                        keyItem="creditId"
                        ListEmptyComponent={renderListEmpty}
                        onTeamDetail={handlePerson}
                        renderItem={renderItem}
                      />
                    </SectionRow>
                    <SectionRow title="Equipo técnico principal">
                      <PersonListRow
                        data={crew}
                        type="job"
                        keyItem="creditId"
                        ListEmptyComponent={renderListEmpty}
                        onTeamDetail={handlePerson}
                        renderItem={renderItem}
                      />
                    </SectionRow>
                    <SectionRow title="Productora">
                      <PersonListRow
                        data={productionCompanies}
                        type="production"
                        keyItem="id"
                        ListEmptyComponent={renderListEmpty}
                        onTeamDetail={handlePerson}
                        renderItem={renderItem}
                      />
                    </SectionRow>
                    <SectionRow title="Comentarios" isLast>
                      <CommentListRow
                        data={comments}
                        ListEmptyComponent={renderListEmpty}
                        renderItem={renderCommentItem}
                      />
                    </SectionRow>
                  </View>
                </ScrollView>
              )}
          <PersonModal
            isVisible={isVisible}
            creditId={creditId}
            style={styles.bottomModal}
            onClose={handleVisibleModal}
          />
          <CommentModal
            isVisible={isVisibleComment}
            MovieId={id}
            onRequestRatingComment={requestRatingComment}
            style={styles.bottomModal}
            onClose={handleVisibleModalComment}
          />

          <SectionedMultiSelect
            hideSelect={true}
            single={true}
            items={dataList}
            ref={comboList}
            uniqueKey="id"
            subKey="children"
            expandDropDowns={true}
            confirmText="Confirmar"
            searchPlaceholderText="Buscar lista"
            selectedText="seleccionados"
            showCancelButton={true}
            modalWithSafeAreaView={true}
            onSelectedItemsChange={onSelectedItemsChange}
            selectedItems={usersListSelected}
            readOnlyHeadings={false}
          />


        </View>
      </Screen>
    );
  }
};

MovieDetails.navigationOptions = ({ navigation }) => {
  const { id, title, handleShare } = navigation.state.params || {};

  return {
    title: 'Detalle',
    headerRight: (
      <TouchableOpacity
        style={styles.buttonShare}
        onPress={() => handleShare(title, id)}
      >
        <Feather name="share" size={23} color={darkBlue} />
      </TouchableOpacity>
    )
  };
};

export default MovieDetails;
