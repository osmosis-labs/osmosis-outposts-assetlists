export interface OutpostAsset {
	chain_name: string;
	base_denom: string;
}

export interface Outpost {
	chain_name: string;
	assets: OutpostAsset[];
	testnet?: boolean;
}

export interface OutpostConfig {
	outposts: Outpost[];
}
