import './shim'
import AWS from 'aws-sdk'
import AWSIoTData from 'aws-iot-device-sdk'
import { Text, View } from 'react-native';
import React from 'react'

const awsConfig = {
  identityPoolId: 'us-east-1:e98e0875-957d-4eb8-9188-036b12aa85ec',
  mqttEndpoint: `a5jlh5mgikrwc-ats.iot.us-east-1.amazonaws.com`,
  region: 'us-east-1',
  clientId: '3mda5opn49lsutvsbu390vmt12',
  userPoolId: 'us-east-1_Hg857HnGJ'
}
console.log(awsConfig)

const mqttClient = AWSIoTData.device({
  region: awsConfig.region,
  host: awsConfig.mqttEndpoint,
  clientId: awsConfig.clientId,
  protocol: 'wss',
  // maximumReconnectTimeMs: 5000,
  debug: false,
  accessKeyId: '',
  secretKey: '',
  sessionToken: '',
  isTrusted: true
})

AWS.config.region = awsConfig.region;

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: awsConfig.identityPoolId
})

AWS.config.credentials.get((err) => {
  if (err) {
    console.log(AWS.config.credentials);
    throw err;
  } else {
    mqttClient.updateWebSocketCredentials(
      AWS.config.credentials.accessKeyId,
      AWS.config.credentials.secretAccessKey,
      AWS.config.credentials.sessionToken
    )
  }
})

mqttClient.on('connect', () => {
  console.log('Connected To IoT Client')
  mqttClient.subscribe('real-time-weather')
})

mqttClient.on('error', (err) => {
  console.log(err)
})

mqttClient.on('message', (topic, payload) => {
  const msg = JSON.parse(payload.toString());
  console.log(msg)
})

const App = () => {
  return (
    <View>
      <Text>
        RealTime Weather
      </Text>
    </View>
  )
}

export default App;