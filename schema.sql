-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    age INTEGER,
    status VARCHAR(50),
    role VARCHAR(50) NOT NULL,
    position VARCHAR(100),
    phone_number VARCHAR(20),
    profile_picture_url VARCHAR(255),
    theme_preference VARCHAR(20) DEFAULT 'light',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modifier la table users pour ajouter des champs importants
ALTER TABLE users ADD COLUMN department VARCHAR(100);
ALTER TABLE users ADD COLUMN hire_date DATE;
ALTER TABLE users ADD COLUMN last_login_date TIMESTAMP;
ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN emergency_contact JSON;
ALTER TABLE users ADD COLUMN skills TEXT[];

-- Ajouter des colonnes supplémentaires à la table users
ALTER TABLE users ADD COLUMN address JSON;
ALTER TABLE users ADD COLUMN preferences JSON;
ALTER TABLE users ADD COLUMN working_hours JSON;
ALTER TABLE users ADD COLUMN vacation_days INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN social_links JSON;

-- Améliorer la table des utilisateurs avec des informations supplémentaires
ALTER TABLE users ADD COLUMN bank_details JSON;
ALTER TABLE users ADD COLUMN documents JSON;
ALTER TABLE users ADD COLUMN security_clearance VARCHAR(50);
ALTER TABLE users ADD COLUMN workspace_settings JSON;
ALTER TABLE users ADD COLUMN notification_preferences JSON;

-- Ajouter une table pour les départements
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    manager_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les équipes
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    team_leader_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les membres d'équipe
CREATE TABLE team_members (
    team_id INTEGER REFERENCES teams(id),
    user_id INTEGER REFERENCES users(id),
    role VARCHAR(50),
    joined_date DATE,
    PRIMARY KEY (team_id, user_id)
);

-- Ajouter une table pour les réunions
CREATE TABLE meetings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    meeting_date TIMESTAMP NOT NULL,
    duration INTEGER, -- en minutes
    location VARCHAR(255),
    meeting_type VARCHAR(50),
    organizer_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les participants aux réunions
CREATE TABLE meeting_participants (
    meeting_id INTEGER REFERENCES meetings(id),
    user_id INTEGER REFERENCES users(id),
    status VARCHAR(20), -- accepted, declined, pending
    PRIMARY KEY (meeting_id, user_id)
);

-- Ajouter une table pour les compétences
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    description TEXT
);

-- Ajouter une table pour les compétences des utilisateurs
CREATE TABLE user_skills (
    user_id INTEGER REFERENCES users(id),
    skill_id INTEGER REFERENCES skills(id),
    level INTEGER CHECK (level BETWEEN 1 AND 5),
    verified BOOLEAN DEFAULT false,
    PRIMARY KEY (user_id, skill_id)
);

-- Ajouter une table pour les ressources
CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    status VARCHAR(50),
    location VARCHAR(255),
    description TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les réservations de ressources
CREATE TABLE resource_bookings (
    id SERIAL PRIMARY KEY,
    resource_id INTEGER REFERENCES resources(id),
    user_id INTEGER REFERENCES users(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    purpose TEXT,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User History Table
CREATE TABLE user_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action_type VARCHAR(50),
    action_description TEXT,
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Favorites Table
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    item_type VARCHAR(50),
    item_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50),
    start_date DATE,
    end_date DATE,
    priority VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modifier la table projects pour ajouter des champs importants
ALTER TABLE projects ADD COLUMN budget DECIMAL(15,2);
ALTER TABLE projects ADD COLUMN department_id INTEGER REFERENCES departments(id);
ALTER TABLE projects ADD COLUMN project_manager_id INTEGER REFERENCES users(id);
ALTER TABLE projects ADD COLUMN completion_percentage INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN milestones JSON;

-- Améliorer la table des projets avec des champs de suivi
ALTER TABLE projects ADD COLUMN quality_metrics JSON;
ALTER TABLE projects ADD COLUMN change_history JSON;
ALTER TABLE projects ADD COLUMN lessons_learned TEXT;
ALTER TABLE projects ADD COLUMN compliance_requirements TEXT[];

-- Tasks Table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50),
    priority VARCHAR(20),
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modifier la table tasks pour ajouter des champs importants
ALTER TABLE tasks ADD COLUMN estimated_hours DECIMAL(5,2);
ALTER TABLE tasks ADD COLUMN actual_hours DECIMAL(5,2);
ALTER TABLE tasks ADD COLUMN parent_task_id INTEGER REFERENCES tasks(id);
ALTER TABLE tasks ADD COLUMN dependencies INTEGER[];

