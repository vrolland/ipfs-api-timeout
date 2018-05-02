'use strict'

function requireCommands () {
  const cmds = {
    // Files (not MFS)
    add: require('ipfs-api/src/files/add'),
    catReadableStream: require('./cat-readable-stream'),
    cat: require('./cat'),
    pin: require('ipfs-api/src/pin')
  }

  return cmds
}

function loadCommands (send, config) {
  const files = requireCommands()
  const cmds = {}

  Object.keys(files).forEach((file) => {
    cmds[file] = files[file](send, config)
  })

  return cmds
}

module.exports = loadCommands
