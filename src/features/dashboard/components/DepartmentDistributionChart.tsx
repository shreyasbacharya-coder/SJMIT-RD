'use client';

import { Bar, BarChart, CartesianGrid, XAxis, LabelList } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const chartConfig = {
  equipment: {
    label: 'Equipment',
    color: 'var(--color-brand-start)',
  },
} satisfies ChartConfig;

interface DepartmentDistributionChartProps {
  data: { department: string; equipment: number }[];
}

export function DepartmentDistributionChart({ data }: DepartmentDistributionChartProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>Equipment Distribution</CardTitle>
        <CardDescription>Number of equipment items per department</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 30,
              right: 20,
              left: 0,
              bottom: 40,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="department"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={60}
              tickFormatter={(value) => (value.length > 15 ? `${value.substring(0, 15)}...` : value)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Bar dataKey="equipment" fill="var(--color-equipment)" radius={4}>
                <LabelList 
                    dataKey="equipment" 
                    position="top" 
                    offset={8} 
                    className="fill-foreground font-bold"
                    fontSize={12}
                    formatter={(value: number) => value > 0 ? value : ''}
                />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </>
  );
}
