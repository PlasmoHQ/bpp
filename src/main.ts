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
    const artifact = getInput("zip") || getInput("artifact")
    const versionFile = getInput("version-file")

    const notes = getInput("notes")

    const verbose = !!getInput("verbose")

    if (verbose) {
      // All internal logging goes to info
      console.log = info
    }

    const browserEntries = Object.keys(keys).filter((browser) =>
      supportedBrowserSet.has(browser as BrowserName)
    ) as BrowserName[]

    if (browserEntries.length === 0) {
      throw new Error("No supported browser found")
    }

    const hasAtLeastOneZip =
      !!artifact || browserEntries.some((b) => !!keys[b].zip)

    if (!hasAtLeastOneZip) {
      throw new Error("No artifact found for deployment")
    }

    // Enrich keys with zip artifact and notes as needed
    browserEntries.forEach((browser: BrowserName) => {
      if (!keys[browser].zip) {
        if (!artifact) {
          warning(`🤖 SKIP: No artifact available to submit for ${browser}`)
        } else {
          keys[browser].zip = artifact
        }
      }
      if (!keys[browser].versionFile) {
        keys[browser].versionFile = versionFile
      }

      if (!!notes) {
        keys[browser].notes = notes
      }

      keys[browser].verbose = verbose
    })

    if (process.env.NODE_ENV === "test") {
      debug(JSON.stringify({ artifact, versionFile, verbose }))
      debug(browserEntries.join(","))
      return
    }

    const deployPromises = browserEntries.map((browser) => {
      if (!keys[browser].zip) return false
      info(`📦 QUEUE: Prepare for ${browser} submission`)

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
        setFailed(`🛑 FAIL: ${result.reason}`)
      } else if (result.value) {
        info(`🚀 DONE: ${browserEntries[index]} submission successful`)
      }
    })
  } catch (error) {
    if (error instanceof Error) {
      setFailed(`🛑 HALT: ${error.message}`)
    }
  }
}

run()
