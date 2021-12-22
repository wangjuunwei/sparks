const fs = require('fs')
const shell = require('shelljs')
const getLogger = require('webpack-log');
const log = getLogger({name: 'sparks-build'});
console.log('\x1B[36m%s\x1B[0m', '开始执行打包命令....')
const rootPath = process.cwd().split('packages')[0] + '/packages'

function handlePathList(): string[] {
    let pathList = []

    var argv = require('minimist')(process.argv.slice(2));
    if (argv._.length > 0) {
        pathList = argv._
    } else {
        pathList = fs.readdirSync(rootPath)
    }
    return pathList
}

function handlePromise(path: string): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(`${rootPath}/${path}/`)) {
            shell.cd(`${rootPath}/${path}/`).exec('npm run build', function (code, _stdout, stderr) {
                if (code == 0) {
                    resolve({path, code})
                }
                if (code != 0 && stderr) {
                    reject({code, path, stderr})
                }
            });
        } else {
            reject({code: -1, path, stderr: '文件目录不存在'})
        }

    })
}

function mergePromise(pathArray: string[]) {
    let arr = [];

    async function run() {
        for (let path of pathArray) {
            if (!(/\./.test(path))) {
                try {
                    arr.push(await handlePromise(path) as never);
                } catch (e) {
                    arr.push(e as never);
                }

            }

        }
        return arr;
    }

    return run();
}

function init() {
    return (async () => {
        let pathList = handlePathList()
        let res = await mergePromise(pathList)
        res.forEach((item: { path: string, code: number, stderr: any }) => {
            if (item.code == 0) {
                log.info('\x1B[32m' + `${item.path}   打包成功` + '\x1B[0m');
            } else {
                log.error('\x1B[31m' + `${item.path}  打包失败  ${item.stderr}` + '\x1B[0m')
            }
        })
    })()
}

init()
