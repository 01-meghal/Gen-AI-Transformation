import React from 'react';
import { AppBar, Toolbar, Typography, Box, Chip, Avatar, Tooltip } from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';
import ShieldCheckIcon from '@mui/icons-material/ShieldOutlined';
import WorkspacesIcon from '@mui/icons-material/FolderOutlined';

export const Navbar: React.FC = () => {
  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        background: 'rgba(10, 14, 23, 0.85)', 
        backdropFilter: 'blur(16px)', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)' 
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
          <Box sx={{
            width: 38,
            height: 38,
            borderRadius: '9px',
            background: 'linear-gradient(135deg, #2563eb 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
            borderTop: '1px solid rgba(255, 255, 255, 0.25)'
          }}>
            <LayersIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.05rem', color: '#f8fafc' }}>
              TRANSFORM<span style={{ color: '#34d399', fontWeight: 600 }}> ENGINE</span>
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: -0.4, fontSize: '0.725rem', letterSpacing: '0.01em' }}>
              Enterprise Content Transformation Platform
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            icon={<WorkspacesIcon sx={{ fontSize: '14px !important', color: '#60a5fa !important' }} />}
            label="Default Workspace"
            size="small"
            sx={{ 
              bgcolor: 'rgba(59, 130, 246, 0.1)', 
              color: '#93c5fd', 
              border: '1px solid rgba(59, 130, 246, 0.22)',
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          />

          <Tooltip title="AI Gateway Operational with Grounding Guardrails">
            <Chip
              icon={<ShieldCheckIcon sx={{ fontSize: '14px !important', color: '#34d399 !important' }} />}
              label="Guardrails Active"
              size="small"
              sx={{ 
                bgcolor: 'rgba(16, 185, 129, 0.1)', 
                color: '#6ee7b7', 
                border: '1px solid rgba(16, 185, 129, 0.22)',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            />
          </Tooltip>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, pl: 1.5, borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: '#2563eb', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              SA
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#f1f5f9', lineHeight: 1.1 }}>Senior Admin</Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>admin@example.com</Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

