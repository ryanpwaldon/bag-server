export default () => ({
  SERVER_URL: `https://${process.env.SERVER_HOST}`,
  PLUGIN_URL: `https://${process.env.PLUGIN_HOST}`,
  APP_LIQUID_FILENAME: 'bag-app',
  get BLANK_SCRIPT_URL() {
    return `${this.PLUGIN_URL}/script.js`
  },
  get START_SCRIPT_URL() {
    return `${this.PLUGIN_URL}/start.js`
  },
  get THEME_LIQUID_KEY() {
    return `layout/theme.liquid`
  },
  get THEME_LIQUID_TRIGGER() {
    return `\n  {% if content_for_header contains '${process.env.PLUGIN_HOST}' %}{% render '${this.APP_LIQUID_FILENAME}' %}{% endif %}\n\n`
  },
  get APP_LIQUID_KEY() {
    return `snippets/${this.APP_LIQUID_FILENAME}.liquid`
  },
  get APP_LIQUID_VALUE() {
    return `<script src="${this.START_SCRIPT_URL}" defer></script>`
  }
})
