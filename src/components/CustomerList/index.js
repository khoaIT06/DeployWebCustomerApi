import React, { useEffect, useState } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
} from '@mui/material';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import MuiAlert from '@mui/material/Alert';
import DeleteConfirmModal from '../DeleteConfirmModal';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7045';

const Alert = React.forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState({
    id: 0,
    name: '',
    birthday: '',
    phone: '',
    email: '',
    address: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers/getAll`);
      setCustomers(response.data);
    } catch (error) {
      handleSnackbar('Error fetching customers', 'error');
    }
  };

  const handleOpen = (customer = { id: 0, name: '', birthday: '', phone: '', email: '', address: '' }) => {
    setCurrentCustomer(customer);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentCustomer({ id: 0, name: '', birthday: '', phone: '', email: '', address: '' });
  };

  const handleSave = async () => {
    try {
      const customerData = {
        id: currentCustomer.id,
        name: currentCustomer.name,
        birthday: currentCustomer.birthday,
        phone: currentCustomer.phone,
        email: currentCustomer.email,
        address: currentCustomer.address,
      };

      if (currentCustomer.id) {
        await axios.put(`${API_BASE_URL}/customers/update/${currentCustomer.id}`, customerData);
        handleSnackbar('Customer updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/customers/create`, customerData);
        handleSnackbar('Customer added successfully');
      }
      handleClose();
      fetchCustomers();
    } catch (error) {
      handleSnackbar('Error saving customer', 'error');
      console.error(error);
    }
  };

  const handleDeleteConfirmation = (id) => {
    setCustomerToDelete(id);
    setOpenDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/customers/delete/${customerToDelete}`);
      handleSnackbar('Customer deleted successfully');
      fetchCustomers();
    } catch (error) {
      handleSnackbar('Error deleting customer', 'error');
    } finally {
      setOpenDeleteModal(false);
    }
  };

  const handleSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => handleOpen()}
        startIcon={<FontAwesomeIcon icon={faPlus} />}
      >
        Add Customer
      </Button>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Birthday</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.birthday}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleOpen(customer)}
                    startIcon={<FontAwesomeIcon icon={faEdit} />}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteConfirmation(customer.id)}
                    startIcon={<FontAwesomeIcon icon={faTrash} />}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentCustomer.id ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={currentCustomer.name}
            onChange={(e) => setCurrentCustomer({ ...currentCustomer, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Birthday"
            type="date"
            fullWidth
            variant="outlined"
            value={currentCustomer.birthday}
            onChange={(e) => setCurrentCustomer({ ...currentCustomer, birthday: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Phone"
            type="text"
            fullWidth
            variant="outlined"
            value={currentCustomer.phone}
            onChange={(e) => setCurrentCustomer({ ...currentCustomer, phone: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={currentCustomer.email}
            onChange={(e) => setCurrentCustomer({ ...currentCustomer, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Address"
            type="text"
            fullWidth
            variant="outlined"
            value={currentCustomer.address}
            onChange={(e) => setCurrentCustomer({ ...currentCustomer, address: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>{currentCustomer.id ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <DeleteConfirmModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onDelete={handleDelete}
      />
    </>
  );
};

export default CustomerList;