const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#DC5FC9",
              "@border-color-base": "#DC5FC9",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
