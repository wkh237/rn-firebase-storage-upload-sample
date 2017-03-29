# React Native Firebase Storage Upload Sample

This sample app demonstrates how to use [react-native-fetch-blob](https://github.com/wkh237/react-native-fetch-blob)
along with firebase SDK to upload file to Firebase storage. Though React
Native does not support Blob object, with help of react-native-fetch-blob
polyfill you're able to do this.

**NOTICE: We've corrected XMLHttpRequest in `react-native-fetch-blob@0.9.6` implementation if you are using previous version please upgrade react-native-fetch-blob to `0.9.6` to fix login and realtime database error**

## prerequisite

- react-native-cli installed

## How to use

Clone the repository and execute the following command

```
$ npm install && react-native link
```

Then run React Native app as usual

## More Information

Web polyfills of react-native-fetch-blob is still in development, more Information
about the project and document, please visit [the wiki](https://github.com/wkh237/react-native-fetch-blob/wiki/Web-API-Polyfills-(experimental)).
