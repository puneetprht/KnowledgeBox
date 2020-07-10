/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import LinearGradient from 'react-native-linear-gradient';
import * as Constants from '../../../constants/constants';
import PButton from '../../../widgets/Button/pButton';
import ElevatedView from 'react-native-elevated-view';
import axios from 'axios';

const QuizQuestionnaire = props => {
  const [key, setKey] = useState(0);
  const {quizId, title, user, stateId, catergoryId} = props.route.params;

  const [questionsList, setQuestionsList] = useState([]);
  const fetchQuizDetail = quizId => {
    axios
      .get('http://10.0.2.2:3000/quiz/getQuizDetail', {
        params: {
          id: quizId,
        },
      })
      .then(response => {
        if (response.data) {
          setQuestionsList(response.data);
        } else {
          setQuestionsList([]);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchQuizDetail(quizId);
  }, []);

  const [chosen, setChosen] = useState([[], [], [], []]);
  const checkAnswer = (index, evt) => {
    var list = Array.from(chosen);
    if (!list[key].includes(index)) {
      list[key].push(index);
    }
    setChosen(list);
  };

  const nextQuestion = (index, evt) => {
    if (index < questionsList.length - 1) {
      setKey(index + 1);
    } else {
      Alert.alert('Call backend');
    }
  };

  const prevQuestion = (index, evt) => {
    //if (index < questionsList.length - 1) {
    setKey(index - 1);
    //}
  };

  return (
    <>
      {questionsList.length ? (
        <ScrollView style={{marginBottom: 30}}>
          <LinearGradient
            colors={[Constants.gradientColor1, Constants.gradientColor2]}
            style={{
              paddingVertical: 20,
              //height: '100%',
              //minHeight: 250,
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
            }}>
            <View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    flex: 1,
                    fontSize: 25,
                  }}>
                  {title}
                </Text>
                <View style={{position: 'absolute', paddingLeft: 15}}>
                  <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <Icon
                      name="chevron-left"
                      style={{color: 'white'}}
                      size={35}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{alignItems: 'center'}}>
              {renderProgressBar(questionsList.length, questionsList[key].id)}
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: 20, marginTop: 10, color: 'white'}}>
                Question {questionsList[key].id}
              </Text>
              <Text style={{fontSize: 18, margin: 10, color: 'white'}}>
                Question {questionsList[key].question}
              </Text>
            </View>
          </LinearGradient>
          <View style={{alignItems: 'center', margin: 20}}>
            {questionsList[key].options.map(option => {
              return (
                <View
                  key={option.id}
                  style={{
                    ...styles.stayElevated,
                    borderWidth: 3,
                    borderColor: chosen[key].includes(option.id)
                      ? Constants.textColor1
                      : 'white',
                  }}>
                  <TouchableOpacity onPress={checkAnswer.bind(this, option.id)}>
                    <ElevatedView elevation={5} style={{borderRadius: 10}}>
                      <Text
                        style={{
                          ...styles.answerText,
                          color: Constants.textColor1,
                        }}>
                        {option.value}
                      </Text>
                    </ElevatedView>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
          <View
            flexDirection={'row'}
            style={{marginHorizontal: 20, justifyContent: 'space-between'}}>
            <View
              style={{
                paddingLeft: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {key ? (
                <TouchableOpacity onPress={prevQuestion.bind(this, key)}>
                  <Icon
                    name="chevron-left"
                    style={{
                      color: Constants.textColor1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    size={35}
                  />
                </TouchableOpacity>
              ) : (
                <View />
              )}
            </View>
            <PButton
              title={key == questionsList.length - 1 ? 'Submit' : 'Next'}
              onPress={nextQuestion.bind(this, key)}
              viewStyle={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}
              elementStyle={{flexDirection: 'row', justifyContent: 'center'}}
            />
          </View>
        </ScrollView>
      ) : (
        <View style={{justifyContent: 'center', alignContent: 'center'}}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </>
  );
};

const renderProgressBar = (length, inFocus) => {
  let junctions = [];
  for (var i = 0; i < length; i++) {
    if (i === inFocus - 1) {
      junctions.push({key: i, color: 'yellow'});
    } else {
      junctions.push({key: i, color: 'white'});
    }
  }
  return (
    <View
      style={{
        width: '60%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 10,
      }}>
      {junctions.map(j => {
        return (
          <View
            key={j.key}
            style={{
              height: 7,
              width: (1 / length) * 100 + '%',
              backgroundColor: j.color,
              borderRadius: 4,
            }}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  stayElevated: {
    width: '100%',
    //height: 10,
    margin: 10,
    //padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  answerText: {
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,

    //color:
  },
});

export default QuizQuestionnaire;
