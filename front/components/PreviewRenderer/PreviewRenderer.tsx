'use client';

import { useTranslation } from 'react-i18next';

import { PrintType, PreviewProps } from '../../types';
import { PdfPreview, ImagePreview, MugPreview, TShirtPreview } from '../PreviewRenderer';

interface PreviewRendererProps extends PreviewProps {
  printType: PrintType | string;
}

const PREVIEW_MAP: Record<PrintType | string, React.FC<PreviewProps>> = {
  'application/pdf': PdfPreview,
  'image/png': ImagePreview,
  'image/jpeg': ImagePreview,
  mug: MugPreview,
  tshirt: TShirtPreview,
};

export default function PreviewRenderer({ printType, fileUrl }: PreviewRendererProps) {
  const { t } = useTranslation();
  const Component = PREVIEW_MAP[printType];

  if (!Component) {
    return <div className="text-sm text-gray-500">{t('common.previewNotAvailable')}</div>;
  }

  return <Component fileUrl={fileUrl} />;
}
