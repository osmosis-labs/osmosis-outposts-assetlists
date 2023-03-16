import { existsSync, mkdirSync, readFileSync } from 'fs';

export const createAssetListDir = (chainId: string) => {
	if (!existsSync(`configs/${chainId}`)) {
		mkdirSync(`configs/${chainId}`, { recursive: true });
	}
};

export const readJson = <T = unknown>(
	path: string,
	encoding: BufferEncoding = 'utf-8',
): T => JSON.parse(readFileSync(path, encoding));
