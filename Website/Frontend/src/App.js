import './App.css';
import {HashRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages';
import FaqPage from './pages/faq';
import ChiSiamo from './pages/chiSiamo';
import NewsPage from './pages/news';
import PrenotazionePage from './pages/prenotazione';
import AccediPage from './pages/accedi';
import RegistrazionePage from './pages/registrazione';
import MappaRisultatiPage from './pages/mappaRisultati'
import PrenotazioneInfoAggPage from './pages/prenotazioneInformazioniAggiuntive';
import Pagamento from './pages/pagamento';
import ProfiloPage from './pages/profilo';
import ConfermaPrenotazionePage from './pages/confermaPrenotazione';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/chisiamo" element={<ChiSiamo/>} exact />
        <Route path="/news" element={<NewsPage/>} exact />
        <Route path="/faq" element={<FaqPage />} exact />
        <Route path="/prenotazione" element={<PrenotazionePage />} exact />
        <Route path="/accedi" element={<AccediPage />} exact />
        <Route path="/registrazione" element={<RegistrazionePage />} exact />
        <Route path="/mapparisultati" element={<MappaRisultatiPage />} exact />
        <Route path="/prenotazioneinformazioniaggiuntive" element={<PrenotazioneInfoAggPage />} exact />
        <Route path="/pagamento" element={<Pagamento />} exact />
        <Route path="/profilo" element={<ProfiloPage />} exact />
        <Route path="/confermaPrenotazione" element={<ConfermaPrenotazionePage />} exact />
      </Routes>
    </Router>
  );
}

export default App;
