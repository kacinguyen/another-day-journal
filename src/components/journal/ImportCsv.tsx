
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileUp, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { importJournalEntries } from "@/services/journalService";

interface ImportCsvProps {
  onImportComplete: () => void;
}

const ImportCsv: React.FC<ImportCsvProps> = ({ onImportComplete }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importStats, setImportStats] = useState<{
    total: number;
    success: number;
    failed: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is a CSV
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setImportStats(null);

    try {
      // Read file content
      const reader = new FileReader();
      reader.onload = async (event) => {
        const csvContent = event.target?.result as string;
        
        // Import the entries
        const result = await importJournalEntries(csvContent);
        
        setImportStats({
          total: result.total,
          success: result.success,
          failed: result.failed,
        });

        toast({
          title: "Import Complete",
          description: `Successfully imported ${result.success} out of ${result.total} entries.`,
        });

        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Notify parent component that import is complete
        onImportComplete();
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error("Error importing CSV:", error);
      toast({
        title: "Import Failed",
        description: "There was an error importing your journal entries.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          id="csv-import"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isImporting}
          className="w-full"
        >
          {isImporting ? (
            <>
              <Upload className="h-4 w-4 mr-2 animate-pulse" />
              Importing...
            </>
          ) : (
            <>
              <FileUp className="h-4 w-4 mr-2" />
              Import Entries from CSV
            </>
          )}
        </Button>
      </div>

      {importStats && (
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center gap-1 text-green-500">
            <CheckCircle className="h-3 w-3" />
            <span>{importStats.success} entries imported successfully</span>
          </div>
          {importStats.failed > 0 && (
            <div className="flex items-center gap-1 text-red-500">
              <AlertCircle className="h-3 w-3" />
              <span>{importStats.failed} entries failed to import</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImportCsv;
