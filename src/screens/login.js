import {View, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native';
import React, {useRef, useState} from 'react';
import {moderateScale} from '../constants/utils';
import {AppColors} from '../constants/colors';
import {CustomButton, CustomInput, Loader} from '../components';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({setIsLoginDone}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  let disabled = !email?.trim()?.length || !password?.trim()?.length;

  if (isRegister) {
    disabled =
      !name?.trim()?.length ||
      !email?.trim()?.length ||
      !password?.trim()?.length;
  }

  const errorHandler = (errorMessage, e) => {
    Alert.alert(errorMessage, e.message);
    setIsLoading(false);
  };

  const authenticateFunction = () => {
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!regex.test(email)) {
      Alert.alert('Error', 'Please enter valid email!');
      return;
    }
    if (password?.length < 6 && isRegister) {
      Alert.alert('Error', 'Password should be atleast 6 characters long!');
      return;
    }
    if (name?.length < 4 && isRegister) {
      Alert.alert('Error', 'Name should be atleast 6 characters long!');
      return;
    }
    setIsLoading(true);
    if (isRegister) {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(res => {
          firestore()
            .collection('Users')
            .doc(res?.user?.uid)
            .set({
              name: name,
              email: email,
              password: password,
              uid: res?.user?.uid,
            })
            .then(async () => {
              await AsyncStorage.setItem(
                'loginData',
                JSON.stringify({
                  name: name,
                  email: email,
                  password: password,
                  uid: res?.user?.uid,
                }),
              );
              setIsLoading(false);
              setIsLoginDone(true);
            })
            .catch(e => errorHandler('Register Firestore Error', e));
        })
        .catch(e => errorHandler('Register Authentication Error', e));
    } else {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(res => {
          firestore()
            .collection('Users')
            .doc(res?.user?.uid)
            ?.get()
            .then(async res2 => {
              await AsyncStorage.setItem(
                'loginData',
                JSON.stringify({...res2.data()}),
              );
              setIsLoading(false);
              setIsLoginDone(true);
            })
            .catch(e => errorHandler('Login Firestore Error', e));
        })
        .catch(e => errorHandler('Login Authentication Error', e));
    }
  };

  return (
    <View style={styles.mainView}>
      <Loader isLoading={isLoading} />
      <Text style={styles.heading}>
        {isRegister
          ? 'Register Now'
          : 'Login with your registered email address'}
      </Text>
      {isRegister ? (
        <CustomInput
          placeholder={'Enter your name here!'}
          value={name}
          onChangeText={text => setName(text)}
          returnKeyType={'next'}
          onEndEditing={() => {
            if (name?.length) {
              emailRef?.current?.focus();
            }
          }}
        />
      ) : null}
      <CustomInput
        ref={emailRef}
        placeholder={'Enter your email here!'}
        value={email?.toLowerCase()}
        onChangeText={text => setEmail(text)}
        returnKeyType={'next'}
        onEndEditing={() => {
          if (email?.length) {
            passwordRef?.current?.focus();
          }
        }}
      />
      <CustomInput
        ref={passwordRef}
        placeholder={'Enter your password here!'}
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry={true}
        returnKeyType={'done'}
      />
      <CustomButton
        value={isRegister ? 'Register' : 'Login'}
        disabled={disabled}
        disabledColor={AppColors.grey}
        textColor={AppColors.white}
        color={AppColors.black}
        onPress={authenticateFunction}
      />
      <Text style={styles.heading}>
        {!isRegister ? 'New to our app?' : 'Already have an account!'}
      </Text>
      <TouchableOpacity onPress={() => setIsRegister(prev => !prev)}>
        <Text style={styles.footer}>
          {!isRegister ? 'Register Now!' : 'Login Now!'}
        </Text>
      </TouchableOpacity>
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
  heading: {
    fontSize: moderateScale(15),
    marginBottom: moderateScale(10),
    color: AppColors.black,
  },
  footer: {
    color: AppColors.blue,
  },
});
export default Login;
