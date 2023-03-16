import { Chain, AssetList } from '@chain-registry/types';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { OutpostConfig } from './types';
import Ajv from 'ajv';
import { getAssetLists } from '@chain-registry/utils';
import { ibc } from 'chain-registry';

const ajv = new Ajv();

const outpostsConfigSchema = JSON.parse(
	readFileSync('schemas/outposts.schema.json', 'utf-8'),
);

const outpostsConfig: OutpostConfig = JSON.parse(
	readFileSync('configs/outposts.json', 'utf-8'),
);

/**
 * Check if the outpost config is valid by using his schema definition
 */
if (!ajv.validate(outpostsConfigSchema, outpostsConfig)) {
	throw new Error('Invalid outposts config, check outposts.schema.json');
}

const assetListCache = new Map<string, AssetList>();
const chainCache = new Map<string, Chain>();

function readAssetList(chainName: string): AssetList {
	if (!assetListCache.has(chainName)) {
		const assetList: AssetList = JSON.parse(
			readFileSync(`chain-registry/${chainName}/assetlist.json`, 'utf-8'),
		);
		assetListCache.set(chainName, assetList);
	}

	return assetListCache.get(chainName);
}

function readChain(chainName: string): Chain {
	if (!chainCache.has(chainName)) {
		const chain: Chain = JSON.parse(
			readFileSync(`chain-registry/${chainName}/chain.json`, 'utf-8'),
		);

		chainCache.set(chainName, chain);
	}

	return chainCache.get(chainName);
}

function createAssetListDir(chainId: string) {
	if (!existsSync(`configs/${chainId}`)) {
		mkdirSync(`configs/${chainId}`, { recursive: true });
	}
}

/**
 * Iterate through the outpost config and create the asset list configs
 */
outpostsConfig.outposts.forEach(outpost => {
	const chain = readChain(outpost.chain_name);

	outpost.assets.forEach(asset => {
		readAssetList(asset.chain_name);
	});

	readAssetList(outpost.chain_name);

	/* console.log(
		getAssetLists(chain.chain_name, ibc, [assetListAtom])[0].assets[0]
			.denom_units,
	); */

	/**
	 * If all the previous step are done we can create the outpost assetlist dir
	 */
	createAssetListDir(chain.chain_id);
});

/**
 * Reset cache
 */
assetListCache.clear();
chainCache.clear();