-- Ajouter des colonnes à la table tasks
ALTER TABLE tasks ADD COLUMN checklist JSON;
ALTER TABLE tasks ADD COLUMN recurring_pattern VARCHAR(100);
ALTER TABLE tasks ADD COLUMN labels TEXT[];

-- User Projects Table (Many-to-Many)
CREATE TABLE user_projects (
    user_id INTEGER REFERENCES users(id),
    project_id INTEGER REFERENCES projects(id),
    role VARCHAR(50),
    PRIMARY KEY (user_id, project_id)
);

-- User Tasks Table (Many-to-Many)
CREATE TABLE user_tasks (
    user_id INTEGER REFERENCES users(id),
    task_id INTEGER REFERENCES tasks(id),
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, task_id)
);

-- Comments Table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    item_type VARCHAR(50),
    item_id INTEGER,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255),
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents Table
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    size INTEGER,
    uploaded_by INTEGER REFERENCES users(id),
    project_id INTEGER REFERENCES projects(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags Table
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(7)
);

-- Item Tags Table (Many-to-Many)
CREATE TABLE item_tags (
    tag_id INTEGER REFERENCES tags(id),
    item_type VARCHAR(50),
    item_id INTEGER,
    PRIMARY KEY (tag_id, item_type, item_id)
);

-- Ajouter une table pour les rapports
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    report_type VARCHAR(50),
    parameters JSON,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    report_data JSON,
    schedule VARCHAR(50)
);

