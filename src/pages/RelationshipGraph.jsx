import {
  addEdge,
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import {
  CalendarClock,
  FileImage,
  FileText,
  Info,
  Mail,
  Maximize2,
  MessageSquare,
  Phone,
  Search,
  User,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { useEvidence } from '../hooks/useEvidence';

const NODE_TYPE_STYLES = {
  Person: { icon: User, bg: '#F0EBFF', border: '#7656E8', text: '#7656E8' },
  Email: { icon: Mail, bg: '#EAF2FF', border: '#367FEA', text: '#367FEA' },
  'Phone Number': { icon: Phone, bg: '#ECFDF5', border: '#22B981', text: '#22B981' },
  Message: { icon: MessageSquare, bg: '#EAF2FF', border: '#367FEA', text: '#367FEA' },
  Image: { icon: FileImage, bg: '#F0EBFF', border: '#7656E8', text: '#7656E8' },
  Document: { icon: FileText, bg: '#FEF3C7', border: '#F59E0B', text: '#D97706' },
  Event: { icon: CalendarClock, bg: '#FEE2E2', border: '#EF4444', text: '#DC2626' },
};

function ForensicCircleNode({ data, selected }) {
  const style = NODE_TYPE_STYLES[data.nodeType] || NODE_TYPE_STYLES.Document;
  const Icon = style.icon;

  return (
    <div className="flex flex-col items-center group">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-[#7656E8] !border-2 !border-white"
      />
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center border-2 bg-white shadow-sm transition-transform ${
          selected ? 'scale-110 ring-4 ring-[#F0EBFF]' : 'group-hover:scale-105'
        } ${data.highlighted ? 'ring-4 ring-[#EAF2FF]' : ''}`}
        style={{
          borderColor: style.border,
          backgroundColor: selected ? style.bg : '#FFFFFF',
          color: style.text,
        }}
      >
        <Icon className="w-6 h-6" aria-hidden="true" />
      </div>
      <div className="mt-1.5 px-2.5 py-1 rounded-lg bg-white/95 border border-[#E5E7F0] shadow-xs text-center max-w-[160px]">
        <div className="text-[11px] font-semibold text-[#172554] truncate">{data.label}</div>
        <div className="text-[10px] font-medium" style={{ color: style.text }}>
          {data.nodeType}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !bg-[#367FEA] !border-2 !border-white"
      />
    </div>
  );
}

const nodeTypes = { forensicNode: ForensicCircleNode };

function GraphWorkspace() {
  const { graphData, setGraphData } = useEvidence();
  const location = useLocation();
  const { fitView, setCenter } = useReactFlow();

  const initialEdges = useMemo(
    () =>
      graphData.edges.map((edge) => ({
        ...edge,
        type: 'smoothstep',
        animated: false,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#94A3B8' },
        style: { stroke: '#94A3B8', strokeWidth: 1.75 },
        labelStyle: { fill: '#64748B', fontSize: 10, fontWeight: 500 },
        labelBgStyle: { fill: '#FFFFFF', fillOpacity: 0.9 },
      })),
    [graphData.edges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(graphData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState(
    location.state?.focusNodeId || graphData.nodes[0]?.id || null
  );
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (location.state?.focusNodeId) {
      setSelectedNodeId(location.state.focusNodeId);
    }
  }, [location.state]);

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        id: `e-user-${Date.now()}`,
        label: 'investigator link',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#7656E8' },
        style: { stroke: '#7656E8', strokeWidth: 2 },
        labelStyle: { fill: '#7656E8', fontSize: 10, fontWeight: 600 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      setGraphData((prev) => ({
        ...prev,
        edges: [...prev.edges, { id: newEdge.id, source: params.source, target: params.target, label: 'investigator link' }],
      }));
      toast.success('Added exploratory relationship edge.');
    },
    [setEdges, setGraphData]
  );

  const handleSearchFocus = (e) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;
    const match = nodes.find(
      (n) =>
        n.data.label.toLowerCase().includes(q) ||
        n.data.nodeType.toLowerCase().includes(q)
    );
    if (!match) {
      toast.error(`No entity or evidence node found for "${searchQuery}".`);
      return;
    }
    setSelectedNodeId(match.id);
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        selected: n.id === match.id,
        data: { ...n.data, highlighted: n.id === match.id },
      }))
    );
    setCenter(match.position.x + 60, match.position.y + 40, { zoom: 1.15, duration: 400 });
  };

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

  const connectedEntities = useMemo(() => {
    if (!selectedNode) return [];
    const results = [];
    edges.forEach((edge) => {
      if (edge.source === selectedNode.id) {
        const target = nodes.find((n) => n.id === edge.target);
        if (target) results.push({ node: target, relation: edge.label || 'linked to', direction: 'Outgoing' });
      } else if (edge.target === selectedNode.id) {
        const source = nodes.find((n) => n.id === edge.source);
        if (source) results.push({ node: source, relation: edge.label || 'linked from', direction: 'Incoming' });
      }
    });
    return results;
  }, [selectedNode, edges, nodes]);

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#172554]">
            Relationship Intelligence
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Discover connections between people, events and evidence.
          </p>
        </div>

        <form onSubmit={handleSearchFocus} className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-72">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Locate person or evidence node..."
              className="w-full h-10 pl-10 pr-3 rounded-xl bg-white border border-[#E5E7F0] text-sm text-[#172554] focus:outline-none focus:border-[#7656E8]"
            />
          </div>
          <button
            type="submit"
            className="h-10 px-4 rounded-xl bg-[#7656E8] hover:bg-[#6445d8] text-white text-xs font-semibold whitespace-nowrap"
          >
            Locate
          </button>
          <button
            type="button"
            onClick={() => fitView({ padding: 0.2, duration: 350 })}
            className="h-10 px-3.5 rounded-xl bg-white border border-[#E5E7F0] hover:bg-[#F5F6FC] text-xs font-semibold text-[#172554] inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#367FEA]" />
            <span>Fit Screen</span>
          </button>
        </form>
      </div>

      {/* Node Type Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 rounded-2xl bg-white border border-[#E5E7F0] text-xs">
        <span className="font-semibold text-[#172554]">Node Types:</span>
        {Object.entries(NODE_TYPE_STYLES).map(([type, st]) => {
          const Icon = st.icon;
          return (
            <div key={type} className="inline-flex items-center gap-1.5 text-[#64748B]">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center border"
                style={{ backgroundColor: st.bg, borderColor: st.border, color: st.text }}
              >
                <Icon className="w-3 h-3" />
              </span>
              <span>{type}</span>
            </div>
          );
        })}
      </div>

      {/* Interactive Graph + Right Details Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <div className="xl:col-span-8 forensic-card overflow-hidden h-[520px] sm:h-[580px] relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.22 }}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#E5E7F0" gap={20} />
            <Controls className="!bg-white !border !border-[#E5E7F0] !rounded-xl !shadow-sm" />
            <MiniMap
              nodeColor={(n) => NODE_TYPE_STYLES[n.data?.nodeType]?.border || '#7656E8'}
              maskColor="rgba(245, 246, 252, 0.7)"
              className="!bg-white !border !border-[#E5E7F0] !rounded-xl"
            />
          </ReactFlow>
        </div>

        {/* Right Details Panel */}
        <aside className="xl:col-span-4 forensic-card p-5 sm:p-6 flex flex-col justify-between space-y-5">
          {!selectedNode ? (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-[#172554]">Click any node to inspect</p>
              <p className="mt-1 text-xs text-[#64748B]">
                Drag nodes to rearrange or connect handles to map exploratory hypotheses.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="pb-4 border-b border-[#E5E7F0]">
                <span
                  className="inline-block text-xs font-semibold px-2.5 py-1 rounded-lg"
                  style={{
                    backgroundColor: NODE_TYPE_STYLES[selectedNode.data.nodeType]?.bg || '#F0EBFF',
                    color: NODE_TYPE_STYLES[selectedNode.data.nodeType]?.text || '#7656E8',
                  }}
                >
                  {selectedNode.data.nodeType}
                </span>
                <h2 className="mt-2.5 text-lg font-bold text-[#172554] break-words">
                  {selectedNode.data.label}
                </h2>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Relationship Description
                </h3>
                <p className="mt-1.5 text-sm text-[#172554] leading-relaxed">
                  {selectedNode.data.description}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Related Evidence
                </h3>
                <ul className="mt-2 space-y-1.5">
                  {(selectedNode.data.relatedEvidence || []).map((file) => (
                    <li
                      key={file}
                      className="px-3 py-2 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] text-xs font-mono text-[#172554] break-all"
                    >
                      {file}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Connected Entities ({connectedEntities.length})
                </h3>
                {connectedEntities.length === 0 ? (
                  <p className="mt-1.5 text-xs text-[#64748B]">No connected nodes.</p>
                ) : (
                  <ul className="mt-2 space-y-2 max-h-52 overflow-y-auto">
                    {connectedEntities.map((conn, idx) => (
                      <li key={`${conn.node.id}-${idx}`}>
                        <button
                          type="button"
                          onClick={() => setSelectedNodeId(conn.node.id)}
                          className="w-full p-2.5 rounded-xl bg-[#F5F6FC] hover:bg-[#F0EBFF]/60 border border-[#E5E7F0] text-left transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-[#172554] truncate">
                              {conn.node.data.label}
                            </span>
                            <span className="text-[11px] text-[#7656E8] font-medium shrink-0">
                              {conn.relation}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#64748B] mt-0.5">
                            {conn.node.data.nodeType} · {conn.direction}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-[#EAF2FF] border border-[#367FEA]/20 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#367FEA] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#172554] leading-relaxed">
              Demonstration Graph: Connections visualize shared references across sample exhibits and do not establish wrongdoing or intent.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function RelationshipGraph() {
  return (
    <ReactFlowProvider>
      <GraphWorkspace />
    </ReactFlowProvider>
  );
}
