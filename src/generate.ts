import {
	readAssetList,
	readChain,
	assetListCache,
	chainCache,
} from './cache.js';
import { OutpostConfig } from './types.js';
import Ajv, { Schema } from 'ajv';
import { getAssetLists } from '@chain-registry/utils';
import { ibc } from 'chain-registry';
import { createAssetListDir, readJson } from './utils.js';
import { AssetList } from '@chain-registry/types';

const ajv = new Ajv.default();

const outpostsConfigSchema = readJson<Schema>('schemas/outposts.schema.json');

const outpostsConfig = readJson<OutpostConfig>('configs/outposts.json');

/**
 * Check if the outpost config is valid by using his schema definition
 */
if (!ajv.validate(outpostsConfigSchema, outpostsConfig)) {
	throw new Error('Invalid outposts config, check outposts.schema.json');
}

/**
 * Iterate through the outpost config and create the asset list configs
 */
outpostsConfig.outposts.forEach(outpost => {
	const chain = readChain(outpost.chain_name);
	const filteredAssetLists: AssetList[] = [];

	outpost.assets.forEach(asset => {
		const assetList = readAssetList(asset.chain_name);

		filteredAssetLists.push(assetList);
	});

	console.log(
		getAssetLists(chain.chain_name, ibc, filteredAssetLists)[0].assets[0]
			.denom_units,
	);

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
