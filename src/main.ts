import { debug, getInput, info, setFailed, warning } from "@actions/core"
import type {
  ChromeOptions,
  EdgeOptions,
  FirefoxOptions,
  OperaOptions
} from "@plasmo-corp/bms"
import {
  BrowserName,
  deployChrome,
  deployEdge,
  deployFirefox,
  deployOpera,
  supportedBrowserSet
} from "@plasmo-corp/bms"

type Keys = {
  [BrowserName.Chrome]: ChromeOptions
  [BrowserName.Firefox]: FirefoxOptions
  [BrowserName.Opera]: OperaOptions
  [BrowserName.Edge]: EdgeOptions
}

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

    const browserEntries = Object.keys(keys).filter((browser) =>
      supportedBrowserSet.has(browser as BrowserName)
    ) as BrowserName[]

    if (browserEntries.length === 0) {
      setFailed("No supported browser found")
      return
    }

    let hasAtLeastOneZip = false
    // Enrich keys with zip artifact if needed
    browserEntries.forEach((browser: BrowserName) => {
      hasAtLeastOneZip = hasAtLeastOneZip || !!keys[browser].zip || !!artifact
      if (!keys[browser].zip) {
        info(`No zip for ${browser} provided`)
        if (!artifact) {
          warning(
            `🤖 No artifact available to submit for ${browser}, skipping...`
          )
        }
        keys[browser].zip = artifact
      }
    })

    if (!hasAtLeastOneZip) {
      setFailed("Could not find zip for any browsers")
    }

    const deployPromises = browserEntries.map((browser) => {
      if (!keys[browser].zip) return false
      info(`Queueing ${browser} submission`)

      switch (browser) {
        case BrowserName.Chrome:
          return deployChrome(keys[browser])
        case BrowserName.Firefox:
          return deployFirefox(keys[browser])
        case BrowserName.Opera:
          return deployOpera(keys[browser])
        case BrowserName.Edge:
          return deployEdge(keys[browser])
      }
    })

    const results = await Promise.allSettled(deployPromises)

    results.forEach((result, index) => {
      if (result.status === "rejected") {
        warning(result.reason)
      } else if (result.value) {
        info(`🚀 ${browserEntries[index]} submission successful`)
      }
    })

    info("🎉 Completed")
  } catch (error) {
    if (error instanceof Error) setFailed(error.message)
  }
}

run()
