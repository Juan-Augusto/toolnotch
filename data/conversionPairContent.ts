import type { Locale } from '@/i18n'

/**
 * Per-pair, per-locale editorial content for `/[locale]/tools/convert/[slug]`.
 *
 * WHY THIS LIVES HERE AND NOT IN `messages/*.json`
 * ------------------------------------------------
 * The PRD (WS-2, action 1) allows either a data-model change or a
 * `convert.slugPages.pairs.<slug>` block in the three message files. We chose
 * the data-model route: this is ~350 words of prose per pair per locale, and
 * next-intl loads a locale's *entire* message file on every request of every
 * route. Parking ~35k words of conversion prose in `messages/*.json` would
 * make every page on the site pay for content only eleven pages use.
 *
 * The split we settled on:
 *   - Per-pair prose (this file)  — server-only, imported by the slug route.
 *   - Shared UI chrome (messages) — headings, table labels, FAQ scaffolding,
 *     under the `convert.slugPages` namespace in all three message files.
 *
 * `ConversionPair` in `lib/unitTypes.ts` is deliberately left untouched, so
 * the 70+ non-priority pairs keep their existing English behaviour and cannot
 * regress. `getPairContent()` returns `null` for them and the route falls back
 * to the previous English `title`/`description` rendering path.
 */
export interface PairScenario {
  title: string
  text: string
}

export interface PairContent {
  /** Keyword-led <title>. */
  metaTitle: string
  /** Meta description — must stay <= 160 characters. */
  metaDescription: string
  /** The single H1 for the page. */
  h1: string
  /** One or two sentences directly under the H1. */
  intro: string
  /** Localised unit label for the "from" unit, e.g. "Polegadas (in)". */
  fromLabel: string
  /** Localised unit label for the "to" unit. */
  toLabel: string
  /** What each unit is and where it is actually used. */
  about: string
  /** The conversion formula, rendered in a monospace block. */
  formula: string
  /** Explanation of the formula plus worked examples. */
  formulaNote: string
  /** Two or three concrete real-world situations. */
  scenarios: PairScenario[]
  /** Mental-maths shortcut or practical caveat. */
  proTip: string
}

/**
 * The pairs prioritised from the Google Search Console export (6 months to
 * 2026-08-31). These are the slugs that already earn impressions at positions
 * 75-95 and are therefore the ones worth localising first.
 */
export const PRIORITY_PAIR_SLUGS = [
  'inches-to-centimeters',
  'centimeters-to-inches',
  'miles-to-kilometers',
  'kilometers-to-miles',
  'miles-to-feet',
  'feet-to-inches',
  'mph-to-meters-per-second',
  'minutes-to-seconds',
  'years-to-days',
  'stones-to-pounds',
  'psi-to-bar',
] as const

export type PriorityPairSlug = (typeof PRIORITY_PAIR_SLUGS)[number]

type LocalisedPair = Record<Locale, PairContent>

