-- portfolio schema, run once against Neon (SQL editor or psql)

-- Required only once per database
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- admin login (just one user, plain-text password — see README security note)
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- yes, plain text — intentional, not a mistake
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO admin_users (username, password)
VALUES ('rahulraj.ai', 'RudraDev')
ON CONFLICT (username) DO NOTHING;

-- home / hero section, single row
CREATE TABLE IF NOT EXISTS home_profile (
  id INT PRIMARY KEY DEFAULT 1,
  greeting TEXT NOT NULL DEFAULT 'Hi, I''m',
  full_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  interest_line TEXT NOT NULL,
  summary TEXT NOT NULL,
  resume_url TEXT,               -- Cloudflare R2 URL to the PDF
  github_url TEXT,
  linkedin_url TEXT,
  email TEXT,
  rotating_skills TEXT[] DEFAULT '{}', -- e.g. {"Java 21","Spring Boot","Kafka","LLM Orchestration"}
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO home_profile (id, greeting, full_name, role_title, interest_line, summary, github_url, linkedin_url, email, rotating_skills)
VALUES (
  1, 'Hi, I''m', 'Rahul Raj', 'Enterprise Java Developer & AI-Augmented Engineering Enthusiast',
  'Interested in scalable backend systems, LLM-assisted engineering & developer productivity',
  '5.5+ years building resilient, high-throughput Java systems for enterprise clients, now exploring how AI copilots and agentic workflows reshape the way software gets built.',
  'https://github.com/', 'https://linkedin.com/', 'you@example.com',
  ARRAY['Java 21','Spring Boot','Microservices','Kafka','LLM Orchestration','System Design']
)
ON CONFLICT (id) DO NOTHING;

-- about page
CREATE TABLE IF NOT EXISTS about_me (
  id INT PRIMARY KEY DEFAULT 1,
  passion_title TEXT,
  passion_text TEXT,
  journey_text TEXT,      -- long-form professional journey (markdown/plain text)
  years_experience TEXT DEFAULT '5+',    -- free-form stat label, e.g. "5+"
  technologies_count TEXT DEFAULT '3+',  -- free-form stat label, e.g. "3+"
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT single_row_about CHECK (id = 1)
);

-- safe to re-run on an older db that doesn't have these columns yet
ALTER TABLE about_me ADD COLUMN IF NOT EXISTS years_experience TEXT DEFAULT '5+';
ALTER TABLE about_me ADD COLUMN IF NOT EXISTS technologies_count TEXT DEFAULT '3+';

INSERT INTO about_me (id, passion_title, passion_text, journey_text)
VALUES (
  1, 'What shaped the craft',
  'A habit of pulling systems apart to see how they scale, and a growing curiosity for how AI can pair with engineers rather than replace them.',
  'Started out writing monoliths, grew into distributed systems, and spent the last stretch pairing enterprise Java with AI-assisted tooling to ship faster without cutting corners.'
)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  year TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- skills page, grouped by category
CREATE TABLE IF NOT EXISTS skill_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,          -- e.g. "Language & Framework"
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  category_id INT REFERENCES skill_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,          -- e.g. "Spring Boot"
  proficiency INT DEFAULT 80,  -- 0-100, optional
  sort_order INT DEFAULT 0
);

INSERT INTO skill_categories (name, sort_order) VALUES
 ('Language & Framework', 1),
 ('Architecture & Integration', 2),
 ('Frontend Development', 3),
 ('API Security & Documentation', 4),
 ('Data & Caching', 5),
 ('DevOps & CI/CD', 6),
 ('Testing & Quality', 7),
 ('Agile Collaboration', 8),
 ('AI-Augmented Engineering', 9)
ON CONFLICT DO NOTHING;

-- experience page — companies with nested projects
CREATE TABLE IF NOT EXISTS experiences (
  id SERIAL PRIMARY KEY,
  company_name TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,                 -- NULL = present
  domain TEXT,                   -- e.g. "Banking / Payments"
  description TEXT,              -- overall summary of work at the company
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS experience_projects (
  id SERIAL PRIMARY KEY,
  experience_id INT REFERENCES experiences(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  responsibilities TEXT,          -- store as newline separated bullet points
  achievements TEXT,              -- store as newline separated bullet points
  tech_stack TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0
);

-- projects page (personal projects, not tied to an employer)
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  photo_url TEXT,
  name TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  code_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- certifications page
CREATE TABLE IF NOT EXISTS certifications (
  id SERIAL PRIMARY KEY,
  image_url TEXT,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  completion_date DATE NOT NULL,
  expiry_date DATE,             -- NULL -> UI shows completion date only
  certificate_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- contact page — static info + map coords, plus the inbound messages table below
CREATE TABLE IF NOT EXISTS contact_info (
  id INT PRIMARY KEY DEFAULT 1,
  email TEXT,
  phone TEXT,
  location TEXT,
  map_lat DOUBLE PRECISION,
  map_lng DOUBLE PRECISION,
  github_url TEXT,
  linkedin_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT single_row_contact CHECK (id = 1)
);

INSERT INTO contact_info (id, email, phone, location, map_lat, map_lng, github_url, linkedin_url)
VALUES (1, 'you@example.com', '+91 90000 00000', 'Hyderabad, India', 17.3850, 78.4867, 'https://github.com/', 'https://linkedin.com/')
ON CONFLICT (id) DO NOTHING;

-- just a durable log — EmailJS actually sends the email client-side
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- site-wide settings (resume PDF url, etc.)
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  resume_pdf_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT single_row_settings CHECK (id = 1)
);

INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
