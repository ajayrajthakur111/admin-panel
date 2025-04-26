// src/pages/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginAdmin } from "../features/auth/authSlice"; 
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import logoImage from "../assets/freeshopps-logo.png"; 

// Custom styled Container for the whole page background
const LoginContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100%",
  width: "100%",
  backgroundSize: "cover", // Cover the entire container
  backgroundPosition: "center", // Center the background image
  padding: "20px",
});

// Custom styled Box for the white login form wrapper
const LoginFormWrapper = styled(Box)({
  backgroundColor: "#fff",
  padding: "40px", // Adjust padding based on screenshot
  borderRadius: "16px", // More rounded corners
  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)", // More pronounced shadow
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: "400px", // Adjust width as needed
});

// Custom styled img for the logo
const Logo = styled("img")({
  width: "80px", // Adjust size as needed
  marginBottom: "24px", // Adjust spacing below logo
});

// Custom styled TextField to match the specific input look
const StyledTextField = styled(TextField)({
  marginBottom: "16px", // Adjust vertical spacing between inputs
  "& .MuiInputBase-root": {
    // Style the input container
    backgroundColor: "#f0f2f5", // Light grey background color
    borderRadius: "4px", // Slightly rounded corners for input area
    padding: "8px 12px", // Adjust padding inside input
  },
  "& .MuiOutlinedInput-notchedOutline": {
    // Hide the default border
    border: "none",
  },
  "& .MuiInputLabel-outlined": {
    // Style the label
    transform: "translate(12px, 12px) scale(1)", // Default position when not focused/filled
    "&.MuiInputLabel-shrink": {
      // Position when focused/filled
      transform: "translate(12px, -9px) scale(0.75)", // Move up and shrink
    },
    color: "#757575", // Adjust label color
  },
  "& .MuiInputBase-input": {
    padding: "0", // Remove default input padding if MuiInputBase-root padding is used
    height: "auto", // Allow height to be determined by content/padding
  },
  "& input::placeholder": {
    color: "#a0a0a0", // Adjust placeholder color
    opacity: 1, // Ensure placeholder is not transparent
  },
  // Override password dots style if necessary (advanced)
  // '& input[type="password"]': { ... }
});

const StyledButton = styled(Button)({
  backgroundColor: "#4db6ac", // Teal color
  color: "#fff", // White text
  padding: "10px 24px", // Adjust padding
  fontSize: "1rem", // Adjust font size
  fontWeight: "bold", // Adjust font weight
  textTransform: "none", // Keep text case as is
  borderRadius: "4px", // Adjust button border radius
  boxShadow: "none", // Remove shadow if present
  "&:hover": {
    backgroundColor: "#26a69a", // Darker teal on hover
    boxShadow: "none",
  },
  marginTop: "24px", // Adjust spacing above button
  marginBottom: "16px", // Adjust spacing below button
});

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, token } = useSelector((state) => state.auth); // Get state from Redux

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(loginAdmin({ email, password }));
    // Remember Me logic needs implementation (e.g., token persistence strategy)
  };

  return (
    <LoginContainer>
      <LoginFormWrapper>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Logo src={logoImage} alt="Freeshopps Logo" />
          <Box>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                mb: 1, // Adjust spacing
                fontWeight: "bold", // Match font weight
                color: "#333", // Adjust text color
                fontSize: "1.5rem", // Adjust font size
              }}
            >
              Login to Account
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 3, // Adjust spacing below subtitle
                color: "#757575", // Match text color
                fontSize: "0.8rem", // Adjust font size
                textAlign: "left",
                ml: 2,
              }}
            >
              Please enter your email and password to continue
            </Typography>
          </Box>
        </Box>

        {/* Display error message */}
        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <Typography
            variant="body2"
            sx={{
              mb: 0.5,
              color: "#333",
              fontWeight: "bold",
              textAlign: "left",
            }}
          >
            Email address:
          </Typography>{" "}
          {/* Custom label text */}
          <StyledTextField
            required
            fullWidth
            id="email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="esteban_schiller@gmail.com" // Placeholder text
            InputLabelProps={{ shrink: true }} // Keep label always shrunk if using default label
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              mt: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                mb: 0.5,
                color: "#333",
                fontWeight: "bold",
                textAlign: "left",
              }}
            >
              Password:
            </Typography>{" "}
            {/* Custom label text */}
            <Link
              to="/forgot-password"
              style={{
                textDecoration: "none",
                color: "#4db6ac",
                fontSize: "0.9rem",
                fontWeight: "bold",
              }}
            >
              Forget Password?
            </Link>
          </Box>
          <StyledTextField
            required
            fullWidth
            name="password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="● ● ● ● ● ●" // Placeholder text (visual hint, not actual input)
            InputLabelProps={{ shrink: true }} // Keep label always shrunk if using default label
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              mt: 1,
            }}
          >
            {" "}
            {/* Adjust mt */}
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{
                    color: "#4db6ac", // Checkbox color
                    "&.Mui-checked": {
                      color: "#4db6ac", // Checked color
                    },
                    padding: "0 9px 0 0", // Adjust padding around checkbox icon
                  }}
                />
              }
              label={
                <Typography
                  variant="body2"
                  sx={{ color: "#757575", fontSize: "0.9rem" }}
                >
                  Remember Password
                </Typography>
              }
              sx={{ mr: 1 }} // Adjust margin if needed
            />
            {/* Adjust link styling */}
          </Box>
          <StyledButton
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </StyledButton>
        </Box>
      </LoginFormWrapper>
      {/* Add Footer links here if needed */}
    </LoginContainer>
  );
}

export default LoginPage;
