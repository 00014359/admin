import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login/Login";
import Perfume from "./pages/Perfume/Perfume";
import Order from "./pages/Order/Order";

function App() {
  return (
    <>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<Header />}>
          <Route path="/parfume" element={<Perfume />} />
          <Route path="/order" element={<Order />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
