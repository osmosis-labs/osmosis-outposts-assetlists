import { AssetList, Chain, IBCInfo } from '@chain-registry/types';
import { readFileSync } from 'fs';
import { ibc } from 'chain-registry';

export const assetListCache = new Map<string, AssetList>();
export const chainCache = new Map<string, Chain>();
export const ibcConfigs = [...ibc];

export const readIbcConfig = (
	chain1Name: string,
	chain2Name: string,
	testnet = false,
): IBCInfo[] => {
	let data: string | undefined = undefined;

	try {
		data = readFileSync(
			`chain-registry/${
				testnet ? 'testnets/_IBC' : '_IBC'
			}/${chain1Name}-${chain2Name}.json`,
			'utf-8',
		);
	} catch (err) {
		data = readFileSync(
			`chain-registry/${
				testnet ? 'testnets/_IBC' : '_IBC'
			}/${chain2Name}-${chain1Name}.json`,
			'utf-8',
		);
	}

	if (data) {
		const ibcConfig: IBCInfo = JSON.parse(data);

		ibcConfigs.push(ibcConfig);
	}

	return ibcConfigs;
};

export const readAssetList = (
	chainName: string,
	testnet = false,
): AssetList => {
	if (!assetListCache.has(chainName)) {
		const assetList: AssetList = JSON.parse(
			readFileSync(
				`chain-registry/${testnet ? 'testnets/' : ''}${chainName}/assetlist.json`,
				'utf-8',
			),
		);
		assetListCache.set(chainName, assetList);
	}

	return assetListCache.get(chainName)!;
};

export const readChain = (chainName: string, testnet = false): Chain => {
	if (!chainCache.has(chainName)) {
		const chain: Chain = JSON.parse(
			readFileSync(
				`chain-registry/${testnet ? 'testnets/' : ''}${chainName}/chain.json`,
				'utf-8',
			),
		);

		chainCache.set(chainName, chain);
	}

	return chainCache.get(chainName)!;
};
