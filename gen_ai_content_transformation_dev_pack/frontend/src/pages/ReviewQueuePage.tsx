import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Button, Chip, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { api } from '../services/api';

interface ReviewQueuePageProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const ReviewQueuePage: React.FC<ReviewQueuePageProps> = ({ onNavigate }) => {
  const [queue, setQueue] = useState<any[]>([]);
  const [selectedOutput, setSelectedOutput] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [decision, setDecision] = useState<'approved' | 'changes_requested' | 'rejected'>('approved');
  const [comment, setComment] = useState('');

  const loadQueue = async () => {
    try {
      const list = await api.getReviewQueue();
      setQueue(list);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleOpenReview = (out: any) => {
    setSelectedOutput(out);
    setOpenModal(true);
  };

  const handleDecision = async () => {
    if (!selectedOutput || !selectedOutput.current_version_id) return;
    try {
      await api.submitReview(selectedOutput.current_version_id, {
        decision,
        comment
      });
      setOpenModal(false);
      setComment('');
      loadQueue();
    } catch (e) {
      alert(e);
    }
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#f8fafc' }}>Review & Approval Queue</Typography>
      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4 }}>Human-in-the-loop validation & sign-off workflow</Typography>

      {queue.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center', color: '#94a3b8' }}>
          <CheckCircleIcon sx={{ fontSize: 64, color: '#10b981', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#f8fafc' }}>All transformation outputs have been reviewed & signed off!</Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {queue.map((out) => (
            <Grid item xs={12} sm={6} md={4} key={out.id}>
              <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="card-hover-effect">
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Chip label={out.transform_type.replace('_', ' ').toUpperCase()} color="primary" size="small" sx={{ fontSize: '0.675rem', fontWeight: 700 }} />
                    <Chip label={out.status.toUpperCase()} color="warning" size="small" variant="outlined" sx={{ fontSize: '0.675rem' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#f8fafc' }}>Output Asset #{out.id}</Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 2 }}>
                    Source ID: {out.source_id} • Project ID: {out.project_id}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button fullWidth variant="outlined" size="small" onClick={() => onNavigate('outputs', { outputId: out.id })} sx={{ color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                    Inspect
                  </Button>
                  <Button fullWidth variant="contained" color="secondary" size="small" onClick={() => handleOpenReview(out)} sx={{ fontWeight: 700 }}>
                    Review
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}


      {/* Review Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Submit Review Decision</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 1, my: 2 }}>
            <Button
              variant={decision === 'approved' ? 'contained' : 'outlined'}
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() => setDecision('approved')}
            >
              Approve
            </Button>
            <Button
              variant={decision === 'changes_requested' ? 'contained' : 'outlined'}
              color="warning"
              startIcon={<EditNoteIcon />}
              onClick={() => setDecision('changes_requested')}
            >
              Request Changes
            </Button>
            <Button
              variant={decision === 'rejected' ? 'contained' : 'outlined'}
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => setDecision('rejected')}
            >
              Reject
            </Button>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reviewer Comments & Rationale"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDecision}>Submit Decision</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
