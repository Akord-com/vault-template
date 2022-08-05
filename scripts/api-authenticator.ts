import 'cross-fetch/polyfill';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

export default class ApiAuthenticator {
  constructor() { }

  public getCognitoUser(username: string): AmazonCognitoIdentity.CognitoUser {
    const userPool = this.getCognitoUserPool();
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return cognitoUser;
  }

  public getCognitoUserPool(): AmazonCognitoIdentity.CognitoUserPool {
    const poolData = {
      UserPoolId: "eu-central-1_FOAlZvgHo",
      ClientId: "3m7t2tk3dpldemk3geq0otrtt9",
    };
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    return userPool;
  }

  public async getJWTToken(username: string, password: string): Promise<string> {
    const { session } = await this.authenticateUser(username, password);
    return session.getAccessToken().getJwtToken();
  }

  public async authenticateUser(username: string, password: string): Promise<{
    user: AmazonCognitoIdentity.CognitoUser,
    session: AmazonCognitoIdentity.CognitoUserSession
  }> {
    const cognitoUser = this.getCognitoUser(username);
    const authenticationData = {
      Username: username,
      Password: password,
    };
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          resolve({ user: cognitoUser, session: result })
        },
        onFailure: function (err) {
          console.log(err);
          return reject;
        }
      })
    }
    );
  }

  public async getUserAttributes(email: string, password: string): Promise<Object> {
    const { user } = await this.authenticateUser(email, password);
    return new Promise((resolve, reject) => {
      user.getUserAttributes(async function (err, result) {
        if (err) {
          console.log(err.message || JSON.stringify(err));
          reject();
        }
        const attributes = result.reduce(function (
          attributesObject,
          attribute
        ) {
          attributesObject[attribute.Name] = attribute.Value;
          return attributesObject;
        }, {});
        resolve(attributes);
      })
    }
    );
  }
}
