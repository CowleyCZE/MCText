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


export const PoetryAnalysisForAI: React.FC = () => (
    <div className="space-y-4">
        <h2 className="text-2xl font-bold">Architektura a duše písňového textu: Komplexní průvodce pro pokročilé tvůrce</h2>

        {/* Úvod */}
        <div className="space-y-3">
            <h3 className="text-xl font-semibold mt-4">Úvod: Anatomie mistrovského díla</h3>
            <p>Písňový text představuje unikátní uměleckou formu, existující na dynamickém pomezí poezie, psychologie, hudby a naratologie. Není to pouhá báseň položená na hudbu, ani hudba sloužící jako kulisa pro slova. V nejvyšší formě se jedná o nedělitelnou symbiózu, kde každý prvek – sémantický význam, fonetická kvalita slova, rytmický spád, melodický obrys a harmonická barva – pracuje v dokonalé shodě na vytvoření jediného, silného emocionálního a estetického zážitku.</p>
        </div>

        {/* Část I */}
        <div className="space-y-3">
            <h3 className="text-xl font-semibold mt-4">Část I: Psychologie a emoce v textu – Proč píseň cítíme</h3>
            <p>Schopnost písně vyvolat hlubokou emocionální odezvu není dílem náhody ani magie. Je to výsledek komplexní interakce mezi sémantickým obsahem textu, akustickými vlastnostmi hudby a složitými neurobiologickými procesy v mozku posluchače. Pochopení těchto mechanismů poskytuje textaři mocný nástroj: schopnost navrhovat texty, které nejen sdělují myšlenku, ale cíleně formují emocionální prožitek.</p>
            
            <h4 className="text-lg font-semibold mt-3">1.1 Mozek a slovo: Neurovědecké základy vnímání textu</h4>
            <p>Když posloucháme hudbu s textem, náš mozek provádí fascinující úkol, který přesahuje pouhé pasivní vnímání. Zapojuje se do něj síť specializovaných oblastí. Klíčové jsou <strong>Brokova oblast</strong> (produkce a porozumění řeči) a <strong>Wernickeho oblast</strong> (sémantický obsah). Emoční odezvu řídí <strong>amygdala</strong> (emoční detektor) a paměťové spojení zajišťuje <strong>hipokampus</strong>. Pocit potěšení zprostředkovává <strong>nucleus accumbens</strong> (centrum odměn).</p>

            <h4 className="text-lg font-semibold mt-3">1.2 Sémantická rezonance: Jak texty definují a zesilují emoce</h4>
            <p>Texty aktivně formují a zesilují emocionální prožitek. Pomocí <strong>Russellova modelu afektu</strong> lze emoce organizovat podle os <strong>valence</strong> (příjemnost) a <strong>arousal</strong> (energie). Text může vědomě kalibrovat emocionální náboj. Tento proces, tzv. <strong>lyrická zpětná vazba</strong>, může mít i negativní dopad, pokud posiluje maladaptivní strategie poslechu a ruminaci, zejména u jedinců s predispozicí k depresi.</p>
            
            <h4 className="text-lg font-semibold mt-3">1.3 Techniky emocionálního dopadu: Od smyslových detailů k narativnímu napětí</h4>
            <p><strong>Konkretizace abstraktního pomocí smyslových detailů:</strong> Místo "bylo mi smutno" je účinnější popsat fyzické projevy, např. "studený déšť na rukou".</p>
            <p><strong>"Push-Pull" dynamika – vytváření a uvolňování napětí:</strong> Emočně strhující písně fungují na principu emocionální přetahované. Sloka (Push/Napětí) buduje napětí, zatímco refrén (Pull/Uvolnění) nabízí emocionální rozřešení a katarzi. Tento princip je základem dramaturgie písně.</p>
        </div>
        
        {/* Část II */}
        <div className="space-y-3">
            <h3 className="text-xl font-semibold mt-4">Část II: Symbolika a archetypy – Budování hlubšího významu</h3>
            <p>Použití symbolů a archetypů otevírá dveře k hlubším, trvalejším a univerzálnějším významovým vrstvám. Fungují jako sémantické zkratky, které propojují příběh písně s rozsáhlou sítí kulturních a psychologických významů.</p>
            <h4 className="text-lg font-semibold mt-3">2.1 Jazyk symbolů: Od konkrétního k univerzálnímu</h4>
            <p><strong>Symbol</strong> je specifický objekt, obraz nebo barva, který reprezentuje širší, abstraktní myšlenku (např. růže jako symbol lásky). Dělí se na přírodní, barevné a kulturně-mytologické.</p>
            <h4 className="text-lg font-semibold mt-3">2.2 Síla archetypů: Napojení na kolektivní nevědomí</h4>
            <p><strong>Archetyp</strong> je, na rozdíl od symbolu, univerzální a vrozený vzorec postavy, situace nebo tématu, který rezonuje napříč kulturami. Podle Junga jsou archetypy součástí "kolektivního nevědomí". Mezi klíčové archetypální postavy patří Hrdina, Mentor, Stín, Psanec, Kejklíř, Pečovatelka a Nevinný. Mezi archetypální situace patří Cesta hrdiny, Ztráta nevinnosti, Podsvětí, Zahrada a Pustina.</p>
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-700">
                      <TableRow cells={['Archetypální postava', 'Klíčová funkce / Motivace', 'Příklady (CZ / Svět)']} isHeader />
                    </thead>
                    <tbody className="bg-slate-800">
                      <TableRow cells={['Hrdina', 'Sebepoznání, překonání překážek, záchrana', 'Aragorn (Pán prstenů), Frodo, "Píseň neznámého vojína" (Karel Kryl)']} />
                      <TableRow cells={['Mentor (Moudrý stařec)', 'Vedení, moudrost, poskytnutí daru/rady', 'Gandalf (Pán prstenů), Brumbál (Harry Potter), "Darmoděj" (Jaromír Nohavica)']} />
                      <TableRow cells={['Stín', 'Konfrontace s temnou stránkou, potlačené touhy', 'Dr. Jekyll a Mr. Hyde, "Stín" Krahujce (Čaroděj Zeměmoří)']} />
                      <TableRow cells={['Svůdkyně (Temptress)', 'Pokušení, využití touhy ke zničení', 'Salome, "Jolene" (Dolly Parton), "Margita" (Jaromír Nohavica)']} />
                      <TableRow cells={['Nevinný (Panna)', 'Čistota, naivita, víra v dobro, zranitelnost', 'Popelka, Sněhurka, "Nevidomá dívka" (Karel Kryl)']} />
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);