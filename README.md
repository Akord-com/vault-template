# Vault Template SDK

> NOTE: The Akord API is in 'Developer Preview Release'. All functions from the vault-template will run from Akord's dev environment while the protocol and its data is on arweave mainnet.
>
> To access the dev : https://dev.akord.link/

The Akord Protocol provides developers with composable and extensible, on-chain storage vaults. The protocol combines cryptographic primatives to construct a vault that can be public/private, maintains revision history for files, key rotation for members who join/leave, and much more.

Built on the Arweave blockchain, Akord Vault provides a 'pay up front' option for long term storage with the option to be private or public.

Akord Protocol is a Web3 project. It can be used with Web3 DApps, Web2 SaaS platforms, Enterprise back offices, and more.

The Vault Template SDK is a quick start for working with the Akord Protocol and Vaults.

## Before starting

- Setup an Akord Wallet at https://dev.akord.link/
- Setup and install Node (16+) along with npm or yarn

## Deploying our first vault

### 1 - Download the project

```
git clone git@github.com:Akord-com/vault-template.git
```

After cloning the project to your local disk, create a branch for your demo project:

```
git checkout -b my_first_vault
```

This will allow us to work with multiple templates without overwriting the `main` branch.

Then install the modules using either npm or yarn:

```
npm install
yarn install
```

### 2 - Setup and Configure your Vault

In our project we can find the following files:

```
.
├── .env
├── build.js
├── scripts
│   ├── akord-sync.ts
├── vault
│   ├── photos
│   │   └── avila-beach.jpg
│   └── welcome.note
└── vault.json
```

Launching a vault is done in a tree phase workflow:

1. Configure your vault's settings and contents

Add your the username/password to access your Akord wallet in the `.env` file:

```
cat <<EOT >> .env
AKORD_WALLET_EMAIL="..."
AKORD_WALLET_PASSWORD="..."
EOT
```

The `vault.json` file is where you can set attributes like `name`. We'll use our build script to change this file later.

```
{
"name": "--name--",
"termsOfAccess": "--terms of access--",
...
}
```

> NOTE: termsOfAccess is an agreement a group can make before allowing access to a private vault. One could list copyright and sharing rights that those who access the vault agree to.

The `vault` folder is where you can add photos and documents to test. When deploying your vault, the script will copy the `vault` folder exactly as is to your vault, ignoring hidden files.

```
cat <<EOT >> ./vault/demo.note
# Hello world 🌈
This is a quick note from the demo.
EOT
```

Files with the .note extension are viewed with Akord's default gallery viewer. It supports markdown and rendering to PDF.

2. Run your build script to automate tasks

Run the build script:

```
npm run build
```

In our demo script, we'll generate some random names. You can see the results in the `vault.json` file. In addition, we'll download some photos from unsplash.

3. Deploy your vault to the permaweb

We're ready to push to the permaweb.

```
npm run deploy
```

Now log into your Akord account to see vault:

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
npm run push
```

> NOTE: You can run both tasks `build` & `deploy` with `npm run deploy`.

### 3 - Open the vault

After deployment, you can check out your vault at :

```
https://dev.akord.link/vaults/active/{vaultId}/assets
```

It may take up to an hour to confirm your transactions on the arweave blockchain, but Akord will hold a cache of the files for your, insuring they are accessible immediately.

## Next steps

Vault Templates are useful for when you want to automate the creation and deployment of your vault.

Here are some directions you can take it:

- Provide a 'user owned' data vault for customer data. Share files, data, images with your customers with their direct ownership. Very web3.
- Create an open and permanent vault for web2 style SaaS applications. Store your most valuable information on the permaweb. Keep it private or leave it public.
- Use private and permanent vaults for backing up enterprise data, auditing reports, legal documents and more. The permaweb is very reliable and has a long memory.

For questions and feedback, join our discord: https://discord.gg/YQVAyhFgAn

Enjoy 🌟
