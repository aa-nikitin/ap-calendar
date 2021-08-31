import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import { loginFetchFromToken } from './redux/actions';

import { Home, Login } from './pages';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loginFetchFromToken());
  }, [dispatch]);

  return (
    <Container>
      <Route path="/" component={Home} exact />
      <Route path="/login" component={Login} exact />
    </Container>
  );
}

export default App;
