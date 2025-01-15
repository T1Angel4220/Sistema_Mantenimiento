--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: proveedor; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.proveedor AS ENUM (
    'ACME Maintenance',
    'TechSupport S.A.',
    'ServiMaq Ltda.',
    'Otro'
);


ALTER TYPE public.proveedor OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: actividades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.actividades (
    id bigint NOT NULL,
    nombre character varying(100) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.actividades OWNER TO postgres;

--
-- Name: actividades_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.actividades_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.actividades_id_seq OWNER TO postgres;

--
-- Name: actividades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.actividades_id_seq OWNED BY public.actividades.id;


--
-- Name: componentes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.componentes (
    id bigint NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.componentes OWNER TO postgres;

--
-- Name: componentes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.componentes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.componentes_id_seq OWNER TO postgres;

--
-- Name: componentes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.componentes_id_seq OWNED BY public.componentes.id;


--
-- Name: equipo_componentes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipo_componentes (
    id bigint NOT NULL,
    equipo_mantenimiento_id bigint NOT NULL,
    componente_id bigint NOT NULL,
    mantenimiento_id bigint NOT NULL,
    cantidad integer DEFAULT 1 NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.equipo_componentes OWNER TO postgres;

--
-- Name: equipo_componentes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.equipo_componentes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.equipo_componentes_id_seq OWNER TO postgres;

--
-- Name: equipo_componentes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.equipo_componentes_id_seq OWNED BY public.equipo_componentes.id;


--
-- Name: equipo_mantenimiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipo_mantenimiento (
    id bigint NOT NULL,
    mantenimiento_id bigint NOT NULL,
    equipo_id bigint NOT NULL,
    observacion text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.equipo_mantenimiento OWNER TO postgres;

--
-- Name: equipo_mantenimiento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.equipo_mantenimiento_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.equipo_mantenimiento_id_seq OWNER TO postgres;

--
-- Name: equipo_mantenimiento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.equipo_mantenimiento_id_seq OWNED BY public.equipo_mantenimiento.id;


--
-- Name: equipos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipos (
    id bigint NOT NULL,
    "Nombre_Producto" character varying(255) NOT NULL,
    "Codigo_Barras" character varying(100) NOT NULL,
    "Tipo_Equipo" character varying(255) NOT NULL,
    "Fecha_Adquisicion" date NOT NULL,
    "Ubicacion_Equipo" character varying(255) NOT NULL,
    "Descripcion_Equipo" character varying(255) NOT NULL,
    proceso_compra_id character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT "equipos_Tipo_Equipo_check" CHECK ((("Tipo_Equipo")::text = ANY ((ARRAY['Inform├ítico'::character varying, 'Electr├│nicos y El├®ctricos'::character varying, 'Industriales'::character varying, 'Audiovisuales'::character varying])::text[]))),
    CONSTRAINT "equipos_Ubicacion_Equipo_check" CHECK ((("Ubicacion_Equipo")::text = ANY ((ARRAY['Departamento de TI'::character varying, 'Laboratorio de Redes'::character varying, 'Sala de reuniones'::character varying, 'Laboratorio CTT'::character varying])::text[])))
);


ALTER TABLE public.equipos OWNER TO postgres;

--
-- Name: equipos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.equipos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.equipos_id_seq OWNER TO postgres;

--
-- Name: equipos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.equipos_id_seq OWNED BY public.equipos.id;


--
-- Name: failed_jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection text NOT NULL,
    queue text NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.failed_jobs OWNER TO postgres;

--
-- Name: failed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.failed_jobs_id_seq OWNER TO postgres;

--
-- Name: failed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;


--
-- Name: mantenimiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mantenimiento (
    id bigint NOT NULL,
    codigo_mantenimiento character varying(20) NOT NULL,
    tipo character varying(255) NOT NULL,
    fecha_inicio date,
    fecha_fin date NOT NULL,
    nombre_responsable character varying(255) NOT NULL,
    apellido_responsable character varying(255),
    proveedor character varying(255),
    contacto_proveedor character varying(255),
    costo numeric(10,2),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    estado character varying(255) DEFAULT 'No terminado'::character varying NOT NULL,
    CONSTRAINT mantenimiento_estado_check CHECK (((estado)::text = ANY ((ARRAY['Terminado'::character varying, 'No terminado'::character varying])::text[]))),
    CONSTRAINT mantenimiento_proveedor_check CHECK (((proveedor)::text = ANY ((ARRAY['ACME Maintenance'::character varying, 'TechSupport S.A.'::character varying, 'ServiMaq Ltda.'::character varying, 'Otro'::character varying])::text[]))),
    CONSTRAINT mantenimiento_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['Interno'::character varying, 'Externo'::character varying])::text[])))
);


