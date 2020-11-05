import axios from 'axios';
import * as Constants from '../constants/constants';
// Next we make an 'instance' of it
const instance = axios.create({
  // .. where we make our configurations
  baseURL: Constants.apiDomain,
  timeout: 2000,
});

/*
// Where you would set stuff like your 'Authorization' header, etc ...
instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';

// Also add/ configure interceptors && all the other cool stuff

instance.interceptors.request...
*/
export default instance;
