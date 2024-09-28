import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Google OAuth
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { username: email, password: password };
      const response = await axios.post(`http://localhost:5000/api/auth/login`, data);
      
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        toast.success('Login successful! Redirecting to workspace...');
        setTimeout(() => navigate('/workspace'), 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    const googleToken = response.credential;
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', { token: googleToken });
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token); // Store JWT token
        toast.success('Google login successful! Redirecting to workspace...');
        setTimeout(() => navigate('/workspace'), 2000);
      }
    } catch (error) {
      toast.error('Google login failed.');
    }
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <Stack className='flex'>
      <Stack
        sx={{
          maxWidth: "fit-content",
          marginInline: "auto",
          marginTop: "55px",
          justifyContent: "center",
          alignItems: "center"
        }}
        gap={1}
      >
        <img src="slack_logo.svg" alt="" className='w-28 cursor-pointer' />
        <h1 className='text-center font-bold text-5xl justify-center w-5/6 mt-5'>Sign in to Slack</h1>
        <p className='font-light mt-4'>We suggest using the <span className='font-medium'>email address that you use at work.</span></p>

        <TextField
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='name@work-email.com'
          variant="outlined"
          sx={{
            width: "90%",
            marginTop: "30px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              height: "50px"
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#454245",
              opacity: 0.50,
            },
          }}
        />

        <TextField
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          variant="outlined"
          type='password'
          sx={{
            width: "90%",
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              height: "50px"
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#454245",
              opacity: 0.50,
            },
          }}
        />

        <Button
          variant="contained"
          onClick={handleLogin}
          disabled={loading}
          sx={{
            width: "90%",
            borderRadius: "12px",
            bgcolor: "#611f69",
            height: "45px",
            fontSize: "17px",
            textTransform: "none",
            boxShadow: "none",
            marginTop: "12px",
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <Divider
          sx={{
            width: "90%",
            textAlign: "center",
            marginTop: "5px"
          }}>
          <p className='font-light opacity-70'>OR</p>
        </Divider>

        <GoogleOAuthProvider clientId="941853391466-s45c0ocd24qcc84smpl0mu459flqds0e.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => toast.error('Google Login Failed')}
            width="90%"
            size="large"
            ux_mode="popup"
          />
        </GoogleOAuthProvider>

        {/* <Button
          variant="outlined"
          sx={{
            color: "black",
            width: "90%",
            borderColor: "#b6b6b7",
            borderRadius: "12px",
            height: "45px",
            borderWidth: "2px"
          }}
        >
          <img src="apple.svg" alt="" className='w-4 mb-1 mr-3' />
          Continue with Apple
        </Button> */}

        <p className='font-light text-sm text-[#616061]'>New to Slack?</p>
        <p className='cursor-pointer text-sm text-[#1264a3]' onClick={handleSignUpClick}>Create an account</p>
      </Stack>
      <ToastContainer />
    </Stack>
  );
};

export default Login;
