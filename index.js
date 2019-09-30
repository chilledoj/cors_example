const server = require('./server')

const ports = process.argv.slice(2)
if(ports.length !== 2){
  console.error("ports not specified correctly - pass in as first argument")
  process.exit(-1)
}

const port1 = parseInt(ports[0])
const port2 = parseInt(ports[1])
const host = 'http://localhost'

server({
  port: port1,
  otherPort: port2,
  host,
  apiEndpoint: `${host}:${port1}/api`,
  enableCors: true
})
server({
  port: port2,
  otherPort: port1,
  host,
  apiEndpoint: `${host}:${port1}/api`,
})
console.log("Running both servers")
