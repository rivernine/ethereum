var solc = require('solc');
var fs = require('fs');

function findImports(_path) {
  if (_path[0] === '.') {
    return {
      contents: fs.readFileSync(path.join(directoryPath, _path)).toString()
    }
  } else {
    return {
      contents: fs.readFileSync(path.join(config.projectRoot, 'node_modules', _path)).toString()
    }
  }
}

async function main() {
  const fs = require('fs');
  const solc = require('solc');

  const source = fs.readFileSync('./contracts/GenerativeAlphaDev.sol', 'utf8'); //read raw source file 

  const input = {
    language: "Solidity",
    sources: {
      "GenerativeAlphaDev.sol": {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };
  const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
  console.log(output)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// deploy to hardhat virtual network
// 실행: npx hardhat run scripts/deploy.js
//
// deploy to remote test network
// 실행: npx hardhat run scripts/deploy.js --network <network-name>