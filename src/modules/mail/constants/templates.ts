type MailEnvironment = 'staging' | 'production'
type Template = Record<MailEnvironment, number>
export type Templates = Record<string, Template>

const templates: Templates = {
  welcome: {
    staging: 21285736,
    production: 123
  }
}

export const getTemplateByName = (name: string): number => {
  const env = process.env.APP_ENV === 'production' ? 'production' : 'staging'
  return templates[name][env]
}
