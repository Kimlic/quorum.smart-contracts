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
      from: "0xfb47cf70193e5f85c8533e1e1ad15a4f21dd1287",
      host: "40.118.69.43:22000",
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
      from: "0xe0dfcd8ca47eec41d74d9e14760f9d5c5de78177",
      host: "127.0.0.1",
      port: 22000,
      network_id: "*",
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
