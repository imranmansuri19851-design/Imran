import { Chapter, Question } from '../../types';
import { createNCERTQuestion } from './types';

export const STD_8_CHAPTERS: Chapter[] = [
  // Science
  { id: 'ch-s8-1', standard: 8, subject: 'science', chapterNumber: 1, titleGujarati: 'પાક ઉત્પાદન અને વ્યવસ્થાપન', titleEnglish: 'Crop Production and Management', totalQuestions: 6 },
  { id: 'ch-s8-2', standard: 8, subject: 'science', chapterNumber: 2, titleGujarati: 'સૂક્ષ્મજીવો: મિત્ર અને શત્રુ', titleEnglish: 'Microorganisms: Friend and Foe', totalQuestions: 6 },
  { id: 'ch-s8-3', standard: 8, subject: 'science', chapterNumber: 3, titleGujarati: 'બળ અને દબાણ', titleEnglish: 'Force and Pressure', totalQuestions: 6 },
  
  // Social Science
  { id: 'ch-ss8-1', standard: 8, subject: 'social_science', chapterNumber: 1, titleGujarati: 'ભારતમાં યુરોપીય પ્રજાનું આગમન', titleEnglish: 'Arrival of Europeans in India', totalQuestions: 6 },
  { id: 'ch-ss8-2', standard: 8, subject: 'social_science', chapterNumber: 2, titleGujarati: 'ભારતનું બંધારણ', titleEnglish: 'Constitution of India', totalQuestions: 6 },
  
  // Maths
  { id: 'ch-m8-1', standard: 8, subject: 'maths', chapterNumber: 1, titleGujarati: 'સંમેય સંખ્યાઓ', titleEnglish: 'Rational Numbers', totalQuestions: 6 },
  { id: 'ch-m8-2', standard: 8, subject: 'maths', chapterNumber: 2, titleGujarati: 'એકચલ રૈખિક સમીકરણ', titleEnglish: 'Linear Equations in One Variable', totalQuestions: 6 },
  
  // Gujarati
  { id: 'ch-guj8-1', standard: 8, subject: 'gujarati', chapterNumber: 1, titleGujarati: 'બજારમાં (ચિત્રપાઠ)', titleEnglish: 'In the Market', totalQuestions: 6 },
  { id: 'ch-guj8-2', standard: 8, subject: 'gujarati', chapterNumber: 2, titleGujarati: 'એક જ દે ચિનગારી (પ્રાર્થના કાવ્ય)', titleEnglish: 'Give Me a Spark', totalQuestions: 6 },

  // Hindi
  { id: 'ch-h8-1', standard: 8, subject: 'hindi', chapterNumber: 1, titleGujarati: 'પત્ર એવમ ડાયરી', titleEnglish: 'Letter and Diary', totalQuestions: 6 },

  // English
  { id: 'ch-e8-1', standard: 8, subject: 'english', chapterNumber: 1, titleGujarati: 'Q for Question (Unit 1)', titleEnglish: 'Q for Question', totalQuestions: 6 },

  // Sanskrit
  { id: 'ch-san8-1', standard: 8, subject: 'sanskrit', chapterNumber: 1, titleGujarati: 'પુત્રી મમ ખલુ નિદ્રાતિ', titleEnglish: 'My Daughter is Sleeping', totalQuestions: 6 },
];

