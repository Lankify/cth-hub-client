import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts';
import {Dashboard, HotelRates} from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="hotels" element={<HotelRates />} />
          {/* Add more pages as needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
