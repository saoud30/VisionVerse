import React from 'react';
import { Github, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="container mx-auto px-4 py-6 text-white/80">
      <div className="flex items-center justify-between">
        <p className="text-sm">© 2024 AI-Sink. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a
            href="https://twitter.com/Shazyansar"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/Saoud30"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}