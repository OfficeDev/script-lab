# Script Lab React

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Build Status

| Branch     | Status                                                                                                                                                                 |
| ---------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| master     | [![Build Status](https://travis-ci.com/OfficeDev/script-lab-react.svg?token=QwPYmFbjQw87cQmG1ogy&branch=master)](https://travis-ci.com/OfficeDev/script-lab-react)     |
| beta       | [![Build Status](https://travis-ci.com/OfficeDev/script-lab-react.svg?token=QwPYmFbjQw87cQmG1ogy&branch=beta)](https://travis-ci.com/OfficeDev/script-lab-react)       |
| production | [![Build Status](https://travis-ci.com/OfficeDev/script-lab-react.svg?token=QwPYmFbjQw87cQmG1ogy&branch=production)](https://travis-ci.com/OfficeDev/script-lab-react) |

## Initial setup

### Step 0 -- Install Yarn and clone repo

[Install yarn](https://yarnpkg.com/en/docs/install)

### Step 1 -- Install dependencies

From the root directory of the repo:

`yarn install`

### Step 2 -- Copy Monaco

`yarn copy-monaco`

### Step 3 -- Get DevKeys for auth to GitHub

Ask Nico for the `.env`, and place this file within the `packages/server/src` folder.

### Step 4 -- Start the client and server

From the root directory of the repo:

`yarn start`

## Subsequent update

### Step 0 -- Get latest code

Sync repo.

### Step 1 -- Get latest dependencies

From the root directory of the repo:

`yarn install`

### Step 2 -- Copy Monaco

`yarn copy-monaco`

### Step 3 -- Start the client and server

From the root directory of the repo:

`yarn start`
