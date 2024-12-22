const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  watchFolders: [], // Lista de diretórios específicos para monitorar, se necessário
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  server: {
    // Reduzir o número de workers
    enhanceMiddleware: (middleware) => middleware,
  },
  resolver: {
    blacklistRE: /node_modules\/.*\/node_modules\/react-native\/.*/,
  },
  maxWorkers: 2, // Diminua o número de workers para evitar sobrecarga
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
