import { useState, useEffect } from "react";
import { useSiteContent, useSaveBulkContent, PAGE_CONTENT_STRUCTURE, getContent } from "@/hooks/useSiteContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/admin/ImageUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Save, ChevronDown, ChevronRight, FileText } from "lucide-react";

interface ContentEditorProps {
  pageKey: string;
}

const ContentEditor = ({ pageKey }: ContentEditorProps) => {
  const { toast } = useToast();
  const { data: content, isLoading } = useSiteContent(pageKey);
  const saveMutation = useSaveBulkContent();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [hasChanges, setHasChanges] = useState(false);

  const pageConfig = PAGE_CONTENT_STRUCTURE[pageKey];

  // Initialize form data from DB content
  useEffect(() => {
    if (content && pageConfig) {
      const data: Record<string, string> = {};
      for (const [sectionKey, section] of Object.entries(pageConfig.sections)) {
        for (const field of section.fields) {
          const dbKey = `${sectionKey}.${field.key}`;
          data[dbKey] = getContent(content, sectionKey, field.key, "");
        }
      }
      setFormData(data);
      setHasChanges(false);
    }
  }, [content, pageKey]);

  const handleFieldChange = (sectionKey: string, fieldKey: string, value: string) => {
    const dbKey = `${sectionKey}.${fieldKey}`;
    setFormData((prev) => ({ ...prev, [dbKey]: value }));
    setHasChanges(true);
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const handleSave = () => {
    if (!pageConfig) return;

    const items = [];
    for (const [sectionKey, section] of Object.entries(pageConfig.sections)) {
      for (const field of section.fields) {
        const dbKey = `${sectionKey}.${field.key}`;
        const value = formData[dbKey];
        if (value !== undefined && value !== "") {
          items.push({
            page: pageKey,
            section: sectionKey,
            content_key: field.key,
            content_value: value,
            content_type: field.type,
          });
        }
      }
    }

    saveMutation.mutate(items, {
      onSuccess: () => {
        toast({ title: "Contenu enregistré !" });
        setHasChanges(false);
      },
      onError: (error: any) => {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      },
    });
  };

  if (!pageConfig) return <p>Page non trouvée</p>;
  if (isLoading) return <p>Chargement...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6" />
          {pageConfig.label}
        </h2>
        <Button
          onClick={handleSave}
          disabled={saveMutation.isPending || !hasChanges}
          className="bg-gradient-primary"
        >
          <Save className="w-4 h-4 mr-2" />
          {saveMutation.isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>

      {Object.entries(pageConfig.sections).map(([sectionKey, section]) => {
        const isExpanded = expandedSections[sectionKey] !== false; // default open
        return (
          <div key={sectionKey} className="bg-card border border-border rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection(sectionKey)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <h3 className="font-semibold text-foreground">{section.label}</h3>
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {isExpanded && (
              <div className="p-4 pt-0 space-y-4">
                {section.fields.map((field) => {
                  const dbKey = `${sectionKey}.${field.key}`;
                  const value = formData[dbKey] || "";

                  return (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {field.label}
                      </label>
                      {field.type === "image" ? (
                        <ImageUpload
                          value={value}
                          onChange={(url) => handleFieldChange(sectionKey, field.key, url)}
                          folder="content"
                        />
                      ) : field.type === "rich_text" ? (
                        <RichTextEditor
                          value={value}
                          onChange={(val) => handleFieldChange(sectionKey, field.key, val)}
                        />
                      ) : (
                        <Input
                          value={value}
                          onChange={(e) => handleFieldChange(sectionKey, field.key, e.target.value)}
                          placeholder={field.label}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ContentEditor;
