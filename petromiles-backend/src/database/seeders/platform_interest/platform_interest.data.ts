/* eslint-disable @typescript-eslint/camelcase */

// Para plan GOLD, los puntos extra se denotan por el campo amount
// 2500 puntos = 5$, 5$ = 500 cents
export const PLATAFORM_INTERESTS = [
  {
    idPlatformInterest: 1,
    name: 'PREMIUM',
    percentage: 20,
  },
  {
    idPlatformInterest: 2,
    name: 'GOLD_EXTRA',
    percentage: 20,
    amount: 5000,
  },
  {
    idPlatformInterest: 3,
    name: 'VERIFICATION',
    amount: 250,
  },

  {
    idPlatformInterest: 4,
    name: 'BUY',
    percentage: 1.5,
  },

  {
    idPlatformInterest: 5,
    name: 'WITHDRAWAL',
    percentage: 5,
  },
];
