import {
	readAssetList,
	readChain,
	assetListCache,
	chainCache,
	ibcConfigs,
	readIbcConfig,
} from './cache.js';
import { getAssetLists } from '@chain-registry/utils';
import { ibc } from 'chain-registry';
import {
	createAssetListDir,
	writeAssetLists,
	validateOutpostConfig,
} from './utils.js';
import { Asset, AssetList } from '@chain-registry/types';

const outpostsConfig = validateOutpostConfig();

/**
 * Iterate through the outpost config and create the asset list configs
 */
outpostsConfig.outposts.forEach(outpost => {
	const chain = readChain(outpost.chain_name, outpost.testnet);
	const filteredAssetLists: AssetList[] = [];

	const outpostAssetLists = readAssetList(outpost.chain_name, outpost.testnet);

	const outpostBaseDenoms = outpost.assets
		.filter(asset => asset.chain_name === outpostAssetLists.chain_name)
		.map(asset => asset.base_denom);

	const outpostNativeAssets = outpostAssetLists.assets.filter(asset =>
		outpostBaseDenoms.includes(asset.base),
	);

	const outpostAssetChains = [
		...new Set(outpost.assets.map(asset => asset.chain_name)),
	];

	/**
	 * We create a filtered asset list for each outpost
	 * so we can find all the IBC assets and Native assets
	 */
	outpostAssetChains.forEach(chainName => {
		const assetList = readAssetList(chainName, outpost.testnet);
		const baseDenoms = outpost.assets
			.filter(asset => asset.chain_name === chainName)
			.map(asset => asset.base_denom);

		const assets = assetList.assets.filter(asset =>
			baseDenoms.includes(asset.base),
		);

		filteredAssetLists.push({
			...assetList,
			assets,
		});

		if (outpost.testnet && outpost.chain_name !== chainName) {
			readIbcConfig(outpost.chain_name, chainName, outpost.testnet);
		}
	});

	const outpostIBCAssetList: AssetList[] = getAssetLists(
		chain.chain_name,
		ibcConfigs,
		filteredAssetLists,
	);

	const outpostIBCAssets: Asset[] = outpostIBCAssetList.reduce(
		(acc, asset) => [...acc, ...asset.assets],
		[],
	);

	const assetLists: AssetList = {
		...outpostAssetLists,
		assets: [...outpostNativeAssets, ...outpostIBCAssets],
	};

	/**
	 * If all the previous step are done we can create the outpost assetlist dir
	 */
	createAssetListDir(chain.chain_id);

	/**
	 * Write outpost config to file dir
	 */
	writeAssetLists(chain.chain_id, assetLists);
});

/**
 * Reset cache
 */
assetListCache.clear();
chainCache.clear();
