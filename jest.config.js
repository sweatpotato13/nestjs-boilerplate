const { pathsToModuleNameMapper } = require("ts-jest");
const {
    compilerOptions: { paths }
} = require("./tsconfig.json");

module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    transform: {
        "^.+\\.(t|j)s$": ["ts-jest", {
            tsconfig: "tsconfig.spec.json"
        }]
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    roots: ["<rootDir>/src"],
    testRegex: "./src/.*\\.(test|spec)?\\.(ts|ts)$",
    coverageDirectory: "./coverage",
    moduleNameMapper: pathsToModuleNameMapper(paths, {
        prefix: "<rootDir>"
    }),
    clearMocks: true,
    maxWorkers: 1
};
