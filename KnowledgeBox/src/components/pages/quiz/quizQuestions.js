/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,  
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from '../../../services/axios';
import Lightbox from 'react-native-lightbox-v2';
import PButton from '../../../widgets/Button/pButton';
import ElevatedView from 'react-native-elevated-view';
import Icon from 'react-native-vector-icons/Octicons';
import LinearGradient from 'react-native-linear-gradient';
//import * as Constants from '../../../constants/constants';

const QuizQuestionnaire = (props) => {
  const [key, setKey] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const {quizId, title, quizTime, user} = props.route.params;
  const [isSubmit, setIsSubmit] = useState(false);
  const [languageFlag, setLanguage] = useState(false);
  const [questionsList, setQuestionsList] = useState([]);
  const [timeDuration, setTimeDuration ] = useState(quizTime * 60);
  const [timeDelay, setTimeDelay ] = useState(1000);
  const [layoutHeight, setLayoutHeight] = useState(0);

  var _interval = null;
  var textColor = 'black';
  const fetchQuizDetail = (qId) => {
    axios
      .get('/quiz/getQuizDetail', {
        params: {
          id: qId,
        },
      })
      .then((response) => {
        if (response.data) {
          //console.log(response.data);
          setQuestionsList(response.data);
        } else {
          setQuestionsList([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };


  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        _interval = setInterval(tick, delay);
        console.log('intime');
        return () => clearInterval(_interval);
      }
    }, [delay]);
  }

  useEffect(() => {
    fetchQuizDetail(quizId);
    return () => clearInterval(_interval);
  }, [quizId, _interval]);

  useInterval(() => {
    const time = parseInt(timeDuration, 10);
      if (questionsList.length) {
      if (time <= 0) {
        setTimeDelay(null);
        submitAnswers();
      }
      else {
        setTimeDuration(timeDuration - 1);
      }
    }
  }, timeDelay);

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
      questions[key].optionsLang[index - 1].isSelected = false;
    } else if (
      questions[key].selectedAnswer.includes(index) &&
      !questions[key].isMultiple
    ) {
      questions[key].selectedAnswer = [];
      questions[key].options[index - 1].isSelected = false;
      questions[key].optionsLang[index - 1].isSelected = false;
    } else {
      if (questions[key].isMultiple) {
        questions[key].selectedAnswer.push(index);
        questions[key].selectedAnswer.sort();
        questions[key].options[index - 1].isSelected = true;
        questions[key].optionsLang[index - 1].isSelected = true;
      } else {
        questions[key].selectedAnswer = [];
        questions[key].selectedAnswer.push(index);
        questions[key].options.forEach((element) => {
          element.isSelected = false;
        });
        questions[key].optionsLang.forEach((element) => {
          element.isSelected = false;
        });
        questions[key].options[index - 1].isSelected = true;
        questions[key].optionsLang[index - 1].isSelected = true;
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
    const submitAnswer = [];
    for (let i = 0; i < questionsList.length; i++) {
      let answer = {};
      answer.selectedAnswer = questionsList[i].selectedAnswer.toString();
      answer.quizDetailId = questionsList[i].id;
      answer.isCorrect =
        questionsList[i].selectedAnswer.toString() ===
        questionsList[i].correctOption;
      submitAnswer.push(answer);
    }
    if (user) {
      axios
        .post('/quiz/postQuizAnswers', {
          quizId: quizId,
          userId: user.id,
          score: calculateScore(),
          answers: submitAnswer,
        })
        .then((response) => {
          setIsSubmit(false);
          props.navigation.navigate('QuizResult', {
            questionsList: questionsList,
            languageFlag: languageFlag,
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
        languageFlag: languageFlag,
      });
    }
  };

  const nextQuestion = (index, evt) => {
    if (index < questionsList.length - 1) {
      setKey(index + 1);
      setLayoutHeight(0);
    } else {
      submitAnswers();
    }
  };

  const prevQuestion = (index, evt) => {
    setKey(index - 1);
    setLayoutHeight(0);
    setIsSubmit(false);
  };

  return (
    <>
      {questionsList.length ? (
        <ScrollView style={{height: '100%', minHeight: Dimensions.get('window').height}}>
            <LinearGradient
            colors={['#FFF', '#FFF']}
            style={{
              paddingVertical: 10,
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
            }}>
            <View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <Text
                  style={{
                    color: '#555',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    flex: 1,
                    fontFamily: 'Roboto-Medium',
                    fontSize: 18,
                  }}>
                  {title}
                </Text>
                <View style={{position: 'absolute', paddingLeft: 15}}>
                  <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <Icon
                      name="chevron-left"
                      style={{color: '#555'}}
                      size={25}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View>
              <View style={{alignItems: 'center'}}>
                {renderProgressBar(
                  questionsList.length,
                  questionsList[key].count,
                )}
              </View>
              <View
                  style={{
                    position: 'absolute',
                    justifyContent: 'center',
                    paddingLeft: 5,
                  }}>
                  {renderTimer(timeDuration)}
                </View>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  justifyContent: 'center',
                  alignSelf: 'flex-end',
                  paddingLeft: 5,
                }}
                onPress={() => setLanguage(!languageFlag)}>
                <Image
                  source={require('../../../assets/language.png')}
                  style={{
                    width: 30,
                    height: 30,
                    marginHorizontal: 15,
                    marginVertical: 5,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={{alignItems: 'flex-start', justifyContent: 'flex-start'}}>
              <Text
                style={{
                  fontFamily: 'Roboto-Medium',
                  fontSize: 14,
                  marginTop: 10,
                  marginLeft: 10,
                  color: textColor,
                }}>
                Question {questionsList[key].count}
              </Text>
              <Text
                style={{
                  fontFamily: 'Roboto-Medium',
                  fontSize: 16,
                  margin: 10,
                  color: textColor,
                  textAlign: 'left',
                }}>
                {languageFlag && questionsList[key].questionLang
                    ? questionsList[key].questionLang
                    : questionsList[key].question}
              </Text>
              { questionsList[key].questionAttachmentUrl ? 
              <Lightbox underlayColor="white" longPressCallback={() => console.log('cess')} 
                onOpen={() => setIsOpen(true)} onClose={() => setIsOpen(false)}>
                <Image
                  style={isOpen ? styles.containOpen : styles.contain}
                  resizeMode="contain"
                  source={{uri: questionsList[key].questionAttachmentUrl}}
                />
              </Lightbox> : null }
            </View>
          </LinearGradient>
            {!questionsList[key].isMultiple ? <></> : <View
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
                  fontSize: 16,
                  margin: 3,
                }}>
                {!questionsList[key].isMultiple
                  ? 'Single Choice'
                  : 'Multiple Choice'}
              </Text>
            </View>
          </View>}
            <View style={{alignItems: 'center', margin: 5, marginTop: 10}}>
            {questionsList[key][languageFlag && questionsList[key].questionLang ? 'optionsLang' : 'options'].map((option, index) => {
              return (
                <View
                  key={option.id}
                  style={{
                    ...styles.stayElevated,
                    borderWidth: 3,
                    borderColor: option.isSelected
                      ? 'black'
                      : 'white',
                  }}>
                  <TouchableOpacity
                    onPress={onOptionPress.bind(this, option.id)}>
                    <ElevatedView elevation={5} style={{borderRadius: 10}}>
                      <Text
                        style={{
                          ...styles.answerText,
                          color: 'black',
                        }}>
                        {option.value}
                      </Text>
                      {questionsList[key]['optionAttachmentUrl'+(index+1)] ? 
                      <Lightbox underlayColor="white" longPressCallback={() => console.log('cess')} 
                        onOpen={() => setIsOpen(true)} onClose={() => setIsOpen(false)}>
                        <Image
                          style={isOpen ? styles.containAnswerOpen : styles.containAnswer}
                          resizeMode="contain"
                          source={{uri: questionsList[key]['optionAttachmentUrl'+(index+1)]}}
                        />
                      </Lightbox> : null }
                    </ElevatedView>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
          <View
              style={{height: layoutHeight}}
              onLayout={event => {
                const layout = event.nativeEvent.layout;
                // console.log('height:', layout.height);
                // console.log('y:', layout.y);
                // console.log('dim:', Dimensions.get('window').height);
                if(layout.y + 1 < Dimensions.get('window').height){
                  setLayoutHeight(Dimensions.get('window').height - layout.y - 55)
                } 
              }}
            />
          <View
            flexDirection={'row'}
            style={{marginHorizontal: 20, justifyContent: 'space-between', marginBottom: 5}}>
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
                      color: '#555',
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
                title={key === questionsList.length - 1 ? 'Submit' : 'Next'}
                onPress={nextQuestion.bind(this, key)}
                viewStyle={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  borderColor: '#555',
                  borderWidth: 3,
                  backgroundColor: 'white',
                }}
                elementStyle={{flexDirection: 'row', justifyContent: 'center'}}
                textStyle={{ color: '#555', fontWeight: 'bold'}}
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

const renderTimer = (time, showFull = true) => {
  let minutes,
    hours = null;

  minutes = parseInt(time / 60, 10);
  hours = parseInt(minutes / 60, 10);
  let thresh = 10;
  return (
    <Text
      style={{
        fontFamily: 'Roboto-Medium',
        fontSize: time < thresh ? 15 : 15,
        margin: 5,
        fontWeight: 'bold',
        justifyContent: 'center',
        color: time < thresh ? 'red' : 'black',
      }}>
      {(time < thresh ? ('') : (!hours && !showFull ? '' : hours + ':')) +
        (minutes < 10 ? '0' + minutes : minutes) +
        ':' +
        (time % 60 < 10 ? '0' + (time % 60) : time % 60)}
    </Text>
  );
};

const renderProgressBar = (length, inFocus) => {
  let junctions = [];
  for (var i = 0; i < length; i++) {
    if (i === inFocus - 1) {
      junctions.push({key: i, color: 'orange'});
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
              borderWidth: 1,
              borderColor: 'orange',
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
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  answerText: {
    textAlign: 'left',
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    margin: 10,
  },
  contain: {
    // flex: 1,
    height: 150,
    width: Dimensions.get('window').width * 0.6,
    //marginHorizontal: Dimensions.get('window').width * 0.2
  },
  containOpen: {
    // flex: 1,
    height: '100%',
    width: Dimensions.get('window').width ,
  },
  containAnswer: {
    // flex: 1,
    height: 100,
  },
  containAnswerOpen: {
    // flex: 1,
    height: '100%',
    width: Dimensions.get('window').width ,
  },
});

export default QuizQuestionnaire;
