// @ts-check
import node from "@prisma/composer/node";
import { compute } from "@prisma/composer-prisma-cloud";

export default compute({
  name: "rendi1",
  deps: {},
  build: node({ module: import.meta.url, dir: "dist", entry: "main.js", dependencies: "external" }),
});
