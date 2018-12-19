# Pages

Pages are used inside of the editor domain to allow for multiple "pages" to be served using client side routing. Anything that should be common to all pages like polyfills, staging-env-redirect, should happen in src/index.tsx.

## Adding new pages:

1. Create a folder inside this directory called `Page`.
2. Have this folder's `index.tsx` have a default export of your page's component.
3. Add the required imports and exports to `index.tsx` in this directory.
4. Add the desired path for this page to `src/constants.ts`'s `PATHS` variable with the same name (`Page`)
