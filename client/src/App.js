import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider, useQuery } from '@apollo/client';
// import { getMe } from './utils/API'; 
import Auth from './utils/auth'; 
import { GET_ME } from './utils/queries';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

function App() {
  console.log("App component rendering..."); 
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route path='/' element={<SearchBooks />} />
            <Route
              path='/saved'
              element={
                <PrivateRoute>
                  <SavedBooks />
                </PrivateRoute>
              }
            />
            <Route path='*' element={<h1 className='display-2'>Wrong page!</h1>} />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

function PrivateRoute({ children }) {
  console.log("PrivateRoute component rendering..."); 

  const { loading, data } = useQuery(GET_ME);

  console.log("PrivateRoute data:", data); 

  if (loading) {
    return <h2>Loading...</h2>;
  }

  const isLoggedIn = Auth.loggedIn();
  const userData = data?.me;

  console.log("PrivateRoute isLoggedIn:", isLoggedIn); 
  console.log("PrivateRoute userData:", userData); 

  if (!isLoggedIn || !userData) {
    return <h1>Please log in to view your saved books.</h1>;
  }

  return children;
}

export default App;
