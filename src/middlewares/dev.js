import { Router } from 'express'
import webpack from 'webpack'
import devMiddleware from 'webpack-dev-middleware'
import hotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../../webpack.config.cjs'

const dev = () => {
    const webpackRouter = Router()

    const compiler = webpack(webpackConfig)
    webpackRouter.use(
        devMiddleware(compiler, {
            stats: true,
            publicPath: webpackConfig.output.publicPath,
        })
    )
    webpackRouter.use(hotMiddleware(compiler))
    return webpackRouter
}

export default dev
