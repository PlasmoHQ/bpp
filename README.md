<p align="center">
  <a href="https://github.com/plasmo-corp/bpp/actions"><img alt="typescript-action status" src="https://github.com/plasmo-corp/bpp/workflows/build-test/badge.svg"></a>
</p>

# Browser Plugin Publisher

Use this action to publish your browser plugin to every browser plugin marketplace. This action and its dependencies are fully open source under the MIT license. The core modules are:

- [Browser Market Submit](https://github.com/plasmo-corp/bms)
- [Mozilla Webstore Upload](https://www.npmjs.com/package/@plasmo-corp/mwu)
- [Chrome Webstore Upload](https://www.npmjs.com/package/@plasmo-corp/cwu)
- [Edge Webstore Upload](https://www.npmjs.com/package/@plasmo-corp/ewu)

The action is updated regularly and is field-tested in [cex](https://github.com/plasmo-corp/cex/actions)

## Usage

First, create a `keys.json` in your favorite text editor (preferably one that supports [json-schema](https://json-schema.org/)):

```json
{
  "$schema": "https://raw.githubusercontent.com/plasmo-corp/bpp/v1/keys.schema.json"
}
```

A sample template is provided in [`keys.template.json`](./keys.template.json), and the JSON schema is in [`keys.schema.json`](./keys.schema.json). If your editor supports [json-schema](https://json-schema.org/), it should give you intellisense/autocompletion while working on the keys.

**NOTE**: You should only specify the browser you wish to publish to. If there are any invalid configuration, the action will fail! I.e, no empty key allowed such as `"chrome": {}`.

Copy the content of your `keys.json` into a github secret with a name of your choosing, in this case we used `BPP_KEYS`. Then, the action can be used as follows:

```yaml
steps:
  - name: Browser Plugin Publish
    uses: plasmo-corp/bpp@v2
    with:
      keys: ${{ secrets.BPP_KEYS }}
```

**NOTE**: If you're publishing to the Opera store, you will need to set up Chromium for puppeteer before running `bpp`. In v3, we will hopefully deprecate the Puppeteer approach altogether (since it's quite a leaky abstraction), or have an option for BPP to download and set up the browser for you.

```yaml
steps:
  - name: Setup Chrome
    uses: browser-actions/setup-chrome@latest
    with:
      chrome-version: latest
  - name: Browser Plugin Publish
    uses: plasmo-corp/bpp@v2
    env:
      PUPPETEER_EXECUTABLE_PATH: /opt/hostedtoolcache/chromium/latest/x64/chrome
    with:
      keys: ${{ secrets.BPP_KEYS }}
```

**NOTE**: If you skipped the `zip` parameter in your keys, and that your extension artifact is understood by the browser you specified, you can specify an `artifact` action parameter:

```yaml
steps:
  - name: Browser Plugin Publish
    uses: plasmo-corp/bpp@v2
    with:
      artifact: build/artifact.zip
      keys: ${{ secrets.BPP_KEYS }}
```

This works if you're targeting a group of browsers that share a similar format, such as Chrome or Edge.

## Acknowledgements

- [web-ext-deploy](https://github.com/avi12/web-ext-deploy) by [avi12](https://github.com/avi12)
- [chrome-webstore-upload-cli](https://github.com/fregante/chrome-webstore-upload-cli) by [fregante](https://github.com/fregante)
- [web-ext](https://github.com/mozilla/web-ext) by [mozilla](https://github.com/mozilla)

# License

[MIT](./license) ⭐ [Plasmo Corp.](https://plasmo.com)
