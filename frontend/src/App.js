import React from 'react';

import { BrowserRouter, Route } from 'react-router-dom';

import GlobalStyle from './styles/global';

import Main from './pages/Main/index';
import Tracks from './pages/Tracks/index';

const App = () => (
  <>
    <GlobalStyle />
    <BrowserRouter>
      <Route path="/" exact component={Main} />
      <Route path="/tracks" component={Tracks} />
    </BrowserRouter>
  </>
);

export default App;
