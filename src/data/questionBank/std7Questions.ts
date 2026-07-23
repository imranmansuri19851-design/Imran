import { Chapter, Question } from '../../types';
import { createNCERTQuestion } from './types';

export const STD_7_CHAPTERS: Chapter[] = [
  // Science
  { id: 'ch-s7-1', standard: 7, subject: 'science', chapterNumber: 1, titleGujarati: 'વનસ્પતિમાં પોષણ', titleEnglish: 'Nutrition in Plants', totalQuestions: 6 },
  { id: 'ch-s7-2', standard: 7, subject: 'science', chapterNumber: 2, titleGujarati: 'પ્રાણીઓમાં પોષણ', titleEnglish: 'Nutrition in Animals', totalQuestions: 6 },
  { id: 'ch-s7-3', standard: 7, subject: 'science', chapterNumber: 3, titleGujarati: 'ઉષ્મા અને તેનું પ્રસરણ', titleEnglish: 'Heat and Transfer', totalQuestions: 6 },
  
  // Social Science
  { id: 'ch-ss7-1', standard: 7, subject: 'social_science', chapterNumber: 1, titleGujarati: 'રાજપૂત યુગ: નવા શાસકો અને રાજ્યો', titleEnglish: 'Rajput Era', totalQuestions: 6 },
  { id: 'ch-ss7-2', standard: 7, subject: 'social_science', chapterNumber: 2, titleGujarati: 'દિલ્હી સલ્તનત', titleEnglish: 'Delhi Sultanate', totalQuestions: 6 },
  
  // Maths
  { id: 'ch-m7-1', standard: 7, subject: 'maths', chapterNumber: 1, titleGujarati: 'પૂર્ણાંક સંખ્યાઓ', titleEnglish: 'Integers', totalQuestions: 6 },
  { id: 'ch-m7-2', standard: 7, subject: 'maths', chapterNumber: 2, titleGujarati: 'અપૂર્ણાંક અને દશાંશ સંખ્યાઓ', titleEnglish: 'Fractions and Decimals', totalQuestions: 6 },
  
  // Gujarati
  { id: 'ch-guj7-1', standard: 7, subject: 'gujarati', chapterNumber: 1, titleGujarati: 'મેળામાં (ચિત્રપાઠ)', titleEnglish: 'At the Fair', totalQuestions: 6 },
  { id: 'ch-guj7-2', standard: 7, subject: 'gujarati', chapterNumber: 2, titleGujarati: 'આજની ઘડી રળિયામણી (કાવ્ય)', titleEnglish: 'A Joyful Moment', totalQuestions: 6 },

  // Hindi
  { id: 'ch-h7-1', standard: 7, subject: 'hindi', chapterNumber: 1, titleGujarati: 'ચિત્ર ભી બોલતા હૈ (ચિત્રપાઠ)', titleEnglish: 'Picture Speaks', totalQuestions: 6 },

  // English
  { id: 'ch-e7-1', standard: 7, subject: 'english', chapterNumber: 1, titleGujarati: 'Vinny\'s Smile (Unit 1)', titleEnglish: 'Vinny\'s Smile', totalQuestions: 6 },

  // Sanskrit
  { id: 'ch-san7-1', standard: 7, subject: 'sanskrit', chapterNumber: 1, titleGujarati: 'વંદના (Vandana)', titleEnglish: 'Vandana', totalQuestions: 6 },
];

