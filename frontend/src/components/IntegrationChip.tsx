import type { Integration, IntegrationId } from '../types';

interface IntegrationChipProps {
  integration: Integration;
  isSelected: boolean;
  onToggle: (id: IntegrationId) => void;
  disabled?: boolean;
}

/**
 * IntegrationChip — toggleable chip for integration selection.
 *
 * Selected state:  orange border + orange bg tint + check_circle icon
 * Unselected state: gray border + surface bg + service icon
 *
 * Design preserved exactly from source HTML.
 */
export function IntegrationChip({
  integration,
  isSelected,
  onToggle,
  disabled = false,
}: IntegrationChipProps) {
  const { id, name, icon } = integration;

  return (
    <button
      id={`integration-chip-${id}`}
      onClick={() => onToggle(id)}
      disabled={disabled}
      aria-pressed={isSelected}
      aria-label={`${isSelected ? 'Deselect' : 'Select'} ${name} integration`}
      className={[
        'flex items-center gap-2 px-4 py-2 rounded-full border transition-all',
        isSelected
          ? 'border-primary-container bg-[rgba(255,107,0,0.1)] text-text-primary'
          : 'border-border-subtle bg-surface hover:border-text-muted text-text-muted hover:text-text-primary',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      <span
        className={[
          'material-symbols-outlined text-sm',
          isSelected ? 'text-primary-container' : '',
        ].join(' ')}
        style={{
          fontSize: '16px',
          fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0",
        }}
      >
        {isSelected ? 'check_circle' : icon}
      </span>
      <span className="font-label-mono text-xs">{name}</span>
    </button>
  );
}
