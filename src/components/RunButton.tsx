interface Props {
  onStart: () => void;
  disabled?: boolean;
}

export function RunButton({ onStart, disabled }: Props) {
  return (
    <button className="button" onClick={onStart} disabled={disabled}>
      {disabled ? "Running…" : "Start Auto-Apply"}
    </button>
  );
}