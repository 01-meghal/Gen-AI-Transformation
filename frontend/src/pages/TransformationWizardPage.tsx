import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Button, Stepper, Step, StepLabel, Checkbox, Grid, MenuItem, Select, TextField, Chip, CircularProgress } from '@mui/material';
import SparklesIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { api } from '../services/api';

interface TransformationWizardPageProps {
  onNavigate: (tab: string, extra?: any) => void;
  initialSourceId?: number;
}

export const TransformationWizardPage: React.FC<TransformationWizardPageProps> = ({ onNavigate, initialSourceId }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [sources, setSources] = useState<any[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<number | ''>(initialSourceId || '');
  const [brands, setBrands] = useState<any[]>([]);
  
  // Format Selection
  const [targets, setTargets] = useState<string[]>(['executive_summary', 'linkedin_post', 'twitter_x']);
  
  // Config
  const [audience, setAudience] = useState('executives');
  const [tone, setTone] = useState('professional');
  const [detailLevel, setDetailLevel] = useState('medium');
  const [objective, setObjective] = useState('inform');
  const [contentStyle] = useState('bullet_points');
  const [selectedBrandId, setSelectedBrandId] = useState<number | ''>('');
  const [customInstruction, setCustomInstruction] = useState('');
  
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [sList, bList] = await Promise.all([
          api.getSources(),
          api.getBrandProfiles().catch(() => [])
        ]);
        setSources(sList);
        if (sList.length > 0 && !selectedSourceId) {
          setSelectedSourceId(sList[0].id);
        }
        setBrands(bList);
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSourceId]);

  const targetOptions = [
    { id: 'executive_summary', label: 'Executive Summary', desc: 'Source-grounded synthesis with key findings & recommendations' },
    { id: 'linkedin_post', label: 'LinkedIn Post', desc: 'Professional hook, structured body blocks & hashtags' },
    { id: 'twitter_x', label: 'Twitter / X Thread', desc: 'Sequential multi-post thread with character limits' },
    { id: 'advisory', label: 'Strategic Advisory', desc: 'Risk level assessment, affected scope & mitigation steps' },
    { id: 'infographic_spec', label: 'Infographic Specification', desc: 'Visual sections with chart visual_type and metric data' },
    { id: 'presentation', label: 'Presentation Deck', desc: 'Slide outlines, bullet points & speaker notes' },
    { id: 'video_package', label: 'Video Package', desc: 'Timed scene narration, visual description & subtitles' },
  ];

  const handleToggleTarget = (id: string) => {
    if (targets.includes(id)) {
      if (targets.length > 1) setTargets(targets.filter(t => t !== id));
    } else {
      setTargets([...targets, id]);
    }
  };

  const handleExecute = async () => {
    if (!selectedSourceId) return;
    setExecuting(true);
    try {
      const res = await api.createTransformation(Number(selectedSourceId), {
        targets,
        configuration: {
          audience,
          tone,
          detail_level: detailLevel,
          objective,
          content_style: contentStyle,
          brand_profile_id: selectedBrandId ? Number(selectedBrandId) : null,
          custom_instruction: customInstruction || null
        }
      });
      const firstOutputId = res.outputs[0]?.output_id;
      if (firstOutputId) {
        onNavigate('outputs', { outputId: firstOutputId });
      } else {
        onNavigate('dashboard');
      }
    } catch (e) {
      alert(e);
    } finally {
      setExecuting(false);
    }
  };

  const steps = ['Select Source', 'Target Formats', 'Audience & Tone', 'Brand & Custom Rules', 'Review & Generate'];

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: '#f8fafc' }}>Transformation Wizard</Typography>
      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4 }}>Configure multi-channel content synthesis with evidence grounding</Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: '0.825rem', fontWeight: 600 } }}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card sx={{ p: 4, minHeight: 400, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        {/* Step 0: Source */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#f8fafc' }}>Choose Source Document</Typography>
            <Select
              fullWidth
              value={selectedSourceId}
              onChange={(e) => setSelectedSourceId(Number(e.target.value))}
              sx={{ mb: 3 }}
            >
              {sources.map((src) => (
                <MenuItem key={src.id} value={src.id}>
                  {src.filename} ({src.word_count || 0} words • {src.source_type.toUpperCase()})
                </MenuItem>
              ))}
            </Select>
            {selectedSourceId && (
              <Box sx={{ p: 2.5, bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: '#60a5fa', fontWeight: 700, display: 'block', mb: 0.75, letterSpacing: '0.04em' }}>SELECTED SOURCE PREVIEW:</Typography>
                <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                  {sources.find(s => s.id === selectedSourceId)?.content?.slice(0, 320)}...
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Step 1: Target Formats */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#f8fafc' }}>Select Target Formats ({targets.length} selected)</Typography>
            <Grid container spacing={2}>
              {targetOptions.map((opt) => {
                const checked = targets.includes(opt.id);
                return (
                  <Grid item xs={12} sm={6} key={opt.id}>
                    <Card
                      onClick={() => handleToggleTarget(opt.id)}
                      sx={{
                        p: 2.5,
                        cursor: 'pointer',
                        bgcolor: checked ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                        border: checked ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.06)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                      className="card-hover-effect"
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: checked ? '#60a5fa' : '#f8fafc' }}>
                          {opt.label}
                        </Typography>
                        <Checkbox checked={checked} onChange={() => handleToggleTarget(opt.id)} color="primary" />
                      </Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.5, lineHeight: 1.5 }}>
                        {opt.desc}
                      </Typography>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {/* Step 2: Audience & Tone */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#f8fafc' }}>Audience, Tone & Detail Parameters</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#94a3b8' }}>Target Audience</Typography>
                <Select fullWidth value={audience} onChange={(e) => setAudience(e.target.value)}>
                  <MenuItem value="executives">Executives & C-Suite</MenuItem>
                  <MenuItem value="technical">Technical Leads & Engineers</MenuItem>
                  <MenuItem value="general">General Professional</MenuItem>
                  <MenuItem value="customers">End Customers / Clients</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#94a3b8' }}>Tone of Voice</Typography>
                <Select fullWidth value={tone} onChange={(e) => setTone(e.target.value)}>
                  <MenuItem value="professional">Professional & Authoritative</MenuItem>
                  <MenuItem value="persuasive">Persuasive & Engaging</MenuItem>
                  <MenuItem value="formal">Formal & Academic</MenuItem>
                  <MenuItem value="conversational">Conversational & Accessible</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#94a3b8' }}>Detail Level</Typography>
                <Select fullWidth value={detailLevel} onChange={(e) => setDetailLevel(e.target.value)}>
                  <MenuItem value="high_level">High-Level Executive Brief</MenuItem>
                  <MenuItem value="medium">Balanced Detail</MenuItem>
                  <MenuItem value="deep_dive">Comprehensive Deep Dive</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#94a3b8' }}>Primary Objective</Typography>
                <Select fullWidth value={objective} onChange={(e) => setObjective(e.target.value)}>
                  <MenuItem value="inform">Inform & Brief</MenuItem>
                  <MenuItem value="persuade">Persuade & Drive Action</MenuItem>
                  <MenuItem value="educate">Educate & Onboard</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Step 3: Brand & Custom Rules */}
        {activeStep === 3 && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#f8fafc' }}>Brand Profiles & Custom Directives</Typography>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#94a3b8' }}>Brand Profile (Optional)</Typography>
            <Select fullWidth value={selectedBrandId} onChange={(e) => setSelectedBrandId(e.target.value as any)} sx={{ mb: 3 }}>
              <MenuItem value="">No Specific Brand Profile (System Default)</MenuItem>
              {brands.map(b => (
                <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
              ))}
            </Select>

            <Typography variant="subtitle2" sx={{ mb: 1, color: '#94a3b8' }}>Custom Prompt Instruction Overrides</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="e.g. Focus specifically on key readiness metrics and emphasize actionable next steps..."
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
            />
          </Box>
        )}

        {/* Step 4: Summary & Run */}
        {activeStep === 4 && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Box sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: 'rgba(59, 130, 246, 0.12)',
              color: '#60a5fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              border: '1px solid rgba(59, 130, 246, 0.25)'
            }}>
              <SparklesIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#f8fafc' }}>Ready to Execute Transformation</Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3.5, maxWidth: 500, mx: 'auto' }}>
              Synthesizing {targets.length} target formats from source document with automated evidence grounding guardrails.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 4, flexWrap: 'wrap' }}>
              {targets.map(t => (
                <Chip 
                  key={t} 
                  label={t.replace('_', ' ').toUpperCase()} 
                  sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.25)', fontWeight: 600 }} 
                />
              ))}
            </Box>

            {executing ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CircularProgress color="primary" />
                <Typography variant="body2" sx={{ color: '#60a5fa', fontWeight: 600 }}>
                  Generating structured schemas & validating factual grounding...
                </Typography>
              </Box>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleExecute}
                sx={{ fontWeight: 800, px: 5, py: 1.5, fontSize: '1rem', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)' }}
              >
                Run Multi-Format Transformation
              </Button>
            )}
          </Box>
        )}

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.07)' }}>
          <Button disabled={activeStep === 0} onClick={() => setActiveStep(activeStep - 1)} sx={{ color: '#94a3b8' }}>
            Back
          </Button>
          {activeStep < 4 && (
            <Button variant="contained" color="primary" onClick={() => setActiveStep(activeStep + 1)} disabled={!selectedSourceId}>
              Next Step
            </Button>
          )}
        </Box>
      </Card>
    </Box>
  );
};

