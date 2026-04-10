import React, { useState, useEffect } from 'react';
import { Droplets, CloudRain, Thermometer, Power, LayoutDashboard } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function App() {
  // 1. State lưu dữ liệu hiện tại
  const [sensors, setSensors] = useState({ soil: 0, rain: 0, humid: 0 });
  const [history, setHistory] = useState([]); // Lưu lịch sử cho biểu đồ
  const [isPumpOn, setIsPumpOn] = useState(false);

  // 2. Hàm lấy dữ liệu từ Backend
  const fetchSensorData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sensors');
      const data = await response.json();
      
      // Cập nhật giá trị hiển thị card
      setSensors(data);

      // Cập nhật dữ liệu cho biểu đồ (giới hạn 10 điểm dữ liệu gần nhất)
      const newEntry = {
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        soil: data.soil,
        humid: data.humid
      };
      
      setHistory(prev => [...prev.slice(-9), newEntry]);
    } catch (error) {
      console.error("❌ API Connection Error:", error);
    }
  };

  // 3. Hàm gửi lệnh điều khiển máy bơm
  const togglePump = async () => {
    const nextStatus = !isPumpOn;
    try {
      await fetch('http://localhost:5000/api/pump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      setIsPumpOn(nextStatus);
    } catch (error) {
      alert("Cannot control the pump. Check Backend connection!");
    }
  };

  // 4. Tự động gọi API mỗi 2 giây
  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <nav className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-xl shadow-lg">
            <LayoutDashboard className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-800">SMART GARDEN <span className="text-emerald-600 text-sm">LIVE</span></h1>
        </div>
      </nav>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <StatCard title="Soil Moisture" value={sensors.soil} unit="%" icon={<Droplets className="text-blue-600" />} color="blue" />
        <StatCard title="Rain Intensity" value={sensors.rain} unit="mm" icon={<CloudRain className="text-indigo-600" />} color="indigo" />
        <StatCard title="Air Humidity" value={sensors.humid} unit="%" icon={<Thermometer className="text-emerald-600" />} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold mb-6 italic text-slate-400">Environmental History</h2>
          <div className="h-[350px] w-full"> {}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="soil" stroke="#3b82f6" fillOpacity={0.1} fill="#3b82f6" strokeWidth={3} />
                <Area type="monotone" dataKey="humid" stroke="#10b981" fill="none" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pump Control Section */}
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Pump Control</h2>
            <p className="text-slate-400 text-sm">Manual override for irrigation.</p>
            <div className="flex justify-center my-10">
              <button 
                onClick={togglePump}
                className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isPumpOn ? 'bg-emerald-500 scale-110' : 'bg-slate-800'}`}
              >
                <Power size={44} className={isPumpOn ? 'text-white' : 'text-slate-600'} />
              </button>
            </div>
          </div>
          <div className="bg-slate-800 p-4 rounded-2xl flex justify-between items-center">
             <span className="text-xs font-bold text-slate-400 tracking-tighter uppercase">Pump Status</span>
             <span className={`text-sm font-black ${isPumpOn ? 'text-emerald-400' : 'text-slate-500'}`}>{isPumpOn ? 'RUNNING' : 'OFF'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component cho các thẻ hiển thị số
function StatCard({ title, value, unit, icon, color }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600"
  };

  return (
    <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${colorMap[color]}`}>
        {icon}
      </div>
      <p className="text-slate-400 text-sm font-medium">{title}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-black text-slate-800">{value}</span>
        <span className="text-slate-300 font-bold">{unit}</span>
      </div>
    </div>
  );
}

export default App;