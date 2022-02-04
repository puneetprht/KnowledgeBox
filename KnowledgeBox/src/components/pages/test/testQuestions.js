/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import axios from '../../../services/axios';
import Lightbox from 'react-native-lightbox-v2';
import Icon from 'react-native-vector-icons/Octicons';
import PButton from '../../../widgets/Button/pButton';
import ElevatedView from 'react-native-elevated-view';
import IconAnt from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import * as Constants from '../../../constants/constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Dialog, Paragraph, Button} from 'react-native-paper';
import ContainerList from '../../../widgets/List/containerList';

const TestQuestionnaire = (props) => {
  const [key, setKey] = useState(0);
  const {
    testId,
    title,
    user,
    testTime,
    testInstructions,
  } = props.route.params;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [languageFlag, setLanguage] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [timeDuration, setTimeDuration] = useState(parseInt(testTime * 60));
  const [timeDelay, setTimeDelay ] = useState(1000); 
  const [layoutHeight, setLayoutHeight] = useState(0);
  var _interval = null;
  const [questionsList, setQuestionsList] = useState([]);
  const [showDialog1, setShowDialog1] = useState(false);
  const [showDialog2, setShowDialog2] = useState(false);
  var textColor = 'black';

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
        return () => clearInterval(_interval);
      }
    }, [delay]);
  }

  useEffect(() => {
    fetchTestDetail(testId);
    return () => clearInterval(_interval);
  }, [testId]);

  useInterval(() => {
    const time = parseInt(timeDuration);
      if (questionsList.length && introDone) {
      if (time <= 0) {
        setTimeDelay(null);
        submitAnswers();
      }
      else{
        const questions = JSON.parse(JSON.stringify(questionsList));
			const tempTime = questionsList[key].time;
			questions[key].time = tempTime + 1;
			setQuestionsList(questions);
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
          languageFlag: languageFlag
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
      setLayoutHeight(0);
    } else {
      setShowDialog2(true);
      //submitAnswers();
    }
    //setLanguage(false);
  };

  const prevQuestion = (index, evt) => {
    setKey(index - 1);
    setLayoutHeight(0);
    setIsSubmit(false);
    //setLanguage(false);
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

  const renderDrawer = () => {
    if (!openDrawer){
      return (<></>);
    } else {
    return (<View
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            left: 0,
            height: Dimensions.get('window').height,
          }}
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
            <TouchableOpacity
              onPress={() => {setOpenDrawer(false);}}
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                left: 0,
                backgroundColor: 'rgba(52, 52, 52, 0.6)'
              }}
            />
            <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              width: Dimensions.get('window').width * 0.5,
              backgroundColor: 'rgba(250, 240, 240, 1)',
            }}
            > 
              <Text style={{fontSize: 18}}>Marked Questions:</Text>
              <View flexDirection='row'>
                <Text>Attempted:</Text>
                <View style={{
                        backgroundColor: Constants.gradientColor1 ,
                        marginVertical: 3,
                        marginHorizontal: 3,
                        borderRadius: 10,
                        width: 20,
                        height: 20,
                        elevation: 1,
                      }}/>
                    </View>
              <View flexDirection='row'>
                <Text>Marked:</Text>
                <View style={{
                        backgroundColor: 'orange' ,
                        marginVertical: 3,
                        marginHorizontal: 3,
                        borderRadius: 10,
                        width: 20,
                        height: 20,
                        elevation: 1,
                      }}/>
              </View>
              <ScrollView>
                <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                }}>
                { questionsList.map((question, index) => {
                  return (
                  <TouchableOpacity key={index} onPress={() => setKey(index)}
                    style={{position: 'relative'}}
                  >
                    {/* <IconAnt
                      name={question.isMarked ? 'star' : 'staro'}
                      size={45}
                      style={{
                        color: question.isMarked ? 'orange' : 'black',
                        marginHorizontal: 12,
                        marginVertical: 5,
                        elevation: 1,
                      }}
                      elevatedElement= {{
                        elevation: 3, // works on android
                      }}
                    /> */}
                    <View style={{
                        backgroundColor: question.isMarked ? 'orange' : (question.selectedAnswer.length ? Constants.gradientColor1 : 'white'),
                        marginVertical: 3,
                        marginHorizontal: 3,
                        borderRadius: 20,
                        width: 40,
                        height: 40,
                        elevation: 1,
                      }}/>
                    <Text style={{
                      position: 'absolute',
                      fontSize:20,
                      color: question.isMarked ?  'white' : 'black',
                      fontWeight: '500',
                      top: 10,
                      left: index > 9 ? 14 : 18,
                      elevation: 2,
                      }}>
                        {index+1}
                      </Text>
                  </TouchableOpacity>
                  );
                })
                }
                {/* { questionsList.filter(q => q.isMarked).length === 0 ?
                <Text style={{fontSize: 18}}>No Marked Question!</Text> : null } */}
                </View>
              </ScrollView>
            </View>
      </View>);
    }
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
                // marginBottom: 5,
                paddingBottom: 5,
                marginTop: 20,
                marginHorizontal: 20,
                backgroundColor: 'white',
              }}>
              <View flexDirection="row" justifyContent="space-between">
                <Text style={{fontFamily: 'Roboto-Medium', fontSize: 15}}>
                  Time Duration: {testTime} mins.
                </Text>
                <Text style={{fontFamily: 'Roboto-Medium', fontSize: 15}}>
                  Maximum Marks:{' '}
                  {questionsList[questionsList.length - 1].maxMarks}
                </Text>
              </View>
              <View style={{marginVertical: 15}}>
                <View
                    // style={{
                    //   position: 'absolute',
                    //   alignSelf: 'flex-end',
                    //   marginTop: 5,
                    //   paddingLeft: 15,
                    // }}
                    flexDirection="row">
                    <Text
                      style={{
                        fontFamily: 'Roboto-Medium',
                        textAlignVertical:'center',
                        fontSize: 14,
                        color: Constants.success,
                      }}>
                      Positive Marking:{' '}
                    </Text>
                    <Text
                      style={{
                        marginLeft: 1,
                        // fontFamily: 'Roboto-Medium',
                        fontSize: 15,
                        textAlignVertical:'center',
                        color: Constants.success,
                      }}>
                      {questionsList[0].weightage}
                    </Text>
                    <Text
                      style={{
                        marginLeft: 10,
                        fontFamily: 'Roboto-Medium',
                        fontSize: 14,
                        textAlignVertical:'center',
                        color: Constants.error,
                      }}>
                      Negative Marking:{' '}
                    </Text>
                    <Text
                      style={{
                        marginLeft: 1,
                        // fontFamily: 'Roboto-Medium',
                        fontSize: 15,
                        textAlignVertical:'center',
                        color: Constants.error,
                      }}>
                      {questionsList[0].negativeWeightage}
                    </Text>
                  </View>
              </View>
              {testInstructions.split('\n').map((line) => {
                return (
                  <Text
                    key={line}
                    style={{
                      color: 'grey',
                      fontFamily: 'Roboto-Medium',
                      fontSize: 13,
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
                  borderColor: '#555',
                  borderWidth: 3,
                  backgroundColor: 'white',
                }}
                elementStyle={{flexDirection: 'row', justifyContent: 'center'}}
                textStyle={{ color: '#555', fontWeight: 'bold'}}
              />
            </ScrollView>
          </ContainerList>
        ) : (
          <ScrollView>
            <LinearGradient
              colors={['#FFF', '#FFF']}
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
                        color: '#555',
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        flex: 1,
                        fontFamily: 'Roboto-Medium',
                        fontSize: 18,
                      }}>
                      {title}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setOpenDrawer(true)}
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
                        color: '#555',
                        marginHorizontal: 15,
                        marginVertical: 5,
                      }}
                    />
                  </TouchableOpacity>
                  <View style={{position: 'absolute', paddingLeft: 15}}>
                    <TouchableOpacity onPress={() => setShowDialog1(true)}>
                      <Icon
                        name="chevron-left"
                        style={{color: '#555'}}
                        size={25}
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
                      fontSize: 14,
                      marginTop: 10,
                      marginLeft: 10,
                      color: textColor,
                    }}>
                    Question {questionsList[key].count}
                  </Text>
                  <View
                    style={{
                      position: 'absolute',
                      marginLeft: 10,
                      marginTop: 5,
                    }}
                    flexDirection="row">
                    {renderTimer(questionsList[key].time, false)}
                    {/* <Text
                      style={{
                        marginLeft: 5,
                        fontFamily: 'Roboto-Medium',
                        textAlignVertical:'center',
                        fontSize: 15,
                        marginTop: 3,
                        color: Constants.success,
                      }}>
                      {' '}
                      +{' '}
                    </Text>
                    <Text
                      style={{
                        marginLeft: 1,
                        marginTop: 5,
                        fontFamily: 'Roboto-Medium',
                        fontSize: 15,
                        textAlignVertical:'center',
                        color: Constants.success,
                      }}>
                      {questionsList[key].weightage}
                    </Text> */}
                  </View>
                  <View
                    style={{
                      position: 'absolute',
                      alignSelf: 'flex-end',
                      marginTop: 5,
                      paddingLeft: 15,
                    }}
                    flexDirection="row">
                    {/* <Text
                      style={{
                        marginLeft: 10,
                        fontFamily: 'Roboto-Medium',
                        fontSize: 15,
                        textAlignVertical:'center',
                        color: Constants.error,
                      }}>
                      {' '}
                      -{' '}
                    </Text>
                    <Text
                      style={{
                        marginLeft: 1,
                        marginTop: 5,
                        fontFamily: 'Roboto-Medium',
                        fontSize: 15,
                        textAlignVertical:'center',
                        color: Constants.error,
                      }}>
                      {questionsList[key].negativeWeightage}
                    </Text> */}
                    <TouchableOpacity onPress={() => markReview()}>
                      <IconAnt
                        name={questionsList[key].isMarked ? 'star' : 'staro'}
                        size={25}
                        style={{
                          color: questionsList[key].isMarked ? 'orange' : 'white',
                          marginHorizontal: 12,
                          marginVertical: 5,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text
                  style={{
                    fontFamily: 'Roboto-Medium',
                    fontSize: 15,
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
            {!questionsList[key].isMultiple ? <></> : 
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
                    fontSize: 15,
                    margin: 3,
                  }}>
                  {!questionsList[key].isMultiple
                    ? 'Single Choice'
                    : 'Multiple Choice'}
                </Text>
              </View>
            </View>}
            <View style={{alignItems: 'center', margin: 5, marginTop: 10}}>
              {questionsList[key][languageFlag  && questionsList[key].questionLang ? 'optionsLang' : 'options'].map(
                (option, index) => {
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
                },
              )}
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
              <View>
                <PButton
                  title={
                    questionsList[key].isMarked ? 'Unmark' : 'Mark for Review'
                  }
                  onPress={markReview.bind(this)}
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
                    borderColor: '#555',
                    borderWidth: 3,
                    backgroundColor: 'white',
                  }}
                  elementStyle={{flexDirection: 'row', justifyContent: 'center'}}
                  textStyle={{ color: '#555', fontWeight: 'bold'}}
                />
              )}
            </View>
            {renderDrawer()}
            <Dialog visible={showDialog1} onDismiss={() => setShowDialog1(false)}>
              <Dialog.Title>Exit Test</Dialog.Title>
              <Dialog.Content>
                {/* <Paragraph>Time left: </Paragraph>
                <Paragraph>Questions Attempted: </Paragraph>
                <Paragraph>Questions marked:</Paragraph>
                <Paragraph>Total Questions: </Paragraph> */}
                <Paragraph>Are you sure you want to exit? All your progress would be lost.</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setShowDialog1(false)}>Cancel</Button>
                <Button onPress={() => props.navigation.goBack()}>Exit</Button>
              </Dialog.Actions>
            </Dialog>
            {<Dialog visible={showDialog2} onDismiss={() => setShowDialog2(false)}>
              <Dialog.Title>Submit Test</Dialog.Title>
              <Dialog.Content>
                <Paragraph>Time left: {renderTimer(timeDuration)}</Paragraph>
                <Paragraph>Questions Attempted:  {questionsList.filter(q => q.selectedAnswer.length).length}</Paragraph>
                <Paragraph>Questions marked: {questionsList.filter(q => q.isMarked).length}</Paragraph>
                <Paragraph>Total Questions:  {questionsList.length}</Paragraph>
                <Paragraph>Are you sure you want to submit?</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setShowDialog2(false)}>Cancel</Button>
                <Button onPress={() => {submitAnswers();
                                        setShowDialog2(false);}}>Submit</Button>
              </Dialog.Actions>
            </Dialog>}
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
      {(time < thresh?(''):(!hours && !showFull ? '' : hours + ':'))+
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
    margin: 5,
    //padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  answerText: {
    textAlign: 'left',
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    fontWeight: 'bold',
    margin: 10,

    //color:
  },
  contain: {
    // flex: 1,
    height: 150,
    width: Dimensions.get('window').width * 0.6,
    // marginHorizontal: Dimensions.get('window').width * 0.2
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

export default TestQuestionnaire;
