import { useState } from "react";
import {
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Box,
} from "@material-ui/core";

function HomePage() {
  const [isRegister, setIsRegister] = useState(false);

  const paperStyle = {
    padding: 10,
    width: 350,
  };

  function onClickSignUp(event) {
    event.preventDefault();
    setIsRegister(true);
  }

  function onClickSignIn(event) {
    event.preventDefault();
    setIsRegister(false);
  }

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={3}>
        <Paper elevation={5} style={paperStyle}>
          <Grid align="center">
            <h1>eManage</h1>
            <h2>Sign In</h2>
          </Grid>
          <TextField
            label="Username"
            placeholder="Enter username"
            fullWidth
            required
          />
          <TextField
            label="Password"
            placeholder="Enter password"
            type="password"
            fullWidth
            required
          />
          <Box my={1}>
            <Button type="submit" color="primary" variant="contained" fullWidth>
              {isRegister ? "Sign up" : "Sign in"}
            </Button>
          </Box>
          {isRegister ? (
            <Typography>
              Already have an account?
              <Link href="#" onClick={onClickSignIn}>
                Sign In
              </Link>
            </Typography>
          ) : (
            <Typography>
              Don't have an account?
              <Link href="#" onClick={onClickSignUp}>
                Sign Up
              </Link>
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default HomePage;
