import {View, StyleSheet, ActivityIndicator} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationConstants} from '../constants/navigation';
import {AppColors} from '../constants/colors';

const SplashLoader = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation?.replace(NavigationConstants.Login);
    }, 2000);
  });

  return (
    <View style={styles.mainView}>
      <ActivityIndicator size={'large'} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: AppColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SplashLoader;
