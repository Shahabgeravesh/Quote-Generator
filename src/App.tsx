import React, { useState } from 'react';
import './App.css';
import QuoteForm from './components/QuoteForm';
import QuotePreview from './components/QuotePreview';

function App() {
  const [quoteData, setQuoteData] = useState({
    date: '',
    managerName: '',
    re: '',
    body: '',
    taxPercentage: '',
    tableData: [
      { time: '', description: '', quantity: '', unitPrice: '', total: '' }
    ]
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleFormSubmit = (data: any) => {
    setQuoteData(data);
    setShowPreview(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <img src="/allie-universal-logo.png" alt="Allie Universal" className="header-logo" />
          <h1>Quote Generator</h1>
        </div>
      </header>
      <main>
        {!showPreview ? (
          <QuoteForm onSubmit={handleFormSubmit} initialData={quoteData} />
        ) : (
          <QuotePreview 
            data={quoteData} 
            onBack={() => setShowPreview(false)}
            onEdit={(data) => {
              setQuoteData(data);
              setShowPreview(false);
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
