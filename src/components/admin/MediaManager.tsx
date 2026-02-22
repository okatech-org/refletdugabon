import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Trash2, Upload, FolderOpen, Search, ExternalLink, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRef, useCallback } from "react";
import { resizeImage } from "@/lib/imageUtils";

interface StorageFile {
  name: string;
  id: string;
  created_at: string;
  metadata?: { size?: number; mimetype?: string };
}

const FOLDERS = [
  { key: "", label: "Tous" },
  { key: "products", label: "Produits" },
  { key: "gallery", label: "Galerie" },
  { key: "content", label: "Contenu" },
];

const MediaManager = () => {
  const [activeFolder, setActiveFolder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch files from all folders or a specific one
  const { data: files, isLoading, refetch } = useQuery({
    queryKey: ["admin-storage-files", activeFolder],
    queryFn: async () => {
      if (activeFolder) {
        return fetchFolder(activeFolder);
      }
      // Fetch all folders
      const allFiles: (StorageFile & { folder: string })[] = [];
      for (const f of FOLDERS.filter((f) => f.key !== "")) {
        const folderFiles = await fetchFolder(f.key);
        allFiles.push(...folderFiles.map((file) => ({ ...file, folder: f.key })));
      }
      // Also fetch root
      const rootFiles = await fetchFolder("");
      allFiles.push(...rootFiles.map((file) => ({ ...file, folder: "" })));
      return allFiles;
    },
  });

  const fetchFolder = async (path: string) => {
    const { data, error } = await supabase.storage
      .from("images")
      .list(path, { limit: 200, sortBy: { column: "created_at", order: "desc" } });

    if (error) throw error;
    return (data || []).filter(
      (item) => !item.name.startsWith(".") && item.id
    ) as StorageFile[];
  };

  const getPublicUrl = (fileName: string, folder?: string) => {
    const path = folder ? `${folder}/${fileName}` : fileName;
    const { data } = supabase.storage.from("images").getPublicUrl(path);
    return data.publicUrl;
  };

  const getFilePath = (file: any) => {
    if (file.folder !== undefined) {
      return file.folder ? `${file.folder}/${file.name}` : file.name;
    }
    return activeFolder ? `${activeFolder}/${file.name}` : file.name;
  };

  const handleDelete = async (file: any) => {
    const path = getFilePath(file);
    const { error } = await supabase.storage.from("images").remove([path]);
    if (error) {
      toast({ title: "Erreur", description: "Impossible de supprimer", variant: "destructive" });
    } else {
      toast({ title: "Image supprimée" });
      refetch();
    }
  };

  const handleUpload = async (uploadFiles: FileList) => {
    setIsUploading(true);
    const folder = activeFolder || "content";

    try {
      for (const file of Array.from(uploadFiles)) {
        if (!file.type.startsWith("image/")) continue;

        const resizedBlob = await resizeImage(file, 1200, 1200, 0.85);
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;

        const { error } = await supabase.storage
          .from("images")
          .upload(fileName, resizedBlob, {
            contentType: "image/jpeg",
            cacheControl: "3600",
          });

        if (error) throw error;
      }

      toast({ title: `${uploadFiles.length} image(s) téléchargée(s)` });
      refetch();
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        await handleUpload(e.dataTransfer.files);
      }
    },
    [activeFolder]
  );

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
    toast({ title: "URL copiée !" });
  };

  const filteredFiles = files?.filter((f) =>
    searchTerm ? f.name.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Bibliothèque Médias</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredFiles?.length || 0} image(s) • Glissez-déposez pour ajouter
          </p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
          {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
          Télécharger
        </Button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-wrap">
          {FOLDERS.map((f) => (
            <Button
              key={f.key}
              size="sm"
              variant={activeFolder === f.key ? "default" : "outline"}
              onClick={() => setActiveFolder(f.key)}
            >
              <FolderOpen className="w-3.5 h-3.5 mr-1.5" />
              {f.label}
            </Button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Drop zone + grid */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="min-h-[300px]"
      >
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredFiles?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-xl">
            <Upload className="w-12 h-12 mb-3" />
            <p className="text-lg font-medium">Aucune image</p>
            <p className="text-sm">Glissez-déposez des images ici ou cliquez sur Télécharger</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredFiles?.map((file) => {
              const url = getPublicUrl(file.name, (file as any).folder !== undefined ? (file as any).folder : activeFolder);
              const isSelected = selectedImage === url;

              return (
                <div
                  key={file.id + file.name}
                  className={`group relative bg-card border rounded-xl overflow-hidden transition-all cursor-pointer hover:shadow-md ${
                    isSelected ? "ring-2 ring-primary border-primary" : "border-border"
                  }`}
                  onClick={() => setSelectedImage(isSelected ? null : url)}
                >
                  <div className="aspect-square">
                    <img
                      src={url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-end">
                    <div className="w-full p-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="w-7 h-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyUrl(url);
                        }}
                        title="Copier l'URL"
                      >
                        {copiedUrl === url ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="w-7 h-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(url, "_blank");
                        }}
                        title="Ouvrir"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="w-7 h-7 ml-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(file);
                        }}
                        title="Supprimer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Folder badge */}
                  {(file as any).folder && !activeFolder && (
                    <span className="absolute top-1.5 left-1.5 bg-foreground/70 text-background text-[10px] px-1.5 py-0.5 rounded-full">
                      {(file as any).folder}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected image detail */}
      {selectedImage && (
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start">
          <img src={selectedImage} alt="" className="w-32 h-32 object-cover rounded-lg" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground mb-1">URL de l'image</p>
            <div className="flex gap-2">
              <Input value={selectedImage} readOnly className="text-xs flex-1" />
              <Button size="sm" variant="outline" onClick={() => copyUrl(selectedImage)}>
                {copiedUrl === selectedImage ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => e.target.files && handleUpload(e.target.files)}
        className="hidden"
      />
    </div>
  );
};

export default MediaManager;
