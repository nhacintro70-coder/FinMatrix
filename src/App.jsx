import { useState, useMemo } from 'react';
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, ReferenceLine,
  PieChart, Pie, Cell 
} from 'recharts';
import { Calculator, TrendingUp, PiggyBank, Clock, Percent, Target } from 'lucide-react';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);
};

const formatCompactCurrency = (value) => {
  if (value >= 1e9) return (value / 1e9).toFixed(1) + ' Tỷ';
  if (value >= 1e6) return (value / 1e6).toFixed(1) + ' Tr';
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value);
};

const ControlGroup = ({ icon: Icon, label, value, onChange, min, max, step, format, isFormatted }) => {
  const displayValue = isFormatted 
    ? (value === 0 || value === '' ? '' : new Intl.NumberFormat('vi-VN').format(value))
    : (value === 0 || value === '' ? '' : value);

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <label className="flex items-center text-gray-300 font-medium">
          <Icon className="w-4 h-4 mr-2 text-emerald-400" />
          {label}
        </label>
        <div className="relative">
          <input
            type={isFormatted ? "text" : "number"}
            value={displayValue}
            onChange={(e) => {
              if (isFormatted) {
                const numericVal = e.target.value.replace(/[^\d]/g, '');
                onChange(numericVal === '' ? '' : Number(numericVal));
              } else {
                const val = e.target.value;
                onChange(val === '' ? '' : Number(val));
              }
            }}
            className="bg-gray-900 border border-gray-600 text-white rounded-lg px-3 py-1 w-32 text-right focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
          {isFormatted && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">₫</span>}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-500 w-12">{format ? format(min) : min}</span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value || 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
        <span className="text-xs text-gray-500 w-12 text-right">{format ? format(max) : max}</span>
      </div>
    </div>
  );
};

