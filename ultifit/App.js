<script src="http://192.168.1.107:8097"></script>
import React from 'react';
import { StyleSheet, View} from 'react-native';

import { store } from './src/store/store'
import { Provider } from 'react-redux'

import Routes from './src/Components/Navigations/Routes';

export default function App() {
  return (
    <Provider store={store}>
    <View style={styles.container}>
      <Routes/>
    </View>
  </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },
});
