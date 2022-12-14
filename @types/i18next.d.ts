/**
 * If you want to enable locale keys typechecking and enhance IDE experience.
 *
 * Requires `resolveJsonModule:true` in your tsconfig.json.
 *
 * @link https://www.i18next.com/overview/typescript
 */
import 'i18next'

import type common from '../public/locales/en/common.json'
import type home from '../public/locales/en/home.json'
import type landing from '../public/locales/en/landing.json'
 
interface I18nNamespaces {
  common: typeof common
  home: typeof home
  landing: typeof landing
}
 
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: I18nNamespaces
  }
}
 