
/*******************************************************************************
 * Copyright 2018 Rodrigo Morbach. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License.  You may obtain a copy
 * of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/


/**
 * Sample chaincode for a simple transaction between a provider and a consumer.
 */
const shim = require('fabric-shim')

var DealChaincode = class {

    /**
     * Part of ChaincodeInterface. This method is called once when the chaincode is instantiated in the channel.
     * Can be used to perform an initial load on the ledger. 
     */
    async Init() {
        console.log('Init called')
        return shim.success('Chaincode instantiated');
    }

    /**
     * Part of ChaincodeInterface. This method is called for each transaction performed using this chaincode.
     */
    async Invoke(stub) {
        console.log('Invoke called')

        let ret = stub.getFunctionAndParameters();
        let creator = stub.getCreator();
        
        if (creator) {
            console.log(creator.mspid + ' invoking...');
        }

        let methodToInvoke = this[ret.fcn];
        if (!methodToInvoke) {
            shim.error(new Error('method name must be informed'));
        }

        try {
            let payload = await methodToInvoke(stub, ret.params);
            return shim.success(payload);
        } catch (e) {
            return shim.error(e);
        }
    }

    /**
     * Registers a product in the ledger. The product is a simple structure composed by an identifier, a name and a price.
     * @param {Object} stub provided by fabric-shim
     * @param {Array} args array of strings with product information, for example: ["productIdentifier", "product name", "product price"].
     */
    async registerProduct(stub, args) {
        if (args.length < 3) {
            throw new Error('Number of arguments is invalid. Provide 4.')
        }

        let productId = args[0];
        let productName = args[1];
        let productPrice = args[2];

        let productObject = {
            name: productName,
            price: productPrice
        };

        await stub.putState(productId, Buffer.from(JSON.stringify(productObject)));
    }

    /**
     * Query a product in the ledger using its identifier.
     * @param {Object} stub provided by fabric-shim,
     * @param {Array} args array of string with query parameters. In this case, only one argument is required. E.g, ["productIdentifier"].
     */
    async getProduct(stub, args) {

        if (args.length < 1) {
            throw new Error('Product identifier must be informed');
        }

        let productIdentifier = args[0];
        var productBytes = await stub.getState(productIdentifier);
        if (!productBytes || productBytes.toString().length <= 0) {
            throw new Error('Product with identifier ' + productIdentifier + ' not found');
        }
        return productBytes;
    }
}

let chaincode = new DealChaincode()
shim.start(chaincode)

