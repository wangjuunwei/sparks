export default {
    cjs: {type: 'babel', lazy: true},
    esm: {
        type: 'babel',
        importLibToEs: true,
    },
    umd: {
        name: 'sparkCrossStorage',
        globals: {
            sparkCrossStorage: 'sparkCrossStorage'
        },
    },
    target: 'browser',
    runtimeHelpers: true,
    extraBabelPlugins: [
        [
            '@babel/plugin-transform-runtime',
            {
                corejs: 3,
            },
        ],
    ],
    disableTypeCheck: false,
}
