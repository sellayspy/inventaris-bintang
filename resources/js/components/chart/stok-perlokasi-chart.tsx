import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type StokLokasiItem = {
    lokasi: string;
    tersedia: number;
    rusak: number;
    perbaikan: number;
};

export default function StokPerLokasiChart({ data = [] }: { data: StokLokasiItem[] }) {
    return (
        <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis dataKey="lokasi" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="tersedia" fill="#00C49F" name="Tersedia" />
                    <Bar dataKey="rusak" fill="#FF8042" name="Rusak" />
                    <Bar dataKey="perbaikan" fill="#FFBB28" name="Perbaikan" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
