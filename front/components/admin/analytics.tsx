'use client';

import { Box, Typography, Grid, Card, CardContent, CardHeader, Chip, Paper } from '@mui/material';
import { TrendingUp, TrendingDown, Users, FileText, DollarSign, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const stats = [
  {
    title: 'Ukupni prihod',
    value: '45,230 RSD',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    period: 'ovaj mesec',
  },
  {
    title: 'Narudžbine',
    value: '127',
    change: '+8.2%',
    trend: 'up',
    icon: FileText,
    period: 'ovaj mesec',
  },
  {
    title: 'Novi korisnici',
    value: '34',
    change: '-2.1%',
    trend: 'down',
    icon: Users,
    period: 'ove nedelje',
  },
  {
    title: 'Prosečno vreme',
    value: '45 min',
    change: '-5.3%',
    trend: 'up',
    icon: Clock,
    period: 'po narudžbini',
  },
];

const recentOrders = [
  {
    id: 'PS1234567',
    customer: 'Ana Marković',
    amount: '320 RSD',
    status: 'completed',
    time: 'pre 2 sata',
  },
  {
    id: 'PS1234568',
    customer: 'Petar Nikolić',
    amount: '150 RSD',
    status: 'processing',
    time: 'pre 3 sata',
  },
  {
    id: 'PS1234569',
    customer: 'Milica Jovanović',
    amount: '480 RSD',
    status: 'ready',
    time: 'pre 5 sati',
  },
  {
    id: 'PS1234570',
    customer: 'Stefan Popović',
    amount: '220 RSD',
    status: 'completed',
    time: 'pre 1 dan',
  },
];

const getStatusChip = (status: string, t: (key: string) => string) => {
  switch (status) {
    case 'completed':
      return <Chip label={t('admin.analytics.status.completed')} color="success" size="small" />;
    case 'processing':
      return <Chip label={t('admin.analytics.status.processing')} color="info" size="small" />;
    case 'ready':
      return <Chip label={t('admin.analytics.status.ready')} color="warning" size="small" />;
    default:
      return <Chip label={status} variant="outlined" size="small" />;
  }
};

export function Analytics() {
  const { t } = useTranslation();

  const translatedStats = [
    {
      ...stats[0],
      title: t('admin.analytics.stats.revenue.title'),
      period: t('admin.analytics.stats.revenue.period'),
    },
    {
      ...stats[1],
      title: t('admin.analytics.stats.orders.title'),
      period: t('admin.analytics.stats.orders.period'),
    },
    {
      ...stats[2],
      title: t('admin.analytics.stats.newUsers.title'),
      period: t('admin.analytics.stats.newUsers.period'),
    },
    {
      ...stats[3],
      title: t('admin.analytics.stats.avgTime.title'),
      period: t('admin.analytics.stats.avgTime.period'),
    },
  ];

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      {/* Header */}
      <Box>
        <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
          {t('admin.analytics.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('admin.analytics.subtitle')}
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3}>
        {translatedStats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === 'up';
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;

          return (
            <Grid size={{ xs: 12, md: 6, lg: 3 }} key={stat.title}>
              <Card>
                <CardHeader
                  title={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                      <Icon size={16} color="#888" />
                    </Box>
                  }
                />
                <CardContent>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {stat.value}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <TrendIcon size={14} color={isPositive ? 'green' : 'red'} />
                    <Typography variant="caption" color={isPositive ? 'green' : 'red'}>
                      {stat.change}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('admin.analytics.sinceLastMonth')}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {stat.period}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Recent Orders & Quick Actions */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardHeader
              title={
                <Typography variant="subtitle1" color="primary" fontWeight="bold">
                  {t('admin.analytics.recentOrders')}
                </Typography>
              }
            />
            <CardContent>
              <Box display="flex" flexDirection="column" gap={2}>
                {recentOrders.map((order) => (
                  <Paper
                    key={order.id}
                    sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Box>
                      <Typography variant="body1" color="primary" fontWeight="medium">
                        {order.customer}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {order.id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.time}
                      </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="body1" color="primary" fontWeight="bold">
                        {order.amount}
                      </Typography>
                      {getStatusChip(order.status, t)}
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardHeader
              title={
                <Typography variant="subtitle1" color="primary" fontWeight="bold">
                  {t('admin.analytics.quickActions')}
                </Typography>
              }
            />
            <CardContent>
              <Box display="flex" flexDirection="column" gap={2}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="primary" fontWeight="medium">
                    {t('admin.analytics.pendingOrders')}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    8
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('admin.analytics.needsAttention')}
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="primary" fontWeight="medium">
                    {t('admin.analytics.readyForPickup')}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    3
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('admin.analytics.notifyUsers')}
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="primary" fontWeight="medium">
                    {t('admin.analytics.averageRating')}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    4.8 ⭐
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('admin.analytics.basedOnReviews')}
                  </Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
