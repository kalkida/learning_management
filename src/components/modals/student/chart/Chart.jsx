import "./chart.css";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", Total: 700 },
  { name: "Feb", Total: 800 },
  { name: "Mar  ", Total: 800 },
  { name: "Apr", Total: 1600 },
  { name: "May", Total: 900 },
  { name: "June", Total: 1700 },
  { name: "July", Total: 1200 },
  { name: "Aug", Total: 2100 },
  { name: "Sept", Total: 800 },
  { name: "Oct", Total: 1600 },
  { name: "Nov", Total: 900 },
  { name: "Dec", Total: 1700 },
];

const Chart = ({ aspect, title }) => {
  return (
    <div className="chart">
      <div className="title">{title}</div>
      <ResponsiveContainer width="98%" aspect={aspect}>
        <AreaChart
          width={750}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
        >
          {/* 
request.auth != null; */}
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="2%" stopColor="#DC5FC9" stopOpacity={0.2} />
              <stop offset="98%" stopColor="white" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#DC5FC9"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;