
import React from "react";
import { UserPlus } from "lucide-react";

interface AddPersonButtonProps {
  onClick: () => void;
}

const AddPersonButton: React.FC<AddPersonButtonProps> = ({ onClick }) => {
  return (
    <div 
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md cursor-pointer transition-colors bg-secondary/50 hover:bg-secondary border border-dashed border-primary/30"
      onClick={onClick}
    >
      <UserPlus className="h-4 w-4" />
      <span className="text-xs font-medium">Add person</span>
    </div>
  );
};

export default AddPersonButton;
