import React, { useState , useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Heading, Input, Button, Text, useToast } from '@chakra-ui/react';



const Auth = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const toast = useToast();
  const navigate = useNavigate();


  useEffect(() => {
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');

    if (email && password) {
      navigate('/home');
    }
  }, []);

  const handleSignup = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Display success toast message
        toast({
          title: 'Signup Successful',
          description: data.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setName('');
        setEmail('');
        setPassword('');
        setShowLogin(true);
      } else {
        // Display error toast message
        toast({
          title: 'Signup Failed',
          description: data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFlip = () => {
    setShowLogin(!showLogin);
  };

  const handleLogin = async () => {
    try {

      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
  
        toast({
          title: 'Login Successful',
          description: data.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setEmail('');
        setPassword('');
        navigate('/home')
      } else {
        toast({
          title: 'Login Failed',
          description: data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <Box maxW="md" mx="auto" mt={20} p={8} borderWidth={1} borderRadius="lg">
      {!showLogin ? (
        <>
          <Heading mb={4} textAlign="center">
            Sign up
          </Heading>
          <Input
            placeholder="Name"
            mb={4}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Email"
            mb={4}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            mb={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button colorScheme="blue" onClick={handleSignup} mb={6} w="full">
            Sign up
          </Button>
          <Text textAlign="center">
            Already have an account?{' '}
            <Text
              as="span"
              color="blue.500"
              cursor="pointer"
              onClick={handleFlip}
            >
              Log in
            </Text>
          </Text>
        </>
      ) : (
        <>
          <Heading mb={4} textAlign="center">
            Log in
          </Heading>
          <Input
            placeholder="Email"
            mb={4}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            mb={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button colorScheme="blue" onClick={handleLogin} mb={6} w="full">
            Log in
          </Button>
          <Text textAlign="center">
            Don't have an account?{' '}
            <Text
              as="span"
              color="blue.500"
              cursor="pointer"
              onClick={handleFlip}
            >
              Sign up
            </Text>
          </Text>
        </>
      )}
    </Box>
  );
};

export default Auth;
