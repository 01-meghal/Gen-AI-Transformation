import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Button, TextField, Grid, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { api } from '../services/api';

export const IntegrationsPage: React.FC = () => {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const loadData = async () => {
    try {
      const [wList, aList] = await Promise.all([
        api.getWebhooks(),
        api.getDeliveryAttempts().catch(() => [])
      ]);
      setWebhooks(wList);
      setAttempts(aList);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async () => {
    if (!name || !url) return;
    try {
      await api.createWebhook({
        name,
        url,
        secret: 'whsec_sample_secret_key_12345',
        enabled: true,
        event_types: ['transformation.completed'],
        workspace_id: 1
      });
      setName('');
      setUrl('');
      setOpenModal(false);
      loadData();
    } catch (e) {
      alert(e);
    }
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc' }}>Webhooks & Automated Delivery</Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>Configure HMAC-signed event webhooks for downstream publishing systems</Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenModal(true)} sx={{ fontWeight: 700 }}>
          Add Webhook Endpoint
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#f8fafc' }}>Configured Webhook Endpoints</Typography>
            {webhooks.length === 0 ? (
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>No active webhooks.</Typography>
            ) : (
              webhooks.map((wh) => (
                <Card key={wh.id} sx={{ mb: 2, p: 2, bgcolor: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(255, 255, 255, 0.06)' }} className="card-hover-effect">
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#f8fafc' }}>{wh.name}</Typography>
                      <Typography variant="caption" sx={{ color: '#60a5fa', display: 'block' }}>{wh.url}</Typography>
                    </Box>
                    <Chip label="ACTIVE" color="success" size="small" sx={{ fontSize: '0.675rem', fontWeight: 700 }} />
                  </Box>
                </Card>
              ))
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#f8fafc' }}>Delivery History Log</Typography>
            {attempts.length === 0 ? (
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>No webhook delivery attempts yet.</Typography>
            ) : (
              attempts.map((att) => (
                <Box key={att.id} sx={{ mb: 1.5, p: 1.5, bgcolor: 'rgba(0, 0, 0, 0.25)', borderRadius: 2, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 700 }}>Attempt #{att.attempt_no} - {att.status.toUpperCase()}</Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                    HTTP {att.http_status || 200} • {att.created_at}
                  </Typography>
                </Box>
              ))
            )}
          </Card>
        </Grid>

      </Grid>

      {/* Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Webhook Endpoint</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Endpoint Name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mt: 2, mb: 2 }} />
          <TextField fullWidth label="Payload URL" placeholder="https://api.myapp.com/webhooks/deliver" value={url} onChange={(e) => setUrl(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Save Webhook</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
