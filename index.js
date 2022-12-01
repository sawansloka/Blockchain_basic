const SHA256 = require('crypto-js/sha256');

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, transactions, prevHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.prevHash = prevHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }
  calculateHash() {
    return SHA256(
      this.index +
        this.prevHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log('Block mined: ' + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }
  createGenesisBlock() {
    return new Block(0, '13/12/2021', 'Genesis block', '0');
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log('Block successfully mined!');
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }
  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  }

  // addBlock(newBlock) {
  //   newBlock.prevHash = this.getLatestBlock().hash;
  //   // newBlock.hash = newBlock.calculateHash();
  //   newBlock.mineBlock(this.difficulty);
  //   this.chain.push(newBlock);
  // }
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.prevHash !== prevBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

let slokCoin = new Blockchain();
slokCoin.createTransaction(new Transaction('address1', 'address2', 100));
slokCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner .....');
slokCoin.minePendingTransactions('shlok-address');

console.log(
  '\nBalance of Shlok is',
  slokCoin.getBalanceOfAddress('shlok-address')
);

console.log('\n Starting the miner again.....');
slokCoin.minePendingTransactions('shlok-address');

console.log(
  '\nBalance of Shlok is',
  slokCoin.getBalanceOfAddress('shlok-address')
);

// console.log('Mining Block 1....');
// slokCoin.addBlock(new Block(1, '16/12/2021', { amount: 10 }));

// console.log('Mining Block 2....');
// slokCoin.addBlock(new Block(2, '18/12/2021', { amount: 200 }));

// console.log('Is blockchain valid?' + '  ' + slokCoin.isChainValid());

// console.log(JSON.stringify(slokCoin, null, 4));

// slokCoin.chain[1].transactions = { amount: 30 };
// slokCoin.chain[1].hash = slokCoin.chain[1].calculateHash();

// console.log('Is blockchain still valid?' + '  ' + slokCoin.isChainValid());

// console.log(JSON.stringify(slokCoin, null, 4));
