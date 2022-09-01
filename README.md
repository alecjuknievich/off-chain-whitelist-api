# express_docker
Express Typescript Docker Container for managing off chain solidity whitelist in firebase

This API creates coupon/vouchers for smart contracts and provides routes for getting coupons for smart contract web apps

First create a firebase project and enable firestore. Then from the dashboard generate a private key for the service account on the project. Add the json file to the root of this repo and rename it firebase-adminsdk.json

The create another json file in the project root named allow-list-admin.json in this file the token for admin headers

Finally create admin-signer.json in the project root and add the generated private key for signing



