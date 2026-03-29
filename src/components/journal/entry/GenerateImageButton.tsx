import React from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Download, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useImageGeneration } from "@/hooks/useImageGeneration";

interface GenerateImageButtonProps {
  content: string;
  mood?: string;
  activities?: string[];
  emotions?: string[];
  disabled?: boolean;
}

const GenerateImageButton: React.FC<GenerateImageButtonProps> = ({
  content,
  mood,
  activities,
  emotions,
  disabled,
}) => {
  const {
    imageData,
    mimeType,
    isGenerating,
    generateImage,
    clearImage,
    downloadImage,
  } = useImageGeneration();

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleGenerate = async () => {
    setDialogOpen(true);
    await generateImage({ content, mood, activities, emotions });
  };

  const handleClose = () => {
    setDialogOpen(false);
    clearImage();
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleGenerate}
        disabled={disabled || isGenerating || !content}
        className="flex items-center gap-1.5"
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ImageIcon className="h-4 w-4" />
        )}
        {isGenerating ? "Generating..." : "Generate Image"}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Journal Illustration</DialogTitle>
          </DialogHeader>

          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Creating your illustration...
              </p>
            </div>
          )}

          {imageData && !isGenerating && (
            <div className="space-y-4">
              <img
                src={`data:${mimeType};base64,${imageData}`}
                alt="Generated journal illustration"
                className="w-full rounded-md"
              />
              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={handleClose}>
                  <X className="h-4 w-4 mr-1.5" />
                  Close
                </Button>
                <Button variant="default" size="sm" onClick={downloadImage}>
                  <Download className="h-4 w-4 mr-1.5" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GenerateImageButton;
