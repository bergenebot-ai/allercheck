import { describe, expect, it } from 'vitest';
import { validateMenu } from './validation';
import { seedState } from '../data/seeds';

describe('motor de validació d\'al·lèrgens', () => {
  it('marca error quan hi ha un al·lergogen prohibit', () => {
    const summary = validateMenu(seedState.menus[1], seedState);
    const error = summary.incidents.find((incident) => incident.severitat === 'ERROR');
    expect(error?.alergogen).toBe('gluten');
  });

  it('marca risc per traces declarades', () => {
    const summary = validateMenu(seedState.menus[0], seedState);
    const risc = summary.incidents.find((incident) => incident.severitat === 'RISC');
    expect(risc?.alergogen).toBe('fruits-secs');
  });

  it('marca revisió quan hi ha canvi de fitxa de proveïdor', () => {
    const customState: typeof seedState = {
      ...seedState,
      ingredients: seedState.ingredients.map((ingredient) =>
        ingredient.id === 'ing-crema'
          ? { ...ingredient, dataDeclaracio: '2023-10-01' }
          : ingredient
      )
    };
    const summary = validateMenu(customState.menus[1], customState);
    const revisio = summary.incidents.find((incident) => incident.severitat === 'REVISIO');
    expect(revisio).toBeTruthy();
  });
});
