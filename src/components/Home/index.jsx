import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });

  const fetchProducts = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products`);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    if (!newProduct.name || newProduct.price === '') {
      Swal.fire('Error', 'Please fill in both name and price.', 'warning');
      return;
    }

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify(newProduct),
    });

    if (res.ok) {
      setNewProduct({ name: '', price: '' });
      fetchProducts();
      Swal.fire('Success', 'Product added!', 'success');
    } else {
      Swal.fire('Error', 'Failed to add product.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action will permanently delete the product.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });

      if (res.ok) {
        fetchProducts();
        Swal.fire('Deleted!', 'The product has been deleted.', 'success');
      } else {
        Swal.fire('Error', 'Something went wrong while deleting.', 'error');
      }
    }
  };

  const handleUpdate = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${editingProduct._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify({
        name: editingProduct.name,
        price: editingProduct.price,
      }),
    });

    if (res.ok) {
      setEditingProduct(null);
      fetchProducts();
    }
  };

  return (
    <div>
      <Navbar />
      <Box sx={{ pt: '60px', px: 4 }}>
        <Typography variant="h4" gutterBottom>
          Product List
        </Typography>

        {/* Add Product Form */}
        <Stack direction="row" spacing={2} mb={4} alignItems="center">
          <TextField
            label="Product Name"
            size="small"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <TextField
            label="Price"
            size="small"
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <Button variant="contained" onClick={handleAddProduct}>
            Add Product
          </Button>
        </Stack>

        {/* Product List */}
        {products.map((product) => (
          <Box
            key={product._id}
            sx={{
              border: '1px solid #ccc',
              borderRadius: 2,
              p: 2,
              mb: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {editingProduct && editingProduct._id === product._id ? (
              <Stack spacing={1} direction="row">
                <TextField
                  size="small"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                />
                <TextField
                  size="small"
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, price: e.target.value })
                  }
                />
                <Button variant="contained" onClick={handleUpdate}>
                  Save
                </Button>
                <Button onClick={() => setEditingProduct(null)}>Cancel</Button>
              </Stack>
            ) : (
              <>
                <Box>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography>₹{product.price}</Typography>
                </Box>
                <Box>
                  <IconButton onClick={() => setEditingProduct(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(product._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </>
            )}
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default Home;
