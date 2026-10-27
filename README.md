# Website Opportunity Lab

Belső műhely magyar vállalatok weboldalának vizsgálatára, koncepciójának bemutatására és kivitelezési ajánlatára. A 2026. október 27-i kör 50 céget nézett meg, tízet auditált végig, és mind a tízhez kattintható koncepciót készített.

A prototípusok nem a cégek hivatalos oldalai. Az űrlapok a böngészőben ellenőriznek, levelet nem küldenek.

## Indítás

```bash
npm install
npm run dev
```

A fejlesztői szerver a `43123`-as porton indul: [http://127.0.0.1:43123](http://127.0.0.1:43123).

```bash
npm test
npm run build
```

## Mi van benne

- Áttekintés, felfedezés, cégadatlap, audit, redesign galéria, ügyfélprezentáció, ajánlat és pipeline.
- A pontozás és az óradíj a Módszertan oldalon áll. A forgalmi kategória kimarad, amíg nincs megbízható látogatószám.
- Az ajánlat, a pipeline és a belső jegyzet a böngésző `localStorage` tárolójában marad (`wol-state-v1`).
- A tíz koncepció a `/p/[cég]` útvonalon van. Az ügyfélnek szánt nézet a `/present/[cég]`.

## Adat

A cégek, a megállapítások és az ajánlatok a `src/data` mappában vannak. A Lighthouse mobil labor 2026. október 27-én, Europe/Budapest szerint délután készült. Ez szimuláció, nem látogatói CrUX adat. A PageSpeed Insights API aznap 429-et adott.

A Trans-Spednél a tanúsítványlánc hiányos, ezért arra a címre nem futott Lighthouse. A részletek az auditban vannak.

## Ár

Az összegek nettó becslések, 27%-os áfával külön. Nem szerződések, és nem ígérnek bevételnövekedést.
