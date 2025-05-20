// Dados de usuários de exemplo
        const usersData = [
            { 
                id: 1, 
                name: "Admin", 
                email: "admin@simoldes.com", 
                role: "Administrador", 
                permissions: ["all"],
                lastLogin: "2025-05-15 09:30"
            },
            { 
                id: 2, 
                name: "João Silva", 
                email: "joao@simoldes.com", 
                role: "Gerente", 
                permissions: ["view_production", "view_finished", "view_stock", "edit_production"],
                lastLogin: "2025-05-14 14:15"
            },
            { 
                id: 3, 
                name: "Maria Santos", 
                email: "maria@simoldes.com", 
                role: "Operador", 
                permissions: ["view_production", "view_stock"],
                lastLogin: "2025-05-15 08:45"
            }
        ];

        // Lista de permissões disponíveis
        const availablePermissions = [
            { id: "view_production", name: "Ver produção" },
            { id: "edit_production", name: "Editar produção" },
            { id: "delete_production", name: "Excluir produção" },
            { id: "view_finished", name: "Ver finalizados" },
            { id: "edit_finished", name: "Editar finalizados" },
            { id: "delete_finished", name: "Excluir finalizados" },
            { id: "view_stock", name: "Ver estoque" },
            { id: "edit_stock", name: "Editar estoque" },
            { id: "delete_stock", name: "Excluir estoque" },
            { id: "manage_users", name: "Gerenciar usuários" },
            { id: "view_settings", name: "Ver configurações" },
            { id: "edit_settings", name: "Editar configurações" }
        ];

