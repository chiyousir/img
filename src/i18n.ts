import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入翻译文件
import en from './locales/en';
import zh from './locales/zh';

// 支持的语言列表
export const languages = ['en', 'zh'];
export const defaultLanguage = 'en';

// 这个条件判断非常重要：如果在服务器端渲染，我们跳过初始化
if (typeof window !== 'undefined') {
  i18n
    // 自动检测用户语言
    .use(LanguageDetector)
    // 将 i18n 实例传递给 react-i18next
    .use(initReactI18next)
    // 初始化 i18next
    .init({
      // 资源包含翻译
      resources: {
        en: {
          translation: en
        },
        zh: {
          translation: zh
        }
      },
      // 如果没有翻译，使用键名
      keySeparator: '.',
      // 默认语言
      fallbackLng: defaultLanguage,
      // 默认命名空间
      defaultNS: 'translation',
      // 调试输出
      debug: false,
      // 检测语言
      detection: {
        // 检测顺序
        order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
        // 检测 Cookie 名
        lookupCookie: 'i18next',
        // 检测本地存储键
        lookupLocalStorage: 'i18nextLng',
        // 缓存用户语言
        caches: ['localStorage', 'cookie'],
      },
      // 插值配置
      interpolation: {
        // 不转义值，React 已经安全了
        escapeValue: false,
      }
    });
}

export default i18n; 