// src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios'; // Import axios
import logoImage from '../assets/freeshopps-logo.png'; // Adjust path to your logo image

// Reusing the styled components from LoginPage for consistency
const ForgotPasswordContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  width: '100%',
  // Background handled by index.css globally
  backgroundColor: 'transparent',
  padding: '20px',
  boxSizing: 'border-box',
});

const ForgotPasswordFormWrapper = styled(Box)({
  backgroundColor: '#fff',
  padding: '40px',
  borderRadius: '16px',
  boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: '400px',
});

const Logo = styled('img')({
  width: '80px',
  marginBottom: '24px',
});

// Reusing the StyledTextField from LoginPage
const StyledTextField = styled(TextField)({
  marginBottom: '16px',
  '& .MuiInputBase-root': {
      backgroundColor: '#f0f2f5',
      borderRadius: '4px',
      padding: '10px 12px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
  },
   '& .MuiInputLabel-outlined': {
       display: 'none',
   },
    '& .MuiInputBase-input': {
       padding: '0',
       height: 'auto',
       lineHeight: 'normal',
    },
    '& input::placeholder': {
        color: '#a0a0a0',
        opacity: 1,
    },
});

// Reusing the StyledButton from LoginPage
const StyledButton = styled(Button)({
   backgroundColor: '#4db6ac',
   color: '#fff',
   padding: '12px 24px',
   fontSize: '1rem',
   fontWeight: 'bold',
   textTransform: 'none',
   borderRadius: '4px',
   boxShadow: 'none',
   '&:hover': {
     backgroundColor: '#26a69a',
     boxShadow: 'none',
   },
   marginTop: '24px',
   marginBottom: '0',
});

// Define your backend API base URL
const baseUrl = import.meta.env.VITE_API_BASE_URL;


