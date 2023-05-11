# EthosConnect example using [Next.js](https://nextjs.org/)

This is a [Next.js](https://nextjs.org/) app written with [TypeScript](https://www.typescriptlang.org/) implementing [EthosConnect](https://ethoswallet.xyz/dev), the easiest way to connect with any wallet on Sui.

For a start to finish guide, check out the [EthosConnect docs](https://docs.ethoswallet.xyz).

---

## Important files in this repository

Here are the places in the code that implement EthosConnect:

### `_app.tsx`

The `EthosConnectProvider` wraps the whole app:

```js
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <EthosConnectProvider>
      <Component {...pageProps} />
    </EthosConnectProvider>
  );
}
```

### `index.tsx`

This is the rest of the app. It's a simple app for signing in with a wallet, funding the wallet with the TestNet faucet, and minting an NFT.

It uses the `EthosConnect` hooks:

```js
  const { status, wallet } = ethos.useWallet();
```

The `SignInButton` component:

```js
<SignInButton />
```

...and more!


### The Move Contract

You can publish the move contract using the following command:

`sui client publish --gas-budget 10000`

### Running The Frunt End

`yarn dev`

And then open a browser window to the specified port (e.g. http://localhost:3000)

### Deploying the front end

Simply deploy to the main branch and the live site should update.