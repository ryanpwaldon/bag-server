import { LeanDocument } from 'mongoose'
import { CartSettings } from 'src/modules/cart/schema/cart-settings.schema'

// prettier-ignore
export default (startScriptUrl: string, cartSettings: LeanDocument<CartSettings>) => {
  return `<script src="${startScriptUrl}" defer></script><script>window.bagCartSettings = ${JSON.stringify(cartSettings)}</script>`
}