export default function App() {
  const [initialAmount, setInitialAmount] = useState(0);
  const [monthlyContribution, setMonthlyContribution] = useState(200000);
  const [contributionIncreaseRate, setContributionIncreaseRate] = useState(5);
  const [interestRate, setInterestRate] = useState(6);
  const [inflationRate, setInflationRate] = useState(3.5);
  const [years, setYears] = useState(30);
  const [targetAmount, setTargetAmount] = useState(0);

  const data = useMemo(() => {
    const result = [];
    const r = interestRate / 100 / 12;
    const inflation = inflationRate / 100;
    const contributionIncrease = contributionIncreaseRate / 100;
    
    let currentNominal = initialAmount || 0;
    let currentMonthlyPMT = monthlyContribution || 0;
    let totalGoc = initialAmount || 0;
    let prevNominal = currentNominal;

    for (let i = 1; i <= years; i++) {
      let nominalThisYear = currentNominal;
      for (let m = 1; m <= 12; m++) {
        nominalThisYear = nominalThisYear * (1 + r) + currentMonthlyPMT;
      }
      
      currentNominal = nominalThisYear;
      totalGoc += currentMonthlyPMT * 12;
      
      const laiSinhRa = currentNominal - totalGoc;
      const realValue = currentNominal / Math.pow(1 + inflation, i);
      const laiTrongNam = currentNominal - prevNominal - (currentMonthlyPMT * 12);

      result.push({
        year: `Năm ${i}`,
        yearNum: i,
        gocNopVao: Math.round(totalGoc),
        laiSinhRa: Math.round(laiSinhRa),
        laiTrongNam: Math.round(laiTrongNam),
        nominal: Math.round(currentNominal),
        real: Math.round(realValue),
      });

      prevNominal = currentNominal;
      currentMonthlyPMT = currentMonthlyPMT * (1 + contributionIncrease);
    }
    return result;
  }, [initialAmount, monthlyContribution, contributionIncreaseRate, interestRate, inflationRate, years]);

  const finalNominal = data[data.length - 1]?.nominal || 0;
  const finalReal = data[data.length - 1]?.real || 0;
  const finalGoc = data[data.length - 1]?.gocNopVao || 0;
  const finalLai = data[data.length - 1]?.laiSinhRa || 0;

  const targetYear = useMemo(() => {
    if (!targetAmount) return null;
    const found = data.find(d => d.nominal >= targetAmount);
    return found ? found.yearNum : null;
  }, [data, targetAmount]);

  const pieData = [
    { name: 'Tổng tiền gốc', value: finalGoc },
    { name: 'Lãi sinh ra', value: finalLai },
  ];
  const COLORS = ['#14b8a6', '#0ea5e9']; // teal-500, sky-500

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8 font-sans text-gray-100">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-emerald-500/10 rounded-xl">
            <Calculator className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Tính Toán Tài Chính Cá Nhân
            </h1>
            <p className="text-gray-400">Dự báo sự tăng trưởng tài sản với Lãi kép & Lạm phát</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: Controls */}
          <div className="space-y-4 lg:col-span-1 bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center text-white">
              <TrendingUp className="w-5 h-5 mr-2 text-emerald-500" />
              Thông số đầu vào
            </h2>

            <ControlGroup
              icon={Target}
              label="Mục tiêu tài chính"
              value={targetAmount}
              onChange={setTargetAmount}
              min={0}
              max={10000000000}
              step={1000000}
              format={(v) => v >= 1e9 ? `${v/1e9} Tỷ` : `${v/1e6} Tr`}
              isFormatted={true}
            />

            <ControlGroup
              icon={PiggyBank}
              label="Số tiền ban đầu"
              value={initialAmount}
              onChange={setInitialAmount}
              min={0}
              max={1000000000}
              step={1000000}
              format={(v) => v >= 1e9 ? `${v/1e9} Tỷ` : `${v/1e6} Tr`}
              isFormatted={true}
            />

            <ControlGroup
              icon={PiggyBank}
              label="Gửi hàng tháng"
              value={monthlyContribution}
              onChange={setMonthlyContribution}
              min={0}
              max={50000000}
              step={500000}
              format={(v) => `${v/1e6} Tr`}
              isFormatted={true}
            />

            <ControlGroup
              icon={TrendingUp}
              label="Tăng tiền gửi (%/năm)"
              value={contributionIncreaseRate}
              onChange={setContributionIncreaseRate}
              min={0}
              max={20}
              step={0.5}
            />

            <ControlGroup
              icon={Percent}
              label="Lãi suất (%/năm)"
              value={interestRate}
              onChange={setInterestRate}
              min={1}
              max={20}
              step={0.5}
            />

            <ControlGroup
              icon={Percent}
              label="Lạm phát (%/năm)"
              value={inflationRate}
              onChange={setInflationRate}
              min={0}
              max={10}
              step={0.1}
            />

            <ControlGroup
              icon={Clock}
              label="Thời gian (năm)"
              value={years}
              onChange={setYears}
              min={1}
              max={50}
              step={1}
            />
          </div>

          {/* Right panel: Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Top Dashboard Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Summary Cards */}
              <div className="md:col-span-2 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                  <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-lg relative overflow-hidden group flex flex-col justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-gray-400 mb-1">Giá trị danh nghĩa (Sau {years} năm)</p>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {formatCurrency(finalNominal)}
                    </h3>
                    <p className="text-sm text-emerald-400 mt-2">Tổng tài sản không tính lạm phát</p>
                  </div>
                  
                  <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-lg relative overflow-hidden group flex flex-col justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-gray-400 mb-1">Sức mua thực tế (Sau {years} năm)</p>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {formatCurrency(finalReal)}
                    </h3>
                    <p className="text-sm text-orange-400 mt-2">Đã điều chỉnh theo lạm phát {inflationRate}%</p>
                  </div>
                </div>

                {targetAmount > 0 && (
                  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex items-center shadow-inner">
                    <Target className={`w-6 h-6 mr-3 ${targetYear ? 'text-green-400' : 'text-red-400'}`} />
                    <div>
                      <p className="text-sm text-gray-400">Tiến độ mục tiêu ({formatCurrency(targetAmount)})</p>
                      <p className={`font-semibold ${targetYear ? 'text-green-400' : 'text-red-400'}`}>
                        {targetYear 
                          ? `Tuyệt vời! Sẽ đạt mục tiêu vào năm thứ ${targetYear}` 
                          : `Chưa đạt mục tiêu trong thời gian này. Hãy thử tăng số tiền gửi hoặc thời gian.`}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Donut Chart */}
              <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 shadow-lg flex flex-col items-center justify-center">
                <h4 className="text-sm text-gray-400 mb-2 font-medium">Tỷ trọng Gốc & Lãi (Năm {years})</h4>
                <div className="h-40 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem', color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 text-xs mt-2">
                  <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-teal-500 mr-1"></span>Gốc</div>
                  <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-sky-500 mr-1"></span>Lãi</div>
                </div>
              </div>
            </div>

            {/* Composed Chart */}
            <div className="bg-gray-900 p-4 sm:p-6 rounded-2xl border border-gray-800 shadow-xl h-[400px]">
              <h3 className="text-lg font-semibold mb-6 text-center text-gray-300">Biểu đồ tăng trưởng tài sản chi tiết</h3>
              <ResponsiveContainer width="100%" height="90%">
                <ComposedChart data={data} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis 
                    dataKey="year" 
                    stroke="#9ca3af" 
                    tick={{fill: '#9ca3af', fontSize: 12}}
                    tickMargin={10}
                    minTickGap={30}
                  />
                  <YAxis 
                    tickFormatter={formatCompactCurrency} 
                    stroke="#9ca3af"
                    tick={{fill: '#9ca3af', fontSize: 12}}
                    width={60}
                    tickMargin={10}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl text-sm min-w-[200px]">
                            <p className="text-gray-300 font-semibold mb-2">{label}</p>
                            <p className="text-teal-400 mb-1">Tổng tiền gốc: {formatCurrency(data.gocNopVao)}</p>
                            <p className="text-sky-400 mb-1">Lãi sinh ra: {formatCurrency(data.laiSinhRa)}</p>
                            <div className="my-2 border-t border-gray-700"></div>
                            <p className="text-white font-semibold mb-1">Tổng (Gốc + Lãi): {formatCurrency(data.nominal)}</p>
                            <p className="text-orange-400">Sức mua thực tế: {formatCurrency(data.real)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  
                  {targetAmount > 0 && (
                    <ReferenceLine y={targetAmount} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} label={{ position: 'top', value: 'Mục tiêu', fill: '#ef4444', fontSize: 12 }} />
                  )}

                  <Bar dataKey="gocNopVao" name="Tổng tiền gốc" stackId="a" fill="#14b8a6" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="laiSinhRa" name="Lãi sinh ra" stackId="a" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="real" name="Sức mua thực tế" stroke="#f59e0b" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Data Table */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
              <div className="p-4 border-b border-gray-800 bg-gray-900/50">
                <h3 className="text-lg font-semibold text-gray-300">Bảng dòng tiền chi tiết</h3>
              </div>
              <div className="overflow-x-auto h-[300px]">
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="text-xs uppercase bg-gray-800 text-gray-400 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="px-6 py-4 font-medium">Năm</th>
                      <th className="px-6 py-4 font-medium text-right">Tiền gốc nộp vào</th>
                      <th className="px-6 py-4 font-medium text-right text-sky-400">Lãi sinh ra trong năm</th>
                      <th className="px-6 py-4 font-medium text-right text-teal-400">Tổng Gốc & Lãi</th>
                      <th className="px-6 py-4 font-medium text-right text-orange-400">Sức mua thực tế</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row) => (
                      <tr key={row.yearNum} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-3 font-medium text-gray-200">{row.yearNum}</td>
                        <td className="px-6 py-3 text-right">{formatCurrency(row.gocNopVao)}</td>
                        <td className="px-6 py-3 text-right text-sky-400/90">{formatCurrency(row.laiTrongNam)}</td>
                        <td className="px-6 py-3 text-right text-teal-400/90 font-semibold">{formatCurrency(row.nominal)}</td>
                        <td className="px-6 py-3 text-right text-orange-400/90">{formatCurrency(row.real)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
