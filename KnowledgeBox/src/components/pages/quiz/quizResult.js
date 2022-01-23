/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Lightbox from 'react-native-lightbox-v2';
import PButton from '../../../widgets/Button/pButton';
import ElevatedView from 'react-native-elevated-view';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import * as Constants from '../../../constants/constants';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

const QuizResult = (props) => {
  const {questionsList, languageFlag} = props.route.params;
  const [displaylist, setDisplayList] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const correctAnswers = () => {
    let correct = 0;
    questionsList.forEach((element) => {
      if (element.selectedAnswer.toString() === element.correctOption) {
        correct++;
      }
    });
    return correct;
  };

  const calculateScore = () => {
    return parseFloat(
      ((correctAnswers() / questionsList.length) * 100).toFixed(2),
    );
  };

  const openDetail = (index, evt) => {
    props.navigation.navigate('VIDEO', {
      screen: 'VideoPlayback',
      params: {videoId: index,
        title: 'Solution'},
    });
  };

  const winnerStar = require('../../../assets/winnerStar.png');
  const winnerTrophy = require('../../../assets/winnerTrophy.png');

  return (
    <ScrollView style={{marginBottom: 30}}>
      <View>
        <View style={{ justifyContent: 'center', marginTop: 10}}>
          <Text
            style={{
              textAlign: 'center',
              textAlignVertical: 'center',
              flex: 1,
              fontFamily: 'Roboto-Medium',
              fontSize: 18,
            }}>
            Result and Explanation
          </Text>
          <View style={{position: 'absolute', paddingLeft: 15}}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('QuizHome')}>
              <Icon name="chevron-left" size={25} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{alignItems: 'center'}}>
        <LinearGradient
          colors={[
            Constants.gradientColorTheme1,
            Constants.gradientColorTheme2,
          ]}
          style={styles.scoreBox}>
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Text
              style={{
                fontFamily: 'Roboto-Medium',
                fontSize: 22,
                color: 'white',
              }}>
              Your Score
            </Text>
            <Text
              style={{
                fontFamily: 'Roboto-Medium',
                fontSize: 35,
                color: 'white',
              }}>
              {correctAnswers()}/{questionsList.length}
            </Text>
          </View>
          <View
            flexDirection="row"
            style={{marginHorizontal: 10, justifyContent: 'space-between'}}>
            <Image source={winnerStar} />
            <Image source={winnerStar} />
          </View>
          <View
            flexDirection="row"
            style={{marginTop: 40, justifyContent: 'center'}}>
            <Image source={winnerTrophy} style={{position: 'absolute'}} />
            <Text
              style={{
                marginTop: 10,
                fontFamily: 'Roboto-Medium',
                fontSize: 18,
                color: 'white',
                position: 'absolute',
              }}>
              {calculateScore()}%
            </Text>
            <View style={{margin: -30, position: 'absolute'}}>
              <AnimatedCircularProgress
                size={150}
                width={10}
                fill={parseInt(calculateScore())}
                rotation={360}
                tintColor="#ffffff"
                backgroundColor="#6b6b6b"
              />
            </View>
          </View>
        </LinearGradient>
        <View>
          <PButton
            title={!displaylist ? 'Check Answers' : 'Hide Answers'}
            onPress={() => setDisplayList(!displaylist)}
            viewStyle={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}
            elementStyle={{flexDirection: 'row', justifyContent: 'center'}}
          />
        </View>
        <View style={{width: '90%',marginTop: 15}}>
        {displaylist ? (
          questionsList.map((question) => {
            return (
              <ElevatedView
                key={question.id}
                elevation={5}
                style={{borderRadius: 15, marginBottom: 20, padding: 10}}>
                <Text
                  style={{
                    //margin: 10,
                    color: Constants.textColor1,
                    fontFamily: 'Roboto-Medium',
                    fontSize: 15,
                    borderBottomColor: Constants.textColor1,
                    paddingBottom: 5,
                    borderBottomWidth: 1,
                  }}>
                  {languageFlag && question.questionLang
                    ? question.questionLang
                    : question.question}
                </Text>
                {question.questionAttachmentUrl ?
                <Lightbox underlayColor="white" longPressCallback={() => console.log('cess')} 
                onOpen={() => setIsOpen(true)} onClose={() => setIsOpen(false)}>
                  <Image
                    style={isOpen ? styles.containOpen : styles.contain}
                    resizeMode="contain"
                    source={{uri: question.questionAttachmentUrl}}
                  />
                </Lightbox> : null }
                <View style={{alignItems: 'center'}}>
                  {question[languageFlag && question.questionLang ? 'optionsLang' : 'options'].map((option, index) => {
                    return (
                      <View
                        key={option.id}
                        style={{
                          ...styles.stayElevated,
                          borderWidth: 3,
                          borderColor: option.isSelected
                            ? question.correctOption.includes(option.id)
                              ? Constants.success
                              : Constants.error
                            : 'white',
                        }}>
                        <ElevatedView elevation={2} style={{borderRadius: 10}}>
                          <View><Text
                            style={{
                              ...styles.answerText,
                              color: Constants.textColor1,
                            }}>
                            {option.value}
                          </Text>
                          {question.correctOption.includes(option.id) ? (
                            <Icon
                              name="check"
                              style={{
                                flex: 1,
                                marginTop: 12,
                                paddingLeft: 5,
                                color: Constants.success,
                                position: 'absolute',
                                justifyContent: 'center',
                                alignSelf: 'flex-end',
                                padding: 2,
                              }}
                              size={15}
                            />
                          ) : (
                            <View />
                          )}
                          </View>
                          {question['optionAttachmentUrl' + (index + 1)] ?
                          <Lightbox underlayColor="white" longPressCallback={() => console.log('cess')} 
                        onOpen={() => setIsOpen(true)} onClose={() => setIsOpen(false)}>
                        <Image
                          style={isOpen ? styles.containAnswerOpen : styles.containAnswer}
                          resizeMode="contain"
                          source={{uri: question['optionAttachmentUrl'+(index+1)]}}
                        />
                      </Lightbox> : null }
                        </ElevatedView>
                      </View>
                    );
                  })}
                </View>
                {question[languageFlag && question.explainationLang ? 'explainationLang' : 'explaination'] || question.expAttachmentUrl ? (
                  <View>
                    <Text
                      style={{
                        color: Constants.textColor1,
                        fontFamily: 'Roboto-Medium',
                        fontSize: 15,
                      }}>
                      {languageFlag && question.explainationLang? 'विवरण:':'Explanation:' } {question[languageFlag && question.explainationLang ? 'explainationLang' : 'explaination']}
                    </Text>
                  </View>
                ) : (
                  <View />
                )}
                {question.expAttachmentUrl ?
                  <Lightbox underlayColor="white" longPressCallback={() => console.log('cess')} 
                    onOpen={() => setIsOpen(true)} onClose={() => setIsOpen(false)}>
                    <Image
                      style={isOpen ? styles.containAnswerOpen : styles.containAnswer}
                      resizeMode="contain"
                      source={{uri: question.expAttachmentUrl}}
                    />
                  </Lightbox>
                : null}
                {question.videoUrlId ? (
                  <View flexDirection="row">
                    <Text
                      style={{
                        color: Constants.textColor1,
                        fontFamily: 'Roboto-Medium',
                        fontSize: 15,
                        marginTop: 8,
                      }}>
                      Video Solution:{' '}
                    </Text>
                    <PButton
                      title="Watch"
                      onPress={openDetail.bind(this, question.videoUrlId)}
                      viewStyle={(styles.button, {marginLeft: 10})}
                      textStyle={{fontFamily: 'Roboto-Medium', fontSize: 14}}
                      elementStyle={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}
                    />
                  </View>
                ) : (
                  <View />
                )}
              </ElevatedView>
            );
          })
        ) : (
          <View />
        )}
      </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  stayElevated: {
    width: '100%',
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  answerText: {
    textAlign: 'left',
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    //fontWeight: 'bold',
    margin: 10,
  },
  scoreBox: {
    minHeight: 365,
    //height: Dimensions.get('window').width * 0.85,
    width: Dimensions.get('window').width * 0.85,
    marginVertical: 15,
    borderRadius: 15,
  },
  contain: {
    // flex: 1,
    height: 150,
    width: Dimensions.get('window').width * 0.6,
    marginHorizontal: Dimensions.get('window').width * 0.2
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

export default QuizResult;
