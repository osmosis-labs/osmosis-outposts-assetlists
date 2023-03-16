import { AssetList } from '@chain-registry/types';
import { existsSync, writeFileSync, mkdirSync, readFileSync } from 'fs';

export const createAssetListDir = (chainId: string) => {
	if (!existsSync(`configs/${chainId}`)) {
		mkdirSync(`configs/${chainId}`, { recursive: true });
	}
};

export const writeAssetLists = (chainId: string, assetList: AssetList) => {
	writeFileSync(`configs/${chainId}/assetlists.json`, JSON.stringify(assetList));
};

export const readJson = <T = unknown>(
	path: string,
	encoding: BufferEncoding = 'utf-8',
): T => JSON.parse(readFileSync(path, encoding));
