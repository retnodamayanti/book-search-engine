import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { getMe } from './utils/API'; 
import Auth from './utils/auth'; 
import client from './utils/apolloClient';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

function App() {
  const isLoggedIn = Auth.loggedIn();

  if (isLoggedIn) {
    getMe(Auth.getToken())
      .then(({ data }) => {
        client.writeQuery({
          query: GET_ME,
          data: { me: data },
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route 
              path='/' 
              element={<SearchBooks />} 
            />
            <Route 
              path='/saved' 
              element={isLoggedIn ? <SavedBooks /> : <h1>Please log in to view your saved books.</h1>} 
            />
            <Route 
              path='*'
              element={<h1 className='display-2'>Wrong page!</h1>}
            />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
