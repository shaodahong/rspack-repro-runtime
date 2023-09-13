import { MultiCompiler, rspack } from '@rspack/core'
import path from 'path'
import { fileURLToPath } from "url";
import { RspackDevServer } from '@rspack/dev-server';
import Webpack from 'webpack'
import WebpackDev from 'webpack-dev-server'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url));


const isRunningWebpack = false;

const multipleCompilerInstance = isRunningWebpack ? Webpack : rspack
const devserverInstance = isRunningWebpack ? WebpackDev : RspackDevServer


const multipleCompiler = multipleCompilerInstance([{ name: 'first', entry: "./src/first/index" }, { name: 'last', entry: "./src/last/index" }].map((item) => ({
    mode: "development",
    devtool: 'inline-cheap-module-source-map',
    entry: {
        [item.name]: item.entry
    },
    plugins: [
        ...(isRunningWebpack ? [
        ] : [])
    ],
    // ...(isRunningWebpack ? {} : {
    //     builtins: {
    //         html: [{}],
    //     },
    // }),
    externals: ['react'],
    output: {
        clean: true,
        path: isRunningWebpack
            ? path.resolve(__dirname, "webpack-dist")
            : path.resolve(__dirname, "rspack-dist"),
        filename: `[name].js`,
        uniqueName: item.name
    },
    experiments: {
        css: true,
    },
    optimization: {
        removeEmptyChunks: true,
        // runtimeChunk: 'single'
    },
})));

const server = new devserverInstance(
    {
        hot: true,
        liveReload: false,
        allowedHosts: 'all',
        port: 8081,
        static: './',
        client: {
            webSocketURL: "https://scaling-fishstick-pjw7pqvqxp436v7j-8081.app.github.dev/ws"
        }
    },
    multipleCompiler,
);

server.start()