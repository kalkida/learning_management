const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#E7752B",
              "@border-color-base": "#EAECF0",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
