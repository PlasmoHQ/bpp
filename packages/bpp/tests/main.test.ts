import { expect, test } from "@jest/globals"
import { ExecFileSyncOptions, execFileSync } from "child_process"
import { readFile } from "fs/promises"
import { resolve } from "path"
import { cwd, env, execPath } from "process"

const indexScript = resolve(cwd(), "dist", "index.js")

test.only("happy path", async () => {
  const templateKeysPath = resolve(cwd(), "..", "..", "keys.template.json")

  const templateKeys = await readFile(templateKeysPath, "utf8")

  env["INPUT_KEYS"] = templateKeys
  env["INPUT_ARTIFACT"] = "artifacts.zip"

  const options: ExecFileSyncOptions = {
    env
  }

  const output = execFileSync(execPath, [indexScript], options).toString(
    "utf-8"
  )
  expect(output).toMatchSnapshot()

  // try {
  //   const output = execFileSync(execPath, [ip], options).toString("utf-8")
  //   expect(output).toMatchSnapshot()
  // } catch (error: any) {
  //   console.log(typeof error)

  //   console.log(error["stdout"].toString("utf-8"))
  // }
})

test("will fail if no zip found", async () => {
  env["INPUT_KEYS"] = `{"chrome": {}}`
  env["INPUT_ARTIFACT"] = ""

  const options: ExecFileSyncOptions = {
    env
  }

  const tExec = () => execFileSync(execPath, [indexScript], options)

  expect(tExec).toThrowError()
})

test("get verbose flag successfully", async () => {
  env["INPUT_KEYS"] = `{"chrome": {}}`
  env["INPUT_ZIP"] = "artifacts.zip"
  env["INPUT_VERBOSE"] = "true"

  const options: ExecFileSyncOptions = {
    env
  }

  const output = execFileSync(execPath, [indexScript], options).toString(
    "utf-8"
  )
  expect(output).toMatchSnapshot()
})
