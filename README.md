<p align="center">
  <a href="https://github.com/plasmo-corp/bpp/actions"><img alt="typescript-action status" src="https://github.com/plasmo-corp/bpp/workflows/build-test/badge.svg"></a>
</p>

# Browser Plugin Publisher

Use this action to publish your browser plugin to every browser plugin marketplace.

## Usage

First, create a `keys.json` in your favorite text editor (preferably one with [json-schema](https://json-schema.org/) support):

```json
{
  "$schema": "https://raw.githubusercontent.com/plasmo-corp/bpp/v1/keys.schema.json"
}
```

A sample template is provided in [`keys.template.json`](./keys.template.json), and the JSON schema is in [`keys.schema.json`](./keys.schema.json). If your editor supports [json-schema](https://json-schema.org/), it should give you intellisense/autocompletion while working on the keys.

**NOTE**: You should only specify the browser you wish to publish to. If there are any invalid configuration, the action will fail! I.e, no empty key allowed such as `"chrome": {}`.

Copy the content of your `keys.json` into a github secret with the name `BPP_KEYS`. Then, the action can be used as follows:

```yaml
steps:
  - uses: plasmo-corp/bpp@v1
    with:
      keys: ${{ secrets.BPP_KEYS }}
```

**NOTE**: If you skipped the `zip` parameter in your keys, and that your extension artifact is understood by the browser you specified, you can specify an `artifact` action parameter:

```yaml
steps:
  - uses: plasmo-corp/bpp@v1
    with:
      artifact: build/artifact.zip
      keys: ${{ secrets.BPP_KEYS }}
```

This works if you're only targeting chrome and edge for example.

## Acknowledgements

- [web-ext-deploy](https://github.com/avi12/web-ext-deploy) by [avi12](https://github.com/avi12)
- [chrome-webstore-upload-cli](https://github.com/fregante/chrome-webstore-upload-cli) by [fregante](https://github.com/fregante)
- [web-ext](https://github.com/mozilla/web-ext) by [mozilla](https://github.com/mozilla)
