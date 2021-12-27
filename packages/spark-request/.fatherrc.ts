export default {
    esm: {
        type: 'babel',
        importLibToEs: true,
    },
    cjs: {type: 'babel', lazy: true},
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
