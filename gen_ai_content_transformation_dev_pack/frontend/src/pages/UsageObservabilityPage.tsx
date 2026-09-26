import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Grid, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material';
import { api } from '../services/api';

export const UsageObservabilityPage: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [auditEvents, setAuditEvents] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [sum, recs, audits] = await Promise.all([
          api.getUsageSummary(),
          api.getUsageRecords(),
          api.getAuditEvents()
        ]);
        setSummary(sum);
        setRecords(recs);
        setAuditEvents(audits);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#f8fafc' }}>Observability, Token Accounting & Audit</Typography>
      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4 }}>Real-time token usage, estimated costs, latency metrics & audit logs</Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <Card sx={{ p: 3 }} className="card-hover-effect">
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>Total Input Tokens</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#60a5fa', mt: 1 }}>
              {summary?.total_input_tokens || 0}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card sx={{ p: 3 }} className="card-hover-effect">
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>Total Output Tokens</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#34d399', mt: 1 }}>
              {summary?.total_output_tokens || 0}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card sx={{ p: 3 }} className="card-hover-effect">
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>Total Estimated USD Cost</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#34d399', mt: 1 }}>
              ${summary?.total_cost_usd || '0.0000'}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card sx={{ p: 3 }} className="card-hover-effect">
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>Total AI Transformations</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#fbbf24', mt: 1 }}>
              {summary?.total_generations || 0}
            </Typography>
          </Card>
        </Grid>
      </Grid>


      {/* Tables */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>AI Generation Usage Log</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Provider / Model</TableCell>
                  <TableCell>Tokens (In/Out)</TableCell>
                  <TableCell>Latency</TableCell>
                  <TableCell>Cost</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell><Chip label={r.model} size="small" variant="outlined" /></TableCell>
                    <TableCell>{r.input_tokens} / {r.output_tokens}</TableCell>
                    <TableCell>{r.latency_ms} ms</TableCell>
                    <TableCell>${r.estimated_cost_usd}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Workspace Audit Trail</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Event Type</TableCell>
                  <TableCell>Resource</TableCell>
                  <TableCell>Actor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditEvents.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell><Chip label={a.event_type} size="small" color="primary" /></TableCell>
                    <TableCell>{a.resource_type}:{a.resource_id}</TableCell>
                    <TableCell>User #{a.actor_user_id || 1}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
