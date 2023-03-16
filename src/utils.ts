import { AssetList } from '@chain-registry/types';
import { existsSync, writeFileSync, mkdirSync, readFileSync } from 'fs';
import Ajv, { Schema } from 'ajv';
import { OutpostConfig } from './types.js';

export const validateOutpostConfig = (): OutpostConfig => {
	const ajv = new Ajv.default();

	const outpostsConfigSchema = readJson<Schema>('schemas/outposts.schema.json');

	const outpostsConfig = readJson<OutpostConfig>('configs/outposts.json');

	/**
	 * Check if the outpost config is valid by using his schema definition
	 */
	if (!ajv.validate(outpostsConfigSchema, outpostsConfig)) {
		throw new Error('Invalid outposts config, check outposts.schema.json');
	}

	return outpostsConfig;
};

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
