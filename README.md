# Hyperledger Fabric sample network

This is a sample project of Fabric 1.4.0 running a chaincode developed in Node.js. For a complete explanation about the construction and execution of the network please read the [Medium article](https://medium.com/@morbachrodrigo/criando-uma-rede-blockchain-com-hyperledger-fabric-e-node-js-4192c964e45a) (Portuguese only).

## Requirements

* Docker 18.06.0 or later
* Docker-compose 1.22 or later
* Node.js 8.11.x family
* NPM (Node Package Manager) 5.6.0 or later
* cURL 7.x

## Blockchain network configuration


### Install Hyperledger Fabric's binaries  

> :warning: be sure to run the following command in root directory

```bash
curl https://raw.githubusercontent.com/hyperledger/fabric/master/scripts/bootstrap.sh | bash -s -- 1.4.0 1.5.2 -d -s
```


### Generate cryptographic material from participants

> :warning: be sure to run the following command in /network directory

```bash
../bin/cryptogen generate --config=./crypto-config.yaml
```


### Generate channel artifacts

> :warning: be sure to run the following commands in /network directory

```bash
../bin/configtxgen -profile OrgsOrdererGenesis -outputBlock ./channel-artifacts/genesis.block
```

```bash
../bin/configtxgen -profile OrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID samplechannel
```

```bash
../bin/configtxgen -profile OrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/ProviderMSPanchors.tx -channelID samplechannel -asOrg ProviderMSP
```

```bash
../bin/configtxgen -profile OrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/ConsumerMSPanchors.tx -channelID samplechannel -asOrg ConsumerMSP
```


### Create network participants 

> :warning: be sure to run the following commands in /network directory

```bash
docker compose up
```


### Access container terminal

> :warning: be sure to run the following commands in /network directory

```bash
docker exec -it cli bash
```


### Create samplechannel channel

```bash
peer channel create -o orderer.sampledomain.com:7050 -c samplechannel -f ./channel-artifacts/channel.tx
```


### Add participants to samplechannel channel

```bash
peer channel join -b samplechannel.block
```

```bash
export CORE_PEER_ADDRESS=peer1.provider.sampledomain.com:7051
peer channel join -b samplechannel.block
```

```bash
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/consumer.sampledomain.com/users/Admin\@consumer.sampledomain.com/msp/

export CORE_PEER_ADDRESS=peer0.consumer.sampledomain.com:7051
export CORE_PEER_LOCALMSPID=ConsumerMSP

peer channel join -b samplechannel.block
```

```bash
export CORE_PEER_ADDRESS=peer1.consumer.sampledomain.com:7051
peer channel join -b samplechannel.block
```


### Update peer anchor information on channel

```bash
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/provider.sampledomain.com/users/Admin\@provider.sampledomain.com/msp/

export CORE_PEER_ADDRESS=peer0.provider.sampledomain.com:7051
export CORE_PEER_LOCALMSPID=ProviderMSP
```

```bash
peer channel update -o orderer.sampledomain.com:7050 -c samplechannel -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx
```

```bash
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/consumer.sampledomain.com/users/Admin\@consumer.sampledomain.com/msp/

export CORE_PEER_ADDRESS=peer0.consumer.sampledomain.com:7051
export CORE_PEER_LOCALMSPID=ConsumerMSP

peer channel update -o orderer.sampledomain.com:7050 -c samplechannel -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx
```


## Chaincode


### Install chaincode on the network

```bash
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/provider.sampledomain.com/users/Admin\@provider.sampledomain.com/msp/

export CORE_PEER_ADDRESS=peer0.provider.sampledomain.com:7051
export CORE_PEER_LOCALMSPID=ProviderMSP
```

```bash
peer chaincode install -n deal -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/deal
```

```bash
export CORE_PEER_ADDRESS=peer1.provider.sampledomain.com:7051
peer chaincode install -n deal -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/deal
```

```bash
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/consumer.sampledomain.com/users/Admin\@consumer.sampledomain.com/msp/

export CORE_PEER_ADDRESS=peer0.consumer.sampledomain.com:7051
export CORE_PEER_LOCALMSPID=ConsumerMSP

peer chaincode install -n deal -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/deal
```

```bash
export CORE_PEER_ADDRESS=peer1.consumer.sampledomain.com:7051
peer chaincode install -n deal -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/deal
```


### Instantiate the chaincode on the samplechannel channel

```bash
peer chaincode instantiate -o orderer.sampledomain.com:7050 -C samplechannel -l node -n deal -v 1.0 -c '{"Args":[]}'
```


### Perform operations on the ledger through chaincode

```bash
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/provider.sampledomain.com/users/Admin\@provider.sampledomain.com/msp/

export CORE_PEER_ADDRESS=peer0.provider.sampledomain.com:7051
export CORE_PEER_LOCALMSPID=ProviderMSP
```

```bash
peer chaincode invoke -n deal -c '{"Args":["123", "Product one", "10"], "Function":"registerProduct"}' -C samplechannel
```

```bash
peer chaincode query -n deal -c '{"Args":["123"], "Function":"getProduct"}' -C samplechannel
```
