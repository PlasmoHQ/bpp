import * as core from "@actions/core"
import {
  deployChrome,
  deployEdge,
  deployFirefox,
  deployOpera
} from "web-ext-deploy"

enum BrowserName {
  Chrome = "chrome",
  Firefox = "firefox",
  Opera = "opera",
  Edge = "edge"
}

type Keys = {
  [BrowserName.Chrome]: Parameters<typeof deployChrome>[0]
  [BrowserName.Firefox]: Parameters<typeof deployFirefox>[0]
  [BrowserName.Opera]: Parameters<typeof deployOpera>[0]
  [BrowserName.Edge]: Parameters<typeof deployEdge>[0]
}

async function run(): Promise<void> {
  try {
    // All the keys necessary to deploy the extension
    const keys: Keys = JSON.parse(core.getInput("keys", { required: true }))
    // Path to the zip file to be deployed
    const artifact = core.getInput("artifact")

    const deployPromises = Object.entries(keys).map(([browser, key]) => {
      if (!key.zip) {
        core.debug(`No zip for ${browser} provided`)
        if (!artifact) {
          core.debug("No artifact provided")
          throw new Error(`No artifact available to submit for ${browser}`)
        }
        key.zip = artifact
      }

      core.debug(`Queueing ${browser} submission`)

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
    core.setOutput("ok", true)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
