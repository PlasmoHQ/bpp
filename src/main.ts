import { debug, getInput, info, setFailed } from "@actions/core"
import {
  ChromeOptions,
  deployChrome,
  deployEdge,
  deployFirefox,
  deployOpera,
  EdgeOptions,
  FirefoxOptions,
  OperaOptions
} from "@plasmo-corp/web-ext-deploy"

enum BrowserName {
  Chrome = "chrome",
  Firefox = "firefox",
  Opera = "opera",
  Edge = "edge"
}

type Keys = {
  [BrowserName.Chrome]: ChromeOptions
  [BrowserName.Firefox]: FirefoxOptions
  [BrowserName.Opera]: OperaOptions
  [BrowserName.Edge]: EdgeOptions
}

const supportedBrowserSet = new Set([
  BrowserName.Chrome,
  BrowserName.Firefox,
  BrowserName.Opera,
  BrowserName.Edge
])

async function run(): Promise<void> {
  try {
    // All the keys necessary to deploy the extension
    const keys: Keys = JSON.parse(getInput("keys", { required: true }))
    // Path to the zip file to be deployed
    const artifact = getInput("artifact")

    if (process.env.NODE_ENV === "test") {
      debug(Object.keys(keys).join(","))
      return
    }

    const deployPromises = Object.entries(keys).map(([browser, key]) => {
      if (!supportedBrowserSet.has(browser as BrowserName)) {
        return
      }

      if (!key.zip) {
        debug(`No zip for ${browser} provided`)
        if (!artifact) {
          debug("No artifact provided")
          throw new Error(`No artifact available to submit for ${browser}`)
        }
        key.zip = artifact
      }

      info(`Queueing ${browser} submission`)

      switch (browser) {
        case BrowserName.Chrome:
          return deployChrome(key as Keys[BrowserName.Chrome])
        case BrowserName.Firefox:
          return deployFirefox(key as Keys[BrowserName.Firefox])
        case BrowserName.Opera:
          return deployOpera(key as Keys[BrowserName.Opera])
        case BrowserName.Edge:
          return deployEdge(key as Keys[BrowserName.Edge])
        default:
          throw new Error(`Unknown browser ${browser}`)
      }
    })

    await Promise.all(deployPromises)
    info("All submissions complete")
  } catch (error) {
    if (error instanceof Error) setFailed(error.message)
  }
}

run()
