
const emptyAddress = "0x0000000000000000000000000000000000000000";

const createAccountAndSet1EthToBalance = async (web3, coinbase, password = "p@ssw0rd") => {
    const { accountAddress, accountPassword } = await createAccount(web3, password);
    await sendEthToAccount(web3, coinbase, accountAddress);
    return { accountAddress, accountPassword };
}


const createAccount = async (web3, accountPassword = "p@ssw0rd") => {//default value in accountPassword is only for creating test accounts
    const accountAddress = await web3.personal.newAccount(accountPassword);
    await web3.personal.unlockAccount(accountAddress, accountPassword, 1000);
    return { accountAddress, accountPassword };
}

const sendEthToAccount = async (web3, from, to, value = 1000000000000000000) => {
    await web3.eth.sendTransaction({"from": from, "to": to, "value": value});
}

module.exports = { emptyAddress, createAccountAndSet1EthToBalance, createAccount, sendEthToAccount };