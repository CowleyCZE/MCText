import React from 'react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mt-6 border-t border-slate-700 pt-6">
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <div className="space-y-4 text-slate-300">{children}</div>
  </div>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode, titleClass?: string }> = ({ title, children, titleClass = "text-cyan-300" }) => (
  <div>
    <h4 className={`text-lg font-semibold ${titleClass} mb-2`}>{title}</h4>
    <div className="space-y-2 pl-4">{children}</div>
  </div>
);

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

export const SunoAIComprehensiveGuide: React.FC = () => (
    <div className="space-y-4">
        <h2 className="text-2xl font-bold">Optimalizace Tvorby Hudby s Suno.ai: Průvodce Formátováním a Promptováním</h2>
        
        <Section title="Úvod: Využití Suno.ai pro Kvalitní Hudební Tvorbu">
            <p>Suno.ai představuje pokročilý nástroj pro generování hudby s využitím umělé inteligence, který umožňuje uživatelům vytvářet kompletní písně, včetně textů, vokálů a instrumentace, z pouhého textového popisu. Tato platforma je postavena na kombinaci transformerových a difuzních modelů, které interpretují uživatelské vstupy a generují vysoce kvalitní hudební kompozice. Její flexibilita se projevuje v podpoře generování hudby v mnoha jazycích a v široké škále žánrů. K dispozici jsou různé modely, například v3.5 pro bezplatný tarif a v4 pro placené plány, které se liší maximální délkou generovaných skladeb a kvalitou výstupu.</p>
            <p>Kvalita hudby generované umělou inteligencí je silně závislá na správné struktuře a jasném formátování vstupních promptů. Efektivní promptování je nezbytné k tomu, aby se Al vyhnula generickým výstupům a namísto toho produkovala specifické a smysluplné texty a melodie. Jasné formátování, jako je používání závorek pro sekce a specifických meta tagů, se přímo promítá do předvídatelnějšího a lépe sladěného výstupu, protože poskytuje Al jednoznačné "kotvy" nebo "omezení", které odrážejí strukturovanou povahu hudby.</p>
        </Section>
        
        <Section title="Základní Struktura Písně a Formátování Textu">
            <SubSection title="Použití závorek pro definování sekcí písně">
                <p>Hranaté závorky jsou základním nástrojem pro definování různých sekcí písně. Správné označení sekcí pomáhá Al vyhnout se problémům s opakováním a zajišťuje soudržnou kompozici. Běžné strukturální meta tagy, které lze použít, zahrnují: <code>[Intro]</code>, <code>[Verse]</code>, <code>[Pre-Chorus]</code>, <code>[Chorus]</code>, <code>[Outro]</code>, atd.</p>
                <p>Příklad základní šablony: <code>[Intro]</code> <code>[Verse 1] (text prvního verše)</code> <code>[Chorus] (text refrénu)</code> <code>[Verse 2] (pokračování)</code> <code>[Chorus]</code> <code>[Outro]</code>.</p>
            </SubSection>

            <SubSection title="Charakteristika délky řádků a přirozený tok">
                <p>Suno.ai nemá striktní pravidla pro počet slov na řádek, ale zaměřuje se na rytmus. Variabilita v délce řádků a strategické použití interpunkce ovlivňuje lyrický tok a načasování.</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                    <li><strong>Variabilní délka řádků:</strong> Vyhněte se stejné délce řádků. Měnící se délka dává zpěvákovi více či méně času na zpěv.</li>
                    <li><strong>Využití interpunkce pro pauzy a důraz:</strong>
                        <ul className="list-disc list-inside space-y-1 pl-4 mt-1">
                            <li>Čárka (,) může vytvořit krátkou pauzu.</li>
                            <li>Tečka (.) vytvoří delší pauzu pro dramatický efekt.</li>
                            <li>Dvojtečka (:) narušuje tok a klade důraz na následující slova, mění načasování a může vést k vokálnímu běhu.</li>
                        </ul>
                    </li>
                </ul>
            </SubSection>
            
            <SubSection title="Integrace instrumentálních pokynů a zvukových efektů">
                <p>Pro obohacení kompozice je možné přidávat instrumentální prvky a zvukové efekty přímo do textu pomocí závorek, například <code>[808s kick in]</code>, <code>[Piano fills]</code>, nebo <code>[Guitar solo]</code>. Lze také specifikovat zvuky prostředí jako <code>[Phone ringing]</code> nebo <code>[Applause]</code>.</p>
            </SubSection>
        </Section>
        
        <Section title="Komplexní Průvodce Meta Tagy Suno.ai">
            <p>Meta tagy jsou klíčová slova vložená do hranatých závorek, která ovlivňují způsob, jakým Al zpracovává váš požadavek. Umožňují upřesnit strukturu písně, vokální styl, efekty a žánr. Představují most mezi lidským tvůrčím záměrem a algoritmickým zpracováním Al.</p>

            <div className="overflow-x-auto my-4">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <TableRow cells={['Kategorie', 'Meta Tagy', 'Popis']} isHeader />
                    </thead>
                    <tbody className="bg-slate-800">
                        <TableRow cells={['Strukturální', '<code>[Intro]</code>, <code>[Verse]</code>, <code>[Pre-Chorus]</code>, <code>[Chorus]</code>, <code>[Bridge]</code>, <code>[Outro]</code>, <code>[End]</code>', 'Definují základní stavební kameny písně, jako je úvod, sloka, refrén atd.']} />
                        <TableRow cells={['Vokální & Hlasové', '<code>[Male singer]</code>, <code>[Female singer]</code>, <code>[Child voice]</code>, <code>[Alto]</code>, <code>[Whispers]</code>, <code>[Harmonized chorus]</code>, <code>[Auto-tuned]</code>, <code>[Airy]</code>, <code>[Crisp]</code>, <code>[Legato]</code>, <code>[Vibrato-heavy]</code>', 'Určují pohlaví, věk, rozsah, efekty, texturu a styl vokálu.']} />
                        <TableRow cells={['Instrumentální & Stylové', '<code>[Acoustic guitar]</code>, <code>[Orchestral strings]</code>, <code>[808s kick in]</code>, <code>[Lo-fi]</code>, <code>[Electropop]</code>, <code>[Punchy drums]</code>, <code>[12-bar blues format]</code>', 'Zdůrazňují konkrétní nástroje, definují celkový styl nebo žánr instrumentace a specifikují detaily zvuku a techniky.']} />
                        <TableRow cells={['Nálada, Energie & Rytmus', '<code>[Melancholic]</code>, <code>[Uplifting]</code>, <code>[High Energy]</code>, <code>[Crescendo]</code>, <code>[Fast]</code>, <code>[Upbeat]</code>, <code>[Complex]</code>, <code>[Polyrhythmic layers]</code>', 'Definují emocionální náladu, úroveň energie, dynamiku a rytmické vlastnosti hudby.']} />
                        <TableRow cells={['Zvukové efekty', '<code>[Applause]</code>, <code>[Cheers and applause]</code>, <code>[Audience laughing]</code>, <code>[Phone ringing]</code>, <code>[Censored]</code>', 'Přidávají specifické zvukové efekty do skladby.']} />
                    </tbody>
                </table>
            </div>

            <SubSection title="Osvědčené postupy pro meta tagy">
                 <ul className="list-disc list-inside space-y-1 pl-2">
                    <li><strong>Stručnost:</strong> Ideálně 1-5 slov.</li>
                    <li><strong>Umístění:</strong> Nad nebo vedle textu, který ovlivňují.</li>
                    <li><strong>Kapitalizace:</strong> Kapitalizace žánru v promptu (např. DREAMY SYNTHWAVE) může zlepšit přesnost.</li>
                    <li><strong>Vyhýbání se konfliktům:</strong> Vyvarujte se protichůdných tagů (např. low + high energy).</li>
                    <li><strong>Experimentování:</strong> Al může interpretovat i formáty jako <code>{}</code> nebo <code>()</code>.</li>
                </ul>
            </SubSection>
        </Section>

        <Section title="Tipy pro Kvalitní Generování v Suno.ai">
            <SubSection title="Strategie pro tvorbu jasných a specifických promptů">
                 <ul className="list-disc list-inside space-y-1 pl-2">
                    <li><strong>Začněte s jasným žánrem a náladou:</strong> Místo "Smutná píseň" zkuste "Melancholic indie folk acoustic guitar song about regret".</li>
                    <li><strong>Buďte specifičtí ohledně nástrojů a vokálů:</strong> Např. "DREAMY SYNTHWAVE, ethereal pads, punchy drums, reverb-soaked vocals".</li>
                    <li><strong>Kombinujte styly a žánry:</strong> Např. "Jazztronica, Groovy, Electric piano, Urban nightlife".</li>
                    <li><strong>Využijte časová období:</strong> Odkazy na desetiletí mohou dát hudbě retro nádech ("1980s influence, Synthwave").</li>
                    <li><strong>Přidejte narativní prvek:</strong> Dejte promptu směr, např. "A journey into the depths of space".</li>
                    <li><strong>Vyhněte se přílišné specifičnosti:</strong> Přílišné přetížení detaily může vést ke zmatku Al.</li>
                </ul>
            </SubSection>

            <SubSection title={'Využití "Custom Mode" a pole "Style of Music"'}>
                <p><strong>"Custom Mode"</strong> nabízí větší kontrolu, umožňuje oddělit prompt pro styl od samotných textů. To vede k předvídatelnějším a kvalitnějším výsledkům.</p>
                <p>Pole <strong>"Style of Music"</strong> je klíčové pro definování celkového žánru, nálady a stylu písně. Funguje jako "globální filtr". Popis v tomto poli ovlivňuje melodii, akordy, beaty, nástroje a vokály.</p>
                <div className="overflow-x-auto my-4">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <TableRow cells={['Aspekt', 'Doporučení', 'Příklad', 'Proč to funguje']} isHeader />
                        </thead>
                        <tbody className="bg-slate-800">
                            <TableRow cells={['Žánr & Styl', 'Buďte specifičtí, kombinujte žánry. Kapitalizujte hlavní žánr.', '<code>DREAMY SYNTHWAVE, MODERN COUNTRY, Jazztronica</code>', 'Poskytuje Al jasný hudební rámec, snižuje vágnost. Kapitalizace zvyšuje prioritu.']} />
                            <TableRow cells={['Nálada & Emoce', 'Popište požadovaný pocit nebo energii.', '<code>Melancholic, Uplifting, Mysterious, cosmic</code>', 'Pomáhá Al vytvořit odpovídající harmonie a instrumentaci.']} />
                            <TableRow cells={['Nástroje', 'Uveďte klíčové nástroje, které chcete slyšet.', '<code>acoustic guitar, ethereal pads, punchy drums</code>', 'Navádí Al k výběru a aranžování nástrojů.']} />
                            <TableRow cells={['Vokální Styl', 'Popište požadovaný vokální projev nebo typ hlasu.', '<code>reverb-soaked vocals, warm vocals, ethereal voice, Female</code>', 'Dává Al pokyny pro vokální projev, tón a efekty.']} />
                            <TableRow cells={['Tempo & Klíč', 'Specifikujte BPM a hudební klíč pro přesnou kontrolu.', '<code>Tempo: 90 BPM, Key: A Minor</code>', 'Zajišťuje soudržnou harmonii a rytmus.']} />
                            <TableRow cells={['Další detaily', 'Přidejte "ear candy" nebo popis produkce.', '<code>Crisp and clean production, ear candy, catchy</code>', 'Jemné detaily, které mohou zlepšit celkovou kvalitu a atraktivitu.']} />
                        </tbody>
                    </table>
                </div>
            </SubSection>
        </Section>
        
        <Section title="Závěr: Experimentování a Další Kroky">
            <p>Úspěch s Suno.ai spočívá v neustálém experimentování. Je nezbytné iterovat a zdokonalovat prompty na základě generovaných výsledků. Funkce jako "Extend" a "Replace Sections" jsou cennými nástroji pro doladění skladeb. Přestože je Al pokročilá, lidský prvek – v podobě kreativity, emoční hloubky a finálního doladění – zůstává nezastupitelný pro vytvoření skutečně rezonující a originální hudby. Suno.ai by měla být vnímána jako nástroj, nikoli náhrada.</p>
             <SubSection title="Důležité úvahy">
                 <ul className="list-disc list-inside space-y-1 pl-2">
                    <li><strong>Vlastnictví a autorská práva:</strong> Komerční práva jsou obvykle spojena s placenými plány. Autorské právo pro díla generovaná AI je složitá a vyvíjející se oblast.</li>
                    <li><strong>Komunitní pravidla:</strong> Je důležité dodržovat pravidla komunity Suno, která zahrnují laskavost, konstruktivní zpětnou vazbu a vyhýbání se zakázanému obsahu.</li>
                    <li><strong>Plány a kredity:</strong> Suno nabízí různé plány s odlišným počtem kreditů pro generování písní.</li>
                </ul>
            </SubSection>
        </Section>
    </div>
);