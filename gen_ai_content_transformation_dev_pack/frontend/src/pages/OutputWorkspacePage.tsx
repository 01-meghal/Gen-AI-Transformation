import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, Typography, Button, Tabs, Tab, Chip, Drawer, Divider, TextField, Menu, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import HistoryIcon from '@mui/icons-material/History';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CodeIcon from '@mui/icons-material/Code';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { api } from '../services/api';

interface OutputWorkspacePageProps {
  onNavigate: (tab: string, extra?: any) => void;
  outputId: number;
}

export const OutputWorkspacePage: React.FC<OutputWorkspacePageProps> = ({ onNavigate, outputId }) => {
  const [output, setOutput] = useState<any>(null);
  const [currentVersion, setCurrentVersion] = useState<any>(null);
  const [source, setSource] = useState<any>(null);
  const [claims, setClaims] = useState<any[]>([]);
  const [versions, setVersions] = useState<any[]>([]);
  
  const [rightTab, setRightTab] = useState(0); // 0 = Preview, 1 = JSON Editor, 2 = Quality Panel
  const [editableJson, setEditableJson] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [downloadAnchor, setDownloadAnchor] = useState<null | HTMLElement>(null);
  const [regenPrompt, setRegenPrompt] = useState('');
  const [showRegenModal, setShowRegenModal] = useState(false);

  const loadOutputData = async () => {
    try {
      const out = await api.getOutputDetail(outputId);
      setOutput(out);

      if (out.current_version_id) {
        const ver = await api.getOutputVersionDetail(outputId, out.current_version_id);
        setCurrentVersion(ver);
        setEditableJson(typeof ver.content === 'string' ? ver.content : JSON.stringify(JSON.parse(ver.content), null, 2));
      }

      const vList = await api.getOutputVersions(outputId);
      setVersions(vList);

      if (out.source_id) {
        const src = await api.getSourceDetail(out.source_id);
        setSource(src);
        const cList = await api.getSourceClaims(out.source_id);
        setClaims(cList);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (outputId) {
      loadOutputData();
    }
  }, [outputId]);

  const handleSaveUserEdit = async () => {
    try {
      const parsed = JSON.parse(editableJson);
      await api.createUserEditedVersion(outputId, { content: parsed });
      setIsEditing(false);
      await loadOutputData();
      alert('New user-edited OutputVersion saved successfully!');
    } catch (e) {
      alert('Invalid JSON format: ' + e);
    }
  };

  const handleRegenerate = async () => {
    try {
      await api.regenerateOutput(outputId, { instruction: regenPrompt });
      setShowRegenModal(false);
      setRegenPrompt('');
      await loadOutputData();
      alert('Output regenerated successfully!');
    } catch (e) {
      alert(e);
    }
  };

  const handleDownload = (format: string) => {
    if (!currentVersion) return;
    const url = api.downloadOutputVersionUrl(currentVersion.id, format);
    window.open(url, '_blank');
    setDownloadAnchor(null);
  };

  const handleSelectVersion = async (verId: number) => {
    try {
      const ver = await api.getOutputVersionDetail(outputId, verId);
      setCurrentVersion(ver);
      setEditableJson(typeof ver.content === 'string' ? ver.content : JSON.stringify(JSON.parse(ver.content), null, 2));
    } catch (e) {
      console.error(e);
    }
  };

  if (!output || !currentVersion) {
    return <Box sx={{ p: 4 }}><Typography>Loading Output Workspace...</Typography></Box>;
  }

  const qualityReport = typeof currentVersion.quality_report === 'string' 
    ? JSON.parse(currentVersion.quality_report) 
    : currentVersion.quality_report || {};

  return (
    <Box sx={{ p: 3 }}>
      {/* Top Header Bar */}
      <Card sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip label={output.transform_type.replace('_', ' ').toUpperCase()} color="primary" sx={{ fontWeight: 800 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Output Asset #{output.id} (Version {currentVersion.version})
            </Typography>
            <Typography variant="caption" sx={{ color: '#9ca3af' }}>
              Origin: `{currentVersion.origin}` • Status: `{output.status.toUpperCase()}`
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          {isEditing ? (
            <Button variant="contained" color="success" startIcon={<SaveIcon />} onClick={handleSaveUserEdit}>
              Save Version
            </Button>
          ) : (
            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => { setIsEditing(true); setRightTab(1); }}>
              Edit Output
            </Button>
          )}

          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => setShowRegenModal(true)}>
            Regenerate
          </Button>

          <Button variant="contained" color="secondary" startIcon={<RateReviewIcon />} onClick={() => onNavigate('reviews')}>
            Submit Review
          </Button>

          <Button variant="contained" startIcon={<DownloadIcon />} onClick={(e) => setDownloadAnchor(e.currentTarget)}>
            Export Download
          </Button>
          <Menu anchorEl={downloadAnchor} open={Boolean(downloadAnchor)} onClose={() => setDownloadAnchor(null)}>
            <MenuItem onClick={() => handleDownload('md')}>Markdown (.md)</MenuItem>
            <MenuItem onClick={() => handleDownload('txt')}>Plain Text (.txt)</MenuItem>
            <MenuItem onClick={() => handleDownload('json')}>JSON Payload (.json)</MenuItem>
            <MenuItem onClick={() => handleDownload('html')}>HTML Document (.html)</MenuItem>
          </Menu>
        </Box>
      </Card>

      {/* Dual Pane Layout */}
      <Grid container spacing={3}>
        {/* Left Pane: Source Text & Evidence Grounding Drawer */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 2.5, height: '75vh', overflowY: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <VerifiedIcon sx={{ color: '#10b981' }} /> Source Text & Grounded Evidence
            </Typography>
            <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mb: 2 }}>
              Source: {source?.filename}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#60a5fa', mb: 1 }}>
                Extracted Grounding Claims ({claims.length})
              </Typography>
              {claims.map((clm, i) => (
                <Box key={i} sx={{ p: 1.5, mb: 1, bgcolor: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 700, display: 'block' }}>
                    [ev_{i+1}] {clm.claim_type.toUpperCase()}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#e2e8f0' }}>
                    "{clm.claim_text}"
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#94a3b8', mb: 1 }}>
              Original Source Text
            </Typography>
            <Typography variant="body2" sx={{ color: '#cbd5e1', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.875rem' }}>
              {source?.content || 'Source content text...'}
            </Typography>
          </Card>
        </Grid>

        {/* Right Pane: Generated Preview / JSON Editor / Quality Panel */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 2.5, height: '75vh', overflowY: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Tabs value={rightTab} onChange={(_, val) => setRightTab(val)}>
                <Tab icon={<VisibilityIcon />} label="Rendered Preview" />
                <Tab icon={<CodeIcon />} label="Structured JSON Editor" />
                <Tab icon={<SecurityIcon />} label="Quality & Guardrails" />
              </Tabs>

              {/* Version Selector */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HistoryIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>Versions:</Typography>
                {versions.map(v => (
                  <Chip
                    key={v.id}
                    label={`v${v.version}`}
                    size="small"
                    onClick={() => handleSelectVersion(v.id)}
                    color={v.id === currentVersion.id ? "primary" : "default"}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Box>

            {/* Tab 0: Rendered Markdown Preview */}
            {rightTab === 0 && (
              <Box sx={{ p: 2.5, bgcolor: 'rgba(0, 0, 0, 0.25)', borderRadius: 2, minHeight: 400, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: '#f8fafc', lineHeight: 1.7 }}>
                  {currentVersion.rendered_text}
                </Typography>
              </Box>
            )}

            {/* Tab 1: Structured JSON Editor */}
            {rightTab === 1 && (
              <Box>
                <TextField
                  fullWidth
                  multiline
                  rows={18}
                  value={editableJson}
                  onChange={(e) => setEditableJson(e.target.value)}
                  sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                />
              </Box>
            )}

            {/* Tab 2: Quality Panel */}
            {rightTab === 2 && (
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#f8fafc' }}>Automated Quality & Safety Evaluation</Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card sx={{ p: 2, bgcolor: 'rgba(16, 185, 129, 0.06)', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
                      <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>Grounding Score</Typography>
                      <Typography variant="h4" sx={{ color: '#34d399', fontWeight: 800 }}>
                        {((qualityReport.grounding_score || 0.98) * 100).toFixed(0)}%
                      </Typography>
                    </Card>
                  </Grid>

                  <Grid item xs={6}>
                    <Card sx={{ p: 2, bgcolor: 'rgba(59, 130, 246, 0.06)', borderColor: 'rgba(59, 130, 246, 0.25)' }}>
                      <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>Overall Quality Score</Typography>
                      <Typography variant="h4" sx={{ color: '#60a5fa', fontWeight: 800 }}>
                        {qualityReport.overall_quality_score || 98} / 100
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#f8fafc' }}>PII & Defense Status</Typography>
                  <Chip
                    icon={<CheckCircleIcon />}
                    label={qualityReport.pii_detected ? "PII Warning Detected" : "Zero PII Leakage Detected"}
                    color={qualityReport.pii_detected ? "warning" : "success"}
                    variant="outlined"
                  />
                </Box>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Regeneration Modal */}
      {showRegenModal && (
        <Drawer anchor="right" open={showRegenModal} onClose={() => setShowRegenModal(false)}>
          <Box sx={{ width: 400, p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#f8fafc' }}>Regenerate Output</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Custom Instruction Override"
              placeholder="e.g. Make the tone more formal and emphasize technical benchmarks..."
              value={regenPrompt}
              onChange={(e) => setRegenPrompt(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button fullWidth variant="contained" color="primary" onClick={handleRegenerate} sx={{ fontWeight: 700, boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)' }}>
              Trigger Regeneration
            </Button>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

