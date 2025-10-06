import { useMemo } from 'react';
import { useDataStore } from '../../store/dataStore';
import { Table } from '../../components/Table';

export function PlatsPage() {
  const { data } = useDataStore();

  const rows = useMemo(() => {
    const ingredientsById = Object.fromEntries(data.ingredients.map((ingredient) => [ingredient.id, ingredient] as const));
    return data.plats.map((plat) => {
      const ingredients = plat.ingredients
        .map((item) => ingredientsById[item.idIng])
        .filter(Boolean)
        .map((ingredient) => `${ingredient!.nom} (${ingredient!.alergens.join(', ') || 'cap'})`)
        .join(', ');
      const alergens = plat.alergensDerivats?.join(', ') ?? 'cap';
      const cost = data.toggles.escandall && plat.cost ? `${plat.cost.toFixed(2)} €` : '-';
      return [plat.nom, plat.versio, ingredients, alergens, cost];
    });
  }, [data.ingredients, data.plats, data.toggles.escandall]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Receptari i traçabilitat d\'ingredients segons la darrera declaració de proveïdor.
      </p>
      <Table headers={['Plat', 'Versió', 'Ingredients', 'Al·lèrgens', 'Cost']} rows={rows} />
    </div>
  );
}
