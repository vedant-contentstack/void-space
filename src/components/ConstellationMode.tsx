"use client";

import { useState, useEffect, useRef } from "react";
import { BlogPost } from "@/types";
import { X, Sparkles, Calendar, Eye } from "lucide-react";

interface ConstellationNode {
  id: string;
  title: string;
  x: number;
  y: number;
  size: number;
  category: string;
  color: string;
  post: BlogPost;
  connections: string[];
}

interface ConstellationConnection {
  from: string;
  to: string;
  strength: number;
}

interface ConstellationModeProps {
  posts: BlogPost[];
  onClose: () => void;
  onPostSelect: (post: BlogPost) => void;
}

// Category colors - moved outside component to avoid dependency issues
const categoryColors = {
  mindfulness: "#60A5FA", // blue
  philosophy: "#A78BFA", // purple
  technology: "#34D399", // green
  personal: "#F59E0B", // amber
  reflection: "#EC4899", // pink
  default: "#9CA3AF", // gray
};

export default function ConstellationMode({
  posts,
  onClose,
  onPostSelect,
}: ConstellationModeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<ConstellationNode[]>([]);
  const [connections, setConnections] = useState<ConstellationConnection[]>([]);
  const [selectedNode, setSelectedNode] = useState<ConstellationNode | null>(
    null
  );
  const [hoveredNode, setHoveredNode] = useState<ConstellationNode | null>(
    null
  );
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (posts.length === 0) return;

    // Create nodes from posts
    const newNodes: ConstellationNode[] = posts.map((post, index) => {
      const angle = (index / posts.length) * 2 * Math.PI;
      const radius = Math.min(dimensions.width, dimensions.height) * 0.3;
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;

      // Add some randomness to make it more organic
      const randomOffset = (Math.random() - 0.5) * 100;
      const x = centerX + Math.cos(angle) * (radius + randomOffset);
      const y = centerY + Math.sin(angle) * (radius + randomOffset);

      return {
        id: post.id,
        title: post.title,
        x,
        y,
        size: Math.max(
          8,
          Math.min(20, post.resonates + post.comments.length + 5)
        ),
        category: post.category || "default",
        color:
          categoryColors[post.category as keyof typeof categoryColors] ||
          categoryColors.default,
        post,
        connections: [],
      };
    });

    // Create connections based on shared tags
    const newConnections: ConstellationConnection[] = [];
    for (let i = 0; i < newNodes.length; i++) {
      for (let j = i + 1; j < newNodes.length; j++) {
        const nodeA = newNodes[i];
        const nodeB = newNodes[j];
        const sharedTags = nodeA.post.tags.filter((tag) =>
          nodeB.post.tags.includes(tag)
        );

        if (sharedTags.length > 0) {
          const strength =
            sharedTags.length /
            Math.max(nodeA.post.tags.length, nodeB.post.tags.length);
          newConnections.push({
            from: nodeA.id,
            to: nodeB.id,
            strength,
          });
          nodeA.connections.push(nodeB.id);
          nodeB.connections.push(nodeA.id);
        }
      }
    }

    setNodes(newNodes);
    setConnections(newConnections);
  }, [posts, dimensions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Clear canvas
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    // Draw connections with glow effect
    connections.forEach((connection) => {
      const fromNode = nodes.find((n) => n.id === connection.from);
      const toNode = nodes.find((n) => n.id === connection.to);

      if (fromNode && toNode) {
        const isHighlighted =
          selectedNode &&
          (selectedNode.connections.includes(connection.from) ||
            selectedNode.connections.includes(connection.to) ||
            selectedNode.id === connection.from ||
            selectedNode.id === connection.to);

        if (isHighlighted) {
          // Draw bright glow effect for connected lines
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.strokeStyle = `rgba(96, 165, 250, ${connection.strength * 0.5})`;
          ctx.lineWidth = connection.strength * 6 + 3;
          ctx.shadowColor = "#60A5FA";
          ctx.shadowBlur = 12;
          ctx.stroke();

          // Draw main bright line
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.strokeStyle = `rgba(96, 165, 250, ${connection.strength * 0.9})`;
          ctx.lineWidth = connection.strength * 3;
          ctx.shadowBlur = 0;
          ctx.stroke();
        } else {
          // Draw very dim lines for non-connected
          const dimOpacity = selectedNode ? 0.1 : 0.4; // Much dimmer when something is selected
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.strokeStyle = `rgba(156, 163, 175, ${
            connection.strength * dimOpacity
          })`;
          ctx.lineWidth = selectedNode
            ? connection.strength * 0.5
            : connection.strength * 2;
          ctx.shadowColor = "#9CA3AF";
          ctx.shadowBlur = selectedNode ? 0 : 2;
          ctx.stroke();
        }
      }
    });

    // Draw nodes
    nodes.forEach((node) => {
      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode?.id === node.id;
      const isConnected = selectedNode?.connections.includes(node.id);
      const isDimmed = selectedNode && !isSelected && !isConnected;

      // Node glow effect - only for active nodes
      if ((isSelected || isHovered || isConnected) && !isDimmed) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size + 8, 0, 2 * Math.PI);
        ctx.fillStyle = `${node.color}20`;
        ctx.fill();
      }

      // Main node
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
      if (isDimmed) {
        ctx.fillStyle = `${node.color}20`; // Very dim for non-connected nodes
      } else if (isSelected) {
        ctx.fillStyle = node.color; // Full brightness for selected
      } else if (isConnected) {
        ctx.fillStyle = `${node.color}90`; // Bright for connected
      } else {
        ctx.fillStyle = `${node.color}80`; // Normal brightness
      }
      ctx.fill();

      // Node border
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
      if (isDimmed) {
        ctx.strokeStyle = `${node.color}30`; // Dim border
        ctx.lineWidth = 0.5;
      } else {
        ctx.strokeStyle = node.color;
        ctx.lineWidth = isSelected || isHovered ? 3 : 1;
      }
      ctx.stroke();

      // Pulse animation for selected node
      if (isSelected) {
        const pulseSize = node.size + Math.sin(Date.now() * 0.005) * 3;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize, 0, 2 * Math.PI);
        ctx.strokeStyle = `${node.color}40`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }, [nodes, connections, selectedNode, hoveredNode, dimensions]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find clicked node
    const clickedNode = nodes.find((node) => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= node.size;
    });

    if (clickedNode) {
      setSelectedNode(clickedNode);
    } else {
      setSelectedNode(null);
    }
  };

  const handleCanvasMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find hovered node
    const hoveredNode = nodes.find((node) => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= node.size;
    });

    setHoveredNode(hoveredNode || null);
    canvas.style.cursor = hoveredNode ? "pointer" : "default";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-void-black z-50 overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-void-black to-transparent p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="text-void-accent" size={24} />
            <h1 className="text-2xl font-semibold text-void-text">
              Constellation Mode
            </h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-void-muted hover:text-void-text transition-colors rounded-lg hover:bg-void-dark/50"
          >
            <X size={24} />
          </button>
        </div>
        <p className="text-void-muted text-sm mt-2 max-w-2xl">
          Explore the connections between your thoughts. Each star represents a
          post, connected by shared themes and ideas. Click on a star to learn
          more.
        </p>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        className="absolute inset-0"
      />

      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-void-dark/80 backdrop-blur-sm border border-void-border rounded-xl p-4">
        <h3 className="text-void-text font-medium mb-3 text-sm">Categories</h3>
        <div className="space-y-2">
          {Object.entries(categoryColors).map(([category, color]) => (
            <div key={category} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-void-muted text-xs capitalize">
                {category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Post Details */}
      {selectedNode && (
        <div className="absolute top-24 right-6 w-80 bg-void-dark/90 backdrop-blur-sm border border-void-border rounded-xl p-6 animate-fade-in">
          <div className="mb-4">
            <h3 className="text-void-text font-semibold mb-2 leading-tight">
              {selectedNode.title}
            </h3>
            <p className="text-void-muted text-sm line-clamp-3">
              {selectedNode.post.excerpt}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-void-muted mb-4">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{formatDate(selectedNode.post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={12} />
              <span>{selectedNode.post.views || 0} souls visited</span>
            </div>
          </div>

          {selectedNode.post.tags.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {selectedNode.post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-void-gray/20 text-void-muted text-xs rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => onPostSelect(selectedNode.post)}
              className="flex-1 px-4 py-2 bg-void-accent text-white rounded-lg font-medium hover:bg-void-accent-light transition-colors text-sm"
            >
              Read Post
            </button>
          </div>

          {selectedNode.connections.length > 0 && (
            <div className="mt-4 pt-4 border-t border-void-border">
              <p className="text-void-muted text-xs mb-2">
                Connected to {selectedNode.connections.length} other{" "}
                {selectedNode.connections.length === 1 ? "post" : "posts"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
