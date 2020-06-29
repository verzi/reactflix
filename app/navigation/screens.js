import MovieList from '../screens/MovieList';
import Profile from '../screens/Profile';
import MovieDetails from '../screens/MovieDetails';
import Search from '../screens/Search';
import MovieVideo from '../screens/MovieVideo';
import UserMovieList from '../screens/UserMovieList';
import UserMovieListDetail from '../screens/UserMovieListDetail';

import SignUp from '../screens/SignUp';
import SignIn from '../screens/SignIn';

import { ROUTES, TABS } from './routes';

export const UserAccountScreen = {
  [ROUTES.PROFILE]: {
    screen: Profile,
    navigationOptions: {
      title: TABS.USER_PROFILE
    }
  },
  [ROUTES.SIGNUP]: {
    screen: SignUp
  },
  [ROUTES.SIGNIN]: {
    screen: SignIn
  }
};

export const MoviesScreen = {
  [ROUTES.MOVIE_LIST]: {
    screen: MovieList,
    navigationOptions: {
      title: TABS.HOME
    }
  },
  [ROUTES.MOVIE_DETAILS]: {
    screen: MovieDetails
  },
  [ROUTES.MOVIE_VIDEO]: {
    screen: MovieVideo
  }
};

export const SearchScreen = {
  [ROUTES.SEARCH]: {
    screen: Search,
    navigationOptions: {
      title: TABS.SEARCH
    }
  },
  [ROUTES.SEARCH_RESULTS]: {
    screen: MovieList
  },
  [ROUTES.MOVIE_DETAILS]: {
    screen: MovieDetails
  },
  [ROUTES.MOVIE_VIDEO]: {
    screen: MovieVideo
  }
};

export const UserMovieListScreen = {
  [ROUTES.USER_MOVIE_LIST]: {
    screen: UserMovieList,
    navigationOptions: {
      title: TABS.USER_MOVIE_LIST
    },
  },
  [ROUTES.USER_MOVIE_LIST_DETAIL]: {
    screen: UserMovieListDetail
  }

};
