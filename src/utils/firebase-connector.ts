import admin from 'firebase-admin';
import serviceAccount from '../../firebase-adminsdk.json';

admin.initializeApp({
    // @ts-ignore
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'pbp-alpha'
})

export default admin;
