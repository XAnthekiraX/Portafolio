import { supabaseAdmin } from "../config/supabase.js";

export const projectService = {
  async getPublic() {
    const { data: result, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("status", "published")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return Promise.all((result ?? []).map((p) => this.enrich(p)));
  },

  async getAll() {
    const { data: result, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return Promise.all((result ?? []).map((p) => this.enrich(p)));
  },

  async getById(id: string) {
    const { data: project, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", id)
      .limit(1)
      .single();

    if (error || !project) return null;
    return this.enrich(project);
  },

  async create(data: Record<string, unknown>) {
    const dbData: Record<string, unknown> = {};
    if (data.title !== undefined) dbData.title = data.title;
    if (data.description !== undefined) dbData.description = data.description;
    if (data.category !== undefined) dbData.category = data.category;
    if (data.imageUrl !== undefined) { dbData.image_url = data.imageUrl; }
    if (data.features !== undefined) dbData.features = data.features;
    if (data.repoUrl !== undefined) { dbData.repo_url = data.repoUrl; }
    if (data.demoUrl !== undefined) { dbData.demo_url = data.demoUrl; }
    if (data.url !== undefined) dbData.url = data.url;
    if (data.repository !== undefined) dbData.repository = data.repository;
    if (data.status !== undefined) dbData.status = data.status;
    if (data.visits !== undefined) dbData.visits = data.visits;
    if (data.displayOrder !== undefined) { dbData.display_order = data.displayOrder; }

    const { data: created, error } = await supabaseAdmin
      .from("projects")
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return this.enrich(created);
  },

  async update(id: string, data: Record<string, unknown>) {
    const dbData: Record<string, unknown> = {};
    if (data.title !== undefined) dbData.title = data.title;
    if (data.description !== undefined) dbData.description = data.description;
    if (data.category !== undefined) dbData.category = data.category;
    if (data.imageUrl !== undefined) dbData.image_url = data.imageUrl;
    if (data.features !== undefined) dbData.features = data.features;
    if (data.repoUrl !== undefined) dbData.repo_url = data.repoUrl;
    if (data.demoUrl !== undefined) dbData.demo_url = data.demoUrl;
    if (data.url !== undefined) dbData.url = data.url;
    if (data.repository !== undefined) dbData.repository = data.repository;
    if (data.status !== undefined) dbData.status = data.status;
    if (data.visits !== undefined) dbData.visits = data.visits;
    if (data.displayOrder !== undefined) dbData.display_order = data.displayOrder;
    dbData.updated_at = new Date().toISOString();

    const { data: updated, error } = await supabaseAdmin
      .from("projects")
      .update(dbData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return this.enrich(updated);
  },

  async remove(id: string) {
    const { error } = await supabaseAdmin.from("projects").delete().eq("id", id);
    if (error) throw error;
  },

  async incrementVisits(id: string) {
    const { error } = await supabaseAdmin.rpc("increment_visits", { project_id: id });
    if (error) {
      const { data: project } = await supabaseAdmin
        .from("projects")
        .select("visits")
        .eq("id", id)
        .single();
      if (project) {
        await supabaseAdmin
          .from("projects")
          .update({ visits: (project.visits ?? 0) + 1 })
          .eq("id", id);
      }
    }
  },

  async replaceTechnologies(projectId: string, techIds: string[]) {
    const { error: delError } = await supabaseAdmin
      .from("project_technologies")
      .delete()
      .eq("project_id", projectId);

    if (delError) throw delError;

    if (techIds.length === 0) return [];

    const values = techIds.map((technologyId) => ({
      project_id: projectId,
      technology_id: technologyId,
    }));

    const { data: inserted, error: insError } = await supabaseAdmin
      .from("project_technologies")
      .insert(values)
      .select();

    if (insError) throw insError;
    return inserted;
  },

  async enrich(project: Record<string, unknown>) {
    const { data: techRows } = await supabaseAdmin
      .from("project_technologies")
      .select("technologies(id, name, icon)")
      .eq("project_id", project.id);

    const technologies = (techRows ?? [])
      .map((row: Record<string, unknown>) => row.technologies)
      .filter(Boolean);

    return {
      id: project.id,
      title: project.title,
      description: project.description,
      category: project.category,
      imageUrl: project.image_url,
      features: (project.features as string[]) ?? [],
      repoUrl: project.repo_url,
      demoUrl: project.demo_url,
      url: project.url,
      repository: project.repository,
      status: project.status,
      visits: project.visits,
      displayOrder: project.display_order,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
      technologies,
    };
  },
};
