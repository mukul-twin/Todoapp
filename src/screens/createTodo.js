import {View, Text, StyleSheet, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CustomButton, CustomInput, Header} from '../components';
import {AppColors} from '../constants/colors';
import {moderateScale} from '../constants/utils';
import firestore from '@react-native-firebase/firestore';

const CreateTodo = ({navigation, route}) => {
  const [task, setTask] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {isEdit, lastTaskId, user} = route?.params || {};

  const errorHandler = (errorMessage, e) => {
    Alert.alert(errorMessage, e.message);
    setIsLoading(false);
  };

  const successHandler = successMessage => {
    Alert.alert('Success', successMessage);
    setIsLoading(false);
    navigation?.pop();
  };

  useEffect(() => {
    if (isEdit && lastTaskId) {
      firestore()
        .collection('Todos')
        .doc(lastTaskId)
        .get()
        .then(res => {
          setTask(res?.data()?.task);
        })
        .catch(e => errorHandler('Data Calling Error', e));
    }
  }, [isEdit, lastTaskId]);

  const saveTaskToFirebase = () => {
    const taskId = lastTaskId
      ? isEdit
        ? lastTaskId
        : Number(lastTaskId) + 1
      : '1111111111';
    const firestoreFunction = firestore()
      .collection('Todos')
      .doc(taskId?.toString());
    setIsLoading(true);
    if (isEdit) {
      firestoreFunction
        .update({
          task: task,
          id: taskId?.toString(),
          uid: user?.uid,
        })
        .then(() => successHandler('Saved', 'Your updated data is saved!'))
        .catch(e => errorHandler('Data saving error', e));
    } else {
      firestoreFunction
        .set({
          task: task,
          id: taskId?.toString(),
          uid: user?.uid,
        })
        .then(() => successHandler('Saved', 'Your data is saved!'))
        .catch(e => errorHandler('Data saving error', e));
    }
  };

  const deleteTaskFromFirebase = () => {
    setDeleteLoading(true);
    firestore()
      .collection('Todos')
      .doc(lastTaskId)
      .delete()
      .then(() => {
        successHandler('Deleted');
        setDeleteLoading(false);
      })
      .catch(e => errorHandler('Data deleting error', e));
  };

  return (
    <View style={styles.mainView}>
      <Header buttonText1={'Back'} onPress1={() => navigation?.pop()} />
      <Text style={styles.heading}>Create a todo task</Text>
      <CustomInput
        placeholder={'Enter task here'}
        value={task}
        onChangeText={text => setTask(text)}
      />
      <CustomButton
        value={'Save task'}
        color={AppColors.black}
        textColor={AppColors.white}
        onPress={saveTaskToFirebase}
        disabled={!task?.trim()?.length}
        disabledColor={AppColors.grey}
        showLoader={isLoading}
      />
      {isEdit ? (
        <CustomButton
          value={'Delete task'}
          color={AppColors.red}
          textColor={AppColors.white}
          onPress={deleteTaskFromFirebase}
          showLoader={deleteLoading}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: AppColors.white,
    alignItems: 'center',
  },
  heading: {
    fontSize: moderateScale(15),
    marginBottom: moderateScale(10),
    color: AppColors.black,
  },
});

export default CreateTodo;
