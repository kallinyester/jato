import React, { useState, useEffect } from 'react';

const JatoHubDashboard = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'E-commerce Premium',
      client: 'TechCorp Solutions',
      languages: ['React', 'Node.js', 'PostgreSQL'],
      stage: 'desenvolvimento',
      progress: 65,
      startDate: '2024-01-15',
      deadline: '2024-03-30',
      priority: 'alta',
      description: 'Plataforma de e-commerce com sistema de pagamentos integrado'
    },
    {
      id: 2,
      name: 'App Mobile Delivery',
      client: 'FoodFast Ltda',
      languages: ['React Native', 'Firebase', 'Express.js'],
      stage: 'testes',
      progress: 85,
      startDate: '2023-12-01',
      deadline: '2024-02-15',
      priority: 'alta',
      description: 'Aplicativo de delivery com geolocalização e pagamento online'
    },
    {
      id: 3,
      name: 'Sistema CRM',
      client: 'VendaMais Corp',
      languages: ['Vue.js', 'Python', 'MySQL'],
      stage: 'planejamento',
      progress: 15,
      startDate: '2024-02-01',
      deadline: '2024-05-30',
      priority: 'media',
      description: 'Sistema completo de gestão de relacionamento com clientes'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState('todos');
  const [editingProject, setEditingProject] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const stages = [
    { value: 'planejamento', label: 'Planejamento', color: 'bg-blue-500' },
    { value: 'desenvolvimento', label: 'Desenvolvimento', color: 'bg-yellow-500' },
    { value: 'testes', label: 'Testes', color: 'bg-purple-500' },
    { value: 'homologacao', label: 'Homologação', color: 'bg-orange-500' },
    { value: 'producao', label: 'Produção', color: 'bg-green-500' },
    { value: 'manutencao', label: 'Manutenção', color: 'bg-gray-500' }
  ];

  const priorities = [
    { value: 'baixa', label: 'Baixa', color: 'text-green-600' },
    { value: 'media', label: 'Média', color: 'text-yellow-600' },
    { value: 'alta', label: 'Alta', color: 'text-red-600' }
  ];

  const languageOptions = [
    'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 
    'C#', 'PHP', 'Ruby', 'Go', 'React Native', 'Flutter',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'Express.js'
  ];

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'todos' || project.stage === filter;
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const addProject = (newProject) => {
    const project = {
      ...newProject,
      id: Date.now(),
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProjects([...projects, project]);
    setShowAddForm(false);
    addNotification('Projeto criado com sucesso!', 'success');
  };

  const updateProject = (projectId, updates) => {
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    ));
    addNotification('Projeto atualizado com sucesso!', 'success');
  };

  const deleteProject = (projectId) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.')) {
      setProjects(projects.filter(p => p.id !== projectId));
      setSelectedProject(null);
      setEditingProject(null);
      addNotification('Projeto excluído com sucesso!', 'success');
    }
  };

  const duplicateProject = (project) => {
    const duplicatedProject = {
      ...project,
      id: Date.now(),
      name: `${project.name} (Cópia)`,
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProjects([...projects, duplicatedProject]);
    addNotification('Projeto duplicado com sucesso!', 'success');
  };

  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const getProjectStats = () => {
    const totalProgress = projects.reduce((sum, p) => sum + p.progress, 0);
    const overdue = projects.filter(p => new Date(p.deadline) < new Date() && p.stage !== 'producao').length;
    const completedThisMonth = projects.filter(p => {
      const updatedDate = new Date(p.updatedAt || p.createdAt);
      const now = new Date();
      return updatedDate.getMonth() === now.getMonth() && 
             updatedDate.getFullYear() === now.getFullYear() &&
             p.stage === 'producao';
    }).length;
    
    return {
      avgProgress: projects.length > 0 ? Math.round(totalProgress / projects.length) : 0,
      overdue,
      completedThisMonth
    };
  };

  const stats = getProjectStats();

  useEffect(() => {
    const checkDeadlines = () => {
      const today = new Date();
      const warning = projects.filter(p => {
        const deadline = new Date(p.deadline);
        const diffTime = deadline - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays > 0 && p.stage !== 'producao';
      });
      // Só notifica se não houver notificação igual ativa
      const alreadyWarned = notifications.some(n => n.type === 'warning' && n.message.includes('prazo próximo'));
      if (warning.length > 0 && !alreadyWarned) {
        addNotification(`${warning.length} projeto(s) com prazo próximo!`, 'warning');
      }
    };
    checkDeadlines();
  }, [projects, notifications]);

  const getStageInfo = (stage) => {
    return stages.find(s => s.value === stage) || stages[0];
  };

  const getPriorityInfo = (priority) => {
    return priorities.find(p => p.value === priority) || priorities[1];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`px-4 py-3 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'warning' ? 'bg-yellow-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{notification.message}</span>
              <button
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                className="ml-2 text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Jato Hub</h1>
            <p className="text-gray-600">Dashboard de Controle de Desenvolvimento</p>
            <p className="text-sm text-gray-500 mt-1">
              {projects.length} projetos • {stats.overdue} atrasados • {stats.completedThisMonth} finalizados este mês
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo Projeto
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total de Projetos</h3>
          <p className="text-3xl font-bold text-blue-600">{projects.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700">Em Desenvolvimento</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {projects.filter(p => p.stage === 'desenvolvimento').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700">Em Produção</h3>
          <p className="text-3xl font-bold text-green-600">
            {projects.filter(p => p.stage === 'producao').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700">Progresso Médio</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.avgProgress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${stats.avgProgress}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700">Projetos Atrasados</h3>
          <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
          {stats.overdue > 0 && (
            <p className="text-sm text-red-500 mt-1">Atenção necessária</p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('todos')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'todos' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todos
          </button>
          {stages.map(stage => (
            <button
              key={stage.value}
              onClick={() => setFilter(stage.value)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === stage.value ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map(project => {
          const stageInfo = getStageInfo(project.stage);
          const priorityInfo = getPriorityInfo(project.priority);
          
          return (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
                <div className="flex items-center gap-2">
                  {new Date(project.deadline) < new Date() && project.stage !== 'producao' && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                      Atrasado
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded text-sm font-medium ${priorityInfo.color}`}>
                    {priorityInfo.label}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-3">{project.client}</p>
              <p className="text-sm text-gray-500 mb-4">{project.description}</p>
              
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-3 h-3 rounded-full ${stageInfo.color}`}></span>
                <span className="text-sm font-medium">{stageInfo.label}</span>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progresso</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {project.languages.slice(0, 3).map(lang => (
                  <span key={lang} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {lang}
                  </span>
                ))}
                {project.languages.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    +{project.languages.length - 3}
                  </span>
                )}
              </div>
              
              <div className="text-sm text-gray-500">
                <p>Prazo: {new Date(project.deadline).toLocaleDateString('pt-BR')}</p>
              </div>
              
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingProject(project);
                  }}
                  className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateProject(project);
                  }}
                  className="flex-1 px-3 py-2 bg-gray-50 text-gray-600 rounded text-sm hover:bg-gray-100 transition-colors"
                >
                  Duplicar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* No projects message */}
      {filteredProjects.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {searchTerm ? 'Nenhum projeto encontrado' : 'Nenhum projeto nesta categoria'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? `Não foi possível encontrar projetos com "${searchTerm}"`
              : 'Comece criando seu primeiro projeto'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar Primeiro Projeto
            </button>
          )}
        </div>
      )}

      {/* Add Project Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Novo Projeto</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const selectedLanguages = Array.from(e.target.querySelectorAll('input[name="languages"]:checked'))
                .map(input => input.value);
              
              addProject({
                name: formData.get('name'),
                client: formData.get('client'),
                description: formData.get('description'),
                languages: selectedLanguages,
                stage: formData.get('stage'),
                priority: formData.get('priority'),
                startDate: formData.get('startDate'),
                deadline: formData.get('deadline')
              });
            }}>
              <div className="space-y-4">
                <input
                  name="name"
                  placeholder="Nome do Projeto"
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <input
                  name="client"
                  placeholder="Cliente"
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Descrição do projeto"
                  className="w-full p-3 border rounded-lg h-20"
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium mb-2">Linguagens/Tecnologias:</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {languageOptions.map(lang => (
                      <label key={lang} className="flex items-center space-x-2">
                        <input type="checkbox" name="languages" value={lang} />
                        <span className="text-sm">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <select name="stage" className="w-full p-3 border rounded-lg" required>
                  {stages.map(stage => (
                    <option key={stage.value} value={stage.value}>{stage.label}</option>
                  ))}
                </select>
                
                <select name="priority" className="w-full p-3 border rounded-lg" required>
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
                
                <input
                  name="startDate"
                  type="date"
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <input
                  name="deadline"
                  type="date"
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Criar Projeto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Editar Projeto</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const selectedLanguages = Array.from(e.target.querySelectorAll('input[name="languages"]:checked'))
                .map(input => input.value);
              
              updateProject(editingProject.id, {
                name: formData.get('name'),
                client: formData.get('client'),
                description: formData.get('description'),
                languages: selectedLanguages,
                stage: formData.get('stage'),
                priority: formData.get('priority'),
                startDate: formData.get('startDate'),
                deadline: formData.get('deadline'),
                progress: parseInt(formData.get('progress'))
              });
              setEditingProject(null);
            }}>
              <div className="space-y-4">
                <input
                  name="name"
                  placeholder="Nome do Projeto"
                  defaultValue={editingProject.name}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <input
                  name="client"
                  placeholder="Cliente"
                  defaultValue={editingProject.client}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Descrição do projeto"
                  defaultValue={editingProject.description}
                  className="w-full p-3 border rounded-lg h-20"
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium mb-2">Progresso:</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      name="progress"
                      min="0"
                      max="100"
                      defaultValue={editingProject.progress}
                      className="flex-1"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={editingProject.progress}
                      className="w-20 p-2 border rounded"
                    />
                    <span>%</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Linguagens/Tecnologias:</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {languageOptions.map(lang => (
                      <label key={lang} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          name="languages" 
                          value={lang}
                          defaultChecked={editingProject.languages.includes(lang)}
                        />
                        <span className="text-sm">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <select name="stage" defaultValue={editingProject.stage} className="w-full p-3 border rounded-lg" required>
                  {stages.map(stage => (
                    <option key={stage.value} value={stage.value}>{stage.label}</option>
                  ))}
                </select>
                
                <select name="priority" defaultValue={editingProject.priority} className="w-full p-3 border rounded-lg" required>
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
                
                <input
                  name="startDate"
                  type="date"
                  defaultValue={editingProject.startDate}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <input
                  name="deadline"
                  type="date"
                  defaultValue={editingProject.deadline}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Cliente:</h3>
                <p>{selectedProject.client}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Descrição:</h3>
                <p>{selectedProject.description}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Progresso:</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full"
                        style={{ width: `${selectedProject.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={selectedProject.progress}
                    onChange={(e) => updateProject(selectedProject.id, { progress: parseInt(e.target.value) })}
                    className="w-20 p-2 border rounded"
                  />
                  <span>%</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Estágio:</h3>
                <select
                  value={selectedProject.stage}
                  onChange={(e) => updateProject(selectedProject.id, { stage: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                >
                  {stages.map(stage => (
                    <option key={stage.value} value={stage.value}>{stage.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Linguagens/Tecnologias:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.languages.map(lang => (
                    <span key={lang} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Data de Início:</h3>
                  <p>{new Date(selectedProject.startDate).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Prazo:</h3>
                  <p>{new Date(selectedProject.deadline).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setEditingProject(selectedProject);
                    setSelectedProject(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Editar Projeto
                </button>
                <button
                  onClick={() => {
                    duplicateProject(selectedProject);
                    setSelectedProject(null);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Duplicar
                </button>
                <button
                  onClick={() => deleteProject(selectedProject.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Excluir
                </button>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JatoHubDashboard;