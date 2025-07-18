import React from 'react';

const Section: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="mt-6 border-t border-slate-700 pt-6">
    <h3 className="text-2xl font-bold mb-4 flex items-center">
        <span className="text-3xl mr-3">{icon}</span>
        {title}
    </h3>
    <div className="space-y-4 text-slate-300 pl-4 border-l-2 border-sky-500">{children}</div>
  </div>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h4 className="text-lg font-semibold text-cyan-300 mb-2">{title}</h4>
    <div className="space-y-2 pl-4 text-slate-300">{children}</div>
  </div>
);


export const GenreSpecificWritingGuide: React.FC = () => (
  <div className="space-y-4">
    <p className="text-lg text-slate-300">Rap, rock a pop mají odlišné stylové prvky, ale jedno mají společné – silný text musí jít ruku v ruce s chytlavou melodií. Text nemusí být hluboký, stačí úderná fráze nebo refrén, který zůstane v hlavě. Vhodné je pracovat systematicky a psát pravidelně.</p>
    
    <Section title="Rap" icon="🎤">
      <SubSection title="Hlavní rysy:">
        <ul className="list-disc list-outside ml-5 space-y-1">
            <li><strong>Autenticita:</strong> Vyprávějte svou pravdu.</li>
            <li><strong>Flow:</strong> Každý řádek musí ladit s beatem.</li>
            <li><strong>Lyrické nástroje:</strong> Metafory, slovní hříčky, slang.</li>
            <li><strong>Refrén:</strong> Krátký, výstižný hook.</li>
            <li><strong>Producentství:</strong> Kvalitní beat zvýší sílu textu.</li>
        </ul>
      </SubSection>
      <SubSection title="Tipy pro psaní:">
        <ul className="list-disc list-outside ml-5 space-y-1">
            <li>Psaní = řemeslo → cvičte pravidelně.</li>
            <li>Používejte osobní příběhy.</li>
            <li>Experimentujte se strukturou a jazykem.</li>
        </ul>
      </SubSection>
    </Section>

    <Section title="Rock" icon="🎸">
       <SubSection title="Hlavní rysy:">
        <ul className="list-disc list-outside ml-5 space-y-1">
            <li><strong>Emoce:</strong> Láska, rebelie, svoboda.</li>
            <li><strong>Instrumentace:</strong> Elektrická kytara, basa, bicí.</li>
            <li><strong>Tempo:</strong> 4/4 takt, 110–140 BPM.</li>
            <li><strong>Struktura:</strong> Sloka – refrén – bridge – sólo.</li>
        </ul>
      </SubSection>
      <SubSection title="Tipy pro psaní:">
        <ul className="list-disc list-outside ml-5 space-y-1">
            <li>Pište o skutečných pocitech.</li>
            <li>Buďte drsní, ale upřímní.</li>
            <li>Nahrajte nápady i jako demo.</li>
        </ul>
      </SubSection>
    </Section>
    
    <Section title="Pop" icon="🎧">
       <SubSection title="Hlavní rysy:">
        <ul className="list-disc list-outside ml-5 space-y-1">
            <li><strong>Hook:</strong> Chytlavý refrén, který se opakuje.</li>
            <li><strong>Jasnost:</strong> Přímočarý jazyk, jednoduché rýmy.</li>
            <li><strong>Emoční rezonance:</strong> Text musí být srozumitelný pro široké publikum.</li>
            <li><strong>Délka:</strong> Ideálně do 3 minut.</li>
        </ul>
      </SubSection>
      <SubSection title="Tipy pro psaní:">
        <ul className="list-disc list-outside ml-5 space-y-1">
            <li>Využijte motivy: láska, sny, inspirace.</li>
            <li>Inspirujte se současnými hity.</li>
            <li>Refrén by měl být vrcholem písně.</li>
        </ul>
      </SubSection>
    </Section>
    
    <Section title="Struktura písně" icon="🧩">
        <ul className="list-disc list-outside ml-5 space-y-2 font-mono">
            <li><strong className="font-sans font-semibold">ABA:</strong> Sloka - Refrén – Sloka</li>
            <li><strong className="font-sans font-semibold">ABABCB:</strong> Sloka – Refrén – Sloka – Refrén – Bridge – Refrén</li>
            <li><strong className="font-sans font-semibold">AAA:</strong> Tři sloky bez refrénu (často folk)</li>
        </ul>
    </Section>

    <Section title="Praktické tipy a časté chyby" icon="🛠️">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-emerald-300 mb-2">✅ Dělejte:</h4>
                <ul className="list-disc list-outside ml-5 space-y-1">
                    <li><strong>Piš pravidelně:</strong> Nečekej na inspiraci.</li>
                    <li><strong>Zapisuj nápady:</strong> I ty náhodné.</li>
                    <li><strong>Zkoušej melodie:</strong> Na nástroj nebo beat.</li>
                    <li><strong>Upravuj:</strong> Revize zlepší text.</li>
                    <li><strong>Buď autentický:</strong> Nepiš fráze, které nejsou tvoje.</li>
                </ul>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-red-400 mb-2">❌ Nedělejte:</h4>
                <ul className="list-disc list-outside ml-5 space-y-1">
                    <li><strong>Nejasná forma</strong> (sloka vs refrén).</li>
                    <li><strong>Přehnané klišé</strong> a obecná slova.</li>
                    <li><strong>Rýmy mimo rytmus</strong> nebo násilné.</li>
                    <li><strong>Nedostatek úprav</strong> – „první verze = finální“ je omyl.</li>
                </ul>
            </div>
        </div>
    </Section>
    
    <Section title="Jak promptovat AI" icon="🤖">
      <SubSection title="Struktura ideálního promptu:">
        <ol className="list-decimal list-outside ml-5 space-y-2">
            <li><strong>Role:</strong> „Jsi zkušený český textař rapu/pop/rocku.“</li>
            <li><strong>Žánr:</strong> Uveď explicitně.</li>
            <li><strong>Téma:</strong> Např. „Píseň o síle přátelství.“</li>
            <li><strong>Struktura:</strong> „Dvě sloky, osm řádků, refrén se dvěma rýmy.“</li>
            <li><strong>Styl:</strong> Drsný, romantický, melancholický atd.</li>
            <li><strong>Klíčová slova:</strong> Zahrnout slova jako láska, noc, odvaha...</li>
            <li><strong>Cílové publikum:</strong> Např. „mladí lidé po rozchodu“.</li>
            <li><strong>Jazyk:</strong> Čeština, důraz na přirozenost.</li>
        </ol>
      </SubSection>
      <SubSection title="Příklad promptu:">
        <blockquote className="bg-slate-900 border-l-4 border-sky-500 p-4 rounded-r-lg italic text-slate-300">
            „Napiš český rapový text pro dva přátele, kteří spolu prožili těžké chvíle. Chci dvě sloky po 8 verších, silný refrén o odvaze. Styl: upřímný, syrový, inspirativní. Jazyk hovorový, ale bez vulgarit.“
        </blockquote>
      </SubSection>
    </Section>

  </div>
);
