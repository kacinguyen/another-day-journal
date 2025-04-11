
/**
 * Activity option type definition
 */
export interface ActivityOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  isCustom?: boolean;
}

/**
 * Activity tag props interface
 */
export interface ActivityTagProps {
  option: ActivityOption;
  isSelected: boolean;
  onToggle: (option: ActivityOption) => void;
  onRemove?: (option: ActivityOption, e: React.MouseEvent) => void;
}
