'use client';

import dynamic from 'next/dynamic';
import React from 'react';

export const CallVolumeChartDynamic = dynamic(
  () => import('./call-volume-chart').then((mod) => mod.CallVolumeChart),
  {
    ssr: false,
    loading: () => <div className="col-span-3 min-h-[350px] animate-pulse bg-muted rounded-xl" />,
  }
);
