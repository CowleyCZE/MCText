
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


export const CzechRhymeAndSemantics: React.FC = () => (
    <div className="space-y-4">
        <h2 className="text-2xl font-bold">Alchymické umění textu: Rámec pro emocionálně rezonující a hudebně funkční písňové texty</h2>

        {/* Část I */}
        <div className="space-y-3">
            <h3 className="text-xl font-semibold mt-4">Část I: Základy lyrického dopadu</h3>
            <p>Tato část pokládá teoretické základy z oblasti psychologie a literární teorie, které vysvětlují, proč a jak na nás hudba a texty tak hluboce působí. Postupuje od neurologické a kognitivní reakce na hudbu až k hlubší, kulturně zakořeněné síle symbolů.</p>
            
            <h4 className="text-lg font-semibold mt-3">Sekce 1: Psychoakustika emocí: Jak hudba a slova formují pocity</h4>
            <h5>1.1 Dualita hudebního významu: Absolutistické vs. referenční pohledy</h5>
            <p>V srdci hudební psychologie leží zásadní filozofická debata o původu významu v hudbě. Tato debata je klíčová pro pochopení role, kterou hrají texty. Hudební teoretik Leonard Meyer ve svém stěžejním díle Emotion and Meaning in Music (1956) představil dvě protichůdné pozice: absolutistickou a referenční.</p>
            <p><strong>Absolutistický pohled</strong> tvrdí, že hudební význam a emoce jsou obsaženy čistě <em>uvnitř</em> samotné hudební struktury. Vznikají z komplexní souhry melodie, harmonie, rytmu a formy. Z tohoto hlediska hudba nepotřebuje žádné vnější odkazy, aby vyvolala silnou emocionální reakci; její síla spočívá v abstraktních vzorcích a vztazích mezi tóny. Tento pohled se dále dělí na dva proudy:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
                <li><strong>Formalistický proud</strong> zastává názor, že hudební význam je čistě intelektuální záležitostí, která spočívá v percepci a pochopení hudebních vztahů v díle.</li>
                <li><strong>Expresionistický proud</strong>, ke kterému se klonil i sám Meyer, oponuje, že tyto hudební vztahy jsou samy o sobě schopny vzbuzovat v posluchači emoce a pocity. Hudba tedy není jen intelektuální hrou, ale přímo působí na naši afektivní sféru.</li>
            </ul>
            <p>Na druhé straně <strong>referenční pohled</strong> tvrdí, že hudební význam vzniká tím, že hudba odkazuje na vnější, mimohudební svět – na koncepty, činy, emoce, příběhy a osobnosti. Podle tohoto názoru je hudba jazykem, který popisuje nebo evokuje něco mimo sebe. Písňový text je nejzřetelnějším příkladem referenčního významu v hudbě, protože explicitně propojuje hudební zážitek s konkrétním příběhem, obrazem nebo myšlenkou.</p>
            
            <h5>1.2 Teorie emocionální indukce v hudbě</h5>
            <p>Meyerova <strong>teorie očekávání</strong>: Jednou z nejvlivnějších je Meyerova teorie očekávání, která tvrdí, že emoce v hudbě vznikají z naplňování nebo narušování očekávání, jež v posluchači budují hudební vzorce. Když hudba vytvoří silný vzorec (například opakující se rytmus nebo harmonický postup), náš mozek podvědomě předpokládá jeho pokračování. Pokud je toto očekávání naplněno, cítíme uspokojení a uvolnění. Pokud je však narušeno – například náhlou změnou akordu, rytmu nebo melodie – vzniká napětí, překvapení nebo šok. Právě tato hra s napětím a uvolněním je základním motorem hudebních emocí. Tento princip se nevztahuje pouze na hudbu, ale i na narativní strukturu textu, kde očekáváme rozuzlení příběhu nebo rýmovou shodu.</p>
            
            <h5>1.3 Fyzická manifestace hudební emoce</h5>
            <p>Nejsilnější důkaz o přímém spojení hudby a emocí poskytuje naše vlastní tělo. Intenzivní hudební zážitky často vyvolávají silné a měřitelné fyziologické reakce. Mezi nejznámější patří fenomén "chills" (pocit mrazení nebo husí kůže), slzení, zrychlení srdečního tepu nebo změny v dýchání. Výzkum Johna Slobody z roku 1991 zjistil, že určité hudební struktury jsou s těmito reakcemi statisticky spojeny. Například: Slzy byly často spojeny s melodickými průtahy (appoggiaturami), Mrazení (chills) se často objevovalo při náhlých harmonických změnách a Zrychlený srdeční tep byl spojen s rytmickou akcelerací a synkopami.</p>

            <h4 className="text-lg font-semibold mt-3">Sekce 2: Rezonance univerzálního: Archetypy a symboly v písni</h4>
            <h5>2.1 Kolektivní nevědomí a archetypální teorie</h5>
            <p>Švýcarský psycholog Carl Gustav Jung představil koncept <strong>kolektivního nevědomí</strong>, které definoval jako hlubokou vrstvu psychiky sdílenou celým lidstvem. Toto nevědomí obsahuje zděděné, univerzální vzorce myšlení a chování, které Jung nazval <strong>archetypy</strong>.</p>
            <p>Archetypy nejsou konkrétní obrazy nebo myšlenky, ale spíše vrozené tendence nebo "organizační principy", které strukturují naše prožívání světa. Síla archetypů spočívá v jejich schopnosti rezonovat s nevědomou složkou posluchačovy psychiky. Použitím symbolu, jako je "cesta", může textař okamžitě evokovat komplexní síť asociovaných významů (životní pouť, svoboda, osamělost, útěk), aniž by je musel explicitně popisovat.</p>
            
            <h5>2.2 Lexikon klíčových archetypů pro textaře</h5>
            <ul className="list-disc list-inside space-y-1 pl-2">
                <li><strong>Hrdina (The Hero):</strong> Symbolizuje cestu vědomí, proces individuace, překonávání překážek a dosažení zralosti.</li>
                <li><strong>Velká Matka (The Great Mother):</strong> Archetyp života, plodnosti, péče a výživy.</li>
                <li><strong>Moudrý stařec (Senex / The Wise Old Man):</strong> Reprezentuje moudrost, vědění, intuici a duchovní princip.</li>
                <li><strong>Stín (The Shadow):</strong> Představuje potlačenou, temnou a nežádoucí stránku osobnosti.</li>
                <li><strong>Anima / Animus:</strong> Nevědomý ženský/mužský protipól v psychice, ovlivňující vztahy.</li>
                <li><strong>Šibal (The Trickster):</strong> Agent chaosu, porušovatel pravidel a hranic.</li>
            </ul>

            <h5>2.3 Univerzální symboly a jejich lyrická aplikace</h5>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-700">
                      <TableRow cells={['Symbol', 'Asociovaný archetyp(y)', 'Základní významy (Pozitivní / Negativní)', 'Příklad lyrické aplikace (Koncept)']} isHeader />
                    </thead>
                    <tbody className="bg-slate-800">
                      <TableRow cells={['Cesta / Silnice', 'Hrdina, Poutník', 'Životní pouť, transformace, svoboda / Ztracenost, exil, útěk', 'Píseň o opuštění domova a hledání sebe sama na nekonečné dálnici.']} />
                      <TableRow cells={['Voda (řeka, moře, déšť)', 'Velká Matka, Stín', 'Život, očištění, emoce, znovuzrození / Nevědomí, chaos, smrt, pohlcení', 'Text o lásce jako o plavbě na klidném moři, která se změní v bouři.']} />
                      <TableRow cells={['Noc / Tma', 'Stín, Anima', 'Nevědomí, tajemství, intimita, sen / Strach, neznámo, smrt, ztráta orientace', 'Balada o tajemstvích a touhách, které se odhalují pouze pod rouškou tmy.']} />
                      <TableRow cells={['Světlo / Oheň', 'Moudrý stařec, Hrdina', 'Vědomí, poznání, inspirace, život / Zničení, spalující vášeň, slepota', 'Skladba o hledání pravdy jako o plameni svíčky v temnotě.']} />
                      <TableRow cells={['Strom / Les', 'Velká Matka, Život', 'Růst, život, zakořenění, spojení nebe a země / Ztracenost, divokost, nebezpečí', 'Text o návratu ke kořenům a nalezení stability v chaotickém světě.']} />
                      <TableRow cells={['Okno', 'Persona, Anima', 'Hranice mezi vnitřním a vnějším světem, vnímání, touha / Izolace, neuskutečnitelná touha', 'Píseň o pozorování světa z okna, touze být jeho součástí, ale neschopnosti překročit práh.']} />
                      <TableRow cells={['Spirála', 'Proměna, Život', 'Evoluce, cesta do nitra, cykly života a smrti / Zacyklení, sestup do chaosu', 'Text o osobním růstu jako o cestě po spirále, která se vrací ke starým tématům na nové úrovni.']} />
                    </tbody>
                </table>
            </div>
        </div>

        {/* Část II a další */}
        {/* ... Similar structure for other parts ... */}
        
    </div>
);
