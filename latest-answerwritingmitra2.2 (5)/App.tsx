
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { EXAM_OPTIONS, PAPER_TYPE_OPTIONS, PAPER_OPTIONS_MAP, UPSC_OPTIONAL_SUBJECT_PAPERS } from './constants';
import type { EvaluationConfig } from './types';
import { evaluateAnswerStream } from './services/geminiService';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import Select from './components/ui/Select';
import Input from './components/ui/Input';
import Textarea from './components/ui/Textarea';
import MarkdownRenderer from './components/MarkdownRenderer';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import AdBanner from './components/AdBanner';
import Logo from './components/Logo';

const App: React.FC = () => {
  const [config, setConfig] = useState<EvaluationConfig>({
    exam: EXAM_OPTIONS[0],
    phase: PAPER_TYPE_OPTIONS[0], // 'phase' internally maps to paper type
    paper: '',
    section: '',
    question: '',
    marks: 10,
    wordLimit: 150,
  });
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [customPaperName, setCustomPaperName] = useState('');
  
  const evaluationPanelRef = useRef<HTMLDivElement>(null);

  const paperOptions = useMemo(() => {
      const options = PAPER_OPTIONS_MAP[config.exam]?.[config.phase];
      if (options && options.length > 0) {
          return [...options, 'Other'];
      }
      return null;
  }, [config.exam, config.phase]);

  const finalPaperName = useMemo(() => (
      paperOptions && config.paper === 'Other' ? customPaperName : config.paper
  ), [paperOptions, config.paper, customPaperName]);

  useEffect(() => {
    if (evaluationPanelRef.current) {
        evaluationPanelRef.current.scrollTop = evaluationPanelRef.current.scrollHeight;
    }
  }, [evaluation]);

  useEffect(() => {
    setConfig(prev => {
        const currentPaperOptions = PAPER_OPTIONS_MAP[prev.exam]?.[prev.phase];
        let newPaper = prev.paper;
        let newSection = prev.section;

        if (currentPaperOptions && currentPaperOptions.length > 0) {
            const validOptions = [...currentPaperOptions, 'Other'];
            if (!validOptions.includes(prev.paper)) {
                newPaper = currentPaperOptions[0];
            }
        } else if (!currentPaperOptions) {
             if (prev.paper === 'Other') newPaper = '';
        }

        // Reset section when switching to/from Optional Subject
        if (prev.phase === 'Optional Subject' && newPaper !== prev.paper) {
            newSection = UPSC_OPTIONAL_SUBJECT_PAPERS[0];
        } else if (prev.phase !== 'Optional Subject') {
            // Keep section if it's just text, or reset if needed
        }
        
        return { ...prev, paper: newPaper, section: newSection };
    });
  }, [config.exam, config.phase]);


  const handleConfigChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'paper' && value !== 'Other') {
        setCustomPaperName('');
    }

    if (name === 'phase' && value === 'Optional Subject') {
       setConfig(prev => ({
           ...prev,
           phase: value,
           section: UPSC_OPTIONAL_SUBJECT_PAPERS[0]
       }));
    } else {
        setConfig(prev => ({
           ...prev, 
           [name]: name === 'marks' || name === 'wordLimit' ? Number(value) : value 
        }));
    }
  }, []);

  const handleEvaluate = useCallback(async () => {
    if (!answer.trim() || !config.question.trim() || !finalPaperName.trim()) {
      setError("Please fill in the Question/Topic, Paper Name, and your Answer.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setEvaluation('');
    
    const phaseMap: { [key: string]: string } = {
        "Descriptive Paper": "Mains",
        "Essay": "Essay",
        "Optional Subject": "Optional",
        "Case Study": "Mains"
    };

    const evalConfig = { 
        ...config, 
        paper: finalPaperName,
        phase: phaseMap[config.phase] || config.phase,
    };

    evaluateAnswerStream(
      evalConfig,
      answer,
      (chunk) => setEvaluation(prev => prev + chunk),
      (err) => setError(err.message || 'An unexpected error occurred.'),
      () => setIsLoading(false)
    );
  }, [config, answer, finalPaperName]);
  
  const isFormInvalid = !answer.trim() || !config.question.trim() || !finalPaperName.trim() || config.marks <= 0 || config.wordLimit <= 0;
  const isOptionalSelected = config.phase === 'Optional Subject';

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-200 p-4 sm:p-6 lg:p-8 font-sans">
      <PrivacyPolicyModal 
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
      <header className="mb-12">
        <div className="flex justify-center items-center gap-4">
            <Logo className="h-12 w-12" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400 tracking-tight">
                AnswerWritingMitra
            </h1>
        </div>
        <p className="mt-3 text-center text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Your free AI answer evaluation partner for mastering answer writing in UPSC, State PCS, and other exams
        </p>
      </header>
      
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-screen-xl mx-auto">
        <div className="flex flex-col gap-8">
          <Card>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">1. Configure Your Test</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Examination Type" name="exam" value={config.exam} onChange={handleConfigChange} options={EXAM_OPTIONS} />
              <Select label="Paper Type" name="phase" value={config.phase} onChange={handleConfigChange} options={PAPER_TYPE_OPTIONS} />
              
              {paperOptions ? (
                  <Select label={isOptionalSelected ? "Optional Subject" : "Paper Name"} name="paper" value={config.paper} onChange={handleConfigChange} options={paperOptions} required />
              ) : (
                  <Input label="Paper Name" name="paper" value={config.paper} onChange={handleConfigChange} placeholder="e.g., Modern History" required />
              )}
              
              {isOptionalSelected ? (
                <Select label="Paper Number" name="section" value={config.section} onChange={handleConfigChange} options={UPSC_OPTIONAL_SUBJECT_PAPERS} />
              ) : paperOptions && config.paper === 'Other' ? (
                <Input label="Specify Paper Name" name="customPaperName" value={customPaperName} onChange={(e) => setCustomPaperName(e.target.value)} placeholder="Enter custom paper name" required />
              ) : (
                <Input label="Section (Optional)" name="section" value={config.section} onChange={handleConfigChange} placeholder="Section A" />
              )}

              <Input label="Marks Allotted" name="marks" type="number" value={config.marks} onChange={handleConfigChange} required />
              <Input label="Word Limit" name="wordLimit" type="number" value={config.wordLimit} onChange={handleConfigChange} required />
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">2. Enter Question & Answer</h2>
            <div className="space-y-6">
              <Textarea label="Question / Topic" name="question" value={config.question} onChange={handleConfigChange} placeholder="Paste the full question here..." rows={3} required />
              <Textarea label="Your Answer / Essay" name="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Paste your complete answer here..." rows={15} required />
            </div>
          </Card>
          
          <div className="sticky bottom-0 py-4 bg-gray-50/80 dark:bg-gray-900/60 backdrop-blur-sm lg:static lg:p-0 lg:bg-transparent z-10">
             <Button onClick={handleEvaluate} isLoading={isLoading} disabled={isFormInvalid} className="w-full">
                {isLoading ? 'Evaluating...' : 'Evaluate My Answer'}
             </Button>
          </div>

        </div>

        <div className="lg:sticky top-8 self-start">
            <Card className="h-full">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">AI Evaluation</h2>
                 <div ref={evaluationPanelRef} className="h-[calc(100vh-200px)] lg:h-[calc(100vh-140px)] overflow-y-auto pr-4 -mr-4 custom-scrollbar">
                    {isLoading && !evaluation && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 animate-pulse">
                            <div className="w-16 h-16 mb-4 rounded-full bg-blue-500/20"></div>
                            <p className="font-medium text-lg">Generating feedback...</p>
                            <p className="text-sm">The AI is analyzing your answer.</p>
                        </div>
                    )}
                    {error && (
                      <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600/50 rounded-lg">
                          <p className="text-red-700 dark:text-red-200 font-semibold">An Error Occurred</p>
                          <p className="text-red-600 dark:text-red-300 mt-1">{error}</p>
                      </div>
                    )}
                    {!isLoading && !error && !evaluation && (
                      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <p className="font-medium text-lg">Your detailed evaluation will appear here</p>
                        <p className="text-sm max-w-sm mt-1">Complete the form on the left and click 'Evaluate My Answer' to see the magic happen.</p>
                      </div>
                    )}
                    {evaluation && <MarkdownRenderer content={evaluation} />}
                  </div>
            </Card>
        </div>
      </main>

      <div className="max-w-screen-xl mx-auto mt-8">
        <AdBanner />
      </div>

      <footer className="text-center mt-12 py-8 border-t border-gray-200 dark:border-gray-700/50">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              ABHISHEK ANAND
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
             Your friend in answer writing excellence.
          </p>

          <div className="mt-6">
            <a 
              href="https://www.buymeacoffee.com/abhishekanand" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-yellow-400 rounded-lg shadow-lg hover:from-orange-600 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105"
            >
              <i className="hi-solid hi-gift h-5 w-5"></i>
              <span>Support with a Coffee</span>
            </a>
          </div>

          <div className="mt-6 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-gray-600 dark:text-gray-400">
            <a href="mailto:abhishekanand1official@gmail.com" className="group flex items-center gap-2 hover:text-blue-500 transition-colors">
                <i className="hi-solid hi-envelope h-5 w-5"></i>
                <span className="group-hover:underline">abhishekanand1official@gmail.com</span>
            </a>
             <a href="mailto:anandabhishek9879@gmail.com" className="group flex items-center gap-2 hover:text-blue-500 transition-colors">
                <i className="hi-solid hi-envelope h-5 w-5"></i>
                <span className="group-hover:underline">anandabhishek9879@gmail.com</span>
            </a>
             <button onClick={() => setIsPrivacyOpen(true)} className="group flex items-center gap-2 hover:text-blue-500 transition-colors">
                <i className="hi-solid hi-shield-check h-5 w-5"></i>
                <span className="group-hover:underline">Privacy Policy</span>
            </button>
          </div>
      </footer>
    </div>
  );
};

export default App;
