import { format, parseISO } from 'date-fns';
import { localeMeta, type Language } from '../translations';

export const formatDate = (iso: string, lang: Language = 'ru', fmt: string = 'dd MMM yyyy'): string =>
  format(parseISO(iso), fmt, { locale: localeMeta[lang].dateFns });

export const formatTime = (iso: string): string =>
  format(parseISO(iso), 'HH:mm');

export const formatDateTime = (iso: string, lang: Language = 'ru'): string =>
  format(parseISO(iso), 'dd MMM yyyy, HH:mm', { locale: localeMeta[lang].dateFns });