ALTER TABLE public.mantenimiento OWNER TO postgres;

--
-- Name: mantenimiento_actividad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mantenimiento_actividad (
    id bigint NOT NULL,
    mantenimiento_id bigint NOT NULL,
    actividad_id bigint NOT NULL,
    equipo_id bigint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.mantenimiento_actividad OWNER TO postgres;

--
-- Name: mantenimiento_actividad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mantenimiento_actividad_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mantenimiento_actividad_id_seq OWNER TO postgres;

--
-- Name: mantenimiento_actividad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mantenimiento_actividad_id_seq OWNED BY public.mantenimiento_actividad.id;


--
-- Name: mantenimiento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mantenimiento_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mantenimiento_id_seq OWNER TO postgres;

--
-- Name: mantenimiento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mantenimiento_id_seq OWNED BY public.mantenimiento.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: observaciones_mantenimiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observaciones_mantenimiento (
    id bigint NOT NULL,
    mantenimiento_id bigint NOT NULL,
    equipo_id bigint NOT NULL,
    observacion text NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.observaciones_mantenimiento OWNER TO postgres;

--
-- Name: observaciones_mantenimiento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.observaciones_mantenimiento_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.observaciones_mantenimiento_id_seq OWNER TO postgres;

--
-- Name: observaciones_mantenimiento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.observaciones_mantenimiento_id_seq OWNED BY public.observaciones_mantenimiento.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);


ALTER TABLE public.password_reset_tokens OWNER TO postgres;

--
-- Name: personal_access_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personal_access_tokens (
    id bigint NOT NULL,
    tokenable_type character varying(255) NOT NULL,
    tokenable_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    token character varying(64) NOT NULL,
    abilities text,
    last_used_at timestamp(0) without time zone,
    expires_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.personal_access_tokens OWNER TO postgres;

--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.personal_access_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personal_access_tokens_id_seq OWNER TO postgres;

--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personal_access_tokens_id_seq OWNED BY public.personal_access_tokens.id;


--
-- Name: procesos_compra; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.procesos_compra (
    id character varying(255) NOT NULL,
    nombre character varying(150) NOT NULL,
    descripcion text,
    fecha date NOT NULL,
    proveedor character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.procesos_compra OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    lastname character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: usuario_activo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario_activo (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    lastname character varying(255) NOT NULL,
    email character varying(255) NOT NULL
);


ALTER TABLE public.usuario_activo OWNER TO postgres;

--
-- Name: usuario_activo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_activo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_activo_id_seq OWNER TO postgres;

--
-- Name: usuario_activo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_activo_id_seq OWNED BY public.usuario_activo.id;


--
-- Name: actividades id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actividades ALTER COLUMN id SET DEFAULT nextval('public.actividades_id_seq'::regclass);


--
-- Name: componentes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.componentes ALTER COLUMN id SET DEFAULT nextval('public.componentes_id_seq'::regclass);


--
-- Name: equipo_componentes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo_componentes ALTER COLUMN id SET DEFAULT nextval('public.equipo_componentes_id_seq'::regclass);


--
-- Name: equipo_mantenimiento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo_mantenimiento ALTER COLUMN id SET DEFAULT nextval('public.equipo_mantenimiento_id_seq'::regclass);


--
-- Name: equipos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipos ALTER COLUMN id SET DEFAULT nextval('public.equipos_id_seq'::regclass);


--
-- Name: failed_jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);


--
-- Name: mantenimiento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mantenimiento ALTER COLUMN id SET DEFAULT nextval('public.mantenimiento_id_seq'::regclass);


--
-- Name: mantenimiento_actividad id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mantenimiento_actividad ALTER COLUMN id SET DEFAULT nextval('public.mantenimiento_actividad_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: observaciones_mantenimiento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_mantenimiento ALTER COLUMN id SET DEFAULT nextval('public.observaciones_mantenimiento_id_seq'::regclass);


--
-- Name: personal_access_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_access_tokens ALTER COLUMN id SET DEFAULT nextval('public.personal_access_tokens_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: usuario_activo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_activo ALTER COLUMN id SET DEFAULT nextval('public.usuario_activo_id_seq'::regclass);


--
-- Name: actividades actividades_nombre_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actividades
    ADD CONSTRAINT actividades_nombre_unique UNIQUE (nombre);


--
-- Name: actividades actividades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actividades
    ADD CONSTRAINT actividades_pkey PRIMARY KEY (id);


--
-- Name: componentes componentes_nombre_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.componentes
    ADD CONSTRAINT componentes_nombre_unique UNIQUE (nombre);


--
-- Name: componentes componentes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.componentes
    ADD CONSTRAINT componentes_pkey PRIMARY KEY (id);


--
-- Name: equipo_componentes equipo_componentes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo_componentes
    ADD CONSTRAINT equipo_componentes_pkey PRIMARY KEY (id);


--
-- Name: equipo_mantenimiento equipo_mantenimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo_mantenimiento
    ADD CONSTRAINT equipo_mantenimiento_pkey PRIMARY KEY (id);


--
-- Name: equipos equipos_codigo_barras_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipos
    ADD CONSTRAINT equipos_codigo_barras_unique UNIQUE ("Codigo_Barras");


--
-- Name: equipos equipos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipos
    ADD CONSTRAINT equipos_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);


--
-- Name: mantenimiento_actividad mantenimiento_actividad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mantenimiento_actividad
    ADD CONSTRAINT mantenimiento_actividad_pkey PRIMARY KEY (id);


--
-- Name: mantenimiento mantenimiento_codigo_mantenimiento_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mantenimiento
    ADD CONSTRAINT mantenimiento_codigo_mantenimiento_unique UNIQUE (codigo_mantenimiento);


--
-- Name: mantenimiento mantenimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mantenimiento
    ADD CONSTRAINT mantenimiento_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: observaciones_mantenimiento observaciones_mantenimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_mantenimiento
    ADD CONSTRAINT observaciones_mantenimiento_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);


--
-- Name: personal_access_tokens personal_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_pkey PRIMARY KEY (id);


--
-- Name: personal_access_tokens personal_access_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_token_unique UNIQUE (token);


--
-- Name: procesos_compra procesos_compra_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procesos_compra
    ADD CONSTRAINT procesos_compra_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: usuario_activo usuario_activo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_activo
    ADD CONSTRAINT usuario_activo_pkey PRIMARY KEY (id);


--
-- Name: personal_access_tokens_tokenable_type_tokenable_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index ON public.personal_access_tokens USING btree (tokenable_type, tokenable_id);


--
-- Name: equipo_mantenimiento equipo_mantenimiento_equipo_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo_mantenimiento
    ADD CONSTRAINT equipo_mantenimiento_equipo_id_foreign FOREIGN KEY (equipo_id) REFERENCES public.equipos(id) ON DELETE CASCADE;


--
-- Name: equipo_mantenimiento equipo_mantenimiento_mantenimiento_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo_mantenimiento
    ADD CONSTRAINT equipo_mantenimiento_mantenimiento_id_foreign FOREIGN KEY (mantenimiento_id) REFERENCES public.mantenimiento(id) ON DELETE CASCADE;


--
-- Name: mantenimiento_actividad mantenimiento_actividad_actividad_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mantenimiento_actividad
    ADD CONSTRAINT mantenimiento_actividad_actividad_id_foreign FOREIGN KEY (actividad_id) REFERENCES public.actividades(id) ON DELETE CASCADE;


--
-- Name: mantenimiento_actividad mantenimiento_actividad_equipo_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mantenimiento_actividad
    ADD CONSTRAINT mantenimiento_actividad_equipo_id_foreign FOREIGN KEY (equipo_id) REFERENCES public.equipos(id) ON DELETE CASCADE;


--
-- Name: mantenimiento_actividad mantenimiento_actividad_mantenimiento_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mantenimiento_actividad
    ADD CONSTRAINT mantenimiento_actividad_mantenimiento_id_foreign FOREIGN KEY (mantenimiento_id) REFERENCES public.mantenimiento(id) ON DELETE CASCADE;


--
-- Name: observaciones_mantenimiento observaciones_mantenimiento_equipo_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_mantenimiento
    ADD CONSTRAINT observaciones_mantenimiento_equipo_id_foreign FOREIGN KEY (equipo_id) REFERENCES public.equipos(id) ON DELETE CASCADE;


--
-- Name: observaciones_mantenimiento observaciones_mantenimiento_mantenimiento_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_mantenimiento
    ADD CONSTRAINT observaciones_mantenimiento_mantenimiento_id_foreign FOREIGN KEY (mantenimiento_id) REFERENCES public.mantenimiento(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

