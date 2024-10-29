/* eslint-disable import/no-extraneous-dependencies */
const path = require('node:path');
const { getDefaultConfig } = require('@expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules'), path.resolve(workspaceRoot, 'node_modules')];

config.transformer = { ...config.transformer, unstable_allowRequireContext: true };
config.transformer.minifierPath = require.resolve('metro-minify-terser');

module.exports = config;
