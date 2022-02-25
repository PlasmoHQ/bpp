import { expect, test } from "@jest/globals"
import { ExecFileSyncOptions, execFileSync } from "child_process"
import { readFile } from "fs/promises"
import { join } from "path"
import { cwd, env, execPath } from "process"

const ip = join(cwd(), "dist", "index.js")

test("happy path", async () => {
  const templateKeysPath = join(cwd(), "keys.template.json")
  const templateKeys = await readFile(templateKeysPath, "utf8")

  env["INPUT_KEYS"] = templateKeys
  env["INPUT_ARTIFACT"] = "artifacts.zip"

  const options: ExecFileSyncOptions = {
    env
  }

  const output = execFileSync(execPath, [ip], options).toString("utf-8")

  expect(output).toMatchSnapshot()
})

test("will fail if no zip found", async () => {
  env["INPUT_KEYS"] = `{"chrome": {}}`
  env["INPUT_ARTIFACT"] = ""

  const options: ExecFileSyncOptions = {
    env
  }

  const tExec = () => execFileSync(execPath, [ip], options)

  expect(tExec).toThrowError()
})
