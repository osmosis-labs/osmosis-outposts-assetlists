# 📄 Outpost Asset Lists

## 🌐 Overview

Asset Lists are based on the concept of [Token Lists](https://tokenlists.org/)
from Ethereum, whose role is to allow discoverability of ERC20 tokens. Asset
Lists allow frontends to simply fetch metadata associated with Cosmos assets,
especially for the ones sent over IBC. The assetlist JSON Schema can be found
at `schemas/outposts.schema.json`.

The assetlist directly derives from the
[Osmosis assetlists](https://github.com/osmosis-labs/assetlists), it is created
using ts scripts and
[Cosmology chain-registry](https://github.com/cosmology-tech/chain-registry).

This script is configured with github actions to automatically generate json
configuration files at each `configs/outposts.json` edit.

## ⚙️ Prerequisite

The `configs/chain-id/assetlist.json` files herein are generated, which will be
triggered by additions to the `configs/outposts.json` file, fetching the
metadata from the
[Cosmos Chain Registry](https://github.com/cosmos/chain-registry).
As per the Omosis assetlists, one prerequisite to adding an asset here is
complete registration of the asset and its originating chain to the Cosmos
Chain Registry, so make sure that's done first.

## 📚 How to Add Assets

To add assets or asset lists, you need to edit the configuration file at
`configs/outposts.json`, containing the assets' base denom and chain name.

In particular, to add a new asset list, you need to add a new object to the
`outposts` array, which will contain:

- `chain_name` is the chain name for the chain asset list;
- `assets` is a list of assets, described as follows.

To add new assets to the asset list, you need to add a new object to the
`assets` array, which will contain:

- `chain_name` is the originating chain name for the asset;
- `base_denom` is the base denomination for the asset on the originating chain.

## 👾 Example

An example asset object in `outposts.json`:

```json
{
	"$schema": "../schemas/outposts.schema.json",
	"outposts": [
		{
			"chain_name": "juno",
			"assets": [
				{
					"chain_name": "cosmoshub",
					"base_denom": "uatom"
				},
				{
					"chain_name": "juno",
					"base_denom": "ujuno"
				}
			]
		}
	]
}
```

The generated assetlist JSON file associated the the above example:

```json
{
	"$schema": "../assetlist.schema.json",
	"chain_name": "juno",
	"assets": [
		{
			"description": "The native token of JUNO Chain",
			"denom_units": [
				{
					"denom": "ujuno",
					"exponent": 0
				},
				{
					"denom": "juno",
					"exponent": 6
				}
			],
			"base": "ujuno",
			"name": "Juno",
			"display": "juno",
			"symbol": "JUNO",
			"logo_URIs": {
				"png": "https://raw.githubusercontent.com/cosmos/chain-registry/master/juno/images/juno.png",
				"svg": "https://raw.githubusercontent.com/cosmos/chain-registry/master/juno/images/juno.svg"
			},
			"coingecko_id": "juno-network"
		},
		{
			"description": "The native staking and governance token of the Cosmos Hub.",
			"denom_units": [
				{
					"denom": "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
					"exponent": 0,
					"aliases": ["uatom"]
				},
				{
					"denom": "atom",
					"exponent": 6
				}
			],
			"base": "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
			"name": "Cosmos Hub Atom",
			"display": "atom",
			"symbol": "ATOM",
			"logo_URIs": {
				"png": "https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png",
				"svg": "https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.svg"
			},
			"coingecko_id": "cosmos",
			"traces": [
				{
					"type": "ibc",
					"counterparty": {
						"channel_id": "channel-207",
						"base_denom": "uatom",
						"chain_name": "cosmoshub"
					},
					"chain": {
						"channel_id": "channel-1"
					}
				}
			]
		}
	]
}
```

## 🔧 Installation

Node.js is required to run the project.

1. Clone the repository to your local machine:

```bash
git clone https://github.com/nabla-studio/osmosis-outposts-assetlists.git
git submodule init
git submodule update
```

2. Install the dependencies:

```bash
cd osmosis-outposts-assetlists
pnpm i
```

3. Run the generation script:

```bash
npm run generate
```

## 👥 Authors

👤 **Davide Segullo**

- Github: [@DavideSegullo](https://github.com/DavideSegullo)
- Twitter: [@davide_segullo](https://twitter.com/davide_segullo)

## 🎉 Contributing

We ❤️ contributions! If you'd like to contribute, please read our contributing
guidelines.

## 📜 License

This project is licensed under the Apache-2.0 License. See the LICENSE file for
more information.

## 🙋 Support

If you have any questions or comments about this project, please feel free to
contact us on discord.

## 🤝 Acknowledgements

We would like to thank [Osmosis Labs](https://github.com/osmosis-labs) for
their (active and passive) contributions to this project.

Copyright © 2023 [nabla](https://github.com/nabla-studio).
