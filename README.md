# Hyperledger Fabric sample network

This is a sample project of Fabric 1.4.0 running a chaincode developed in Node.js. For a complete explanation about the construction and execution of the network please read the [Medium article](https://medium.com/@morbachrodrigo/criando-uma-rede-blockchain-com-hyperledger-fabric-e-node-js-4192c964e45a) (Portuguese only).

## Requirements

* Docker 18.06.0 or later
* Docker-compose 1.22 or later
* Node.js 8.11.x family
* NPM (Node Package Manager) 5.6.0 or later
* cURL 7.x

## Commands

```bash
$ ./downloadBinaries.sh

```

```bash
$ cd network
$ ../bin/cryptogen generate --config=./crypto-config.yaml
```

```bash
$ ../bin/configtxgen -profile OrgsOrdererGenesis -outputBlock ./channel-artifacts/genesis.block
```

```bash
$ ../bin/configtxgen -profile OrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID samplechannel
```

```bash
$ ../bin/configtxgen -profile OrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/ProviderMSPanchors.tx -channelID samplechannel -asOrg ProviderMSP
```

```bash
$ ../bin/configtxgen -profile OrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/ConsumerMSPanchors.tx -channelID samplechannel -asOrg ConsumerMSP
```

```bash
$ docker-compose up -d
```
```
$ docker exec -it cli bash

$ peer channel create -o orderer.sampledomain.com:7050 -c samplechannel -f ./channel-artifacts/channel.tx

$ peer channel join -b samplechannel.block

$ export CORE_PEER_ADDRESS=peer1.provider.sampledomain.com:7051

$ peer channel join -b samplechannel.block

$ export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/consumer.sampledomain.com/users/Admin\@consumer.sampledomain.com/msp/

$ export CORE_PEER_ADDRESS=peer0.consumer.sampledomain.com:7051

$ export CORE_PEER_LOCALMSPID=ConsumerMSP

$ peer channel join -b samplechannel.block

$ export CORE_PEER_ADDRESS=peer1.consumer.sampledomain.com:7051

$ peer channel join -b samplechannel.block

$ export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/provider.sampledomain.com/users/Admin\@provider.sampledomain.com/msp/

$ export CORE_PEER_ADDRESS=peer0.provider.sampledomain.com:7051

$ export CORE_PEER_LOCALMSPID=ProviderMSP

$ peer channel update -o orderer.sampledomain.com:7050 -c samplechannel -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx

$ export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/consumer.sampledomain.com/users/Admin\@consumer.sampledomain.com/msp/

$ export CORE_PEER_ADDRESS=peer0.consumer.sampledomain.com:7051

$ export CORE_PEER_LOCALMSPID=ConsumerMSP

$ peer channel update -o orderer.sampledomain.com:7050 -c samplechannel -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx
```

## Chaincode

```
$ export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/provider.sampledomain.com/users/Admin\@provider.sampledomain.com/msp/

$ export CORE_PEER_ADDRESS=peer0.provider.sampledomain.com:7051

$ export CORE_PEER_LOCALMSPID=ProviderMSP

$ peer chaincode install -n deal -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/deal

$ export CORE_PEER_ADDRESS=peer1.provider.sampledomain.com:7051

$ peer chaincode install -n deal -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/deal

$ export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/consumer.sampledomain.com/users/Admin\@consumer.sampledomain.com/msp/

$ export CORE_PEER_ADDRESS=peer0.consumer.sampledomain.com:7051

$ export CORE_PEER_LOCALMSPID=ConsumerMSP

$ peer chaincode install -n deal -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/deal

$ export CORE_PEER_ADDRESS=peer1.consumer.sampledomain.com:7051

$ peer chaincode install -n deal -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/deal

$ peer chaincode instantiate -o orderer.sampledomain.com:7050 -C samplechannel -l node -n deal -v 1.0 -c '{"Args":[]}'

$ export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/provider.sampledomain.com/users/Admin\@provider.sampledomain.com/msp/

$ export CORE_PEER_ADDRESS=peer0.provider.sampledomain.com:7051

$ export CORE_PEER_LOCALMSPID=ProviderMSP

$ peer chaincode invoke -n deal -c '{"Args":["123", "Product one", "10"], "Function":"registerProduct"}' -C samplechannel

$ peer chaincode query -n deal -c '{"Args":["123"], "Function":"getProduct"}' -C samplechannel
```


