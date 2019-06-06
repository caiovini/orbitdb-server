const path = require('path')
const ipfsClient = require('ipfs-http-client')
const OrbitDB = require('orbit-db')

const Logger = require('logplease')
const logger = Logger.create("orbit-db-http-server", { color: Logger.Colors.Yellow })
Logger.setLogLevel('ERROR')


const startIpfsAndOrbitDB = async (options) => {
  logger.debug("IPFS path:", options.ipfsPath)
  logger.debug("OrbitDB path:", options.orbitdbPath)
  return new Promise(async (resolve, reject) => {
    logger.debug("Starting IPFS")
    const ipfs = ipfsClient({
      host: '169.254.209.107', 
      port: 5001 , 
      protocol: 'http'})
    
      logger.debug("IPFS started")
      logger.debug("Starting OrbitDB")
      const orbitdb = await OrbitDB.createInstance(ipfs)
      resolve({ orbitdb: orbitdb, ipfs: ipfs })
  })
}

module.exports = startIpfsAndOrbitDB
