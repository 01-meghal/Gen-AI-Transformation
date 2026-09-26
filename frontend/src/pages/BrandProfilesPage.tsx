import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Button, TextField, Grid, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import StyleIcon from '@mui/icons-material/Style';
import AddIcon from '@mui/icons-material/Add';
import { api } from '../services/api';

export const BrandProfilesPage: React.FC = () => {
  const [brands, setBrands] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState('');
  const [forbidden, setForbidden] = useState('');
  const [preferred, setPreferred] = useState('');

  const loadBrands = async () => {
    try {
      const data = await api.getBrandProfiles();
      setBrands(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleCreate = async () => {
    if (!name) return;
    try {
      await api.createBrandProfile({
        name,
        forbidden_terms: forbidden ? forbidden.split(',').map(s => s.trim()) : [],
        preferred_terms: preferred ? { "synergy": preferred } : {},
        workspace_id: 1
      });
      setName('');
      setForbidden('');
      setPreferred('');
      setOpenModal(false);
      loadBrands();
    } catch (e) {
      alert(e);
    }
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc' }}>Brand Profiles & Tone Rules</Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>Define organizational voice, forbidden terms & preferred vocabulary</Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenModal(true)} sx={{ fontWeight: 700 }}>
          New Brand Profile
        </Button>
      </Box>

      <Grid container spacing={3}>
        {brands.map((b) => (
          <Grid item xs={12} sm={6} md={4} key={b.id}>
            <Card sx={{ p: 3, height: '100%' }} className="card-hover-effect">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  <StyleIcon fontSize="small" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>{b.name}</Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 2 }}>
                Active Version: v{b.active_version}
              </Typography>
              <Chip label="Governance Active" color="success" size="small" variant="outlined" sx={{ borderColor: 'rgba(16, 185, 129, 0.3)', color: '#34d399' }} />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#f8fafc' }}>Create Brand Profile</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Profile Name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mt: 2, mb: 2 }} />
          <TextField fullWidth label="Forbidden Terms (comma separated)" placeholder="e.g. cheap, guarantee, best ever" value={forbidden} onChange={(e) => setForbidden(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Preferred Terms" placeholder="e.g. cost-effective, high performance" value={preferred} onChange={(e) => setPreferred(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleCreate}>Save Profile</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

};
