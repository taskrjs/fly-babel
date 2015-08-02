import { transform } from "babel"
export default function () {
  return this.filter("babel", (source, options) => {
    try { return transform(source, options).code }
    catch (e) { throw e }
  }, { ext: ".js" })
}
