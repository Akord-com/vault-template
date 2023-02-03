# Vault Template SDK

The Akord Protocol provides developers with composable and extensible, on-chain storage vaults. The protocol combines cryptographic primatives to construct a vault that can be public/private, maintains revision history for files, key rotation for members who join/leave, and much more.

Built on the Arweave blockchain, Akord Vault provides a 'pay up front' option for long term storage with the option to be private or public.

Akord Protocol is a Web3 project. It can be used with Web3 DApps, Web2 SaaS platforms, Enterprise back offices, and more.

The Vault Template SDK is a quick start for working with the Akord Protocol and Vaults.

- [Before starting](#before-starting)
- [Deploying our first vault](#deploying-our-first-vault)
- [What can you build from here](#what-can-you-build-from-here)
- [Little extra](#little-extra)

## Before starting

- Setup an Akord Wallet at https://v2.akord.com/
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

Add a username/password to access your Akord wallet in the `.env` file:

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

Run this script to generate a note:

```
cat <<EOT >> ./vault/demo.note
# Hello world 🌈
This is a quick note from the demo.
EOT
```

Files with the .note extension are viewed with Akord's default gallery viewer. It supports markdown and rendering to PDF.

### 3 - Run your build script to automate tasks

Run the build script:

```
npm run build
```

In our demo script, we generated a random name and other data for our vault. You can see the results in the `vault.json` file.

In addition, we also downloaded some photos from Unsplash, and should be ready in the `./vault/photos` folder.

### 4 - Deploy your vault to Akord and the Permaweb

Now we're ready to push to the permaweb.

```
npm run deploy
```

After deployment, you can open your vault at :

```
https://v2.akord.com//vaults/active/{vaultId}/assets
```

> NOTE: It may take up to an hour to confirm your transactions on the arweave blockchain, but Akord will hold a cache of the files for your, insuring they are accessible immediately.

## What can you build from here?

Vault Templates are useful for when you want to automate the creation and deployment of your vault.

Here are some directions you can take it:

- Provide a 'user owned' data vault for customer data. Share files, data, images with your customers with their direct ownership. Very web3.
- Create an open and permanent vault for web2 style SaaS applications. Store your most valuable information on the permaweb. Keep it private or leave it public.
- Use private and permanent vaults for backing up enterprise data, auditing reports, legal documents and more. The permaweb is very reliable and has a long memory.

For questions and feedback, join our discord: https://discord.gg/YQVAyhFgAn

Enjoy 🌟

## Little extra

### Importing files published with an Arweave address into an Akord Vault

#### Configuration
The following config env variables are required:

`AKORD_WALLET_EMAIL`\
`AKORD_WALLET_PASSWORD`\
`ARWEAVE_ADDRESS` - arweave address to import files from

#### Import your arweave files to Akord
First run
```
yarn install
```

Then
```
yarn arweave-import
```
