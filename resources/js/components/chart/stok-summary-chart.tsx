import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#00C49F', '#FF8042', '#FFBB28'];

export default function StokSummaryChart({ data }: { data: { tersedia: number; rusak: number; perbaikan: number } }) {
    const chartData = [
        { name: 'Tersedia', value: data.tersedia },
        { name: 'Rusak', value: data.rusak },
        { name: 'Perbaikan', value: data.perbaikan },
    ];

    return (
        <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={50} fill="#8884d8" label>
                        {chartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
