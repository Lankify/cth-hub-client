import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import Layout from "./layouts";
import { Dashboard, HotelRates, Inventory, AddInventory, ItemCategories } from "./pages";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="hotels" element={<HotelRates />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="/inventory/new-item" element={<AddInventory />} />
            <Route path="/inventory/item-categories" element={<ItemCategories />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
