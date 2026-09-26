import React from 'react';
import { Box, Card, Typography, Grid, Chip } from '@mui/material';
import TerminalIcon from '@mui/icons-material/TerminalOutlined';

export const PromptsAdminPage: React.FC = () => {

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc' }}>Prompt Management System</Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>Manage system prompts, versioned developer instructions & model defaults</Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {['executive_summary', 'linkedin_post', 'twitter_x', 'advisory', 'infographic_spec', 'presentation', 'video_package'].map((t) => (
          <Grid item xs={12} sm={6} md={4} key={t}>
            <Card sx={{ p: 3, height: '100%' }} className="card-hover-effect">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  <TerminalIcon fontSize="small" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>{t.replace('_', ' ').toUpperCase()}</Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 2 }}>
                Version: v1.0 • System Grounding Enforcement Active
              </Typography>
              <Chip label="System Prompt Active" color="primary" size="small" variant="outlined" sx={{ borderColor: 'rgba(59, 130, 246, 0.3)', color: '#60a5fa' }} />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

