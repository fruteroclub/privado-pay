export const SimpleSenderCChainAbi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "destinationAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "num1",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "num2",
                "type": "uint256"
            }
        ],
        "name": "NumbersSent",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "a",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "b",
                "type": "uint256"
            }
        ],
        "name": "encodeNumbers",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "destinationAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "num1",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "num2",
                "type": "uint256"
            }
        ],
        "name": "sendNumbers",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const; 