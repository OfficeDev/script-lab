yarn install --frozen-lockfile
yarn pre-ci || exit 1
yarn postinstall
git --no-pager diff HEAD --exit-code || exit 1 # This makes sure that someone ran "yarn install" after merging their PR, and that the postinstall doesn't produce any diffs, which are annoying/confusing
