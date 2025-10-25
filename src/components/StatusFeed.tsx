import type { RunSnapshot } from "../types";

const StatusPill: React.FC<{ label: string; tone?: "ok" | "warn" | "bad" }> = ({ label, tone }) => {
  const cls = ["badge"];
  if (tone) cls.push(tone);
  return <span className={cls.join(" ")}>{label}</span>;
};

function statusTone(status?: string): "ok" | "warn" | "bad" | undefined {
  switch (status) {
    case "success": return "ok";
    case "failure": return "bad";
    case "applying":
    case "generating":
    case "scoring":
    case "pending": return "warn";
    default: return undefined;
  }
}

export function StatusFeed({ snapshot }: { snapshot: RunSnapshot | null }) {
  if (!snapshot) {
    return <div className="small">No run yet. Click "Start Auto-Apply" to begin.</div>;
  }

  const { run, applications } = snapshot;

  return (
    <div style={{ height: "fit-content" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div>
          <h3 style={{ margin: 0 }}>Run status</h3>
          <div className="small">Run ID: <code>{run.runId}</code></div>
        </div>
        <div>
          {run.status === "done" && <StatusPill label="Done" tone="ok" />}
          {run.status === "error" && <StatusPill label="Error" tone="bad" />}
          {run.status !== "done" && run.status !== "error" && <StatusPill label="In progress" tone="warn" />}
        </div>
      </div>

      <div className="kv" style={{ marginBottom: 12 }}>
        <div>Started</div><div><strong>{run.started_at ? new Date(run.started_at).toLocaleString() : "—"}</strong></div>
        <div>Finished</div><div><strong>{run.ended_at ? new Date(run.ended_at).toLocaleString() : "—"}</strong></div>
        <div>Summary</div>
        <div>
          <strong>
            {run.counts ? `${run.counts.success} succeeded, ${run.counts.failed} failed, ${run.counts.total} total` : "—"}
          </strong>
        </div>
      </div>

      <div className="status-list">
        {applications.length === 0 && <div className="small">No applications yet.</div>}
        {applications.map((a) => (
          <div key={a.jobId} className="status-item">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div style={{ fontWeight: 700 }}>
                {a.title} <span className="small">· {a.company}</span>
              </div>
              <StatusPill label={a.status} tone={statusTone(a.status)} />
            </div>
            <div className="small" style={{ marginTop: 8 }}>
              {typeof a.match_score === "number" ? (
                <>Match score: <strong>{a.match_score}</strong></>
              ) : (
                <>Match score: <em>—</em></>
              )}
              {a.updatedAt ? <> · updated {new Date(a.updatedAt).toLocaleTimeString()}</> : null}
              {a.error ? <> · <span style={{ color: "var(--bad)" }}>error: {a.error}</span></> : null}
            </div>
            
            {/* AI-generated evaluation summary */}
            {a.summary && (
              <div style={{
                marginTop: 12,
                padding: 12,
                backgroundColor: 'rgba(99, 102, 241, 0.05)',
                borderLeft: '3px solid rgba(99, 102, 241, 0.5)',
                borderRadius: 4,
                fontSize: '0.9rem',
                lineHeight: '1.5'
              }}>
                <div style={{ 
                  fontWeight: 600, 
                  marginBottom: 6,
                  color: 'rgba(99, 102, 241, 1)',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  AI Evaluation
                </div>
                <div style={{ color: 'var(--text)' }}>
                  {a.summary}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}