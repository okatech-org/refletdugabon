import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Check, Trash2, FolderOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaLibraryProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  folder?: string;
}

interface StorageFile {
  name: string;
  id: string;
  created_at: string;
}

const MediaLibrary = ({ open, onClose, onSelect, folder }: MediaLibraryProps) => {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [activeFolder, setActiveFolder] = useState<string>(folder || "");
  const { toast } = useToast();

  const folders = ["products", "gallery"];

  const { data: files, isLoading, refetch } = useQuery({
    queryKey: ["storage-files", activeFolder],
    queryFn: async () => {
      const path = activeFolder || "";
      const { data, error } = await supabase.storage
        .from("images")
        .list(path, {
          limit: 100,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;

      // Filter out folders (items without metadata/size)
      return (data || []).filter(
        (item) => !item.id?.includes("folder") && item.name !== ".emptyFolderPlaceholder"
      ) as StorageFile[];
    },
    enabled: open,
  });

  const getPublicUrl = (fileName: string) => {
    const path = activeFolder ? `${activeFolder}/${fileName}` : fileName;
    const { data } = supabase.storage.from("images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleDelete = async (fileName: string) => {
    const path = activeFolder ? `${activeFolder}/${fileName}` : fileName;
    const { error } = await supabase.storage.from("images").remove([path]);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'image",
        variant: "destructive",
      });
    } else {
      toast({ title: "Image supprimée" });
      refetch();
    }
  };

  const handleSelect = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Bibliothèque média</DialogTitle>
        </DialogHeader>

        {/* Folder tabs */}
        <div className="flex gap-2 border-b pb-3">
          {folders.map((f) => (
            <Button
              key={f}
              variant={activeFolder === f ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setActiveFolder(f);
                setSelectedUrl(null);
              }}
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {/* Images grid */}
        <div className="flex-1 overflow-y-auto py-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : files?.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              Aucune image dans ce dossier
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {files?.map((file) => {
                const url = getPublicUrl(file.name);
                const isSelected = selectedUrl === url;

                return (
                  <div
                    key={file.id}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-transparent hover:border-muted-foreground/30"
                    }`}
                    onClick={() => setSelectedUrl(url)}
                  >
                    <img
                      src={url}
                      alt={file.name}
                      className="w-full aspect-square object-cover"
                      loading="lazy"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <Check className="w-8 h-8 text-primary" />
                      </div>
                    )}
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.name);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-3 border-t">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSelect} disabled={!selectedUrl}>
            Sélectionner
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaLibrary;
