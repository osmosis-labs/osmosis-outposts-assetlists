import { OutpostConfig } from './types';
import Ajv from 'ajv';
import { getAssetLists } from '@chain-registry/utils';
import { ibc } from 'chain-registry';
import { readAssetList, readChain, assetListCache, chainCache } from './cache';
import { createAssetListDir, readJson } from './utils';

const ajv = new Ajv();

const outpostsConfigSchema = readJson('schemas/outposts.schema.json');

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
