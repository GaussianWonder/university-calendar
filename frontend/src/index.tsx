import '@unocss/reset/tailwind.css';
import 'uno.css';
import './assets/index.css';
import "quill/dist/quill.snow.css";
import { render } from 'solid-js/web';

import App from './App';
import { Router } from 'solid-app-router';

render(() => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById('root') as HTMLElement
);
