# Certificació de Menús Lliures d’Al·lèrgens

Aplicació web per a la certificació de menús sense al·lèrgens en entorns de restauració col·lectiva. El projecte prioritza la traçabilitat, la doble validació DN/TA i l’auditoria completa, amb dades en local (IndexedDB o LocalStorage) i exportacions en formats CSV i HTML imprimible.

## Característiques principals

- **SPA amb React + TypeScript + Vite** i estil amb Tailwind CSS.
- **Gestió d’estat amb Zustand** per datasets, validacions i auditories.
- **Motor de validació** que detecta errors, riscos per traces i revisions pendents per canvis de proveïdor.
- **Doble validació** amb segells DN (1/2) i TA (2/2) fins assolir estat “Certificat”.
- **Exportacions**: CSV de validacions i d’auditoria, informe HTML imprimible (compatible amb “Desa com a PDF”).
- **Seeds de demostració** amb comensals, menús, plats, ingredients i proveïdors.
- **Auditoria** amb registres abans/després, usuari, rol i hash curt del dataset.
- **Mode demo** amb anonimització opcional de comensals i toggles de mòduls addicionals.
- **Testing amb Vitest + Testing Library**, **ESLint + Prettier**, **Husky (pre-commit)** i workflow de GitHub Actions per desplegar a GitHub Pages.

## Requisits

- Node.js 20 o superior.
- Navegador modern per accedir a l’aplicació.

## Instal·lació i execució

A la primera instal·lació, afegiu les dependències del workspace:

```bash
npm install
```

Executa l’entorn de desenvolupament (Vite):

```bash
npm run dev
```

Construeix la versió de producció:

```bash
npm run build
```

Previsualitza la compilació:

```bash
npm run preview
```

Executa el linter i els tests:

```bash
npm run lint
npm run test
```

### Scripts del frontend (`apps/web`)

Els scripts principals també estan disponibles des del paquet intern:

- `npm -w apps/web run dev`
- `npm -w apps/web run build`
- `npm -w apps/web run preview`
- `npm -w apps/web run lint`
- `npm -w apps/web run test`
- `npm -w apps/web run deploy`

### Husky

El repositori inclou Husky. Després d’instal·lar les dependències executeu `npm run prepare` per crear `.husky/` i configurar el hook pre-commit (executa `npm run lint && npm run test`).

## Emmagatzematge local

Per defecte s’utilitza `localStorage`. Podeu canviar a IndexedDB (Dexie) definint l’entorn Vite:

```bash
VITE_STORAGE_BACKEND=dexie npm run dev
```

Les dades persistides inclouen menús, comensals, proveïdors, auditories i estats de validació. El mòdul de configuració permet regenerar les dades de prova o netejar l’emmagatzematge.

## Exportacions

- **CSV**: des de la vista de menús (validacions) i des de la vista d’auditoria.
- **Informe HTML/PDF**: botó “Informe imprimible” a cada menú (es pot imprimir o desar com a PDF des del navegador).
- **Impressió global**: botó “Imprimeix / Desa PDF” a la capçalera per generar una vista imprimible general.

## Seeds de demostració

El botó “Genera dades de prova” reestableix el dataset inicial amb:

- 3 comensals: celiaquia, al·lèrgia severa a fruits secs i intolerància a la lactosa.
- 5 plats, incloent receptes conflictives i amb traces.
- 2 proveïdors amb canvi de versió de fitxa.
- Flux complet de validació, incidències i segells DN/TA.

## Testing

Els tests de `Vitest` verifiquen el motor de validació d’al·lèrgens (errors, riscos i revisions). Executeu `npm run test` per validar-los.

## Desplegament a GitHub Pages

El workflow `.github/workflows/pages.yml` construeix l’app quan es fa push a `main` i desplega a la branca `gh-pages`. Per publicar manualment:

```bash
npm run deploy
```

Ajusteu `base` a `vite.config.ts` si el repositori té un nom diferent.

## Llicència

MIT — © 2024 Facturit-Aibar (tecnologia) + DN/TA (20 anys d’experiència).
