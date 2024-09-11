import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { useForm, Controller } from 'react-hook-form';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import DataTable from 'react-data-table-component';

type TaxPayer = {
  tid: bigint;
  firstName: string;
  lastName: string;
  address: string;
};

const App: React.FC = () => {
  const [taxPayers, setTaxPayers] = useState<TaxPayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const { control, handleSubmit, reset } = useForm<TaxPayer>();

  useEffect(() => {
    fetchTaxPayers();
  }, []);

  const fetchTaxPayers = async () => {
    setLoading(true);
    try {
      const result = await backend.getAllTaxPayers();
      setTaxPayers(result.map(tp => ({ ...tp, tid: Number(tp.tid) })));
    } catch (error) {
      console.error('Error fetching tax payers:', error);
      setSnackbar({ open: true, message: 'Error fetching tax payers', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: TaxPayer) => {
    setLoading(true);
    try {
      const result = await backend.createTaxPayer(
        BigInt(data.tid),
        data.firstName,
        data.lastName,
        data.address
      );
      if (result) {
        setSnackbar({ open: true, message: 'TaxPayer created successfully', severity: 'success' });
        reset();
        fetchTaxPayers();
      } else {
        setSnackbar({ open: true, message: 'TaxPayer with this TID already exists', severity: 'error' });
      }
    } catch (error) {
      console.error('Error creating tax payer:', error);
      setSnackbar({ open: true, message: 'Error creating tax payer', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { name: 'TID', selector: (row: TaxPayer) => row.tid.toString(), sortable: true },
    { name: 'First Name', selector: (row: TaxPayer) => row.firstName, sortable: true },
    { name: 'Last Name', selector: (row: TaxPayer) => row.lastName, sortable: true },
    { name: 'Address', selector: (row: TaxPayer) => row.address, sortable: true },
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        TaxPayer Management System
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
        <Controller
          name="tid"
          control={control}
          defaultValue=""
          rules={{ required: 'TID is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              margin="normal"
              required
              fullWidth
              id="tid"
              label="TID"
              type="number"
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
        <Controller
          name="firstName"
          control={control}
          defaultValue=""
          rules={{ required: 'First Name is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First Name"
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          defaultValue=""
          rules={{ required: 'Last Name is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
        <Controller
          name="address"
          control={control}
          defaultValue=""
          rules={{ required: 'Address is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              margin="normal"
              required
              fullWidth
              id="address"
              label="Address"
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Create TaxPayer'}
        </Button>
      </Box>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataTable
          columns={columns}
          data={taxPayers}
          pagination
          progressPending={loading}
          progressComponent={<CircularProgress />}
        />
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;
