// @ts-check
import { module } from "@prisma/composer";
import rendi1Service from "./service.mjs";

export default module("rendi-js", ({ provision }) => {
  provision(rendi1Service);
});
