# Publish

Steps to roll out a new version of Script Lab.

## Rings

Script Lab has multiple rings, to control the rollout of new versions. The rings are:

| Ring       | Branch     | Notes |
| ---------- | ---------- | ----- |
| alpha      | master     |       |
| beta       | beta       |       |
| production | production |       |

## Switching Rings

1. Click the `Settings` icon. The setting icon is at the bottom of Script Lab _code editor_ on the right side.
1. Click `About` on the top left side to see the specific commit the current ring is on.
1. Select a ring from the ring dropdown. The ring dropdown is on the bottom left side.
1. Wait for Script Lab to reload.

## Steps to roll out

Follow these steps exactly to roll out a new version.

Completely deploy a change to production **before** starting a new deployment.

1. merge new change into master
   - this starts a pipeline to deploy to alpha
   - check the pipeline to make sure deployment succeeded
   - test that everything still works
1. merge master into beta
   - this starts a pipeline to deploy to beta
   - check the pipeline to make sure deployment succeeded
   - test that everything still works
   - **wait ~1 week**
1. merge beta into production
   - this stages for production deployment
   - test that everything still works

### Merge

1. Select the branch to merge into (`beta` or `production`).
1. Click `Contribute` and select `Open Pull Request`
1. Select the branch to merge into on the left side (`beta` or `production`).
1. Select the branch to merge from on the right side (`master` or `beta`).
1. Set the title to
   `alpha -> beta` or `beta -> production`
1. Click `Create Pull Request`
1. Get sign off on the PR
