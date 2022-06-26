import * as functions from "firebase-functions";
import {mintTokens} from "./mint";

exports.mintTokensTrigger = functions.runWith({ timeoutSeconds: 540, memory: '4GB' }).firestore
    .document('/forms/{docID}')
    .onCreate(mintTokens);