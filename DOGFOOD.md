# Dogfooding Instructions

To switch to Script Lab React, you first need to be in the
**Beta** version of today's Script Lab. The extra layer of redirection is to ensure that people don't accidently end up in the new experience until it's ready.

## Step 1 - Open Script Lab's About Page

You can do this by clicking opening the code editor and clicking the about button in the bottom left corner.

![Open Script Lab's About page](./packages/editor/public/assets/images/dogfood-instructions/about-page.png)

## Step 2 - Switch to Script Lab's Beta Environment

If you haven't already, switch to the `Beta` environment. Press `OK` and the page will reload.

![Open Script Lab Beta Environment](./packages/editor/public/assets/images/dogfood-instructions/select-beta-from-about.png)

## Step 3 - Open the About Page of Script Lab Beta

After opening the page, select the `Script Lab React - Beta` option.

![Open About Page of Script Lab Beta](./packages/editor/public/assets/images/dogfood-instructions/script-lab-react-beta-option.png)

## Step 4 - Start Dogfooding!

For the basic scenarios, things should "just work". Moreover:

- Keyboard accessibility is now enabled.
- Font size, theme, and autoformatting can be configured in settings.
- You can now search through your snippets.

### Known Issues

- For now, you must manually click `Refresh` at the top of the runner in order to refresh the snippet. (The message bar prompting for reload has not yet been implemented.)
- For Custom Functions support, you will need to use today's version of Script Lab
- All other issues can be found [here](https://github.com/OfficeDev/script-lab-react/issues). If you don't have access to the repo, see [more below](DOGFOOD.md#access).

## Step 5 - Switching Back

To switch back, you need to open the settings page of the editor.

This can be done by clicking the small settings icon in the bottom right, or by pressing `Ctrl` + `,` in the editor.

Once in the settings view, change environment to `beta` and press apply at the top.

![Go Back to Script Lab](./packages/editor/public/assets/images/dogfood-instructions/switch-back-to-regular-beta.png)

---

<div id="access"></div>

# Getting Access to the Repo

In order to get access to the repo, which is needed in order submit issues, you must follow the following steps:

1. If you haven't already, create a personal GitHub account and link it to Microsoft via https://repos.opensource.microsoft.com/
2. Join the OfficeDev team: https://repos.opensource.microsoft.com/officedev/join
3. Additionally, join https://github.com/orgs/OfficeDev/teams/everyone/members and click the request to join​ button
