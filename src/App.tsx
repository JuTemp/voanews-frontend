import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import './App.css';
import { Main } from './Components/Main/Main';
import { Desc } from './Components/Desc/Desc';

const App = () => {

  return (
    <BrowserRouter basename='/'>
      <Routes>
        <Route path='/' element={<Navigate to='/main' />} />
        <Route path='/main' Component={Main} />
        <Route path='/desc' Component={Desc} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
