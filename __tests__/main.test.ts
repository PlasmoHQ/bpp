import { test } from "@jest/globals"
import { execFileSync, ExecFileSyncOptions } from "child_process"
import { readFile } from "fs/promises"
import { join } from "path"
import { cwd, env, execPath } from "process"

test("dry runner with env/stdout protocol", async () => {
  const templateKeysPath = join(cwd(), "keys.template.json")
  const ip = join(cwd(), "lib", "main.mjs")
  const templateKeys = await readFile(templateKeysPath, "utf8")

  env["INPUT_KEYS"] = templateKeys
  env["NODE_ENV"] = "test"

  const options: ExecFileSyncOptions = {
    env
  }

  console.log(execFileSync(execPath, [ip], options).toString())
})
