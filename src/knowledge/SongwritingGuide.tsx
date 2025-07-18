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

export const SongwritingGuide: React.FC = () => (
    <div className="space-y-4">
        <h2 className="text-2xl font-bold">Důležité Informace pro Psaní Kvalitních Textů Písní: Taktiky a Doporučení</h2>

        <div className="space-y-3">
            <h3 className="text-xl font-semibold mt-4">Úvod: Proč na textech písní záleží?</h3>
            <h4 className="text-lg font-semibold mt-3">Význam a dopad kvalitních textů</h4>
            <p>Kvalitní texty písní představují neviditelnou nit, která propojuje umělce s publikem, vytvářející hluboké spojení, jež přesahuje pouhá slova. Jsou esencí, která vdechuje život hudebním kompozicím a transformuje je z pouhých zvuků v silné narativy. Zatímco hudba dokáže pohnout duší, jsou to právě texty, které vyprávějí příběh, malují živé obrazy a tvoří narativy, které si posluchači odnášejí s sebou. Skvělé texty se proto nejen rýmují; rezonují na hlubší úrovni. Hudba má jedinečnou schopnost stimulovat uvolňování dopaminu v mozku, což vytváří pocity potěšení a hlubokého spojení. Emocionálně autentický text tento prožitek umocňuje.</p>
        </div>

        <div className="space-y-3">
            <h3 className="text-xl font-semibold mt-4">Základní stavební kameny a principy</h3>
            <h4 className="text-lg font-semibold mt-3">Příběh, emoce a obraznost: Tři pilíře</h4>
            <p>Každý účinný text potřebuje tři základní prvky, aby udržel pozornost posluchačů: Příběh, Emoce a Obraznost. Příběh odpovídá na otázku "co se děje?", emoce na "jak se k tomu cítím?" a obraznost na "jak to vypadá?". Smíchání těchto tří prvků dohromady vytváří poutavé texty. Pokud jeden z nich chybí, publikum může ztratit zájem.</p>
            
            <h4 className="text-lg font-semibold mt-3">Jednoduchost jako základ</h4>
            <p>Jedním z nejzásadnějších pravidel je zachovat jednoduchost. Ironií je, že většina popových a rockových hitů je převážně jednoduchá - akordové postupy jsou snadno uchopitelné a texty nejsou složité. Mnoho písní přetrvalo čas díky tomu, že byly jednoduché na zapamatování a emocionálně přímočaré.</p>

            <h4 className="text-lg font-semibold mt-3">Upřímnost a autenticita</h4>
            <p>Lepší texty vycházejí z upřímné, emocionální hloubky. Hudba je pro mnoho posluchačů útočištěm, takže čím zranitelnější dokážete být ve svých textech, tím větší je pravděpodobnost, že si rychle získáte posluchače. Psaní o tom, co textař skutečně cítí a čemu věří, umožňuje publiku vnímat upřímnost a pravdivost.</p>
            
            <h4 className="text-lg font-semibold mt-3">Princip "Ukaž, neříkej": Konkrétnost a specifičnost</h4>
            <p>Princip "Ukaž, neříkej" (Show, Don't Tell) je mocná technika v psaní textů. Namísto přímého vyjádření emoce nebo situace se doporučuje popsat konkrétní detaily, které umožní publiku si danou emoci či situaci samo odvodit. Přemýšlejte o místech, zvucích, vzpomínkách a kulisách, které můžete pomocí textu vytvořit, aby posluchač získal představu o příběhu bez vnucování myšlenek.</p>
        </div>
        
        <div className="space-y-3">
            <h3 className="text-xl font-semibold mt-4">Struktura písně a její role v textech</h3>
            <h4 className="text-lg font-semibold mt-3">Základní stavební kameny</h4>
            <p>Struktura písně odkazuje na to, jak je skladba organizována pomocí kombinace různých sekcí. Typická struktura zahrnuje:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
                <li><strong>Intro (Úvod):</strong> Úvod písně má za cíl upoutat pozornost posluchače, aniž by ho zahltil.</li>
                <li><strong>Sloka (Verse):</strong> Sloka je místo, kde se příběh písně lyricky rozvíjí a posouvá kupředu.</li>
                <li><strong>Předrefrén (Pre-chorus):</strong> Ačkoliv je volitelný, předrefrén pomáhá zvýšit dopad refrénu a buduje napětí.</li>
                <li><strong>Refrén (Chorus):</strong> Refrén je vyvrcholením, nejzapamatovatelnější část, která obsahuje hlavní myšlenku písně.</li>
                <li><strong>Most (Bridge):</strong> Objevuje se ke konci písně, přináší změnu tempa a novou perspektivu.</li>
                <li><strong>Outro (Závěr):</strong> Signalizuje konec písně, často zpomalením nebo opakováním refrénu do ztracena.</li>
            </ul>
        </div>

        <div className="space-y-3">
            <h3 className="text-xl font-semibold mt-4">Osvědčené taktiky a techniky</h3>
            <h4 className="text-lg font-semibold mt-3">Mistrovství v práci s jazykem a zvukem</h4>
            <p><strong>Figurativní jazyk</strong> jako metafory, přirovnání a symbolika není pouhou dekorací; jsou to nástroje pro vyjádření složitých emocí a abstraktních myšlenek přístupným způsobem. <strong>Storytelling</strong> je klíčový – čím živější obrazy můžete použít, tím lépe zprostředkujete své sdělení.</p>
            <p>Kromě významu slov je důležitý i jejich zvuk. Techniky jako <strong>rým, aliterace, asonance a konsonance</strong> dodávají textům hudebnost.</p>
            <h5 className="font-semibold mt-2">Rýmová schémata</h5>
            <p>Rýmová schémata vytvářejí tok a strukturu. Je důležité se vyvarovat "nucených rýmů", kde je slovo vybráno jen pro rým, nikoli pro jeho význam. Mezi běžná schémata patří:</p>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse my-4">
                    <thead>
                        <TableRow cells={['Schéma', 'Vzor', 'Popis a účinek']} isHeader />
                    </thead>
                    <tbody className="bg-slate-800">
                        <TableRow cells={['Sdružený', 'AABB', 'Dva po sobě jdoucí verše se rýmují. Vytváří stabilní, silné a jednoduché spojení.']} />
                        <TableRow cells={['Střídavý', 'ABAB', 'Rýmují se liché a sudé verše. Působí plynule a přirozeně, mění tok frází.']} />
                        <TableRow cells={['Obkročný', 'ABBA', 'Vnější verše se rýmují spolu a vnitřní také. Vytváří pocit uzavřenosti a napětí, posluchač čeká na rozuzlení.']} />
                         <TableRow cells={['Přerývaný', 'ABCB', 'Rýmují se pouze sudé řádky. Poskytuje velkou volnost a působí konverzačně.']} />
                        <TableRow cells={['Postupný', 'ABC/ABC', 'Tvoří komplexnější struktury, často používané ve složitějších básních nebo rapových textech.']} />
                        <TableRow cells={['Tirádový (Monorým)', 'AAAA', 'Všechny řádky sdílejí stejný rým. Velmi silné a stabilní, ale náročné na plynulost a udržení zajímavosti.']} />
                    </tbody>
                </table>
            </div>
        </div>

        <div className="space-y-3">
            <h3 className="text-xl font-semibold mt-4">Melodie, harmonie a technické aspekty</h3>
             <h4 className="text-lg font-semibold mt-3">Neoddělitelné spojení textu a melodie</h4>
            <p>Melodie je pravděpodobně stejně důležitá jako text. Je to to, co dělá píseň zapamatovatelnou a co utkví posluchači v mysli. Melodické frázování by mělo být optimalizováno z hlediska chytlavosti, srozumitelnosti a tematického smyslu.</p>
             <h4 className="text-lg font-semibold mt-3">Harmonické postupy</h4>
            <p>Harmonie, tvořená akordy, dodává písni emocionální hloubku. Nemusíte používat složité postupy; mnoho hitů je založeno na jednoduchých, ale efektivních spojeních, jako je základní I-IV-V, které je rozšířené napříč mnoha žánry.</p>
            <h4 className="text-lg font-semibold mt-3">Neobvyklé prvky – "Wow" faktor</h4>
            <p>Přidání neobvyklého prvku může učinit vaši píseň jedinečnou. Může to být nečekaná změna v aranžmá, neobvyklý nástroj nebo unikátní vokální technika. Posluchači milují momenty, které je překvapí.</p>
        </div>

        <div className="space-y-3">
            <h3 className="text-xl font-semibold mt-4">Kreativní proces a zlepšování</h3>
            <h4 className="text-lg font-semibold mt-3">Zdroje inspirace</h4>
            <p>Inspirace může přijít z různých zdrojů: sledujte lidi a jejich příběhy, čerpejte z osobních zkušeností a vzpomínek, emocí a nálad, denních situací, ale i z jiných uměleckých forem jako jsou filmy nebo knihy.</p>
            <h4 className="text-lg font-semibold mt-3">Brainstorming a experimentování</h4>
            <p>Nejlepší způsob, jak získat dobrý nápad, je mít spoustu nápadů. Během kreativního procesu byste neměli žádné nápady odmítat jako špatné. Je důležité odložit kritické myšlení, dokud nemáte první verzi. Experimentujte také s kreativními omezeními (např. napsat píseň za den), která mohou paradoxně podnítit kreativitu.</p>
            <h4 className="text-lg font-semibold mt-3">Studium, spolupráce a zpětná vazba</h4>
            <p>Studujte své oblíbené umělce a analyzujte, jak jejich texty fungují. Spolupracujte s jinými hudebníky a vyhledávejte zpětnou vazbu od posluchačů. Je to skvělý způsob, jak zlepšit své dovednosti.</p>
        </div>

        <div className="space-y-3">
            <h3 className="text-xl font-semibold mt-4">Časté chyby, kterým se vyhnout</h3>
            <ul className="list-disc list-inside space-y-1 pl-2">
                <li><strong>Mluvnické a jazykové chyby:</strong> Vyhýbejte se "mluvnickým rýmům" (slova, která se rýmují jen proto, že jsou stejné kategorie, např. infinitivy). Dbejte na správnou gramatiku, pokud to není umělecký záměr.</li>
                <li><strong>Přílišná složitost:</strong> Nepoužívejte zbytečně složité akordické postupy nebo komplikované melodické linie, pokud to neslouží konkrétnímu účelu. Jednoduchost je často klíčem k efektivitě.</li>
                <li><strong>Nucené rýmy:</strong> Nikdy neobětujte význam a přirozenost textu jen kvůli rýmu. Poselství je vždy na prvním místě.</li>
            </ul>
        </div>

        <div className="space-y-3">
            <h3 className="text-xl font-semibold mt-4">Závěr</h3>
            <p>Kvalitní text písně vyžaduje kombinaci technických dovedností, kreativity a emocionální autenticity. Klíčem k úspěchu je nalezení rovnováhy mezi jednoduchostí a originalitou, přičemž vždy je důležité mít na paměti, že píšete pro posluchače, kteří by měli být schopni se s vaší hudbou emocionálně spojit.</p>
        </div>
    </div>
  );
