"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("cross-fetch/polyfill");
const AmazonCognitoIdentity = __importStar(require("amazon-cognito-identity-js"));
class ApiAuthenticator {
    constructor() { }
    getCognitoUser(username) {
        const userPool = this.getCognitoUserPool();
        const userData = {
            Username: username,
            Pool: userPool
        };
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        return cognitoUser;
    }
    getCognitoUserPool() {
        const poolData = {
            UserPoolId: "eu-central-1_FOAlZvgHo",
            ClientId: "3m7t2tk3dpldemk3geq0otrtt9",
        };
        const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        return userPool;
    }
    async getJWTToken(username, password) {
        const { session } = await this.authenticateUser(username, password);
        return session.getAccessToken().getJwtToken();
    }
    async authenticateUser(username, password) {
        const cognitoUser = this.getCognitoUser(username);
        const authenticationData = {
            Username: username,
            Password: password,
        };
        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
        return new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function (result) {
                    resolve({ user: cognitoUser, session: result });
                },
                onFailure: function (err) {
                    console.log(err);
                    return reject;
                }
            });
        });
    }
    async getUserAttributes(email, password) {
        const { user } = await this.authenticateUser(email, password);
        return new Promise((resolve, reject) => {
            user.getUserAttributes(async function (err, result) {
                if (err) {
                    console.log(err.message || JSON.stringify(err));
                    reject();
                }
                const attributes = result.reduce(function (attributesObject, attribute) {
                    attributesObject[attribute.Name] = attribute.Value;
                    return attributesObject;
                }, {});
                resolve(attributes);
            });
        });
    }
}
exports.default = ApiAuthenticator;