function ForgotPasswordPage() {
  const navigate = useNavigate(); // For redirection

  // State to manage the steps of the password reset process
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP, 3: Set New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // State to store the user ID needed for the final password change step
  // This ID should ideally come from a successful OTP verification step,
  // but your API spec for step 1 returns it directly. We'll store it.
  const [userIdForPasswordChange, setUserIdForPasswordChange] = useState(null);


  // Handle submission for Step 1: Request OTP
  const handleStep1Submit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
       const response = await axios.post(baseUrl + 'forgetPassword', { email });

       // Check the API response structure based on your Postman example
       if (response.data && response.data.status === 200) {
           setSuccess(response.data.message || 'OTP sent to your email.');
           // Store the user ID returned by the API for the next step
           setUserIdForPasswordChange(response.data.data._id);
           setStep(2); // Move to Step 2 (Enter OTP)
       } else {
           // Handle unexpected successful response structure
           setError('Failed to process request. Please try again.');
       }

    } catch (err) {
       // Handle API error responses (e.g., user not found, invalid email)
       setError(err.response?.data?.message || 'Failed to request password reset. Please try again.');
    } finally {
       setIsLoading(false);
    }
  };

  // Handle submission for Step 2: Verify OTP
  const handleStep2Submit = async (event) => {
     event.preventDefault();
     setError(null);
     setSuccess(null);
     setIsLoading(true);

     // Ensure we have the email (and potentially user ID if needed by this API, though spec only shows email/otp)
     if (!email) {
         setError("Email is missing. Please go back to step 1.");
         setIsLoading(false);
         return;
     }

     // --- API Call for Step 2: Verify OTP ---
     // POST /api/v1/admin/forgotVerifyotp { email: "...", otp: "..." }
     try {
        // Note the double slash in your Postman path /admin//forgotVerifyotp - adjust if needed
        const response = await axios.post(baseUrl + 'forgotVerifyotp', { email, otp });

        // Assuming successful verification means status 200/success message
        if (response.data && response.data.status === 200) {
            setSuccess(response.data.message || 'OTP verified. You can now set a new password.');
            // We already have the user ID from Step 1, so we can proceed to Step 3
            setStep(3); // Move to Step 3 (Set New Password)
        } else {
             // Handle API returning success status but unexpected data
            setError('OTP verification failed. Please try again.');
        }

     } catch (err) {
        // Handle API error (e.g., invalid OTP)
        setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
     } finally {
        setIsLoading(false);
     }
   };


  // Handle submission for Step 3: Change Password
  const handleStep3Submit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic client-side password validation
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password don't match.");
      return;
    }

    // Ensure we have the user ID from the previous steps
     if (!userIdForPasswordChange) {
         setError("Missing user information for password reset. Please restart the process.");
         // Maybe redirect back to step 1 or login
         // navigate('/forgot-password'); // Redirect to restart
         return;
     }

    setIsLoading(true);

    // --- API Call for Step 3: Change Password ---
    // POST /api/v1/admin/changePassword/:id { newPassword: "...", confirmPassword: "..." }
    try {
       const response = await axios.post(`${baseUrl}changePassword/${userIdForPasswordChange}`, { newPassword, confirmPassword });

       // Assuming successful password change means status 200/success message
        if (response.data && response.data.status === 200) {
            setSuccess(response.data.message || 'Password changed successfully. Redirecting to login...');
            // Redirect to login page after successful password change
            // Add a slight delay so the user can read the success message
            setTimeout(() => navigate('/login', { replace: true }), 2000); // Redirect after 2 seconds
        } else {
             // Handle API returning success status but unexpected data
             setError('Password change failed. Please try again.');
        }

    } catch (err) {
       // Handle API error (e.g., validation failed, user ID not found)
       setError(err.response?.data?.message || 'Failed to change password. Please try again.');
    } finally {
       setIsLoading(false);
    }
  };

  // Determine which form and button to show based on the current step
  const renderFormContent = () => {
    switch (step) {
      case 1: // Enter Email
        return (
          <>
            <Typography variant="body2" sx={{ mb: 0.5, color: '#333', fontWeight: 'bold', display: 'block' }}>Email:</Typography>
            <StyledTextField
              required
              fullWidth
              id="email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="esteban_schiller@gmail.com"
            />
            <StyledButton
              type="submit" // This button submits the form for Step 1
              fullWidth
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
            </StyledButton>
             {/* Optional: Link back to login */}
             <Link to="/login" style={{ textDecoration: 'none', color: '#4db6ac', fontSize: '0.9rem', fontWeight: 'bold', marginTop: '16px', display: 'block', textAlign: 'center' }}>
                Back to Login
             </Link>
          </>
        );
      case 2: // Enter OTP
        return (
          <>
            <Typography variant="body2" sx={{ mb: 0.5, color: '#333', fontWeight: 'bold', display: 'block' }}>OTP:</Typography>
            <StyledTextField
              required
              fullWidth
              id="otp"
              name="otp"
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="● ● ● ●"
            />
            <StyledButton
              type="submit" // This button submits the form for Step 2
              fullWidth
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
            </StyledButton>
             {/* Optional: Add a Resend OTP link */}
             <Link to="#" onClick={(e) => { e.preventDefault(); handleStep1Submit({ preventDefault: () => {} }); }} style={{ textDecoration: 'none', color: '#4db6ac', fontSize: '0.9rem', fontWeight: 'bold', marginTop: '16px', display: 'block', textAlign: 'center' }}>
                Resend OTP
             </Link>
             <Link to="/login" style={{ textDecoration: 'none', color: '#4db6ac', fontSize: '0.9rem', fontWeight: 'bold', marginTop: '8px', display: 'block', textAlign: 'center' }}>
                Back to Login
             </Link>
          </>
        );
      case 3: // Set New Password
        return (
          <>
            <Typography variant="body2" sx={{ mb: 0.5, color: '#333', fontWeight: 'bold', display: 'block' }}>New Password:</Typography>
            <StyledTextField
              required
              fullWidth
              name="newPassword"
              type="password"
              id="newPassword"
              autoFocus
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="● ● ● ● ● ●"
            />

            <Typography variant="body2" sx={{ mb: 0.5, color: '#333', fontWeight: 'bold', display: 'block' }}>Confirm Password:</Typography>
            <StyledTextField
              required
              fullWidth
              name="confirmPassword"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="● ● ● ● ● ●"
            />
            <StyledButton
              type="submit" // This button submits the form for Step 3
              fullWidth
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Change Password'} {/* Changed button text */}
            </StyledButton>
             {/* Optional: Link back to login */}
             <Link to="/login" style={{ textDecoration: 'none', color: '#4db6ac', fontSize: '0.9rem', fontWeight: 'bold', marginTop: '16px', display: 'block', textAlign: 'center' }}>
                Back to Login
             </Link>
          </>
        );
      default:
        return null; // Should not happen
    }
  };

  // Determine which handler to use based on the current step
  const getCurrentStepSubmitHandler = () => {
      switch (step) {
          case 1: return handleStep1Submit;
          case 2: return handleStep2Submit;
          case 3: return handleStep3Submit;
          default: return (e) => e.preventDefault();
      }
  }


  return (
     <ForgotPasswordContainer>
       {/* The wavy background is handled by index.css globally */}
       <ForgotPasswordFormWrapper>
         {/* Logo and Title */}
         <Box
           sx={{
             display: "flex",
             alignItems: "center",
             width: "100%",
             mb: 3,
           }}
         >
           <Logo src={logoImage} alt="Freeshopps Logo" sx={{ mr: 2 }} />
           <Box>
             <Typography
               variant="h5"
               component="h1"
               sx={{
                 fontWeight: "bold",
                 color: "#333",
                 fontSize: "1.5rem",
               }}
             >
               Forget Password
             </Typography>
           </Box>
         </Box>

         {/* Display error/success messages */}
         {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
         {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}

         {/* Form (uses a single form element but content changes based on step) */}
         <Box component="form" onSubmit={getCurrentStepSubmitHandler()} sx={{ width: '100%' }}>
            {renderFormContent()}
         </Box>

       </ForgotPasswordFormWrapper>
     </ForgotPasswordContainer>
   );
}

export default ForgotPasswordPage;