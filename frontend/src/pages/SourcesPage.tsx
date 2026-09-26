import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, Typography, Button, TextField, Tabs, Tab, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import LinkIcon from '@mui/icons-material/Link';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import VerifiedIcon from '@mui/icons-material/Verified';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { api } from '../services/api';

interface SourcesPageProps {
  onNavigate: (tab: string, extra?: any) => void;
  initialSourceId?: number;
}

export const SourcesPage: React.FC<SourcesPageProps> = ({ onNavigate, initialSourceId }) => {
  const [sources, setSources] = useState<any[]>([]);
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  
  const [tabValue, setTabValue] = useState(0); // 0 = Text, 1 = Upload, 2 = URL
  const [textTitle, setTextTitle] = useState('');
  const [rawText, setRawText] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const loadSources = async () => {
    try {
      const data = await api.getSources();
      setSources(data);
      if (data.length > 0 && !selectedSource) {
        handleSelectSource(data[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadSources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectSource = async (src: any) => {
    setSelectedSource(src);
    try {
      const [bList, cList] = await Promise.all([
        api.getSourceBlocks(src.id),
        api.getSourceClaims(src.id)
      ]);
      setBlocks(bList);
      setClaims(cList);
    } catch (e) {
      console.error(e);
    }
  };

  const handleIngestText = async () => {
    if (!textTitle || !rawText) return;
    setLoading(true);
    try {
      const newSrc = await api.createSourceText({ title: textTitle, text: rawText, project_id: 1, workspace_id: 1 });
      setOpenModal(false);
      setTextTitle('');
      setRawText('');
      await loadSources();
      handleSelectSource(newSrc);
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };

  const handleIngestUrl = async () => {
    if (!urlInput) return;
    setLoading(true);
    try {
      const newSrc = await api.createSourceUrl({ url: urlInput, project_id: 1, workspace_id: 1 });
      setOpenModal(false);
      setUrlInput('');
      await loadSources();
      handleSelectSource(newSrc);
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('project_id', '1');
      const newSrc = await api.uploadSourceFile(formData);
      setOpenModal(false);
      setSelectedFile(null);
      await loadSources();
      handleSelectSource(newSrc);
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Sources & Ingestion Pipeline</Typography>
          <Typography variant="body2" sx={{ color: '#9ca3af' }}>Ingest, normalize, chunk, and extract grounded facts from documents</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
          Add Source Document
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column: Sources List */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: '78vh', overflowY: 'auto' }}>
            <Typography variant="subtitle2" sx={{ color: '#9ca3af', fontWeight: 700, mb: 2, textTransform: 'uppercase', fontSize: '0.75rem' }}>
              Ingested Sources ({sources.length})
            </Typography>
            {sources.map((src) => {
              const isSelected = selectedSource?.id === src.id;
              return (
                <Paper
                  key={src.id}
                  onClick={() => handleSelectSource(src)}
                  sx={{
                    p: 2,
                    mb: 1.5,
                    cursor: 'pointer',
                    bgcolor: isSelected ? 'rgba(59, 130, 246, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    border: isSelected ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 2,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  className="card-hover-effect"
                >
                  <Typography variant="body2" sx={{ fontWeight: 700, color: isSelected ? '#60a5fa' : '#f8fafc' }}>
                    {src.filename}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
                    <Chip label={src.source_type.toUpperCase()} size="small" sx={{ fontSize: '0.65rem', height: 20, bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }} />
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      {src.word_count || 0} words
                    </Typography>
                    <Chip label={src.status} size="small" color="success" variant="outlined" sx={{ fontSize: '0.65rem', height: 20, ml: 'auto' }} />
                  </Box>
                </Paper>
              );
            })}
          </Card>
        </Grid>

        {/* Right Column: Detail, Canonical Blocks, and Claims */}
        <Grid item xs={12} md={8}>
          {selectedSource ? (
            <Card sx={{ p: 3, height: '78vh', overflowY: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, pb: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.07)' }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc' }}>{selectedSource.filename}</Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    Source Type: {selectedSource.source_type.toUpperCase()} • Chunks: {selectedSource.chunk_count} • Language: {selectedSource.language || 'en'}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AutoFixHighIcon />}
                  onClick={() => onNavigate('wizard', { sourceId: selectedSource.id })}
                  sx={{ fontWeight: 700, boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)' }}
                >
                  Transform Source
                </Button>
              </Box>

              {/* Extracted Grounded Claims */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, color: '#f8fafc' }}>
                <VerifiedIcon sx={{ color: '#10b981', fontSize: 20 }} /> Extracted Grounded Claims ({claims.length})
              </Typography>
              <Grid container spacing={1.5} sx={{ mb: 3 }}>
                {claims.map((claim, i) => (
                  <Grid item xs={12} sm={6} key={claim.id || i}>
                    <Paper sx={{ p: 1.5, bgcolor: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Chip label={claim.claim_type.toUpperCase()} size="small" color="success" sx={{ fontSize: '0.65rem', height: 18 }} />
                        <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 700 }}>95% Confidence</Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: '#e2e8f0', display: 'block', fontWeight: 500 }}>
                        "{claim.claim_text}"
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Canonical Blocks Preview */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, color: '#f8fafc' }}>
                <ViewModuleIcon sx={{ color: '#60a5fa', fontSize: 20 }} /> Canonical Paragraph Blocks ({blocks.length})
              </Typography>
              <Box>
                {blocks.map((blk) => (
                  <Paper key={blk.id} sx={{ p: 2, mb: 1.5, bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" sx={{ color: '#60a5fa', fontWeight: 700 }}>Block #{blk.block_index + 1} ({blk.block_type})</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#cbd5e1', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                      {blk.content}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Card>
          ) : (
            <Card sx={{ p: 6, textAlign: 'center', color: '#94a3b8' }}>
              <DescriptionIcon sx={{ fontSize: 64, color: '#334155', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#cbd5e1' }}>Select a source from the list to view structure & claims</Typography>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Ingestion Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Source Asset</DialogTitle>
        <DialogContent>
          <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)} sx={{ mb: 2 }}>
            <Tab icon={<DescriptionIcon />} label="Raw Text" />
            <Tab icon={<UploadFileIcon />} label="Upload File" />
            <Tab icon={<LinkIcon />} label="Scrape URL" />
          </Tabs>

          {tabValue === 0 && (
            <Box>
              <TextField fullWidth label="Document Title" value={textTitle} onChange={(e) => setTextTitle(e.target.value)} sx={{ mb: 2 }} />
              <TextField fullWidth multiline rows={6} label="Source Content Text" value={rawText} onChange={(e) => setRawText(e.target.value)} />
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ textAlign: 'center', py: 4, border: '2px dashed rgba(255, 255, 255, 0.1)', borderRadius: 2 }}>
              <UploadFileIcon sx={{ fontSize: 48, color: '#60a5fa', mb: 1 }} />
              <Typography variant="body2" sx={{ mb: 2, color: '#94a3b8' }}>Accepted formats: TXT, MD, PDF, DOCX</Typography>
              <input type="file" accept=".txt,.md,.pdf,.docx" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
            </Box>
          )}


          {tabValue === 2 && (
            <Box>
              <TextField fullWidth label="Target Web Page URL" placeholder="https://example.com/article" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          {tabValue === 0 && <Button variant="contained" onClick={handleIngestText} disabled={loading}>Ingest Text</Button>}
          {tabValue === 1 && <Button variant="contained" onClick={handleFileUpload} disabled={loading || !selectedFile}>Upload & Process</Button>}
          {tabValue === 2 && <Button variant="contained" onClick={handleIngestUrl} disabled={loading}>Scrape URL</Button>}
        </DialogActions>
      </Dialog>
    </Box>
  );
};
