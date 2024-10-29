fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios build

```sh
[bundle exec] fastlane ios build
```

Build the app for app store

### ios developer_build

```sh
[bundle exec] fastlane ios developer_build
```

Build the app for development with Expo Dev Client

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Push a new beta build to TestFlight

### ios build_development

```sh
[bundle exec] fastlane ios build_development
```

Build the app for development

### ios release

```sh
[bundle exec] fastlane ios release
```

Push a new release build to the App Store

### ios upload_only

```sh
[bundle exec] fastlane ios upload_only
```

Upload existing build to App Store

### ios notify_on_slack

```sh
[bundle exec] fastlane ios notify_on_slack
```

Notify on Slack

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
