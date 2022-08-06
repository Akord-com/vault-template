# Vault Template SDK

The Akord Protocol provides developers with composable and extensible on storage vaults. The protocols is combined from cryptographic primatives to construct a vault that can be public/private, maintains revision history for files, key rotation for members you join/leave, and much more.

While the Akord Protocol is a web3 project, it can be used with web3 DApps, web2 SaaS platforms, Enterprise back offices, and more.

The Vault Template SDK is a quick start to working with the Akord Protocol and Vaults.

## Before starting

- Setup a wallet with http://app.akord.com
- Setup and install Node (16+) along with npm or yarn

## Deploying our first vault

### 1 - Download the project

```
git clone git@github.com:Akord-com/vault-template.git
```

After cloning the project to your local disk, create a branch for your demo project:

```
git checkout -b demo
```

This will allow us to work with multiple templates without overwriting the `main` branch.

Then install the modules using either npm or yarn:

```
npm install
yarn install
```

### 2 - Test your build

Test your setup buy running the default build:

```
npm run build
```

The default build script will generate random data for the vault.json settings and download a few random photos for your vault.

Feel free to experiment with the demo.

### 3 - Deploy your vault

With our build ready, we can simply deploy our vault:

```
yarn deploy
```

## Next steps

Vault Templates are useful for when you want to automate the create and deployment of your vault. Some ways that you can use this:

- provide a 'user owned' data vault for customer data
- create an open and permanent vault for custom applications
- use private and permanent vaults for backing up enterprise data

... and so on!
