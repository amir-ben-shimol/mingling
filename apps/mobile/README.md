# Install the latest EAS CLI

```bash
npm install --global eas-cli

eas project:init
```

## Change xcode location

```bash
xcode-select -s /Applications/Xcode.app
```

## Register apple device for internal distribution

```bash
eas device:create --name "device-name"
```

# Revoke all ios provision certificates:

```bash
bundle exec fastlane match nuke development
```

# CodePush Setup and Usage Guide

1. Install Azurite (for local Azure Blob Storage emulation)

npm install -g azurite

2. Run Azurite

azurite --silent --location ./azurite --debug ./debug.log

3. Prepare CodePush Server

3.1. Set up CodePush server API

cd services/code-push-server/api
npm install
npm run build

Ensure that you have a .env file properly configured, then start the server:

npm run start:env

3.2. Set up CodePush CLI

cd services/code-push-server/cli
npm install
npm run build
npm install -g (to configure code-push-standalone script available globally)

4. Register / login (depands if the domain is new)

code-push-standalone register <server_url>

5. Verify session

code-push-standalone whoami

6. List apps (iOS and Android)

code-push-standalone app ls

If no apps exist, create them:

code-push-standalone app add Leumit-Android
code-push-standalone app add Leumit-iOS

7. Check for deployment keys

code-push-standalone deployment ls Leumit-Android --displayKeys
code-push-standalone deployment ls Leumit-iOS --displayKeys

8. Configure the deployment keys based on the environment

On iOS: Edit ./iOS/mingling/Info.plist and paste the deployment key under CodePushDeploymentKey.

On Android:

Add the key under your strings.xml file:

<string name="CodePushDeploymentKey">YourDeploymentKeyHere</string>

9. Set the CodePush server URL

### Android

Edit Android/app/src/main/res/values/strings.xml and change the value of CodePushServerUrl to your current URL.

### iOS

Edit iOS/mingling/Info.plist and change the value of CodePushServerURL to your current URL.

10. To push OTA (over the air) update

1. Bundle the app based on the platform

```bash
pnpm bundle:ios
```

2. Run the following script from the mobile directory:

```bash
code-push-standalone release Leumit-iOS ./dist/_expo/static/js/ios/index-4417d0657db31db2b4401850f3975def.hbc "1.0.48" --deploymentName Staging --mandatory --description "Hotfix: Updated login button text"
```

2.1. After testing, promote it to Production

```bash
code-push-standalone promote Leumit-iOS Staging Production
```

11. Check CodePush deployment history

code-push-standalone deployment history Leumit-iOS Staging

12. To delete all CodePush history:

code-push-standalone deployment clear Leumit-iOS Staging
