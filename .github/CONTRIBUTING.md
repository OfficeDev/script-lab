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

## Fixing build / CI failures

### Storyshots

Suppose you make a commit, and then see a CI failure like:

```
<#> snapshot tests failed in <#> test suite. Inspect your code changes or re-run jest with `-u` to update them.
```

To fix it:

1. `cd` into the package that is failing. E.g.,: `cd packages/editor`
2. Run `yarn test`
3. Press `a` to run all tests. Wait for the failure to happen. Then press `w` for more options.
4. From the more options, press `i`, as in `› Press i to update failing snapshots interactively.`.
5. Once it runs, press `u`, as in `> Press u to update failing snapshots for this test.`.
6. Quit and commit.
