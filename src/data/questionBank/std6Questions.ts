import { Chapter, Question } from '../../types';
import { createNCERTQuestion } from './types';
import { STD_6_SCIENCE_CHAPTERS, STD_6_SCIENCE_QUESTIONS } from './std6ScienceComplete';

export const STD_6_CHAPTERS: Chapter[] = [
  // Complete Science Syllabus (Chapters 1 to 16)
  ...STD_6_SCIENCE_CHAPTERS,
  
  // Social Science
  { id: 'ch-ss6-1', standard: 6, subject: 'social_science', chapterNumber: 1, titleGujarati: 'ચાલો ઇતિહાસ જાણીએ', titleEnglish: 'Let us know History', totalQuestions: 6 },
  { id: 'ch-ss6-2', standard: 6, subject: 'social_science', chapterNumber: 2, titleGujarati: 'આદિમાનવથી સ્થાયી જીવનની સફર', titleEnglish: 'Primitive to Settled Life', totalQuestions: 6 },
  
  // Maths
  { id: 'ch-m6-1', standard: 6, subject: 'maths', chapterNumber: 1, titleGujarati: 'સંખ્યા પરિચય', titleEnglish: 'Knowing Our Numbers', totalQuestions: 6 },
  { id: 'ch-m6-2', standard: 6, subject: 'maths', chapterNumber: 2, titleGujarati: 'પૂર્ણ સંખ્યાઓ', titleEnglish: 'Whole Numbers', totalQuestions: 6 },
  
  // Gujarati
  { id: 'ch-guj6-1', standard: 6, subject: 'gujarati', chapterNumber: 1, titleGujarati: 'રેલવે સ્ટેશન (ચિત્રપાઠ)', titleEnglish: 'Railway Station', totalQuestions: 6 },
  { id: 'ch-guj6-2', standard: 6, subject: 'gujarati', chapterNumber: 2, titleGujarati: 'હિંદમાતાને સંબોધન (કાવ્ય)', titleEnglish: 'Address to Mother India', totalQuestions: 6 },

  // Hindi
  { id: 'ch-h6-1', standard: 6, subject: 'hindi', chapterNumber: 1, titleGujarati: 'દયાલુ શિકારી (ચિત્રપાઠ)', titleEnglish: 'Merciful Hunter', totalQuestions: 6 },

  // English
  { id: 'ch-e6-1', standard: 6, subject: 'english', chapterNumber: 1, titleGujarati: 'Where were you? (Unit 1)', titleEnglish: 'Where were you?', totalQuestions: 6 },

  // Sanskrit
  { id: 'ch-san6-1', standard: 6, subject: 'sanskrit', chapterNumber: 1, titleGujarati: 'ચિત્રપદાની (Chitrapadani)', titleEnglish: 'Chitrapadani', totalQuestions: 6 },
];

