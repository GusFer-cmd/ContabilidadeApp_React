import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Create from "./components/Card/Create";
import Update from "./components/Card/Update";
import IndexUpdate from "./components/Card/IndexUpdate";
import RenterCreate from "./components/Renter/RenterCreate";
import RenterUpdate from "./components/Renter/RenterUpdate";
import RenterIndexUpdate from "./components/Renter/RenterIndexUpdate";
import InfoCreate from "./components/Info/InfoCreate";
import Dashboard from "./components/Dashboard/Dashboard";
import InfoIndexUpdate from "./components/Info/InfoIndexUpdate";
import InfoUpdate from "./components/Info/InfoUpdate";
import Login from "./components/Login/Login";

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Dashboard />} />

          <Route path="/card" element={<IndexUpdate />} />
          <Route path="/card/create" element={<Create />} />
          <Route path="/card/:firebaseId" element={<Update />} />

          <Route path="/renter" element={<RenterIndexUpdate />} />
          <Route path="/renter/create" element={<RenterCreate />} />
          <Route path="/renter/:firebaseId" element={<RenterUpdate />} />

          <Route path="/info/index/:cardId" element={<InfoIndexUpdate />} />
          <Route path="/info/create/:cardId" element={<InfoCreate />} />
          <Route path="/info/:cardId/:firebaseId" element={<InfoUpdate />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
