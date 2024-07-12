import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// 根据需要导入你的翻译文件
import enCommonTranslations from '../../../public/locales/en/common.json';
import enNavTranslations from '../../../public/locales/en/nav.json';
import zhCommonTranslations from '../../../public/locales/zh-TW/common.json';
import zhNavTranslations from '../../../public/locales/zh-TW/nav.json';

i18n
	.use(initReactI18next)
	.init({
		resources: {
			"en": {
				translation: {
					common: enCommonTranslations,
					nav: enNavTranslations
				},
			},
			"zh-TW": {
				translation: {
					common: zhCommonTranslations,
					nav: zhNavTranslations
				},
			},
		},
		fallbackLng: "en",
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;