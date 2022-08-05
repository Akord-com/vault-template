import 'cross-fetch/polyfill';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
export default class ApiAuthenticator {
    constructor();
    getCognitoUser(username: string): AmazonCognitoIdentity.CognitoUser;
    getCognitoUserPool(): AmazonCognitoIdentity.CognitoUserPool;
    getJWTToken(username: string, password: string): Promise<string>;
    authenticateUser(username: string, password: string): Promise<{
        user: AmazonCognitoIdentity.CognitoUser;
        session: AmazonCognitoIdentity.CognitoUserSession;
    }>;
    getUserAttributes(email: string, password: string): Promise<Object>;
}
