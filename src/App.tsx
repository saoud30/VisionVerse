import React, { useState } from 'react';
import { Header } from './components/Header';
import { SearchInput } from './components/SearchInput';
import { Sources } from './components/Sources';
import { Answer } from './components/Answer';
import { SimilarTopics } from './components/SimilarTopics';
import { QuestionDisplay } from './components/QuestionDisplay';
import { FileAnalysis } from './components/FileAnalysis';
import { GeneratedImage } from './components/GeneratedImage';
import { searchGoogle, getAnswer, getSimilarTopics } from './services/api';
import { analyzeImage, detectObjects, explainCode, generateImage } from './services/huggingface';
import { Footer } from './components/Footer';
import { toast } from 'react-hot-toast';

const EXAMPLE_QUESTIONS = [
  "What's the future of brain-computer interfaces?",
  "Will quantum computing revolutionize cybersecurity?",
  "What are the most groundbreaking AI discoveries of 2024?"
];

function App() {
  const [loading, setLoading] = useState(false);
  const [promptValue, setPromptValue] = useState('');
  const [fileAnalysis, setFileAnalysis] = useState<{
    type: 'image' | 'code';
    content: string;
    metadata?: any;
  } | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [searchResults, setSearchResults] = useState<{
    question: string;
    sources: Array<{ title: string; link: string; snippet: string }>;
    answer: string;
    similarTopics: string[];
  } | null>(null);
  const [generatedImage, setGeneratedImage] = useState<{
    url: string;
    prompt: string;
  } | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setPromptValue('');
    setGeneratedImage(null);
    
    try {
      if (query.startsWith('@')) {
        const imagePrompt = query.slice(1).trim();
        const imageUrl = await generateImage(imagePrompt);
        setGeneratedImage({ url: imageUrl, prompt: imagePrompt });
        setSearchResults(null);
      } else {
        const sources = await searchGoogle(query);
        const [answer, similarTopics] = await Promise.all([
          getAnswer(query, sources),
          getSimilarTopics(query),
        ]);

        setSearchResults({
          question: query,
          sources,
          answer,
          similarTopics,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(message);
      console.error('Operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setCurrentFile(file);
    try {
      if (file.type.startsWith('image/')) {
        const [analysis, objects] = await Promise.all([
          analyzeImage(URL.createObjectURL(file), 'Describe this image in detail.'),
          detectObjects(file)
        ]);
        setFileAnalysis({
          type: 'image',
          content: analysis,
          metadata: { objects }
        });
      } else if (file.name.endsWith('.js') || file.name.endsWith('.ts')) {
        const text = await file.text();
        const explanation = await explainCode(text);
        setFileAnalysis({
          type: 'code',
          content: explanation
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to analyze file';
      toast.error(message);
      console.error('File analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSearchResults(null);
    setPromptValue('');
    setFileAnalysis(null);
    setCurrentFile(null);
    setGeneratedImage(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header showBackButton={!!searchResults || !!fileAnalysis || !!generatedImage} onBack={reset} />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {!searchResults && !fileAnalysis && !generatedImage ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
            <div className="flex flex-col items-center gap-2">
              <a
                href="https://www.together.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm hover:bg-white/20 transition-all text-white/90"
              >
                Powered by Together AI
              </a>
              <h1 className="text-6xl font-bold text-center mt-4 text-white">
                Turn Questions into Discoveries
              </h1>
              <p className="text-white/80 text-center mt-2">
                Start with @ to generate images, or just type to search
              </p>
            </div>
            
            <div className="w-full max-w-2xl">
              <SearchInput
                value={promptValue}
                onChange={setPromptValue}
                onSearch={handleSearch}
                onFileUpload={handleFileUpload}
                disabled={loading}
              />
              
              <div className="mt-6 flex flex-col gap-2">
                <div className="flex justify-center gap-2">
                  {EXAMPLE_QUESTIONS.slice(0, 2).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(question)}
                      className="px-4 py-2 text-sm bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all flex-1 max-w-xs text-white/90"
                    >
                      {question}
                    </button>
                  ))}
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => handleSearch(EXAMPLE_QUESTIONS[2])}
                    className="px-4 py-2 text-sm bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all max-w-xs w-2/3 text-white/90"
                  >
                    {EXAMPLE_QUESTIONS[2]}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-4">
            {searchResults && (
              <>
                <QuestionDisplay question={searchResults.question} />
                <Sources sources={searchResults.sources} isLoading={loading} />
                <Answer content={searchResults.answer} />
                <SimilarTopics 
                  topics={searchResults.similarTopics} 
                  onTopicClick={handleSearch}
                  onReset={reset}
                />
              </>
            )}
            {fileAnalysis && currentFile && (
              <FileAnalysis file={currentFile} analysis={fileAnalysis} />
            )}
            {generatedImage && (
              <GeneratedImage 
                imageUrl={generatedImage.url} 
                prompt={generatedImage.prompt} 
              />
            )}
            <div className="mt-6">
              <SearchInput
                value={promptValue}
                onChange={setPromptValue}
                onSearch={handleSearch}
                onFileUpload={handleFileUpload}
                disabled={loading}
              />
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;