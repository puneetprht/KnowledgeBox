import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import * as Constants from '../../constants/constants';

const PButton = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{...props.elementStyle}}
      disabled={props.disable}>
      <View style={{...styles.button, ...props.viewStyle}}>
        <Text style={{...styles.buttonText, ...props.textStyle}}>
          {props.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

var styles = StyleSheet.create({
  button: {
    backgroundColor: Constants.textColor1,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: 'Roboto-Medium',
    fontSize: 15 ,
  },
});

export default PButton;
