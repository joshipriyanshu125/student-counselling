import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

export const AreaTrendsChart = ({ data, lines }) => {
    const axisColor = '#64748B';
    const gridColor = '#E2E8F0';
    const tooltipBg = '#FFFFFF';
    const tooltipText = '#1E293B';

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <AreaChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        {lines.map((line, idx) => (
                            <linearGradient key={`gradient-${idx}`} id={`color-${line.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={line.stroke} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={line.stroke} stopOpacity={0} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 12 }} dx={-10} />
                    
                    <Tooltip
                        contentStyle={{ 
                            backgroundColor: tooltipBg,
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' 
                        }}
                        itemStyle={{ fontWeight: 500 }}
                        labelStyle={{ fontWeight: 600, color: tooltipText, marginBottom: '4px' }}
                    />
                    
                    {lines.map((line, idx) => (
                        <Area
                            key={`area-${idx}`}
                            type="monotone"
                            dataKey={line.dataKey}
                            name={line.name}
                            stroke={line.stroke}
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill={`url(#color-${line.dataKey})`}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export const DonutPieChart = ({ data, colors }) => {
    const tooltipBg = '#FFFFFF';
    const tooltipText = '#1E293B';

    return (
        <div className="flex flex-col items-center justify-center w-full" style={{ minHeight: '360px' }}>
            <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={95}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ 
                                backgroundColor: tooltipBg,
                                borderRadius: '12px', 
                                border: 'none', 
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                                padding: '12px'
                            }}
                            itemStyle={{ fontWeight: 600, color: tooltipText }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-4 px-4">
                {data.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center gap-2 group transition-all duration-200">
                        <div 
                            className="w-3 h-3 rounded-full shadow-sm" 
                            style={{ backgroundColor: colors[index % colors.length] }}
                        ></div>
                        <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground">
                            {entry.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const BarTrendsChart = ({ data, lines }) => {
    const axisColor = '#64748B';
    const gridColor = '#E2E8F0';
    const tooltipBg = '#FFFFFF';
    const tooltipText = '#1E293B';

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    barGap={8}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 12 }} dx={-10} />
                    
                    <Tooltip
                        contentStyle={{ 
                            backgroundColor: tooltipBg,
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' 
                        }}
                        itemStyle={{ fontWeight: 500 }}
                        labelStyle={{ fontWeight: 600, color: tooltipText, marginBottom: '4px' }}
                        cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                    />
                    
                    {lines.map((line, idx) => (
                        <Bar
                            key={`bar-${idx}`}
                            dataKey={line.dataKey}
                            name={line.name}
                            fill={line.stroke}
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
