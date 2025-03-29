import { PermissionsAndroid } from 'react-native';

export async function requestCameraPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: 'Cool Photo SmsApp Camera Permission',
                message:
                    'Cool Photo SmsApp needs access to your camera ' +
                    'so you can take awesome pictures.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK'
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
        } else {
            console.log('Camera permission denied');
        }
    } catch (err) {
        console.warn(err);
    }
}

export async function requestSmsPermissions() {
    try {
        console.log('button clicked')
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_SMS,
            {
                title: 'SMS security app',
                message: 'This app needs permissions to your sms messages' +
                    'in order to keep your personal information safe',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK'
            }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can read sms');
        } else {
            console.log('sms permission denied');
        }
    } catch (err) {
        console.warn(err);
    }
}