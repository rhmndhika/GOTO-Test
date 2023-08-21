import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Details from './pages/Details.tsx';

function App() {
  return (
    <ChakraProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/'element={<Home />} />
        <Route path='/detail/:id'element={<Details />} />
      </Routes>
    </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
