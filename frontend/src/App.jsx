import React, { useState, useEffect } from 'react';

const API_BASE = "http://127.0.0.1:8000/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/dashboard`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Backend offline", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSeed = async () => {
    await fetch(`${API_BASE}/seed`, { method: 'POST' });
    fetchData();
  };

  const handleReset = async () => {
    await fetch(`${API_BASE}/reset`, { method: 'POST' });
    fetchData();
    setUploadStatus([]);
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    setUploadStatus(result.uploaded || []);
    fetchData();
  };

  const NavItem = ({ id, icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg mb-1 transition-colors ${
        activeTab === id ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <span>{icon}</span> {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="bg-blue-600 text-white p-1 rounded">🛡️</span> EVIDENCE AI
          </h1>
          <p className="text-xs text-gray-500 mt-1">Analyze • Investigate • Uncover</p>
        </div>
        <nav className="flex-1 px-4">
          <NavItem id="dashboard" icon="📊" label="Dashboard" />
          <NavItem id="upload" icon="☁️" label="Upload Evidence" />
          <NavItem id="timeline" icon="⏱️" label="Incident Timeline" />
          <NavItem id="graph" icon="🕸️" label="Relationship Graph" />
          <NavItem id="vault" icon="🔒" label="Audit Vault & Reports" />
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button onClick={handleSeed} className="w-full mb-2 bg-emerald-100 text-emerald-700 py-2 rounded-md text-sm font-bold hover:bg-emerald-200 transition">
            ⚡ Run Demo Case
          </button>
          <button onClick={handleReset} className="w-full bg-red-100 text-red-700 py-2 rounded-md text-sm font-bold hover:bg-red-200 transition">
            🗑️ Reset Engine
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome back, Team!</h2>
            <p className="text-gray-500">Your AI-powered digital forensics assistant is live.</p>
          </div>
        </header>

        {loading || !data ? (
          <div className="flex justify-center items-center h-64 text-gray-500">Connecting to Python FastAPI Engine...</div>
        ) : (
          <div className="space-y-6">
            
            {/* Dashboard View */}
            {activeTab === "dashboard" && (
              <>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-500">Total Evidence Files</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{data.summary.total_files}</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-500">Reconstructed Events</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{data.summary.total_events}</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-500">Critical Threats</p>
                    <p className="text-3xl font-bold text-red-500 mt-2">{data.summary.critical_threats}</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-500">Alibi Contradictions</p>
                    <p className="text-3xl font-bold text-amber-500 mt-2">{data.summary.contradictions_found}</p>
                  </div>
                </div>
                
                {data.contradictions.length > 0 && (
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md mt-6">
                    <h3 className="font-bold text-amber-800">⚠️ Critical Intelligence Alert</h3>
                    <p className="text-sm text-amber-700 mt-1">{data.contradictions[0].summary}</p>
                  </div>
                )}
              </>
            )}

            {/* Upload View */}
            {activeTab === "upload" && (
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Secure Evidence Ingestion</h3>
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">TXT, EML, PDF or CSV (Encrypted at rest)</p>
                  </div>
                  <input type="file" multiple className="hidden" onChange={handleUpload} />
                </label>
                
                {uploadStatus.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-bold text-sm mb-2 text-gray-700">Ingestion Log:</h4>
                    {uploadStatus.map((u, i) => (
                      <div key={i} className="text-sm py-2 border-b border-gray-100 flex justify-between">
                        <span className="font-medium">{u.filename}</span>
                        <span className="text-gray-400 font-mono text-xs">{u.sha256.substring(0,20)}...</span>
                        <span className={u.status.includes("Duplicate") ? "text-amber-500 font-bold" : "text-emerald-500 font-bold"}>
                          {u.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Timeline View */}
            {activeTab === "timeline" && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Automated Incident Reconstruction</h3>
                <div className="space-y-4">
                  {data.timeline.length === 0 ? <p className="text-gray-500">No events reconstructed yet.</p> : data.timeline.map((ev, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-lg bg-gray-50 border-l-4 border-blue-500">
                      <div className="w-1/4">
                        <p className="font-mono text-xs font-bold text-blue-700">{ev.timestamp}</p>
                        <p className="text-xs text-gray-500 mt-1">{ev.source_file}</p>
                      </div>
                      <div className="w-3/4">
                        <p className="text-gray-800">{ev.content}</p>
                        <div className="mt-2 flex gap-2">
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">Actors: {ev.actors.join(', ')}</span>
                          <span className={`text-xs px-2 py-1 rounded ${ev.severity === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-gray-200'}`}>
                            {ev.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Relationship / Entity Graph */}
            {activeTab === "graph" && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Extracted Actors & Entities (spaCy NLP)</h3>
                {Object.entries(data.entities).map(([label, items]) => (
                  <div key={label} className="mb-4">
                    <h4 className="text-sm font-bold text-gray-500 mb-2">{label}</h4>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item, idx) => (
                        <span key={idx} className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Vault View */}
            {activeTab === "vault" && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
                <h3 className="text-lg font-bold mb-4 text-emerald-700">Cryptographic Chain-of-Custody (SHA-256)</h3>
                <table className="w-full text-left text-sm font-mono">
                  <thead className="bg-gray-100 text-gray-600">
                    <tr>
                      <th className="p-3 rounded-tl-lg">Time</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">File</th>
                      <th className="p-3">File Hash (SHA-256)</th>
                      <th className="p-3 rounded-tr-lg">Block Signature</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.audit_logs.map((log, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="p-3">{log.timestamp.substring(11,19)}</td>
                        <td className="p-3 text-blue-600">{log.action}</td>
                        <td className="p-3">{log.filename}</td>
                        <td className="p-3 text-gray-400 text-xs">{log.evidence_sha256.substring(0,16)}...</td>
                        <td className="p-3 text-emerald-600 text-xs">{log.chain_signature.substring(0,16)}...</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}