// `xcrun safari-web-extension-converter dist/ --app-name ${{  }} --bundle-identifier ${{ secrets.BPP_BUNDLE_ID }} --output-dir dist/safari`

import { debug } from "@actions/core"

type SafariOptions = {
  bundleIdentifier: string
  zip: string
}

export const deploySafari = (options: SafariOptions) => {
  // Check if environment is darwin
  if (process.platform !== "darwin") {
    throw new Error("Safari deployment is only supported on macOS")
  }

  debug("Submitting Safari extension")

  debug(JSON.stringify(options, null, 2))

  return true
}
