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

A GitHub action from [plasmo](https://www.plasmo.com/) to publish your browser extension to every web store/add-ons marketplace. This action and its dependencies are fully open-source under the MIT license. The core modules are:

- [Browser Market Submit](https://github.com/PlasmoHQ/bms)
- [Mozilla Webstore Upload](https://www.npmjs.com/package/@plasmo-corp/mwu)
- [Chrome Webstore Upload](https://www.npmjs.com/package/@plasmo-corp/cwu)
- [Edge Webstore Upload](https://www.npmjs.com/package/@plasmo-corp/ewu)

The action is updated regularly and tested in [cex](https://github.com/PlasmoHQ/cex/actions)

## Usage

First, create a `keys.json` in your favorite text editor (preferably one that supports [json-schema](https://json-schema.org/)):

```json
{
  "$schema": "https://raw.githubusercontent.com/PlasmoHQ/bpp/v2/keys.schema.json"
}
```

A sample template is provided in [`keys.template.json`](./keys.template.json), and the JSON schema is in [`keys.schema.json`](./keys.schema.json). If your editor supports [json-schema](https://json-schema.org/), it should give you intellisense/autocompletion while working on the keys.

**NOTE**: You should only specify the browser you wish to publish to. If there are any invalid configuration, the action will fail! I.e, no empty key allowed such as `"chrome": {}`.

Copy the content of your `keys.json` into a github secret with a name of your choosing, in this case we used `BPP_KEYS`. Then, the action can be used as follows:

```yaml
steps:
  - name: Browser Platform Publish
    uses: PlasmoHQ/bpp@v2
    with:
      keys: ${{ secrets.BPP_KEYS }}
```

**NOTE**: If you skipped the `zip` parameter in your keys, and your extension artifact is understood by the browser you specified, you can specify an `artifact` action parameter:

```yaml
steps:
  - name: Browser Platform Publish
    uses: PlasmoHQ/bpp@v2
    with:
      artifact: build/artifact.zip
      keys: ${{ secrets.BPP_KEYS }}
```

This works if you're targeting a group of browsers that share a similar format, such as Chrome or Edge.

# Support

Join the [Discord channel](https://www.plasmo.com/s/d)!

# License

[MIT](./license) ⭐ [Plasmo Corp.](https://plasmo.com)
