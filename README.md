<p align="center">
  <a href="https://plasmo.com">
    <img alt="plasmo logo" width="75%" src="https://www.plasmo.com/assets/banner-black-on-white.png" />
  </a>
</p>

<p align="center">
  <a aria-label="License" href="./LICENSE">
    <img alt="See License" src="https://img.shields.io/github/license/PlasmoHQ/bpp?style=flat-square"/>
  </a>
  <a aria-label="Twitter" href="https://www.twitter.com/plasmohq">
    <img alt="Follow PlasmoHQ on Twitter" src="https://img.shields.io/twitter/follow/plasmohq?logo=twitter"/>
  </a>
  <a aria-label="Twitch Stream" href="https://www.twitch.tv/plasmohq">
    <img alt="Watch our Live DEMO every Friday" src="https://img.shields.io/twitch/status/plasmohq?logo=twitch&logoColor=white"/>
  </a>
  <a aria-label="Discord" href="https://www.plasmo.com/s/d">
    <img alt="Join our Discord for support and chat about our projects" src="https://img.shields.io/discord/946290204443025438?logo=discord&logoColor=white"/>
  </a>
  <a aria-label="Build status" href="https://github.com/PlasmoHQ/bpp/actions">
    <img alt="typescript-action status" src="https://github.com/PlasmoHQ/bpp/workflows/build-test/badge.svg"/>
  </a>
</p>

# Browser Platform Publisher

A GitHub action from [Plasmo](https://www.plasmo.com/) to publish your browser extension to every web store/add-ons marketplace. This action and its dependencies are open-sourced under the MIT license. The core modules are:

- [Browser Market Submit](https://github.com/PlasmoHQ/bms)
- [Chrome Webstore API](https://github.com/PlasmoHQ/chrome-webstore-api)
- [Mozilla Addons API](https://github.com/PlasmoHQ/mozilla-addons-api)
- [Edge Addons API](https://github.com/PlasmoHQ/edge-addons-api)

## Usage

 In order to use this action, you will need to create a json file that contains the keys and optional configuration for each browser you wish to publish to.

To help you create it, we have provided a [JSON schema](https://json-schema.org/) that can be used with editors that support it, such as Visual Studio Code. This schema will provide intellisense and validation to ensure that your configuration is correct.

```json
{
  "$schema": "https://raw.githubusercontent.com/PlasmoHQ/bpp/v3/keys.schema.json"
}
```

> **NOTE**: You should only specify the browsers you wish to publish to. If there are any invalid configuration, the action will fail! I.e, no empty key allowed such as `"chrome": {}`.

Each browser option is made of the following:

* Mandatory browser specific tokens (see [token guide](https://github.com/PlasmoHQ/bms/blob/main/tokens.md))

* Optional parameters:
    * `zip`: The zip file containing the extension. The manifest.json file must be in the root of the zip file.
  
      `{version}` can be used in the name and will be replaced by the version from your versionFile.

    * `file`: An alias for the zip property.

    * `verbose`: Enable verbose logging for the specific browser.

    * `versionFile`: Relative path to a json file which has a version field. Defaults to package.json
  
    * `notes`: [Edge Only] Provide notes for certification to the Edge Add-ons reviewers.

The final json might look like this:

```json
{
  "$schema": "https://raw.githubusercontent.com/plasmo-corp/bpp/v3/keys.schema.json",
  "chrome": {
    "zip": "chromium_addon_{version}.zip",
    "clientId": "1280623",
    "clientSecret": "1!9us4",
    "refreshToken": "7&as$a89",
    "extId": "akszypg"
  },
  "firefox": {
    "file": "firefox_addon.xpi",
    "extId": "aaaaaaa-aaaa-bbbb-cccc-dddddddddddd",
    "apiKey": "ab214c4d",
    "apiSecret": "e%f253^gh"
  },
  "edge": {
    "zip": "chromium_addon.zip",
    "clientId": "aaaaaaa-aaaa-bbbb-cccc-dddddddddddd",
    "clientSecret": "ab#c4de6fg",
    "productId": "aaaaaaa-aaaa-bbbb-cccc-dddddddddddd",
    "accessTokenUrl": "https://login.microsoftonline.com/aaaaaaa-aaaa-bbbb-cccc-dddddddddddd/oauth2/v2.0/token",
    "notes": "This is a test submission"
  }
}
```

Once you got your json file, you will need to copy its content into a GitHub secret. You can do this by following the [instructions on creating encrypted secrets for a repository](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository). In this example, we will use the secret name `BPP_KEYS`.

Then, the action can be used as follows:

```yaml
steps:
  - name: Browser Platform Publish
    uses: PlasmoHQ/bpp@v3
    with:
      keys: ${{ secrets.BPP_KEYS }}
```

## Action Input Parameters (`with`)
The following parameters can be used to override the configuration in the keys file.
Specifying options here will **override** those in the keys file.
```yaml
  keys:
    required: true
    description: "A JSON string containing the keys to be used for the submission process. (This should be a secret)"
  artifact:
    alias: [zip, file]
    required: false
    description: "The extension zip artifact to be published on all stores."
  opera-file/chrome-file/firefox-file/edge-file:
    required: false
    description: "The file to be published to a specific store."
  notes:
    alias: [edge-notes]
    required: false
    description: "[Edge only] A release note cataloging changes."
  verbose:
    required: false
    description: "Print out more verbose logging."
  version-file:
    required: false
    description: "The path to a json file with a version field, default to package.json."
```

###  Custom input parameters example
```yaml
steps:
  - name: Browser Platform Publish
    uses: PlasmoHQ/bpp@v3
    with:
      keys: ${{ secrets.BPP_KEYS }}
      chrome-file: "chrome/myext_chromium_${{ env.EXT_VERSION }}.zip"
      edge-file: "edge/myext_edge_${{ env.EXT_VERSION }}.zip"
      edge-notes: "This is a test submission"
      version-file: "src/manifest.json"
      verbose: true
```

# Support

Join the [Discord channel](https://www.plasmo.com/s/d)!

# License

[MIT](./LICENSE) ⭐ [Plasmo Corp.](https://plasmo.com)
