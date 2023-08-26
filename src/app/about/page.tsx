import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function About() {
  return (
    <Card variant="outlined" sx={{ width: 250, margin: 'auto', marginTop: '30vh' }}>
      <CardContent>
        <Typography sx={{ fontSize: 30 }} color="text.secondary" gutterBottom>
          Hey, I am Noam Zamski
        </Typography>
      </CardContent>
    </Card>
  );
}