export const STD_6_QUESTIONS: Question[] = [
  ...STD_6_SCIENCE_QUESTIONS,

  // --- STD 6 MATHEMATICS CHAPTER 1: સંખ્યા પરિચય ---
  createNCERTQuestion({
    id: 'q-m6-1-1m',
    standard: 6,
    subject: 'maths',
    chapterId: 'ch-m6-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'સંખ્યા પરિચય',
    marks: 1,
    difficulty: 'સરળ',
    questionTextGujarati: '૧ લાખમાં કેટલા હજાર હોય છે?',
    questionTextEnglish: 'How many thousands are there in 1 lakh?',
    keywords: ['૧ લાખ', '૧૦૦ હજાર', '૧,૦૦,૦૦૦'],
    voiceEvaluationKeywords: ['સો હજાર', '100 હજાર', 'એક સો'],
    mainPoints: ['૧ લાખ = ૧૦૦ હજાર (100 thousands).'],
    officialNCERTModelAnswer: '૧ લાખમાં ૧૦૦ હજાર (100 Thousands) હોય છે.',
    alternativeAcceptableAnswers: ['100 હજાર.'],
    commonMistakes: ['૧૦ હજાર કે ૧૦૦૦ હજાર કહેવું.'],
    memoryTipGujarati: '૧,૦૦,૦૦૦ ➔ ૧૦૦ x ૧૦૦૦ = ૧ લાખ!',
    hintGujarati: '૧ ની પાછળ ૫ શૂન્ય મૂકો તો તેમાં ૧૦૦૦ કેટલી વાર આવે?',
  }),

  createNCERTQuestion({
    id: 'q-m6-1-3m',
    standard: 6,
    subject: 'maths',
    chapterId: 'ch-m6-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'સંખ્યા પરિચય',
    marks: 3,
    difficulty: 'મધ્યમ',
    questionTextGujarati: 'ભારતીય સંખ્યા લેખન પદ્ધતિ અને આંતરરાષ્ટ્રીય સંખ્યા લેખન પદ્ધતિ વચ્ચેનો મુખ્ય તફાવત સમજાવો.',
    questionTextEnglish: 'Explain difference between Indian and International system of numeration.',
    keywords: ['ભારતીય પદ્ધતિ', 'આંતરરાષ્ટ્રીય પદ્ધતિ', 'લાખ', 'મિલિયન', 'અલ્પવિરામ'],
    voiceEvaluationKeywords: ['લાખ', 'મિલિયન', 'કરોડ', 'બિલિયન'],
    mainPoints: [
      'ભારતીય પદ્ધતિમાં એકમ, દશક, સો, હજાર, દસ હજાર, લાખ, દસ લાખ, કરોડનો ઉપયોગ થાય છે.',
      'આંતરરાષ્ટ્રીય પદ્ધતિમાં એકમ, દશક, સો, હજાર, દસ હજાર, સો હજાર, મિલિયન, દસ મિલિયનનો ઉપયોગ થાય છે.',
      'ભારતીયમાં પ્રથમ અલ્પવિરામ ૩ અંક પછી અને પછી બબ્બે અંકે આવે છે, જ્યારે આંતરરાષ્ટ્રીયમાં દર ૩ અંકે અલ્પવિરામ મૂકાય છે.'
    ],
    officialNCERTModelAnswer: 'ભારતીય પદ્ધતિમાં લાખ અને કરોડનો ઉપયોગ થાય છે અને અલ્પવિરામ ૩, ૨, ૨ અંકોના જૂથમાં મૂકાય છે. આંતરરાષ્ટ્રીય પદ્ધતિમાં મિલિયન અને બિલિયનનો ઉપયોગ થાય છે તથા દર ૩ અંકોએ અલ્પવિરામ મૂકાય છે.',
    alternativeAcceptableAnswers: ['ભારતીયમાં લાખ-કરોડ અને આંતરરાષ્ટ્રીયમાં મિલિયન-બિલિયન બોલાય.'],
    commonMistakes: ['અલ્પવિરામના સ્થાનમાં ભૂલ કરવી.'],
    memoryTipGujarati: 'ભારતીય = ૩,૨,૨ અલ્પવિરામ | આંતરરાષ્ટ્રીય = ૩,૩,૩ અલ્પવિરામ!',
    hintGujarati: 'આપણે દેશમાં "લાખ-કરોડ" બોલીએ છીએ પણ વિદેશમાં "મિલિયન" કઈ રીતે બોલાય છે?',
  }),

  // --- STD 6 SOCIAL SCIENCE CHAPTER 1: ચાલો ઇતિહાસ જાણીએ ---
  createNCERTQuestion({
    id: 'q-ss6-1-2m',
    standard: 6,
    subject: 'social_science',
    chapterId: 'ch-ss6-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'ચાલો ઇતિહાસ જાણીએ',
    marks: 2,
    difficulty: 'સરળ',
    questionTextGujarati: 'ભોજપત્ર એટલે શું? તે કયા વૃક્ષની છાલમાંથી બને છે?',
    questionTextEnglish: 'What is Bhojpatra? From which tree bark is it made?',
    keywords: ['ભોજપત્ર', 'ભૂર્જ વૃક્ષ', 'હિમાલય', 'આંતરછાલ', 'હસ્તપ્રત'],
    voiceEvaluationKeywords: ['ભૂર્જ', 'હિમાલય', 'છાલ', 'હસ્તપ્રત'],
    mainPoints: [
      'ભોજપત્ર એટલે હિમાલયમાં થતા ભૂર્જ નામના વૃક્ષની પાતળી આંતરછાલ.',
      'જેના પર પ્રાચીન સમયમાં હસ્તપ્રતો લખવામાં આવતી હતી.'
    ],
    officialNCERTModelAnswer: 'ભોજપત્ર એટલે હિમાલયમાં થતા "ભૂર્જ" નામના વૃક્ષની પાતળી આંતરછાલ, જેના પર પ્રાચીન સમયમાં લખાણ કે હસ્તપ્રતો લખવામાં આવતી હતી.',
    alternativeAcceptableAnswers: ['ભૂર્જ નામના વૃક્ષની છાલ પર લખાયેલું પ્રાચીન લખાણ.'],
    commonMistakes: ['ભૂર્જ વૃક્ષને બદલે તાડનું વૃક્ષ લખવું.'],
    memoryTipGujarati: 'ભોજપત્ર ➔ ભૂર્જ વૃક્ષ (હિમાલય)!',
    hintGujarati: 'ઇતિહાસ જાણવા માટે હિમાલયના કયા ખાસ વૃક્ષની છાલ વપરાતી હતી?',
  }),

  // --- STD 6 GUJARATI CHAPTER 1: રેલવે સ્ટેશન ---
  createNCERTQuestion({
    id: 'q-guj6-1-2m',
    standard: 6,
    subject: 'gujarati',
    chapterId: 'ch-guj6-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'રેલવે સ્ટેશન (ચિત્રપાઠ)',
    marks: 2,
    difficulty: 'સરળ',
    questionTextGujarati: 'રેલવે સ્ટેશન ચિત્રપાઠમાં કયા કયા ફેરિયા અને દુકાનો નજરે પડે છે?',
    questionTextEnglish: 'Which vendors and shops are visible in the railway station picture lesson?',
    keywords: ['પ્રભાત બુક સ્ટોલ', 'ટી સ્ટોલ', 'કુલી', 'ફેરિયા', 'ટિકિટ ચેકર'],
    voiceEvaluationKeywords: ['બુક સ્ટોલ', 'ચાની દુકાન', 'કુલી', 'ફેરિયા'],
    mainPoints: [
      'દુકાનો: પ્રભાત બુક સ્ટોલ અને ટી સ્ટોલ (ચાની દુકાન).',
      'ફેરિયાઓ: ફળ વેચનારો ફેરિયો, કુલી, ટિકિટ ચેકર અને મુસાફરો નજરે પડે છે.'
    ],
    officialNCERTModelAnswer: 'રેલવે સ્ટેશન ચિત્રપાઠમાં પ્રભાત બુક સ્ટોલ અને ટી સ્ટોલ નામની દુકાનો તથા ફળ વેચનાર ફેરિયો, કુલી અને ટિકિટ ચેકર નજરે પડે છે.',
    alternativeAcceptableAnswers: ['ચાની અને ચોપડીઓની દુકાન તથા ફળવાળો ફેરિયો દેખાય છે.'],
    commonMistakes: ['ચિત્રમાં ન હોય તેવી દુકાનો દર્શાવવી.'],
    memoryTipGujarati: 'પ્રભાત બુક સ્ટોલ + ટી સ્ટોલ + ફળવાળો!',
    hintGujarati: 'ચિત્રપાઠમાં પુસ્તકોની અને ચાની કઈ કઈ દુકાનો હતી?',
  }),

  // --- STD 6 HINDI CHAPTER 1: दयालु शिकारी ---
  createNCERTQuestion({
    id: 'q-h6-1-2m',
    standard: 6,
    subject: 'hindi',
    chapterId: 'ch-h6-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'દયાલુ શિકારી (ચિત્રપાઠ)',
    marks: 2,
    difficulty: 'સરળ',
    questionTextGujarati: 'શિકારીએ હરણ પર દયા શા માટે બતાવી?',
    questionTextEnglish: 'Why did the hunter show mercy to the deer?',
    keywords: ['હરણ', 'બચ્ચું', 'ગોળી', 'દયા', 'અસ્પતાલ'],
    voiceEvaluationKeywords: ['બચ્ચું', 'ગોળી', 'દયા', 'હોસ્પિટલ'],
    mainPoints: [
      'શિકારીની ગોળી વાગવાથી હરણી ઘાયલ થઈ હતી અને તેની પાસે નાનું બચ્ચું બેઠું હતું.',
      'આ દ્રશ્ય જોઈને શિકારીનું હૃદય પીગળી ગયું અને તેણે હરણીને પશુ હોસ્પિટલ પહોંચાડી.'
    ],
    officialNCERTModelAnswer: 'શિકારી કી ગોલી સે હરણી ઘાયલ હો ગઈ થી અને ઉસકે પાસ એક છોટા બચ્ચા બેઠા થા. યહ દેખકર શિકારી કા દિલ ભરા આયા અને ઉસને હરણી પર દયા દિખાઈ.',
    alternativeAcceptableAnswers: ['હરણીના નાના બચ્ચાને જોઈને શિકારીને દયા આવી.'],
    commonMistakes: ['હરણી મૃત્યુ પામી હતી તેવું લખવું.'],
    memoryTipGujarati: 'ઘાયલ હરણી + નાનું બચ્ચું ➔ શિકારીનું હૃદય પરિવર્તન!',
    hintGujarati: 'હરણીની સાથે કોણ બેઠું હતું જેને જોઈને શિકારીનું દિલ પીગળી ગયું?',
  }),

  // --- STD 6 ENGLISH UNIT 1: Where were you? ---
  createNCERTQuestion({
    id: 'q-e6-1-2m',
    standard: 6,
    subject: 'english',
    chapterId: 'ch-e6-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'Where were you?',
    marks: 2,
    difficulty: 'સરળ',
    questionTextGujarati: 'Who was absent on Monday in the class? Describe the cold day.',
    questionTextEnglish: 'Who was absent on Monday in the class? Describe the cold day.',
    keywords: ['Mr. Joshi', 'absent', 'cold day', 'rain', 'frozen'],
    voiceEvaluationKeywords: ['Mr Joshi', 'absent', 'cold', 'rain'],
    mainPoints: [
      'Mr. Joshi was absent because he was sick.',
      'It was a very cold and rainy day with bad attendance.'
    ],
    officialNCERTModelAnswer: 'Many students and Mr. Joshi were absent on Monday because it was a very cold and rainy day.',
    alternativeAcceptableAnswers: ['Mr. Joshi and many kids were absent due to cold weather.'],
    commonMistakes: ['Confusing Sunday with Monday.'],
    memoryTipGujarati: 'Cold day ➔ Rain ➔ Mr. Joshi absent!',
    hintGujarati: 'સોમવારે ઠંડી અને વરસાદના કારણે શિક્ષક મિ. જોશી હાજર હતા કે ગેરહાજર?',
  }),

  // --- STD 6 SANSKRIT CHAPTER 1: ચિત્રપદાની ---
  createNCERTQuestion({
    id: 'q-san6-1-1m',
    standard: 6,
    subject: 'sanskrit',
    chapterId: 'ch-san6-1',
    chapterNumber: 1,
    chapterTitleGujarati: 'ચિત્રપદાની',
    marks: 1,
    difficulty: 'સરળ',
    questionTextGujarati: 'સંસ્કૃત શબ્દ "વૃષભઃ" અને "ગજઃ" નો ગુજરાતી અર્થ આપો.',
    questionTextEnglish: 'Give the Gujarati meaning of Sanskrit words "Vrishabhah" and "Gajah".',
    keywords: ['વૃષભઃ', 'બળદ', 'ગજઃ', 'હાથી'],
    voiceEvaluationKeywords: ['બળદ', 'હાથી'],
    mainPoints: ['વૃષભઃ = બળદ (Bull), ગજઃ = હાથી (Elephant).'],
    officialNCERTModelAnswer: 'વૃષભઃ એટલે "બળદ" અને ગજઃ એટલે "હાથી".',
    alternativeAcceptableAnswers: ['બળદ અને હાથી.'],
    commonMistakes: ['વૃષભઃ નો અર્થ ગાય કરવો.'],
    memoryTipGujarati: 'વૃષભઃ = બળદ | ગજઃ = હાથી!',
    hintGujarati: 'ખેતરમાં હળ ખેંચતા પ્રાણીને અને જંગલના વિશાળ કાય પ્રાણીને સંસ્કૃતમાં શું કહેવાય?',
  }),
];
