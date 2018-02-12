const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  
  entry: "./src/sqr.js",

  output: {
    path: path.resolve(__dirname, "./dist"),
    publicPath: "/dist/",
    filename: "build.js"
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        use: ["vue-style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.sass$/,
        use: ["vue-style-loader", "css-loader", "sass-loader?indentedSyntax"]
      },
      {
        test: /\.(glsl|vs|fs)$/, loader: "shader-loader", exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            scss: ["vue-style-loader", "css-loader", "sass-loader"],
            sass: [
              "vue-style-loader",
              "css-loader",
              "sass-loader?indentedSyntax"
            ]
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]?[hash]",
          publicPath: "/dist/assets/"
        }
      }
    ]
  },
  
  resolve: {
    alias: {
      vue$: "vue/dist/vue.runtime.js",
      pixi: "pixi.js/dist/pixi.js",
      three: "three/build/three.min.js",
      twgl: "twgl.js/dist/4.x/twgl-full.js"
    },
    extensions: ["*", ".js", ".vue", ".json"]
  },

  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  
  performance: {
    hints: "warning"
  },
  
  devtool: "cheap-module-source-map"
};

module.exports.plugins = [
  //https://github.com/ampedandwired/html-webpack-plugin
  // new HtmlWebpackPlugin({
  //   filename: 'index.html',
  //   template: 'index.html',
  //   inject: false
  // })
  new webpack.HotModuleReplacementPlugin({
    // Options...
  })
];

if (process.env.NODE_ENV === 'production') {

  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),

    new UglifyJsPlugin({
      sourceMap: false,
      uglifyOptions: {
        warnings: false
      }
    }),

    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: function (module) {
    //     return module.context && module.context.indexOf('node_modules') !== -1;
    //   }
    // }),

    new webpack.LoaderOptionsPlugin({
      minimize: true
    })

  ])
}
