module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  mocha: {
    useColors: true
  },
  networks: {
    KIM1: {
      host: "51.141.123.209",
      port: 22000,
      network_id: "10",
      gasPrice: 0,
      gas: 4800000
    }
  }
}
