// @ts-check
import { readFile } from "fs/promises"
import { resolve } from "path"

/**
 * @return {import("esbuild").Plugin}
 */
export default function inlinePlugin({
  filter = /^inline:/,

  namespace = "_" + Math.random().toString(36).substring(2, 9)
}) {
  return {
    name: "esbuild-inline-fflate",
    setup(build) {
      build.onResolve({ filter }, (args) => {
        const realPath = args.path.replace(filter, "")
        return {
          path: resolve(args.resolveDir, realPath),
          namespace
        }
      })

      build.onLoad({ filter: /.*/, namespace }, async (args) => {
        let contents = await readFile(args.path, "utf8")

        // Use fflate to base64 the whole director to be inlined

        // Then in the client code, we inflate it and write it down to the file system

        return {
          contents,
          loader: "text"
        }
      })
    }
  }
}
