# 🏗 ProofMint - Decentralized Credentialing Platform

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Ethereum blockchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.

## About ProofMint

ProofMint is a decentralized credentialing platform that allows educational institutions and organizations to issue soulbound NFT certificates for achievements, credentials, and identity verification. 

Key features:
- **Soulbound NFTs**: Non-transferable certificates that stay with the recipient
- **Issuer Management**: Organizations can register as credential issuers
- **Certificate Types**: Flexible template system for different credential types
- **On-chain Verification**: Instant verification of credentials without revealing personal information
- **Revocation Support**: Issuers can revoke credentials when necessary
- **Metadata Storage**: IPFS integration for rich certificate metadata

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v20.18.3)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with ProofMint, follow the steps below:

1. Install dependencies if it was skipped in CLI:

```
cd proofmint-mvp
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `packages/hardhat/hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys the ProofMint smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the various pages. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`

- Edit your smart contracts in `packages/hardhat/contracts`
- Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
- Edit your deployment scripts in `packages/hardhat/deploy`

## Hardhat Integration

The Hardhat integration is now fully functional with:
- Updated contract for OpenZeppelin v5.0 compatibility
- Comprehensive test suite with 21 passing tests
- Deployment scripts and verification tools
- Proper role management and access control

See [HARDHAT_INTEGRATION.md](HARDHAT_INTEGRATION.md) for detailed information.

## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to ProofMint

We welcome contributions to ProofMint!

Please see [CONTRIBUTING.MD](CONTRIBUTING.md) for more information and guidelines for contributing.