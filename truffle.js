module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    KIM1: {
      host: "127.0.0.1",
      port: 22000,
      network_id: "10",
      gasPrice: 0,
      gas: 4612388
    },
    KIM2: {
      host: "127.0.0.1",
      port: 22001,
      network_id: "10",
      gasPrice: 0,
      gas: 4612388,
      mnemonic: "chapter run clever race sure shoot solution aisle possible ridge flock august"
    },
    KIM3: {
      host: "127.0.0.1",
      port: 22002,
      network_id: "10",
      gasPrice: 0,
      gas: 4612388
    }
  }
}