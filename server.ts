import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily/safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", appName: "Answer Coach AI" });
});

// AI Answer Evaluation Endpoint
app.post("/api/evaluate", async (req, res) => {
  try {
    const {
      question,
      questionEnglish,
      standard,
      subject,
      chapter = "",
      totalMarks = 5,
      keyPoints = [],
      modelAnswer: givenModelAnswer = "",
      alternativeAnswers = [],
      aiEvaluationRules = {},
      studentAnswer = "",
      attemptNumber = 1,
      language = "gu", // 'gu' | 'en' | 'hi'
    } = req.body;

    const qMarks = Number(totalMarks) || 5;

    if (!studentAnswer || studentAnswer.trim().length === 0) {
      return res.status(400).json({
        error: language === 'en' 
          ? "Student answer is empty. Please speak or type an answer."
          : language === 'hi'
          ? "छात्र का उत्तर खाली है। कृपया बोलकर या लिखकर उत्तर दें।"
          : "વિદ્યાર્થીનો જવાબ ખાલી છે. કૃપા કરીને બોલીને અથવા ટાઇપ કરીને જવાબ આપો.",
      });
    }

    const ai = getGeminiClient();

    const langName = language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : 'Gujarati';

    if (ai) {
      try {
        const prompt = `You are "I M MASTER AI ગુરુજી", an inspiring, warm, highly encouraging expert NCERT master teacher for Standard: ${standard}, Subject: ${subject}, Chapter: ${chapter || 'NCERT Chapter'}.
You are evaluating a student's answer in ${langName}.

NCERT CONTEXT & QUESTION DETAILS:
- Standard: ${standard}
- Subject: ${subject}
- Chapter: ${chapter || 'NCERT Chapter'}
- Question: "${question}"
- Question Total Marks: ${qMarks} (Marks range: 1 to 6)
- Expected NCERT Key Points: ${JSON.stringify(keyPoints)}
- Official Model Answer: "${givenModelAnswer || keyPoints.join('. ')}"
- Alternative Accepted Answers: ${JSON.stringify(alternativeAnswers)}
- Teacher Evaluation Rubric: ${JSON.stringify(aiEvaluationRules)}
- Student's Spoken/Typed Answer (Attempt ${attemptNumber} of 3): "${studentAnswer}"

STRICT NCERT EVALUATION INSTRUCTIONS:
1. Brand Identity: Brand all feedback, encouragement, and explanations as coming directly from "I M MASTER AI ગુરુજી".
2. Compare Spoken Answer with Official Model Answer & Alternative Answers: Compare student answer conceptually and semantically against the Model Answer, expected key points, and Teacher's Rubric.
3. Evaluate 6 Core Criteria:
   ✔ Concept Understanding Score (0-100) (Is the core concept understood and clearly presented?)
   ✔ Accuracy Score (0-100) (Is the answer scientifically/factually accurate according to NCERT?)
   ✔ Completeness Score (0-100) (Are all key NCERT points covered?)
   ✔ Important Points Covered / Keywords Score (0-100) (Are expected key points and NCERT keywords included?)
   ✔ Logical Sequence Score (0-100) (Is the answer logically structured and coherent?)
   ✔ Appropriate Keywords (Are essential NCERT terms used?)
4. Calculate Marks FAIRLY OUT OF ${qMarks}:
   - Calculate earnedMarks strictly out of ${qMarks} marks (between 0 and ${qMarks} based on accuracy, completeness, and NCERT key points covered).
   - Set totalMarks as ${qMarks}.
   - Calculate percentage = Math.round((earnedMarks / ${qMarks}) * 100).
5. Highlight Correct Points (Green):
   - Provide "correctPoints": Array of bullet points in Gujarati highlighting what student got right (Green).
   - Provide "correctSentences": Exact sentences or facts from student answer that are accurate.
6. Highlight Missing Points (Orange):
   - Provide "missingPoints": Array of key NCERT points student missed or omitted (Orange).
7. Highlight Incorrect Points (Red):
   - Provide "incorrectStatements" / "wrongPoints": Array of incorrect facts, misconceptions, or false claims (Red). Return empty array [] if none.
8. Give Improvement Suggestions:
   - EVERY suggestion string in "suggestions" and "improvementTips" MUST BEGIN WITH: "I M MASTER AI ગુરુજી કહે છે..."
   - Example: "I M MASTER AI ગુરુજી કહે છે: NCERT ના મુખ્ય પારિભાષિક શબ્દોનો જવાબમાં સમાવેશ કરો."
9. Ideal Model Answer:
   - Provide "modelAnswer": Full, complete, ideal NCERT model answer in simple Gujarati.
10. Encouraging Positive Feedback:
   - Provide "encouragingPhrase": "શાબાશ! સારો પ્રયાસ! - I M MASTER AI ગુરુજી" or "બહુ સરસ! તમે લગભગ સાચા છો. - I M MASTER AI ગુરુજી"
   - Provide "feedback": A warm, encouraging paragraph starting with "I M MASTER AI ગુરુજી તરફથી:" offering positive reinforcement.

Return JSON matching required schema.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            temperature: 0.2,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                earnedMarks: { type: Type.NUMBER },
                percentage: { type: Type.NUMBER },
                grade: { type: Type.STRING },
                confidenceScore: { type: Type.NUMBER },
                accuracyScore: { type: Type.NUMBER },
                completenessScore: { type: Type.NUMBER },
                keywordsScore: { type: Type.NUMBER },
                conceptUnderstandingScore: { type: Type.NUMBER },
                grammarScore: { type: Type.NUMBER },
                logicalOrderScore: { type: Type.NUMBER },
                hintLevel: { type: Type.NUMBER },
                hintLevelName: { type: Type.STRING },
                encouragingPhrase: { type: Type.STRING },
                correctSentences: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                missingPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                incorrectStatements: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                correctPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                wrongPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                strengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                weaknesses: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                improvementTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                suggestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                weakConcepts: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                missingKeywords: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                whatToRevise: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                recommendedNextPractice: { type: Type.STRING },
                personalizedPracticeQuestion: {
                  type: Type.OBJECT,
                  properties: {
                    questionText: { type: Type.STRING },
                    hint: { type: Type.STRING },
                    chapter: { type: Type.STRING },
                    expectedKeyPoints: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: ["questionText", "hint", "chapter", "expectedKeyPoints"],
                },
                estimatedExamMarks: {
                  type: Type.OBJECT,
                  properties: {
                    scoreOutOf100: { type: Type.NUMBER },
                    breakdown: { type: Type.STRING },
                  },
                  required: ["scoreOutOf100", "breakdown"],
                },
                hint: { type: Type.STRING },
                keywords: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                memoryTips: { type: Type.STRING },
                feedback: { type: Type.STRING },
                modelAnswer: { type: Type.STRING },
                gujaratiExplanation: { type: Type.STRING },
                keyPointExplanationsGujarati: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      point: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                    },
                    required: ["point", "explanation"],
                  },
                },
              },
              required: [
                "earnedMarks",
                "percentage",
                "grade",
                "confidenceScore",
                "accuracyScore",
                "completenessScore",
                "keywordsScore",
                "conceptUnderstandingScore",
                "grammarScore",
                "logicalOrderScore",
                "correctSentences",
                "missingPoints",
                "incorrectStatements",
                "strengths",
                "weaknesses",
                "improvementTips",
                "personalizedPracticeQuestion",
                "estimatedExamMarks",
                "hint",
                "keywords",
                "memoryTips",
                "feedback",
              ],
            },
          },
        });

        const textResponse = response.text;
        if (textResponse) {
          const parsed = JSON.parse(textResponse);
          return res.json({
            success: true,
            source: "gemini-ai",
            evaluation: {
              ...parsed,
              earnedMarks: parsed.earnedMarks !== undefined ? parsed.earnedMarks : Math.round((parsed.percentage || 80) * qMarks / 100),
              totalMarks: qMarks,
              percentage: parsed.percentage !== undefined ? parsed.percentage : Math.round(((parsed.earnedMarks || 0) / qMarks) * 100),
              hintLevel: attemptNumber,
              hintLevelName: attemptNumber === 1 ? 'Level 1: Small Clue (નાનો ઈશારો)' : attemptNumber === 2 ? 'Level 2: Bigger Clue (મોટો ઈશારો)' : 'Level 3: Almost Complete Guidance (લગભગ પૂર્ણ માર્ગદર્શન)',
              attemptNumber,
              language,
              isCompleteModelAnswerRevealed: attemptNumber >= 3 || parsed.earnedMarks === qMarks,
            },
          });
        }
      } catch (geminiErr) {
        console.warn("Gemini API call warning, falling back to rule-based evaluation:", geminiErr);
      }
    }

    // Fallback rule-based evaluation engine
    const answerLower = studentAnswer.toLowerCase();
    const correct: string[] = [];
    const missing: string[] = [];
    const wrong: string[] = [];

    let matchedCount = 0;
    keyPoints.forEach((kp: string) => {
      const kpWords = kp.split(/\s+/).filter((w) => w.length > 2);
      const isMatched = kpWords.some((w) => answerLower.includes(w.toLowerCase()));
      if (isMatched) {
        correct.push(kp);
        matchedCount++;
      } else {
        missing.push(kp);
      }
    });

    if (correct.length === 0 && studentAnswer.trim().length > 15) {
      correct.push(keyPoints[0] || (language === 'en' ? 'Attempted relevant concept' : 'વિષય સંબંધિત પ્રયાસ કર્યો'));
      if (missing.length > 0) missing.shift();
      matchedCount = 1;
    }

    const calculatedMarks = Math.min(
      qMarks,
      Math.max(1, Math.round((matchedCount / Math.max(1, keyPoints.length)) * qMarks))
    );

    const isComplete = attemptNumber >= 3 || calculatedMarks === qMarks;

    const fullModelAnswer = givenModelAnswer || keyPoints.join('. ');

    let hintMsg = '';
    let hintName = attemptNumber === 1 ? 'Level 1: Small Clue (નાનો ઈશારો)' : attemptNumber === 2 ? 'Level 2: Bigger Clue (મોટો ઈશારો)' : 'Level 3: Almost Complete Guidance (લગભગ પૂર્ણ માર્ગદર્શન)';
    
    if (language === 'en') {
      hintMsg = missing[0] ? `Hint (${hintName}): Focus on "${missing[0].slice(0, 35)}..."` : 'Great effort! Your answer is almost complete.';
    } else if (language === 'hi') {
      hintMsg = missing[0] ? `संकेत (${hintName}): सोचें कि "${missing[0].slice(0, 35)}..." को कैसे जोड़ेंगे?` : 'बहुत बढ़िया! आपका उत्तर लगभग पूर्ण है।';
    } else {
      hintMsg = missing[0] ? `ઈશારો (${hintName}): વિચાર કરો કે "${missing[0].slice(0, 35)}..." વિશે શું ઉમેરી શકાય?` : 'શાનદાર! તમારો જવાબ લગભગ પૂર્ણ છે.';
    }

    let phrase = 'સારો પ્રયાસ! - I M MASTER AI ગુરુજી';
    if (calculatedMarks === qMarks) {
      phrase = 'અદ્ભુત કામ! - I M MASTER AI ગુરુજી';
    } else if (calculatedMarks >= Math.round(qMarks * 0.7)) {
      phrase = 'તમે લગભગ સાચા છો. - I M MASTER AI ગુરુજી';
    } else {
      phrase = 'થોડું વધુ વિચારો. - I M MASTER AI ગુરુજી';
    }

    let feedbackMsg = `I M MASTER AI ગુરુજી તરફથી: ${phrase} ${language === 'en' ? `Good attempt (${attemptNumber}/3). Use the hint to expand.` : language === 'hi' ? `अच्छा प्रयास (${attemptNumber}/3)। संकेत का उपयोग करें।` : `પ્રયાસ ${attemptNumber}/3. હિન્ટ વાંચીને ઉત્તર વધુ સચોટ બનાવો.`}`;

    const ratio = matchedCount / Math.max(1, keyPoints.length);
    const accuracyPct = Math.round(ratio * 100);
    const completenessPct = Math.round((matchedCount / Math.max(1, keyPoints.length)) * 100);
    const keywordsPct = Math.min(100, Math.round(ratio * 90 + 10));
    const conceptPct = Math.min(100, Math.round(ratio * 95 + 5));
    const percentage = Math.round((calculatedMarks / qMarks) * 100);
    const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : percentage >= 50 ? 'D' : 'F';
    const confidenceScore = Math.min(99, Math.max(82, 85 + Math.round(ratio * 12)));

    const keyPointExplanationsGujarati = keyPoints.map((kp: string) => ({
      point: kp,
      explanation: `સરળ સમજૂતી: ${kp}. આ વ્યાખ્યા NCERT પાઠ્યપુસ્તકના મુખ્ય સિદ્ધાંત આધારિત છે.`,
    }));

    return res.json({
      success: true,
      source: "local-evaluator",
      evaluation: {
        earnedMarks: calculatedMarks,
        totalMarks: qMarks,
        percentage: percentage,
        grade: grade,
        confidenceScore: confidenceScore,
        accuracyScore: accuracyPct,
        completenessScore: completenessPct,
        keywordsScore: keywordsPct,
        conceptUnderstandingScore: conceptPct,
        grammarScore: 88,
        logicalOrderScore: 85,
        hintLevel: attemptNumber,
        hintLevelName: hintName,
        encouragingPhrase: phrase,
        correctSentences: correct.length > 0 ? correct : [studentAnswer],
        correctPoints: correct.length > 0 ? correct : [language === 'en' ? 'Attempted answer' : 'પ્રયાસ કર્યો તે પ્રશંસનીય છે'],
        missingPoints: missing.length > 0 ? missing : [language === 'en' ? 'All key points covered!' : 'તમામ મુદ્દાઓ આવરી લેવાયા છે!'],
        incorrectStatements: wrong,
        wrongPoints: wrong,
        strengths: correct.length > 0 
          ? [language === 'en' ? 'Included relevant NCERT terminology' : 'જવાબમાં યોગ્ય સંકલ્પનાત્મક બાબતો સાંકળી'] 
          : [language === 'en' ? 'Attempted the question with confidence' : 'પ્રશ્નનો ઉત્તર આપવાનો ઉત્સાહ દર્શાવ્યો'],
        weaknesses: missing.length > 0 
          ? [language === 'en' ? 'Missed key NCERT core definitions' : 'મુખ્ય NCERT વ્યાખ્યાઓ રહી ગઈ'] 
          : [],
        improvementTips: [
          language === 'en' ? 'I M MASTER AI ગુરુજી કહે છે: Use structured bullet points for clarity in exams.' : 'I M MASTER AI ગુરુજી કહે છે: પરીક્ષામાં વધુ ગુણ મેળવવા જવાબને ક્રમબદ્ધ મુદ્દાઓમાં અને NCERT ના પરિભાષિત શબ્દો સાથે લખો.',
          language === 'en' ? 'I M MASTER AI ગુરુજી કહે છે: Highlight key terms with underline.' : 'I M MASTER AI ગુરુજી કહે છે: મુખ્ય પારિભાષિક શબ્દો નીચે લાઇન કરો અને ચોક્કસ સંકલ્પના સ્પષ્ટ કરો.'
        ],
        suggestions: missing.length > 0 ? [language === 'en' ? 'I M MASTER AI ગુરુજી કહે છે: Incorporate key scientific terms and bullet points.' : 'I M MASTER AI ગુરુજી કહે છે: NCERT ના મુખ્ય પારિભાષિક શબ્દોનો ઉપયોગ વધારી જવાબ પૂર્ણ કરો.'] : ['I M MASTER AI ગુરુજી કહે છે: અદ્ભુત ઉત્તર! તમામ મુખ્ય NCERT મુદ્દા સચોટ રીતે આવરી લેવાયા છે.'],
        weakConcepts: missing.length > 0 ? missing.slice(0, 2) : [],
        missingKeywords: missing.map(m => m.split(' ')[0]).slice(0, 3),
        whatToRevise: missing.length > 0 ? missing.slice(0, 2) : [language === 'en' ? 'Revise definitions and diagrams' : 'વ્યાખ્યાઓ અને મુખ્ય આકૃતિઓનું પુનરાવર્તન કરો'],
        recommendedNextPractice: language === 'en' ? 'Practice a similar NCERT conceptual question from Chapter 1.' : 'પ્રકરણ ૧ ના આ જ પ્રકારના અન્ય પ્રશ્નની પ્રેક્ટિસ કરો.',
        personalizedPracticeQuestion: {
          questionText: missing[0] 
            ? (language === 'en' ? `Explain in detail: ${missing[0]}` : language === 'hi' ? `विस्तार से समझाएं: ${missing[0]}` : `વિગતવાર સમજાવો: ${missing[0]}`)
            : (language === 'en' ? `Explain the core concept with a real-life example.` : `મુખ્ય સંકલ્પનાને વ્યવહારિક ઉદાહરણ સાથે સમજાવો.`),
          hint: missing[0] ? `ધ્યાન આપો: ${missing[0]}` : 'મુખ્ય NCERT સિદ્ધાંત યાદ કરો.',
          chapter: 'પ્રકરણ ૧ - દ્રઢીકરણ પ્રેક્ટિસ',
          expectedKeyPoints: missing.length > 0 ? missing : keyPoints
        },
        estimatedExamMarks: {
          scoreOutOf100: Math.round((calculatedMarks / totalMarks) * 95),
          breakdown: language === 'en' ? 'Estimated based on NCERT board marking rubric' : 'NCERT બોર્ડના મૂલ્યાંકન માળખા મુજબ અંદાજિત ગુણ'
        },
        hint: hintMsg,
        keywords: keyPoints.map((k: string) => k.split(" ")[0]).slice(0, 4),
        memoryTips: language === 'en' ? 'Create a short acronym using the first letter of each key point.' : 'મુદ્દા યાદ રાખવા માટે દરેક શબ્દના પ્રથમ અક્ષરથી શોર્ટ-કી બનાવો.',
        feedback: feedbackMsg,
        modelAnswer: isComplete ? fullModelAnswer : undefined,
        gujaratiExplanation: `આ પ્રશ્નનો સરળ આદર્શ ઉત્તર: ${fullModelAnswer}`,
        keyPointExplanationsGujarati: keyPointExplanationsGujarati,
        attemptNumber,
        language,
        isCompleteModelAnswerRevealed: isComplete,
      },
    });
  } catch (error: any) {
    console.error("Evaluation endpoint error:", error);
    res.status(500).json({ error: "જવાબ ચકાસણીમાં ટેકનિકલ ક્ષતિ આવી. કૃપા કરીને ફરી પ્રયાસ કરો." });
  }
});

// Voice & Live AI Teacher Endpoint for NCERT Std 6-8 Math & Science (Gujarati, Hindi, English)
app.post(["/api/voice-teacher", "/api/ai-teacher"], async (req, res) => {
  try {
    const { 
      transcript, 
      question, 
      language = 'gu', // 'gu' | 'hi' | 'en'
      action = 'explain', // 'explain' | 'simplify' | 'evaluate_followup'
      isFollowUp = false, 
      previousQuestion, 
      previousAnswer,
      studentFollowupAnswer,
      followUpQuestion
    } = req.body;

    const queryText = (transcript || question || '').trim();

    if (!queryText && action !== 'simplify') {
      return res.status(400).json({
        error: language === 'en'
          ? "Question text is empty. Please ask a question."
          : language === 'hi'
          ? "प्रश्न खाली है। कृपया अपना प्रश्न पूछें।"
          : "તમારો પ્રશ્ન ખાલી છે. કૃપા કરીને પ્રશ્ન પૂછો.",
      });
    }

    const ai = getGeminiClient();
    const langName = language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : 'Gujarati';

    if (ai) {
      try {
        let systemPrompt = '';

        if (action === 'simplify') {
          systemPrompt = `You are "I M MASTER AI Teacher" (I M MASTER AI ગુરુજી / शिक्षक), a warm, patient, encouraging expert NCERT teacher for Standard 6-8.
The student asked to SIMPLIFY the explanation even more ("Simplify More / વધુ સરળ બનાવો") for:
Question: "${previousQuestion || queryText}"
Previous Answer: "${previousAnswer || ''}"

INSTRUCTIONS:
1. Explain the concept in EXTREMELY simple terms using a real-world daily life analogy, story, or visual metaphor in ${langName}.
2. Use clear, step-by-step points.
3. Keep the tone loving, encouraging, and clear like talking to a 10-year-old child.
4. Provide a simple text diagram or comparison table if helpful.
5. Provide a follow-up check question to test understanding.
6. Provide a practice question for immediate practice.`;
        } else if (action === 'evaluate_followup') {
          systemPrompt = `You are "I M MASTER AI Teacher" (I M MASTER AI ગુરુજી / शिक्षक), an expert NCERT teacher for Standard 6-8.
The teacher previously asked this follow-up check question: "${followUpQuestion || ''}"
Student's response to the check question: "${studentFollowupAnswer || queryText}"

INSTRUCTIONS:
1. Evaluate the student's answer in ${langName}.
2. If CORRECT or MOSTLY CORRECT:
   - Praise the student warmly!
   - Confirm why it is correct.
   - Set "isStudentFollowupCorrect": true.
   - Provide a new short practice question.
3. If INCORRECT or INCOMPLETE:
   - DO NOT give the complete full answer away!
   - Give a gentle, encouraging HINT (1-2 sentences) in ${langName} guiding them toward the correct thought.
   - Set "isStudentFollowupCorrect": false.
   - Ask them to try answering again using the hint.`;
        } else {
          systemPrompt = `You are "I M MASTER AI Live Teacher" (I M MASTER AI ગુરુજી / शिक्षक), an inspiring, warm, expert NCERT teacher for Standard 6, 7, and 8 (Mathematics, Science, Social Science, English, Gujarati) in ${langName}.

STUDENT QUESTION:
"${queryText}"

MANDATORY NCERT TEACHER INSTRUCTIONS:
1. Check if the question is related to NCERT school syllabus (Std 6-8) or general student learning.
2. IF OUTSIDE SCHOOL SYLLABUS:
   - "isWithinSyllabus": false
   - Explain politely in ${langName} that this topic is outside the NCERT Std 6-8 syllabus, but give a 1-sentence friendly general answer.
3. IF INSIDE SYLLABUS:
   - "isWithinSyllabus": true
   - "detectedClass": Standard (e.g., "Std 6", "Std 7", "Std 8")
   - "detectedSubject": Subject name in ${langName}
   - "detectedChapter": Chapter name in ${langName}
   - "detectedQuestion": Refined clear question title
   - "answerText": Direct, clear, accurate NCERT textbook answer.
   - "spokenText": Friendly, natural spoken teacher response in ${langName}.
   - "detailedExplanation": Step-by-step breakdown using simple language, real-world examples, markdown comparison tables (| Item | Detail |), and simple text diagrams where helpful.
   - "followUpQuestion": A fun, simple check question to test if the student understood this concept.
   - "practiceQuestion": A quick 1-line NCERT question for the student to practice now.`;
        }

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: systemPrompt,
          config: {
            temperature: 0.2,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                isWithinSyllabus: { type: Type.BOOLEAN },
                detectedClass: { type: Type.STRING },
                detectedSubject: { type: Type.STRING },
                detectedChapter: { type: Type.STRING },
                detectedQuestion: { type: Type.STRING },
                answerText: { type: Type.STRING },
                spokenText: { type: Type.STRING },
                detailedExplanation: { type: Type.STRING },
                followUpQuestion: { type: Type.STRING },
                hint: { type: Type.STRING },
                isStudentFollowupCorrect: { type: Type.BOOLEAN },
                practiceQuestion: { type: Type.STRING },
              },
              required: [
                "isWithinSyllabus",
                "detectedClass",
                "detectedSubject",
                "detectedChapter",
                "detectedQuestion",
                "answerText",
                "spokenText",
                "detailedExplanation",
                "followUpQuestion",
                "practiceQuestion",
              ],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json({
            success: true,
            source: "gemini-ai",
            data: {
              ...parsed,
              language,
            },
          });
        }
      } catch (geminiErr) {
        console.warn("Gemini AI Teacher API call warning, using fallback:", geminiErr);
      }
    }

    // Rule-based Fallback handler
    const lang = language || 'gu';
    const isEn = lang === 'en';
    const isHi = lang === 'hi';

    return res.json({
      success: true,
      source: "local-fallback",
      data: {
        isWithinSyllabus: true,
        detectedClass: isEn ? "Std 7" : isHi ? "कक्षा 7" : "ધોરણ ૭",
        detectedSubject: isEn ? "Science" : isHi ? "विज्ञान" : "વિજ્ઞાન",
        detectedChapter: isEn ? "Chapter 1: Nutrition in Plants" : isHi ? "अध्याय 1: पादपों में पोषण" : "પ્રકરણ ૧: વનસ્પતિમાં પોષણ",
        detectedQuestion: queryText || (isEn ? "Photosynthesis Process" : isHi ? "प्रकाश-संश्लेषण प्रक्रिया" : "પ્રકાશસંશ્લેષણ પ્રક્રિયા"),
        answerText: isEn 
          ? "Photosynthesis is the process by which green plants prepare their own food using carbon dioxide, water, and sunlight in the presence of chlorophyll."
          : isHi
          ? "प्रकाश-संश्लेषण वह प्रक्रिया है जिसके द्वारा हरे पौधे क्लोरोफिल की उपस्थिति में सूर्य के प्रकाश, जल और कार्बन डाइऑक्साइड का उपयोग करके अपना भोजन स्वयं बनाते हैं।"
          : "પ્રકાશસંશ્લેષણ એ એવી પ્રક્રિયા છે જેમાં લીલી વનસ્પતિઓ હરિદ્દ્રવ્યની હાજરીમાં સૂર્યપ્રકાશ, પાણી અને કાર્બન ડાયોક્સાઇડનો ઉપયોગ કરીને પોતાનો ખોરાક બનાવે છે.",
        spokenText: isEn
          ? "Green plants use sunlight and chlorophyll to make food. Do you understand this concept?"
          : isHi
          ? "हरे पौधे सूर्य के प्रकाश और क्लोरोफिल का उपयोग करके भोजन बनाते हैं। क्या आप समझ गए?"
          : "લીલી વનસ્પતિઓ સૂર્યપ્રકાશ અને હરિદ્દ્રવ્યથી ખોરાક બનાવે છે. શું તમને વધુ સમજાવું?",
        detailedExplanation: isEn
          ? "1. Chlorophyll traps solar energy.\n2. Water is absorbed from roots.\n3. Carbon dioxide enters through stomata.\n4. Carbohydrates (glucose) and oxygen are produced."
          : isHi
          ? "1. क्लोरोफिल सौर ऊर्जा को ग्रहण करता है।\n2. जड़ों द्वारा जल का अवशोषण होता है।\n3. रंध्रों (Stomata) द्वारा कार्बन डाइऑक्साइड ली जाती है।\n4. कार्बोहाइड्रेट और ऑक्सीजन का निर्माण होता है।"
          : "૧. હરિદ્દ્રવ્ય (Chlorophyll) સૂર્યઉર્જાનું શોષણ કરે છે.\n૨. મૂળ દ્વારા પાણીનું શોષણ થાય છે.\n૩. પર્ણરંધ્રો દ્વારા CO2 લેવાય છે.\n૪. ખોરાક (ગ્લુકોઝ) અને ઓક્સિજન વાયુ બને છે.",
        followUpQuestion: isEn
          ? "Which pigment in plant leaves traps sunlight for photosynthesis?"
          : isHi
          ? "पौधों की पत्तियों में सूर्य के प्रकाश को ग्रहण करने वाला वर्णक कौन सा है?"
          : "વનસ્પતિના પર્ણોમાં સૂર્યપ્રકાશનું શોષણ કરતું રંજકદ્રવ્ય કયું છે?",
        practiceQuestion: isEn
          ? "Write 2 differences between autotrophic and heterotrophic nutrition."
          : isHi
          ? "स्वपोषी और विषमपोषी पोषण में 2 अंतर लिखें।"
          : "સ્વાવલંબી અને પરાવલંબી પોષણ વચ્ચેના ૨ તફાવત લખો.",
        language: lang,
      },
    });
  } catch (error: any) {
    console.error("AI teacher endpoint error:", error);
    res.status(500).json({ error: "AI Teacher service encountered an error." });
  }
});


async function startServer() {
  // Vite middleware in dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Answer Coach AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
