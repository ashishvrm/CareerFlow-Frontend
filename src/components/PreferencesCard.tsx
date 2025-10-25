import { useId } from "react";
import type { UserPreferences } from "../types";

interface Props {
  value: UserPreferences;
  onChange: (val: UserPreferences) => void;
}

export function PreferencesCard({ value, onChange }: Props) {
  const idKeywords = useId();
  const idLocations = useId();
  const idMinSalary = useId();
  const idRoleTags = useId();

  return (
    <div>
      <h3 style={{ margin: 0 }}>Your preferences</h3>

      <div className="input-row">
        <div>
          <label htmlFor={idKeywords} className="small">Keywords</label>
          <input
            id={idKeywords}
            className="input"
            placeholder="react, typescript, node"
            value={value.keywords}
            onChange={(e) => onChange({ ...value, keywords: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor={idLocations} className="small">Preferred locations</label>
          <input
            id={idLocations}
            className="input"
            placeholder="Remote, Indianapolis, Delhi NCR"
            value={value.locations}
            onChange={(e) => onChange({ ...value, locations: e.target.value })}
          />
        </div>
      </div>

      <div className="input-row">
        <div>
          <label htmlFor={idMinSalary} className="small">Minimum salary (optional)</label>
          <input
            id={idMinSalary}
            className="input"
            placeholder="e.g. 140000"
            inputMode="numeric"
            value={value.minSalary ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                minSalary: e.target.value ? Number(e.target.value) : "",
              })
            }
          />
        </div>

        <div>
          <label htmlFor={idRoleTags} className="small">Role tags (optional)</label>
          <input
            id={idRoleTags}
            className="input"
            placeholder="frontend, tech lead, engineering manager"
            value={value.roleTags ?? ""}
            onChange={(e) => onChange({ ...value, roleTags: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}