export const STD_7_QUESTIONS: Question[] = [
  // --- STD 7 SCIENCE CHAPTER 1: વનસ્પતિમાં પોષણ ---
  // 1 Mark
  createNCERTQuestion({
    id: 'q-s7-1-1m',
    standard: 7,
    subject: 'science',
    chapterId: 'ch-s7-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'વનસ્પતિમાં પોષણ',
    marks: 1,
    difficulty: 'સરળ',
    questionTextGujarati: 'પર્ણરંધ્ર (Stomata) એટલે શું? તેનું એક મુખ્ય કાર્ય જણાવો.',
    questionTextEnglish: 'What is Stomata? State one main function.',
    keywords: ['પર્ણરંધ્ર', 'રક્ષકકોષો', 'વાયુ વિનિમય', 'કાર્બન ડાયોક્સાઇડ'],
    voiceEvaluationKeywords: ['પર્ણરંધ્ર', 'વાયુ', 'કાર્બન ડાયોક્સાઇડ', 'ઓક્સિજન'],
    mainPoints: ['પર્ણની સપાટી પર આવેલા સૂક્ષ્મ છિદ્રોને પર્ણરંધ્ર કહે છે. તે વાયુ વિનિમય (CO2 લેવા અને O2 મુક્ત કરવા) માં મદદ કરે છે.'],
    officialNCERTModelAnswer: 'વનસ્પતિના પર્ણની સપાટી પર આવેલા સૂક્ષ્મ છિદ્રોને પર્ણરંધ્ર કહે છે. તેનું મુખ્ય કાર્ય હવામાંથી કાર્બન ડાયોક્સાઇડ વાયુનું શોષણ કરી વાયુ વિનિમય કરવાનું છે.',
    alternativeAcceptableAnswers: ['પાંદડા પરના નાના કાણાં જેનાથી વાયુઓની લેવડ-દેવડ થાય તેને પર્ણરંધ્ર કહેવાય.'],
    commonMistakes: ['પર્ણરંધ્રને હરિતદ્રવ્ય સમજી લેવું.'],
    memoryTipGujarati: 'પર્ણ છિદ્ર ➔ વાયુ વિનિમય (CO2 ➔ O2)!',
    hintGujarati: 'પાંદડાની સપાટી પરના ઝીણા છિદ્રો જે હવામાંથી વાયુ લે છે તેને શું કહેવાય?',
  }),

  // 2 Marks
  createNCERTQuestion({
    id: 'q-s7-1-2m',
    standard: 7,
    subject: 'science',
    chapterId: 'ch-s7-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'વનસ્પતિમાં પોષણ',
    marks: 2,
    difficulty: 'સરળ',
    questionTextGujarati: 'કિટાહારી વનસ્પતિ એટલે શું? ઉદાહરણ આપી તેનું પોષણ સમજાવો.',
    questionTextEnglish: 'What is an insectivorous plant? Explain its nutrition with an example.',
    keywords: ['કિટાહારી', 'કલશપર્ણ', 'કીટકો', 'નાઇટ્રોજન'],
    voiceEvaluationKeywords: ['કિટાહારી', 'કલશપર્ણ', 'કીટક', 'નાઇટ્રોજન'],
    mainPoints: [
      'જે વનસ્પતિ કીટકોનો શિકાર કરીને તેમાંથી નાઇટ્રોજનયુક્ત પોષકતત્વો મેળવે છે તેને કિટાહારી વનસ્પતિ કહે છે.',
      'ઉદાહરણ: કલશપર્ણ (Pitcher Plant).'
    ],
    officialNCERTModelAnswer: 'જે વનસ્પતિઓ કીટકોને પકડીને તેમનું પાચન કરી નાઇટ્રોજનની જરૂરિયાત પૂરી કરે છે તેને કિટાહારી વનસ્પતિ કહે છે. ઉદાહરણ: કલશપર્ણ.',
    alternativeAcceptableAnswers: ['કીટકો ખાઈને પોષણ મેળવતી વનસ્પતિ એટલે કિટાહારી. દા.ત. કલશપર્ણ.'],
    commonMistakes: ['કલશપર્ણ સિવાય પરાવલંબી અમરવેલનું ઉદાહરણ આપવું.'],
    memoryTipGujarati: 'કીટક + આહાર ➔ કિટાહારી (કલશપર્ણ)!',
    hintGujarati: 'નાઇટ્રોજન મેળવવા કીડા-મકોડા ખાઈ જતી કળશ જેવી વનસ્પતિને શું કહેવાય?',
  }),

  // 3 Marks
  createNCERTQuestion({
    id: 'q-s7-1-3m',
    standard: 7,
    subject: 'science',
    chapterId: 'ch-s7-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'વનસ્પતિમાં પોષણ',
    marks: 3,
    difficulty: 'મધ્યમ',
    questionTextGujarati: 'સહજીવન (Symbiosis) એટલે શું? લીલ અને ફૂગ વચ્ચેનું સહજીવન ઉદાહરણ આપી સમજાવો.',
    questionTextEnglish: 'What is symbiosis? Explain the symbiotic relationship between algae and fungi with an example.',
    keywords: ['સહજીવન', 'લાયકેન', 'લીલ', 'ફૂગ', 'આશ્રય', 'ખોરાક'],
    voiceEvaluationKeywords: ['સહજીવન', 'લાયકેન', 'લીલ', 'ફૂગ'],
    mainPoints: [
      'બે સજીવો એકબીજા સાથે રહીને આશ્રય અને પોષકતત્વોની આપ-લે કરે તેને સહજીવન કહે છે.',
      'લાયકેન (Lichen) માં લીલ અને ફૂગ સાથે રહે છે.',
      'ફૂગ લીલને રહેવા માટે આશ્રય, પાણી અને ખનીજતત્વો આપે છે; જ્યારે લીલ પ્રકાશસંશ્લેષણ દ્વારા ખોરાક બનાવીને ફૂગને આપે છે.'
    ],
    officialNCERTModelAnswer: 'સહજીવન એટલે બે જુદા જુદા સજીવોનું એકબીજા પર નભીને સાથે જીવવું. લાયકેનમાં લીલ અને ફૂગ સહજીવન ગુજારે છે. ફૂગ લીલને પાણી, ક્ષારો અને આશ્રય આપે છે, જ્યારે લીલ ખોરાક બનાવી ફૂગને આપે છે.',
    alternativeAcceptableAnswers: ['સાથે મળીને રહેવું અને એકબીજાને મદદ કરવી એ સહજીવન. દા.ત. લાયકેન.'],
    commonMistakes: ['લાયકેનને માત્ર એક જ વનસ્પતિ ગણવી.'],
    memoryTipGujarati: 'લાયકેન = લીલ (ખોરાક) + ફૂગ (આશ્રય)!',
    hintGujarati: 'જેમાં એક સજીવ ઘર આપે અને બીજો રસોઈ બનાવે તેવા લાયકેનના સંબંધને શું કહેવાય?',
  }),

  // 4 Marks
  createNCERTQuestion({
    id: 'q-s7-1-4m',
    standard: 7,
    subject: 'science',
    chapterId: 'ch-s7-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'વનસ્પતિમાં પોષણ',
    marks: 4,
    difficulty: 'મધ્યમ',
    questionTextGujarati: 'જમીનમાં પોષકતત્વોની પુનઃપૂર્તિ કેવી રીતે થાય છે? કુદરતી અને કૃત્રિમ રીતો સમજાવો.',
    questionTextEnglish: 'How are nutrients replenished in the soil? Explain natural and artificial methods.',
    keywords: ['પોષકતત્વો', 'રાઇઝોબિયમ', 'રાસાયણિક ખાતર', 'કઠોળ', 'નાઇટ્રોજન'],
    voiceEvaluationKeywords: ['રાઇઝોબિયમ', 'ખાતર', 'નાઇટ્રોજન', 'કઠોળ'],
    mainPoints: [
      '૧. કૃત્રિમ રીત: શેડમાં NPK (નાઇટ્રોજન, ફોસ્ફરસ, પોટાશ) યુક્ત ખાતર ઉમેરીને.',
      '૨. કુદરતી રીત: કઠોળ વર્ગની વનસ્પતિના મૂળમાં આવેલા રાઇઝોબિયમ (Rhizobium) બેક્ટેરિયા દ્વારા.',
      '૩. રાઇઝોબિયમ હવામાંથી નાઇટ્રોજન મેળવીને જમીનમાં દ્રાવ્ય સ્વરૂપમાં ફેરવે છે.',
      '૪. આથી જમીનની ફળદ્રુપતા કુદરતી રીતે જળવાઈ રહે છે.'
    ],
    officialNCERTModelAnswer: 'જમીનમાં પાક વાવવાથી નાઇટ્રોજન, ફોસ્ફરસ જેવા તત્વો ઘટે છે. તેની પૂર્તિ માટે ૧. છાણિયું કે રાસાયણિક ખાતર ઉમેરાય છે. ૨. કઠોળ વર્ગની વનસ્પતિ વાવવાથી તેના મૂળની ગંડિકામાં રહેલા રાઇઝોબિયમ બેક્ટેરિયા કુદરતી નાઇટ્રોજન સ્થાપન કરે છે.',
    alternativeAcceptableAnswers: ['ખાતર નાખીને અને ચણા-મગ જેવી કઠોળ વાવીને જમીનમાં પોષકતત્વો પાછા મેળવાય.'],
    commonMistakes: ['રાઇઝોબિયમ બેક્ટેરિયાનું નામ ન લખવું.'],
    memoryTipGujarati: 'કૃત્રિમ = NPK ખાતર | કુદરતી = રાઇઝોબિયમ (કઠોળ)!',
    hintGujarati: 'ખેડૂત જમીનમાં કયું ખાતર નાખે છે અને ચણા-મગ વાવવાથી કયા બેક્ટેરિયા મદદ કરે છે?',
  }),

  // 5 Marks
  createNCERTQuestion({
    id: 'q-s7-1-5m',
    standard: 7,
    subject: 'science',
    chapterId: 'ch-s7-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'વનસ્પતિમાં પોષણ',
    marks: 5,
    difficulty: 'અઘરું',
    questionTextGujarati: 'પ્રકાશસંશ્લેષણ પ્રક્રિયા સમીકરણ સાથે સમજાવો અને પર્ણમાં સ્ટાર્ચની હાજરી ચકાસવાનો આયોડિન પ્રયોગ વર્ણવો.',
    questionTextEnglish: 'Explain photosynthesis with chemical equation and describe iodine test for starch in leaves.',
    keywords: ['પ્રકાશસંશ્લેષણ', 'સમીકરણ', 'કાર્બન ડાયોક્સાઇડ', 'આયોડિન ટેસ્ટ', 'વાદળી-કાળો'],
    voiceEvaluationKeywords: ['સમીકરણ', 'આયોડિન', 'સ્ટાર્ચ', 'વાદળી', 'કાર્બન ડાયોક્સાઇડ'],
    mainPoints: [
      'સમીકરણ: કાર્બન ડાયોક્સાઇડ + પાણી ➔ (સૂર્યપ્રકાશ/હરિતદ્રવ્ય) ➔ કાર્બોદિત (ગ્લુકોઝ) + ઓક્સિજન.',
      'પ્રયોગ: પર્ણને ઉકાળી ક્લોરોફિલ દૂર કરી તેના પર આયોડિનના ટીપાં મૂકવા.',
      'અવલોકન: પર્ણનો રંગ ઘેરો વાદળી-કાળો (Blue-Black) બને છે.',
      'નિષ્કર્ષ: વાદળી-કાળો રંગ પર્ણમાં સ્ટાર્ચની હાજરી સૂચવે છે.'
    ],
    officialNCERTModelAnswer: 'પ્રકાશસંશ્લેષણનું સમીકરણ: CO2 + H2O ➔ ગ્લુકોઝ + O2. આયોડિન પ્રયોગ: પર્ણ પર આયોડિનના બે ટીપાં નાખતા તેનો રંગ વાદળી-કાળો થાય છે જે સ્ટાર્ચની હાજરી સાબિત કરે છે.',
    alternativeAcceptableAnswers: ['આયોડિનના ટીપાંથી પાંદડું વાદળી-કાળું થઈ જાય એટલે તેમાં સ્ટાર્ચ છે.'],
    commonMistakes: ['આયોડિન ટેસ્ટમાં પર્ણનો સાચો રંગ વાદળી-કાળો ન દર્શાવવો.'],
    memoryTipGujarati: 'CO2 + H2O ➔ ગ્લુકોઝ + O2 | આયોડિન ➔ વાદળી-કાળો રંગ!',
    hintGujarati: 'પ્રકાશસંશ્લેષણનું સૂત્ર શું છે અને પાંદડા પર કયું કેમિકલ નાખવાથી તે વાદળી-કાળું થાય?',
  }),

  // 6 Marks
  createNCERTQuestion({
    id: 'q-s7-1-6m',
    standard: 7,
    subject: 'science',
    chapterId: 'ch-s7-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'વનસ્પતિમાં પોષણ',
    marks: 6,
    difficulty: 'અઘરું',
    questionTextGujarati: 'વનસ્પતિમાં પોષણના તમામ પ્રકારો (સ્વાવલંબી, પરાવલંબી, મૃતોપજીવી, કિટાહારી અને સહજીવન) ઉદાહરણો અને તફાવતો સાથે સવિસ્તર સમજાવો.',
    questionTextEnglish: 'Explain all modes of nutrition in plants (Autotrophic, Parasitic, Saprotrophic, Insectivorous, Symbiotic) with examples.',
    keywords: ['સ્વાવલંબી', 'પરાવલંબી', 'મૃતોપજીવી', 'કિટાહારી', 'સહજીવન', 'અમરવેલ', 'બ્રેડ મોલ્ડ'],
    voiceEvaluationKeywords: ['સ્વાવલંબી', 'પરાવલંબી', 'મૃતોપજીવી', 'કિટાહારી', 'સહજીવન'],
    mainPoints: [
      '૧. સ્વાવલંબી: પોતે ખોરાક બનાવે (લીલી વનસ્પતિ).',
      '૨. પરાવલંબી: બીજા પર નભે (અમરવેલ - ચુષક મૂળ).',
      '૩. મૃતોપજીવી: સડેલા પદાર્થોમાંથી પોષણ મેળવે (બ્રેડ પરની ફૂગ/મશરૂમ).',
      '૪. કિટાહારી: કીટકોમાંથી નાઇટ્રોજન મેળવે (કલશપર્ણ).',
      '૫. સહજીવન: બે સજીવો સાથે રહી લાભ મેળવે (લાયકેન).',
      'આ તમામ પ્રકારો વનસ્પતિની વિવિધ પર્યાવરણીય અનુકૂળતાઓ દર્શાવે છે.'
    ],
    officialNCERTModelAnswer: 'વનસ્પતિમાં પોષણના ૫ પ્રકાર છે: ૧. સ્વાવલંબી (લીલી વનસ્પતિ), ૨. પરાવલંબી (અમરવેલ), ૩. મૃતોપજીવી (ફૂગ, મશરૂમ), ૪. કિટાહારી (કલશપર્ણ), ૫. સહજીવન (લાયકેન). દરેક પોતાના પર્યાવરણ મુજબ પોષકતત્વો મેળવે છે.',
    alternativeAcceptableAnswers: ['પોષણના ૫ પ્રકાર: સ્વાવલંબી, પરાવલંબી, મૃતોપજીવી, કિટાહારી અને સહજીવન.'],
    commonMistakes: ['બધા પ્રકારોમાં યોગ્ય ઉદાહરણ ન આપવું.'],
    memoryTipGujarati: '૫ રત્નો: સ્વા-પરા-મૃત-કિટ-સહ!',
    hintGujarati: 'વનસ્પતિ ખોરાક કઈ ૫ અલગ અલગ રીતોથી મેળવી શકે છે?',
  }),

  // --- STD 7 SOCIAL SCIENCE CHAPTER 1: રાજપૂત યુગ ---
  createNCERTQuestion({
    id: 'q-ss7-1-3m',
    standard: 7,
    subject: 'social_science',
    chapterId: 'ch-ss7-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'રાજપૂત યુગ: નવા શાસકો અને રાજ્યો',
    marks: 3,
    difficulty: 'મધ્યમ',
    questionTextGujarati: 'રાજપૂતોના ગુણો અને રાજપૂતાણીઓના વીરત્વ વિશે ટૂંકનોંધ લખો.',
    questionTextEnglish: 'Write a short note on qualities of Rajputs and bravery of Rajputanis.',
    keywords: ['રાજપૂત', 'વીરતા', 'શરણાગત', 'રાજપૂતાણી', 'જોહર', 'સતી પ્રથા'],
    voiceEvaluationKeywords: ['રાજપૂત', 'વીર', 'જોહર', 'કેસરિયા'],
    mainPoints: [
      'રાજપૂતો બહાદુર, ટેકીલા અને વચનપાલક હતા. શરણે આવેલાનું પ્રાણના ભોગે પણ રક્ષણ કરતા.',
      'રાજપૂતાણીઓ નિડર અને વીર હતી. પતિ કે પુત્રને હસતા મુખે યુદ્ધમાં વિદાય આપતી.',
      'યુદ્ધમાં વિજયની આશા ન રહે ત્યારે તેઓ કેસરિયા કરતી અથવા "જોહર" (અગ્નિસ્નાન) કરતી.'
    ],
    officialNCERTModelAnswer: 'રાજપૂતો ખૂબ જ શૂરવીર, ટેકીલા અને શરણાગતનું રક્ષણ કરનારા હતા. રાજપૂતાણીઓ પણ વીરતા માટે જાણીતી હતી. યુદ્ધમાં પરાજય દેખાય ત્યારે તેઓ જોહર (અગ્નિમાં કૂદી પડવું) કરતી હતી.',
    alternativeAcceptableAnswers: ['રાજપૂતો બહાદુર હતા અને રાજપૂતાણીઓ હસતા મોઢે યુદ્ધમાં મોકલતી અને જોહર કરતી.'],
    commonMistakes: ['જોહર શબ્દનો સાચો અર્થ ન દર્શાવવો.'],
    memoryTipGujarati: 'રાજપૂત = શૂરવીરતા ➔ રાજપૂતાણી = જોહર (અગ્નિસ્નાન)!',
    hintGujarati: 'રાજપૂત રાજાઓની વીરતા અને રાણીઓના "જોહર" વિશે શું જાણીતું છે?',
  }),

  // --- STD 7 MATHEMATICS CHAPTER 1: પૂર્ણાંક સંખ્યાઓ ---
  createNCERTQuestion({
    id: 'q-m7-1-2m',
    standard: 7,
    subject: 'maths',
    chapterId: 'ch-m7-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'પૂર્ણાંક સંખ્યાઓ',
    marks: 2,
    difficulty: 'સરળ',
    questionTextGujarati: 'ઋણ પૂર્ણાંક અને ધન પૂર્ણાંકનો ગુણાકાર કરતા કયું ચિહ્ન આવે? ઉદાહરણ આપો.',
    questionTextEnglish: 'What sign do you get when multiplying a negative and positive integer? Give an example.',
    keywords: ['ઋણ પૂર્ણાંક', 'ધન પૂર્ણાંક', 'ઋણ ચિહ્ન', 'ગુણાકાર'],
    voiceEvaluationKeywords: ['ઋણ', 'માઇનસ', 'ધન'],
    mainPoints: [
      'ઋણ પૂર્ણાંક (-) અને ધન પૂર્ણાંક (+) નો ગુણાકાર કરવાથી હંમેશા ઋણ પૂર્ણાંક (-) મળે છે.',
      'ઉદાહરણ: (-૫) x ૩ = -૧૫.'
    ],
    officialNCERTModelAnswer: 'એક ઋણ અને એક ધન પૂર્ણાંકનો ગુણાકાર હંમેશા ઋણ પૂર્ણાંક મળે છે. (- x + = -). ઉદાહરણ: (-૫) x ૪ = -૨૦.',
    alternativeAcceptableAnswers: ['માઇનસ અને પ્લસ નો ગુણાકાર માઇનસ થાય. (-૫) x ૩ = -૧૫.'],
    commonMistakes: ['બે ઋણ ગુણાઈને ધન થાય તેનો આમાં સાચો નિયમ ન વાપરવો.'],
    memoryTipGujarati: 'વિરોધી ચિહ્નોનો ગુણાકાર = ઋણ (-)!',
    hintGujarati: 'માઇનસ અને પ્લસ નો ગુણાકાર કરીએ તો જવાબમાં કયું ચિહ્ન આવે?',
  }),

  // --- STD 7 GUJARATI CHAPTER 1: મેળામાં ---
  createNCERTQuestion({
    id: 'q-guj7-1-2m',
    standard: 7,
    subject: 'gujarati',
    chapterId: 'ch-guj7-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'મેળામાં (ચિત્રપાઠ)',
    marks: 2,
    difficulty: 'સરળ',
    questionTextGujarati: 'મેળાના ચિત્રમાં કઈ કઈ દુકાનો અને આનંદના સાધનો દેખાય છે?',
    questionTextEnglish: 'Which shops and rides are seen in the fair picture?',
    keywords: ['સોનમ મીઠાઈ સેન્ટર', 'હર્ષ આઈસ્ક્રીમ સેન્ટર', 'ચકડોળ', 'રમકડાં'],
    voiceEvaluationKeywords: ['મીઠાઈ', 'આઈસ્ક્રીમ', 'ચકડોળ'],
    mainPoints: [
      'દુકાનો: સોનમ મીઠાઈ સેન્ટર અને હર્ષ આઈસ્ક્રીમ સેન્ટર.',
      'સાધનો: મોટું ચકડોળ, નાનું ચકડોળ, મૌત કા કુવા અને ફુગ્ગામાં નિશાન તાકવાનું સ્ટોલ.'
    ],
    officialNCERTModelAnswer: 'મેળાના ચિત્રમાં સોનમ મીઠાઈ સેન્ટર અને હર્ષ આઈસ્ક્રીમ સેન્ટરની દુકાનો તથા મોટા ચકડોળ અને રમકડાં દેખાય છે.',
    alternativeAcceptableAnswers: ['મીઠાઈ અને આઈસ્ક્રીમની દુકાન તથા ચકડોળ દેખાય છે.'],
    commonMistakes: ['ધોરણ ૬ ના રેલવે સ્ટેશન સાથે મિશ્રણ કરવું.'],
    memoryTipGujarati: 'સોનમ મીઠાઈ + હર્ષ આઈસ્ક્રીમ + ચકડોળ!',
    hintGujarati: 'મેળામાં આઈસ્ક્રીમ અને મીઠાઈની કઈ કઈ દુકાનો હતી?',
  }),

  // --- STD 7 HINDI CHAPTER 1: चित्र भी बोलता है ---
  createNCERTQuestion({
    id: 'q-h7-1-2m',
    standard: 7,
    subject: 'hindi',
    chapterId: 'ch-h7-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'ચિત્ર ભી બોલતા હૈ',
    marks: 2,
    difficulty: 'સરળ',
    questionTextGujarati: 'ચિત્રપાઠમાં સ્વચ્છતાનું મહત્વ કઈ રીતે દર્શાવવામાં આવ્યું છે?',
    questionTextEnglish: 'How is the importance of cleanliness depicted in the picture lesson?',
    keywords: ['સ્વચ્છતા', 'કચરાપેટી', 'રોગચાળો', 'સફાઈ'],
    voiceEvaluationKeywords: ['સ્વચ્છતા', 'કચરાપેટી', 'સફાઈ'],
    mainPoints: [
      'લોકો કચરો ખુલ્લામાં નાખવાને બદલે કચરાપેટીમાં નાખતા દર્શાવ્યા છે.',
      'ગામ કે શહેર સ્વચ્છ રાખવાથી રોગચાળો ફેલાતો નથી તેવો સંદેશ આપે છે.'
    ],
    officialNCERTModelAnswer: 'ચિત્રપાઠમાં લોકો કચરાપેટીનો ઉપયોગ કરતા દેખાય છે. ગંદકી ન કરવાથી સ્વાસ્થ્ય સારું રહે છે અને રોગો થતા નથી.',
    alternativeAcceptableAnswers: ['કચરો કચરાપેટીમાં નાખવો જોઈએ જેથી બીમારી ન થાય.'],
    commonMistakes: ['સ્વચ્છતાને બદલે માત્ર વૃક્ષારોપણ લખવું.'],
    memoryTipGujarati: 'કચરો ➔ કચરાપેટીમાં ➔ નિરોગી જીવન!',
    hintGujarati: 'કચરો ક્યાં નાખવાથી ગામમાં બીમારીઓ ફેલાતી નથી?',
  }),

  // --- STD 7 ENGLISH UNIT 1: Vinny's Smile ---
  createNCERTQuestion({
    id: 'q-e7-1-2m',
    standard: 7,
    subject: 'english',
    chapterId: 'ch-e7-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'Vinny\'s Smile',
    marks: 2,
    difficulty: 'સરળ',
    questionTextGujarati: 'What did Vinny buy and what did she fly in the poem?',
    questionTextEnglish: 'What did Vinny buy and what did she fly in the poem?',
    keywords: ['bag', 'kite', 'bought', 'flew'],
    voiceEvaluationKeywords: ['bag', 'kite', 'bought', 'flew'],
    mainPoints: [
      'Vinny bought a little bag.',
      'She flew a colourful kite.'
    ],
    officialNCERTModelAnswer: 'Vinny bought a little bag and flew a beautiful kite in the poem.',
    alternativeAcceptableAnswers: ['She bought a bag and flew a kite.'],
    commonMistakes: ['Confusing bought with caught.'],
    memoryTipGujarati: 'Bag = bought | Kite = flew!',
    hintGujarati: 'વિન્નીએ કઈ વસ્તુ ખરીદી હતી અને હવામાં શું ઉડાડ્યું હતું?',
  }),

  // --- STD 7 SANSKRIT CHAPTER 1: વંદના ---
  createNCERTQuestion({
    id: 'q-san7-1-1m',
    standard: 7,
    subject: 'sanskrit',
    chapterId: 'ch-san7-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'વંદના',
    marks: 1,
    difficulty: 'સરળ',
    questionTextGujarati: 'શ્લોક "યાદેવી સર્વભૂતેષુ..." નો અર્થ ટૂંકમાં આપો.',
    questionTextEnglish: 'Give the brief meaning of shloka "Ya Devi Sarvabhuteshu...".',
    keywords: ['વિદ્યારોપેણ', 'દેવી', 'નમસ્કાર', 'સરસ્વતી'],
    voiceEvaluationKeywords: ['દેવી', 'વિદ્યા', 'નમસ્કાર'],
    mainPoints: ['જે દેવી તમામ પ્રાણીઓમાં વિદ્યારૂપે રહેલી છે તેમને વારંવાર નમસ્કાર હો.'],
    officialNCERTModelAnswer: 'જે દેવી સર્વ પ્રાણીઓમાં વિદ્યારૂપે રહેલી છે, તેમને વારંવાર નમસ્કાર असો.',
    alternativeAcceptableAnswers: ['વિદ્યા આપનારી દેવી સરસ્વતીને પ્રણામ.'],
    commonMistakes: ['વિદ્યાને બદલે શક્તિ શબ્દ જ વાપરવો.'],
    memoryTipGujarati: 'વિદ્યારૂપેણ ➔ સરસ્વતી દેવીને પ્રણામ!',
    hintGujarati: 'સર્વ જીવોમાં વિદ્યા તરીકે રહેલી દેવીને આપણે શું કરીએ છીએ?',
  }),
];
