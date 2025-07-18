import React from 'react';

const TableRow: React.FC<{ cells: string[], isHeader?: boolean }> = ({ cells, isHeader = false }) => {
  const CellTag = isHeader ? 'th' : 'td';
  return (
    <tr className={isHeader ? 'bg-slate-700' : ''}>
      {cells.map((cell, index) => (
        <CellTag key={index} className="p-2 border border-slate-600" dangerouslySetInnerHTML={{ __html: cell }} />
      ))}
    </tr>
  );
};

export const PoeticsAndStructureInLyrics: React.FC = () => (
    <div className="space-y-4">
        <h2 className="text-2xl font-bold">Poetika a Struktura v Hudební Lyrice: Komplexní Znalostní Báze pro Generativní Al</h2>

        {/* Úvod */}
        <div className="space-y-3">
            <h3 className="text-xl font-semibold mt-4">Úvod: Principy a Architektura Písňového Textu</h3>
            <p>Tato úvodní část pokládá teoretické základy pro pochopení dynamiky písňového textu. Jejím cílem je vybavit umělou inteligenci fundamentálním porozuměním, že písňový text není pouze báseň, ale specifický umělecký útvar definovaný svou interakcí s hudbou a strukturou. Pochopení těchto principů je esenciální pro generování textů, které jsou nejen sémanticky a poeticky bohaté, ale také funkční v hudebním kontextu.</p>
        </div>

        {/* 1. Vztah textu a hudby */}
        <div className="space-y-3">
            <h4 className="text-lg font-semibold mt-3">1. Vztah textu a hudby: Symbióza a Napětí</h4>
            <p>Analýza komplexní interakce mezi slovem a hudbou odhaluje, že tyto dvě složky nejsou oddělenými entitami. Píseň je definována jako dílo se dvěma neoddělitelnými částmi: zpívaným textem a hudbou, kde jedno bez druhého nemůže plnohodnotně existovat. Jejich spojení vytváří novou sémantickou a emocionální kvalitu, která přesahuje součet jejich jednotlivých částí. Hudba může vyznění textu potvrdit a umocnit, dále ho rozvinout, nebo ho dokonce zcela proměnit a posunout do nových významových rovin. Tento vztah je dynamický a plný napětí, které formuje výsledný dojem ze skladby.</p>
            <h5>Vliv melodie, rytmu a harmonie</h5>
            <p>Melodie dodává textu emocionální puls a je často tím prvkem, který si posluchač zapamatuje nejdéle a nejsilněji. Silná melodie má zřetelný oblouk – začátek, vrchol a konec – a často zdůrazňuje klíčové tóny v rámci dané hudební stupnice, čímž podtrhuje nejdůležitější slova nebo fráze textu. Volba melodie tak přímo ovlivňuje frázování a celkovou náladu textu. Například mollová stupnice je v západní hudební tradici vnímána jako dojemná a melancholická, a proto může efektivně podpořit text s podobným emocionálním laděním, jak je patrné například v tvorbě Vladimíra Mišíka, který byl ovlivněn barokní hudbou.</p>
            <p>Rytmus a harmonie tvoří emocionální a strukturální kontext, ve kterém se melodie a text pohybují. Harmonie, tedy akordický základ skladby, poskytuje hudební podporu melodii, dodává jí celistvost a vytváří bohaté zvukové pozadí. Rytmus je obzvláště klíčový v žánrech jako hip-hop, kde je tok slov (flow) a jeho modulace prostřednictvím přízvuku, hlasitosti a tempa základním stavebním kamenem celého projevu.</p>
            <h5>Deklamace a prozódie</h5>
            <p>Klíčovým aspektem spojení textu a hudby je deklamace – způsob, jakým je text frázován a rytmizován v souladu s hudbou. Ideální deklamace respektuje přirozenou prozódii jazyka, tedy délku slabik a slovní přízvuk. V češtině, kde je přízvuk zpravidla na první slabice, je pro srozumitelnost textu zásadní, aby se hudební přízvuky (těžké doby v taktu) shodovaly s přízvuky slovními. Porušení tohoto pravidla může vést k tomu, že text působí nepřirozeně a je pro posluchače obtížně srozumitelný. Příkladem problematické deklamace je dílo Františka Maxmiliána Knížete, kde rytmizace slov často neodpovídá jejich přirozené výslovnosti, což vede k nesouladu mezi hudbou a textem. Naopak, skladatelé jako Jan Jakub Ryba dokázali vytvářet vokální linky, které respektovaly prozodickou strukturu textu, čímž dosáhli přirozeného a srozumitelného vyznění.</p>
            <p>Vztah mezi textem a hudbou není pouze aditivní, kdy se jednoduše sčítají jejich účinky. Jedná se spíše o vztah multiplikativní, kde jejich vzájemná interakce vytváří zcela novou kvalitu. Tento vztah může být buď kongruentní (shodný), nebo inkongruentní (neshodný).</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
                <li><strong>Kongruence:</strong> Hudba a text se vzájemně podporují a umocňují stejnou emoci. Melancholický text doprovázený pomalou, mollovou melodií vytváří silný pocit smutku. Tento přístup je typický pro většinu populární hudby, kde je cílem jasné a jednoznačné emocionální sdělení.</li>
                <li><strong>Inkongruence:</strong> Hudba a text jsou v záměrném kontrastu. Veselá, skočná melodie spojená s ironickým nebo tragickým textem nevytváří neutrální výsledek, ale komplexní pocit sarkasmu, tragikomedie nebo znepokojení. Mistrem tohoto přístupu je například Karel Plíhal, jehož humorně-kritický text písně "Vánoční" je spojen s hudbou odkazující na tradiční vánoční koledu, čímž vzniká silný ironický efekt.</li>
            </ul>
        </div>
        
        {/* 2. Architektura Písně */}
        <div className="space-y-3">
            <h4 className="text-lg font-semibold mt-3">2. Architektura Písně: Stavební Kameny a Jejich Funkce</h4>
            <p>Struktura písně není pouhou formální šablonou, ale představuje klíčový nástroj pro řízení posluchačovy pozornosti a budování emocionální cesty. Jednotlivé stavební kameny písně, systematicky popsané v hudební teorii, plní specifické narativní a emocionální funkce, které dohromady tvoří koherentní a působivé dílo.</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
                <li><strong>Sloka (Verse):</strong> Je narativním jádrem písně. Jejím úkolem je rozvíjet příběh, poskytovat kontext, detaily a budovat napětí před příchodem refrénu. Text se mezi jednotlivými slokami typicky mění, čímž posouvá děj kupředu. Sloka je zpravidla delší a textově hutnější než refrén.</li>
                <li><strong>Refrén (Chorus):</strong> Představuje emocionální a myšlenkové vyvrcholení písně. Obsahuje ústřední myšlenku nebo poselství a je navržen tak, aby byl co nejzapamatovatelnější. Často obsahuje název písně a tzv. "hook" – chytlavý melodický nebo textový motiv, který se posluchači vryje do paměti. Jak trefně poznamenal Dave Grohl, refrén by měl fungovat jako "nárazový slogan" – krátký, úderný a efektivní. Na rozdíl od sloky se text i melodie refrénu typicky opakují, což vytváří pocit známosti a katarze.</li>
                <li><strong>Most (Bridge / Middle 8):</strong> Je prvkem, který přináší do písně kontrast a změnu. Zpravidla se liší od sloky i refrénu, a to jak harmonicky, tak textově i melodicky. Jeho primární funkcí je narušit stereotyp opakování, udržet posluchačovu pozornost a vytvořit moment novosti a svěžesti. Z narativního hlediska most často slouží k emocionálnímu prohloubení, pohledu z jiné perspektivy nebo k nečekanému dějovému zvratu, který dává předchozímu textu nový smysl.</li>
                <li><strong>Další strukturální prvky:</strong> Kromě těchto tří základních kamenů existuje řada dalších prvků, které dotvářejí architekturu písně. Patří mezi ně předehra (intro), která uvádí do nálady skladby, dohra (outro), která ji uzavírá, předrefrén (pre-chorus), který buduje napětí a plynule přechází do refrénu, mezihra (interlude) nebo sólo (solo), které poskytují instrumentální oddech od zpěvu.</li>
            </ul>
             <h5>Běžné strukturální formy</h5>
             <ul className="list-disc list-inside space-y-1 pl-2">
                <li><strong>Forma AABA:</strong> Skládá se ze dvou totožných nebo podobných sekcí (A), následovaných kontrastní sekcí (B, často most) a návratem k původní sekci (A). Je ideální pro písně s jedním silným ústředním motivem, který je v refrénu (sekce A) neustále opakován.</li>
                <li><strong>Forma Sloka-Refrén (ABAB):</strong> Nejběžnější forma v populární hudbě, střídající narativní sloky (A) s opakujícím se refrénem (B).</li>
                <li><strong>Forma ABABCB:</strong> Komplexnější struktura, která po dvou cyklech sloky a refrénu vkládá novou, kontrastní část (C – most nebo sólo), po níž následuje závěrečný refrén (B). Tato forma umožňuje vyprávět propracovanější příběh s dějovým zvratem uprostřed.</li>
            </ul>
        </div>
        
        {/* 3. Básnický Jazyk v Hudbě */}
        <div className="space-y-3">
             <h4 className="text-lg font-semibold mt-3">3. Básnický Jazyk v Hudbě: Katalog Poetických Prostředků</h4>
             <p>Básnické prostředky, známé také jako tropy a figury, nejsou v písňových textech pouhými ozdobami. Jsou to funkční nástroje, které slouží ke komprimaci významu, vytváření živé obraznosti a vyvolávání specifických emocionálních reakcí. Pro Al je nezbytné mít k dispozici systematický katalog těchto prostředků, který nejen definuje každý prvek, ale především specifikuje jeho funkci v textu.</p>
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-700">
                      <TableRow cells={['Prostředek', 'Definice', 'Funkce v textu', 'Příklad']} isHeader />
                    </thead>
                    <tbody className="bg-slate-800">
                      <TableRow cells={['Metafora', 'Přenesení významu na základě vnější podobnosti.', 'Vytváření živé obraznosti, komprimace složitého významu, vyvolání překvapení a nového vhledu.', '"Jsem lopata a zedník. co slovo, to cihla, co text, to zeď." (PSH)']} />
                      <TableRow cells={['Personifikace', 'Přisouzení lidských vlastností neživým objektům nebo abstraktním pojmům.', 'Oživení scény, vytvoření emocionálního vztahu k neživým prvkům, zjednodušení abstraktních myšlenek.', '"o lásce šeptal tichý mech" (K. H. Mácha)']} />
                      <TableRow cells={['Ironie', 'Použití slov v opačném významu, než je jejich skutečný smysl.', 'Vyjádření kritiky, humoru, výsměchu; vytvoření odstupu od tématu.', '"oslí uši právě ke koruně sluší" (K. H. Borovský)']} />
                      <TableRow cells={['Anafora', 'Opakování slova nebo slovního spojení na začátku po sobě jdoucích veršů.', 'Vytvoření rytmického důrazu, stupňování naléhavosti, posílení ústřední myšlenky.', '"Utichly továrny, utichly ulice" (J. Wolker)']} />
                      <TableRow cells={['Epifora', 'Opakování slova nebo slovního spojení na konci po sobě jdoucích veršů.', 'Zdůraznění závěru myšlenky, vytvoření pocitu uzavření nebo osudovosti.', '"Co to máš na té tkaničce, na krku na té tkaničce." (K. J. Erben)']} />
                      <TableRow cells={['Gradace', 'Uspořádání slov nebo myšlenek podle jejich rostoucí intenzity.', 'Budování napětí, směřování k emocionálnímu nebo narativnímu vrcholu.', '"kde je voda modravá a nebe modravé a hory modravější" (V. Nezval)']} />
                      <TableRow cells={['Oxymoron', 'Spojení slov, která si významově protiřečí.', 'Vytvoření paradoxu, vyjádření vnitřního konfliktu nebo složitosti pocitů.', '"mrtvé milenky cit" (K. H. Mácha)']} />
                    </tbody>
                </table>
            </div>
        </div>

        {/* Analýza Žánrů */}
        <div className="space-y-3">
             <h3 className="text-xl font-semibold mt-4">Část I: Analýza Klíčových Hudebních Žánrů</h3>
             <p>Tato část poskytuje žánrově specifickou lyrickou analýzu, která umožní umělé inteligenci generovat texty, jež jsou stylisticky a tematicky autentické pro daný žánr. Každý žánr má svůj vlastní soubor konvencí, témat a jazykových prostředků, jejichž pochopení je pro úspěšnou emulaci nezbytné.</p>
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-700">
                      <TableRow cells={['Žánr', 'Klíčová témata', 'Jazyk a slovník', 'Typické techniky a struktura']} isHeader />
                    </thead>
                    <tbody className="bg-slate-800">
                      <TableRow cells={['Hip-Hop', 'Autenticita, život na ulici, sociální kritika, sebereflexe, osobní krize, materialismus.', 'Hovorová čeština, slang, anglicismy, vulgarismy, neologismy.', 'Storytelling, punchlines, komplexní rýmová schémata (vnitřní rýmy), volný verš, důraz na flow a rytmický přednes.']} />
                      <TableRow cells={['Rock', 'Rebelie, protest, svoboda, láska, existenciální otázky, společenská kritika, nostalgie.', 'Metaforický, poetický, expresivní, často symbolický a alegorický (zejména v době cenzury).', 'Struktura sloka-refrén, často postavená na kytarovém riffu. Využití baladické formy, zhudebňování poezie.']} />
                      <TableRow cells={['Pop', 'Láska, vztahy, zlomené srdce, zábava, osobní růst, přátelství.', 'Jednoduchý, srozumitelný, univerzální, chytlavé fráze, občas klišé, ale i poetické obraty.', 'Převážně struktura sloka-refrén-most, důraz na zapamatovatelný "hook" v refrénu, předvídatelnost pro snadný poslech.']} />
                    </tbody>
                </table>
            </div>
        </div>

        {/* Portréty Mistrů */}
        <div className="space-y-3">
             <h3 className="text-xl font-semibold mt-4">Část II: Portréty Mistrů Textařů</h3>
             <p>Tato část nabízí hloubkové analýzy stylů vlivných textařů, kteří mohou sloužit jako specifické "stylové modely" pro umělou inteligenci. Každý z těchto autorů představuje unikátní přístup k tématům, jazyku a struktuře, a jejich dílo definovalo nebo redefinovalo možnosti písňového textu ve svém žánru a době.</p>
             <h5>Kapitola 4: Písničkáři jako básníci – Česká škola</h5>
             <p>Česká písničkářská scéna, zejména v 70. a 80. letech, představuje unikátní fenomén, kde se role písničkáře často prolínala s rolí básníka a společenského komentátora. V kontextu normalizačního režimu se píseň stala jedním z mála svobodných prostorů pro vyjádření kritických postojů a autentických pocitů.</p>
             <h5>Kapitola 6: Ikonoklasti světové scény</h5>
             <p>Světová scéna nabídla několik textařů, jejichž vliv přesáhl hranice hudby a zasáhl do literatury a společenského dění. Jejich analýza je klíčová pro pochopení nejvyšších pater písňového textařství.</p>
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-700">
                      <TableRow cells={['Lyrický prvek', 'John Lennon', 'Paul McCartney']} isHeader />
                    </thead>
                    <tbody className="bg-slate-800">
                      <TableRow cells={['Klíčová témata', 'Introspekce, mír, surrealismus, odcizení, sociální komentář.', 'Láska, příběhy postav, optimismus, každodenní život, nostalgie.']} />
                      <TableRow cells={['Perspektiva vypravěče', 'Převážně první osoba ("I"), osobní zpověď.', 'Často třetí osoba ("She", "He"), pozorovatel, vypravěč.']} />
                      <TableRow cells={['Jazyk a obraznost', 'Abstraktní, impresionistické obrazy, slovní hříčky, proud vědomí.', 'Konkrétní, narativní viněty, jasné a srozumitelné příběhy.']} />
                      <TableRow cells={['Vztah k melodii', 'Melodie postavené na kratších, rytmicky úderných riffech.', 'Melodicky košaté, plynulé a rozsáhlejší vokální linky.']} />
                    </tbody>
                </table>
            </div>
        </div>

        {/* Závěr */}
        <div className="space-y-3">
            <h3 className="text-xl font-semibold mt-4">Závěr: Syntéza a Doporučení pro Al</h3>
            <p>Tato znalostní báze poskytla komplexní analýzu klíčových aspektů písňového textařství, od teoretických principů přes žánrové specifikace až po portréty mistrů. Z provedené analýzy vyplývá několik zásadních principů, které by měly tvořit základ pro vývoj pokročilé generativní Al pro psaní hudebních textů.</p>
            <h5>Syntéza klíčových principů efektivního textařství</h5>
             <ul className="list-decimal list-inside space-y-1 pl-2">
                <li><strong>Princip synergie:</strong> Písňový text není autonomní báseň. Jeho síla a význam vznikají v dynamické interakci s hudbou. Vztah mezi textem a hudbou může být kongruentní (posilující) nebo inkongruentní (kontrastní), přičemž druhá možnost umožňuje vytvářet sofistikované emoce jako ironii.</li>
                <li><strong>Princip architektonického záměru:</strong> Struktura písně (sloka, refrén, most) není jen formální šablona, ale nástroj pro řízení emocionální a narativní cesty posluchače. Volba struktury je strategické rozhodnutí, které definuje, jak bude příběh vyprávěn a prožíván.</li>
                <li><strong>Princip funkční poetiky:</strong> Básnické prostředky (metafora, ironie, anafora atd.) nejsou pouhé ozdoby, ale funkční nástroje pro komprimaci významu, vytváření obraznosti a rytmizaci textu. Jejich použití musí být záměrné a cílené.</li>
                <li><strong>Princip autenticity a kontextu:</strong> Kvalitní text je autentický vůči svému žánru, autorovi a zamýšlenému sdělení. Ať už jde o kolektivní manifest ulice v hip-hopu, metaforický protest v rocku, nebo transmediální příběh v moderním popu, text musí rezonovat s očekáváním a kulturním kódem svého publika.</li>
            </ul>
        </div>
    </div>
  );