import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Paper
} from '@mui/material'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('admin_token')}`,
      },
    });
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('admin_token')}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      Swal.fire('Success', 'Order status updated successfully!', 'success')
      fetchOrders();
    } else {
      Swal.fire('Error', 'Something went wrong while updating the status.', 'error')
    }
  };

  const statusOptions = ['pending', 'In Progress', 'Delivered']

  const isStatusAllowed = (currentStatus, option) => {
    const currentIndex = statusOptions.indexOf(currentStatus)
    const optionIndex = statusOptions.indexOf(option)
    return optionIndex >= currentIndex
  };

  return (
    <div>
      <Navbar />
      <Box sx={{ pt: '60px', px: 4 }}>
        <Typography variant="h4" gutterBottom>
          All Orders
        </Typography>

        <Box>
          {orders.map((order) => (
              <Paper sx={{
                padding: 2,
                borderRadius: 2,
                boxShadow: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                backgroundColor: '#fff',
                mt: 1,
                mb: 3
              }}>
                <Box sx={{ mb: 2, mt: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {order.user.email}
                  </Typography>
                  <Typography>Status: {order.status}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>
                    Items:
                  </Typography>
                  {order.items.map((item) => (
                    <Box key={item.product._id} sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        {item.product.name} - Quantity: {item.quantity}
                      </Typography>
                    </Box>
                  ))}
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>
                    Address: {order.address}
                  </Typography>
                </Box>

                <Box>
                  <FormControl fullWidth>
                    <Typography type="subtitle1">Status</Typography>
                    <Select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      {statusOptions.map((status) => (
                        <MenuItem
                          key={status}
                          value={status}
                          disabled={!isStatusAllowed(order.status, status)}
                        >
                          {status}
                        </MenuItem>
                      ))}
                    </Select>

                  </FormControl>
                </Box>
              </Paper>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default Orders
