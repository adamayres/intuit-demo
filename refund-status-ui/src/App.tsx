import './App.css';
import { RefundStatusPage } from '@/pages/RefundStatusPage.tsx';
import { Navbar } from '@/components/Navbar.tsx';
import { ThemeProvider } from '@/components/ThemeProvider.tsx';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-muted text-muted-foreground">
        <Navbar />
        <main>
          <RefundStatusPage />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
