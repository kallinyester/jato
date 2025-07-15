const API_URL = import.meta.env.VITE_API_URL;

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username: email, password })
  });
  if (!res.ok) throw new Error('Login inválido');
  return res.json();
}

export async function register({ name, email, password }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  if (!res.ok) throw new Error('Erro ao registrar');
  return res.json();
}

export async function fetchProjects(token, filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  const res = await fetch(`${API_URL}/projects/?${params.toString()}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Erro ao buscar projetos');
  return res.json();
}

export async function createProject(token, project) {
  const res = await fetch(`${API_URL}/projects/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(project)
  });
  if (!res.ok) throw new Error('Erro ao criar projeto');
  return res.json();
}

export async function updateProject(token, projectId, updates) {
  const res = await fetch(`${API_URL}/projects/${projectId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Erro ao atualizar projeto');
  return res.json();
}

export async function deleteProject(token, projectId) {
  const res = await fetch(`${API_URL}/projects/${projectId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Erro ao excluir projeto');
  return res.json();
}

export async function fetchDashboardMetrics(token) {
  const res = await fetch(`${API_URL}/dashboard/metrics`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Erro ao buscar métricas');
  return res.json();
}

export async function fetchDashboardAlerts(token) {
  const res = await fetch(`${API_URL}/dashboard/alerts`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Erro ao buscar alertas');
  return res.json();
} 