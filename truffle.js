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
    testRpc: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "10",
      gas: 4612388
    },
    kubernetesNode: {
      host: "127.0.0.1",
      port: 22100,
      network_id: "10",
      gasPrice: 0,
      gas: 4612388
    },
    dev: {
      host: "40.115.43.126",
      port: 22000,
      network_id: "10",
      gasPrice: 0,
      gas: 4612388
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      gasPrice: 0,
      gas: 4612388,
      mnemonic:
        "chapter run clever race sure shoot solution aisle possible ridge flock august"
    },
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
      gas: 4612388
    },
    KIM3: {
      host: "127.0.0.1",
      port: 22002,
      network_id: "10",
      gasPrice: 0,
      gas: 4612388
    },
    KIM3: {
      host: "127.0.0.1",
      port: 22004,
      network_id: "10",
      gasPrice: 0,
      gas: 4612388
    }
  }
};
