import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Copy, RotateCcw } from 'lucide-react';

// TypeScript interfaces
interface BriefResponse {
  data: string;
}

interface ProcessingState {
  isProcessing: boolean;
  brief: BriefResponse | null;
}

// API call to improve the brief
const improveBrief = async (roughIdea: string): Promise<BriefResponse> => {
  
  let data = await fetch("https://promptengineergemini-test.up.railway.app", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        prompt: roughIdea
    })
  }).then(res => res.json());
  

  return data ;
};

const HeroSection: React.FC = () => {
  const [roughIdea, setRoughIdea] = useState<string>('');
  const [state, setState] = useState<ProcessingState>({
    isProcessing: false,
    brief: null
  });
  const [copied, setCopied] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roughIdea.trim()) return;

    setState({ isProcessing: true, brief: null });
    
    try {
      const improvedBrief = await improveBrief(roughIdea);
      setState({ isProcessing: false, brief: improvedBrief });
      window.scrollTo({ top: ref.current ? ref.current.offsetTop : 0, behavior: 'smooth' });
      console.log(ref.current?.offsetHeight);
    } catch (error) {
      console.error('Error improving brief:', error);
      setState({ isProcessing: false, brief: null });
    }
  };

  const handleCopy = () => {
    if (state.brief) {
      navigator.clipboard.writeText(state.brief.data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setState({ isProcessing: false, brief: null });
    setRoughIdea('');
  };
  
  useEffect(() => {
    window.scrollTo({ top: ref ? ref.current?.offsetTop : 0, behavior: 'smooth' });
  })
  
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 font-medium text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Brief Generator</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Turn Your Vague Idea
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-blue-600">
              Into a Clear Website Brief
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Just describe what you want in a few words. We'll transform it into a detailed, 
            actionable brief that developers can work with.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <textarea
                value={roughIdea}
                onChange={(e) => setRoughIdea(e.target.value)}
                placeholder="E.g., portfolio site for photographer, online store for jewelry, blog about tech..."
                className="w-full px-6 py-5 text-lg rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none bg-white shadow-sm"
                rows={3}
                disabled={state.isProcessing}
              />
              <div className="absolute bottom-4 right-4 text-sm text-slate-400">
                {roughIdea.length}/200
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!roughIdea.trim() || state.isProcessing}
              className="mt-4 w-full sm:w-auto px-8 py-4 bg-linear-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mx-auto sm:mx-0"
            >
              {state.isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Brief...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Brief</span>
                </>
              )}
            </button>
          </form>

          {/* Example prompts */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <span className="text-sm text-slate-500">Try:</span>
            {['ecommerce store', 'portfolio site', 'restaurant website', 'saas landing page'].map((example) => (
              <button
                key={example}
                onClick={() => setRoughIdea(example)}
                className="px-3 py-1 text-sm bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-slate-600"
                disabled={state.isProcessing}
              >
                {example}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {state.brief && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
              ref={ref}
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-slate-100">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-linear-to-br from-indigo-500 to-blue-500 rounded-xl">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                      Your Website Brief
                    </h2>
                  </div>
                </div>
                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row mb-5 gap-3"
                >
                  <button
                    onClick={handleReset}
                    className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Start Over</span>
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex-1 px-6 py-3 bg-linear-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                  >
                    <Copy className="w-5 h-5" />
                    <span>{copied ? 'Copied!' : 'Copy Brief'}</span>
                  </button>
                </motion.div>

                {/* Brief Content */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {state.brief.data}
                    </p>
                  </div>
                </motion.div>

                {/* JSON Preview (Optional) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 pt-6 border-t border-slate-200"
                >
                  <details className="group">
                    <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700 flex items-center gap-2">
                      <span className="transform group-open:rotate-90 transition-transform">▶</span>
                      View as JSON
                    </summary>
                    <div className="mt-3 bg-slate-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-green-400 font-mono">
                        {JSON.stringify(state.brief, null, 2)}
                      </pre>
                    </div>
                  </details>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeroSection;