import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ImageUpload from "@/components/admin/ImageUpload";
import ContentEditor from "@/components/admin/ContentEditor";
import MediaManager from "@/components/admin/MediaManager";
import { PAGE_CONTENT_STRUCTURE } from "@/hooks/useSiteContent";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LogOut,
  Package,
  Image,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Mail,
  Users,
  Shield,
  FileText,
  ImageIcon,
  Menu,
  ChevronLeft,
  FolderOpen,
  Eye,
  EyeOff,
  Settings,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

type Tab = "content" | "media" | "products" | "gallery" | "messages" | "users" | "projects" | "pages";

const NAV_ITEMS: { key: Tab; label: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
  { key: "content", label: "Contenu", icon: <FileText className="w-5 h-5" /> },
  { key: "media", label: "Médias", icon: <ImageIcon className="w-5 h-5" /> },
  { key: "pages", label: "Pages", icon: <Settings className="w-5 h-5" /> },
  { key: "products", label: "Produits", icon: <Package className="w-5 h-5" /> },
  { key: "projects", label: "Projets", icon: <FolderOpen className="w-5 h-5" /> },
  { key: "gallery", label: "Galerie", icon: <Image className="w-5 h-5" /> },
  { key: "messages", label: "Messages", icon: <Mail className="w-5 h-5" /> },
  { key: "users", label: "Utilisateurs", icon: <Users className="w-5 h-5" />, adminOnly: true },
];

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingImage, setEditingImage] = useState<any>(null);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showImageForm, setShowImageForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [activeContentPage, setActiveContentPage] = useState("accueil");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) navigate("/admin/login");
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) navigate("/admin/login");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  // Queries
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: galleryImages, isLoading: galleryLoading } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_images").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: userRoles, isLoading: rolesLoading } = useQuery({
    queryKey: ["admin-user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: currentUserRole } = useQuery({
    queryKey: ["current-user-role"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single();
      if (error) return null;
      return data?.role;
    },
  });

  const isAdmin = currentUserRole === "admin";

  const { data: adminProjects, isLoading: projectsLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: pageSettings, isLoading: pagesLoading } = useQuery({
    queryKey: ["admin-page-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("page_settings").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Mutations
  const saveProductMutation = useMutation({
    mutationFn: async (product: any) => {
      if (product.id) {
        const { error } = await supabase.from("products").update(product).eq("id", product.id);
        if (error) throw error;
      } else {
        const { id, ...d } = product;
        const { error } = await supabase.from("products").insert(d);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditingProduct(null);
      setShowProductForm(false);
      toast({ title: "Produit enregistré !" });
    },
    onError: (error: any) => toast({ title: "Erreur", description: error.message, variant: "destructive" }),
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Produit supprimé" });
    },
  });

  const saveImageMutation = useMutation({
    mutationFn: async (image: any) => {
      if (image.id) {
        const { error } = await supabase.from("gallery_images").update(image).eq("id", image.id);
        if (error) throw error;
      } else {
        const { id, ...d } = image;
        const { error } = await supabase.from("gallery_images").insert(d);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery_images"] });
      setEditingImage(null);
      setShowImageForm(false);
      toast({ title: "Image enregistrée !" });
    },
    onError: (error: any) => toast({ title: "Erreur", description: error.message, variant: "destructive" }),
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery_images").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery_images"] });
      toast({ title: "Image supprimée" });
    },
  });

  const saveProjectMutation = useMutation({
    mutationFn: async (project: any) => {
      if (project.id) {
        const { error } = await supabase.from("projects").update(project).eq("id", project.id);
        if (error) throw error;
      } else {
        const { id, ...d } = project;
        const { error } = await supabase.from("projects").insert(d);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      setEditingProject(null);
      setShowProjectForm(false);
      toast({ title: "Projet enregistré !" });
    },
    onError: (error: any) => toast({ title: "Erreur", description: error.message, variant: "destructive" }),
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      toast({ title: "Projet supprimé" });
    },
  });

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setMobileNavOpen(false);
  };

  // Sidebar nav content (shared between desktop sidebar and mobile sheet)
  const navContent = (
    <nav className="flex-1 py-4 space-y-1 px-2">
      {NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin).map((item) => (
        <button
          key={item.key}
          onClick={() => handleTabChange(item.key)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === item.key
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
          {item.key === "messages" && (messages?.length || 0) > 0 && (
            <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
              {messages?.length}
            </span>
          )}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside
          className={`fixed inset-y-0 left-0 z-40 bg-card border-r border-border flex flex-col transition-all duration-200 ${
            sidebarOpen ? "w-56" : "w-16"
          }`}
        >
          <div className="h-14 flex items-center justify-between px-4 border-b border-border">
            {sidebarOpen && <span className="font-bold text-foreground text-sm">Administration</span>}
            <Button size="icon" variant="ghost" className="w-8 h-8" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>

          {sidebarOpen ? (
            navContent
          ) : (
            <nav className="flex-1 py-4 space-y-1 px-2">
              {NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin).map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleTabChange(item.key)}
                  className={`w-full flex items-center justify-center p-2.5 rounded-lg transition-colors ${
                    activeTab === item.key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  title={item.label}
                >
                  {item.icon}
                </button>
              ))}
            </nav>
          )}

          <div className="p-2 border-t border-border">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${sidebarOpen ? "gap-3 px-3" : "justify-center"} py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors`}
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span>Déconnexion</span>}
            </button>
          </div>
        </aside>
      )}

      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-card border-b border-border flex items-center justify-between px-4">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="w-9 h-9">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 flex flex-col">
              <div className="h-14 flex items-center px-4 border-b border-border">
                <span className="font-bold text-foreground text-sm">Administration</span>
              </div>
              {navContent}
              <div className="p-2 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
          <span className="font-semibold text-foreground text-sm">
            {NAV_ITEMS.find((i) => i.key === activeTab)?.label || "Administration"}
          </span>
          <div className="w-9" /> {/* Spacer for centering */}
        </header>
      )}

      {/* Main content */}
      <main
        className={`flex-1 transition-all duration-200 ${
          isMobile ? "mt-14" : sidebarOpen ? "ml-56" : "ml-16"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          {/* Content Tab */}
          {activeTab === "content" && (
            <div className="grid lg:grid-cols-[200px_1fr] gap-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">Pages</p>
                <div className={`${isMobile ? "flex flex-wrap gap-2" : "space-y-1"}`}>
                  {Object.entries(PAGE_CONTENT_STRUCTURE).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setActiveContentPage(key)}
                      className={`${isMobile ? "px-3 py-1.5 rounded-full text-xs" : "w-full text-left px-3 py-2 rounded-lg text-sm"} font-medium transition-colors ${
                        activeContentPage === key
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>
              <ContentEditor key={activeContentPage} pageKey={activeContentPage} />
            </div>
          )}

          {activeTab === "pages" && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Visibilité des pages</h2>
              <p className="text-muted-foreground text-sm mb-6">Activez ou désactivez les pages visibles dans la navigation du site.</p>
              <div className="grid gap-3">
                {pagesLoading ? <p>Chargement...</p> : pageSettings?.map((page) => (
                  <div key={page.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {page.is_visible ? <Eye className="w-5 h-5 text-primary" /> : <EyeOff className="w-5 h-5 text-muted-foreground" />}
                      <div>
                        <p className="font-medium">{page.page_label}</p>
                        <p className="text-sm text-muted-foreground">{page.href}</p>
                      </div>
                    </div>
                    <Switch
                      checked={page.is_visible}
                      onCheckedChange={async (checked) => {
                        await supabase.from("page_settings").update({ is_visible: checked }).eq("id", page.id);
                        queryClient.invalidateQueries({ queryKey: ["admin-page-settings"] });
                        queryClient.invalidateQueries({ queryKey: ["page-settings"] });
                        toast({ title: checked ? `${page.page_label} activée` : `${page.page_label} masquée` });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "media" && <MediaManager />}

          {activeTab === "products" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">Produits</h2>
                <Button size={isMobile ? "sm" : "default"} onClick={() => { setEditingProduct({ name: "", description: "", price: "", category: "artisanat", image_url: "", in_stock: true }); setShowProductForm(true); }}>
                  <Plus className="w-4 h-4 mr-1" />Ajouter
                </Button>
              </div>
              {showProductForm && editingProduct && (
                <ProductForm product={editingProduct} onSave={(p) => saveProductMutation.mutate(p)} onCancel={() => { setShowProductForm(false); setEditingProduct(null); }} isLoading={saveProductMutation.isPending} />
              )}
              <div className="grid gap-4">
                {productsLoading ? <p>Chargement...</p> : products?.map((product) => (
                  <div key={product.id} className="bg-card border border-border rounded-xl p-4 flex gap-4 items-center">
                    <img src={product.image_url || "/placeholder.svg"} alt={product.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                      <p className="text-primary font-bold">{Number(product.price).toFixed(2)} €</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditingProduct(product); setShowProductForm(true); }}><Pencil className="w-4 h-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteProductMutation.mutate(product.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "gallery" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">Galerie</h2>
                <Button size={isMobile ? "sm" : "default"} onClick={() => { setEditingImage({ title: "", description: "", image_url: "", category: "agriculture" }); setShowImageForm(true); }}>
                  <Plus className="w-4 h-4 mr-1" />Ajouter
                </Button>
              </div>
              {showImageForm && editingImage && (
                <ImageForm image={editingImage} onSave={(img) => saveImageMutation.mutate(img)} onCancel={() => { setShowImageForm(false); setEditingImage(null); }} isLoading={saveImageMutation.isPending} />
              )}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryLoading ? <p>Chargement...</p> : galleryImages?.map((image) => (
                  <div key={image.id} className="bg-card border border-border rounded-xl overflow-hidden">
                    <img src={image.image_url} alt={image.title} className="w-full h-32 sm:h-40 object-cover" />
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-sm sm:text-base truncate">{image.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{image.category}</p>
                      <div className="flex gap-2 mt-2 sm:mt-3">
                        <Button size="sm" variant="outline" onClick={() => { setEditingImage(image); setShowImageForm(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteImageMutation.mutate(image.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">Projets</h2>
                <Button size={isMobile ? "sm" : "default"} onClick={() => { setEditingProject({ title: "", date: "En cours", category: "", description: "", icon: "Sprout", color: "primary", sort_order: (adminProjects?.length || 0) + 1, is_active: true, image_url: "" }); setShowProjectForm(true); }}>
                  <Plus className="w-4 h-4 mr-1" />Ajouter
                </Button>
              </div>
              {showProjectForm && editingProject && (
                <ProjectForm project={editingProject} onSave={(p) => saveProjectMutation.mutate(p)} onCancel={() => { setShowProjectForm(false); setEditingProject(null); }} isLoading={saveProjectMutation.isPending} />
              )}
              <div className="grid gap-4">
                {projectsLoading ? <p>Chargement...</p> : adminProjects?.map((project) => (
                  <div key={project.id} className="bg-card border border-border rounded-xl p-4 flex gap-4 items-start">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      project.color === "primary" ? "bg-primary" : project.color === "gold" ? "bg-amber-500" : "bg-blue-500"
                    }`}>
                      <FolderOpen className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">{project.category} • {project.date}</p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button size="sm" variant="outline" onClick={() => { setEditingProject(project); setShowProjectForm(true); }}><Pencil className="w-4 h-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteProjectMutation.mutate(project.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-6">Messages reçus</h2>
              <div className="grid gap-4">
                {messagesLoading ? <p>Chargement...</p> : messages?.length === 0 ? (
                  <p className="text-muted-foreground">Aucun message reçu.</p>
                ) : messages?.map((msg) => (
                  <div key={msg.id} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base">{msg.first_name} {msg.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{msg.email}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleDateString("fr-FR")}</span>
                    </div>
                    <p className="text-sm font-medium text-primary mb-2">{msg.subject}</p>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "users" && isAdmin && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-6">Gestion des utilisateurs</h2>
              <div className="bg-card border border-border rounded-xl p-4 sm:p-6 mb-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />Utilisateurs avec des rôles
                </h3>
                <div className="grid gap-4">
                  {rolesLoading ? <p>Chargement...</p> : userRoles?.length === 0 ? (
                    <p className="text-muted-foreground">Aucun utilisateur avec un rôle.</p>
                  ) : userRoles?.map((ur: any) => (
                    <div key={ur.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{ur.user_id}</p>
                        <p className="text-xs text-muted-foreground">Créé le {new Date(ur.created_at).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${
                        ur.role === 'admin' ? 'bg-primary text-primary-foreground' : ur.role === 'moderator' ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>{ur.role}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Note :</strong> Pour ajouter de nouveaux administrateurs, contactez le support technique. Les rôles disponibles sont : admin, moderator, user.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Product Form Component
const ProductForm = ({ product, onSave, onCancel, isLoading }: { product: any; onSave: (p: any) => void; onCancel: () => void; isLoading: boolean }) => {
  const [form, setForm] = useState(product);
  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">{product.id ? "Modifier" : "Ajouter"} un produit</h3>
        <Button size="sm" variant="ghost" onClick={onCancel}><X className="w-4 h-4" /></Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-1">Nom</label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nom du produit" /></div>
        <div><label className="block text-sm font-medium mb-1">Prix (€)</label><Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" /></div>
        <div><label className="block text-sm font-medium mb-1">Catégorie</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"><option value="artisanat">Artisanat</option><option value="bijoux">Bijoux</option><option value="textiles">Textiles</option><option value="bons-cadeaux">Bons Cadeaux</option></select></div>
        <div><label className="block text-sm font-medium mb-1">Image</label><ImageUpload value={form.image_url || ""} onChange={(url) => setForm({ ...form, image_url: url })} folder="products" /></div>
        <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1">Description</label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description du produit" rows={3} /></div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>Annuler</Button>
        <Button onClick={() => onSave(form)} disabled={isLoading}><Save className="w-4 h-4 mr-2" />Enregistrer</Button>
      </div>
    </div>
  );
};

// Image Form Component
const ImageForm = ({ image, onSave, onCancel, isLoading }: { image: any; onSave: (img: any) => void; onCancel: () => void; isLoading: boolean }) => {
  const [form, setForm] = useState(image);
  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">{image.id ? "Modifier" : "Ajouter"} une image</h3>
        <Button size="sm" variant="ghost" onClick={onCancel}><X className="w-4 h-4" /></Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-1">Titre</label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre de l'image" /></div>
        <div><label className="block text-sm font-medium mb-1">Catégorie</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"><option value="agriculture">Agriculture</option><option value="culture">Culture</option><option value="restaurant">Restaurant</option></select></div>
        <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1">Image</label><ImageUpload value={form.image_url || ""} onChange={(url) => setForm({ ...form, image_url: url })} folder="gallery" /></div>
        <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1">Description</label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description de l'image" rows={2} /></div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>Annuler</Button>
        <Button onClick={() => onSave(form)} disabled={isLoading}><Save className="w-4 h-4 mr-2" />Enregistrer</Button>
      </div>
    </div>
  );
};

// Project Form Component
const ProjectForm = ({ project, onSave, onCancel, isLoading }: { project: any; onSave: (p: any) => void; onCancel: () => void; isLoading: boolean }) => {
  const [form, setForm] = useState(project);
  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">{project.id ? "Modifier" : "Ajouter"} un projet</h3>
        <Button size="sm" variant="ghost" onClick={onCancel}><X className="w-4 h-4" /></Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-1">Titre</label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre du projet" /></div>
        <div><label className="block text-sm font-medium mb-1">Date</label><Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Ex: En cours, 2023, Juin 2022" /></div>
        <div><label className="block text-sm font-medium mb-1">Catégorie</label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Ex: Agriculture, Restaurant, Partenariat" /></div>
        <div><label className="block text-sm font-medium mb-1">Couleur</label>
          <select value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
            <option value="primary">Vert (primary)</option>
            <option value="gold">Or (gold)</option>
            <option value="ocean">Bleu (ocean)</option>
          </select>
        </div>
        <div><label className="block text-sm font-medium mb-1">Icône</label>
          <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
            <option value="Sprout">Sprout (Agriculture)</option>
            <option value="Award">Award (Prix)</option>
            <option value="Package">Package (Matériel)</option>
            <option value="Users">Users (Communauté)</option>
            <option value="Heart">Heart (Solidarité)</option>
          </select>
        </div>
        <div><label className="block text-sm font-medium mb-1">Ordre</label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} /></div>
        <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1">Image</label><ImageUpload value={form.image_url || ""} onChange={(url) => setForm({ ...form, image_url: url })} folder="projects" /></div>
        <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1">Description</label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description du projet" rows={4} /></div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>Annuler</Button>
        <Button onClick={() => onSave(form)} disabled={isLoading}><Save className="w-4 h-4 mr-2" />Enregistrer</Button>
      </div>
    </div>
  );
};

export default Admin;