export const STD_8_QUESTIONS: Question[] = [
  // --- STD 8 SCIENCE CHAPTER 1: પાક ઉત્પાદન અને વ્યવસ્થાપન ---
  // 1 Mark
  createNCERTQuestion({
    id: 'q-s8-1-1m',
    standard: 8,
    subject: 'science',
    chapterId: 'ch-s8-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'પાક ઉત્પાદન અને વ્યવસ્થાપન',
    marks: 1,
    difficulty: 'સરળ',
    questionTextGujarati: 'ખરીફ પાક એટલે શું? ચોમાસામાં વાવવામાં આવતા ખરીફ પાકના બે ઉદાહરણ આપો.',
    questionTextEnglish: 'What is Kharif crop? Give two examples sown in monsoon.',
    keywords: ['ખરીફ પાક', 'ચોમાસું', 'ડાંગર', 'મકાઈ', 'મગફળી'],
    voiceEvaluationKeywords: ['ખરીફ', 'ચોમાસું', 'ડાંગર', 'મકાઈ'],
    mainPoints: ['ચોમાસાની ઋતુમાં (જૂનથી સપ્ટેમ્બર) વાવવામાં આવતા પાકને ખરીફ પાક કહે છે. ઉદાહરણ: ડાંગર, મકાઈ, સોયાબીન.'],
    officialNCERTModelAnswer: 'જે પાકને ચોમાસાની ઋતુમાં વાવવામાં આવે છે તેને ખરીફ પાક કહે છે. ઉદાહરણ: ડાંગર, મકાઈ, મગફળી, કપાસ.',
    alternativeAcceptableAnswers: ['વરસાદની ઋતુમાં રોપવામાં આવતો પાક એટલે ખરીફ પાક. જેમ કે ડાંગર અને મકાઈ.'],
    commonMistakes: ['ઘઉં અને રાઈને ખરીફ પાક ગણવા (જે રવિ પાક છે).'],
    memoryTipGujarati: 'ખરીફ = ચોમાસું (ડાંગર/મકાઈ) | રવિ = શિયાળો (ઘઉં/ચણા)!',
    hintGujarati: 'વરસાદની ઋતુમાં વાવવામાં આવતા ચોખા અને મકાઈ જેવા પાકને કયો પાક કહેવાય?',
  }),

  // 2 Marks
  createNCERTQuestion({
    id: 'q-s8-1-2m',
    standard: 8,
    subject: 'science',
    chapterId: 'ch-s8-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'પાક ઉત્પાદન અને વ્યવસ્થાપન',
    marks: 2,
    difficulty: 'સરળ',
    questionTextGujarati: 'નીંદણ એટલે શું? નીંદણ નાશક કેમિકલનું ઉદાહરણ આપી તેનું નિયંત્રણ સમજાવો.',
    questionTextEnglish: 'What is weed? Explain its control with an example of weedicide.',
    keywords: ['નીંદણ', 'અનિચ્છનીય વનસ્પતિ', '2,4-D', 'ખુરપી', 'નીંદણનાશક'],
    voiceEvaluationKeywords: ['નીંદણ', '24D', 'ખુરપી', 'દવા'],
    mainPoints: [
      'મુખ્ય પાક સાથે કુદરતી રીતે ઊગી નીકળતી અનિચ્છનીય વનસ્પતિને નીંદણ કહે છે.',
      'તેને દૂર કરવા ખુરપી વડે ખુરપણી કરાય છે અથવા 2,4-D જેવા નીંદણનાશક રસાયણનો છંટકાવ કરાય છે.'
    ],
    officialNCERTModelAnswer: 'પાક સાથે ઊગી નીકળતી બિનજરૂરી વનસ્પતિને નીંદણ કહે છે. તેને નીંદણનાશક રસાયણ 2,4-D છાંટીને અથવા ખુરપી વડે દૂર કરવામાં આવે છે.',
    alternativeAcceptableAnswers: ['નકામું ઘાસ જે પાક સાથે ઊગે તેને નીંદણ કહેવાય, જેને દવાથી કે હાથથી દૂર કરાય.'],
    commonMistakes: ['2,4-D ને ખાતર સમજવું.'],
    memoryTipGujarati: 'નીંદણ ➔ અનિચ્છનીય ઘાસ ➔ 2,4-D નીંદણનાશક!',
    hintGujarati: 'પાકના ખેતરમાં વધારાનું નકામું ઘાસ ઊગે તેને દૂર કરવા કઈ દવા કે સાધન વપરાય?',
  }),

  // 3 Marks
  createNCERTQuestion({
    id: 'q-s8-1-3m',
    standard: 8,
    subject: 'science',
    chapterId: 'ch-s8-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'પાક ઉત્પાદન અને વ્યવસ્થાપન',
    marks: 3,
    difficulty: 'મધ્યમ',
    questionTextGujarati: 'ટપક સિંચાઈ પદ્ધતિ (Drip Irrigation) અને ફુવારા પદ્ધતિ (Sprinkler System) વચ્ચેનો તફાવત સમજાવો.',
    questionTextEnglish: 'Explain the difference between Drip Irrigation and Sprinkler System.',
    keywords: ['ટપક સિંચાઈ', 'ફુવારા પદ્ધતિ', 'પાણીનો બગાડ', 'મૂળ', 'રેતાળ જમીન'],
    voiceEvaluationKeywords: ['ટપક', 'ફુવારા', 'પાણી', 'મૂળ'],
    mainPoints: [
      'ટપક પદ્ધતિમાં પાણી સીધું છોડના મૂળ પાસે ટીપે-ટીપે પડે છે, જેથી પાણીનો સહેજ પણ બગાડ થતો નથી (ફળ-બગીચા માટે શ્રેષ્ઠ).',
      'ફુવારા પદ્ધતિમાં પાણી વરસાદની જેમ છંટકાવ પામે છે, જે રેતાળ અને વિષમ જમીન માટે ઉત્તમ છે.',
      'બંને પદ્ધતિઓ આધુનિક જળસંચયની રીતો છે.'
    ],
    officialNCERTModelAnswer: 'ટપક પદ્ધતિમાં પાણી ટીપે-ટીપે મૂળમાં પડે છે અને પાણીનો ૧૦૦% બચાવ થાય છે. ફુવારા પદ્ધતિમાં વરસાદની જેમ પાણી છંટાય છે, જે રેતાળ જમીન માટે અનુકૂળ છે.',
    alternativeAcceptableAnswers: ['ટપક સિંચાઈમાં મૂળ પાસે ટીપાં પડે અને ફુવારામાં વરસાદની જેમ છંટાય.'],
    commonMistakes: ['બંને પદ્ધતિમાં પાણીના વપરાશમાં ભૂલ દર્શાવવી.'],
    memoryTipGujarati: 'ટપક = ટીપે-ટીપે મૂળમાં | ફુવારા = કૃત્રિમ વરસાદ!',
    hintGujarati: 'છોડના મૂળ પાસે ટીપે-ટીપે પાણી આપતી અને ફુવારાની જેમ છાંટતી રીત વચ્ચે શું ફરક છે?',
  }),

  // 4 Marks
  createNCERTQuestion({
    id: 'q-s8-1-4m',
    standard: 8,
    subject: 'science',
    chapterId: 'ch-s8-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'પાક ઉત્પાદન અને વ્યવસ્થાપન',
    marks: 4,
    difficulty: 'મધ્યમ',
    questionTextGujarati: 'કુદરતી ખાતર (Organic Manure) અને કૃત્રિમ ખાતર (Fertilizer) વચ્ચેના 4 મુખ્ય તફાવતો સ્પષ્ટ કરો.',
    questionTextEnglish: 'Differentiate between Organic Manure and Chemical Fertilizers with 4 main points.',
    keywords: ['કુદરતી ખાતર', 'કૃત્રિમ ખાતર', 'સેન્દ્રીય પદાર્થો', 'જમીનનું બંધારણ', 'કારખાના'],
    voiceEvaluationKeywords: ['કુદરતી', 'કૃત્રિમ', 'સેન્દ્રીય', 'કારખાના', 'જમીન'],
    mainPoints: [
      '૧. કુદરતી ખાતર ખેતરમાં છાણ-કચરામાંથી બને છે, કૃત્રિમ ખાતર રાસાયણિક કારખાનામાં બને છે.',
      '૨. કુદરતી ખાતર જમીનને પુષ્કળ સેન્દ્રીય પદાર્થો (Humus) આપે છે, કૃત્રિમ ખાતર સેન્દ્રીય પદાર્થો આપતું નથી.',
      '૩. કુદરતી ખાતરથી જમીનનું બંધારણ સુધરે છે, જ્યારે વધારે કૃત્રિમ ખાતરથી જમીન બિનફળદ્રુપ બને છે.',
      '૪. કુદરતી ખાતરથી જલધારણ ક્ષમતા વધે છે, કૃત્રિમ ખાતર પાણીનું પ્રદૂષણ ફેલાવે છે.'
    ],
    officialNCERTModelAnswer: 'કુદરતી ખાતર સેન્દ્રીય પદાર્થ છે જે જમીનને ફળદ્રુપ અને સેન્દ્રીય દ્રવ્યો આપે છે. કૃત્રિમ ખાતર કારખાનામાં બને છે અને NPK પૂરા પાડે છે પણ લાંબા ગાળે જમીન બગાડે છે.',
    alternativeAcceptableAnswers: ['છાણનું ખાતર કુદરતી છે જે જમીન સુધારે, ફેક્ટરીનું કેમિકલ ખાતર જમીન બગાડે.'],
    commonMistakes: ['કુદરતી ખાતરમાં કેમિકલ હોવાનું લખવું.'],
    memoryTipGujarati: 'કુદરતી = છાણ/સેન્દ્રીય પદાર્થ | કૃત્રિમ = કેમિકલ/કારખાનું!',
    hintGujarati: 'ખેતરમાં મળતું છાણિયું ખાતર અને બજારમાં મળતા યુરિયા ખાતર વચ્ચે શું તફાવત છે?',
  }),

  // 5 Marks
  createNCERTQuestion({
    id: 'q-s8-1-5m',
    standard: 8,
    subject: 'science',
    chapterId: 'ch-s8-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'પાક ઉત્પાદન અને વ્યવસ્થાપન',
    marks: 5,
    difficulty: 'અઘરું',
    questionTextGujarati: 'ખેત પદ્ધતિઓના સાતેય તબક્કાઓ ક્રમબદ્ધ સમજાવો.',
    questionTextEnglish: 'Explain all seven steps of agricultural practices in correct sequence.',
    keywords: ['જમીન તૈયાર કરવી', 'વાવણી', 'ખાતર આપવું', 'સિંચાઈ', 'નીંદણથી રક્ષણ', 'લણણી', 'સંગ્રહ'],
    voiceEvaluationKeywords: ['જમીન', 'વાવણી', 'ખાતર', 'સિંચાઈ', 'નીંદણ', 'લણણી', 'સંગ્રહ'],
    mainPoints: [
      '૧. જમીન તૈયાર કરવી (પોચી બનાવવી).',
      '૨. વાવણી (સારી ગુણવત્તાવાળા બીજ રોપવા).',
      '૩. કુદરતી અને કૃત્રિમ ખાતર આપવું.',
      '૪. સિંચાઈ (સમયસર પાણી આપવું).',
      '૫. નીંદણથી રક્ષણ કરવું.',
      '૬. લણણી (પાક કાપવો).',
      '૭. સંગ્રહ (સાયલો કે કોઠારમાં સાચવવો).'
    ],
    officialNCERTModelAnswer: 'ખેત પદ્ધતિના ૭ ક્રમિક તબક્કા: ૧. જમીન તૈયાર કરવી, ૨. વાવણી, ૩. ખાતર આપવું, ૪. સિંચાઈ, ૫. નીંદણથી રક્ષણ, ૬. લણણી, ૭. સંગ્રહ.',
    alternativeAcceptableAnswers: ['જમીન ખેડવી, બી વાવવા, ખાતર-પાણી આપવું, નીંદણ કાઢવું, પાક કાપવો અને સંગ્રહ કરવો.'],
    commonMistakes: ['ક્રમ ઉલટો સુલટો કરી દેવો (દા.ત. વાવણી પહેલા લણણી લખવી).'],
    memoryTipGujarati: 'જ-વા-ખા-સિ-ની-લ-સ!',
    hintGujarati: 'ખેડૂત ખેતરમાં જમીન તૈયાર કરવાથી લઈને અનાજ ઘરમાં લાવવા સુધી કયા ૭ સ્ટેપ અનુસરે છે?',
  }),

  // 6 Marks
  createNCERTQuestion({
    id: 'q-s8-1-6m',
    standard: 8,
    subject: 'science',
    chapterId: 'ch-s8-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'પાક ઉત્પાદન અને વ્યવસ્થાપન',
    marks: 6,
    difficulty: 'અઘરું',
    questionTextGujarati: 'ધાન્ય અનાજના લણણી પછીના સંગ્રહ માટેના વૈજ્ઞાનિક ઉપાયો (સાયલો, કોઠાર, લીમડાના પાન) અને પ્રાણીઓ દ્વારા મળતા ખોરાક વિશે વિગતવાર નોંધ લખો.',
    questionTextEnglish: 'Write detailed notes on scientific storage of food grains (silos, granaries, neem leaves) and food obtained from animals.',
    keywords: ['સંગ્રહ', 'સાયલો', 'લીમડાના સુકા પાંદડા', 'ભેજ', 'પશુપાલન', 'દૂધ/ઇંડા'],
    voiceEvaluationKeywords: ['સંગ્રહ', 'સાયલો', 'લીમડો', 'ભેજ', 'પશુપાલન'],
    mainPoints: [
      '૧. અનાજનો સંગ્રહ કરતા પહેલા તેને સૂર્યપ્રકાશમાં સુકવીને ભેજમુક્ત કરવો જોઈએ જેથી ફૂગ અને કીટકો ન પડે.',
      '૨. મોટા પાયે અનાજનો સંગ્રહ ધાતુના ઊંચા પાત્રો "સાયલો" (Silos) અથવા કોઠારમાં કરાય છે.',
      '૩. ઘરમાં અનાજ સાચવવા લીમડાના સુકા પાંદડા વપરાય છે જે કીટકોને દૂર રાખે છે.',
      '૪. પ્રાણીઓ દ્વારા આપણને દૂધ, માસ, ઇંડા અને મધ મળે છે.',
      '૫. ઘર કે ખેતરમાં પ્રાણીઓને ખોરાક, રહેઠાણ અને સંભાળ આપી મોટા પાયે ઉછેરવા તેને "પશુપાલન" (Animal Husbandry) કહે છે.'
    ],
    officialNCERTModelAnswer: 'અનાજ સંગ્રહવા માટે ભેજરહિત કરી સાયલો કે કોઠારમાં સાચવવામાં આવે છે અને લીમડાના સુકા પાન મુકાય છે. પ્રાણીઓમાંથી દૂધ, ઇંડા વગેરે મેળવવા પશુપાલન કરવામાં આવે છે.',
    alternativeAcceptableAnswers: ['અનાજ તડકામાં સુકવી સાયલોમાં ભરાય અને પશુપાલનથી દૂધ-ઈંડા મળે.'],
    commonMistakes: ['લીમડાના પાનને બદલે કેમિકલ છાંટવાનું લખવું.'],
    memoryTipGujarati: 'સુકવણી ➔ સાયલો સંગ્રહ ➔ લીમડાના પાન | પશુપાલન ➔ દૂધ/ઇંડા!',
    hintGujarati: 'અનાજને કીડા ના પડે તે માટે શું સાચવવું જોઈએ અને પશુપાલનમાંથી કયો ખોરાક મળે છે?',
  }),

  // --- STD 8 SOCIAL SCIENCE CHAPTER 2: ભારતનું બંધારણ ---
  createNCERTQuestion({
    id: 'q-ss8-2-4m',
    standard: 8,
    subject: 'social_science',
    chapterId: 'ch-ss8-2',
    chapterNumber: 2,
    chapterTitleGujarati: 'ભારતનું બંધારણ',
    marks: 4,
    difficulty: 'મધ્યમ',
    questionTextGujarati: 'ભારત એક બિનસાંપ્રદાયિક અને પ્રજાસત્તાક દેશ છે - સમજાવો.',
    questionTextEnglish: 'Explain: India is a secular and republic country.',
    keywords: ['બિનસાંપ્રદાયિક', 'પ્રજાસત્તાક', 'ધર્મ', 'સમાનતા', 'પ્રજાનું શાસન'],
    voiceEvaluationKeywords: ['બિનસાંપ્રદાયિક', 'પ્રજાસત્તાક', 'ધર્મ', 'ચૂંટણી'],
    mainPoints: [
      '૧. બિનસાંપ્રદાયિક: દેશનો પોતાનો કોઈ અધિકૃત ધર્મ નથી. દરેક નાગરિકને ગમે તે ધર્મ પાળવાની સ્વતંત્રતા છે.',
      '૨. સરકાર ધર્મના આધારે નાગરિકો વચ્ચે કોઈ ભેદભાવ કરતી નથી.',
      '૩. પ્રજાસત્તાક: દેશની સત્તા કોઈ વંશપરંપરાગત રાજાના હાથમાં નથી પણ પ્રજા દ્વારા ચૂંટાયેલા પ્રતિનિધિઓના હાથમાં છે.',
      '૪. દેશના તમામ ઉચ્ચ હોદ્દાઓ દરેક નાગરિક માટે ખુલ્લા છે.'
    ],
    officialNCERTModelAnswer: 'ભારત બિનસાંપ્રદાયિક છે કારણ કે અહીં દરેક ધર્મને સમાન ગણાય છે. ભારત પ્રજાસત્તાક છે કારણ કે દેશનું શાસન પ્રજા દ્વારા ચૂંટાયેલા પ્રતિનિધિઓ ચલાવે છે, વંશપરંપરાગત નથી.',
    alternativeAcceptableAnswers: ['કોઈ ધર્મ મોટો-નાનો નથી અને રાજા નથી પણ પ્રજા વોટ આપીને નેતા પસંદ કરે છે.'],
    commonMistakes: ['પ્રજાસત્તાક અને લોકશાહી વચ્ચે સ્પષ્ટતા ન કરવી.'],
    memoryTipGujarati: 'બિનસાંપ્રદાયિક = સર્વધર્મ સમભાવ | પ્રજાસત્તાક = પ્રજાનું શાસન!',
    hintGujarati: 'ભારતમાં કોઈ પણ ધર્મ પાળવાની છૂટ છે અને નેતાઓને લોકો ચૂંટે છે તેને શું કહેવાય?',
  }),

  // --- STD 8 MATHEMATICS CHAPTER 1: સંમેય સંખ્યાઓ ---
  createNCERTQuestion({
    id: 'q-m8-1-2m',
    standard: 8,
    subject: 'maths',
    chapterId: 'ch-m8-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'સંમેય સંખ્યાઓ',
    marks: 2,
    difficulty: 'સરળ',
    questionTextGujarati: 'સંમેય સંખ્યા એટલે શું? p/q સ્વરૂપનું ઉદાહરણ આપો જ્યાં q ≠ 0.',
    questionTextEnglish: 'What is a rational number? Give example of p/q form where q ≠ 0.',
    keywords: ['સંમેય સંખ્યા', 'p/q સ્વરૂપ', 'છેદ શૂન્ય ન હોય', 'પૂર્ણાંક'],
    voiceEvaluationKeywords: ['સંમેય', 'p/q', 'છેદ'],
    mainPoints: [
      'જે સંખ્યાને p/q સ્વરૂપમાં દર્શાવી શકાય (જ્યાં p અને q પૂર્ણાંક હોય અને q ≠ 0) તેને સંમેય સંખ્યા કહેવાય.',
      'ઉદાહરણ: ૨/૩, -૫/૭, ૦.૫ (૧/૨).'
    ],
    officialNCERTModelAnswer: 'જે સંખ્યાને p/q (જ્યાં q ≠ 0) સ્વરૂપમાં લખી શકાય તેને સંમેય સંખ્યા કહેવાય. ઉદાહરણ: ૩/૪, -૨/૫.',
    alternativeAcceptableAnswers: ['અંશ અને છેદ વાળી સંખ્યા જેમાં છેદ શૂન્ય ન હોય.'],
    commonMistakes: ['છેદમાં શૂન્ય લખવું (જ્યારે q ≠ 0 હોવું ફરજિયાત છે).'],
    memoryTipGujarati: 'p/q સ્વરૂપ (q ≠ 0) ➔ સંમેય સંખ્યા!',
    hintGujarati: 'અંશ અને છેદવાળી સંખ્યા જેમાં છેદ શૂન્ય ન હોવો જોઈએ તેને કઈ સંખ્યા કહેવાય?',
  }),

  // --- STD 8 GUJARATI CHAPTER 1: બજારમાં ---
  createNCERTQuestion({
    id: 'q-guj8-1-2m',
    standard: 8,
    subject: 'gujarati',
    chapterId: 'ch-guj8-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'બજારમાં (ચિત્રપાઠ)',
    marks: 2,
    difficulty: 'સરળ',
    questionTextGujarati: 'બજારમાં ચિત્રપાઠમાં કઈ કઈ દુકાનો અને વાહનો દેખાય છે?',
    questionTextEnglish: 'Which shops and vehicles are visible in the Market picture lesson?',
    keywords: ['આનંદ પ્રોવિઝન સ્ટોર', 'ચશ્માઘર', 'લેડીઝ ટેલર', 'એમ્બ્યુલન્સ', 'બાઇક'],
    voiceEvaluationKeywords: ['પ્રોવિઝન સ્ટોર', 'ચશ્માઘર', 'એમ્બ્યુલન્સ', 'પોલીસ'],
    mainPoints: [
      'દુકાનો: આનંદ પ્રોવિઝન સ્ટોર, સીડી સ્ટોર, બુક સ્ટોલ, લેડીઝ ટેલર, ચશ્માઘર.',
      'વાહનો: ટેન્કર, કાર, મોટરસાઇકલ, બસ, એમ્બ્યુલન્સ અને પોલીસ વાન.'
    ],
    officialNCERTModelAnswer: 'ચિત્રપાઠમાં આનંદ પ્રોવિઝન સ્ટોર, ચશ્માઘર અને બુક સ્ટોલ જેવી દુકાનો તથા એમ્બ્યુલન્સ, ટેન્કર અને બસ જેવા વાહનો દેખાય છે.',
    alternativeAcceptableAnswers: ['કરિયાણાની દુકાન, ચશ્માની દુકાન, કાર અને એમ્બ્યુલન્સ દેખાય છે.'],
    commonMistakes: ['ચિત્રમાં ન હોય તેવું રેલગાડી લખવું.'],
    memoryTipGujarati: 'આનંદ પ્રોવિઝન સ્ટોર + ચશ્માઘર + એમ્બ્યુલન્સ!',
    hintGujarati: 'બજારના ચિત્રમાં કઈ કઈ દુકાનો અને અકસ્માત વખતે આવતી ગાડી દેખાય છે?',
  }),

  // --- STD 8 HINDI CHAPTER 1: पत्र एवं डायरी ---
  createNCERTQuestion({
    id: 'q-h8-1-2m',
    standard: 8,
    subject: 'hindi',
    chapterId: 'ch-h8-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'પત્ર એવમ ડાયરી',
    marks: 2,
    difficulty: 'સરળ',
    questionTextGujarati: 'ડાયરી લેખન કી દો મુખ્ય વિશેષતાએં લીખીએ.',
    questionTextEnglish: 'Write two main characteristics of diary writing.',
    keywords: ['ડાયરી', 'વ્યક્તિગત અનુભવ', 'તારીખ', 'સચ્ચાઈ'],
    voiceEvaluationKeywords: ['ડાયરી', 'તારીખ', 'અનુભવ'],
    mainPoints: [
      '૧. ડાયરી મેં ઘટનાઓં કા ક્રમબદ્ધ એવમ તારીખવાર વિવરણ હોતા હૈ.',
      '૨. ઇસમેં વ્યક્તિ અપને સચ્ચે અનુભવોં ઔર વિચારોં કો ઈમાનદારી સે લીખતા હૈ.'
    ],
    officialNCERTModelAnswer: 'ડાયરી લેખન મેં તારીખ, સ્થાન ઔર અપને જીવન કી સચ્ચી ઘટનાઓં કા સક્ષિપ્ત એવમ સ્પષ્ટ વર્ણન હોતા હૈ.',
    alternativeAcceptableAnswers: ['રોજ તારીખ સાથે પોતાના સાચા અનુભવો લખવા તે ડાયરી લેખન.'],
    commonMistakes: ['ડાયરી અને પત્ર લેખન વચ્ચેનો તફાવત ભૂલી જવો.'],
    memoryTipGujarati: 'તારીખવાર ➔ સચ્ચે અનુભવ ➔ ઈમાનદારી!',
    hintGujarati: 'દરરોજ તારીખ સાથે પોતાના અનુભવો લખવાની ટેવને શું કહેવાય?',
  }),

  // --- STD 8 ENGLISH UNIT 1: Q for Question ---
  createNCERTQuestion({
    id: 'q-e8-1-2m',
    standard: 8,
    subject: 'english',
    chapterId: 'ch-e8-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'Q for Question',
    marks: 2,
    difficulty: 'સરળ',
    questionTextGujarati: 'Who was Sunita Williams and what was her profession?',
    questionTextEnglish: 'Who was Sunita Williams and what was her profession?',
    keywords: ['Sunita Williams', 'astronaut', 'NASA', 'space'],
    voiceEvaluationKeywords: ['Sunita Williams', 'astronaut', 'NASA', 'space'],
    mainPoints: [
      'Sunita Williams is a famous Indian-origin astronaut.',
      'She works at NASA and holds records for space walks.'
    ],
    officialNCERTModelAnswer: 'Sunita Williams is a well-known flight engineer and astronaut working with NASA.',
    alternativeAcceptableAnswers: ['She is an astronaut who went into space with NASA.'],
    commonMistakes: ['Calling her a pilot instead of astronaut.'],
    memoryTipGujarati: 'Sunita Williams ➔ Astronaut ➔ NASA!',
    hintGujarati: 'નાસા (NASA) માં સ્પેસમાં જઈને રેકોર્ડ બનાવનાર ભારતીય મૂળના મહિલા કોણ હતા?',
  }),

  // --- STD 8 SANSKRIT CHAPTER 1: પુત્રી મમ ખલુ નિદ્રાતિ ---
  createNCERTQuestion({
    id: 'q-san8-1-1m',
    standard: 8,
    subject: 'sanskrit',
    chapterId: 'ch-san8-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'પુત્રી મમ ખલુ નિદ્રાતિ',
    marks: 1,
    difficulty: 'સરળ',
    questionTextGujarati: 'સંસ્કૃત કાવ્ય પંક્તિ "પુત્રી મમ ખલુ નિદ્રાતિ" નો ગુજરાતી અર્થ આપો.',
    questionTextEnglish: 'Give the Gujarati meaning of Sanskrit line "Putri mama khalu nidrati".',
    keywords: ['પુત્રી', 'ખરેખર', 'ઊંઘે છે', 'સુતી છે'],
    voiceEvaluationKeywords: ['દીકરી', 'પુત્રી', 'ઊંઘે છે'],
    mainPoints: ['મારી દીકરી ખરેખર સૂતી છે (My daughter is sleeping).'],
    officialNCERTModelAnswer: '"મારી વાહલી દીકરી ખરેખર ઊંઘે છે."',
    alternativeAcceptableAnswers: ['મારી પુત્રી સુતી છે.'],
    commonMistakes: ['નિદ્રાતિ નો અર્થ જાગે છે કરવો.'],
    memoryTipGujarati: 'પુત્રી = દીકરી | નિદ્રાતિ = ઊંઘે છે!',
    hintGujarati: 'માતા પોતાની નાની દીકરીને ઊંઘાડતી વખતે કઈ પંક્તિ બોલે છે?',
  }),
];
