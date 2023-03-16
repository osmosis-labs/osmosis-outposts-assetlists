import { AssetList, Chain } from '@chain-registry/types';
import { readFileSync } from 'fs';

export const assetListCache = new Map<string, AssetList>();
export const chainCache = new Map<string, Chain>();

export const readAssetList = (chainName: string): AssetList => {
	if (!assetListCache.has(chainName)) {
		const assetList: AssetList = JSON.parse(
			readFileSync(`chain-registry/${chainName}/assetlist.json`, 'utf-8'),
		);
		assetListCache.set(chainName, assetList);
	}

	return assetListCache.get(chainName);
};

export const readChain = (chainName: string): Chain => {
	if (!chainCache.has(chainName)) {
		const chain: Chain = JSON.parse(
			readFileSync(`chain-registry/${chainName}/chain.json`, 'utf-8'),
		);

		chainCache.set(chainName, chain);
	}

	return chainCache.get(chainName);
};
