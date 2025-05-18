import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserReg from './pages/UserReg';
import Header from './Components/Header';
import Home from "./pages/Home";
import Fees from './pages/Fees';
import StudentAdd from './pages/StudentAdd';
import StudentView from './pages/StudentView';
import SubjectEdit from './pages/SubjectEdit';
import SubjectAdd from './pages/SubjectAdd';

function AppWrapper() {
  const location = useLocation();
  
  // Hide the Header on /login, /home, and /dashboard pages
  const showHeader = !['/login', '/', '/dashboard'].includes(location.pathname);

  return (
    <>
    {showHeader && <Header />}
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/userreg' element={<UserReg />} />
        <Route path='/header' element={<Header />} />
        <Route path='/fees' element={<Fees/>} />
        <Route path='/studentadd' element={<StudentAdd />} />
        <Route path='/studentview' element={<StudentView />} />
        <Route path='/subjectadd' element={<SubjectAdd />} />
        <Route path='/subjectedit' element={<SubjectEdit />} />
      </Routes>
    </>
  );
}
function App() {
  return (
     <div className="App">
      <Router>
        <AppWrapper />
      </Router>
    </div>
  );
}

export default App;