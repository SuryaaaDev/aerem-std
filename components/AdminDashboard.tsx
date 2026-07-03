'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { Trash2, Plus, Image as ImageIcon, Loader2, Search, Eye, Settings, ExternalLink, Tag, ChevronLeft, Check, X, LogOut, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ProjectDetailView from './ProjectDetailView';

interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}


interface SnackbarNotification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export default function AdminDashboard({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sidebarMode, setSidebarMode] = useState<'projects' | 'categories'>('projects');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [editingCat, setEditingCat] = useState<{ id: string; name: string } | null>(null);

  const [notifications, setNotifications] = useState<SnackbarNotification[]>([]);

  const showNotification = (message: string, type: SnackbarNotification['type'] = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  // Fetch categories on mount
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => Array.isArray(data) ? setCategories(data) : null)
      .catch(() => null);
  }, []);

  // Category CRUD handlers
  const handleAddCategory = async () => {
    const name = newCatName.toUpperCase().trim();
    if (!name) return;
    setCatLoading(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create category');
      setCategories((prev) => [...prev, data]);
      setNewCatName('');
      showNotification(`CATEGORY '${name}' CREATED`, 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification(`ERROR: ${msg.toUpperCase()}`, 'error');
    } finally {
      setCatLoading(false);
    }
  };

  const handleUpdateCategory = async (id: string, name: string) => {
    const upperName = name.toUpperCase().trim();
    if (!upperName) return;
    setCatLoading(true);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: upperName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update category');
      setCategories((prev) => prev.map((c) => c.id === id ? data : c));
      setEditingCat(null);
      showNotification(`CATEGORY UPDATED TO '${upperName}'`, 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification(`ERROR: ${msg.toUpperCase()}`, 'error');
    } finally {
      setCatLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Hapus kategori '${name}'?`)) return;
    setCatLoading(true);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete category');
      }
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showNotification(`CATEGORY '${name}' DELETED`, 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification(`ERROR: ${msg.toUpperCase()}`, 'error');
    } finally {
      setCatLoading(false);
    }
  };

  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };



  const defaultForm = {
    id: '',
    title: '',
    slug: '',
    client: '',
    year: new Date().getFullYear(),
    category: '',
    description: '',
    thumbnail: '',
    mockups: [] as string[],
  };

  const [formData, setFormData] = useState(defaultForm);
  const [pendingThumbnail, setPendingThumbnail] = useState<{ file: File; url: string } | null>(null);
  const [pendingMockups, setPendingMockups] = useState<{ file: File; url: string }[]>([]);

  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  // Open a project in the editor
  const handleEdit = (project: Project) => {
    // Clear object URLs from previous preview states
    if (pendingThumbnail) URL.revokeObjectURL(pendingThumbnail.url);
    pendingMockups.forEach((pm) => URL.revokeObjectURL(pm.url));

    setFormData({
      id: project.id,
      title: project.title,
      slug: project.slug,
      client: project.client || '',
      year: project.year || new Date().getFullYear(),
      category: project.category,
      description: project.description || '',
      thumbnail: project.thumbnail || '',
      mockups: project.mockups || [],
    });
    setPendingThumbnail(null);
    setPendingMockups([]);
    setActiveTab('edit');
    setIsEditing(true);
    closeMobileSidebar();
  };

  // Open empty editor for creating new project
  const handleCreate = () => {
    if (pendingThumbnail) URL.revokeObjectURL(pendingThumbnail.url);
    pendingMockups.forEach((pm) => URL.revokeObjectURL(pm.url));

    setFormData(defaultForm);
    setPendingThumbnail(null);
    setPendingMockups([]);
    setActiveTab('edit');
    setIsEditing(true);
    closeMobileSidebar();
  };

  // Handle title input and auto-slug generation
  const handleTitleChange = (title: string) => {
    const nextSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // remove special chars
      .replace(/\s+/g, '-')         // spaces to hyphens
      .replace(/-+/g, '-');         // double hyphens to single
      
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.id ? prev.slug : nextSlug, // only auto-fill slug on new projects
    }));
  };

  // Handle local thumbnail selection and generate object URL for preview
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (pendingThumbnail) URL.revokeObjectURL(pendingThumbnail.url);
      const url = URL.createObjectURL(file);
      setPendingThumbnail({ file, url });
      setFormData((prev) => ({ ...prev, thumbnail: url }));
    }
  };

  // Handle local mockup selection and generate object URLs for preview (Max 4 images total)
  const handleMockupsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const currentCount = formData.mockups.length;
      const maxAllowed = 4;
      const remainingSlots = maxAllowed - currentCount;

      if (remainingSlots <= 0) {
        showNotification('MAXIMUM 4 IMAGES ALLOWED', 'error');
        return;
      }

      const filesToProcess = Array.from(files).slice(0, remainingSlots);
      if (files.length > remainingSlots) {
        showNotification(`ONLY ${remainingSlots} IMAGE(S) ADDED. MAX IS 4.`, 'warning');
      }

      const newPendings: { file: File; url: string }[] = [];
      const newUrls: string[] = [];
      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i];
        const url = URL.createObjectURL(file);
        newPendings.push({ file, url });
        newUrls.push(url);
      }
      setPendingMockups((prev) => [...prev, ...newPendings]);
      setFormData((prev) => ({ ...prev, mockups: [...prev.mockups, ...newUrls] }));
    }
  };

  // Remove mockup item (handles both database links and pending local previews)
  const handleRemoveMockup = (index: number) => {
    const removedUrl = formData.mockups[index];
    const newMockups = formData.mockups.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, mockups: newMockups }));
    
    if (removedUrl.startsWith('blob:')) {
      const pendingItem = pendingMockups.find((p) => p.url === removedUrl);
      if (pendingItem) {
        URL.revokeObjectURL(pendingItem.url);
        setPendingMockups((prev) => prev.filter((p) => p.url !== removedUrl));
      }
    }
  };

  // File Uploader — compresses on server, then stores in Supabase Storage
  const uploadFile = async (file: File, type: 'thumbnail' | 'mockup'): Promise<string> => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }
    if (file.size > 15 * 1024 * 1024) {
      throw new Error('Image must be under 15 MB before upload');
    }

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('type', type);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formDataUpload,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'File upload failed');
    }

    const { url } = await res.json();
    return url;
  };

  // Save changes / Create project handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) return;
    
    setLoading(true);
    try {
      let finalThumbnail = formData.thumbnail;
      const finalMockups = [...formData.mockups];

      // 1. Upload local thumbnail if changed
      if (pendingThumbnail && formData.thumbnail === pendingThumbnail.url) {
        finalThumbnail = await uploadFile(pendingThumbnail.file, 'thumbnail');
      }

      // 2. Upload any local mockups present in mockups array
      for (let i = 0; i < finalMockups.length; i++) {
        const itemUrl = finalMockups[i];
        if (itemUrl.startsWith('blob:')) {
          const pending = pendingMockups.find((p) => p.url === itemUrl);
          if (pending) {
            const uploadedUrl = await uploadFile(pending.file, 'mockup');
            finalMockups[i] = uploadedUrl;
          }
        }
      }

      const projectData = {
        title: formData.title.toUpperCase(),
        slug: formData.slug.toLowerCase().trim(),
        client: formData.client.toUpperCase(),
        year: formData.year,
        category: formData.category.toUpperCase(),
        description: formData.description,
        thumbnail: finalThumbnail,
        mockups: finalMockups,
      };

      if (formData.id) {
        const res = await fetch(`/api/projects/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to update project');
        }
      } else {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to create project');
        }
      }

      // Refresh local projects state to reflect updates in UI immediately
      const refreshRes = await fetch('/api/projects');
      if (refreshRes.ok) {
        const freshData = await refreshRes.json();
        setProjects(freshData);
      }

      showNotification(
        formData.id ? 'PROJECT UPDATED SUCCESSFULLY' : 'PROJECT CREATED SUCCESSFULLY',
        'success'
      );
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving project:', error);
      const msg = error instanceof Error ? error.message : String(error);
      showNotification(`ERROR SAVING PROJECT: ${msg.toUpperCase()}`, 'error');
    } finally {
      setLoading(false);
    }
  };



  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete project');
        
        setProjects(projects.filter((p) => p.id !== id));
        if (formData.id === id) {
          setIsEditing(false);
        }
        showNotification('PROJECT DELETED SUCCESSFULLY', 'success');
      } catch (error) {
        console.error(error);
        const msg = error instanceof Error ? error.message : String(error);
        showNotification(`ERROR DELETING PROJECT: ${msg.toUpperCase()}`, 'error');
      }
    }
  };

  // Filter projects by search and category in the sidebar
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.client || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || p.category.toUpperCase() === selectedCategory.toUpperCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background text-foreground flex-col lg:flex-row">
      {/* Mobile backdrop when sidebar drawer is open */}
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-[2px] lg:hidden cursor-pointer"
        />
      )}

      {/* ── MOBILE TOP BAR ── */}
      <header className="lg:hidden shrink-0 border-b border-border/10 bg-background/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-2 min-w-0">
          {isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-2 border border-border/20 text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-all cursor-pointer shrink-0"
              aria-label="Back to projects"
            >
              <ChevronLeft size={16} />
            </button>
          ) : sidebarMode === 'categories' ? (
            <button
              type="button"
              onClick={() => setSidebarMode('projects')}
              className="p-2 border border-border/20 text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-all cursor-pointer shrink-0"
              aria-label="Back to projects"
            >
              <ChevronLeft size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 border border-border/20 text-foreground/60 hover:text-accent hover:border-accent/40 transition-all cursor-pointer shrink-0"
              aria-label="Open menu"
            >
              <Menu size={16} />
            </button>
          )}
          <div className="min-w-0">
            <h2 className="text-[11px] font-black tracking-widest uppercase text-foreground truncate">
              AEREM CMS
            </h2>
            <span className="text-[7px] font-mono tracking-widest text-foreground/40 block truncate">
              {isEditing
                ? formData.id ? 'EDIT MODE' : 'CREATE MODE'
                : sidebarMode === 'categories'
                  ? 'CATEGORIES'
                  : 'PORTFOLIO'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setSidebarMode('categories');
              closeMobileSidebar();
            }}
            className={`p-2 border transition-all duration-200 cursor-pointer lg:hidden ${
              sidebarMode === 'categories'
                ? 'border-accent/40 text-accent bg-accent/5'
                : 'border-border/20 text-foreground/50 hover:border-accent/40 hover:text-accent'
            }`}
            title="Manage Categories"
          >
            <Tag size={14} />
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="p-2 border border-border/20 text-foreground hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-200 cursor-pointer"
            title="Create New Project"
          >
            <Plus size={16} />
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 border border-border/20 text-foreground/50 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
            title="Logout"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      {/* ── SIDEBAR PANEL ── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-[min(100vw,20rem)] lg:w-80 border-r border-border/10 flex flex-col bg-background lg:bg-black/20 select-none shrink-0 font-sans transform transition-transform duration-300 ease-out ${
          sidebarMode === 'categories' ? 'hidden lg:flex' : ''
        } ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 lg:p-6 border-b border-border/10 flex items-center justify-between">
          <div className="min-w-0">
            <h2 className="text-sm font-black tracking-widest uppercase text-foreground">
              AEREM CMS
            </h2>
            <span className="text-[8px] font-mono tracking-widest text-foreground/45">
              WORKSPACE MANAGEMENT v1.0
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                handleCreate();
                closeMobileSidebar();
              }}
              className="p-2 border border-border/20 text-foreground hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-200 cursor-pointer"
              title="Create New Project"
            >
              <Plus size={16} />
            </button>
            <button
              type="button"
              onClick={closeMobileSidebar}
              className="p-2 border border-border/20 text-foreground/50 hover:text-foreground lg:hidden transition-all duration-200 cursor-pointer"
              aria-label="Close menu"
            >
              <X size={14} />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="hidden lg:flex p-2 border border-border/20 text-foreground/50 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-border/10 flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-foreground/30" />
            <input
              type="text"
              placeholder="SEARCH PORTFOLIO..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-border/15 py-2 pl-9 pr-3 text-[10px] uppercase tracking-widest font-mono text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          
          {/* Quick Categories filter */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1 text-[8px] tracking-wider uppercase font-semibold">
            {['ALL', ...categories.map((c) => c.name)].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-1 shrink-0 border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'border-accent text-accent bg-accent/5 font-extrabold'
                    : 'border-border/10 text-foreground/40 hover:text-foreground hover:border-border/20'
                }`}
              >
                {cat.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 no-scrollbar">
          {filteredProjects.map((p) => {
            const isCurrent = formData.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => handleEdit(p)}
                className={`flex items-center gap-3 p-3 border transition-all duration-200 group cursor-pointer ${
                  isCurrent
                    ? 'border-accent/40 bg-accent/[0.03]'
                    : 'border-border/10 hover:border-border/20 hover:bg-black/10'
                }`}
              >
                {/* Micro Thumbnail */}
                <div className="relative w-10 h-10 border border-border/10 bg-border/5 shrink-0 overflow-hidden">
                  {p.thumbnail ? (
                    <Image src={p.thumbnail} alt={p.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300" sizes="40px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[7px] text-foreground/30 font-mono">
                      NULL
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex-grow min-w-0 flex flex-col">
                  <span className="truncate text-[10px] font-bold uppercase tracking-wider text-foreground/90 group-hover:text-foreground transition-colors">
                    {p.title}
                  </span>
                  <span className="text-[7.5px] font-mono uppercase tracking-widest text-foreground/40 mt-1">
                    {p.category} {'//'} {p.year || '2026'}
                  </span>
                </div>

                {/* Delete overlay — always visible on touch */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(p.id);
                  }}
                  className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity p-2 text-red-500 hover:text-red-400 cursor-pointer shrink-0"
                  title="Delete Project"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })}

          {filteredProjects.length === 0 && (
            <div className="text-center py-16 text-[9px] uppercase tracking-widest font-mono text-foreground/20">
              No matching projects
            </div>
          )}
        </div>

        {/* ── SIDEBAR BOTTOM NAV: switch between Projects / Categories ── */}
        <div className="border-t border-border/10 flex shrink-0">
          <button
            type="button"
            onClick={() => {
              setSidebarMode('projects');
              closeMobileSidebar();
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[8px] uppercase tracking-widest font-bold transition-all cursor-pointer ${
              sidebarMode === 'projects'
                ? 'text-accent border-t-2 border-accent -mt-px'
                : 'text-foreground/30 hover:text-foreground/60'
            }`}
          >
            <ImageIcon size={10} /> Projects
          </button>
          <button
            type="button"
            onClick={() => {
              setSidebarMode('categories');
              closeMobileSidebar();
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[8px] uppercase tracking-widest font-bold transition-all cursor-pointer ${
              sidebarMode === 'categories'
                ? 'text-accent border-t-2 border-accent -mt-px'
                : 'text-foreground/30 hover:text-foreground/60'
            }`}
          >
            <Tag size={10} /> Categories
          </button>
        </div>
      </aside>

      {/* ── CATEGORIES PANEL (replaces main when sidebarMode === categories) ── */}
      {sidebarMode === 'categories' && (
        <main className="flex-1 overflow-y-auto flex flex-col bg-black/5 font-sans min-h-0">
          <div className="max-w-xl mx-auto w-full p-4 sm:p-6 lg:p-10 flex flex-col gap-6 lg:gap-8">
            {/* Header — desktop only (mobile uses top bar) */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSidebarMode('projects')}
                className="p-2 border border-border/20 text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-all cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <div>
                <h1 className="text-sm font-black uppercase tracking-widest">CATEGORY MANAGER</h1>
                <p className="text-[9px] font-mono text-foreground/30 uppercase tracking-widest mt-0.5">
                  {categories.length} categories defined
                </p>
              </div>
            </div>

            {/* Mobile header info */}
            <div className="lg:hidden">
              <h1 className="text-sm font-black uppercase tracking-widest">CATEGORY MANAGER</h1>
              <p className="text-[9px] font-mono text-foreground/30 uppercase tracking-widest mt-0.5">
                {categories.length} categories defined
              </p>
            </div>

            {/* Add new category */}
            <div className="border border-border/15 p-4 sm:p-5 flex flex-col gap-3 bg-black/20">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-foreground/40">Add New Category</span>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                  placeholder="E.G. DESAIN POSTER"
                  className="flex-1 bg-black/40 border border-border/15 py-2 px-3 text-[10px] uppercase tracking-widest font-mono text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={catLoading || !newCatName.trim()}
                  className="px-4 py-2 bg-foreground text-background text-[9px] uppercase tracking-widest font-black hover:bg-accent hover:text-black transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:shrink-0"
                >
                  {catLoading ? <Loader2 size={10} className="animate-spin" /> : <Plus size={10} />}
                  Add
                </button>
              </div>
            </div>

            {/* Category list */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-foreground/40">Existing Categories</span>
              {categories.length === 0 && (
                <div className="py-12 text-center text-[9px] font-mono uppercase tracking-widest text-foreground/20">
                  No categories yet. Add one above.
                </div>
              )}
              {categories.map((cat, index) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-2 sm:gap-3 border border-border/10 px-3 sm:px-4 py-3 bg-black/10 hover:border-border/20 transition-all group"
                >
                  {/* Sort order badge */}
                  <span className="text-[9px] font-mono text-foreground/20 w-5 shrink-0">{index + 1}</span>

                  {editingCat?.id === cat.id ? (
                    // Inline edit mode
                    <>
                      <input
                        autoFocus
                        type="text"
                        value={editingCat.name}
                        onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdateCategory(cat.id, editingCat.name);
                          if (e.key === 'Escape') setEditingCat(null);
                        }}
                        className="flex-1 bg-black/60 border border-accent/40 py-1 px-2 text-[10px] uppercase tracking-widest font-mono text-foreground focus:outline-none"
                      />
                      <button
                        onClick={() => handleUpdateCategory(cat.id, editingCat.name)}
                        className="p-1.5 text-accent hover:text-black hover:bg-accent transition-all cursor-pointer"
                        title="Save"
                      >
                        <Check size={12} />
                      </button>
                      <button
                        onClick={() => setEditingCat(null)}
                        className="p-1.5 text-foreground/40 hover:text-foreground transition-all cursor-pointer"
                        title="Cancel"
                      >
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    // Display mode
                    <>
                      <span
                        className="flex-1 text-[10px] font-bold uppercase tracking-widest text-foreground/80 cursor-pointer hover:text-foreground transition-colors"
                        onClick={() => setEditingCat({ id: cat.id, name: cat.name })}
                        title="Click to edit"
                      >
                        {cat.name}
                      </span>
                      <span className="hidden sm:inline text-[8px] font-mono text-foreground/25 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity truncate max-w-[80px]">
                        {cat.slug}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingCat({ id: cat.id, name: cat.name })}
                        className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-1.5 text-foreground/40 hover:text-foreground transition-all cursor-pointer shrink-0"
                        title="Edit"
                      >
                        <Settings size={11} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-1.5 text-red-500/70 hover:text-red-400 transition-all cursor-pointer shrink-0"
                        title="Delete"
                      >
                        <Trash2 size={11} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ── MAIN WORKSPACE ── */}
      {sidebarMode === 'projects' && (
      <main className="flex-1 overflow-y-auto flex flex-col bg-black/5 font-sans min-h-0">
        {isEditing ? (
          <div className="flex flex-col h-full overflow-hidden">
            
            {/* Editor Top Navigation Bar */}
            <div className="px-4 sm:px-6 lg:px-10 py-4 lg:py-5 border-b border-border/10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between shrink-0 bg-background/50 backdrop-blur-sm relative z-20">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 min-w-0">
                <h1 className="text-xs sm:text-sm font-black uppercase tracking-widest truncate">
                  {formData.id ? `EDIT // ${formData.title.substring(0, 16)}` : 'CREATE NEW PROJECT'}
                </h1>
                
                {/* Tab Switchers */}
                <div className="flex items-center gap-1 border border-border/20 p-0.5 rounded-sm bg-black/40 w-fit">
                  <button
                    type="button"
                    onClick={() => setActiveTab('edit')}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold rounded-sm transition-all cursor-pointer ${
                      activeTab === 'edit'
                        ? 'bg-foreground text-background font-extrabold'
                        : 'text-foreground/50 hover:text-foreground'
                    }`}
                  >
                    <Settings size={10} /> Details Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold rounded-sm transition-all cursor-pointer ${
                      activeTab === 'preview'
                        ? 'bg-foreground text-background font-extrabold'
                        : 'text-foreground/50 hover:text-foreground'
                    }`}
                  >
                    <Eye size={10} /> Live Preview
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 sm:px-4 py-2 border border-border/20 text-[8px] sm:text-[9px] uppercase tracking-widest font-bold hover:border-foreground/35 hover:text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                
                {formData.id && (
                  <Link
                    href={`/portfolio/${formData.slug}`}
                    target="_blank"
                    className="flex items-center gap-1 px-3 sm:px-4 py-2 border border-accent/30 text-accent text-[8px] sm:text-[9px] uppercase tracking-widest font-bold hover:bg-accent/5 transition-all"
                  >
                    View Live <ExternalLink size={10} />
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-4 sm:px-5 py-2 bg-accent text-black text-[8px] sm:text-[9px] uppercase tracking-widest font-black hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer ml-auto sm:ml-0"
                >
                  {loading && <Loader2 size={10} className="animate-spin" />}
                  Save Changes
                </button>
              </div>
            </div>

            {/* Editor Workspace Content */}
            <div className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-10 no-scrollbar">
              {activeTab === 'edit' ? (
                /* ── TAB 1: FORM EDITOR ── */
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex flex-col gap-6 lg:gap-8 bg-background border border-border/10 p-4 sm:p-6 lg:p-10 shadow-2xl relative">
                  
                  {/* Basic Metadata Section */}
                  <div className="flex flex-col gap-6">
                    <h3 className="text-[10px] font-mono tracking-widest text-accent uppercase border-b border-border/10 pb-2 mb-2">
                      01 // GENERAL SPECIFICATIONS
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] uppercase tracking-[0.2em] text-foreground/40 font-mono">Project Title</label>
                        <input
                          required
                          type="text"
                          value={formData.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          className="px-3 py-2.5 bg-black/20 border border-border/15 font-bold uppercase tracking-wider text-xs focus:outline-none focus:border-accent text-foreground transition-colors"
                          placeholder="e.g. OBSIDIAN ARCHITECTURE"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] uppercase tracking-[0.2em] text-foreground/40 font-mono">Custom Slug (Auto-fills)</label>
                        <input
                          required
                          type="text"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          className="px-3 py-2.5 bg-black/20 border border-border/15 font-mono text-xs focus:outline-none focus:border-accent text-foreground transition-colors"
                          placeholder="e.g. obsidian-architecture"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] uppercase tracking-[0.2em] text-foreground/40 font-mono">Client Name</label>
                        <input
                          type="text"
                          value={formData.client}
                          onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                          className="px-3 py-2.5 bg-black/20 border border-border/15 font-bold uppercase tracking-wider text-xs focus:outline-none focus:border-accent text-foreground transition-colors"
                          placeholder="e.g. OBSIDIAN CORP"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-[9px] uppercase tracking-[0.2em] text-foreground/40 font-mono">Release Year</label>
                          <input
                            type="number"
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                            className="px-3 py-2.5 bg-black/20 border border-border/15 text-xs focus:outline-none focus:border-accent text-foreground transition-colors font-mono"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[9px] uppercase tracking-[0.2em] text-foreground/40 font-mono">Category Layer</label>
                          <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="px-3 py-2.5 bg-black border border-border/15 text-xs focus:outline-none focus:border-accent text-foreground transition-colors uppercase font-mono h-[38px] cursor-pointer"
                          >
                            <option value="" className="bg-background text-foreground/40 font-mono">-- Pilih Kategori --</option>
                            {categories.map((c) => (
                              <option key={c.id} value={c.name} className="bg-background text-foreground uppercase tracking-widest font-mono">
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-foreground/40 font-mono">Project Description</label>
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="px-4 py-3 bg-black/20 border border-border/15 text-xs focus:outline-none focus:border-accent text-foreground leading-relaxed transition-colors"
                        placeholder="Provide details about design principles, concepts, and materials used in the project..."
                      />
                    </div>
                  </div>

                  {/* Media System (Thumbnail & Showcase) */}
                  <div className="flex flex-col gap-6">
                    <h3 className="text-[10px] font-mono tracking-widest text-accent uppercase border-b border-border/10 pb-2 mb-2">
                      02 // DIGITAL MEDIA MANAGEMENT
                    </h3>

                    {/* Thumbnail system */}
                    <div className="flex flex-col gap-3">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-foreground/40 font-mono">
                        Archive Cover Image (Thumbnail)
                      </label>
                      
                      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 border border-border/15 p-4 bg-black/10">
                        <div className="relative w-full sm:w-28 aspect-square sm:aspect-auto sm:h-28 border border-border/20 bg-border/5 shrink-0 overflow-hidden mx-auto sm:mx-0">
                          {formData.thumbnail ? (
                            <Image src={formData.thumbnail} alt="Thumbnail Cover" fill className="object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-foreground/20 text-[8px] font-mono uppercase tracking-widest">
                              No Image
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col justify-center gap-3 w-full sm:h-28">
                          <p className="text-[9px] text-foreground/40 uppercase tracking-wider font-mono">
                            Recommended: 4:5 ratio. Auto-compressed to WebP (~900px) on upload.
                          </p>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                            onChange={handleThumbnailChange}
                            className="text-[10px] text-foreground/60 file:bg-border/20 file:border-none file:text-[9px] file:uppercase file:font-mono file:text-foreground file:px-3 file:py-1 file:cursor-pointer hover:file:bg-accent hover:file:text-black transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mockup arrays system */}
                    <div className="flex flex-col gap-3">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-foreground/40 font-mono">
                        Mockup Showcase Images (Max 4)
                      </label>

                      <div className="border border-border/15 p-4 sm:p-6 bg-black/10 flex flex-col gap-4">
                        
                        {/* Gallery grid of current mockups */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {formData.mockups.map((url, i) => (
                            <div
                              key={i}
                              className="relative aspect-square border border-border/20 bg-black/40 overflow-hidden group rounded-sm"
                            >
                              <Image src={url} alt={`Showcase Media ${i}`} fill className="object-cover" sizes="120px" />
                              <button
                                type="button"
                                onClick={() => handleRemoveMockup(i)}
                                className="absolute inset-0 bg-black/70 text-red-500 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer duration-200"
                                title="Remove Image"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ))}
                          
                          {formData.mockups.length === 0 && (
                            <div className="col-span-full py-10 flex flex-col items-center justify-center text-foreground/20 gap-2 border border-dashed border-border/20">
                              <ImageIcon size={24} className="opacity-40" />
                              <span className="text-[8px] font-mono uppercase tracking-widest">No mockup images</span>
                            </div>
                          )}
                        </div>

                        {/* File inputs */}
                        <div className="flex flex-col gap-2 pt-2 border-t border-border/10">
                          <span className="text-[8px] text-foreground/30 font-mono uppercase">
                            Upload visual assets (max 4). Auto-compressed to WebP (~1600px) on upload:
                          </span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                            multiple
                            onChange={handleMockupsChange}
                            className="text-[10px] text-foreground/60 file:bg-border/20 file:border-none file:text-[9px] file:uppercase file:font-mono file:text-foreground file:px-3 file:py-1 file:cursor-pointer hover:file:bg-accent hover:file:text-black transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </form>
              ) : (
                /* ── TAB 2: DYNAMIC LAYOUT PREVIEW SIMULATOR ── */
                <div className="max-w-7xl mx-auto flex flex-col gap-4 w-full">
                  {/* Browser simulated header */}
                  <div className="border border-border/20 bg-background flex items-center gap-2 px-3 sm:px-4 py-2 shrink-0 border-b-0 rounded-t-md select-none">
                    <div className="hidden sm:flex gap-1.5 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
                    </div>
                    <div className="flex-1 min-w-0 bg-black/40 border border-border/15 py-1 px-2 sm:px-4 text-center text-[8px] sm:text-[9px] font-mono tracking-wider text-foreground/40 rounded-sm truncate">
                      aerem.studio/portfolio/{formData.slug || 'untitled-project'}
                    </div>
                  </div>

                  {/* Browser simulated content view */}
                  <div className="border border-border/20 rounded-b-md overflow-hidden h-[55vh] sm:h-[65vh] lg:h-[75vh] overflow-y-auto no-scrollbar relative bg-background">
                    <ProjectDetailView
                      project={{
                        id: formData.id || 'preview-id',
                        title: formData.title || 'PREVIEW TITLE',
                        slug: formData.slug || 'preview-slug',
                        client: formData.client || 'PREVIEW CLIENT',
                        year: formData.year || 2026,
                        category: formData.category || 'BRANDING',
                        description: formData.description || 'Preview description will appear here.',
                        thumbnail: formData.thumbnail || '',
                        mockups: formData.mockups,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                      }}
                      nextProject={null}
                      hideNavbar={true}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Mobile: inline project catalog */}
            <div className="lg:hidden flex flex-col h-full min-h-0">
              <div className="p-4 border-b border-border/10 flex flex-col gap-3 shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-foreground/30" />
                  <input
                    type="text"
                    placeholder="SEARCH PORTFOLIO..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/40 border border-border/15 py-2 pl-9 pr-3 text-[10px] uppercase tracking-widest font-mono text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1 text-[8px] tracking-wider uppercase font-semibold">
                  {['ALL', ...categories.map((c) => c.name)].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2 py-1 shrink-0 border transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'border-accent text-accent bg-accent/5 font-extrabold'
                          : 'border-border/10 text-foreground/40 hover:text-foreground hover:border-border/20'
                      }`}
                    >
                      {cat.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 no-scrollbar">
                {filteredProjects.map((p) => {
                  const isCurrent = formData.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleEdit(p)}
                      className={`flex items-center gap-3 p-3 border transition-all duration-200 cursor-pointer ${
                        isCurrent
                          ? 'border-accent/40 bg-accent/[0.03]'
                          : 'border-border/10 hover:border-border/20 hover:bg-black/10'
                      }`}
                    >
                      <div className="relative w-12 h-12 border border-border/10 bg-border/5 shrink-0 overflow-hidden">
                        {p.thumbnail ? (
                          <Image src={p.thumbnail} alt={p.title} fill className="object-cover" sizes="48px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[7px] text-foreground/30 font-mono">NULL</div>
                        )}
                      </div>
                      <div className="flex-grow min-w-0 flex flex-col">
                        <span className="truncate text-[10px] font-bold uppercase tracking-wider text-foreground/90">{p.title}</span>
                        <span className="text-[7.5px] font-mono uppercase tracking-widest text-foreground/40 mt-1">
                          {p.category} {'//'} {p.year || '2026'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                        className="p-2 text-red-500 hover:text-red-400 cursor-pointer shrink-0"
                        title="Delete Project"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })}
                {filteredProjects.length === 0 && (
                  <div className="text-center py-16 text-[9px] uppercase tracking-widest font-mono text-foreground/20">
                    No matching projects
                  </div>
                )}
              </div>
              <div className="border-t border-border/10 p-4 shrink-0">
                <button
                  type="button"
                  onClick={handleCreate}
                  className="w-full bg-foreground text-background font-black py-2.5 px-6 text-[9px] uppercase tracking-[0.2em] hover:bg-accent hover:text-black transition-all duration-300 rounded-sm cursor-pointer"
                >
                  + New Project
                </button>
              </div>
            </div>

            {/* Desktop: idle workspace */}
            <div className="hidden lg:flex flex-col h-full items-center justify-center text-center gap-5 p-12">
              <div className="p-6 border border-border/10 bg-black/10 flex items-center justify-center">
                <ImageIcon size={48} className="opacity-15 text-foreground" />
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.25em] font-extrabold text-foreground/70 mb-1">
                  Workspace Idle
                </h3>
                <p className="text-[10px] text-foreground/30 uppercase tracking-widest max-w-xs leading-relaxed font-mono">
                  Select an existing project from the catalog sidebar or launch a new design workspace setup.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCreate}
                className="mt-2 bg-foreground text-background font-black py-2.5 px-6 text-[9px] uppercase tracking-[0.2em] hover:bg-accent hover:text-black transition-all duration-300 rounded-sm cursor-pointer"
              >
                Initialize Project Workspace
              </button>
            </div>
          </>
        )}
      </main>
      )}

      {/* ── SNACKBAR TOAST OVERLAY ── */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[9999] flex flex-col gap-2.5 max-w-full sm:max-w-[360px] pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="pointer-events-auto px-4 py-3 rounded-sm flex items-start gap-2.5 font-mono text-[9px] sm:text-[10px] tracking-widest uppercase font-bold border animate-[snackSlideIn_0.25s_ease]"
            style={{
              backgroundColor:
                n.type === 'success' ? '#0d1a00' :
                n.type === 'error'   ? '#1a0000' :
                n.type === 'warning' ? '#1a1100' : '#0a0a0a',
              borderColor:
                n.type === 'success' ? '#CCFF00' :
                n.type === 'error'   ? '#ff4444' :
                n.type === 'warning' ? '#ffbb00' : '#444',
              color:
                n.type === 'success' ? '#CCFF00' :
                n.type === 'error'   ? '#ff4444' :
                n.type === 'warning' ? '#ffbb00' : '#ffffff',
            }}
          >
            <span className="text-sm leading-none shrink-0">
              {n.type === 'success' ? '✓' : n.type === 'error' ? '✕' : n.type === 'warning' ? '!' : 'i'}
            </span>
            <span className="leading-relaxed break-words">{n.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
