interface CountryConfig {
  code: string;
  name: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export const COUNTRY_CONFIGS: { [key: string]: CountryConfig } = {
  '08': {
    code: '08',
    name: 'Costa Rica',
    color: 'VERDE',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-800'
  },
  '85': {
    code: '85',
    name: 'República Dominicana',
    color: 'GRIS',
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-800'
  },
  '92': {
    code: '92',
    name: 'Guatemala',
    color: 'CAFÉ',
    bgColor: 'bg-amber-900',
    textColor: 'text-amber-50'
  },
  '81': {
    code: '81',
    name: 'El Salvador',
    color: 'ROJO',
    bgColor: 'bg-rose-100',
    textColor: 'text-rose-800'
  },
  '80': {
    code: '80',
    name: 'Nicaragua',
    color: 'AMARILLO',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  },
  '43': {
    code: '43',
    name: 'Honduras',
    color: 'AZUL',
    bgColor: 'bg-sky-100',
    textColor: 'text-sky-800'
  },
  '41': {
    code: '41',
    name: 'Honduras',
    color: 'AZUL',
    bgColor: 'bg-sky-100',
    textColor: 'text-sky-800'
  }
};

export const getCountryFromNumber = (number: string): CountryConfig | null => {
  const prefix = number.substring(0, 2);
  return COUNTRY_CONFIGS[prefix] || null;
}; 