import { config } from '@onflow/fcl'

config({
  'app.detail.title': 'Social Contest DApp',
  'app.detail.icon': 'https://placekitten.com/g/200/200',
  'accessNode.api': 'https://rest-testnet.onflow.org',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
})

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp