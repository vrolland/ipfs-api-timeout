// const moduleConfig = require('ipfs-api/src/utils/module-config')
// const getConfig = require('ipfs-api/src/utils/default-config')

// const config = { 'api-path': '/api/v0/',
//   'user-agent': '/node-ipfs-api/20.2.0/',
//   host: 'localhost',
//   port: '5001',
//   protocol: 'http' };

// module.exports =  {
//     cat : (arg, callback) => {
//         console.log(getConfig());
//       const send = moduleConfig(config)
//       return require('./cat')(send)(arg, callback)
//     }
// }



'use strict'

const multiaddr = require('multiaddr')
const loadCommands = require('./load-commands')
const getConfig = require('ipfs-api/src/utils/default-config')
const sendRequest = require('./send-request')

function IpfsAPI (hostOrMultiaddr, port, opts) {
  const config = getConfig()

  try {
    const maddr = multiaddr(hostOrMultiaddr).nodeAddress()
    config.host = maddr.address
    config.port = maddr.port
  } catch (e) {
    if (typeof hostOrMultiaddr === 'string') {
      config.host = hostOrMultiaddr
      config.port = port && typeof port !== 'object' ? port : config.port
    }
  }

  let lastIndex = arguments.length
  while (!opts && lastIndex-- > 0) {
    opts = arguments[lastIndex]
    if (opts) break
  }

  Object.assign(config, opts)

  // autoconfigure in browser
  if (!config.host &&
    typeof self !== 'undefined') {
    const split = self.location.host.split(':')
    config.host = split[0]
    config.port = split[1]
  }

  const requestAPI = sendRequest(config)
  const cmds = loadCommands(requestAPI, config)
  cmds.send = requestAPI
  cmds.Buffer = Buffer // Added buffer in types (this should be removed once a breaking change is release)

  return cmds
}

exports = module.exports = IpfsAPI
