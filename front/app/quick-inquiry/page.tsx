'use client';

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
  Grid,
} from '@mui/material';
import { Header } from '@/components/header';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function QuickInquiryPage() {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [shopName, setShopName] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Stack spacing={3}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              <Stack spacing={1.5}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {t('quickInquiry.heroTitle')}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  {t('quickInquiry.heroDescription')}
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Stack spacing={1.5}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {t('quickInquiry.productTitle')}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      {t('quickInquiry.productDescription')}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Stack spacing={1.5}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {t('quickInquiry.benefitsTitle')}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      {t('quickInquiry.benefitsDescription')}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Stack spacing={1.5}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {t('quickInquiry.whyJoinTitle')}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      {t('quickInquiry.whyJoinDescription')}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Stack spacing={1.5}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {t('quickInquiry.whyUsersTitle')}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      {t('quickInquiry.whyUsersDescription')}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              <Stack spacing={2.5} component="form" onSubmit={handleSubmit}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {t('quickInquiry.formTitle')}
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label={t('quickInquiry.form.fullName')}
                      fullWidth
                      required
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label={t('quickInquiry.form.email')}
                      type="email"
                      fullWidth
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label={t('quickInquiry.form.shopName')}
                      fullWidth
                      required
                      value={shopName}
                      onChange={(event) => setShopName(event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label={t('quickInquiry.form.city')}
                      fullWidth
                      required
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label={t('quickInquiry.form.phone')}
                      fullWidth
                      required
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label={t('quickInquiry.form.message')}
                      fullWidth
                      multiline
                      minRows={4}
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                    />
                  </Grid>
                </Grid>

                <Button type="submit" variant="contained" size="large" sx={{ alignSelf: 'flex-start' }}>
                  {t('quickInquiry.form.submit')}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
