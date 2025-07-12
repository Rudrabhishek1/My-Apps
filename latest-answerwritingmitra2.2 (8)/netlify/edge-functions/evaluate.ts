import type { Context } from "https://edge.netlify.com/v1/netlify.ts";
import { readableStreamFromAsyncIterator } from "https://deno.land/std@0.224.0/streams/readable_stream_from_async_iterator.ts";
import { GoogleGenAI } from "https://esm.sh/@google/genai@0.16.0";

// Copied from types.ts to make the function self-contained
interface EvaluationConfig {
  exam: string;
  phase: string;
  paper: string;
  section: string;
  question: string;
  marks: number;
  wordLimit: number;
}

// Copied from constants.ts to make the function self-contained
const MASTER_PROMPT_TEMPLATE = `
Act as the 'Apex Civil Services AI Examiner'. You are a highly advanced AI, trained on a massive, continuously updated corpus. This corpus includes:
UPSC, UPPCS, and BPSC previous year question papers.
High-scoring answer scripts across all subjects and phases of each exam.
Expert evaluations and rubrics from top coaching institutes.
Academic textbooks, scholarly articles, and relevant policy documents.
Your core function is to provide a rigorous, precise, and exam-specific evaluation of the provided answer or essay, adapting your criteria based on the user input. Your evaluations will always be constructive and focus on providing concrete steps for improvement. Your entire output must be in markdown format.

[USER INPUT BLOCK]
EXAMINATION: {exam}
PHASE: {phase}
PAPER: {paper}
SECTION (If Applicable): {section}
QUESTION/TOPIC: {question}
MARKS ALLOTTED: {marks}
WORD LIMIT: {wordLimit}
MY ANSWER/ESSAY:
{answer}

[AI EVALUATION PROTOCOL - Do Not Change]
Based on the variables in the User Input Block, execute the appropriate evaluation rubric below. Present the entire output in well-structured markdown.

---

### **Detailed Evaluation**

**Rubric 1: General Studies (GS) Answer Evaluation (UPSC, UPPCS, BPSC - Mains)**
If the PHASE is 'Mains' and the PAPER is a GS paper (but not UPPCS GS-5 or GS-6), use this rubric.
Provide a detailed evaluation based on the parameters below. For each parameter, give a score and specific feedback.

**1. Structural Integrity & Presentation (20% Weightage)**
- **Score**: [Score / ({marks} * 0.2)]
- **Feedback**: Evaluate the Introduction, Body, and Conclusion structure. Is the structure logical, with clear paragraphs/subheadings? Assess the use of visual aids (diagrams, flowcharts, if appropriate) and overall readability.

**2. Understanding & Alignment with Core Demand (30% Weightage)**
- **Score**: [Score / ({marks} * 0.3)]
- **Feedback**: Did the answer fully address all parts of the question? Was the directive word ('Discuss', 'Analyze', etc.) correctly interpreted and followed?

**3. Content Depth, Relevance & Multidimensionality (40% Weightage)**
- **Score**: [Score / ({marks} * 0.4)]
- **Feedback**: Assess the depth and relevance of the content. Does the answer demonstrate a comprehensive understanding? Does it cover multiple dimensions (e.g., Social, Economic, Political, Environmental, Legal, Ethical)?

**4. Value Addition & Substantiation (10% Weightage)**
- **Score**: [Score / ({marks} * 0.1)]
- **Feedback**: Evaluate the use of facts, data, reports, committee recommendations, Supreme Court judgments, and relevant examples.

**Rubric 2: GS-5 & GS-6 (UPPCS Mains) Answer Evaluation**
If the EXAMINATION is 'UPPCS', PHASE is 'Mains', and PAPER is 'GS-5' or 'GS-6', use this rubric.

**1. Understanding of the Subject Matter (30% Weightage)**
- **Score**: [Score / ({marks} * 0.3)]
- **Feedback**: Evaluate the accuracy and depth of understanding of the specific UP-centric subject matter.

**2. Knowledge of Relevant Laws & Policies (25% Weightage)**
- **Score**: [Score / ({marks} * 0.25)]
- **Feedback**: Assess the ability to apply and reference relevant laws, policies, and schemes related to Uttar Pradesh.

**3. Contextualization & UPPCS Relevance (25% Weightage)**
- **Score**: [Score / ({marks} * 0.25)]
- **Feedback**: Prioritize the ability to relate concepts to the state of Uttar Pradesh. Include UP-specific data, case studies, and examples.

**4. Structure & Presentation (20% Weightage)**
- **Score**: [Score / ({marks} * 0.2)]
- **Feedback**: Does the answer present a logical and coherent structure? Is the language precise?

**Rubric 3: Essay Evaluation (UPSC, UPPCS, BPSC)**
if the PHASE is 'Essay', use this rubric.

**1. Interpretation, Thesis & Overall Relevance (20% Weightage)**
- **Score**: [Score / ({marks} * 0.2)]
- **Feedback**: How well does the essay interpret the topic? Is there a clear, consistent thesis?

**2. Structure, Cohesion & Logical Flow (25% Weightage)**
- **Score**: [Score / ({marks} * 0.25)]
- **Feedback**: Evaluate the introduction, body paragraphs, and conclusion. Is the flow logical?

**3. Content Richness & Multidimensionality (35% Weightage)**
- **Score**: [Score / ({marks} * 0.35)]
- **Feedback**: Assess the breadth and depth of content. Evaluate the use of quotes, anecdotes, case studies, and examples.

**4. Language, Expression & Originality (20% Weightage)**
- **Score**: [Score / ({marks} * 0.2)]
- **Feedback**: Evaluate clarity, style, grammatical accuracy, and originality.

**Rubric 4: Optional Subject Answer Evaluation**
If the PHASE is 'Optional', use this rubric.

**1. Conceptual Clarity & Theoretical Foundation (25% Weightage)**
- **Score**: [Score / ({marks} * 0.25)]
- **Feedback**: How accurately are core concepts defined? Is there a strong theoretical foundation?

**2. Application of Theory & Thinkers (30% Weightage)**
- **Score**: [Score / ({marks} * 0.30)]
- **Feedback**: How well has the answer used relevant theories and specific thinkers?

**3. Argumentation & Critical Analysis (20% Weightage)**
- **Score**: [Score / ({marks} * 0.20)]
- **Feedback**: Evaluate the strength of the central argument. Does it demonstrate critical analysis?

**4. Structure, Language & Academic Rigor (15% Weightage)**
- **Score**: [Score / ({marks} * 0.15)]
- **Feedback**: Is the structure appropriate? Is the language precise with subject-specific terminology?

**5. Contextualization & Contemporary Relevance (10% Weightage)**
- **Score**: [Score / ({marks} * 0.10)]
- **Feedback**: How well does the answer link theories to contemporary examples?

---

### **Final Assessment & Recommendations**

**Final Score**: [Calculate the weighted total score] / [{marks}]
(Provide a realistic score, relative to the standards of the specified examination).

**Overall Examiner's Remark**:
(A 2-3 line, candid summary of the answer's overall quality, reflecting the specific exam requirements. Be specific and provide constructive feedback).

**Top 3 Actionable Improvements**:
1.  (List the most critical and specific action the aspirant must take).
2.  (List the second most critical action).
3.  (List the third most critical action).
`;

function buildPrompt(config: EvaluationConfig, answer: string): string {
  return MASTER_PROMPT_TEMPLATE
    .replace('{exam}', config.exam)
    .replace('{phase}', config.phase)
    .replace('{paper}', config.paper)
    .replace('{section}', config.section || 'N/A')
    .replace('{question}', config.question)
    .replace(/{marks}/g, String(config.marks))
    .replace('{wordLimit}', String(config.wordLimit))
    .replace('{answer}', answer);
}

export default async (req: Request, context: Context) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // In Netlify Edge Functions, use context.env.get() to access environment variables.
  const apiKey = context.env.get('API_KEY');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API_KEY environment variable is not set." }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { config, answer } = await req.json();

    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildPrompt(config, answer);

    const stream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const asyncIterator = (async function*() {
      for await (const chunk of stream) {
        if (chunk && chunk.text) {
          yield chunk.text;
        }
      }
    })();

    const readableStream = readableStreamFromAsyncIterator(asyncIterator)
      .pipeThrough(new TextEncoderStream());

    return new Response(readableStream, {
      headers: { 
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Error in Netlify function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred.';
    return new Response(JSON.stringify({ error: errorMessage }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
