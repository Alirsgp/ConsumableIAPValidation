import * as functions from "firebase-functions";
import {HttpsFunction} from "firebase-functions";
import fetch from "cross-fetch";
import jwt from 'jsonwebtoken';
import * as fs from 'fs';

export const verifyConsumableIAPSandbox = () : CallableFunction =>
  functions.https.onCall((data, context: functions.https.CallableContext) => {
    return new Promise(async function(resolve, reject) {
        const transactionID = data.transactionID;
        const url = `https://api.storekit-sandbox.itunes.apple.com/inApps/v2/transactions/${transactionID}`;
        const teamId = '2NPE543ARD';
        const keyId = 'D36C28VNPA';
        const payload = {
            iss: teamId,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
          };
          
          const privateKey = fs.readFileSync("AuthKey_D36C28VNPA.p8");
          const token = jwt.sign(payload, privateKey, {
            algorithm: 'ES256',
            keyid: keyId,
          });
        console.log(`Transaction id is ${transactionID}`);
        fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
        resolve(200);
    });
});
