import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["ts", "js"],
  moduleNameMapper: {
    "^@server/(.*)$": "<rootDir>/../../apps/server/src/$1",
  },
};

export default config;
