#! /usr/bin/env node
const fs = require('fs')
const path = require('path')
const util = require('util')
const register = require('babel-register')
const clearModule = require('clear-module')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const chokidar = require('chokidar')
const ReactDOMServer = require('react-dom/server')

register({
  presets: ["es2015", "react"],
  extensions: [".jsx"],
})

let watchMode = false
process.argv.slice(2).forEach(flag => {
  switch (flag) {
    case '--watch': return watchMode = true
    default: throw new Error(`Unrecognized flag "${flag}"`)
  }
})

const readdir = util.promisify(fs.readdir.bind(fs))
const writeFile = util.promisify(fs.writeFile.bind(fs))
const rm = util.promisify(rimraf)

async function compileViews() {
  const files = await readdir(path.join(__dirname, '/views'))
  const jsxFiles = files.map(file => path.parse(file)).filter(file => file.ext === '.jsx')
  return Promise.all(jsxFiles.map(file => {
    const moduleName = `./views/${file.base}`
    console.log(`Compiling ${moduleName}`)
    clearModule(moduleName)
    const component = require(moduleName)
    const html = ReactDOMServer.renderToStaticMarkup(component())
    return writeFile(path.join(__dirname, 'html', `${file.name}.html`), html, { encoding: 'utf8' })
  }))
}

async function main() {
  await mkdirp('html')
  await compileViews()
  console.log('Compiled .jsx files in /views to /html')
  if (watchMode) watch()
}

function watch() {
  chokidar.watch('./views', { ignoreInitial: true }).on('all', async () => {
    await rm('html')
    await main()
  })
}

process.on("unhandledRejection", (reason) => {
  throw reason
})

main()
