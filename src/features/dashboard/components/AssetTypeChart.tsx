'use client';

import * as React from 'react';
import { Pie, PieChart } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const chartConfig = {
  facility: {
    label: 'Facility Equipment',
    color: 'var(--color-brand-start)',
  },
  service: {
    label: 'Service Equipment',
    color: 'var(--color-brand-end)',
  },
} satisfies ChartConfig;

interface AssetTypeChartProps {
  data: { name: string; value: number; fill: string }[];
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
  if (value === 0) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-base font-bold"
      style={{ textShadow: '0px 1px 3px rgba(0,0,0,0.5)' }}
    >
      {value}
    </text>
  );
};

export function AssetTypeChart({ data }: AssetTypeChartProps) {
  const transformedData = React.useMemo(
    () =>
      data.map((item) => ({
        ...item,
        name: item.name.toLowerCase().includes('facility') ? 'facility' : 'service',
      })),
    [data]
  );
  
  const totalValue = React.useMemo(() => transformedData.reduce((acc, curr) => acc + curr.value, 0), [transformedData]);

  return (
    <>
      <CardHeader>
        <CardTitle>Asset Types</CardTitle>
        <CardDescription>Breakdown of asset categories</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px] relative">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="name" />} />
            <Pie 
                data={transformedData} 
                dataKey="value" 
                nameKey="name" 
                innerRadius={60} 
                strokeWidth={5} 
                labelLine={false}
                label={renderCustomizedLabel}
            />
            <ChartLegend content={<ChartLegendContent nameKey="name" />} className="-mt-4" />
          </PieChart>
          {totalValue > 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</p>
              <p className="text-3xl font-display font-bold text-slate-900 dark:text-white">{totalValue}</p>
            </div>
          )}
        </ChartContainer>
      </CardContent>
    </>
  );
}
