import type { PersistedState } from '../lib/types';

export const seedState: PersistedState = {
  comensals: [
    {
      id: 'com-anna',
      nom: 'Anna Vidal',
      dieta: 'Sense gluten',
      informes: [
        {
          id: 'inf-anna-2024',
          dataISO: '2024-04-01',
          notes: 'Celíaca. Control estricte.',
          alergies: [{ codi: 'gluten', severitat: 'alta' }]
        }
      ]
    },
    {
      id: 'com-marc',
      nom: 'Marc Pérez',
      dieta: 'Sense fruits secs',
      informes: [
        {
          id: 'inf-marc-2024',
          dataISO: '2024-03-20',
          alergies: [{ codi: 'fruits-secs', severitat: 'alta' }]
        }
      ]
    },
    {
      id: 'com-laura',
      nom: 'Laura Solé',
      dieta: 'Sense lactosa',
      informes: [
        {
          id: 'inf-laura-2024',
          dataISO: '2024-02-18',
          alergies: [{ codi: 'lactosa', severitat: 'moderada' }]
        }
      ]
    }
  ],
  proveidors: [
    {
      id: 'prov-aliseg',
      nom: 'Aliments Segurs SCCL',
      fitxes: [
        {
          versio: '2024.04',
          dataISO: '2024-04-15',
          declaracioAlergens: [
            { codi: 'gluten', present: false },
            { codi: 'fruits-secs', present: false },
            { codi: 'lactosa', present: false }
          ]
        },
        {
          versio: '2023.12',
          dataISO: '2023-12-01',
          declaracioAlergens: [
            { codi: 'gluten', present: false },
            { codi: 'fruits-secs', present: false },
            { codi: 'lactosa', present: true, potContenir: true }
          ]
        }
      ]
    },
    {
      id: 'prov-dolc',
      nom: 'Dolça Tradició SL',
      fitxes: [
        {
          versio: '2024.02',
          dataISO: '2024-02-10',
          declaracioAlergens: [
            { codi: 'gluten', present: true },
            { codi: 'fruits-secs', present: true, potContenir: true },
            { codi: 'lactosa', present: false }
          ]
        }
      ]
    }
  ],
  ingredients: [
    {
      id: 'ing-pasta',
      nom: 'Pasta de blat',
      proveidorId: 'prov-dolc',
      alergens: ['gluten'],
      potContenir: ['fruits-secs'],
      dataDeclaracio: '2024-02-10'
    },
    {
      id: 'ing-crema',
      nom: 'Crema de llet',
      proveidorId: 'prov-aliseg',
      alergens: ['lactosa'],
      dataDeclaracio: '2023-12-01'
    },
    {
      id: 'ing-galetes',
      nom: 'Galetes cruixents',
      proveidorId: 'prov-dolc',
      alergens: ['gluten'],
      potContenir: ['fruits-secs'],
      dataDeclaracio: '2024-02-10'
    },
    {
      id: 'ing-brou',
      nom: 'Brou vegetal',
      proveidorId: 'prov-aliseg',
      alergens: [],
      dataDeclaracio: '2024-04-15'
    },
    {
      id: 'ing-fruita',
      nom: 'Fruita de temporada',
      proveidorId: 'prov-aliseg',
      alergens: [],
      dataDeclaracio: '2024-04-15'
    }
  ],
  plats: [
    {
      id: 'plat-pasta-bolonyesa',
      nom: 'Pasta a la bolonyesa',
      ingredients: [
        { idIng: 'ing-pasta', quantitat: 120, unitat: 'g' },
        { idIng: 'ing-brou', quantitat: 50, unitat: 'ml' }
      ],
      alergensDerivats: ['gluten'],
      versio: '2024.01',
      cost: 3.2
    },
    {
      id: 'plat-crema-lactosa',
      nom: 'Crema suau de llet',
      ingredients: [
        { idIng: 'ing-crema', quantitat: 150, unitat: 'ml' },
        { idIng: 'ing-brou', quantitat: 50, unitat: 'ml' }
      ],
      alergensDerivats: ['lactosa'],
      versio: '2024.01',
      cost: 2.7
    },
    {
      id: 'plat-galetes',
      nom: 'Galetes cruixents',
      ingredients: [{ idIng: 'ing-galetes', quantitat: 60, unitat: 'g' }],
      alergensDerivats: ['gluten'],
      versio: '2024.01',
      cost: 1.2
    },
    {
      id: 'plat-amanida',
      nom: 'Amanida fresca',
      ingredients: [{ idIng: 'ing-fruita', quantitat: 120, unitat: 'g' }],
      versio: '2024.01',
      cost: 1.8
    },
    {
      id: 'plat-brou',
      nom: 'Brou vegetal',
      ingredients: [{ idIng: 'ing-brou', quantitat: 200, unitat: 'ml' }],
      versio: '2024.01',
      cost: 1.5
    }
  ],
  menus: [
    {
      id: 'menu-dia1',
      dataISO: '2024-05-10',
      torn: 'dinar',
      plats: ['plat-pasta-bolonyesa', 'plat-amanida'],
      assignacions: [
        { comensalId: 'com-anna', platId: 'plat-amanida' },
        { comensalId: 'com-marc', platId: 'plat-pasta-bolonyesa' },
        { comensalId: 'com-laura', platId: 'plat-amanida' }
      ],
      estat: 'BORRADOR',
      segells: []
    },
    {
      id: 'menu-dia2',
      dataISO: '2024-05-11',
      torn: 'dinar',
      plats: ['plat-crema-lactosa', 'plat-galetes'],
      assignacions: [
        { comensalId: 'com-anna', platId: 'plat-galetes' },
        { comensalId: 'com-marc', platId: 'plat-galetes' },
        { comensalId: 'com-laura', platId: 'plat-crema-lactosa' }
      ],
      estat: 'BORRADOR',
      segells: []
    }
  ],
  canvis: [
    {
      id: 'canvi-001',
      tipus: 'FITXA_PROVEIDOR',
      entitatId: 'prov-aliseg',
      descripcio: 'Nova declaració 2024.04 sense lactosa',
      dataISO: '2024-04-15'
    },
    {
      id: 'canvi-002',
      tipus: 'RECEPTARI',
      entitatId: 'plat-pasta-bolonyesa',
      descripcio: 'Ajust quantitats per ració infantil',
      dataISO: '2024-03-05'
    }
  ],
  auditories: [],
  toggles: {
    nutricional: false,
    escandall: false,
    compres: false,
    conservacio: false,
    plansPreu: false,
    rols: true
  },
  anonimitza: false
};
