import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";

export function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const points = data.map((v, i) => ({ i, v }));
  const stroke = positive ? "var(--ok)" : "var(--err)";
  return (
    <div className="h-14 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 4, bottom: 4, left: 0, right: 0 }}>
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Line
            type="monotone"
            dataKey="v"
            stroke={stroke}
            strokeWidth={1.75}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
