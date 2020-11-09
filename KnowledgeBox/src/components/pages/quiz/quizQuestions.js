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
import axios from '../../../services/axios';

const QuizQuestionnaire = (props) => {
  const [key, setKey] = useState(0);
  const {quizId, title, user, catergoryId} = props.route.params;
  const [isSubmit, setIsSubmit] = useState(false);

  const [questionsList, setQuestionsList] = useState([]);
  const fetchQuizDetail = (quizId) => {
    axios
      .get('/quiz/getQuizDetail', {
        params: {
          id: quizId,
        },
      })
      .then((response) => {
        if (response.data) {
          setQuestionsList(response.data);
        } else {
          setQuestionsList([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchQuizDetail(quizId);
  }, []);

  const onOptionPress = (index) => {
    const questions = JSON.parse(JSON.stringify(questionsList));
    if (
      questions[key].selectedAnswer.includes(index) &&
      questions[key].isMultiple
    ) {
      questions[key].selectedAnswer.splice(
        questions[key].selectedAnswer.indexOf(index),
        1,
      );
      questions[key].options[index - 1].isSelected = false;
    } else if (
      questions[key].selectedAnswer.includes(index) &&
      !questions[key].isMultiple
    ) {
      questions[key].selectedAnswer = [];
      questions[key].options[index - 1].isSelected = false;
    } else {
      if (questions[key].isMultiple) {
        questions[key].selectedAnswer.push(index);
        questions[key].selectedAnswer.sort();
        questions[key].options[index - 1].isSelected = true;
      } else {
        questions[key].selectedAnswer = [];
        questions[key].selectedAnswer.push(index);
        questions[key].options.forEach((element) => {
          element.isSelected = false;
        });
        questions[key].options[index - 1].isSelected = true;
      }
    }
    setQuestionsList(questions);
  };

  const calculateScore = () => {
    let correct = 0;
    questionsList.forEach((element) => {
      if (element.selectedAnswer.toString() === element.correctOption) {
        correct++;
      }
    });
    return parseFloat(((correct / questionsList.length) * 100).toFixed(2));
  };

  const submitAnswers = () => {
    setIsSubmit(true);
    const submitAnswers = [];
    for (let i = 0; i < questionsList.length; i++) {
      let answer = {};
      answer.selectedAnswer = questionsList[i].selectedAnswer.toString();
      answer.quizDetailId = questionsList[i].id;
      answer.isCorrect =
        questionsList[i].selectedAnswer.toString() ===
        questionsList[i].correctOption;
      submitAnswers.push(answer);
    }
    if (user) {
      axios
        .post('/quiz/postQuizAnswers', {
          quizId: quizId,
          userId: user.id,
          score: calculateScore(),
          answers: submitAnswers,
        })
        .then((response) => {
          setIsSubmit(false);
          props.navigation.navigate('QuizResult', {
            questionsList: questionsList,
          });
        })
        .catch((err) => {
          setIsSubmit(false);
          console.log(err);
        });
    } else {
      setIsSubmit(false);
      props.navigation.navigate('QuizResult', {
        questionsList: questionsList,
      });
    }
  };

  const nextQuestion = (index, evt) => {
    if (index < questionsList.length - 1) {
      setKey(index + 1);
    } else {
      submitAnswers();
    }
  };

  const prevQuestion = (index, evt) => {
    setKey(index - 1);
    setIsSubmit(false);
  };

  return (
    <>
      {questionsList.length ? (
        <ScrollView style={{marginBottom: 30}}>
          <LinearGradient
            colors={[Constants.gradientColor1, Constants.gradientColor2]}
            style={{
              paddingVertical: 10,
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
                    fontFamily: 'Roboto-Medium',
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
              {renderProgressBar(
                questionsList.length,
                questionsList[key].count,
              )}
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Roboto-Medium',
                  fontSize: 20,
                  marginTop: 10,
                  color: 'white',
                }}>
                Question {questionsList[key].count}
              </Text>
              <Text
                style={{
                  fontFamily: 'Roboto-Medium',
                  fontSize: 18,
                  margin: 10,
                  color: 'white',
                }}>
                {questionsList[key].question}
              </Text>
            </View>
          </LinearGradient>
          <View
            style={{
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '70%',
                backgroundColor: 'orange',
                borderBottomRightRadius: 15,
                borderBottomLeftRadius: 15,
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontFamily: 'Roboto-Medium',
                  fontSize: 17,
                  margin: 3,
                }}>
                {!questionsList[key].isMultiple
                  ? 'Single Choice'
                  : 'Multiple Choice'}
              </Text>
            </View>
          </View>
          <View style={{alignItems: 'center', margin: 10, marginTop: 15}}>
            {questionsList[key].options.map((option) => {
              return (
                <View
                  key={option.id}
                  style={{
                    ...styles.stayElevated,
                    borderWidth: 3,
                    borderColor: option.isSelected
                      ? Constants.textColor1
                      : 'white',
                  }}>
                  <TouchableOpacity
                    onPress={onOptionPress.bind(this, option.id)}>
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
            {isSubmit ? (
              <View style={{justifyContent: 'center', alignContent: 'center'}}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : (
              <PButton
                title={key == questionsList.length - 1 ? 'Submit' : 'Next'}
                onPress={nextQuestion.bind(this, key)}
                viewStyle={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
                elementStyle={{flexDirection: 'row', justifyContent: 'center'}}
              />
            )}
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
      {junctions.map((j) => {
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
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    //fontWeight: 'bold',
    margin: 10,

    //color:
  },
});

export default QuizQuestionnaire;
