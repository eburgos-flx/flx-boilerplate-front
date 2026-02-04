const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Required for monorepo: Metro must watch and resolve from root so
// expo-router and other deps in root node_modules are found. Without this,
// the bundle can fail to register the app (AppRegistry.runApplication error).
config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// Resolve custom path aliases (@flx-front/*)
config.resolver.extraNodeModules = {
  "@flx-front/shared/util": path.resolve(monorepoRoot, "libs/shared/util/src"),
  "@flx-front/shared/store": path.resolve(
    monorepoRoot,
    "libs/shared/store/src",
  ),
  "@flx-front/shared/data-access": path.resolve(
    monorepoRoot,
    "libs/shared/data-access/src",
  ),
  "@flx-front/ui-mobile": path.resolve(monorepoRoot, "libs/ui/src/mobile"),
  "@flx-front/ui-web": path.resolve(monorepoRoot, "libs/ui/src/web"),
};

module.exports = config;
