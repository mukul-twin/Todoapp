import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {AppColors} from '../constants/colors';
import {moderateScale, width} from '../constants/utils';

const header = ({
  onPress1,
  onPress2,
  button2Required,
  buttonText1,
  buttonText2,
}) => {
  return (
    <View style={styles.headerView}>
      <TouchableOpacity style={styles.headerButtons()} onPress={onPress1}>
        <Text style={styles.buttonText()}>{buttonText1}</Text>
      </TouchableOpacity>
      {button2Required ? (
        <TouchableOpacity
          style={styles.headerButtons(AppColors.red)}
          onPress={onPress2}>
          <Text style={styles.buttonText(AppColors.black)}>{buttonText2}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  headerView: {
    width: width,
    backgroundColor: AppColors.skyblue,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: moderateScale(10),
    marginBottom: moderateScale(10),
  },
  headerButtons: color => ({
    padding: moderateScale(10),
    backgroundColor: color ?? AppColors.black,
    borderRadius: moderateScale(20),
  }),
  buttonText: color => ({
    color: color ?? AppColors.white,
  }),
});

export default header;
