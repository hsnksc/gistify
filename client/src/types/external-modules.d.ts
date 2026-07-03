declare module "dotenv";

declare module "i18next" {
  export interface CustomTypeOptions {
    allowObjectInHTMLChildren: false;
    returnNull: false;
  }

  export interface I18nInitOptions {
    defaultNS?: string;
    fallbackLng?: string;
    interpolation?: {
      escapeValue?: boolean;
    };
    parseMissingKeyHandler?: (key: string) => string;
    resources?: Record<string, Record<string, Record<string, string>>>;
    returnEmptyString?: boolean;
    supportedLngs?: string[];
  }

  export interface I18nInstance {
    resolvedLanguage?: string;
    changeLanguage(language: string): Promise<void>;
    init(options: I18nInitOptions): Promise<void>;
    t(key: string, options?: Record<string, unknown>): string;
    use(plugin: unknown): I18nInstance;
  }

  export interface I18nStatic {
    createInstance(): I18nInstance;
  }

  const i18next: I18nStatic;
  export default i18next;
}
