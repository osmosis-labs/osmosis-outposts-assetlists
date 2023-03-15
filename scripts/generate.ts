import {
	ChainRegistryFetcher,
	ChainRegistryFetcherOptions,
} from '@chain-registry/client';
import { readFileSync } from 'fs';
import { OutpostConfig } from './types';
import Ajv from 'ajv';

const ajv = new Ajv();

const outpostsConfigSchema = JSON.parse(
	readFileSync('schemas/outposts.schema.json', 'utf-8'),
);

const outpostsConfig: OutpostConfig = JSON.parse(
	readFileSync('configs/outposts.json', 'utf-8'),
);

console.log(outpostsConfig);

console.log(ajv.validate(outpostsConfigSchema, outpostsConfig));

/* const junoAssetList = readFileSync(
	'chain-registry/juno/assetlist.json',
	'utf-8',
);

const registry = new ChainRegistryFetcher(); */
