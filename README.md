<p align="center">
  <a href="https://github.com/plasmo-corp/bpp/actions"><img alt="typescript-action status" src="https://github.com/plasmo-corp/bpp/workflows/build-test/badge.svg"></a>
</p>

# Browser Plugin Publisher

Use this action to publish your browser plugin to any browser plugin marketplace.

## Usage

```yaml
steps:
  - uses: plasmo-corp/bpp@v1
    with:
      zip: build/artifact.zip
      client-id: ${{ secrets.CHROME_CLIENT_ID }}
      client-secret: ${{ secrets.CHROME_CLIENT_SECRET }}
      refresh-token: ${{ secrets.CHROME_REFRESH_TOKEN }}
```
