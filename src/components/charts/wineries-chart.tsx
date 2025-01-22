"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { ScrollArea } from "../ui/scroll-area"

type WineryChartData = {
    name: string;
    winesCount: number;
}

type WineriesChartProps = {
    data: WineryChartData[];
    title: string;
}

const chartConfig = {
    winesCount: {
        label: "Wines",
        color: "#ff915e",
    },
}

export function WineriesChart({ data, title }: WineriesChartProps) {
    if (data.length === 0) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[300px]">
                    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{
                                top: 0,
                                right: 40,
                                left: 20,
                                bottom: 0,
                            }}
                            barSize={14}
                            barGap={0}
                            barCategoryGap="10%"
                            compact={true}
                        >
                            <XAxis 
                                type="number" 
                                tickLine={false}
                                axisLine={false}
                                tick={{
                                    dx: 10,
                                    fontSize: 12
                                }}
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                width={150}
                                tick={{ 
                                    fontSize: 12,
                                    textAnchor: "end",
                                    dy: 0,
                                }}
                                interval={0}
                                padding={{ top: 0, bottom: 0 }}
                                minTickGap={0}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent />}
                            />
                            <Bar 
                                dataKey="winesCount" 
                                fill={chartConfig.winesCount.color}
                                radius={[4, 4, 4, 4]} 
                            >
                                <LabelList 
                                    dataKey="winesCount" 
                                    position="right"
                                    fill="currentColor"
                                    className="text-xs"
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
