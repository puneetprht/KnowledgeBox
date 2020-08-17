import axios from 'axios';
// Next we make an 'instance' of it
const instance = axios.create({
	// .. where we make our configurations
	baseURL: 'http://10.0.2.2:3000'
});

/*
// Where you would set stuff like your 'Authorization' header, etc ...
instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';

// Also add/ configure interceptors && all the other cool stuff

instance.interceptors.request...
*/
export default instance;
