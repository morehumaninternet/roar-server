#! /usr/bin/env node
const chalk = require('chalk')
const tee = require('tee')
const stripAnsi = require('strip-ansi')
const { PassThrough } = require('stream')
const readline = require('readline')
const concurrently = require('concurrently')
const { assert } = require('chai')
const { spawn } = require('child_process')

// Parse build flags and environment variables
let watchMode = false
process.argv.slice(2).forEach(flag => {
  switch (flag) {
    case '--watch': return watchMode = true
    default: throw new Error(`Unrecognized flag "${flag}"`)
  }
})

// Colors!
const blue = chalk.hex('#164176')
const pink = chalk.hex('#fa759e')
const green = chalk.hex('#6FCF97')
const gold = chalk.hex('#FFCA00')
const purple = chalk.hex('#8000800')
const normalText = blue
const emphasis = pink.bold

const scssCommand = (entrypoint, color) => ({
  name: color(`scss:${entrypoint}`),
  command: `./node_modules/.bin/sass scss/${entrypoint}.scss css/${entrypoint}.css ${watchMode ? '--watch' : ''}`
})

// The commands to run, give each a color so that they appear distinct in the terminal
const commands = [
  scssCommand('common', green),
  scssCommand('index', green),
  scssCommand('welcome', green),
  {
    name: gold(`typescript`),
    command: `./node_modules/.bin/tsc ${watchMode ? '--watch --preserveWatchOutput' : ''}`
  },
  {
    name: purple(`views`),
    command: `npm run views ${watchMode ? ' -- --watch' : ''}`
  },
]

// In watch mode, run a server as a child process, forwarding stdout and stderr
let server

function startServer() {
  server = spawn('npm', ['start'])
  server.stdout.pipe(process.stdout)
  server.stderr.pipe(process.stderr)
}

function restartServer() {
  console.log('restarting server...')
  server.on('exit', startServer)
  server.kill()
  server = null // Unset the reference to the server so that we don't try to restart it again if another command is completed before the server is killed
}


// Create an output stream that writes to process.stdout
// and to a PassThrough stream that can be read from to determine command progress.
const passThrough = new PassThrough()
const outputStream = tee(process.stdout, passThrough)

// Log that the build is starting
console.log(
  '🛠  ' +
  normalText('Building the Roar! server ') +
  (watchMode ? emphasis('in watch mode ') : '') +
  '\n'
)

// Run the build. If any commands fail, kill the others and exit with its exit code
concurrently(commands, { outputStream, prefix: '{name} {time}', killOthers: ['failure'] }).catch(results => {
  const { exitCode } = results.find(result => result.exitCode !== 0 && typeof result.exitCode === 'number')
  process.exit(exitCode)
})

// On a successful build, let the user know.
// When not in watch mode, destroy the passThrough as we no longer have any use for it.
// When in watch mode, start the server.
function onSuccessfulBuild() {
  const toLog = watchMode
    ? 'First build successful! Continuing to watch files...'
    : 'Build successful!'

  console.log(`\n🎉 ${emphasis(toLog)}\n`)

  if (!watchMode) {
    passThrough.destroy()
  } else {
    startServer()
  }
}

// Keep track of how many commands are done and callback onSuccessfulBuild when they are all complete
let commandsDone = 0
const onCommandCompleted = () => {
  commandsDone++
  if (commandsDone === commands.length) {
    onSuccessfulBuild()
  } else if (server) {
    restartServer()
  }
}

// Read the passThrough stream line by line and call back onCommandCompleted when
// we detect that certain tasks completed successfully. In watch mode, commands
// are done when they read Compiled|created. Otherwise, they are only done with
// they exit with code 0
readline.createInterface(passThrough).on('line', line => {
  const commandCompletedRegex = watchMode
    ? /(^.+ Found 0 errors\. Watching for file changes\.$)|(^.+ Compiled .+\.scss to .+\.css\.$)|(^.+ Compiled \.jsx files in \/views to \/html$)/
    : /^.* exited with code 0/

  if (commandCompletedRegex.test(stripAnsi(line))) {
    onCommandCompleted()
  }
})