-- Ajouter une table pour les logs système
CREATE TABLE system_logs (
    id SERIAL PRIMARY KEY,
    log_type VARCHAR(50),
    log_level VARCHAR(20),
    message TEXT,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les absences/congés
CREATE TABLE leaves (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    leave_type VARCHAR(50),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20),
    reason TEXT,
    approved_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour le suivi du temps
CREATE TABLE time_tracking (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    task_id INTEGER REFERENCES tasks(id),
    project_id INTEGER REFERENCES projects(id),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les événements
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    location VARCHAR(255),
    organizer_id INTEGER REFERENCES users(id),
    is_public BOOLEAN DEFAULT true,
    max_participants INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les dépenses
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    user_id INTEGER REFERENCES users(id),
    amount DECIMAL(15,2),
    expense_date DATE,
    category VARCHAR(50),
    description TEXT,
    status VARCHAR(20),
    receipt_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les objectifs
CREATE TABLE objectives (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255),
    description TEXT,
    target_date DATE,
    status VARCHAR(50),
    priority VARCHAR(20),
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les formations
CREATE TABLE trainings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    trainer_id INTEGER REFERENCES users(id),
    start_date DATE,
    end_date DATE,
    max_participants INTEGER,
    status VARCHAR(50),
    materials_url TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les inscriptions aux formations
CREATE TABLE training_enrollments (
    training_id INTEGER REFERENCES trainings(id),
    user_id INTEGER REFERENCES users(id),
    status VARCHAR(50),
    completion_date DATE,
    feedback TEXT,
    PRIMARY KEY (training_id, user_id)
);

-- Ajouter une table pour les évaluations
CREATE TABLE evaluations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    evaluator_id INTEGER REFERENCES users(id),
    evaluation_date DATE,
    performance_score INTEGER,
    feedback TEXT,
    goals_achievement TEXT,
    improvement_areas TEXT,
    next_review_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les certifications
CREATE TABLE certifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255),
    issuing_organization VARCHAR(255),
    issue_date DATE,
    expiry_date DATE,
    credential_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour la messagerie interne
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id),
    receiver_id INTEGER REFERENCES users(id),
    subject VARCHAR(255),
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    parent_message_id INTEGER REFERENCES messages(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les groupes de discussion
CREATE TABLE chat_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    creator_id INTEGER REFERENCES users(id),
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les membres des groupes de discussion
CREATE TABLE chat_group_members (
    group_id INTEGER REFERENCES chat_groups(id),
    user_id INTEGER REFERENCES users(id),
    role VARCHAR(50),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (group_id, user_id)
);

-- Ajouter une table pour les messages de groupe
CREATE TABLE group_messages (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES chat_groups(id),
    sender_id INTEGER REFERENCES users(id),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les sondages
CREATE TABLE polls (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    creator_id INTEGER REFERENCES users(id),
    end_date TIMESTAMP,
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_multiple_choice BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les options de sondage
CREATE TABLE poll_options (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id),
    option_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les votes
CREATE TABLE poll_votes (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id),
    user_id INTEGER REFERENCES users(id),
    option_id INTEGER REFERENCES poll_options(id),
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(poll_id, user_id, option_id)
);

-- Ajouter une table pour les wikis/documentation
CREATE TABLE wiki_pages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    parent_page_id INTEGER REFERENCES wiki_pages(id),
    creator_id INTEGER REFERENCES users(id),
    last_editor_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour l'historique des versions wiki
CREATE TABLE wiki_revisions (
    id SERIAL PRIMARY KEY,
    page_id INTEGER REFERENCES wiki_pages(id),
    editor_id INTEGER REFERENCES users(id),
    content TEXT,
    revision_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les templates de documents
CREATE TABLE document_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    content TEXT,
    category VARCHAR(50),
    creator_id INTEGER REFERENCES users(id),
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les KPIs
CREATE TABLE kpis (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    target_value DECIMAL(15,2),
    current_value DECIMAL(15,2),
    unit VARCHAR(50),
    frequency VARCHAR(50),
    department_id INTEGER REFERENCES departments(id),
    responsible_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour l'historique des KPIs
CREATE TABLE kpi_history (
    id SERIAL PRIMARY KEY,
    kpi_id INTEGER REFERENCES kpis(id),
    value DECIMAL(15,2),
    measurement_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les audits
CREATE TABLE audits (
    id SERIAL PRIMARY KEY,
    audit_type VARCHAR(50),
    department_id INTEGER REFERENCES departments(id),
    auditor_id INTEGER REFERENCES users(id),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50),
    findings TEXT,
    recommendations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter des colonnes à la table projects
ALTER TABLE projects ADD COLUMN risks JSON;
ALTER TABLE projects ADD COLUMN success_criteria TEXT[];
ALTER TABLE projects ADD COLUMN stakeholders JSON;
ALTER TABLE projects ADD COLUMN constraints TEXT[];

-- Ajouter une table pour la gestion des contrats
CREATE TABLE contracts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    contract_type VARCHAR(50),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50),
    party_one_id INTEGER REFERENCES users(id),
    party_two_id INTEGER REFERENCES users(id),
    terms TEXT,
    value DECIMAL(15,2),
    document_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour le budget
CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id),
    fiscal_year INTEGER,
    total_amount DECIMAL(15,2),
    used_amount DECIMAL(15,2),
    remaining_amount DECIMAL(15,2),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les transactions budgétaires
CREATE TABLE budget_transactions (
    id SERIAL PRIMARY KEY,
    budget_id INTEGER REFERENCES budgets(id),
    amount DECIMAL(15,2),
    transaction_type VARCHAR(50),
    description TEXT,
    approved_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les inventaires
CREATE TABLE inventory_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    category VARCHAR(50),
    quantity INTEGER,
    unit_price DECIMAL(15,2),
    supplier VARCHAR(255),
    location VARCHAR(255),
    min_quantity INTEGER,
    max_quantity INTEGER,
    reorder_point INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Améliorer la table inventory_items avec tous les champs nécessaires
ALTER TABLE inventory_items ADD COLUMN name VARCHAR(255) NOT NULL;
ALTER TABLE inventory_items ADD COLUMN description TEXT;
ALTER TABLE inventory_items ADD COLUMN quantity INTEGER NOT NULL DEFAULT 0;
ALTER TABLE inventory_items ADD COLUMN unit VARCHAR(50);
ALTER TABLE inventory_items ADD COLUMN minimum_quantity INTEGER DEFAULT 0;
ALTER TABLE inventory_items ADD COLUMN category VARCHAR(100);
ALTER TABLE inventory_items ADD COLUMN location VARCHAR(255);
ALTER TABLE inventory_items ADD COLUMN status VARCHAR(50) DEFAULT 'active';
ALTER TABLE inventory_items ADD COLUMN purchase_price DECIMAL(10,2);
ALTER TABLE inventory_items ADD COLUMN supplier_id INTEGER REFERENCES suppliers(id);
ALTER TABLE inventory_items ADD COLUMN last_inventory_date TIMESTAMP;
ALTER TABLE inventory_items ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE inventory_items ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Ajouter une contrainte pour empêcher les quantités négatives
ALTER TABLE inventory_items ADD CONSTRAINT check_positive_quantity CHECK (quantity >= 0);
ALTER TABLE inventory_items ADD CONSTRAINT check_positive_minimum CHECK (minimum_quantity >= 0);

-- Ajouter une table pour les mouvements d'inventaire
CREATE TABLE inventory_transactions (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES inventory_items(id),
    transaction_type VARCHAR(50),
    quantity INTEGER,
    user_id INTEGER REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Améliorer la table inventory_transactions
ALTER TABLE inventory_transactions ADD COLUMN item_id INTEGER REFERENCES inventory_items(id);
ALTER TABLE inventory_transactions ADD COLUMN transaction_type VARCHAR(50) NOT NULL;
ALTER TABLE inventory_transactions ADD COLUMN quantity INTEGER NOT NULL;
ALTER TABLE inventory_transactions ADD COLUMN notes TEXT;
ALTER TABLE inventory_transactions ADD COLUMN user_id INTEGER REFERENCES users(id);
ALTER TABLE inventory_transactions ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Ajouter une table pour la gestion des fournisseurs
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address JSON,
    category VARCHAR(50),
    rating INTEGER,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les demandes d'achat
CREATE TABLE purchase_requests (
    id SERIAL PRIMARY KEY,
    requester_id INTEGER REFERENCES users(id),
    department_id INTEGER REFERENCES departments(id),
    status VARCHAR(50),
    total_amount DECIMAL(15,2),
    urgency_level VARCHAR(50),
    needed_by_date DATE,
    approval_chain JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les éléments de demande d'achat
CREATE TABLE purchase_request_items (
    id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES purchase_requests(id),
    item_name VARCHAR(255),
    quantity INTEGER,
    estimated_unit_price DECIMAL(15,2),
    supplier_id INTEGER REFERENCES suppliers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les workflows
CREATE TABLE workflows (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    steps JSON,
    trigger_conditions JSON,
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les instances de workflow
CREATE TABLE workflow_instances (
    id SERIAL PRIMARY KEY,
    workflow_id INTEGER REFERENCES workflows(id),
    current_step INTEGER,
    status VARCHAR(50),
    data JSON,
    started_by INTEGER REFERENCES users(id),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour la gestion des accès
CREATE TABLE access_controls (
    id SERIAL PRIMARY KEY,
    resource_type VARCHAR(50),
    resource_id INTEGER,
    user_id INTEGER REFERENCES users(id),
    permissions JSON,
    granted_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter une table pour les sessions utilisateurs
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_id VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter des index pour optimiser les performances des sessions
CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Ajouter des index pour optimiser les performances
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_user_history_user_id ON user_history(user_id);
CREATE INDEX idx_comments_item_type_item_id ON comments(item_type, item_id);
CREATE INDEX idx_documents_project_id ON documents(project_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_inventory_items_supplier ON inventory_items(supplier_id);
CREATE INDEX idx_inventory_items_category ON inventory_items(category);
CREATE INDEX idx_inventory_items_status ON inventory_items(status);
CREATE INDEX idx_inventory_transactions_item ON inventory_transactions(item_id);
CREATE INDEX idx_inventory_transactions_date ON inventory_transactions(created_at);
