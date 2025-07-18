
import React from 'react';
import type { KnowledgeBaseSection } from './types';
import { CzechRhymeAndSemantics } from './knowledge/czechRhymeAndSemantics';
import { PoetryAnalysisForAI } from './knowledge/PoetryAnalysisForAI';
import { PoeticsAndStructureInLyrics } from './knowledge/PoeticsAndStructureInLyrics';


export const SUNO_AI_LYRICS_MAX_CHARS = 3000;
export const SUNO_AI_STYLE_MAX_CHARS = 200;

export const KNOWLEDGE_BASE_SECTIONS: KnowledgeBaseSection[] = [
  {
    id: 'alchemical-art-lyrics',
    title: 'Alchymické umění textu',
    content: <CzechRhymeAndSemantics />, // Note: Re-using component, but content is now from Alchemical Art...
  },
  {
    id: 'architecture-soul-lyrics',
    title: 'Architektura a duše textu',
    content: <PoetryAnalysisForAI />, // Note: Re-using component, but content is now from Architecture...
  },
  {
    id: 'poetics-and-structure-lyrics',
    title: 'Poetika a struktura v lyrice',
    content: <PoeticsAndStructureInLyrics />,
  },
  {
    id: 'suno-info',
    title: 'O Suno.ai',
    content: (
      <>
        <p>Suno.ai je platforma umělé inteligence, která umožňuje generovat hudbu (včetně vokálů) na základě textových pokynů. Uživatelé zadají text písně, styl hudby a další parametry, a Suno.ai vytvoří kompletní skladbu.</p>
        <h4 className="font-semibold mt-3 mb-1 text-sky-300">Klíčové vlastnosti:</h4>
        <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
          <li>Generování hudby z textu.</li>
          <li>Široká škála hudebních stylů.</li>
          <li>Možnost použití metatagů pro detailní strukturování písně.</li>
          <li>Rychlé prototypování hudebních nápadů.</li>
        </ul>
        <h4 className="font-semibold mt-3 mb-1 text-sky-300">Tipy pro používání:</h4>
        <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
          <li>Buďte co nejspecifičtější ve vašem "Style of Music" promptu.</li>
          <li>Experimentujte s různými kombinacemi metatagů.</li>
          <li>Krátší písně (kolem 2-3 minut) mívají často lepší výsledky.</li>
          <li>Využijte "Continue From This Song" pro prodloužení nebo variace.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'suno-metatags',
    title: 'Metatagy v Suno.ai',
    content: (
      <>
        <p>Metatagy v Suno.ai slouží k detailnímu řízení struktury a prvků generované písně. Vkládají se přímo do textu písně a jsou uzavřeny v hranatých závorkách, např. <code>[verse]</code>.</p>
        <h4 className="font-semibold mt-3 mb-1 text-sky-300">Běžně používané metatagy:</h4>
        <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
          <li><strong>Strukturální:</strong> <code>[intro]</code>, <code>[verse]</code>, <code>[pre-chorus]</code>, <code>[chorus]</code>, <code>[hook]</code>, <code>[bridge]</code>, <code>[solo]</code>, <code>[instrumental]</code>, <code>[outro]</code>, <code>[break]</code>, <code>[interlude]</code>, <code>[fade out]</code>.</li>
          <li><strong>Vokální styl:</strong> <code>[male singer]</code>, <code>[female singer]</code>, <code>[rap]</code>, <code>[spoken word]</code>, <code>[scream]</code>, <code>[whisper]</code>, <code>[background vocals]</code>, <code>[harmony]</code>, <code>[ad libs]</code>.</li>
          <li><strong>Instrumentální:</strong> <code>[guitar solo]</code>, <code>[piano solo]</code>, <code>[synth solo]</code>, <code>[drum fill]</code>. Můžete specifikovat i konkrétní nástroje jako <code>[acoustic guitar]</code>, <code>[strings]</code>.</li>
          <li><strong>Nálada/Dynamika:</strong> <code>[upbeat]</code>, <code>[chill]</code>, <code>[emotional]</code>, <code>[energetic]</code>, <code>[quiet]</code>, <code>[intense]</code>.</li>
          <li><strong>Technické:</strong> <code>[tempo: 120]</code> (bpm), <code>[key: Cmaj]</code> (tónina). Tyto jsou méně spolehlivé, Suno často lépe reaguje na popisný styl.</li>
        </ul>
        <h4 className="font-semibold mt-3 mb-1 text-sky-300">Příklad použití:</h4>
        <pre className="bg-slate-800 p-3 rounded-md text-sm overflow-x-auto">
          {`[intro]
(instrumental synth intro)

[verse]
První sloka o ranní kávě
Myšlenky plynou jak líná řeka

[pre-chorus]
Napětí stoupá, blíží se změna

[chorus]
Refrén! Tohle je ten hlavní motiv!
Energie a síla slov!

[guitar solo]

[verse]
Druhá sloka, příběh pokračuje
Nové obrazy, nové emoce

[outro]
(fade out with synth pads)
`}
        </pre>
        <p className="mt-2">Experimentujte s pořadím a kombinací tagů. Suno je flexibilní, ale jasná struktura pomáhá.</p>
      </>
    ),
  },
  {
    id: 'songwriting-genres',
    title: 'Skládání textů v různých žánrech',
    content: (
      <>
        <p>Každý hudební žánr má svá specifika, co se týče textů. Zde je několik obecných bodů:</p>
        <ul className="list-disc list-inside space-y-2 pl-2 text-slate-300">
          <li><strong>Pop:</strong> Chytlavé melodie, opakující se refrény, témata lásky, vztahů, osobních zážitků. Rýmy bývají jednoduché a přímočaré.</li>
          <li><strong>Rock:</strong> Širší škála témat, od sociální kritiky po osobní zpovědi. Texty mohou být komplexnější, často s výraznou metaforikou.</li>
          <li><strong>Hip-Hop/Rap:</strong> Důraz na rytmus, flow a rýmovací schémata. Texty často vyprávějí příběhy, reflektují sociální problémy, nebo jsou formou sebeprezentace. Hra se slovy, punchlines.</li>
          <li><strong>Country:</strong> Vyprávění příběhů, témata rodiny, venkova, ztráty, naděje. Texty jsou často přímočaré a emocionální.</li>
          <li><strong>Folk:</strong> Podobně jako country, důraz na příběh a autenticitu. Často akustické, s důrazem na textovou výpověď. Může mít politický nebo sociální podtext.</li>
          <li><strong>Electronic/Dance:</strong> Texty mohou být minimalistické, repetitivní, nebo se zaměřovat na atmosféru a emoce spíše než na příběh. Často se používají jako další instrumentální vrstva.</li>
        </ul>
        <p className="mt-2">Klíčem je poslouchat mnoho hudby ve vámi zvoleném žánru a analyzovat, jak jsou texty strukturovány a jaká témata se v nich objevují.</p>
      </>
    ),
  },
  {
    id: 'lyric-writing-tips',
    title: 'Tipy a triky pro psaní textů',
    content: (
      <>
        <h4 className="font-semibold mt-3 mb-1 text-sky-300">Obecné rady:</h4>
        <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
          <li><strong>Show, Don't Tell:</strong> Místo "Byl jsem smutný" napište "Slzy mi stékaly po tváři, když déšť bubnoval na okno." Používejte konkrétní obrazy a smyslové detaily.</li>
          <li><strong>Rýmy a Rytmus:</strong> Hledejte zajímavé rýmy, ale nenechte se jimi svazovat na úkor smyslu. Pracujte s rytmem slov a frází. Rýmovací slovníky mohou pomoci, ale nejlepší je vlastní invence.</li>
          <li><strong>Struktura písně:</strong> Běžná struktura (sloka-refrén-sloka-refrén-most-refrén) je osvědčená, ale nebojte se experimentovat.</li>
          <li><strong>Úhel pohledu:</strong> Kdo vypráví příběh? (Já, ty, on/ona/ono, my, vy, oni). Konzistentní úhel pohledu je důležitý.</li>
          <li><strong>Téma a Poselství:</strong> O čem vaše píseň je? Co chcete sdělit? Jasné téma pomáhá udržet text soustředěný.</li>
          <li><strong>Revize:</strong> První verze je jen začátek. Přepisujte, škrtejte, doplňujte. Nechte text "uležet" a vraťte se k němu s čerstvýma očima.</li>
          <li><strong>Inspirace:</strong> Čtěte poezii, poslouchejte hudbu, sledujte filmy, pozorujte svět kolem sebe. Inspirace může přijít odkudkoli.</li>
          <li><strong>Používejte silná slovesa:</strong> Aktivní a dynamická slovesa oživí váš text.</li>
          <li><strong>Vyhněte se klišé:</strong> Snažte se najít originální způsoby, jak vyjádřit běžné myšlenky a emoce.</li>
        </ul>
      </>
    ),
  },
];
