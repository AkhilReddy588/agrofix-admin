import React, { useState } from 'react'
import { Box, TextField, Button, Typography, Paper, CircularProgress, IconButton, InputAdornment } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    setError('')
    setLoading(true) // Start loading

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: 'admin'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const data = await response.json()
      Cookies.set('admin_token', data.token, { expires: 7, path: '' })

      console.log('User logged in successfully:', data)

      navigate('/')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClickShowPassword = () => setShowPassword(prev => !prev)

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
      px={2}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" fontWeight="bold" mb={3} align="center">
          Login
        </Typography>
        {error && <Typography color="error" variant="body2" align="center">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
            type="email"
          />
          <TextField
            label="Password"
            name="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </form>
      </Paper>
    </Box>
  )
}

export default Login
