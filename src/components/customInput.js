import {TextInput, StyleSheet} from 'react-native';
import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {moderateScale, width} from '../constants/utils';

const CustomInput = forwardRef(function CustomInput(
  {
    placeholder,
    value,
    onChangeText,
    customStyle,
    returnKeyType,
    secureTextEntry,
    onEndEditing,
  },
  ref,
) {
  const inputRef = useRef(null);
  useImperativeHandle(
    ref,
    () => {
      return {
        focus() {
          inputRef?.current?.focus();
        },
      };
    },
    [],
  );

  return (
    <TextInput
      ref={inputRef}
      style={[styles.textInput, customStyle]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      returnKeyType={returnKeyType}
      secureTextEntry={secureTextEntry}
      onEndEditing={onEndEditing}
    />
  );
});
const styles = StyleSheet.create({
  textInput: {
    padding: moderateScale(10),
    marginHorizontal: moderateScale(20),
    marginVertical: moderateScale(10),
    borderWidth: 1,
    borderRadius: moderateScale(10),
    width: width - moderateScale(100),
  },
});
export default CustomInput;
