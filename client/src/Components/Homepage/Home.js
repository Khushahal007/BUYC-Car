import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Heading } from '@chakra-ui/react';
import Data from '../Filter/Data';





const Home = () => {
  const history = useNavigate();

  const handleLogout = () => {
    // Clear the email and password from localStorage
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('password');

    history('/');
  };

  // Get the username from localStorage
  const email = localStorage.getItem('email');

  return (
    <>
    <Box
      bg="#E1EBEE"
      minH="100vh"
      display="flex"
      justifyContent="flex-end"
      alignItems="flex-start"
      p={4}
    >

     

      <Heading
        color=""
        as="h1"
        size="md"
        m={2}
        mr={6}
        alignSelf="flex-top"
        title={email}
      >
        {email.split('@')[0]} {/* Display before the @ */}
      </Heading>

      <Button
        color="background-color: #D9AFD9;
        background-image: linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%);
        "
        size="md"
        onClick={handleLogout}
        alignSelf="flex-top"
      >
        Logout
      </Button>
  
      
    </Box>
    <Data />
    </>
  );
};

export default Home;
