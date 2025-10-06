import { nanoid } from 'nanoid';
import type {
  AlergoCodi,
  Comensal,
  Ingredient,
  Menu,
  PersistedState,
  Plat,
  Proveidor,
  ValidationIncident,
  ValidationSummary
} from './types';

function lastInforme(comensal: Comensal) {
  return [...comensal.informes].sort((a, b) => (a.dataISO < b.dataISO ? 1 : -1))[0];
}

function getPlatIngredients(plat: Plat, ingredients: Ingredient[]): Ingredient[] {
  const map = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient] as const));
  return plat.ingredients
    .map((item) => map.get(item.idIng))
    .filter((item): item is Ingredient => Boolean(item));
}

function hasLatestFitxa(proveidor: Proveidor, ingredient: Ingredient): boolean {
  const sorted = [...proveidor.fitxes].sort((a, b) => (a.dataISO < b.dataISO ? 1 : -1));
  const latest = sorted[0];
  return !latest || latest.dataISO <= ingredient.dataDeclaracio;
}

function incidentFor(
  comensal: Comensal,
  plat: Plat,
  ingredient: Ingredient,
  alergogen: AlergoCodi,
  severitat: ValidationIncident['severitat'],
  descripcio: string,
  proveidor: Proveidor
): ValidationIncident {
  const latestFitxa = [...proveidor.fitxes].sort((a, b) => (a.dataISO < b.dataISO ? 1 : -1))[0];
  return {
    id: nanoid(),
    comensalId: comensal.id,
    platId: plat.id,
    alergogen,
    severitat,
    descripcio,
    traçabilitat: {
      ingredientId: ingredient.id,
      proveidorId: proveidor.id,
      versioFitxa: latestFitxa?.versio
    }
  };
}

export function validateMenu(menu: Menu, data: PersistedState): ValidationSummary {
  const comensals = new Map(data.comensals.map((c) => [c.id, c] as const));
  const plats = new Map(data.plats.map((p) => [p.id, p] as const));
  const ingredients = data.ingredients;
  const proveidors = new Map(data.proveidors.map((p) => [p.id, p] as const));

  const incidents: ValidationIncident[] = [];

  for (const assignacio of menu.assignacions) {
    const comensal = comensals.get(assignacio.comensalId);
    const plat = plats.get(assignacio.platId);
    if (!comensal || !plat) continue;

    const informe = lastInforme(comensal);
    if (!informe) continue;

    const alergies = informe.alergies.map((a) => a.codi);
    const platIngredients = getPlatIngredients(plat, ingredients);

    for (const ingredient of platIngredients) {
      const proveidor = proveidors.get(ingredient.proveidorId);
      if (!proveidor) continue;

      for (const alergogen of alergies) {
        if (ingredient.alergens.includes(alergogen)) {
          incidents.push(
            incidentFor(
              comensal,
              plat,
              ingredient,
              alergogen,
              'ERROR',
              `L'ingredient ${ingredient.nom} conté ${alergogen}.`,
              proveidor
            )
          );
        } else if (ingredient.potContenir?.includes(alergogen)) {
          incidents.push(
            incidentFor(
              comensal,
              plat,
              ingredient,
              alergogen,
              'RISC',
              `L'ingredient ${ingredient.nom} pot contenir ${alergogen}.`,
              proveidor
            )
          );
        }
      }

      if (!hasLatestFitxa(proveidor, ingredient)) {
        incidents.push(
          incidentFor(
            comensal,
            plat,
            ingredient,
            'revisio-fitxa',
            'Revisar nova declaració del proveïdor.',
            proveidor
          )
        );
      }
    }
  }

  const cleanedIncidents = incidents.map((incident) =>
    incident.alergogen === 'revisio-fitxa'
      ? { ...incident, severitat: 'REVISIO', alergogen: 'fitxa-proveidor' }
      : incident
  );

  return {
    menuId: menu.id,
    incidents: cleanedIncidents,
    generatedAt: new Date().toISOString()
  };
}

export function summariseAllMenus(data: PersistedState): ValidationSummary[] {
  return data.menus.map((menu) => validateMenu(menu, data));
}
