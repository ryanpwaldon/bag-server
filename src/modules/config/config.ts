export default () => ({
  get BLANK_SCRIPT_URL() {
    return `${process.env.PLUGIN_URL}/script.js`
  },
  get START_SCRIPT_URL() {
    return `${process.env.PLUGIN_URL}/start.js`
  },
  get APP_FILE_NAME() {
    return 'bag-app'
  },
  get APP_FILE_PATH() {
    return `snippets/${this.APP_FILE_NAME}.liquid`
  },
  get THEME_FILE_PATH() {
    return `layout/theme.liquid`
  },
  get THEME_FILE_SNIPPET() {
    return `\n\n  <!-- Bag app: will not be loaded if you uninstall the app, or if the cart is disabled. -->\n  {% if content_for_header contains '${process.env.PLUGIN_HOST}' %}{% render '${this.APP_FILE_NAME}' %}{% endif %}\n`
  }
})
