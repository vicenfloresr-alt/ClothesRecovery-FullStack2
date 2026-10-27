// Configuración de Karma + Jasmine para ClothesRecovery.
// Karma abre un navegador (Chrome sin ventana), carga los archivos
// *.spec.js / *.spec.jsx de src/ y corre las pruebas escritas con Jasmine.
// karma-webpack + babel-loader convierten el JSX a JavaScript normal,
// igual que hace react-scripts cuando uno corre "npm start".

process.env.NODE_ENV = 'test';
process.env.BABEL_ENV = 'test';

// Si existe el Chromium de Playwright (entorno de desarrollo en la nube) se usa ese.
// En otro computador, Karma busca Google Chrome instalado (o usa CHROME_BIN si está definido).
const fs = require('fs');
const chromiumLocal = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
if (!process.env.CHROME_BIN && fs.existsSync(chromiumLocal)) {
  process.env.CHROME_BIN = chromiumLocal;
}

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'webpack'],
    plugins: [
      require('karma-jasmine'),
      require('karma-webpack'),
      require('karma-chrome-launcher'),
      require('karma-spec-reporter'),
      require('karma-coverage'),
    ],

    files: [
      { pattern: 'src/**/*.spec.js', watched: false },
      { pattern: 'src/**/*.spec.jsx', watched: false },
    ],
    preprocessors: {
      'src/**/*.spec.js': ['webpack'],
      'src/**/*.spec.jsx': ['webpack'],
    },

    webpack: {
      mode: 'development',
      devtool: false,
      resolve: { extensions: ['.js', '.jsx'] },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [[require.resolve('babel-preset-react-app'), { runtime: 'automatic' }]],
                // Instrumenta los archivos de src/ para medir cobertura
                // (los archivos .spec no cuentan).
                plugins: [
                  [require.resolve('babel-plugin-istanbul'), { exclude: ['**/*.spec.js', '**/*.spec.jsx'] }],
                ],
              },
            },
          },
        ],
      },
    },

    reporters: ['spec', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [{ type: 'text-summary' }, { type: 'html', subdir: 'html' }, { type: 'json-summary', subdir: '.', file: 'summary.json' }, { type: 'text', subdir: '.', file: 'detalle.txt' }],
    },

    browsers: ['ChromeHeadlessSinSandbox'],
    customLaunchers: {
      ChromeHeadlessSinSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu'],
      },
    },
    singleRun: true,
    restartOnFileChange: false,
  });
};
