import React from 'react';
import CustomerList from './components/CustomerList';
import { Container } from '@mui/material';

const App = () => {
  return (
    <Container>
      <h1>Customer Management</h1>
      <CustomerList />
    </Container>
  );
};

export default App;