/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import IconAnt from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import * as Constants from '../../../constants/constants';
import PButton from '../../../widgets/Button/pButton';
import ElevatedView from 'react-native-elevated-view';
import axios from '../../../services/axios';
import {SafeAreaView} from 'react-native-safe-area-context';
import ContainerList from '../../../widgets/List/containerList';

const TestQuestionnaire = (props) => {
  const [key, setKey] = useState(0);
  const {
    testId,
    title,
    user,
    catergoryId,
    testTitle,
    testTime,
    testInstructions,
  } = props.route.params;
  const [isSubmit, setIsSubmit] = useState(false);
  const [languageFlag, setLanguage] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [timeDuration, setTimeDuration] = useState(parseInt(testTime * 60));

  const [questionsList, setQuestionsList] = useState([]);
  let interrupt = useRef();

  const fetchTestDetail = (testId) => {
    axios
      .get('/test/getTestDetail', {
        params: {
          id: testId,
        },
      })
      .then((response) => {
        if (response.data) {
          setQuestionsList(response.data);
          setTimer();
        } else {
          setQuestionsList([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchTestDetail(testId);

    return () => {
      clearInterval(interrupt.current);
    };
  }, [introDone]);

  const setTimer = () => {
    interrupt = setInterval(() => {
      const time = parseInt(timeDuration);
      //if (introDone && questionsList.length) {
      setTimeDuration((time) => time - 1);
      /*const questions = JSON.parse(JSON.stringify(questionsList));
			const tempTime = questionsList[key].time;
			questions[key].time = tempTime + 1;
			setQuestionsList(questions);*/
      //}
      if (parseInt(time) == 60) {
        Alert.alert('Will auto-submit the test once time is over.');
      }
      if (time <= 0) {
        clearInterval(interrupt.current);
      }
    }, 1000);
  };

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
      answer.testDetailId = questionsList[i].id;
      answer.isCorrect =
        questionsList[i].selectedAnswer.toString() ===
        questionsList[i].correctOption;
      submitAnswers.push(answer);
    }
    axios
      .post('/test/postTestAnswers', {
        testId: testId,
        userId: user.id,
        score: calculateScore(),
        answers: submitAnswers,
      })
      .then((response) => {
        setIsSubmit(false);
        props.navigation.navigate('TestResult', {
          questionsList: questionsList,
        });
      })
      .catch((err) => {
        setIsSubmit(false);
        console.log(err);
      });
  };

  const nextQuestion = (index, evt) => {
    if (index < questionsList.length - 1) {
      setKey(index + 1);
    } else {
      submitAnswers();
    }
    setLanguage(false);
  };

  const prevQuestion = (index, evt) => {
    setKey(index - 1);
    setIsSubmit(false);
    setLanguage(false);
  };

  const markStar = () => {
    const questions = JSON.parse(JSON.stringify(questionsList));
    questions[key].isStar = !questions[key].isStar;
    setQuestionsList(questions);
  };

  const openSideMenu = () => {};

  const markReview = () => {
    const questions = JSON.parse(JSON.stringify(questionsList));
    questions[key].isMarked = !questions[key].isMarked;
    setQuestionsList(questions);
  };

  return (
    <SafeAreaView>
      {questionsList.length ? (
        !introDone ? (
          <ContainerList
            title={title}
            onPress={() => props.navigation.goBack()}
            style={{justifyContent: 'center', backgroundColor: 'white'}}>
            <ScrollView
              style={{
                marginBottom: 30,
                marginTop: 20,
                marginHorizontal: 20,
                backgroundColor: 'white',
              }}>
              <View flexDirection="row" justifyContent="space-between">
                <Text style={{fontFamily: 'Roboto-Medium', fontSize: 18}}>
                  Time Duration: {testTime} mins.
                </Text>
                <Text style={{fontFamily: 'Roboto-Medium', fontSize: 18}}>
                  Maximum Marks:{' '}
                  {questionsList[questionsList.length - 1].maxMarks}
                </Text>
              </View>
              {testInstructions.split('\n').map((line) => {
                return (
                  <Text
                    key={line}
                    style={{
                      color: 'grey',
                      fontFamily: 'Roboto-Medium',
                      fontSize: 16,
                    }}>
                    * {line}
                  </Text>
                );
              })}
              <PButton
                title={'Agree & Continue'}
                onPress={() => setIntroDone(true)}
                viewStyle={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 20,
                }}
                elementStyle={{flexDirection: 'row', justifyContent: 'center'}}
              />
            </ScrollView>
          </ContainerList>
        ) : (
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
                  <View>
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
                  </View>
                  <TouchableOpacity
                    onPress={() => openSideMenu()}
                    style={{
                      position: 'absolute',
                      justifyContent: 'center',
                      alignSelf: 'flex-end',
                      paddingLeft: 5,
                    }}>
                    <Icon
                      name="three-bars"
                      size={25}
                      style={{
                        color: 'white',
                        marginHorizontal: 15,
                        marginVertical: 5,
                      }}
                    />
                  </TouchableOpacity>
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
              <View style={{marginTop: 0}}>
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
              <View style={{justifyContent: 'center', marginTop: 10}}>
                <View>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontFamily: 'Roboto-Medium',
                      fontSize: 20,
                      marginTop: 10,
                      color: 'white',
                    }}>
                    Question {questionsList[key].count}
                  </Text>
                  <View
                    style={{
                      position: 'absolute',
                      marginLeft: 10,
                      marginTop: 5,
                    }}>
                    {renderTimer(questionsList[key].time, false)}
                  </View>
                  <View
                    style={{
                      position: 'absolute',
                      alignSelf: 'flex-end',
                      marginTop: 5,
                      paddingLeft: 15,
                    }}
                    flexDirection="row">
                    <Text
                      style={{
                        marginLeft: 5,
                        fontFamily: 'Roboto-Medium',
                        fontSize: 20,
                        marginTop: 3,
                        color: 'white',
                      }}>
                      {' '}
                      +{' '}
                    </Text>
                    <Text
                      style={{
                        marginLeft: 1,
                        marginTop: 5,
                        fontFamily: 'Roboto-Medium',
                        fontSize: 17,
                        color: 'white',
                      }}>
                      {questionsList[key].weightage}
                    </Text>
                    <Text
                      style={{
                        marginLeft: 10,
                        fontFamily: 'Roboto-Medium',
                        fontSize: 25,
                        color: 'white',
                      }}>
                      {' '}
                      -{' '}
                    </Text>
                    <Text
                      style={{
                        marginLeft: 1,
                        marginTop: 5,
                        fontFamily: 'Roboto-Medium',
                        fontSize: 17,
                        color: 'white',
                      }}>
                      {questionsList[key].negativeWeightage}
                    </Text>
                    <TouchableOpacity onPress={() => markStar()}>
                      <IconAnt
                        name={questionsList[key].isStar ? 'star' : 'staro'}
                        size={25}
                        style={{
                          color: questionsList[key].isStar ? 'orange' : 'white',
                          marginHorizontal: 12,
                          marginVertical: 5,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontFamily: 'Roboto-Medium',
                    fontSize: 18,
                    margin: 10,
                    color: 'white',
                  }}>
                  {languageFlag
                    ? questionsList[key].questionLang
                    : questionsList[key].question}
                </Text>
              </View>
            </LinearGradient>
            <View
              style={{
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '60%',
                  backgroundColor: 'orange',
                  borderBottomRightRadius: 15,
                  borderBottomLeftRadius: 15,
                }}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'Roboto-Medium',
                    fontSize: 18,
                    margin: 3,
                  }}>
                  {!questionsList[key].isMultiple
                    ? 'Single Choice'
                    : 'Multiple Choice'}
                </Text>
              </View>
            </View>
            <View style={{alignItems: 'center', margin: 10, marginTop: 15}}>
              {questionsList[key][languageFlag ? 'optionsLang' : 'options'].map(
                (option) => {
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
                },
              )}
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
              <View>
                <PButton
                  title={
                    questionsList[key].isMarked ? 'Unmark' : 'Mark for Review'
                  }
                  onPress={markReview.bind(this)}
                  viewStyle={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                  elementStyle={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                />
              </View>
              {isSubmit ? (
                <View
                  style={{justifyContent: 'center', alignContent: 'center'}}>
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
                  elementStyle={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                />
              )}
            </View>
          </ScrollView>
        )
      ) : (
        <View style={{justifyContent: 'center', alignContent: 'center'}}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </SafeAreaView>
  );
};

const renderTimer = (time, showFull = true) => {
  let minutes,
    hours = null;

  minutes = parseInt(time / 60);
  hours = parseInt(minutes / 60);

  return (
    <Text
      style={{
        fontFamily: 'Roboto-Medium',
        fontSize: 20,
        margin: 5,
        fontWeight: 'bold',
        justifyContent: 'center',
        color: 'white',
      }}>
      {(!hours && !showFull ? '' : hours + ':') +
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
      junctions.push({key: i, color: 'yellow'});
    } else {
      junctions.push({key: i, color: 'white'});
    }
  }
  return (
    <View
      style={{
        width: '50%',
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
              marginTop: 5,
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
    fontWeight: 'bold',
    margin: 10,

    //color:
  },
});

export default TestQuestionnaire;
