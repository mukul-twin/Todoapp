/**
 * Loader
 */
import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {AppColors} from '../constants/colors';
import {height, moderateScale, width} from '../constants/utils';

const Loader = ({isLoading}) => {
  return isLoading ? (
    <View style={styles.loaderContainer}>
      <View style={styles.indicator}>
        <ActivityIndicator
          size={'large'}
          animating={isLoading}
          color={AppColors.blue}
        />
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  loaderContainer: {
    zIndex: 1,
    height: height,
    width: width,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: AppColors.transparent,
  },
  indicator: {
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(20),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default Loader;
