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
import PersonListRow from '../../components/cards/rows/PersonListRow';
import PersonRow from '../../components/cards/rows/PersonRow';
import SectionRow from '../../components/cards/rows/SectionRow';
import MainInfoRow from '../../components/cards/rows/MainInfoRow';
import { TouchableOpacity } from '../../components/common/TouchableOpacity';

import request from '../../services/api';

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
  const [showImage, setShowImage] = useState(false);
  const [creditId, setCreditId] = useState(null);
  const [info, setInfo] = useState(INITIAL_INFO);

  useEffect(() => {
    navigation.setParams({ handleShare });
    requestMoviesInfo();
  }, []);

  requestMoviesInfo = async () => {
    try {
      setIsLoading(true);

      const { id } = navigation.state.params;
      const data = await request(`movie/${id}`, {
        include_image_language: 'en,null',
        append_to_response: 'credits,videos,images'
      });

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
      setIsLoading(false);
      setIsError(true);
    }
  };

  /* eslint-disable camelcase */
  getInfosDetail = ({
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

  formatImageUrl = images =>
    sliceArrayLength(images, 15).map(item =>
      getImageApi(item.file_path, 'url', 'original')
    );

  handleVisibleModal = () => {
    setIsVisible(!isVisible);
  };

  handlePerson = id => {
    setCreditId(id);
    handleVisibleModal();
  };

  handleImage = () => {
    setShowImage(!showImage);
  };

  handleShare = (title, id) => {
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

  renderItem = (item, type, handleTeamDetail) => (
    <PersonRow item={item} type={type} onTeamDetail={handleTeamDetail} />
  );

  renderListEmpty = () => (
    <View>
      <Text style={styles.subTitleInfo}>Sin información</Text>
    </View>
  );

  {
    const {
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
                <SectionRow title="Productora" isLast>
                  <PersonListRow
                    data={productionCompanies}
                    type="production"
                    keyItem="id"
                    ListEmptyComponent={renderListEmpty}
                    onTeamDetail={handlePerson}
                    renderItem={renderItem}
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
