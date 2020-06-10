import React from 'react';
import {View, Image, Alert} from 'react-native';
import ContainerGradient from '../../../widgets/Theme/containerGradient';
import PButton from '../../../widgets/Button/pButton';
import * as Constants from '../../../constants/constants';

const logo = require('../../../assets/iconInverted.png');
const Splash = () => {
  return (
    <ContainerGradient>
      <View
        style={{
          flex: 3,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={logo}
          style={{
            width: '60%',
          }}
          resizeMode="contain"
        />
      </View>
      <View style={{flex: 2, justifyContent: 'center'}}>
        <PButton
          title="Let's get started"
          onPress={() => Alert.alert('Simple Button pressed')}
          viewStyle={{
            backgroundColor: '#ffffff',
            width: '75%',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
          textStyle={{color: Constants.textColor1, fontFamily: 'Roboto'}}
          elementStyle={{flexDirection: 'row', justifyContent: 'center'}}
        />
      </View>
    </ContainerGradient>
  );
};

export default Splash;
