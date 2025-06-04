
import React from 'react';
import { Header } from './Header';
import { Tutorial } from './Tutorial';
import { useScrumContext } from '../context/ScrumContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { scrumData } = useScrumContext();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4">
        {scrumData.showTutorial && <Tutorial />}
        <div className="mt-4">
          {children}
        </div>
      </main>
      <footer className="bg-secondary py-4 text-center text-muted-foreground">
        <p>Desenvolvido por Robson Calheira © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};
