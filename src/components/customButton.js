import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {moderateScale, width} from '../constants/utils';
import {AppColors} from '../constants/colors';

const CustomButton = ({
  value,
  color,
  onPress,
  disabled,
  disabledColor,
  textColor,
  showLoader,
}) => {
  return (
    <TouchableOpacity
      style={styles.button(color, disabled, disabledColor)}
      onPress={onPress}>
      {showLoader ? (
        <ActivityIndicator size={'small'} />
      ) : (
        <Text style={styles.textStyle(textColor)}>{value}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: (color, disabled, disabledColor) => ({
    padding: moderateScale(10),
    marginHorizontal: moderateScale(20),
    marginVertical: moderateScale(10),
    borderWidth: 1,
    borderRadius: moderateScale(10),
    width: width - moderateScale(100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: disabled ? disabledColor : color,
    borderColor: disabled ? disabledColor : color,
  }),
  textStyle: textColor => ({
    color: textColor ? textColor : AppColors.black,
  }),
});

export default CustomButton;
