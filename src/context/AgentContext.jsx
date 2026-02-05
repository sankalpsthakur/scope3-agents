import React, { createContext, useContext, useReducer, useMemo } from "react";

const AgentContext = createContext(null);

const initialState = {
  agents: [],
  activityLog: [],
  insights: {},
  handoffs: {},
  dismissedInsights: [],
};

function agentReducer(state, action) {
  switch (action.type) {
    case "SET_AGENTS":
      return { ...state, agents: action.payload };
    case "SET_ACTIVITY_LOG":
      return { ...state, activityLog: action.payload };
    case "SET_INSIGHTS":
      return { ...state, insights: action.payload };
    case "SET_HANDOFFS":
      return { ...state, handoffs: action.payload };
    case "UPDATE_AGENT_STATUS": {
      const updated = state.agents.map((a) =>
        a.id === action.payload.id ? { ...a, ...action.payload } : a
      );
      return { ...state, agents: updated };
    }
    case "DISMISS_INSIGHT":
      return {
        ...state,
        dismissedInsights: [...state.dismissedInsights, action.payload],
      };
    case "ADD_ACTIVITY": {
      const entry = { ...action.payload, timestamp: new Date().toISOString() };
      return { ...state, activityLog: [entry, ...state.activityLog] };
    }
    default:
      return state;
  }
}

export function AgentProvider({ children }) {
  const [state, dispatch] = useReducer(agentReducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return (
    <AgentContext.Provider value={value}>{children}</AgentContext.Provider>
  );
}

export function useAgentContext() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error("useAgentContext must be used within AgentProvider");
  return ctx;
}

export function useActiveAgents() {
  const { state } = useAgentContext();
  return state.agents.filter((a) => a.status === "running");
}

export function usePageInsights(pageKey) {
  const { state } = useAgentContext();
  const all = state.insights[pageKey] || [];
  return all.filter((i) => !state.dismissedInsights.includes(i.id));
}

export function usePageHandoff(pageKey) {
  const { state } = useAgentContext();
  return state.handoffs[pageKey] || null;
}

export function useActivityLog() {
  const { state } = useAgentContext();
  return state.activityLog;
}
