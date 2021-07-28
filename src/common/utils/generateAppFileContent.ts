import { CartSettings } from 'src/common/types/cart-settings'

// prettier-ignore
export default (startScriptUrl: string, cartSettings: CartSettings) => {
  return `<script src="${startScriptUrl}" defer></script><script>window.bagCartSettings = ${JSON.stringify(cartSettings)}</script>`
}
