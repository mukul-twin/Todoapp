import {View, StyleSheet, FlatList, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppColors} from '../constants/colors';
import {moderateScale, width} from '../constants/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationConstants} from '../constants/navigation';
import {CustomButton, Header, Loader} from '../components';
import {useIsFocused} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const Home = ({setIsLoginDone, navigation}) => {
  const isFocused = useIsFocused();
  const [todoData, setTodoData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastTodoItem, setLastTodoItem] = useState(null);

  const getLoginStatus = async () => {
    const loginData = await AsyncStorage.getItem('loginData');
    setUser(JSON.parse(loginData));
  };

  useEffect(() => {
    getLoginStatus();
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(true);
      firestore()
        .collection('Todos')
        .where('uid', '==', user?.uid)
        .get()
        .then(res => {
          const array = [];
          res?.docs?.forEach(item => {
            array.push(item?.data());
          });
          setTodoData(array?.reverse());
          setLoading(false);
        })
        .catch(e => {
          console.log('Error for calling data', e);
          setLoading(false);
        });

      //for getting last data
      firestore()
        .collection('Todos')
        .orderBy('id')
        .limitToLast(1)
        .get()
        .then(res => {
          setLastTodoItem(res?.docs[0]?.data());
        });
    }
  }, [isFocused, user]);

  return (
    <View style={styles.mainView}>
      <Header
        onPress1={() =>
          navigation?.navigate(NavigationConstants.CreateTodo, {
            lastTaskId: lastTodoItem ? lastTodoItem?.id : null,
            user: user,
          })
        }
        onPress2={async () => {
          setIsLoginDone(false);
          await AsyncStorage.removeItem('loginData');
        }}
        button2Required
        buttonText1={'Create Todo'}
        buttonText2={'Logout'}
      />
      {loading ? (
        <Loader isLoading={loading} />
      ) : (
        <>
          {todoData?.length ? (
            <Text>Hello {user?.name} , here is the list of your todos:</Text>
          ) : (
            <Text>No todo items in your bucket!</Text>
          )}
          <FlatList
            data={todoData}
            renderItem={({item, index}) => {
              return (
                <CustomButton
                  key={[index]}
                  value={item?.task}
                  onPress={() => {
                    navigation?.navigate(NavigationConstants.CreateTodo, {
                      isEdit: true,
                      lastTaskId: item?.id?.toString(),
                      user: user,
                    });
                  }}
                />
              );
            }}
          />
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  mainView: {flex: 1, backgroundColor: AppColors.white, alignItems: 'center'},
  headerView: {
    width: width,
    backgroundColor: AppColors.skyblue,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: moderateScale(10),
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
export default Home;
