# Hyperledger Fabric sample network

This is a sample project of Fabric 1.2.0 running a chaincode developed in Node.js. For a complete explanation about the construction and execution of the network please read the [Medium article](#) (Portuguese only).

## Requirements

* Docker 18.06.0 or later
* Docker-compose 1.22 or later
* Node.js 8.11.x family
* NPM (Node Package Manager) 5.6.0 or later
* cURL 7.x

## Commands

```bash
./downloadBinaries.sh

```

```bash
cd network
../bin/cryptogen generate --config=./crypto-config.yaml
```

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

```bash
docker-compose up -d
```