// Função para mostrar as configurações
        function showSettings() {
            const container = document.getElementById('table-container');
            container.classList.remove('initial-state');
            
            container.innerHTML = `
                <div class="settings-container">
                    <h2>Configurações do Sistema</h2>
                    
                    <div class="settings-tabs">
                        <div class="settings-tab active" onclick="switchSettingsTab('users')">
                            <i class="fas fa-users"></i> Gestão de Usuários
                        </div>
                        <div class="settings-tab" onclick="switchSettingsTab('system')">
                            <i class="fas fa-cog"></i> Configurações do Sistema
                        </div>
                        <div class="settings-tab" onclick="switchSettingsTab('logs')">
                            <i class="fas fa-clipboard-list"></i> Logs de Atividade
                        </div>
                    </div>
                    
                    <div id="users-settings" class="settings-content active">
                        ${renderUserManagement()}
                    </div>
                    
                    <div id="system-settings" class="settings-content">
                        <h3>Configurações do Sistema</h3>
                        <p>Aqui você pode configurar as preferências do sistema.</p>
                        <!-- Adicione mais configurações do sistema conforme necessário -->
                    </div>
                    
                    <div id="logs-settings" class="settings-content">
                        <h3>Logs de Atividade</h3>
                        <p>Registro de atividades do sistema.</p>
                        <!-- Adicione a tabela de logs conforme necessário -->
                    </div>
                </div>
            `;
        }

        // Função para alternar entre as abas de configurações
        function switchSettingsTab(tabId) {
            // Desativa todas as abas e conteúdos
            document.querySelectorAll('.settings-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelectorAll('.settings-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Ativa a aba e conteúdo selecionados
            document.querySelector(`.settings-tab[onclick="switchSettingsTab('${tabId}')]`).classList.add('active');
            document.getElementById(`${tabId}-settings`).classList.add('active');
        }

        // Função para renderizar a gestão de usuários
        function renderUserManagement(editUserId = null) {
            let html = `
                <div class="user-management">
                    <h3>Gestão de Usuários</h3>
                    <button class="add-btn" onclick="showUserForm()">
                        <i class="fas fa-plus"></i> Adicionar Usuário
                    </button>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Cargo</th>
                                <th>Último Login</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            usersData.forEach(user => {
                html += `
                    <tr>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>${user.lastLogin}</td>
                        <td>
                            <button class="action-btn edit-btn" onclick="showUserForm(${user.id})">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="action-btn delete-btn" onclick="deleteUser(${user.id})">
                                <i class="fas fa-trash"></i> Excluir
                            </button>
                        </td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>
            `;
            
            // Se estiver editando, mostra o formulário
            if (editUserId) {
                const user = usersData.find(u => u.id === editUserId);
                if (user) {
                    html += renderUserForm(user);
                }
            }
            
            return html;
        }

        // Função para renderizar o formulário de usuário
        function renderUserForm(user = null) {
            const isEdit = user !== null;
            currentEditingUserId = isEdit ? user.id : null;
            
            let html = `
                <div class="user-form">
                    <h3>${isEdit ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h3>
                    <form id="user-form" onsubmit="saveUser(event)">
                        <input type="hidden" id="user-id" value="${isEdit ? user.id : ''}">
                        
                        <div class="form-group">
                            <label for="user-name">Nome:</label>
                            <input type="text" id="user-name" value="${isEdit ? user.name : ''}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="user-email">Email:</label>
                            <input type="email" id="user-email" value="${isEdit ? user.email : ''}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="user-role">Cargo:</label>
                            <select id="user-role" required>
                                <option value="">Selecione um cargo</option>
                                <option value="Administrador" ${isEdit && user.role === 'Administrador' ? 'selected' : ''}>Administrador</option>
                                <option value="Gerente" ${isEdit && user.role === 'Gerente' ? 'selected' : ''}>Gerente</option>
                                <option value="Operador" ${isEdit && user.role === 'Operador' ? 'selected' : ''}>Operador</option>
                                <option value="Customizado" ${isEdit && !['Administrador', 'Gerente', 'Operador'].includes(user.role) ? 'selected' : ''}>Customizado</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Permissões:</label>
                            <div class="permissions-container">
            `;
            
            availablePermissions.forEach(permission => {
                const isChecked = isEdit ? 
                    (user.permissions.includes("all") || user.permissions.includes(permission.id)) : 
                    false;
                
                html += `
                    <div class="permission-item">
                        <input type="checkbox" id="perm-${permission.id}" class="permission-checkbox" 
                               value="${permission.id}" ${isChecked ? 'checked' : ''}>
                        <label for="perm-${permission.id}">${permission.name}</label>
                    </div>
                `;
            });
            
            html += `
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="action-btn" onclick="cancelEdit()">Cancelar</button>
                            <button type="submit" class="action-btn edit-btn">Salvar</button>
                        </div>
                    </form>
                </div>
            `;
            
            return html;
        }

        // Função para mostrar o formulário de usuário
        function showUserForm(userId = null) {
            const container = document.querySelector('#users-settings');
            if (userId) {
                const user = usersData.find(u => u.id === userId);
                if (user) {
                    container.innerHTML = renderUserManagement(userId);
                }
            } else {
                container.innerHTML = renderUserManagement() + renderUserForm();
            }
        }

        // Função para salvar o usuário
        function saveUser(event) {
            event.preventDefault();
            
            // Coletar dados do formulário
            const id = currentEditingUserId || Math.max(...usersData.map(u => u.id)) + 1;
            const name = document.getElementById('user-name').value;
            const email = document.getElementById('user-email').value;
            const role = document.getElementById('user-role').value;
            
            // Coletar permissões selecionadas
            const permissions = [];
            document.querySelectorAll('.permission-checkbox:checked').forEach(checkbox => {
                permissions.push(checkbox.value);
            });
            
            // Se for administrador, adiciona todas as permissões
            if (role === 'Administrador') {
                permissions.push('all');
            }
            
            // Criar/atualizar usuário
            const userData = {
                id,
                name,
                email,
                role,
                permissions,
                lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16)
            };
            
            if (currentEditingUserId) {
                // Atualizar usuário existente
                const index = usersData.findIndex(u => u.id === currentEditingUserId);
                if (index !== -1) {
                    usersData[index] = userData;
                }
            } else {
                // Adicionar novo usuário
                usersData.push(userData);
            }
            
            // Atualizar a interface
            document.querySelector('#users-settings').innerHTML = renderUserManagement();
            
            // Resetar variável de edição
            currentEditingUserId = null;
            
            // Aqui você normalmente faria uma chamada AJAX para salvar no servidor
            console.log('Usuário salvo:', userData);
        }

        // Função para cancelar a edição
        function cancelEdit() {
            document.querySelector('#users-settings').innerHTML = renderUserManagement();
            currentEditingUserId = null;
        }

        // Função para excluir usuário
        function deleteUser(userId) {
            if (confirm('Tem certeza que deseja excluir este usuário?')) {
                const index = usersData.findIndex(u => u.id === userId);
                if (index !== -1) {
                    usersData.splice(index, 1);
                    document.querySelector('#users-settings').innerHTML = renderUserManagement();
                    
                    // Aqui você normalmente faria uma chamada AJAX para excluir no servidor
                    console.log('Usuário excluído:', userId);
                }
            }
        }
