const { pathsToModuleNameMapper } = require("ts-jest");
const {
    compilerOptions: { paths }
} = require("./tsconfig.json");

module.exports = {
    testEnvironment: "node",
    extensionsToTreatAsEsm: [".ts"],
    transform: {
        "^.+\\.tsx?$": ["ts-jest", {
            tsconfig: "tsconfig.spec.json",
            useESM: true
        }]
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    roots: ["<rootDir>/src"],
    testRegex: "./src/.*\\.(test|spec)?\\.(ts|ts)$",
    coverageDirectory: "./coverage",
    moduleNameMapper: pathsToModuleNameMapper(paths, {
        prefix: "<rootDir>"
    }),
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    clearMocks: true,
    maxWorkers: 1
};
