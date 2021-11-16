const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all",
    },
  };
  if (isProd) {
    config.minimizer = [
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin(),
    ]
  }
  return config;
};

const fileName = (extesion) => isDev ? `[name].${extesion}` : `[name].[hash].${extesion}`;

const cssLoaders = (extraLoader) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    "css-loader",
  ];

  if (extraLoader) {
    loaders.push(extraLoader);
  }

  return loaders;
};

const babelOptions = (extraPreset) => {
  const opts = {
    presets: [
      "@babel/preset-env",
    ],
    plugins: [
      "@babel/plugin-proposal-class-properties"
    ]
  };

  if (extraPreset) {
    opts.presets.push(extraPreset);
  }

  return opts;
}

const jsLoaders = () => {
  const loaders = [
    {
      loader:'babel-loader',
      options: babelOptions(),
    }];
  if (isDev) {
    loaders.push('eslint-loader');
  }
  return loaders;
}

module.exports = {
  context: path.resolve(__dirname, "src"), // упрощает создание конфига, говорит где лежат все исходники
  mode: "development", // режим
  entry: {
    // файлы входаб файл, который запускается первым
    main: ["@babel/polyfill", "./index.jsx"],
    analytics: "./analytics.ts",
  },
  output: {
    // паттерн name динамически указывает на ключ entry
    // паттерн contenthash - контент зависит от хэша файла
    filename: fileName('js'), // этот файл получим после сборки
    path: path.resolve(__dirname, "dist"), // __dirname - текущая директория
  },
  optimization: optimization(),
  // optimization: { // если у нас есть библиотека, к-рая подключается в нескольких файлах
  //   то с помощью этой настройки мы можем вынести эту библиотеку в один отдельный файл, тогда она не будет
  //   грущиться отдельно для каждого файла
  //   splitChunks: {
  //     chunks: 'all',
  //   }
  // },
  devServer: {
    port: 4200,
    hot: isDev,
  },
  resolve: {
    // extensions: ['.js'], // какие форматы искать, если формат файла не указан при импорте
    alias: {
      // позволяет избавиться от длинных путей в импортах, типа: ../../../../utils/style/index
      "@models": path.resolve(__dirname, "src/models"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  // devtool: 'eval-cheap-module-source-map', 
  plugins: [
    new HTMLWebpackPlugin({
      template: "./index.html",
      minify: {
        // для оптимизации html файлов, убирает лишние пробелы, коммента, сжимает
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/favicon.ico"),
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: fileName('css'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        // use: ["style-loader", "css-loader"], вместо это style-loader mini plugin
        // use: [
        //   {
        //     loader: MiniCssExtractPlugin.loader,
        //      options: {
        //        hmr: isDev, //! больше не существует options hot module replacement - мы можем изменять определенные сущности без перезагрузки страницы
        //        reloadAll: true //
        //      }
        //   },
        //   "css-loader",
        // ],
        use: cssLoaders(),
      },
      {
        test: /\.less$/,
        use: cssLoaders("less-loader"),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders("sass-loader"),
      },
      {
        test: /\.(png|jpg|jpeg|svg|gif)$/,
        type: "asset/resource",
      },
      {
        test: /\.xml$/,
        use: ["xml-loader"],
      },
      {
        test: /\.csv$/,
        use: ["csv-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, // убирает из поиска папку или файл, указанный здесь, что это не нужно компилировать
        use: jsLoaders(),
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/, // убирает из поиска папку или файл, указанный здесь, что это не нужно компилировать
        use: {
          loader: "babel-loader",
          options: babelOptions("@babel/preset-typescript")
        }
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/, // убирает из поиска папку или файл, указанный здесь, что это не нужно компилировать
        use: {
          loader: "babel-loader",
          options: babelOptions("@babel/preset-react")
        }
      },
    ],
  },
};
