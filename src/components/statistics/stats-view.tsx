"use client";

import React, { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useAppContext } from "@/context/app-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, getWeek, parseISO } from 'date-fns';

export function StatsView() {
    const { deities, countHistory } = useAppContext();
    const [selectedDeityId, setSelectedDeityId] = useState<string>("all");

    const filteredHistory = useMemo(() => {
        if (selectedDeityId === "all") return countHistory;
        return countHistory.filter(record => record.deityId === selectedDeityId);
    }, [countHistory, selectedDeityId]);

    const weeklyData = useMemo(() => {
        const today = new Date();
        const last7Days = eachDayOfInterval({ start: subDays(today, 6), end: today });
        const data = last7Days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayRecords = filteredHistory.filter(r => r.date === dateStr);
            const totalCount = dayRecords.reduce((sum, r) => sum + r.count, 0);
            return {
                name: format(day, 'EEE'),
                date: dateStr,
                count: totalCount,
            };
        });
        return data;
    }, [filteredHistory]);

    const monthlyData = useMemo(() => {
        const today = new Date();
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const data: { [week: string]: number } = {};
        
        filteredHistory.forEach(record => {
            const recordDate = parseISO(record.date);
            if(recordDate >= monthStart && recordDate <= today) {
                const weekNumber = getWeek(recordDate);
                const weekKey = `Week ${weekNumber}`;
                if (!data[weekKey]) data[weekKey] = 0;
                data[weekKey] += record.count;
            }
        });

        return Object.entries(data).map(([name, count]) => ({name, count})).sort((a, b) => a.name.localeCompare(b.name));
    }, [filteredHistory]);


    const renderChart = (data: {name: string, count: number}[]) => (
        data.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2}/>
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))"/>
                    <YAxis stroke="hsl(var(--muted-foreground))"/>
                    <Tooltip
                        contentStyle={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)",
                        }}
                    />
                    <Legend />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground border-2 border-dashed rounded-lg">
                No chanting history found for this period.
            </div>
        )
    );

  return (
    <AppLayout>
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
                <p className="text-muted-foreground">Review your chanting progress.</p>
            </div>
            <div className="w-full md:w-auto">
                <Select value={selectedDeityId} onValueChange={setSelectedDeityId}>
                    <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Filter by name" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Deities</SelectItem>
                        {deities.map(deity => (
                            <SelectItem key={deity.id} value={deity.id}>{deity.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

        <Tabs defaultValue="weekly">
            <TabsList>
                <TabsTrigger value="weekly">Last 7 Days</TabsTrigger>
                <TabsTrigger value="monthly">This Month</TabsTrigger>
            </TabsList>
            <TabsContent value="weekly">
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Progress</CardTitle>
                        <CardDescription>Total chants over the last 7 days.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renderChart(weeklyData)}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="monthly">
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Progress</CardTitle>
                        <CardDescription>Total chants aggregated by week for the current month.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renderChart(monthlyData)}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
