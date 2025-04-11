
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { JournalEntryData } from "./types/journal-types";
import { exportJournalEntriesToCsv } from "@/utils/exportCsvUtils";
import { useToast } from "@/hooks/use-toast";

interface ExportCsvProps {
  entries: JournalEntryData[];
  disabled?: boolean;
}

/**
 * ExportCsv Component
 * 
 * Provides a button to export journal entries to a CSV file
 */
const ExportCsv: React.FC<ExportCsvProps> = ({ entries, disabled = false }) => {
  const { toast } = useToast();
  
  const handleExport = () => {
    if (!entries.length) {
      toast({
        title: "No entries to export",
        description: "Create some journal entries first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      exportJournalEntriesToCsv(entries);
      
      toast({
        title: "Export Successful",
        description: `Exported ${entries.length} journal entries to CSV`,
      });
    } catch (error) {
      console.error("Error exporting entries:", error);
      
      toast({
        title: "Export Failed",
        description: "There was an error exporting your journal entries",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={disabled || entries.length === 0}
      className="w-full"
    >
      <Download className="h-4 w-4 mr-2" />
      Export Entries to CSV
    </Button>
  );
};

export default ExportCsv;
