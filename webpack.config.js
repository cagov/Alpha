const path = require("path");
const glob = require("glob");
const PATHS = {
  src: path.join(__dirname, "src")
};
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

//Minification options here -> https://github.com/DanielRuf/html-minifier-terser#options-quick-reference
const minificationOptions = {
  caseSensitive: true,
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: false,
  removeScriptTypeAttributes: true,
  useShortDoctype: true,
  //minifyJS: true,
  minifyCSS: true,
  sortAttributes: true,
  sortClassName: true,
  useShortDoctype: true
};
const excludedChunks = ["minwage", "food", "alerts", "contactus", "roads", "shelters", "water", "lifeline"];

//usage 
//    excludeChunks: excludeChucksExcept("roads"),
//    excludeChunks: excludeChucksExcept("roads","alerts"),
const excludeChucksExcept = (...args) => excludedChunks.filter(x=>!args.includes(x))


module.exports = {
  entry: {
    javascript: ["./src/js/index.js"],
    style: ["./src/css/_index.scss"],
    minwage: ["./src/js/minwage/index.js"],
    food: ["./src/js/foodbanks/index.js"],
    alerts: ["./src/js/alerts/index.js"],
    contactus: ['./src/js/contactus/index.js'],
    roads: ["./src/js/roads/index.js"],
    shelters: ["./src/js/shelters/index.js"],
    water: ["./src/js/water/index.js"],
    lifeline: ["./src/js/lifeline/index.js"]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.scss$/,
          chunks: "all",
          enforce: true
        }
      }
    }
  },
  plugins: [
    new CopyPlugin([
      { from: "src/serverfiles" },
      { from: "src/img", to: "img" }
    ]),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "css/[chunkhash].css"
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true })
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["**/*"]
    }),
    new HtmlWebpackPlugin({
      filename: "en/index.html",
      template: "src/index.html",
      excludeChunks: excludedChunks,
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: "en/news/index.html",
      template: "src/news/index.html",
      excludeChunks: excludedChunks,
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: "news/post.html",
      template: "src/news/post.html",
      excludeChunks: excludedChunks,
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: "en/about/index.html",
      template: "src/about/index.html",
      excludeChunks: excludedChunks,
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: "en/apply-discounted-phone-service/index.html",
      template: "src/services/apply-discounted-phone-service/index.html",
      excludeChunks: excludeChucksExcept("lifeline"),
      minify: minificationOptions
    }), 
    new HtmlWebpackPlugin({
      filename: "en/apply-online-discounted-phone-service/index.html",
      template: "src/services/apply-online-discounted-phone-service/index.html",
      excludeChunks: excludedChunks,
      minify: minificationOptions
    }),

    new HtmlWebpackPlugin({
      filename: "en/who-can-get-discounted-phone-service/index.html",
      template: "src/services/who-can-get-discounted-phone-service/index.html",
      excludeChunks: excludeChucksExcept("lifeline"),
      minify: minificationOptions
    }),
 
    new HtmlWebpackPlugin({
      filename: "en/apply-for-disability-insurance-benefits/index.html",
      template:
        "src/services/apply-for-disability-insurance-benefits/index.html",
      excludeChunks: excludedChunks,
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: "en/apply-for-cal-grant/index.html",
      template: "src/services/apply-for-cal-grant/index.html",
      excludeChunks: excludedChunks,
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: "en/apply-for-cal-grant/step-1/index.html",
      template: "src/services/apply-for-cal-grant/step-1/index.html",
      excludeChunks: excludedChunks,
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: "en/apply-for-cal-grant/step-2/index.html",
      template: "src/services/apply-for-cal-grant/step-2/index.html",
      excludeChunks: excludedChunks,
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: "en/apply-for-cal-grant/finish/index.html",
      template: "src/services/apply-for-cal-grant/finish/index.html",
      excludeChunks: excludedChunks,
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: "en/check-lane-closures/index.html",
      template: "src/services/check-lane-closures/index.html",
      excludeChunks: excludeChucksExcept("roads"),
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: 'en/contact-us/index.html',
      template: 'src/services/contact-us/index.html',
      excludeChunks: excludeChucksExcept("contactus"),
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: 'en/contact-us/results/index.html',
      template: 'src/services/contact-us/results/index.html',
      excludeChunks: excludeChucksExcept("contactus"),
      minify: minificationOptions
    }), 
    new HtmlWebpackPlugin({
      filename: 'en/contact-us/home/index.html',
      template: 'src/services/contact-us/home/index.html',
      excludeChunks: excludeChucksExcept("contactus"),
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: "en/sign-up-for-local-emergency-alerts/index.html",
      template: "src/services/sign-up-for-local-emergency-alerts/index.html",
      excludeChunks: excludeChucksExcept("alerts"),
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: "en/services/request-birth-certificate/index.html",
      template: "src/services/request-birth-certificate/index.html",
      excludeChunks: excludedChunks,
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: "en/request-birth-certificate/index.html",
      template: "src/services/request-birth-certificate/index.html",
      excludeChunks: excludedChunks,
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: "en/services/find-minimum-wage-your-city/index.html",
      template: "src/services/find-minimum-wage-your-city/index.html",
      excludeChunks: excludeChucksExcept("minwage"),
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: "en/find-minimum-wage-your-city/index.html",
      template: "src/services/find-minimum-wage-your-city/index.html",
      excludeChunks: excludeChucksExcept("minwage"),
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: "en/services/state-california-employee-holidays/index.html",
      template: "src/services/state-california-employee-holidays/index.html",
      excludeChunks: excludedChunks,
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: "en/state-california-employee-holidays/index.html",
      template: "src/services/state-california-employee-holidays/index.html",
      excludeChunks: excludedChunks,
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: "en/services/find-food-banks-near-you/index.html",
      template: "src/services/find-food-banks-near-you/index.html",
      excludeChunks: excludeChucksExcept("food"),
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: "en/find-food-banks-near-you/index.html",
      template: "src/services/find-food-banks-near-you/index.html",
      excludeChunks: excludeChucksExcept("food"),
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: "en/find-shelter/index.html",
      template: "src/services/find-shelter/index.html",
      excludeChunks: ["minwage", "food", "roads", "alerts", "contactus"],
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: "en/check-your-tap-water-quality/index.html",
      template: "src/services/water/index.html",
      excludeChunks: excludeChucksExcept("water"),
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename:
        "en/services/hire-licensed-contractor-home-improvements/index.html",
      template:
        "src/services/hire-licensed-contractor-home-improvements/index.html",
      excludeChunks: excludedChunks,
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: "en/hire-licensed-contractor-home-improvements/index.html",
      template:
        "src/services/hire-licensed-contractor-home-improvements/index.html",
      excludeChunks: excludedChunks,
      minify: minificationOptions
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: "defer",
      module: "js"
    })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "css/fonts/",
              publicPath: "fonts/"
            }
          }
        ]
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "img",
              publicPath: "../img"
            }
          }
        ]
      },
      {
        test: /\.xml$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]"
            }
          }
        ]
      }
    ]
  },
  output: {
    filename: "js/[name].[chunkhash].js",
    path: path.resolve(__dirname, "public/")
  }
};
