const path = require('path');
const supportedLngs = ['en', 'id'];
import themeConfig from 'theme.config';
export const ni18nConfig = {
    fallbackLng: [themeConfig.locale || 'id'],
    supportedLngs,
    ns: ['translation'],
    react: { useSuspense: false },
    backend: {
        loadPath: path.resolve(`/locales/{{lng}}.json`),
    },
};
