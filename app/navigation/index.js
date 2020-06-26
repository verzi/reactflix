import { registerRootComponent } from 'expo';
import React from 'react';
import { AppProvider } from "../context";
import NavigationStack from './NavigationStack';

class App extends React.Component {
  render() {
    return <AppProvider><NavigationStack /></AppProvider>;
  }
}


registerRootComponent(App);
