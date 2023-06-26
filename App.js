/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationConstants} from './src/constants/navigation';
import {AppColors} from './src/constants/colors';
import {CreateTodo, Home, Login, SplashLoader} from './src/screens';

const Stack = createNativeStackNavigator();
function App() {
  const [isLoginDone, setIsLoginDone] = useState(false);

  const getLoginStatus = async () => {
    const loginData = await AsyncStorage.getItem('loginData');
    if (loginData) {
      setIsLoginDone(true);
    } else {
      setIsLoginDone(false);
    }
  };

  useEffect(() => {
    getLoginStatus();
  }, []);

  return (
    <SafeAreaView style={styles.mainView}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name={NavigationConstants.Splash}
            component={SplashLoader}
            options={{headerShown: false}}
          />
          {isLoginDone ? (
            <Stack.Group>
              <Stack.Screen
                name={NavigationConstants.Login}
                options={{headerShown: false}}>
                {({navigation}) => (
                  <Home
                    setIsLoginDone={setIsLoginDone}
                    navigation={navigation}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen
                name={NavigationConstants.CreateTodo}
                component={CreateTodo}
                options={{headerShown: false}}
              />
            </Stack.Group>
          ) : (
            <Stack.Screen
              name={NavigationConstants.Login}
              options={{headerShown: false}}>
              {() => <Login setIsLoginDone={setIsLoginDone} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainView: {flex: 1, backgroundColor: AppColors.white},
});

export default App;
