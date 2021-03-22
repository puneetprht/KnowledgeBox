rn-fetch-blob issue recycle warning.
	Modify these files can avoid require cycle:
	IN DIR rn-fetch-blob/polyfill
	all thease 4 files: Blob.js, Fetch.js, FileReader.js, XMLHttpRequest.js
	
	// import RNFetchBlob from '../index.js'
	import {NativeModules} from 'react-native';
	const RNFetchBlob = NativeModules.RNFetchBlob

Replace react-native-upi-payment, ./android/build.gradle
		android {
			compileSdkVersion 29
			buildToolsVersion "29.0.2"
		
			defaultConfig {
				minSdkVersion 16
				targetSdkVersion 29
				versionCode 1
				versionName "1.0"
				ndk {
					abiFilters "armeabi-v7a", "x86"
				}
			}
		}