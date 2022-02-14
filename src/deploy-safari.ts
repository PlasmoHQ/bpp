// `xcrun safari-web-extension-converter dist/ --app-name ${{  }} --bundle-identifier ${{ secrets.BPP_BUNDLE_ID }} --output-dir dist/safari`

type SafariOptions = {
  bundleIdentifier: string
}

export const deploySafari = (options: SafariOptions) => {
  // Check if environment is darwin
  if (process.platform !== "darwin") {
    throw new Error("Safari deployment is only supported on macOS")
  }

  return true
}
