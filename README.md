# MakerIDE

## Initial setup

### Step 0 -- Install Yarn and clone repo
[Install yarn](https://yarnpkg.com/en/docs/install)

### Step 1 -- Install dependencies
From the root directory of the repo:

```yarn installAll```

### Step 2 -- Copy Monaco
```cd client```

```yarn copy-monaco```

### Step 3 -- Get DevKeys for auth to GitHub
Ask Nico for the `devkeys.js`, and place this file within the `server` folder.

### Step 4 -- Start the client and server
From the root directory of the repo:

```yarn start```

## Subsequent update

### Step 0 -- Get latest code
Sync repo.

### Step 1 -- Get latest dependencies
From the root directory of the repo:

```yarn installAll```

### Step 2 -- Copy Monaco
```cd client```

```yarn copy-monaco```

### Step 3 -- Start the client and server
From the root directory of the repo:

```yarn start```

## Client Only

### Step 0 -- Get latest code
Sync repo.

### Step 1 -- Go to client folder

```cd client```

### Step 2 -- Install Dependencies

```yarn install```

### Step 3 -- Copy Monaco

```yarn copy-monaco```

### Step 4 -- Start

```yarn start```
