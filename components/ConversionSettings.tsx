'use client';

import { useTranslation } from 'react-i18next';
import { RadioGroup } from '@headlessui/react';

type Quality = 'low' | 'medium' | 'high';

type ConversionSettingsProps = {
  quality: Quality;
  onQualityChange: (quality: Quality) => void;
  onConvert: () => void;
  converting: boolean;
  pdfUrl: string | null;
};

export function ConversionSettings({
  quality,
  onQualityChange,
  onConvert,
  converting,
  pdfUrl,
}: ConversionSettingsProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="max-w-md">
        <RadioGroup value={quality} onChange={onQualityChange}>
          <RadioGroup.Label className="text-sm font-medium text-gray-700 mb-3 block">
            {t('conversion.quality.label')}
          </RadioGroup.Label>
          <div className="flex gap-4">
            {(['low', 'medium', 'high'] as const).map((q) => (
              <RadioGroup.Option
                key={q}
                value={q}
                className={({ active, checked }) =>
                  `${
                    active
                      ? 'ring-2 ring-blue-500 ring-offset-2'
                      : ''
                  }
                  ${
                    checked
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }
                  relative flex cursor-pointer rounded-lg px-5 py-3 border focus:outline-none transition-colors flex-1`
                }
              >
                {({ checked }) => (
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <RadioGroup.Label
                          as="p"
                          className={`font-medium ${
                            checked ? 'text-white' : 'text-gray-700'
                          }`}
                        >
                          {t(`conversion.quality.${q}`)}
                        </RadioGroup.Label>
                      </div>
                    </div>
                    {checked && (
                      <div className="shrink-0 text-white">
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                          <circle cx={12} cy={12} r={12} fill="currentColor" fillOpacity="0.2" />
                          <path
                            d="M7 13l3 3 7-7"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <button
          onClick={onConvert}
          disabled={converting}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {converting ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {t('conversion.converting')}
            </span>
          ) : (
            t('conversion.convert')
          )}
        </button>

        {pdfUrl && (
          <a
            href={pdfUrl}
            download="converted.pdf"
            className="px-5 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
            {t('conversion.download')}
          </a>
        )}
      </div>
    </div>
  );
} 