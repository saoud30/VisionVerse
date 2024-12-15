'use client';

import { useState } from 'react';
import { Sparkles, Image, Camera, Instagram, Box } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GenerateImage } from '@/components/image-generation/GenerateImage';
import { ImageAnalysis } from '@/components/image-analysis/ImageAnalysis';
import { InstagramCaption } from '@/components/instagram-caption/InstagramCaption';
import { ThreeDImage } from '@/components/3d-image/ThreeDImage';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-purple-950">
      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block glass-effect p-2 rounded-2xl mb-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight floating">
              Vision<span className="text-purple-400">Era</span>
              <Sparkles className="inline-block ml-2 h-8 w-8 text-purple-400" />
            </h1>
          </div>
          
          <p className="text-xl sm:text-2xl text-white/80 max-w-2xl mx-auto">
            Transform your ideas into reality with our advanced AI-powered image tools
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button 
              onClick={() => scrollToSection('tools')}
              className="glass-button text-lg py-6 px-8"
            >
              Get Started
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            <div className="glass-card p-6 text-center">
              <Image className="mx-auto h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-white font-semibold">Image Generation</h3>
            </div>
            <div className="glass-card p-6 text-center">
              <Camera className="mx-auto h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-white font-semibold">Image Analysis</h3>
            </div>
            <div className="glass-card p-6 text-center">
              <Instagram className="mx-auto h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-white font-semibold">Instagram Captions</h3>
            </div>
            <div className="glass-card p-6 text-center">
              <Box className="mx-auto h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-white font-semibold">3D Generation</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="min-h-screen py-16 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Tabs defaultValue="generate" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 glass-card">
              <TabsTrigger value="generate" className="text-white data-[state=active]:bg-white/20">
                Generate Image
              </TabsTrigger>
              <TabsTrigger value="classify" className="text-white data-[state=active]:bg-white/20">
                Analyze Images
              </TabsTrigger>
              <TabsTrigger value="instagram" className="text-white data-[state=active]:bg-white/20">
                Instagram Caption
              </TabsTrigger>
              <TabsTrigger value="3d" className="text-white data-[state=active]:bg-white/20">
                3D Image
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate">
              <GenerateImage />
            </TabsContent>

            <TabsContent value="classify">
              <ImageAnalysis />
            </TabsContent>

            <TabsContent value="instagram">
              <InstagramCaption />
            </TabsContent>

            <TabsContent value="3d">
              <ThreeDImage />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}