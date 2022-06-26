import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

export async function mintTokens (documentSnapshot: admin.firestore.DocumentSnapshot, context: functions.EventContext) {

   const interactionData = documentSnapshot.data();
   functions.logger.log(`JSON.stringify(interactionData): ${JSON.stringify(interactionData)}`)

    const network = interactionData.network;
    const referrerAddress = interactionData.referrerAddress;
    const referredAddress = interactionData.referredAddress;
    const maxPossibleScore = interactionData.maxPossibleScore;
    const totalScore = interactionData.totalScore;

    functions.logger.log(`referrerAddress: ${referrerAddress}. maxPossibleScore: ${maxPossibleScore}. totalScore: ${totalScore}. referredAddress: ${referredAddress}. network: ${network}`)

    let w2eTokenContract;
    let sdk;

 if (network === 'mumbai') {
      functions.logger.log('Welcome to Mumbai, baby!');

      sdk = ThirdwebSDK.fromPrivateKey(functions.config().crypto.private_key, "mumbai");
      w2eTokenContract = sdk.getToken("0xf1CfefE6B35Ec591F238d886cA736Fa43EA8CF82");
 } else if (network === 'kovan'){
     functions.logger.log(`Don't rly know where Kovan is but hey, we're here lol`);

     sdk = ThirdwebSDK.fromPrivateKey(functions.config().crypto.private_key, "optimism-testnet");
     w2eTokenContract = sdk.getToken("0x5a0231Ed03e17322ab54b76Cdc8baE7d6551d9C9");

 } else {
     throw Error;
 }
    //  Initialize serverside using the private key on the mumbai or kovan network

    const toReferrerAddress = referrerAddress; // Address of the wallet you want to mint the tokens to
    const w2eTokenAmount = "1.5"; // The amount of this token to be minted
    const nativeTokenAmount = "0.0001"; // Amount of native token to be sent as an additional reward

    await w2eTokenContract.mintTo(toReferrerAddress, w2eTokenAmount); // Send our native token to the referrer
    await sdk.wallet.transfer(toReferrerAddress, nativeTokenAmount);

    await w2eTokenContract.mintTo(referredAddress, w2eTokenAmount); // Send our native token to the referred person
    await sdk.wallet.transfer(referredAddress, nativeTokenAmount);

}