export const PAIR_CONTENT: Record<string, LocalisedPair> = {
  // ─────────────────────────────────────────────────────────────────────────
  'inches-to-centimeters': {
    en: {
      metaTitle: 'Inches to Centimeters — Convert in to cm Instantly',
      metaDescription:
        'Convert inches to centimeters free. 1 inch = 2.54 cm exactly. Instant converter, formula, worked examples and a full in-to-cm reference table.',
      h1: 'Inches to Centimeters',
      intro:
        'One inch is exactly 2.54 centimeters. That is not a rounded approximation — it is the legal definition agreed by the English-speaking countries in the 1959 international yard and pound agreement.',
      fromLabel: 'Inches (in)',
      toLabel: 'Centimeters (cm)',
      about:
        'The inch is the base small-length unit of the imperial and US customary systems. It survives in daily use mainly in the United States, and worldwide in a few stubborn niches: screen diagonals, wheel and tyre rims, plumbing pipe bores, and lumber dimensions. The centimeter is one hundredth of a meter, a decimal subdivision of the SI base unit. It is the unit almost everyone outside the US reaches for when measuring a body, a piece of furniture, or a suitcase. Because the inch is defined in terms of the meter rather than the other way round, every inch-to-centimeter conversion is exact — no rounding error is introduced by the conversion itself.',
      formula: 'cm = in × 2.54',
      formulaNote:
        'Multiply the number of inches by 2.54 to get centimeters. Because the factor is exact, the arithmetic is the only source of error. A 10-inch tablet is 25.4 cm. A 55-inch television has a 139.7 cm diagonal. A person who is 5 feet 10 inches tall is 70 inches, or 177.8 cm. To go back the other way, divide by 2.54 instead of multiplying.',
      scenarios: [
        {
          title: 'Buying a screen listed in inches',
          text: 'Televisions and monitors are advertised by diagonal in inches almost everywhere, including in metric countries. Converting to centimeters is how you check whether a 65-inch set (165.1 cm) actually fits the 160 cm alcove you measured with a tape.',
        },
        {
          title: 'Height on a US form',
          text: 'Visa applications, gym sign-ups and medical intake forms in the US ask for height in feet and inches. Convert your centimeter height to total inches first, then divide by 12 for feet and keep the remainder as inches.',
        },
        {
          title: 'Ordering materials from a US supplier',
          text: 'Lumber, drill bits, bolts and pipe fittings from American suppliers are sized in inches and fractions of an inch. A 3/4-inch fitting is 1.905 cm, which is not interchangeable with the 20 mm metric fitting it superficially resembles.',
        },
      ],
      proTip:
        'For a fast mental estimate, multiply by 2.5 and add about 1.5%. Twelve inches becomes 30 plus a bit, and the true answer is 30.48 cm. The shortcut is roughly 1.6% low, which is close enough for judging whether furniture will fit but not for anything you intend to cut.',
    },
    pt: {
      metaTitle: 'Polegadas para Centímetros — Converter in em cm',
      metaDescription:
        'Converta polegadas em centímetros grátis. 1 polegada = 2,54 cm exatos. Conversor instantâneo, fórmula, exemplos resolvidos e tabela de referência.',
      h1: 'Polegadas para Centímetros',
      intro:
        'Uma polegada equivale a exatamente 2,54 centímetros. Não é um arredondamento: é a definição legal firmada pelos países de língua inglesa no acordo internacional da jarda e da libra, de 1959.',
      fromLabel: 'Polegadas (in)',
      toLabel: 'Centímetros (cm)',
      about:
        'A polegada é a unidade básica de comprimento pequeno dos sistemas imperial e usual americano. No Brasil ela sobrevive em nichos bem específicos: diagonal de televisores e monitores, aro de rodas e pneus, bitola de canos e conexões hidráulicas, e ferramentas importadas. O centímetro é a centésima parte do metro, uma subdivisão decimal da unidade base do SI, e é o que usamos no dia a dia para medir altura, móveis ou bagagem. Como a polegada é definida a partir do metro, e não o contrário, toda conversão de polegada para centímetro é exata — a própria conversão não introduz nenhum erro de arredondamento.',
      formula: 'cm = pol × 2,54',
      formulaNote:
        'Multiplique o número de polegadas por 2,54 para obter centímetros. Como o fator é exato, o único erro possível é o da própria conta. Um tablet de 10 polegadas tem 25,4 cm. Uma TV de 55 polegadas tem 139,7 cm de diagonal. Quem tem 5 pés e 10 polegadas de altura soma 70 polegadas, ou 177,8 cm. Para fazer o caminho inverso, divida por 2,54 em vez de multiplicar.',
      scenarios: [
        {
          title: 'Comprar uma TV anunciada em polegadas',
          text: 'Televisores e monitores são vendidos pela diagonal em polegadas mesmo no Brasil. Converter para centímetros é como você confere se uma TV de 65 polegadas (165,1 cm) cabe de fato no nicho de 160 cm que você mediu com a trena.',
        },
        {
          title: 'Bitola de canos e conexões',
          text: 'Encanamento residencial no Brasil usa medidas nominais em polegadas — 1/2, 3/4, 1 polegada. Uma conexão de 3/4 de polegada tem 1,905 cm, que não é intercambiável com a conexão métrica de 20 mm com que ela se parece à primeira vista.',
        },
        {
          title: 'Preencher formulários dos EUA',
          text: 'Pedidos de visto, matrículas em academias e fichas médicas nos Estados Unidos pedem altura em pés e polegadas. Converta sua altura em centímetros para polegadas totais, depois divida por 12 para achar os pés e guarde o resto como polegadas.',
        },
      ],
      proTip:
        'Para estimar de cabeça, multiplique por 2,5 e acrescente cerca de 1,5%. Doze polegadas viram 30 e um pouco, e o valor verdadeiro é 30,48 cm. O atalho fica uns 1,6% abaixo do real — suficiente para avaliar se um móvel cabe, mas não para marcar um corte.',
    },
    es: {
      metaTitle: 'Pulgadas a Centímetros — Convertir in a cm',
      metaDescription:
        'Convierte pulgadas a centímetros gratis. 1 pulgada = 2,54 cm exactos. Conversor instantáneo, fórmula, ejemplos resueltos y tabla de referencia.',
      h1: 'Pulgadas a Centímetros',
      intro:
        'Una pulgada equivale exactamente a 2,54 centímetros. No es un redondeo: es la definición legal acordada por los países de habla inglesa en el acuerdo internacional de la yarda y la libra de 1959.',
      fromLabel: 'Pulgadas (in)',
      toLabel: 'Centímetros (cm)',
      about:
        'La pulgada es la unidad básica de longitud pequeña de los sistemas imperial y usual estadounidense. En América Latina sobrevive en nichos concretos: la diagonal de televisores y monitores, el rin de las llantas, el diámetro nominal de tuberías y conexiones, y las herramientas importadas. El centímetro es la centésima parte del metro, una subdivisión decimal de la unidad base del SI, y es lo que usamos a diario para medir estatura, muebles o equipaje. Como la pulgada se define a partir del metro, y no al revés, toda conversión de pulgadas a centímetros es exacta: la conversión en sí no introduce ningún error de redondeo.',
      formula: 'cm = pulg × 2,54',
      formulaNote:
        'Multiplica el número de pulgadas por 2,54 para obtener centímetros. Como el factor es exacto, el único error posible es el de la propia operación. Una tableta de 10 pulgadas mide 25,4 cm. Un televisor de 55 pulgadas tiene 139,7 cm de diagonal. Quien mide 5 pies y 10 pulgadas suma 70 pulgadas, o 177,8 cm. Para el camino inverso, divide entre 2,54 en lugar de multiplicar.',
      scenarios: [
        {
          title: 'Comprar una pantalla anunciada en pulgadas',
          text: 'Televisores y monitores se venden por su diagonal en pulgadas incluso en países métricos. Convertir a centímetros es como compruebas si un televisor de 65 pulgadas (165,1 cm) cabe realmente en el hueco de 160 cm que mediste con la cinta.',
        },
        {
          title: 'Diámetro de tuberías y conexiones',
          text: 'La plomería doméstica usa medidas nominales en pulgadas: 1/2, 3/4, 1 pulgada. Una conexión de 3/4 de pulgada mide 1,905 cm, que no es intercambiable con la conexión métrica de 20 mm a la que se parece a simple vista.',
        },
        {
          title: 'Llenar formularios estadounidenses',
          text: 'Las solicitudes de visa, inscripciones en gimnasios y fichas médicas en Estados Unidos piden la estatura en pies y pulgadas. Convierte tu estatura en centímetros a pulgadas totales, divide entre 12 para los pies y conserva el resto como pulgadas.',
        },
      ],
      proTip:
        'Para estimar de memoria, multiplica por 2,5 y súmale alrededor de 1,5%. Doce pulgadas dan 30 y algo, y el valor real es 30,48 cm. El atajo queda un 1,6% por debajo, suficiente para saber si un mueble entra, pero no para marcar un corte.',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  'centimeters-to-inches': {
    en: {
      metaTitle: 'Centimeters to Inches — Convert cm to in Instantly',
      metaDescription:
        'Convert centimeters to inches free. 1 cm = 0.393701 inches. Instant converter, exact formula, worked examples and a full cm-to-in reference table.',
      h1: 'Centimeters to Inches',
      intro:
        'One centimeter is 0.393701 inches. The relationship is exact in the other direction — an inch is defined as precisely 2.54 cm — so converting centimeters to inches means dividing by 2.54.',
      fromLabel: 'Centimeters (cm)',
      toLabel: 'Inches (in)',
      about:
        'The centimeter is the metric unit most people reach for when a meter is too big and a millimeter is too fussy: body measurements, clothing, furniture, luggage. It is one hundredth of a meter, and the meter has been defined since 1983 by the distance light travels in a vacuum in 1/299,792,458 of a second. The inch is what you need when the destination is American: US retail listings, sewing patterns published in the US, hardware specifications, and any airline or courier that publishes size limits in imperial units. Converting into inches often means converting into fractions too, since US measurement conventionally uses halves, quarters, eighths and sixteenths rather than decimals.',
      formula: 'in = cm ÷ 2.54',
      formulaNote:
        'Divide centimeters by 2.54, or equivalently multiply by 0.393701. A standard 55 × 40 × 20 cm carry-on bag is 21.65 × 15.75 × 7.87 inches. A 30 cm ruler is 11.81 inches — just short of the one-foot ruler it is often sold as. A person of 180 cm is 70.87 inches, which is 5 feet 10.87 inches.',
      scenarios: [
        {
          title: 'Checking airline baggage limits',
          text: 'European and Latin American carriers publish cabin bag limits in centimeters while US carriers use inches. Converting your 55 × 40 × 20 cm bag to 21.65 × 15.75 × 7.87 in tells you immediately whether it clears a 22 × 14 × 9 in sizer.',
        },
        {
          title: 'Ordering clothes from a US store',
          text: 'US size charts give chest, waist and inseam in inches. A 81 cm waist is 31.89 inches, so you would be choosing a 32 rather than the 30 you might have guessed from a rough halving of the centimeter figure.',
        },
        {
          title: 'Following an American pattern or plan',
          text: 'Sewing patterns, woodworking plans and 3D printer build volumes published in the US quote inches. Converting your metric stock to inches before you start avoids a cumulative error that only shows up on the final assembly.',
        },
      ],
      proTip:
        'To estimate in your head, divide by 2.5 and subtract about 1.5%. A hundred centimeters becomes roughly 40 minus a bit, and the true value is 39.37 inches. If you need the answer as a US fraction, multiply the decimal remainder by 16 to get sixteenths — 0.37 in is very close to 6/16, or 3/8.',
    },
    pt: {
      metaTitle: 'Centímetros para Polegadas — Converter cm em in',
      metaDescription:
        'Converta centímetros em polegadas grátis. 1 cm = 0,393701 polegada. Conversor instantâneo, fórmula exata, exemplos resolvidos e tabela completa.',
      h1: 'Centímetros para Polegadas',
      intro:
        'Um centímetro equivale a 0,393701 polegada. A relação é exata no sentido inverso — a polegada é definida como 2,54 cm precisos —, então converter centímetros em polegadas significa dividir por 2,54.',
      fromLabel: 'Centímetros (cm)',
      toLabel: 'Polegadas (in)',
      about:
        'O centímetro é a unidade métrica que usamos quando o metro é grande demais e o milímetro, detalhado demais: medidas do corpo, roupas, móveis, bagagem. É a centésima parte do metro, e o metro é definido desde 1983 pela distância que a luz percorre no vácuo em 1/299.792.458 de segundo. A polegada é o que você precisa quando o destino é americano: anúncios de lojas dos EUA, moldes de costura publicados lá, especificações de ferragens e qualquer companhia aérea ou transportadora que divulgue limites de tamanho em unidades imperiais. Converter para polegadas quase sempre significa converter para frações também, porque a medida americana usa meios, quartos, oitavos e dezesseis avos em vez de decimais.',
      formula: 'pol = cm ÷ 2,54',
      formulaNote:
        'Divida os centímetros por 2,54 ou, o que dá no mesmo, multiplique por 0,393701. Uma mala de mão padrão de 55 × 40 × 20 cm tem 21,65 × 15,75 × 7,87 polegadas. Uma régua de 30 cm tem 11,81 polegadas — pouco menos que o pé inteiro com que costuma ser vendida. Quem tem 180 cm mede 70,87 polegadas, ou seja, 5 pés e 10,87 polegadas.',
      scenarios: [
        {
          title: 'Conferir limites de bagagem de mão',
          text: 'Companhias brasileiras e europeias publicam o limite de bagagem de cabine em centímetros; as americanas, em polegadas. Converter sua mala de 55 × 40 × 20 cm para 21,65 × 15,75 × 7,87 in mostra na hora se ela passa no gabarito de 22 × 14 × 9 in.',
        },
        {
          title: 'Comprar roupa em loja dos EUA',
          text: 'As tabelas de tamanho americanas dão tórax, cintura e entrepernas em polegadas. Uma cintura de 81 cm tem 31,89 polegadas, então você escolheria um 32, e não o 30 que um arredondamento apressado sugeriria.',
        },
        {
          title: 'Seguir um projeto ou molde americano',
          text: 'Moldes de costura, projetos de marcenaria e volumes de impressão 3D publicados nos EUA usam polegadas. Converter seu material métrico para polegadas antes de começar evita um erro cumulativo que só aparece na montagem final.',
        },
      ],
      proTip:
        'Para estimar de cabeça, divida por 2,5 e tire cerca de 1,5%. Cem centímetros viram quase 40, e o valor verdadeiro é 39,37 polegadas. Se você precisa da resposta em fração americana, multiplique a parte decimal por 16 para obter dezesseis avos — 0,37 in fica bem perto de 6/16, ou 3/8.',
    },
    es: {
      metaTitle: 'Centímetros a Pulgadas — Convertir cm a in',
      metaDescription:
        'Convierte centímetros a pulgadas gratis. 1 cm = 0,393701 pulgadas. Conversor instantáneo, fórmula exacta, ejemplos resueltos y tabla completa.',
      h1: 'Centímetros a Pulgadas',
      intro:
        'Un centímetro equivale a 0,393701 pulgadas. La relación es exacta en el sentido inverso — la pulgada se define como 2,54 cm precisos —, así que convertir centímetros a pulgadas consiste en dividir entre 2,54.',
      fromLabel: 'Centímetros (cm)',
      toLabel: 'Pulgadas (in)',
      about:
        'El centímetro es la unidad métrica a la que recurrimos cuando el metro es demasiado grande y el milímetro demasiado fino: medidas del cuerpo, ropa, muebles, equipaje. Es la centésima parte del metro, y el metro se define desde 1983 por la distancia que recorre la luz en el vacío en 1/299.792.458 de segundo. La pulgada es lo que necesitas cuando el destino es estadounidense: listados de tiendas de EE. UU., patrones de costura publicados allí, especificaciones de ferretería y cualquier aerolínea o paquetería que publique límites de tamaño en unidades imperiales. Convertir a pulgadas suele implicar convertir también a fracciones, porque la medida estadounidense usa medios, cuartos, octavos y dieciseisavos en vez de decimales.',
      formula: 'pulg = cm ÷ 2,54',
      formulaNote:
        'Divide los centímetros entre 2,54 o, lo que es igual, multiplica por 0,393701. Una maleta de mano estándar de 55 × 40 × 20 cm mide 21,65 × 15,75 × 7,87 pulgadas. Una regla de 30 cm mide 11,81 pulgadas, algo menos que el pie completo con el que suele venderse. Quien mide 180 cm tiene 70,87 pulgadas, es decir, 5 pies y 10,87 pulgadas.',
      scenarios: [
        {
          title: 'Revisar límites de equipaje de mano',
          text: 'Las aerolíneas latinoamericanas y europeas publican el límite de cabina en centímetros; las estadounidenses, en pulgadas. Convertir tu maleta de 55 × 40 × 20 cm a 21,65 × 15,75 × 7,87 in te dice al instante si pasa por un medidor de 22 × 14 × 9 in.',
        },
        {
          title: 'Comprar ropa en una tienda de EE. UU.',
          text: 'Las tablas de tallas estadounidenses dan pecho, cintura y entrepierna en pulgadas. Una cintura de 81 cm son 31,89 pulgadas, así que elegirías una 32 y no la 30 que sugeriría un redondeo apresurado.',
        },
        {
          title: 'Seguir un patrón o plano estadounidense',
          text: 'Los patrones de costura, planos de carpintería y volúmenes de impresión 3D publicados en EE. UU. usan pulgadas. Convertir tu material métrico a pulgadas antes de empezar evita un error acumulado que solo aparece en el ensamblaje final.',
        },
      ],
      proTip:
        'Para estimar mentalmente, divide entre 2,5 y resta alrededor de 1,5%. Cien centímetros dan casi 40, y el valor real es 39,37 pulgadas. Si necesitas la respuesta en fracción estadounidense, multiplica la parte decimal por 16 para obtener dieciseisavos: 0,37 in queda muy cerca de 6/16, o 3/8.',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  'miles-to-kilometers': {
    en: {
      metaTitle: 'Miles to Kilometers — Convert mi to km Instantly',
      metaDescription:
        'Convert miles to kilometers free. 1 mile = 1.609344 km exactly. Instant converter, formula, running and driving examples, full mi-to-km table.',
      h1: 'Miles to Kilometers',
      intro:
        'One mile is exactly 1.609344 kilometers. The factor has been fixed since 1959, when the international mile was defined as 1,760 yards of exactly 0.9144 meters each.',
      fromLabel: 'Miles (mi)',
      toLabel: 'Kilometers (km)',
      about:
        'The statute mile is the road-distance unit of the United States and the United Kingdom, and it is the reason American and British road signs, car odometers and weather reports disagree with almost everyone else. It descends from the Roman mille passus, a thousand paces, later fixed at 1,760 yards by an Act of Parliament in 1593. The kilometer is a thousand meters and is the road unit of the rest of the world. Note that the nautical mile is a different unit entirely — 1,852 meters, defined as one minute of latitude — and is used in aviation and shipping, so a speed in knots does not convert with this factor.',
      formula: 'km = mi × 1.609344',
      formulaNote:
        'Multiply miles by 1.609344. A 5-mile run is 8.05 km. The US interstate speed limit of 70 mph corresponds to 112.7 km/h. A marathon is defined in metric as 42.195 km, which works out to 26.219 miles — the famous "26.2" is a rounded figure, not the definition. To reverse the conversion, divide by 1.609344 instead.',
      scenarios: [
        {
          title: 'Planning a road trip in the US',
          text: 'American road signs and rental car odometers read in miles. A 300-mile day is 482.8 km, which lets you judge fuel stops and driving hours against the distances you are used to at home.',
        },
        {
          title: 'Comparing running distances',
          text: 'US race listings use miles while training plans and track sessions are usually metric. A 10-mile race is 16.09 km, which sits between the 10K and the half marathon and needs pacing planned accordingly.',
        },
        {
          title: 'Reading a car or flight specification',
          text: 'Range figures for American cars and light aircraft are published in miles or statute miles. An electric car rated at 250 miles of range covers 402.3 km, which is the number to compare against a European rating measured on the WLTP cycle.',
        },
      ],
      proTip:
        'The Fibonacci sequence gives a surprisingly good mental shortcut: consecutive terms approximate the mile-to-kilometer ratio. 5 miles is about 8 km, 8 miles is about 13 km, 13 miles is about 21 km. Each is within half a percent of the true value, which is more than good enough for reading a road sign at speed.',
    },
    pt: {
      metaTitle: 'Milhas para Quilômetros — Converter mi em km',
      metaDescription:
        'Converta milhas em quilômetros grátis. 1 milha = 1,609344 km exatos. Conversor instantâneo, fórmula, exemplos de corrida e direção, tabela completa.',
      h1: 'Milhas para Quilômetros',
      intro:
        'Uma milha equivale a exatamente 1,609344 quilômetro. O fator está fixado desde 1959, quando a milha internacional foi definida como 1.760 jardas de exatos 0,9144 metro cada.',
      fromLabel: 'Milhas (mi)',
      toLabel: 'Quilômetros (km)',
      about:
        'A milha terrestre é a unidade de distância rodoviária dos Estados Unidos e do Reino Unido, e é por isso que placas, odômetros e boletins de trânsito de lá não conversam com o resto do mundo. Ela descende do mille passus romano, mil passos, depois fixado em 1.760 jardas por uma lei do Parlamento inglês em 1593. O quilômetro são mil metros e é a unidade rodoviária do restante do planeta, incluindo o Brasil. Atenção: a milha náutica é outra unidade — 1.852 metros, definida como um minuto de latitude — usada na aviação e na navegação, então velocidade em nós não se converte com este fator.',
      formula: 'km = mi × 1,609344',
      formulaNote:
        'Multiplique as milhas por 1,609344. Uma corrida de 5 milhas tem 8,05 km. O limite de 70 mph das rodovias americanas equivale a 112,7 km/h. A maratona é definida em métrico como 42,195 km, o que dá 26,219 milhas — o famoso "26.2" é um arredondamento, não a definição. Para inverter a conversão, divida por 1,609344.',
      scenarios: [
        {
          title: 'Planejar uma viagem de carro nos EUA',
          text: 'Placas e odômetros de carros alugados nos Estados Unidos marcam milhas. Um dia de 300 milhas são 482,8 km, número que permite calcular paradas de combustível e horas ao volante nas distâncias a que você está acostumado.',
        },
        {
          title: 'Comparar distâncias de corrida',
          text: 'Provas americanas são anunciadas em milhas, mas planilhas de treino e sessões de pista são métricas. Uma prova de 10 milhas tem 16,09 km, distância entre os 10K e a meia maratona, que exige um pace planejado de acordo.',
        },
        {
          title: 'Ler a ficha técnica de um carro',
          text: 'A autonomia de carros americanos é divulgada em milhas. Um elétrico com 250 milhas de alcance faz 402,3 km, que é o número a comparar com uma autonomia europeia medida no ciclo WLTP.',
        },
      ],
      proTip:
        'A sequência de Fibonacci dá um atalho mental surpreendentemente bom: termos consecutivos aproximam a razão milha/quilômetro. 5 milhas dão cerca de 8 km, 8 milhas cerca de 13 km, 13 milhas cerca de 21 km. Cada um fica a menos de meio por cento do valor real — de sobra para ler uma placa a 100 por hora.',
    },
    es: {
      metaTitle: 'Millas a Kilómetros — Convertir mi a km',
      metaDescription:
        'Convierte millas a kilómetros gratis. 1 milla = 1,609344 km exactos. Conversor instantáneo, fórmula, ejemplos de carrera y manejo, tabla completa.',
      h1: 'Millas a Kilómetros',
      intro:
        'Una milla equivale exactamente a 1,609344 kilómetros. El factor está fijado desde 1959, cuando la milla internacional se definió como 1.760 yardas de exactamente 0,9144 metros cada una.',
      fromLabel: 'Millas (mi)',
      toLabel: 'Kilómetros (km)',
      about:
        'La milla terrestre es la unidad de distancia por carretera de Estados Unidos y el Reino Unido, y por eso sus señales, odómetros y reportes de tránsito no coinciden con los del resto del mundo. Desciende del mille passus romano, mil pasos, fijado luego en 1.760 yardas por una ley del Parlamento inglés en 1593. El kilómetro son mil metros y es la unidad vial del resto del planeta, América Latina incluida. Ojo: la milla náutica es otra unidad — 1.852 metros, definida como un minuto de latitud — usada en aviación y navegación, así que la velocidad en nudos no se convierte con este factor.',
      formula: 'km = mi × 1,609344',
      formulaNote:
        'Multiplica las millas por 1,609344. Una carrera de 5 millas son 8,05 km. El límite de 70 mph de las autopistas estadounidenses equivale a 112,7 km/h. El maratón se define en métrico como 42,195 km, lo que da 26,219 millas: el famoso "26.2" es un redondeo, no la definición. Para invertir la conversión, divide entre 1,609344.',
      scenarios: [
        {
          title: 'Planear un viaje por carretera en EE. UU.',
          text: 'Las señales y los odómetros de autos rentados en Estados Unidos marcan millas. Una jornada de 300 millas son 482,8 km, cifra que te permite calcular paradas de combustible y horas al volante en las distancias a las que estás acostumbrado.',
        },
        {
          title: 'Comparar distancias de carrera',
          text: 'Las carreras estadounidenses se anuncian en millas, pero los planes de entrenamiento y las sesiones de pista son métricos. Una carrera de 10 millas son 16,09 km, una distancia entre los 10K y el medio maratón que exige planear el ritmo en consecuencia.',
        },
        {
          title: 'Leer la ficha técnica de un auto',
          text: 'La autonomía de los autos estadounidenses se publica en millas. Un eléctrico con 250 millas de alcance recorre 402,3 km, que es el número a comparar contra una autonomía europea medida en el ciclo WLTP.',
        },
      ],
      proTip:
        'La sucesión de Fibonacci ofrece un atajo mental sorprendentemente bueno: los términos consecutivos aproximan la razón milla/kilómetro. 5 millas son unos 8 km, 8 millas unos 13 km, 13 millas unos 21 km. Cada uno queda a menos de medio por ciento del valor real, más que suficiente para leer una señal en movimiento.',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  'kilometers-to-miles': {
    en: {
      metaTitle: 'Kilometers to Miles — Convert km to mi Instantly',
      metaDescription:
        'Convert kilometers to miles free. 1 km = 0.621371 miles. Instant converter, exact formula, travel and running examples, full km-to-mi table.',
      h1: 'Kilometers to Miles',
      intro:
        'One kilometer is 0.621371 miles. Since the mile is defined as exactly 1.609344 kilometers, converting the other way is a division — and the result is a repeating decimal rather than a round number.',
      fromLabel: 'Kilometers (km)',
      toLabel: 'Miles (mi)',
      about:
        'The kilometer is the road-distance unit almost everywhere: Brazil, Mexico, continental Europe, most of Asia and Africa. It is a thousand meters, and it inherits the meter\'s definition from the speed of light. The mile is what you need when your audience is American or British — race listings, road signs, car specifications, fitness apps set to imperial units. The two systems collide most often for travellers and runners, and the collision is worse than it looks because the conversion factor is close to two thirds: an unconverted number is wrong by a third, which is enough to badly misjudge a driving day or a training run.',
      formula: 'mi = km ÷ 1.609344',
      formulaNote:
        'Divide kilometers by 1.609344, or multiply by 0.621371. A 10 km race is 6.21 miles. A 100 km/h motorway limit is 62.14 mph. The 42.195 km marathon is 26.219 miles. A 5 km parkrun is 3.11 miles, which is why it is sometimes advertised in the US as a "3.1-mile" event.',
      scenarios: [
        {
          title: 'Renting a car abroad and reporting mileage',
          text: 'A rental returned in Europe or Latin America shows kilometers on the odometer, but expense policies and insurance forms from a US employer ask for miles. A 1,200 km trip is 745.6 miles.',
        },
        {
          title: 'Translating race results for a US audience',
          text: 'Metric race distances need converting when you post results to a US running community. A 21.0975 km half marathon is 13.11 miles, and pace per kilometer needs converting separately to pace per mile.',
        },
        {
          title: 'Reading foreign vehicle specifications',
          text: 'European and Japanese manufacturers publish range and service intervals in kilometers. A 15,000 km service interval is 9,320 miles, which matters when you are comparing maintenance costs against a US-market equivalent.',
        },
      ],
      proTip:
        'Multiply by 0.6 for a quick estimate that is about 3.4% low, or run Fibonacci backwards: 8 km is roughly 5 miles, 13 km roughly 8 miles, 21 km roughly 13 miles. For a closer figure without a calculator, take 60% of the kilometers and add 2% of that result.',
    },
    pt: {
      metaTitle: 'Quilômetros para Milhas — Converter km em mi',
      metaDescription:
        'Converta quilômetros em milhas grátis. 1 km = 0,621371 milha. Conversor instantâneo, fórmula exata, exemplos de viagem e corrida, tabela completa.',
      h1: 'Quilômetros para Milhas',
      intro:
        'Um quilômetro equivale a 0,621371 milha. Como a milha é definida como exatamente 1,609344 quilômetro, a conversão inversa é uma divisão — e o resultado é uma dízima, não um número redondo.',
      fromLabel: 'Quilômetros (km)',
      toLabel: 'Milhas (mi)',
      about:
        'O quilômetro é a unidade de distância rodoviária de quase todo lugar: Brasil, América Latina, Europa continental, boa parte da Ásia e da África. São mil metros, e ele herda do metro a definição baseada na velocidade da luz. A milha é o que você precisa quando o público é americano ou britânico — inscrições de provas, placas, fichas técnicas, aplicativos de corrida configurados em unidades imperiais. Os dois sistemas se chocam com mais frequência para viajantes e corredores, e o choque é pior do que parece porque o fator é próximo de dois terços: um número não convertido erra em um terço, o bastante para calcular muito mal um dia de estrada ou um treino.',
      formula: 'mi = km ÷ 1,609344',
      formulaNote:
        'Divida os quilômetros por 1,609344 ou multiplique por 0,621371. Uma prova de 10 km tem 6,21 milhas. O limite de 100 km/h de uma rodovia equivale a 62,14 mph. A maratona de 42,195 km tem 26,219 milhas. Uma corrida de 5 km tem 3,11 milhas, e é por isso que nos EUA ela às vezes é anunciada como prova de "3.1 milhas".',
      scenarios: [
        {
          title: 'Prestar contas de um carro alugado',
          text: 'Um carro devolvido no Brasil ou na Europa mostra quilômetros no odômetro, mas políticas de reembolso e formulários de seguro de empregadores americanos pedem milhas. Uma viagem de 1.200 km são 745,6 milhas.',
        },
        {
          title: 'Traduzir resultados de prova para público americano',
          text: 'Distâncias métricas precisam ser convertidas quando você publica resultados em comunidades de corrida dos EUA. A meia maratona de 21,0975 km tem 13,11 milhas, e o pace por quilômetro precisa ser convertido à parte para pace por milha.',
        },
        {
          title: 'Ler especificações de veículos importados',
          text: 'Fabricantes europeus e japoneses publicam autonomia e intervalos de revisão em quilômetros. Um intervalo de revisão de 15.000 km são 9.320 milhas, número relevante quando você compara custo de manutenção com o equivalente do mercado americano.',
        },
      ],
      proTip:
        'Multiplique por 0,6 para uma estimativa cerca de 3,4% baixa, ou percorra Fibonacci ao contrário: 8 km dão mais ou menos 5 milhas, 13 km cerca de 8 milhas, 21 km cerca de 13 milhas. Para chegar mais perto sem calculadora, tire 60% dos quilômetros e some 2% desse resultado.',
    },
    es: {
      metaTitle: 'Kilómetros a Millas — Convertir km a mi',
      metaDescription:
        'Convierte kilómetros a millas gratis. 1 km = 0,621371 millas. Conversor instantáneo, fórmula exacta, ejemplos de viaje y carrera, tabla completa.',
      h1: 'Kilómetros a Millas',
      intro:
        'Un kilómetro equivale a 0,621371 millas. Como la milla se define como exactamente 1,609344 kilómetros, la conversión inversa es una división, y el resultado es un decimal periódico en lugar de una cifra redonda.',
      fromLabel: 'Kilómetros (km)',
      toLabel: 'Millas (mi)',
      about:
        'El kilómetro es la unidad de distancia por carretera de casi todo el mundo: América Latina, Europa continental, buena parte de Asia y África. Son mil metros, y hereda del metro la definición basada en la velocidad de la luz. La milla es lo que necesitas cuando tu público es estadounidense o británico: inscripciones de carreras, señales, fichas técnicas, aplicaciones de running configuradas en unidades imperiales. Los dos sistemas chocan sobre todo para viajeros y corredores, y el choque es peor de lo que parece porque el factor ronda los dos tercios: una cifra sin convertir se equivoca en un tercio, suficiente para calcular pésimamente una jornada de manejo o un entrenamiento.',
      formula: 'mi = km ÷ 1,609344',
      formulaNote:
        'Divide los kilómetros entre 1,609344 o multiplica por 0,621371. Una carrera de 10 km son 6,21 millas. Un límite de 100 km/h equivale a 62,14 mph. El maratón de 42,195 km son 26,219 millas. Una carrera de 5 km son 3,11 millas, y por eso en EE. UU. a veces se anuncia como una prueba de "3.1 millas".',
      scenarios: [
        {
          title: 'Rendir cuentas de un auto rentado',
          text: 'Un auto devuelto en América Latina o Europa muestra kilómetros en el odómetro, pero las políticas de reembolso y los formularios de seguro de un empleador estadounidense piden millas. Un viaje de 1.200 km son 745,6 millas.',
        },
        {
          title: 'Traducir resultados de carrera para público estadounidense',
          text: 'Las distancias métricas hay que convertirlas al publicar resultados en comunidades de running de EE. UU. El medio maratón de 21,0975 km son 13,11 millas, y el ritmo por kilómetro debe convertirse aparte a ritmo por milla.',
        },
        {
          title: 'Leer especificaciones de vehículos importados',
          text: 'Los fabricantes europeos y japoneses publican autonomía e intervalos de servicio en kilómetros. Un intervalo de 15.000 km son 9.320 millas, dato relevante al comparar costos de mantenimiento con el equivalente del mercado estadounidense.',
        },
      ],
      proTip:
        'Multiplica por 0,6 para una estimación un 3,4% baja, o recorre Fibonacci al revés: 8 km son unas 5 millas, 13 km unas 8 millas, 21 km unas 13 millas. Para afinar sin calculadora, toma el 60% de los kilómetros y súmale un 2% de ese resultado.',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  'miles-to-feet': {
    en: {
      metaTitle: 'Miles to Feet — Convert mi to ft (1 mile = 5280 ft)',
      metaDescription:
        'Convert miles to feet free. 1 mile = 5,280 feet exactly. Instant converter, formula, running-track and aviation examples, full mi-to-ft table.',
      h1: 'Miles to Feet',
      intro:
        'One mile is exactly 5,280 feet. The odd-looking number is a historical accident: the mile was fixed at eight furlongs, and a furlong is 660 feet.',
      fromLabel: 'Miles (mi)',
      toLabel: 'Feet (ft)',
      about:
        'Both units belong to the imperial and US customary system, so this conversion is exact and involves no metric factor at all. The foot is 12 inches, or exactly 0.3048 meters since 1959. The mile is 1,760 yards, and since a yard is three feet, that is 5,280 feet. The strange figure comes from an English compromise in 1593: the Roman mile of 5,000 feet was reconciled with the farming furlong — the length of a ploughed furrow — by rounding the mile up to eight furlongs rather than redefining the furlong. Surveyors, athletics officials and aviators all still work in this system.',
      formula: 'ft = mi × 5280',
      formulaNote:
        'Multiply miles by 5,280. A quarter mile is 1,320 feet, which is why drag racing is run over that distance. Half a mile is 2,640 feet. Three miles is 15,840 feet. Because both units are imperial, the result is always exact for whole and simple fractional inputs — no rounding is involved.',
      scenarios: [
        {
          title: 'Athletics and track distances',
          text: 'A standard outdoor track lap is 400 meters, slightly short of a quarter mile (1,320 feet, or 402.34 m). The difference is why a "mile" race on a 400 m track is run over four laps plus an extra nine meters.',
        },
        {
          title: 'Aviation altitude and distance',
          text: 'Aircraft altitudes are given in feet while distances are often in statute or nautical miles. A cruising altitude of 35,000 feet is 6.63 statute miles straight up, which puts the scale of a climb in perspective.',
        },
        {
          title: 'Surveying and property frontage',
          text: 'US land descriptions still use chains, furlongs and miles. A parcel with a quarter-mile frontage has 1,320 feet of road edge, the number you need for fencing quantities or utility run costs.',
        },
      ],
      proTip:
        'Memorise 5,280 as "five tomatoes" — a schoolroom mnemonic for five-two-eight-oh. For fast fractions: an eighth of a mile is 660 feet, a quarter is 1,320, a half is 2,640. Anything expressed in furlongs converts by multiplying by 660.',
    },
    pt: {
      metaTitle: 'Milhas para Pés — Converter mi em ft (1 milha = 5280 pés)',
      metaDescription:
        'Converta milhas em pés grátis. 1 milha = 5.280 pés exatos. Conversor instantâneo, fórmula, exemplos de atletismo e aviação, tabela completa.',
      h1: 'Milhas para Pés',
      intro:
        'Uma milha equivale a exatamente 5.280 pés. O número estranho é um acidente histórico: a milha foi fixada em oito furlongs, e um furlong tem 660 pés.',
      fromLabel: 'Milhas (mi)',
      toLabel: 'Pés (ft)',
      about:
        'As duas unidades pertencem ao sistema imperial e usual americano, então esta conversão é exata e não envolve nenhum fator métrico. O pé tem 12 polegadas, ou exatos 0,3048 metro desde 1959. A milha tem 1.760 jardas e, como a jarda tem três pés, isso dá 5.280 pés. A cifra esquisita vem de um acordo inglês de 1593: a milha romana de 5.000 pés foi reconciliada com o furlong agrícola — o comprimento de um sulco de arado — arredondando a milha para oito furlongs em vez de redefinir o furlong. Agrimensores, dirigentes do atletismo e a aviação ainda trabalham nesse sistema.',
      formula: 'ft = mi × 5280',
      formulaNote:
        'Multiplique as milhas por 5.280. Um quarto de milha são 1.320 pés, e é por isso que a arrancada do drag racing é disputada nessa distância. Meia milha são 2.640 pés. Três milhas são 15.840 pés. Como as duas unidades são imperiais, o resultado é sempre exato para entradas inteiras ou frações simples — não há arredondamento envolvido.',
      scenarios: [
        {
          title: 'Atletismo e distâncias de pista',
          text: 'Uma volta de pista oficial tem 400 metros, um pouco menos que o quarto de milha (1.320 pés, ou 402,34 m). Essa diferença é o motivo de a prova da milha numa pista de 400 m ser corrida em quatro voltas mais nove metros.',
        },
        {
          title: 'Altitude e distância na aviação',
          text: 'A altitude das aeronaves é dada em pés, enquanto as distâncias vêm em milhas terrestres ou náuticas. Uma altitude de cruzeiro de 35.000 pés são 6,63 milhas terrestres na vertical, o que dá a dimensão real de uma subida.',
        },
        {
          title: 'Agrimensura e testada de terreno',
          text: 'Descrições de terras nos EUA ainda usam chains, furlongs e milhas. Um lote com um quarto de milha de testada tem 1.320 pés de frente para a via, número necessário para orçar cercamento ou extensão de rede elétrica.',
        },
      ],
      proTip:
        'Para frações rápidas: um oitavo de milha são 660 pés, um quarto são 1.320 e a metade, 2.640. Qualquer medida expressa em furlongs converte-se multiplicando por 660. E vale lembrar que a milha náutica tem 6.076 pés, não 5.280 — usar o fator errado num plano de voo é um erro clássico.',
    },
    es: {
      metaTitle: 'Millas a Pies — Convertir mi a ft (1 milla = 5280 pies)',
      metaDescription:
        'Convierte millas a pies gratis. 1 milla = 5.280 pies exactos. Conversor instantáneo, fórmula, ejemplos de atletismo y aviación, tabla completa.',
      h1: 'Millas a Pies',
      intro:
        'Una milla equivale exactamente a 5.280 pies. La cifra tan poco redonda es un accidente histórico: la milla se fijó en ocho furlongs, y un furlong mide 660 pies.',
      fromLabel: 'Millas (mi)',
      toLabel: 'Pies (ft)',
      about:
        'Ambas unidades pertenecen al sistema imperial y usual estadounidense, así que esta conversión es exacta y no interviene ningún factor métrico. El pie tiene 12 pulgadas, o exactamente 0,3048 metros desde 1959. La milla tiene 1.760 yardas y, como la yarda son tres pies, eso da 5.280 pies. La cifra extraña viene de un acuerdo inglés de 1593: la milla romana de 5.000 pies se reconcilió con el furlong agrícola — la longitud de un surco de arado — redondeando la milla a ocho furlongs en lugar de redefinir el furlong. Topógrafos, jueces de atletismo y aviadores siguen trabajando en ese sistema.',
      formula: 'ft = mi × 5280',
      formulaNote:
        'Multiplica las millas por 5.280. Un cuarto de milla son 1.320 pies, y por eso el drag racing se corre sobre esa distancia. Media milla son 2.640 pies. Tres millas son 15.840 pies. Como ambas unidades son imperiales, el resultado siempre es exacto para entradas enteras o fracciones simples: no hay redondeo de por medio.',
      scenarios: [
        {
          title: 'Atletismo y distancias de pista',
          text: 'Una vuelta de pista oficial son 400 metros, algo menos que el cuarto de milla (1.320 pies, o 402,34 m). Esa diferencia explica por qué la prueba de la milla en una pista de 400 m se corre en cuatro vueltas más nueve metros.',
        },
        {
          title: 'Altitud y distancia en aviación',
          text: 'La altitud de las aeronaves se da en pies, mientras que las distancias vienen en millas terrestres o náuticas. Una altitud de crucero de 35.000 pies son 6,63 millas terrestres en vertical, lo que da la escala real de un ascenso.',
        },
        {
          title: 'Topografía y frente de terreno',
          text: 'Las descripciones de tierras en EE. UU. aún usan chains, furlongs y millas. Un lote con un cuarto de milla de frente tiene 1.320 pies sobre la vía, el número que necesitas para cotizar cercado o tendido eléctrico.',
        },
      ],
      proTip:
        'Para fracciones rápidas: un octavo de milla son 660 pies, un cuarto son 1.320 y la mitad, 2.640. Cualquier medida en furlongs se convierte multiplicando por 660. Y conviene recordar que la milla náutica tiene 6.076 pies, no 5.280: usar el factor equivocado en un plan de vuelo es un error clásico.',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  'feet-to-inches': {
    en: {
      metaTitle: 'Feet to Inches — Convert ft to in (1 foot = 12 in)',
      metaDescription:
        'Convert feet to inches free. 1 foot = 12 inches exactly. Instant converter, formula, height and construction examples, full ft-to-in table.',
      h1: 'Feet to Inches',
      intro:
        'One foot is exactly 12 inches. Both units are imperial, so the conversion is a clean multiplication with no metric factor and no rounding.',
      fromLabel: 'Feet (ft)',
      toLabel: 'Inches (in)',
      about:
        'The foot and the inch are the working pair of the US customary system. The foot is 0.3048 meters exactly, and the inch is one twelfth of that — 2.54 cm. The duodecimal relationship is the reason imperial measurement survives in trades: twelve divides evenly by 2, 3, 4 and 6, so a carpenter can halve, third or quarter a foot and still land on a whole number of inches, which a decimal system will not do. That is also why inches are subdivided in halves, quarters, eighths and sixteenths rather than tenths. In practice most US measurements are written as feet and inches together, like 5\' 10", and converting to total inches is usually the first step in any calculation.',
      formula: 'in = ft × 12',
      formulaNote:
        'Multiply feet by 12. A 6-foot door is 72 inches. An 8-foot ceiling is 96 inches. To convert a mixed measurement like 5 feet 10 inches, multiply the feet by 12 and add the inches: 5 × 12 + 10 = 70 inches. To go back, divide by 12 — the whole part is the feet and the remainder is the inches.',
      scenarios: [
        {
          title: 'Height stated in feet and inches',
          text: 'US forms, sports rosters and dating profiles quote height as feet and inches. Converting to total inches first is what lets you compare two heights arithmetically or convert onward to centimeters by multiplying by 2.54.',
        },
        {
          title: 'Cutting lumber and sheet goods',
          text: 'US lumber is sold in foot lengths but cut lists are written in inches. An 8-foot 2×4 gives 96 inches of usable length, so four 24-inch legs use exactly one board with nothing to spare for saw kerf.',
        },
        {
          title: 'Reading room and appliance dimensions',
          text: 'Floor plans list room sizes in feet while appliance specifications are in inches. A 30-inch range needs 2.5 feet of counter gap, and checking that against a 10-foot wall means converting the wall to 120 inches first.',
        },
      ],
      proTip:
        'Keep saw kerf in mind when the arithmetic looks perfect: a 96-inch board cut into four 24-inch pieces will come up short, because each cut removes about an eighth of an inch of material. Plan three cuts at 1/8 inch and you lose 3/8 of an inch overall.',
    },
    pt: {
      metaTitle: 'Pés para Polegadas — Converter ft em in (1 pé = 12 in)',
      metaDescription:
        'Converta pés em polegadas grátis. 1 pé = 12 polegadas exatas. Conversor instantâneo, fórmula, exemplos de altura e construção, tabela completa.',
      h1: 'Pés para Polegadas',
      intro:
        'Um pé equivale a exatamente 12 polegadas. As duas unidades são imperiais, então a conversão é uma multiplicação limpa, sem fator métrico e sem arredondamento.',
      fromLabel: 'Pés (ft)',
      toLabel: 'Polegadas (in)',
      about:
        'O pé e a polegada são a dupla de trabalho do sistema usual americano. O pé tem exatos 0,3048 metro, e a polegada é um doze avos disso — 2,54 cm. A relação duodecimal explica por que a medida imperial sobrevive nos ofícios: doze é divisível por 2, 3, 4 e 6, então um carpinteiro pode dividir um pé pela metade, por três ou por quatro e ainda cair num número inteiro de polegadas, coisa que um sistema decimal não permite. É também por isso que a polegada se subdivide em meios, quartos, oitavos e dezesseis avos, e não em décimos. Na prática, medidas americanas quase sempre aparecem como pés e polegadas juntos, tipo 5\' 10", e converter para polegadas totais costuma ser o primeiro passo de qualquer cálculo.',
      formula: 'in = ft × 12',
      formulaNote:
        'Multiplique os pés por 12. Uma porta de 6 pés tem 72 polegadas. Um pé-direito de 8 pés tem 96 polegadas. Para converter uma medida mista como 5 pés e 10 polegadas, multiplique os pés por 12 e some as polegadas: 5 × 12 + 10 = 70 polegadas. Para voltar, divida por 12 — a parte inteira são os pés e o resto, as polegadas.',
      scenarios: [
        {
          title: 'Altura informada em pés e polegadas',
          text: 'Formulários americanos, escalações esportivas e perfis de aplicativos informam altura em pés e polegadas. Converter para polegadas totais primeiro é o que permite comparar duas alturas aritmeticamente ou seguir para centímetros multiplicando por 2,54.',
        },
        {
          title: 'Cortar madeira e chapas',
          text: 'A madeira americana é vendida em comprimentos de pés, mas as listas de corte vêm em polegadas. Uma peça 2×4 de 8 pés dá 96 polegadas úteis, então quatro pernas de 24 polegadas consomem exatamente uma peça, sem folga para a espessura da serra.',
        },
        {
          title: 'Ler dimensões de cômodos e eletrodomésticos',
          text: 'Plantas listam cômodos em pés, mas fichas técnicas de eletrodomésticos vêm em polegadas. Um fogão de 30 polegadas exige 2,5 pés de vão na bancada, e conferir isso contra uma parede de 10 pés passa por converter a parede para 120 polegadas.',
        },
      ],
      proTip:
        'Considere a espessura da serra quando a conta fecha perfeita demais: uma peça de 96 polegadas cortada em quatro pedaços de 24 polegadas vai faltar, porque cada corte come cerca de um oitavo de polegada. São três cortes de 1/8 de polegada, ou seja, 3/8 de polegada perdidos no total.',
    },
    es: {
      metaTitle: 'Pies a Pulgadas — Convertir ft a in (1 pie = 12 in)',
      metaDescription:
        'Convierte pies a pulgadas gratis. 1 pie = 12 pulgadas exactas. Conversor instantáneo, fórmula, ejemplos de estatura y construcción, tabla completa.',
      h1: 'Pies a Pulgadas',
      intro:
        'Un pie equivale exactamente a 12 pulgadas. Ambas unidades son imperiales, así que la conversión es una multiplicación limpia, sin factor métrico y sin redondeo.',
      fromLabel: 'Pies (ft)',
      toLabel: 'Pulgadas (in)',
      about:
        'El pie y la pulgada son la pareja de trabajo del sistema usual estadounidense. El pie mide exactamente 0,3048 metros, y la pulgada es una doceava parte de eso: 2,54 cm. La relación duodecimal explica por qué la medida imperial sobrevive en los oficios: doce se divide exacto entre 2, 3, 4 y 6, así que un carpintero puede partir un pie por la mitad, en tercios o en cuartos y seguir cayendo en un número entero de pulgadas, algo que un sistema decimal no permite. Por eso mismo la pulgada se subdivide en medios, cuartos, octavos y dieciseisavos, y no en décimos. En la práctica, las medidas estadounidenses se escriben como pies y pulgadas juntos, tipo 5\' 10", y convertir a pulgadas totales suele ser el primer paso de cualquier cálculo.',
      formula: 'in = ft × 12',
      formulaNote:
        'Multiplica los pies por 12. Una puerta de 6 pies mide 72 pulgadas. Un techo de 8 pies son 96 pulgadas. Para convertir una medida mixta como 5 pies y 10 pulgadas, multiplica los pies por 12 y suma las pulgadas: 5 × 12 + 10 = 70 pulgadas. Para volver, divide entre 12: la parte entera son los pies y el resto, las pulgadas.',
      scenarios: [
        {
          title: 'Estatura expresada en pies y pulgadas',
          text: 'Los formularios estadounidenses, las alineaciones deportivas y los perfiles de apps indican la estatura en pies y pulgadas. Convertir primero a pulgadas totales es lo que permite comparar dos estaturas aritméticamente o seguir a centímetros multiplicando por 2,54.',
        },
        {
          title: 'Cortar madera y tableros',
          text: 'La madera estadounidense se vende por longitudes en pies, pero las listas de corte vienen en pulgadas. Un 2×4 de 8 pies da 96 pulgadas útiles, así que cuatro patas de 24 pulgadas consumen exactamente una pieza, sin margen para el grosor de la sierra.',
        },
        {
          title: 'Leer dimensiones de cuartos y electrodomésticos',
          text: 'Los planos listan los cuartos en pies, pero las fichas de electrodomésticos vienen en pulgadas. Una estufa de 30 pulgadas necesita 2,5 pies de hueco en la barra, y comprobarlo contra un muro de 10 pies pasa por convertir el muro a 120 pulgadas.',
        },
      ],
      proTip:
        'Toma en cuenta el grosor de la sierra cuando la cuenta cierra demasiado perfecta: una pieza de 96 pulgadas cortada en cuatro trozos de 24 pulgadas quedará corta, porque cada corte se come cerca de un octavo de pulgada. Son tres cortes de 1/8 de pulgada, es decir, 3/8 de pulgada perdidos en total.',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  'mph-to-meters-per-second': {
    en: {
      metaTitle: 'MPH to m/s — Convert Miles per Hour to Meters per Second',
      metaDescription:
        'Convert mph to meters per second free. 1 mph = 0.44704 m/s exactly. Instant converter, formula derivation, physics examples and a full table.',
      h1: 'MPH to Meters per Second',
      intro:
        'One mile per hour is exactly 0.44704 meters per second. The factor falls out of two exact definitions: a mile is 1,609.344 meters and an hour is 3,600 seconds.',
      fromLabel: 'Miles per hour (mph)',
      toLabel: 'Meters per second (m/s)',
      about:
        'Miles per hour is the speed unit of US and UK road traffic, American weather reporting and most consumer-facing sports coverage in those countries. Meters per second is the SI coherent unit of speed and the one every physics equation expects: kinetic energy, momentum, drag and projectile motion all break if you feed them mph. Scientific and engineering work — wind tunnel data, ballistics, biomechanics, meteorological models — is done in m/s and only converted to mph for publication. That mismatch is exactly where the conversion is needed: taking a number from a news report or a speed limit sign and putting it into a calculation.',
      formula: 'm/s = mph × 0.44704',
      formulaNote:
        'The factor is 1,609.344 ÷ 3,600 = 0.44704, exactly. A 30 mph urban limit is 13.41 m/s. A 60 mph highway speed is 26.82 m/s. A 100 mph fastball travels at 44.7 m/s. Hurricane-force wind starts at 74 mph, which is 33.08 m/s — just above the 32.7 m/s threshold that defines force 12 on the Beaufort scale.',
      scenarios: [
        {
          title: 'Physics and engineering homework',
          text: 'Kinetic energy is ½mv² with v in m/s. A 1,500 kg car at 60 mph carries ½ × 1500 × 26.82² ≈ 539 kJ. Using 60 directly instead of 26.82 overstates the energy by a factor of five.',
        },
        {
          title: 'Reading wind speed data',
          text: 'US forecasts give wind in mph while meteorological models and engineering wind loads use m/s. A 45 mph gust is 20.1 m/s, the number a structural load table will be indexed on.',
        },
        {
          title: 'Sports performance analysis',
          text: 'Baseball pitch speeds, tennis serves and sprint splits are broadcast in mph but analysed in m/s. A 10-second 100 m sprint averages 10 m/s, or 22.37 mph, which puts televised pitch speeds in useful perspective.',
        },
      ],
      proTip:
        'For a quick estimate, divide mph by 2 and subtract about 10%. Sixty mph halves to 30, minus 10% gives 27, and the true figure is 26.82 m/s. If you also need km/h, remember that m/s to km/h is a clean multiplication by 3.6.',
    },
    pt: {
      metaTitle: 'MPH para m/s — Milhas por Hora em Metros por Segundo',
      metaDescription:
        'Converta mph em metros por segundo grátis. 1 mph = 0,44704 m/s exatos. Conversor instantâneo, dedução da fórmula, exemplos de física e tabela.',
      h1: 'MPH para Metros por Segundo',
      intro:
        'Uma milha por hora equivale a exatamente 0,44704 metro por segundo. O fator sai de duas definições exatas: a milha tem 1.609,344 metros e a hora tem 3.600 segundos.',
      fromLabel: 'Milhas por hora (mph)',
      toLabel: 'Metros por segundo (m/s)',
      about:
        'Milha por hora é a unidade de velocidade do trânsito nos EUA e no Reino Unido, da meteorologia americana e da maior parte da cobertura esportiva daqueles países. Metro por segundo é a unidade coerente do SI e a que toda equação de física espera: energia cinética, quantidade de movimento, arrasto e movimento de projéteis quebram se você alimentá-las com mph. Trabalho científico e de engenharia — dados de túnel de vento, balística, biomecânica, modelos meteorológicos — é feito em m/s e só convertido para mph na hora de publicar. É exatamente aí que a conversão é necessária: pegar um número de uma reportagem ou de uma placa e colocá-lo num cálculo.',
      formula: 'm/s = mph × 0,44704',
      formulaNote:
        'O fator é 1.609,344 ÷ 3.600 = 0,44704, exato. Um limite urbano de 30 mph equivale a 13,41 m/s. Uma velocidade de 60 mph em rodovia dá 26,82 m/s. Uma bola de beisebol a 100 mph viaja a 44,7 m/s. O vento de força de furacão começa em 74 mph, ou 33,08 m/s — logo acima do limiar de 32,7 m/s que define a força 12 na escala Beaufort.',
      scenarios: [
        {
          title: 'Exercícios de física e engenharia',
          text: 'A energia cinética é ½mv², com v em m/s. Um carro de 1.500 kg a 60 mph carrega ½ × 1500 × 26,82² ≈ 539 kJ. Usar 60 direto no lugar de 26,82 superestima a energia em cinco vezes.',
        },
        {
          title: 'Ler dados de velocidade do vento',
          text: 'Previsões americanas dão vento em mph, enquanto modelos meteorológicos e cálculos de carga de vento usam m/s. Uma rajada de 45 mph são 20,1 m/s, que é o número pelo qual uma tabela de carga estrutural está indexada.',
        },
        {
          title: 'Análise de desempenho esportivo',
          text: 'Velocidade de arremesso no beisebol, saques no tênis e parciais de velocistas são transmitidos em mph, mas analisados em m/s. Um 100 m em 10 segundos dá média de 10 m/s, ou 22,37 mph, o que coloca as velocidades televisionadas em perspectiva útil.',
        },
      ],
      proTip:
        'Para estimar rápido, divida as mph por 2 e tire uns 10%. Sessenta mph viram 30, menos 10% dá 27, e o valor verdadeiro é 26,82 m/s. Se você também precisa de km/h, lembre que m/s para km/h é uma multiplicação limpa por 3,6.',
    },
    es: {
      metaTitle: 'MPH a m/s — Convertir Millas por Hora a Metros por Segundo',
      metaDescription:
        'Convierte mph a metros por segundo gratis. 1 mph = 0,44704 m/s exactos. Conversor instantáneo, deducción de la fórmula, ejemplos de física y tabla.',
      h1: 'MPH a Metros por Segundo',
      intro:
        'Una milla por hora equivale exactamente a 0,44704 metros por segundo. El factor sale de dos definiciones exactas: la milla tiene 1.609,344 metros y la hora tiene 3.600 segundos.',
      fromLabel: 'Millas por hora (mph)',
      toLabel: 'Metros por segundo (m/s)',
      about:
        'La milla por hora es la unidad de velocidad del tránsito en EE. UU. y el Reino Unido, de la meteorología estadounidense y de casi toda la cobertura deportiva de esos países. El metro por segundo es la unidad coherente del SI y la que espera toda ecuación de física: energía cinética, cantidad de movimiento, arrastre y movimiento de proyectiles fallan si les das mph. El trabajo científico y de ingeniería — datos de túnel de viento, balística, biomecánica, modelos meteorológicos — se hace en m/s y solo se convierte a mph para publicar. Ahí es justamente donde hace falta la conversión: tomar un número de una nota periodística o de una señal y meterlo en un cálculo.',
      formula: 'm/s = mph × 0,44704',
      formulaNote:
        'El factor es 1.609,344 ÷ 3.600 = 0,44704, exacto. Un límite urbano de 30 mph equivale a 13,41 m/s. Una velocidad de 60 mph en autopista da 26,82 m/s. Una bola de béisbol a 100 mph viaja a 44,7 m/s. El viento de fuerza huracán empieza en 74 mph, o 33,08 m/s, apenas por encima del umbral de 32,7 m/s que define la fuerza 12 en la escala Beaufort.',
      scenarios: [
        {
          title: 'Ejercicios de física e ingeniería',
          text: 'La energía cinética es ½mv², con v en m/s. Un auto de 1.500 kg a 60 mph acumula ½ × 1500 × 26,82² ≈ 539 kJ. Usar 60 directo en lugar de 26,82 sobreestima la energía cinco veces.',
        },
        {
          title: 'Leer datos de velocidad del viento',
          text: 'Los pronósticos estadounidenses dan el viento en mph, mientras que los modelos meteorológicos y los cálculos de carga de viento usan m/s. Una ráfaga de 45 mph son 20,1 m/s, que es el número por el que está indexada una tabla de carga estructural.',
        },
        {
          title: 'Análisis de rendimiento deportivo',
          text: 'La velocidad de lanzamiento en béisbol, los saques de tenis y los parciales de velocistas se transmiten en mph pero se analizan en m/s. Un 100 m en 10 segundos promedia 10 m/s, o 22,37 mph, lo que pone en perspectiva las cifras televisadas.',
        },
      ],
      proTip:
        'Para estimar rápido, divide las mph entre 2 y resta un 10%. Sesenta mph dan 30, menos 10% queda en 27, y el valor real es 26,82 m/s. Si además necesitas km/h, recuerda que de m/s a km/h es una multiplicación limpia por 3,6.',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  'minutes-to-seconds': {
    en: {
      metaTitle: 'Minutes to Seconds — Convert min to s Instantly',
      metaDescription:
        'Convert minutes to seconds free. 1 minute = 60 seconds. Instant converter, formula, video-editing and sports examples, full min-to-s table.',
      h1: 'Minutes to Seconds',
      intro:
        'One minute is 60 seconds. The relationship is exact and fixed by definition — unlike most unit conversions, this one has never been revised.',
      fromLabel: 'Minutes (min)',
      toLabel: 'Seconds (s)',
      about:
        'The second is the SI base unit of time, defined since 1967 by 9,192,631,770 periods of the radiation from a caesium-133 atom. The minute is not an SI unit at all — it is one of a handful of non-SI units accepted for use with SI, retained because sexagesimal timekeeping has been in continuous use since Babylonian astronomy. Sixty was chosen because it divides evenly by 2, 3, 4, 5, 6, 10, 12, 15, 20 and 30, which makes thirds and quarters of an hour whole numbers. Every computer timestamp, video timecode, audio sample rate and race timing system works in seconds internally, so converting minutes to seconds is usually the step before any real calculation.',
      formula: 's = min × 60',
      formulaNote:
        'Multiply minutes by 60. A three-minute song is 180 seconds. A 45-minute football half is 2,700 seconds. A 90-minute film is 5,400 seconds. For a mixed time like 4 minutes 32 seconds, multiply the minutes and add the remainder: 4 × 60 + 32 = 272 seconds. To reverse it, divide by 60 and keep the remainder as seconds.',
      scenarios: [
        {
          title: 'Video and audio editing',
          text: 'Timeline positions, transition lengths and export settings are frequently entered in seconds or frames. A 2-minute 30-second cut is 150 seconds, which at 24 frames per second is 3,600 frames.',
        },
        {
          title: 'Setting timeouts in code',
          text: 'JavaScript timers, HTTP timeouts and cache TTLs take seconds or milliseconds, never minutes. A 15-minute session timeout is 900 seconds, or 900,000 milliseconds for setTimeout.',
        },
        {
          title: 'Race pacing and split times',
          text: 'Running pace is quoted per kilometer or mile in minutes and seconds, but calculating a finish time means working in total seconds. A 5:30 per km pace is 330 seconds, so a 10 km race projects to 3,300 seconds, or 55 minutes.',
        },
      ],
      proTip:
        'Watch out for the leap second: 22 of them have been inserted into UTC since 1972 to keep atomic time aligned with the Earth\'s rotation, which means a handful of real minutes have actually contained 61 seconds. It never affects everyday arithmetic, but it does break naive assumptions in timestamp code.',
    },
    pt: {
      metaTitle: 'Minutos para Segundos — Converter min em s',
      metaDescription:
        'Converta minutos em segundos grátis. 1 minuto = 60 segundos. Conversor instantâneo, fórmula, exemplos de edição de vídeo e esporte, tabela completa.',
      h1: 'Minutos para Segundos',
      intro:
        'Um minuto tem 60 segundos. A relação é exata e fixada por definição — ao contrário da maioria das conversões de unidade, esta nunca foi revisada.',
      fromLabel: 'Minutos (min)',
      toLabel: 'Segundos (s)',
      about:
        'O segundo é a unidade base de tempo do SI, definida desde 1967 por 9.192.631.770 períodos da radiação de um átomo de césio-133. O minuto não é uma unidade do SI: é uma das poucas unidades não pertencentes ao SI aceitas para uso com ele, mantida porque a contagem sexagesimal do tempo está em uso contínuo desde a astronomia babilônica. O sessenta foi escolhido por ser divisível por 2, 3, 4, 5, 6, 10, 12, 15, 20 e 30, o que torna terços e quartos de hora números inteiros. Todo timestamp de computador, timecode de vídeo, taxa de amostragem de áudio e sistema de cronometragem trabalha internamente em segundos, então converter minutos em segundos costuma ser o passo anterior a qualquer cálculo de verdade.',
      formula: 's = min × 60',
      formulaNote:
        'Multiplique os minutos por 60. Uma música de três minutos tem 180 segundos. Um tempo de futebol de 45 minutos tem 2.700 segundos. Um filme de 90 minutos tem 5.400 segundos. Para um tempo misto como 4 minutos e 32 segundos, multiplique os minutos e some o resto: 4 × 60 + 32 = 272 segundos. Para inverter, divida por 60 e guarde o resto como segundos.',
      scenarios: [
        {
          title: 'Edição de vídeo e áudio',
          text: 'Posições na timeline, durações de transição e ajustes de exportação costumam ser informados em segundos ou quadros. Um corte de 2 minutos e 30 segundos tem 150 segundos, o que a 24 quadros por segundo dá 3.600 quadros.',
        },
        {
          title: 'Definir timeouts em código',
          text: 'Temporizadores de JavaScript, timeouts de HTTP e TTLs de cache aceitam segundos ou milissegundos, nunca minutos. Um timeout de sessão de 15 minutos são 900 segundos, ou 900.000 milissegundos para o setTimeout.',
        },
        {
          title: 'Pace de corrida e parciais',
          text: 'O pace de corrida é informado por quilômetro em minutos e segundos, mas calcular o tempo final exige trabalhar em segundos totais. Um pace de 5:30 por km são 330 segundos, então uma prova de 10 km projeta 3.300 segundos, ou 55 minutos.',
        },
      ],
      proTip:
        'Atenção ao segundo bissexto: 22 deles foram inseridos no UTC desde 1972 para manter o tempo atômico alinhado à rotação da Terra, o que significa que alguns minutos reais chegaram a ter 61 segundos. Isso nunca afeta a conta do dia a dia, mas quebra suposições ingênuas em código que lida com timestamps.',
    },
    es: {
      metaTitle: 'Minutos a Segundos — Convertir min a s',
      metaDescription:
        'Convierte minutos a segundos gratis. 1 minuto = 60 segundos. Conversor instantáneo, fórmula, ejemplos de edición de video y deporte, tabla completa.',
      h1: 'Minutos a Segundos',
      intro:
        'Un minuto tiene 60 segundos. La relación es exacta y fijada por definición: a diferencia de casi todas las conversiones de unidades, esta nunca se ha revisado.',
      fromLabel: 'Minutos (min)',
      toLabel: 'Segundos (s)',
      about:
        'El segundo es la unidad base de tiempo del SI, definida desde 1967 por 9.192.631.770 períodos de la radiación de un átomo de cesio-133. El minuto no es una unidad del SI: es una de las pocas unidades ajenas al SI aceptadas para su uso, conservada porque la cuenta sexagesimal del tiempo se usa sin interrupción desde la astronomía babilónica. El sesenta se eligió por ser divisible entre 2, 3, 4, 5, 6, 10, 12, 15, 20 y 30, lo que convierte los tercios y cuartos de hora en números enteros. Todo timestamp de computadora, timecode de video, frecuencia de muestreo de audio y sistema de cronometraje trabaja internamente en segundos, así que convertir minutos a segundos suele ser el paso previo a cualquier cálculo real.',
      formula: 's = min × 60',
      formulaNote:
        'Multiplica los minutos por 60. Una canción de tres minutos son 180 segundos. Un tiempo de fútbol de 45 minutos son 2.700 segundos. Una película de 90 minutos son 5.400 segundos. Para un tiempo mixto como 4 minutos y 32 segundos, multiplica los minutos y suma el resto: 4 × 60 + 32 = 272 segundos. Para invertirlo, divide entre 60 y conserva el resto como segundos.',
      scenarios: [
        {
          title: 'Edición de video y audio',
          text: 'Las posiciones en la línea de tiempo, las duraciones de transición y los ajustes de exportación suelen indicarse en segundos o cuadros. Un corte de 2 minutos y 30 segundos son 150 segundos, que a 24 cuadros por segundo dan 3.600 cuadros.',
        },
        {
          title: 'Definir timeouts en código',
          text: 'Los temporizadores de JavaScript, los timeouts de HTTP y los TTL de caché aceptan segundos o milisegundos, nunca minutos. Un timeout de sesión de 15 minutos son 900 segundos, o 900.000 milisegundos para setTimeout.',
        },
        {
          title: 'Ritmo de carrera y parciales',
          text: 'El ritmo de carrera se indica por kilómetro en minutos y segundos, pero calcular el tiempo final exige trabajar en segundos totales. Un ritmo de 5:30 por km son 330 segundos, así que una carrera de 10 km proyecta 3.300 segundos, o 55 minutos.',
        },
      ],
      proTip:
        'Cuidado con el segundo intercalar: se han insertado 22 en el UTC desde 1972 para mantener el tiempo atómico alineado con la rotación terrestre, lo que significa que unos pocos minutos reales han tenido 61 segundos. Nunca afecta la aritmética cotidiana, pero rompe suposiciones ingenuas en código que maneja timestamps.',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  'years-to-days': {
    en: {
      metaTitle: 'Years to Days — Convert Years to Days (1 year = 365.25)',
      metaDescription:
        'Convert years to days free. 1 year = 365.25 days, averaging the leap year. Instant converter, formula, worked examples and a full years-to-days table.',
      h1: 'Years to Days',
      intro:
        'This converter uses 365.25 days per year — the Julian year, which averages in one leap day every four years. It is the figure to use whenever you need a multi-year span rather than a specific calendar range.',
      fromLabel: 'Years',
      toLabel: 'Days',
      about:
        'There is no single correct number of days in a year, which is why this conversion needs a stated convention. A common year has 365 days and a leap year has 366. The Gregorian calendar averages 365.2425 days by skipping the leap day in century years not divisible by 400 — which is why 1900 was not a leap year but 2000 was. The Julian year of exactly 365.25 days is the convention used here and in astronomy, where it defines the light-year. The tropical year, the actual time between spring equinoxes, is about 365.2422 days. Over a single lifetime the difference between 365.25 and 365.2425 amounts to under a day, so the Julian value is fine for anything short of long-range calendar work.',
      formula: 'days = years × 365.25',
      formulaNote:
        'Multiply years by 365.25. One year is 365.25 days, five years is 1,826.25 days, and ten years is 3,652.5 days. For an exact count between two specific dates, count the calendar days instead — four years starting in 2024 contains one leap day and so has 1,461 days, while four years starting in 2025 has 1,461 days too but distributed differently.',
      scenarios: [
        {
          title: 'Interest and financial projections',
          text: 'Daily-accrual products need a day count. A 3-year deposit is 1,095.75 days on this convention, though banks commonly use fixed day-count conventions such as 360 or 365 days regardless of leap years, so check the contract.',
        },
        {
          title: 'Age and milestone calculations',
          text: 'Someone turning 30 has lived roughly 10,957 days. The approximation is good to a day or two either way depending on how many leap years fell inside their lifetime and where their birthday sits in the year.',
        },
        {
          title: 'Project and warranty durations',
          text: 'A 2-year warranty is about 730.5 days, and a 5-year support window about 1,826 days. When the end date has legal consequences, count actual calendar dates rather than adding a day total.',
        },
      ],
      proTip:
        'For a rough head count, multiply years by 365 and add a quarter of the years for the leap days: 8 years gives 2,920 plus 2, which is 2,922 days — exactly what 8 × 365.25 produces. If you need a precise date rather than a span, use a date calculator, because month lengths and leap-day placement matter.',
    },
    pt: {
      metaTitle: 'Anos para Dias — Converter Anos em Dias (1 ano = 365,25)',
      metaDescription:
        'Converta anos em dias grátis. 1 ano = 365,25 dias, média com o ano bissexto. Conversor instantâneo, fórmula, exemplos resolvidos e tabela completa.',
      h1: 'Anos para Dias',
      intro:
        'Este conversor usa 365,25 dias por ano — o ano juliano, que distribui na média um dia bissexto a cada quatro anos. É o valor a usar quando você precisa de um intervalo de vários anos, e não de um período de calendário específico.',
      fromLabel: 'Anos',
      toLabel: 'Dias',
      about:
        'Não existe um único número correto de dias no ano, e é por isso que esta conversão exige uma convenção declarada. Um ano comum tem 365 dias e um bissexto, 366. O calendário gregoriano tem média de 365,2425 dias porque pula o dia bissexto nos anos de século não divisíveis por 400 — motivo pelo qual 1900 não foi bissexto, mas 2000 foi. O ano juliano de exatos 365,25 dias é a convenção usada aqui e na astronomia, onde define o ano-luz. O ano trópico, o tempo real entre dois equinócios de primavera, tem cerca de 365,2422 dias. Ao longo de uma vida inteira, a diferença entre 365,25 e 365,2425 não chega a um dia, então o valor juliano serve para tudo que não seja calendário de longo prazo.',
      formula: 'dias = anos × 365,25',
      formulaNote:
        'Multiplique os anos por 365,25. Um ano são 365,25 dias, cinco anos são 1.826,25 dias e dez anos, 3.652,5 dias. Para uma contagem exata entre duas datas específicas, conte os dias de calendário: quatro anos a partir de 2024 contêm um dia bissexto e somam 1.461 dias, distribuídos de forma diferente de quatro anos a partir de 2025.',
      scenarios: [
        {
          title: 'Juros e projeções financeiras',
          text: 'Produtos com rendimento diário precisam de uma contagem de dias. Um CDB de 3 anos são 1.095,75 dias nesta convenção, embora bancos costumem usar convenções fixas de 360 ou 365 dias independentemente de anos bissextos — confira o contrato.',
        },
        {
          title: 'Cálculos de idade e marcos',
          text: 'Quem completa 30 anos viveu por volta de 10.957 dias. A aproximação erra um ou dois dias para mais ou para menos, dependendo de quantos anos bissextos caíram nesse período e de onde o aniversário fica no calendário.',
        },
        {
          title: 'Prazos de projeto e garantia',
          text: 'Uma garantia de 2 anos são cerca de 730,5 dias, e uma janela de suporte de 5 anos, cerca de 1.826 dias. Quando a data final tem efeito jurídico, conte datas reais de calendário em vez de somar um total de dias.',
        },
      ],
      proTip:
        'Para uma conta de cabeça, multiplique os anos por 365 e some um quarto dos anos pelos dias bissextos: 8 anos dão 2.920 mais 2, ou seja, 2.922 dias — exatamente o que 8 × 365,25 produz. Se você precisa de uma data e não de um intervalo, use uma calculadora de datas, porque o tamanho dos meses e a posição do dia bissexto importam.',
    },
    es: {
      metaTitle: 'Años a Días — Convertir Años en Días (1 año = 365,25)',
      metaDescription:
        'Convierte años a días gratis. 1 año = 365,25 días, promediando el año bisiesto. Conversor instantáneo, fórmula, ejemplos resueltos y tabla completa.',
      h1: 'Años a Días',
      intro:
        'Este conversor usa 365,25 días por año — el año juliano, que promedia un día bisiesto cada cuatro años. Es el valor a usar cuando necesitas un lapso de varios años y no un rango de calendario concreto.',
      fromLabel: 'Años',
      toLabel: 'Días',
      about:
        'No existe un único número correcto de días en un año, y por eso esta conversión exige una convención declarada. Un año común tiene 365 días y uno bisiesto, 366. El calendario gregoriano promedia 365,2425 días porque omite el día bisiesto en los años de siglo no divisibles entre 400, razón por la cual 1900 no fue bisiesto pero 2000 sí. El año juliano de exactamente 365,25 días es la convención usada aquí y en astronomía, donde define el año luz. El año trópico, el tiempo real entre dos equinoccios de primavera, dura unos 365,2422 días. A lo largo de una vida entera, la diferencia entre 365,25 y 365,2425 no llega a un día, así que el valor juliano sirve para todo lo que no sea trabajo de calendario a largo plazo.',
      formula: 'días = años × 365,25',
      formulaNote:
        'Multiplica los años por 365,25. Un año son 365,25 días, cinco años son 1.826,25 días y diez años, 3.652,5 días. Para un conteo exacto entre dos fechas concretas, cuenta los días de calendario: cuatro años a partir de 2024 contienen un día bisiesto y suman 1.461 días, repartidos de forma distinta que cuatro años a partir de 2025.',
      scenarios: [
        {
          title: 'Intereses y proyecciones financieras',
          text: 'Los productos con rendimiento diario necesitan un conteo de días. Un depósito a 3 años son 1.095,75 días con esta convención, aunque los bancos suelen usar convenciones fijas de 360 o 365 días sin importar los bisiestos: revisa el contrato.',
        },
        {
          title: 'Cálculos de edad e hitos',
          text: 'Quien cumple 30 años ha vivido alrededor de 10.957 días. La aproximación falla por uno o dos días según cuántos años bisiestos cayeron en ese lapso y dónde queda el cumpleaños dentro del calendario.',
        },
        {
          title: 'Plazos de proyecto y garantía',
          text: 'Una garantía de 2 años son unos 730,5 días, y una ventana de soporte de 5 años, unos 1.826 días. Cuando la fecha final tiene efectos legales, cuenta fechas reales de calendario en lugar de sumar un total de días.',
        },
      ],
      proTip:
        'Para una cuenta mental, multiplica los años por 365 y suma un cuarto de los años por los días bisiestos: 8 años dan 2.920 más 2, es decir, 2.922 días, exactamente lo que produce 8 × 365,25. Si necesitas una fecha y no un lapso, usa una calculadora de fechas, porque la duración de los meses y la posición del bisiesto importan.',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  'stones-to-pounds': {
    en: {
      metaTitle: 'Stones to Pounds — Convert st to lb (1 stone = 14 lb)',
      metaDescription:
        'Convert stones to pounds free. 1 stone = 14 pounds exactly. Instant converter, formula, body-weight examples and a full stones-to-pounds table.',
      h1: 'Stones to Pounds',
      intro:
        'One stone is exactly 14 pounds. Both units are imperial, so the conversion is a clean multiplication with no rounding involved.',
      fromLabel: 'Stones (st)',
      toLabel: 'Pounds (lb)',
      about:
        'The stone is a British unit of mass used almost exclusively for body weight, and almost exclusively in the UK and Ireland. It was standardised at 14 pounds by an Act of Parliament in 1835; before that, the stone varied by trade, ranging from 8 pounds for meat to 32 pounds for hemp. The pound is the base unit of mass in the US customary system, defined since 1959 as exactly 0.45359237 kilograms, which makes a stone exactly 6.35029318 kg. British weights are conventionally written as stones and pounds together — "11 stone 4" means 11 × 14 + 4 = 158 pounds — and the pounds part never reaches 14, because 14 pounds is another stone.',
      formula: 'lb = st × 14',
      formulaNote:
        'Multiply stones by 14. Ten stone is 140 pounds. Twelve stone is 168 pounds. For a mixed weight like 11 stone 4 pounds, multiply the stones and add the loose pounds: 11 × 14 + 4 = 158 pounds. To go the other way, divide by 14 — the whole part is stones and the remainder is pounds.',
      scenarios: [
        {
          title: 'Reading a British weight in US terms',
          text: 'UK health guidance, sports reporting and everyday conversation use stones. A boxer listed at 14 stone weighs 196 pounds, which places him in the cruiserweight range on a US scorecard.',
        },
        {
          title: 'Filling in a fitness app or medical form',
          text: 'Most apps and clinical forms accept pounds or kilograms but not stones. Converting 9 stone 7 to 133 pounds — or 60.3 kg — is what gets the number into the field correctly.',
        },
        {
          title: 'Tracking weight change over time',
          text: 'A goal of losing "a stone" is 14 pounds, or about 6.35 kg. Expressed in pounds, weekly progress becomes visible: at a sustainable 1–2 pounds per week that goal is a 7 to 14 week project.',
        },
      ],
      proTip:
        'To convert stones straight to kilograms, multiply by 6.35 rather than going through pounds — 12 stone is about 76.2 kg. And when reading a British weight aloud, "11 stone 4" is 11 stones and 4 pounds, not 11.4 stones; treating it as a decimal is the single most common mistake.',
    },
    pt: {
      metaTitle: 'Stones para Libras — Converter st em lb (1 stone = 14 lb)',
      metaDescription:
        'Converta stones em libras grátis. 1 stone = 14 libras exatas. Conversor instantâneo, fórmula, exemplos de peso corporal e tabela de referência.',
      h1: 'Stones para Libras',
      intro:
        'Um stone equivale a exatamente 14 libras. As duas unidades são imperiais, então a conversão é uma multiplicação limpa, sem nenhum arredondamento.',
      fromLabel: 'Stones (st)',
      toLabel: 'Libras (lb)',
      about:
        'O stone é uma unidade britânica de massa usada quase só para peso corporal, e quase só no Reino Unido e na Irlanda. Foi padronizado em 14 libras por uma lei do Parlamento em 1835; antes disso, variava conforme o ofício, indo de 8 libras para carne a 32 libras para cânhamo. A libra é a unidade base de massa do sistema usual americano, definida desde 1959 como exatos 0,45359237 quilograma, o que faz um stone valer exatos 6,35029318 kg. Pesos britânicos são escritos como stones e libras juntos — "11 stone 4" significa 11 × 14 + 4 = 158 libras — e a parte das libras nunca chega a 14, porque 14 libras já formam outro stone.',
      formula: 'lb = st × 14',
      formulaNote:
        'Multiplique os stones por 14. Dez stones são 140 libras. Doze stones são 168 libras. Para um peso misto como 11 stones e 4 libras, multiplique os stones e some as libras soltas: 11 × 14 + 4 = 158 libras. Para o caminho inverso, divida por 14 — a parte inteira são os stones e o resto, as libras.',
      scenarios: [
        {
          title: 'Entender um peso britânico',
          text: 'Orientações de saúde, cobertura esportiva e conversa cotidiana no Reino Unido usam stones. Um boxeador anunciado com 14 stones pesa 196 libras, o que o coloca na faixa dos cruzadores numa súmula americana.',
        },
        {
          title: 'Preencher um app de treino ou ficha médica',
          text: 'A maioria dos aplicativos e fichas clínicas aceita libras ou quilos, mas não stones. Converter 9 stones e 7 libras para 133 libras — ou 60,3 kg — é o que faz o número entrar corretamente no campo.',
        },
        {
          title: 'Acompanhar variação de peso',
          text: 'A meta de perder "um stone" são 14 libras, ou cerca de 6,35 kg. Expressa em libras, a evolução semanal fica visível: a um ritmo sustentável de 0,5 a 1 kg por semana, essa meta é um projeto de 7 a 14 semanas.',
        },
      ],
      proTip:
        'Para converter stones direto em quilos, multiplique por 6,35 em vez de passar pelas libras — 12 stones dão cerca de 76,2 kg. E ao ler um peso britânico, "11 stone 4" são 11 stones e 4 libras, não 11,4 stones; tratar isso como decimal é o erro mais comum de todos.',
    },
    es: {
      metaTitle: 'Stones a Libras — Convertir st a lb (1 stone = 14 lb)',
      metaDescription:
        'Convierte stones a libras gratis. 1 stone = 14 libras exactas. Conversor instantáneo, fórmula, ejemplos de peso corporal y tabla de referencia.',
      h1: 'Stones a Libras',
      intro:
        'Un stone equivale exactamente a 14 libras. Ambas unidades son imperiales, así que la conversión es una multiplicación limpia, sin redondeo alguno.',
      fromLabel: 'Stones (st)',
      toLabel: 'Libras (lb)',
      about:
        'El stone es una unidad británica de masa usada casi solo para el peso corporal, y casi solo en el Reino Unido e Irlanda. Se estandarizó en 14 libras por una ley del Parlamento en 1835; antes variaba según el oficio, de 8 libras para la carne a 32 libras para el cáñamo. La libra es la unidad base de masa del sistema usual estadounidense, definida desde 1959 como exactamente 0,45359237 kilogramos, lo que hace que un stone valga exactamente 6,35029318 kg. Los pesos británicos se escriben como stones y libras juntos — "11 stone 4" significa 11 × 14 + 4 = 158 libras — y la parte de libras nunca llega a 14, porque 14 libras ya forman otro stone.',
      formula: 'lb = st × 14',
      formulaNote:
        'Multiplica los stones por 14. Diez stones son 140 libras. Doce stones son 168 libras. Para un peso mixto como 11 stones y 4 libras, multiplica los stones y suma las libras sueltas: 11 × 14 + 4 = 158 libras. Para el camino inverso, divide entre 14: la parte entera son los stones y el resto, las libras.',
      scenarios: [
        {
          title: 'Entender un peso británico',
          text: 'Las guías de salud, la cobertura deportiva y la conversación cotidiana en el Reino Unido usan stones. Un boxeador anunciado con 14 stones pesa 196 libras, lo que lo ubica en el rango crucero en una tarjeta estadounidense.',
        },
        {
          title: 'Llenar una app de ejercicio o ficha médica',
          text: 'La mayoría de las aplicaciones y fichas clínicas aceptan libras o kilogramos, pero no stones. Convertir 9 stones y 7 libras a 133 libras — o 60,3 kg — es lo que hace que el número entre correctamente en el campo.',
        },
        {
          title: 'Seguir la variación de peso',
          text: 'La meta de bajar "un stone" son 14 libras, o unos 6,35 kg. Expresado en libras, el avance semanal se vuelve visible: a un ritmo sostenible de 0,5 a 1 kg por semana, esa meta es un proyecto de 7 a 14 semanas.',
        },
      ],
      proTip:
        'Para convertir stones directo a kilogramos, multiplica por 6,35 en vez de pasar por las libras: 12 stones son unos 76,2 kg. Y al leer un peso británico, "11 stone 4" son 11 stones y 4 libras, no 11,4 stones; tratarlo como decimal es el error más común de todos.',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  'psi-to-bar': {
    en: {
      metaTitle: 'PSI to Bar — Convert psi to bar for Tyre Pressure',
      metaDescription:
        'Convert PSI to bar free. 1 psi = 0.0689476 bar. Instant converter, formula, tyre pressure and espresso examples, full psi-to-bar table.',
      h1: 'PSI to Bar',
      intro:
        'One pound per square inch is 0.0689476 bar. Both are pressure units outside the SI, and both are still standard in the places you meet pressure most often: tyres, bicycle pumps, espresso machines and dive gear.',
      fromLabel: 'PSI',
      toLabel: 'Bar',
      about:
        'PSI is force in pounds divided by area in square inches, and it is the pressure unit of American engineering and of tyre placards on cars sold in the US. The bar is metric but not SI — it is defined as exactly 100,000 pascals, which is close to average atmospheric pressure at sea level (101,325 Pa, or 1.01325 bar). European car manuals, bicycle tyres and espresso machines are all specified in bar. The important distinction is gauge versus absolute pressure: a tyre gauge reading 32 psi means 32 psi above atmospheric, so the absolute pressure inside the tyre is about 46.7 psi. Nearly every practical pressure specification is a gauge reading.',
      formula: 'bar = psi × 0.0689476',
      formulaNote:
        'Multiply psi by 0.0689476, or divide by 14.5038. A typical car tyre at 32 psi is 2.21 bar. A road bike at 100 psi is 6.89 bar. An espresso machine brewing at 9 bar is running at 130.5 psi. One standard atmosphere, 14.696 psi, is 1.013 bar — which is why "1 bar" and "1 atmosphere" are used loosely as synonyms even though they differ by 1.3%.',
      scenarios: [
        {
          title: 'Setting car tyre pressure',
          text: 'A car built for the European market lists 2.2 bar on the door placard while the compressor at the service station reads psi. 2.2 bar is 31.9 psi, so the 32 psi setting on the pump is correct.',
        },
        {
          title: 'Inflating bicycle tyres',
          text: 'Tyre sidewalls often print both units but pumps rarely do. A gravel tyre rated 40–70 psi is 2.76–4.83 bar, and knowing the bar equivalent matters when the only gauge you have is a metric floor pump.',
        },
        {
          title: 'Espresso and machine specifications',
          text: 'Espresso extraction is standardised at 9 bar, and pump specifications are quoted as 15 bar. In psi those are 130.5 and 217.6, the figures you need when comparing against a US-market machine.',
        },
      ],
      proTip:
        'A useful anchor: 14.5 psi is almost exactly 1 bar, so dividing psi by 14.5 gets you within a tenth of a percent. Never mix gauge and absolute figures in the same calculation — a dive computer, a manifold gauge and a tyre gauge are all reporting gauge pressure, while a weather barometer reports absolute.',
    },
    pt: {
      metaTitle: 'PSI para Bar — Converter psi em bar para Pressão de Pneu',
      metaDescription:
        'Converta PSI em bar grátis. 1 psi = 0,0689476 bar. Conversor instantâneo, fórmula, exemplos de pressão de pneu e espresso, tabela completa.',
      h1: 'PSI para Bar',
      intro:
        'Uma libra por polegada quadrada equivale a 0,0689476 bar. As duas são unidades de pressão fora do SI e ambas continuam padrão justamente onde você mais encontra pressão: pneus, bombas de bicicleta, máquinas de espresso e equipamento de mergulho.',
      fromLabel: 'PSI',
      toLabel: 'Bar',
      about:
        'PSI é força em libras dividida por área em polegadas quadradas, e é a unidade de pressão da engenharia americana e das etiquetas de pneu dos carros vendidos nos EUA — inclusive dos calibradores da maioria dos postos brasileiros. O bar é métrico, mas não pertence ao SI: é definido como exatos 100.000 pascals, valor próximo da pressão atmosférica média ao nível do mar (101.325 Pa, ou 1,01325 bar). Manuais de carros europeus, pneus de bicicleta e máquinas de espresso são especificados em bar. A distinção importante é entre pressão manométrica e absoluta: um calibrador marcando 32 psi indica 32 psi acima da atmosférica, então a pressão absoluta dentro do pneu é de cerca de 46,7 psi. Quase toda especificação prática é uma leitura manométrica.',
      formula: 'bar = psi × 0,0689476',
      formulaNote:
        'Multiplique os psi por 0,0689476 ou divida por 14,5038. Um pneu de carro típico a 32 psi está a 2,21 bar. Uma bicicleta de estrada a 100 psi está a 6,89 bar. Uma máquina de espresso extraindo a 9 bar trabalha a 130,5 psi. Uma atmosfera padrão, 14,696 psi, equivale a 1,013 bar — motivo pelo qual "1 bar" e "1 atmosfera" são usados como sinônimos, embora difiram em 1,3%.',
      scenarios: [
        {
          title: 'Calibrar o pneu do carro',
          text: 'Um carro de mercado europeu traz 2,2 bar na etiqueta da porta, mas o calibrador do posto marca psi. 2,2 bar são 31,9 psi, então o ajuste de 32 psi na bomba está correto.',
        },
        {
          title: 'Encher pneus de bicicleta',
          text: 'A lateral do pneu costuma trazer as duas unidades, mas as bombas raramente. Um pneu de gravel indicado para 40–70 psi corresponde a 2,76–4,83 bar, e saber o equivalente em bar importa quando o único manômetro disponível é métrico.',
        },
        {
          title: 'Espresso e ficha técnica de máquinas',
          text: 'A extração de espresso é padronizada em 9 bar, e as bombas são anunciadas como de 15 bar. Em psi isso dá 130,5 e 217,6, números necessários para comparar com uma máquina do mercado americano.',
        },
      ],
      proTip:
        'Uma âncora útil: 14,5 psi equivalem quase exatamente a 1 bar, então dividir os psi por 14,5 já chega a um décimo de por cento do valor real. Nunca misture leituras manométricas e absolutas no mesmo cálculo — computador de mergulho, manifold e calibrador de pneu informam pressão manométrica; o barômetro meteorológico informa a absoluta.',
    },
    es: {
      metaTitle: 'PSI a Bar — Convertir psi a bar para Presión de Llantas',
      metaDescription:
        'Convierte PSI a bar gratis. 1 psi = 0,0689476 bar. Conversor instantáneo, fórmula, ejemplos de presión de llantas y espresso, tabla completa.',
      h1: 'PSI a Bar',
      intro:
        'Una libra por pulgada cuadrada equivale a 0,0689476 bar. Ambas son unidades de presión ajenas al SI y ambas siguen siendo estándar justo donde más te topas con la presión: llantas, bombas de bicicleta, máquinas de espresso y equipo de buceo.',
      fromLabel: 'PSI',
      toLabel: 'Bar',
      about:
        'El PSI es fuerza en libras dividida entre área en pulgadas cuadradas, y es la unidad de presión de la ingeniería estadounidense y de las etiquetas de llantas de los autos vendidos en EE. UU., incluidos los medidores de casi todas las gasolineras de América Latina. El bar es métrico pero no pertenece al SI: se define como exactamente 100.000 pascales, cifra cercana a la presión atmosférica media al nivel del mar (101.325 Pa, o 1,01325 bar). Los manuales de autos europeos, las llantas de bicicleta y las máquinas de espresso se especifican en bar. La distinción clave es entre presión manométrica y absoluta: un medidor que marca 32 psi indica 32 psi por encima de la atmosférica, así que la presión absoluta dentro de la llanta ronda los 46,7 psi. Casi toda especificación práctica es una lectura manométrica.',
      formula: 'bar = psi × 0,0689476',
      formulaNote:
        'Multiplica los psi por 0,0689476 o divide entre 14,5038. Una llanta de auto típica a 32 psi está a 2,21 bar. Una bicicleta de ruta a 100 psi está a 6,89 bar. Una máquina de espresso extrayendo a 9 bar trabaja a 130,5 psi. Una atmósfera estándar, 14,696 psi, equivale a 1,013 bar, razón por la cual "1 bar" y "1 atmósfera" se usan como sinónimos aunque difieran un 1,3%.',
      scenarios: [
        {
          title: 'Calibrar las llantas del auto',
          text: 'Un auto de mercado europeo trae 2,2 bar en la etiqueta de la puerta, pero el medidor de la gasolinera marca psi. 2,2 bar son 31,9 psi, así que el ajuste de 32 psi en la bomba es correcto.',
        },
        {
          title: 'Inflar llantas de bicicleta',
          text: 'El costado de la llanta suele traer ambas unidades, pero las bombas rara vez. Una llanta de gravel indicada para 40–70 psi corresponde a 2,76–4,83 bar, y conocer el equivalente en bar importa cuando el único manómetro que tienes es métrico.',
        },
        {
          title: 'Espresso y fichas técnicas de máquinas',
          text: 'La extracción de espresso está estandarizada en 9 bar, y las bombas se anuncian como de 15 bar. En psi eso da 130,5 y 217,6, las cifras que necesitas para comparar con una máquina del mercado estadounidense.',
        },
      ],
      proTip:
        'Un ancla útil: 14,5 psi equivalen casi exactamente a 1 bar, así que dividir los psi entre 14,5 te deja a una décima de por ciento del valor real. Nunca mezcles lecturas manométricas y absolutas en el mismo cálculo: la computadora de buceo, el manifold y el medidor de llantas reportan presión manométrica; el barómetro meteorológico reporta la absoluta.',
    },
  },
}

/**
 * Returns the localised editorial content for a pair, or `null` when the pair
 * has not been localised yet. Falls back to English when a locale is missing
 * for a pair that otherwise has content.
 */
export function getPairContent(slug: string, locale: string): PairContent | null {
  const entry = PAIR_CONTENT[slug]
  if (!entry) return null
  return entry[locale as Locale] ?? entry.en ?? null
}
