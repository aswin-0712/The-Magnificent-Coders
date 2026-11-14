import {
  BrainCircuit,
  Clock,
  FileCheck2,
  FolderKanban,
  Gauge,
  Network,
  Plus,
  Sparkles,
  Timer,
  UploadCloud,
  X,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ForensicFingerprintGraphic } from '../components/BrandLogo';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { DASHBOARD_SERIES, EVIDENCE_TYPE_DISTRIBUTION } from '../data/mockData';
import { useEvidence } from '../hooks/useEvidence';

export default function Dashboard() {
  const { user } = useAuth();
  const { investigations, evidence, recentActivity, createInvestigation } = useEvidence();
  const navigate = useNavigate();

  const [range, setRange] = useState('7d');
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Keep baseline demonstration figures (12 cases, 248 files) reactive to user additions
  const totalCasesDisplay = 9 + investigations.length;
  const totalFilesDisplay = 242 + evidence.length;

  const chartData = DASHBOARD_SERIES[range] || DASHBOARD_SERIES['7d'];

  const handleCreateCase = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Please enter an investigation title.');
      return;
    }
    const created = createInvestigation({
      title: newTitle,
      description: newDesc,
      leadInvestigator: user.name,
    });
    toast.success(`Created ${created.id}: ${created.title}`);
    setModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#172554]">
            Welcome back, {user.name}!
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Your AI-powered digital forensics assistant is ready.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7656E8] to-[#367FEA] text-white text-sm font-semibold shadow-sm hover:opacity-95 transition-opacity whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Start New Investigation</span>
        </button>
      </div>

      {/* 4 Statistics Cards */}
      <section aria-label="Investigation metrics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Cases"
          value={totalCasesDisplay}
          trend="+2 this week"
          trendDirection="up"
          icon={FolderKanban}
          accentColor="#7656E8"
          softBg="#F0EBFF"
          sparkData={[{ v: 6 }, { v: 8 }, { v: 9 }, { v: 10 }, { v: 11 }, { v: totalCasesDisplay }]}
          demoCaption="Demonstration dataset"
        />
        <StatCard
          label="Evidence Files"
          value={totalFilesDisplay}
          trend="+18.4%"
          trendDirection="up"
          icon={FileCheck2}
          accentColor="#367FEA"
          softBg="#EAF2FF"
          sparkData={[{ v: 180 }, { v: 196 }, { v: 215 }, { v: 229 }, { v: 240 }, { v: totalFilesDisplay }]}
          demoCaption="Demonstration dataset"
        />
        <StatCard
          label="Analysis Accuracy"
          value="98.5%"
          trend="+1.2%"
          trendDirection="up"
          icon={Gauge}
          accentColor="#22B981"
          softBg="#ECFDF5"
          sparkData={[{ v: 94 }, { v: 95.5 }, { v: 96.8 }, { v: 97.4 }, { v: 98.1 }, { v: 98.5 }]}
          demoCaption="Benchmark sample"
        />
        <StatCard
          label="Average Processing Time"
          value="2.3 sec"
          trend="-0.4 sec"
          trendDirection="down"
          icon={Timer}
          accentColor="#F59E0B"
          softBg="#FEF3C7"
          sparkData={[{ v: 3.4 }, { v: 3.1 }, { v: 2.8 }, { v: 2.6 }, { v: 2.4 }, { v: 2.3 }]}
          demoCaption="Simulated pipeline avg"
        />
      </section>

      {/* Main Analytics Row: Case Overview Line Chart + Evidence Types Donut */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 forensic-card p-5 sm:p-6 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-base font-semibold text-[#172554]">Case Overview</h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Evidence processed vs. insights generated (demonstration metrics)
              </p>
            </div>

            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] self-start">
              <button
                type="button"
                onClick={() => setRange('7d')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  range === '7d'
                    ? 'bg-white text-[#172554] shadow-xs'
                    : 'text-[#64748B] hover:text-[#172554]'
                }`}
              >
                Last 7 days
              </button>
              <button
                type="button"
                onClick={() => setRange('30d')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  range === '30d'
                    ? 'bg-white text-[#172554] shadow-xs'
                    : 'text-[#64748B] hover:text-[#172554]'
                }`}
              >
                Last 30 days
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7F0" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  axisLine={{ stroke: '#E5E7F0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E5E7F0',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#172554',
                    boxShadow: '0 8px 24px rgba(23,37,84,0.08)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="evidenceProcessed"
                  name="Evidence Processed"
                  stroke="#7656E8"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#7656E8', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="insightsGenerated"
                  name="Insights Generated"
                  stroke="#367FEA"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#367FEA', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evidence Types Donut Chart */}
        <div className="lg:col-span-4 forensic-card p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#172554]">Evidence Types</h2>
            <p className="text-xs text-[#64748B] mt-0.5">Distribution across stored exhibits</p>
          </div>

          <div className="h-56 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={EVIDENCE_TYPE_DISTRIBUTION}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={54}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {EVIDENCE_TYPE_DISTRIBUTION.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Share']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E5E7F0',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-[#E5E7F0]">
            {EVIDENCE_TYPE_DISTRIBUTION.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#64748B]">
                  <span
                    className="w-2.5 h-2.5 rounded-xs shrink-0"
                    style={{ backgroundColor: item.color }}
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-semibold text-[#172554] tabular-nums">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity & Quick Actions */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activity Timeline */}
        <div className="lg:col-span-6 forensic-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-[#172554]">Recent Activity</h2>
              <p className="text-xs text-[#64748B] mt-0.5">Latest forensic actions in this workspace</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/timeline')}
              className="text-xs font-semibold text-[#7656E8] hover:text-[#5b3cd6]"
            >
              Full Timeline
            </button>
          </div>

          <ul className="divide-y divide-[#E5E7F0]">
            {recentActivity.slice(0, 5).map((act) => (
              <li key={act.id} className="py-3.5 first:pt-1 last:pb-1 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-[#172554]">{act.title}</div>
                  <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{act.detail}</p>
                </div>
                <span className="text-[11px] font-mono text-[#64748B] whitespace-nowrap tabular-nums shrink-0">
                  {act.timestamp}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-4">
          <div className="forensic-card p-5 sm:p-6">
            <h2 className="text-base font-semibold text-[#172554]">Quick Actions</h2>
            <p className="text-xs text-[#64748B] mt-0.5 mb-4">
              Jump directly to core investigation workflows
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => navigate('/upload')}
                className="forensic-card-interactive p-4 text-left flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F0EBFF] text-[#7656E8] flex items-center justify-center shrink-0">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#172554]">Upload Evidence</div>
                  <p className="text-xs text-[#64748B] mt-0.5">Stage artifacts &amp; compute SHA-256</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate('/analysis')}
                className="forensic-card-interactive p-4 text-left flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#367FEA] flex items-center justify-center shrink-0">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#172554]">Run AI Analysis</div>
                  <p className="text-xs text-[#64748B] mt-0.5">Entities, keywords &amp; summaries</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate('/timeline')}
                className="forensic-card-interactive p-4 text-left flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#22B981] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#172554]">View Timeline</div>
                  <p className="text-xs text-[#64748B] mt-0.5">Chronological incident sequence</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate('/graph')}
                className="forensic-card-interactive p-4 text-left flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
                  <Network className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#172554]">View Relationship Graph</div>
                  <p className="text-xs text-[#64748B] mt-0.5">Interactive entity link map</p>
                </div>
              </button>
            </div>
          </div>

          {/* Promotional Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-[#F0EBFF] via-[#F7F8FE] to-[#EAF2FF] border border-[#E5E7F0] p-5 sm:p-6 flex items-center justify-between gap-4">
            <div className="max-w-md">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7656E8]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Evidence Intelligence Suite</span>
              </div>
              <h3 className="mt-1.5 text-lg font-bold text-[#172554]">
                Smarter Investigation. Stronger Justice.
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
                Let AI help you uncover the truth with speed and accuracy.
              </p>
            </div>
            <ForensicFingerprintGraphic className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 hidden sm:block" />
          </div>
        </div>
      </section>

      {/* Start New Investigation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172554]/30 backdrop-blur-[1px]">
          <div className="w-full max-w-md bg-white border border-[#E5E7F0] rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#172554]">Start New Investigation</h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#F5F6FC]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4">
              <div>
                <label htmlFor="case-title" className="block text-xs font-semibold text-[#172554] mb-1.5">
                  Investigation Title
                </label>
                <input
                  id="case-title"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Cloud Storage Exfiltration Review"
                  className="w-full h-10 px-3.5 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] text-sm text-[#172554] focus:outline-none focus:bg-white focus:border-[#7656E8]"
                />
              </div>

              <div>
                <label htmlFor="case-desc" className="block text-xs font-semibold text-[#172554] mb-1.5">
                  Scope &amp; Summary
                </label>
                <textarea
                  id="case-desc"
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Briefly describe the incident scope and initial artifacts..."
                  className="w-full p-3.5 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] text-sm text-[#172554] focus:outline-none focus:bg-white focus:border-[#7656E8]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5E7F0] text-xs font-semibold text-[#64748B] hover:bg-[#F5F6FC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#7656E8] hover:bg-[#6445d8] text-white text-xs font-semibold"
                >
                  Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
