/**
 * Sample Firebase upload app
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  CameraRoll,
  Platform,
  Dimensions,
  Image,
} from 'react-native';

import RNTest from 'react-native-testkit'
import RNFetchBlob from 'react-native-fetch-blob'
import firebase from 'firebase'

const fs = RNFetchBlob.fs
const Blob = RNFetchBlob.polyfill.Blob

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

const { Assert, Comparer, Info, prop } = RNTest
const dirs = RNFetchBlob.fs.dirs
const prefix = ((Platform.OS === 'android') ? 'file://' : '')
const testImageName = `image-from-react-native-${Platform.OS}-${new Date()}.png`
const testFile = null

const API_KEY = ''
const APP_NAME = ''
const EMAIL = ''
const PASSWORD = ''

// Initialize Firebase
const config = {
  apiKey: API_KEY
  authDomain: `${APP_NAME}.firebaseapp.com`,
  databaseURL: `https://${APP_NAME}.firebaseio.com`,
  storageBucket: `${APP_NAME}.appspot.com`,
};
const describe = RNTest.config({
  run : true,
  expand : true,
  timeout : 30000,
})

firebase.initializeApp(config);

describe('prepare test image', (report, done) => {

// prepare upload image
RNFetchBlob
  .config({ fileCache : true, appendExt : 'png' })
  .fetch('GET', 'https://avatars0.githubusercontent.com/u/5063785?v=3&s=460')
  .then((resp) => {
    testFile = resp.path()
    report(
      <Info key="test image" >
        <Image
          style={{ height : 256, width : 256, alignSelf : 'center' }}
          source={{ uri : prefix + testFile }}/>
      </Info>)
    done()
  })
})

describe('firebase login', (report, done) => {
  firebase.auth()
          .signInWithEmailAndPassword(EMAIL, PASSWORD)
          .catch((err) => {
            console.log('firebase sigin failed', err)
          })

  firebase.auth().onAuthStateChanged((user) => {
    report(
      <Assert key="login status" uid="100"
        expect={true}
        actual={user !== null}/>,
      <Info key="user content" uid="user data">
        <Text>{JSON.stringify(user)}</Text>
      </Info>)
    done()
  })
})


describe('upload file to firebase', (report, done) => {
  // create Blob from BASE64 data
  let blob = new Blob(RNFetchBlob.wrap(testFile), { type : 'image/png;BASE64'})
  // Blob creation is async, start upload task after it created
  blob.onCreated(() => {
    // upload image using Firebase SDK
    return firebase.storage()
      .ref('rn-firebase-upload')
      .child(testImageName)
      .put(blob, { contentType : 'image/png' })
      .then((snapshot) => {
        report(
          <Assert key="upload success"
            expect={true}
            actual={true}/>,
          <Info key="uploaded file stat" >
            <Text>{snapshot.totalBytes}</Text>
            <Text>{JSON.stringify(snapshot.metadata)}</Text>
          </Info>)
        blob.close()
        done()
      })
  })
})

describe('display firebase storage item', (report, done) => {
  firebase
    .storage()
    .ref('rn-firebase-upload/' + testImageName)
    .getDownloadURL().then((url) => {
      report(
      <Info key="verify the result">
        <Image
          style={{ alignSelf : 'center', height : 256, width : 256 }}
          source={{ uri : url }}/>
      </Info>)
      done()
    })
})

describe('download and display uploaded item', (report, done) => {
  firebase
    .storage()
    .ref('rn-firebase-upload/' + testImageName)
    .getDownloadURL()
    .then((url) => {
        RNFetchBlob
        .config({ fileCache : true, appendExt : 'jpg' })
        .fetch('GET', url)
        .then((resp) => {
          report(
            <Info key={resp.path()}>
              <Image
                style={{ alignSelf : 'center', height : 256, width : 256 }}
                source={{ uri : prefix + resp.path() }}/>
            </Info>)
          done()
        })
    })
})

class RNFirebaseUploadSample extends Component {
  constructor(props) {
      super(props)
    }

    componentDidMount() {
      RNTest.run(this)
    }

    render() {
      return <RNTest.Reporter />
    }
}

AppRegistry.registerComponent('RNFirebaseUploadSample', () => RNFirebaseUploadSample);
