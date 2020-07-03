/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import ContainerList from '../../../widgets/List/containerList';
import PButton from '../../../widgets/Button/pButton';
import {TouchableOpacity} from 'react-native-gesture-handler';

const TopicList = props => {
  let Topics = [
    {id: 1, name: 'CGL'},
    {id: 2, name: 'UPSC'},
    {id: 3, name: 'RRB'},
    {id: 4, name: 'Bank'},
    {id: 5, name: 'Forest'},
    {id: 6, name: 'SSC'},
    {id: 7, name: 'Income Tax'},
    {id: 8, name: 'Railways'},
    {id: 9, name: 'Metro'},
    {id: 10, name: 'Others'},
  ];

  const [selectedTopic, setSelectedTopic] = useState([]);

  const selectTopic = (index, evt) => {
    const state = Array.from(selectedTopic);
    setSelectedTopic([...state, index]);
  };

  const continueForm = (index, evt) => {
    props.navigation.navigate('Tabs');
  };

  return (
    <ContainerList title="Title" onPress={() => props.navigation.goBack()}>
      <ScrollView style={{marginBottom: 50}}>
        <View style={styles.container}>
          {Topics.map(Topic => {
            return (
              <View key={Topic.id} style={styles.boxSimple}>
                <TouchableOpacity
                  onPress={() => {
                    selectTopic.bind(this, Topic.id);
                  }}>
                  <Text>{Topic.name}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        <PButton
          title="Continue"
          onPress={() => continueForm()}
          viewStyle={{
            width: '75%',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
          elementStyle={{flexDirection: 'row', justifyContent: 'center'}}
        />
      </ScrollView>
    </ContainerList>
  );
};

const styles = StyleSheet.create({
  boxSimple: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#000',
    marginTop: 10,
    marginLeft: 10,
    height: Dimensions.get('window').width * 0.45,
    width: Dimensions.get('window').width * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    marginHorizontal: 10,
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    //justifyContent: 'space-around',
  },
  block: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TopicList;
