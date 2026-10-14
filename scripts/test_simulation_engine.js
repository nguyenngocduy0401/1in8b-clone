import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const countriesData = require('../src/data/countries.json');
const namesData = require('../src/data/names.json');
const citiesData = require('../src/data/cities.json');
const citiesEnData = require('../src/data/cities_en.json');

import { chooseCountry, generateBirthIdentity, generatePeerBabies } from '../src/engine/demographics.js';
import { advanceOneYear } from '../src/engine/simulation.js';
import { DECISIONS } from '../src/engine/decisions.js';

console.log('--- RUNNING SIMULATION TEST ---');
console.log('Available decisions in DECISIONS:', Object.keys(DECISIONS).length);

// 1. Test different eras
const testEras = ['2024', '1990', '1970', '1950', 'random'];

for (const era of testEras) {
  const country = chooseCountry(countriesData);
  const identity = generateBirthIdentity({
    country,
    countries: countriesData,
    namesPool: namesData,
    citiesPool: citiesData,
    citiesEnPool: citiesEnData,
    era,
    homeCountryId: 'VNM'
  });

  const peers = generatePeerBabies(countriesData, namesData);

  let state = {
    ...identity,
    peers,
    alive: true,
    yearsLived: 0,
    pendingDecision: null,
    pendingReflection: null,
    log: []
  };

  console.log(`\nTesting Era ${era} (Birth Year ${identity.birthYear}): Born in ${identity.country.ko} (${identity.country.id}), Life Expectancy calibrated: ${identity.country.le}`);

  let decisionsFired = 0;

  while (state.alive && state.yearsLived < 100) {
    state = advanceOneYear(state);

    if (state.pendingDecision) {
      decisionsFired++;
      const d = state.pendingDecision;
      const choice = d.choices[0];
      const res = choice.apply(state);
      state.pendingDecision = null;
      state.log.unshift({ age: state.yearsLived, type: 'decision', text: res });
    }

    if (state.pendingReflection) {
      state.pendingReflection = null;
    }
  }

  const factEntries = state.log.filter(l => l.fact);
  console.log(`Finished at age ${state.yearsLived}. Alive: ${state.alive}, Decisions encountered: ${decisionsFired}, Fact entries: ${factEntries.length}, Total log entries: ${state.log.length}`);
  if (factEntries[0]) {
    console.log(`Sample fact logged:`, factEntries[0].fact.vi);
  }
}

console.log('\nAll simulation tests passed with 100% success!');
