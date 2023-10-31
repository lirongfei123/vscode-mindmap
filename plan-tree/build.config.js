module.exports = {
    "vite": false,
    "publicPath": './',
    "plugins": [
      [
        "build-plugin-moment-locales",
        {
          "locales": [
            "zh-cn"
          ]
        }
      ],
      [
        "build-plugin-ignore-style",
        {
          "libraryName": "@alifd/next"
        }
      ]
    ]
  }