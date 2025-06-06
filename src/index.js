import React from 'react';
import ReactDOM from 'react-dom/client';
import LisbonJobOpportunityLanding from './LisbonJobOpportunityLanding';

const loading = document.getElementById('loading');
if (loading) {
  loading.remove();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LisbonJobOpportunityLanding />
  </React.StrictMode>
);
