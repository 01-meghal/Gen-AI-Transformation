import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { api } from '../services/api';

interface ProjectsPageProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async () => {
    if (!name) return;
    try {
      await api.createProject({ name, description: desc });
      setName('');
      setDesc('');
      setOpenModal(false);
      loadProjects();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc' }}>Transformation Projects</Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>Manage target repositories for content assets & batch transformations</Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenModal(true)} sx={{ fontWeight: 700 }}>
          New Project
        </Button>
      </Box>

      <Grid container spacing={3}>
        {projects.map((proj) => (
          <Grid item xs={12} sm={6} md={4} key={proj.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="card-hover-effect">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <FolderIcon />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>{proj.name}</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3, lineHeight: 1.6 }}>
                  {proj.description || 'No description provided.'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip icon={<DescriptionIcon sx={{ fontSize: '14px !important', color: '#60a5fa !important' }} />} label={`${proj.source_count || 0} Sources`} size="small" variant="outlined" sx={{ borderColor: 'rgba(59, 130, 246, 0.25)', color: '#93c5fd' }} />
                  <Chip icon={<AutoFixHighIcon sx={{ fontSize: '14px !important', color: '#34d399 !important' }} />} label={`${proj.output_count || 0} Outputs`} size="small" variant="outlined" sx={{ borderColor: 'rgba(16, 185, 129, 0.25)', color: '#6ee7b7' }} />
                </Box>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button fullWidth variant="outlined" size="small" onClick={() => onNavigate('sources', { projectId: proj.id })} sx={{ color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                  View Sources & Assets
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#f8fafc' }}>Create New Project</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Project Name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mt: 2, mb: 2 }} />
          <TextField fullWidth multiline rows={3} label="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleCreate}>Create Project</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

};
