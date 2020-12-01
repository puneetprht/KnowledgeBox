import AsyncStorage from '@react-native-async-storage/async-storage';

/*const AsyncStorageService = () => {
return({
    setStorage: setStorage,
    getStorage: getStorage
});
};*/

export const setStorage = async (key,value) => {
    try {
        await AsyncStorage.setItem(key.toString(), JSON.stringify(value));
        return true;
      } catch (e) {
        console.log("SetStorage:",e);
        return false;
      }
};

export const getStorage = async (key) => {
    // console.log("Get Storage is called.")
    try {
        let obj = await AsyncStorage.getItem(key.toString());
        if(obj){
            return JSON.parse(obj);
        }
        return obj;
      } catch (e) {
        console.log("GetStorage:",e);
        return null;
      }
};

export const removeStorage = async (key) => {
    try {
        await AsyncStorage.removeItem(key.toString());
        return true;
      } catch (e) {
        return false;
      }
};

export const clearStorage = async () => {
    try {
        await AsyncStorage.clear();
        return true;
      } catch (e) {
        return false;
      }
};

//export default AsyncStorageService;