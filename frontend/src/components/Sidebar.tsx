import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import FolderSpecialIcon from '@mui/icons-material/FolderOpenOutlined';
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHighOutlined';
import RateReviewIcon from '@mui/icons-material/RateReviewOutlined';
import StyleIcon from '@mui/icons-material/StyleOutlined';
import TerminalIcon from '@mui/icons-material/TerminalOutlined';
import WebhookIcon from '@mui/icons-material/WebhookOutlined';
import AnalyticsIcon from '@mui/icons-material/AnalyticsOutlined';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon fontSize="small" /> },
    { id: 'projects', label: 'Projects', icon: <FolderSpecialIcon fontSize="small" /> },
    { id: 'sources', label: 'Sources & Ingestion', icon: <DescriptionIcon fontSize="small" /> },
    { id: 'wizard', label: 'Transform Wizard', icon: <AutoFixHighIcon fontSize="small" /> },
    { id: 'reviews', label: 'Review Queue', icon: <RateReviewIcon fontSize="small" /> },
  ];

  const adminItems = [
    { id: 'brands', label: 'Brand Profiles', icon: <StyleIcon fontSize="small" /> },
    { id: 'prompts', label: 'Prompt Management', icon: <TerminalIcon fontSize="small" /> },
    { id: 'integrations', label: 'Webhooks & Delivery', icon: <WebhookIcon fontSize="small" /> },
    { id: 'observability', label: 'Usage & Audit', icon: <AnalyticsIcon fontSize="small" /> },
  ];

  return (
    <Box sx={{
      width: 250,
      minHeight: 'calc(100vh - 64px)',
      background: '#0e1420',
      borderRight: '1px solid rgba(255, 255, 255, 0.07)',
      px: 1.75,
      py: 2.5
    }}>
      <Typography variant="caption" sx={{ color: '#475569', fontWeight: 700, px: 1.5, letterSpacing: '0.07em', textTransform: 'uppercase', fontSize: '0.675rem' }}>
        Core Workspace
      </Typography>
      <List sx={{ mt: 1, p: 0 }}>
        {menuItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => onSelectTab(item.id)}
                sx={{
                  borderRadius: '8px',
                  py: 1,
                  px: 1.5,
                  bgcolor: isActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                  color: isActive ? '#60a5fa' : '#94a3b8',
                  borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                  transition: 'all 0.15s ease-in-out',
                  '&:hover': {
                    bgcolor: isActive ? 'rgba(59, 130, 246, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                    color: '#f8fafc',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#3b82f6' : '#64748b', minWidth: 34 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: isActive ? 700 : 500 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ my: 2.5, borderColor: 'rgba(255, 255, 255, 0.06)' }} />

      <Typography variant="caption" sx={{ color: '#475569', fontWeight: 700, px: 1.5, letterSpacing: '0.07em', textTransform: 'uppercase', fontSize: '0.675rem' }}>
        Governance & Operations
      </Typography>
      <List sx={{ mt: 1, p: 0 }}>
        {adminItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => onSelectTab(item.id)}
                sx={{
                  borderRadius: '8px',
                  py: 1,
                  px: 1.5,
                  bgcolor: isActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                  color: isActive ? '#60a5fa' : '#94a3b8',
                  borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                  transition: 'all 0.15s ease-in-out',
                  '&:hover': {
                    bgcolor: isActive ? 'rgba(59, 130, 246, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                    color: '#f8fafc',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#3b82f6' : '#64748b', minWidth: 34 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: isActive ? 700 : 500 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

