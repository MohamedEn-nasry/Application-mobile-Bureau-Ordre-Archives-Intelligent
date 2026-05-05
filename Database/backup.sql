--
-- PostgreSQL database dump
--

\restrict IcDT3XMKa0buT97f7iGdm6euOANON9pO6ix5HR5bErwGc00JgbI8V3o0YevDKk9

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

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
-- Name: sp_add_courrier(character varying, character varying, date, character varying, character varying, character varying, text, character varying, text, integer, integer, integer, timestamp without time zone); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_add_courrier(p_reference character varying, p_type character varying, p_date_courrier date, p_expediteur character varying, p_destinataire character varying, p_objet character varying, p_description text, p_statut character varying, p_texte_ocr text, p_categorie_id integer, p_auteur_id integer, p_assigne_a integer, p_date_echeance timestamp without time zone) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_id INTEGER;
BEGIN
    INSERT INTO courrier (
        reference,
        type,
        date_courrier,
        expediteur,
        destinataire,
        objet,
        description,
        statut,
        texte_ocr,
        categorie_id,
        auteur_id,
        assigne_a,
        date_echeance
    )
    VALUES (
        p_reference,
        p_type,
        p_date_courrier,
        p_expediteur,
        p_destinataire,
        p_objet,
        p_description,
        p_statut,
        p_texte_ocr,
        p_categorie_id,
        p_auteur_id,
        p_assigne_a,
        p_date_echeance
    )
    RETURNING courrier.id INTO new_id;

    RETURN new_id;
END;
$$;


ALTER FUNCTION public.sp_add_courrier(p_reference character varying, p_type character varying, p_date_courrier date, p_expediteur character varying, p_destinataire character varying, p_objet character varying, p_description text, p_statut character varying, p_texte_ocr text, p_categorie_id integer, p_auteur_id integer, p_assigne_a integer, p_date_echeance timestamp without time zone) OWNER TO postgres;

--
-- Name: sp_add_user(character varying, character varying, character varying, text, character varying, boolean, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_add_user(p_firstname character varying, p_lastname character varying, p_email character varying, p_password_hash text, p_role_name character varying, p_isactif boolean, p_image_path character varying) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_user_id integer;
BEGIN
    INSERT INTO users (
        firstname,
        lastname,
        email,
        password_hash,
        role_id,
        isactif,
        created_at,
        updated_at,
        image_path
    )
    VALUES (
        p_firstname,
        p_lastname,
        p_email,
        p_password_hash,
        (SELECT id FROM roles WHERE nom = p_role_name),
        p_isactif,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        p_image_path
    )
    RETURNING id INTO new_user_id;

    RETURN new_user_id;
END;
$$;


ALTER FUNCTION public.sp_add_user(p_firstname character varying, p_lastname character varying, p_email character varying, p_password_hash text, p_role_name character varying, p_isactif boolean, p_image_path character varying) OWNER TO postgres;

--
-- Name: sp_delete_courrier(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_delete_courrier(p_id integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM courrier
    WHERE id = p_id;

    RETURN FOUND;
END;
$$;


ALTER FUNCTION public.sp_delete_courrier(p_id integer) OWNER TO postgres;

--
-- Name: sp_delete_user(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_delete_user(p_user_id integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    rows_affected integer;
BEGIN
    DELETE FROM users
    WHERE id = p_user_id;

    GET DIAGNOSTICS rows_affected = ROW_COUNT;

    RETURN rows_affected;
END;
$$;


ALTER FUNCTION public.sp_delete_user(p_user_id integer) OWNER TO postgres;

--
-- Name: sp_get_active_users(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_get_active_users() RETURNS TABLE(id integer, firstname character varying, lastname character varying, email character varying, password_hash text, role_name character varying, isactif boolean, created_at timestamp without time zone, updated_at timestamp without time zone, image_path character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.firstname,
        u.lastname,
        u.email,
        u.password_hash,
        r.nom,
        u.isactif,
        u.created_at,
        u.updated_at,
        u.image_path
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.isactif = TRUE
    ORDER BY u.id;
END;
$$;


ALTER FUNCTION public.sp_get_active_users() OWNER TO postgres;

--
-- Name: sp_get_active_users_count(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_get_active_users_count() RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    active_count integer;
BEGIN
    SELECT COUNT(*) INTO active_count
    FROM users
    WHERE isactif = TRUE;

    RETURN active_count;
END;
$$;


ALTER FUNCTION public.sp_get_active_users_count() OWNER TO postgres;

--
-- Name: sp_get_all_courriers(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_get_all_courriers() RETURNS TABLE(id integer, reference character varying, type character varying, date_courrier date, expediteur character varying, destinataire character varying, objet character varying, description text, statut character varying, texte_ocr text, categorie_id integer, auteur_id integer, assigne_a integer, created_at timestamp without time zone, updated_at timestamp without time zone, date_echeance timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id, c.reference, c.type, c.date_courrier,
        c.expediteur, c.destinataire, c.objet, c.description,
        c.statut, c.texte_ocr, c.categorie_id, c.auteur_id,
        c.assigne_a, c.created_at, c.updated_at, c.date_echeance
    FROM courrier c
    ORDER BY c.created_at DESC;
END;
$$;


ALTER FUNCTION public.sp_get_all_courriers() OWNER TO postgres;

--
-- Name: sp_get_all_users(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_get_all_users() RETURNS TABLE(id integer, firstname character varying, lastname character varying, email character varying, password_hash text, role_name character varying, isactif boolean, created_at timestamp without time zone, updated_at timestamp without time zone, image_path character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.firstname,
        u.lastname,
        u.email,
        u.password_hash,
        r.nom,
        u.isactif,
        u.created_at,
        u.updated_at,
        u.image_path
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    ORDER BY u.id;
END;
$$;


ALTER FUNCTION public.sp_get_all_users() OWNER TO postgres;

--
-- Name: sp_get_courrier_by_id(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_get_courrier_by_id(p_id integer) RETURNS TABLE(id integer, reference character varying, type character varying, date_courrier date, expediteur character varying, destinataire character varying, objet character varying, description text, statut character varying, texte_ocr text, categorie_id integer, auteur_id integer, assigne_a integer, created_at timestamp without time zone, updated_at timestamp without time zone, date_echeance timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id, c.reference, c.type, c.date_courrier,
        c.expediteur, c.destinataire, c.objet, c.description,
        c.statut, c.texte_ocr, c.categorie_id, c.auteur_id,
        c.assigne_a, c.created_at, c.updated_at, c.date_echeance
    FROM courrier c
    WHERE c.id = p_id;
END;
$$;


ALTER FUNCTION public.sp_get_courrier_by_id(p_id integer) OWNER TO postgres;

--
-- Name: sp_get_courriers_by_assigne_a(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_get_courriers_by_assigne_a(p_user_id integer) RETURNS TABLE(id integer, reference character varying, type character varying, date_courrier date, expediteur character varying, destinataire character varying, objet character varying, description text, statut character varying, texte_ocr text, categorie_id integer, auteur_id integer, assigne_a integer, created_at timestamp without time zone, updated_at timestamp without time zone, date_echeance timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id, c.reference, c.type, c.date_courrier,
        c.expediteur, c.destinataire, c.objet, c.description,
        c.statut, c.texte_ocr, c.categorie_id, c.auteur_id,
        c.assigne_a, c.created_at, c.updated_at, c.date_echeance
    FROM courrier c
    WHERE c.assigne_a = p_user_id
    ORDER BY c.created_at DESC;
END;
$$;


ALTER FUNCTION public.sp_get_courriers_by_assigne_a(p_user_id integer) OWNER TO postgres;

--
-- Name: sp_get_user_by_email(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_get_user_by_email(p_email text) RETURNS TABLE(id integer, firstname character varying, lastname character varying, email character varying, password_hash text, role_name character varying, isactif boolean, created_at timestamp without time zone, updated_at timestamp without time zone, image_path text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.id::INT,
        u.firstname::VARCHAR,
        u.lastname::VARCHAR,
        u.email::VARCHAR,
        u.password_hash::TEXT,
        r.nom::VARCHAR,
        u.isactif::BOOLEAN,
        u.created_at::TIMESTAMP,
        u.updated_at::TIMESTAMP,
        u.image_path::TEXT
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.email = p_email
    LIMIT 1;
END;
$$;


ALTER FUNCTION public.sp_get_user_by_email(p_email text) OWNER TO postgres;

--
-- Name: sp_get_user_by_id(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_get_user_by_id(p_user_id integer) RETURNS TABLE(id integer, firstname character varying, lastname character varying, email character varying, password_hash text, role_name character varying, isactif boolean, created_at timestamp without time zone, updated_at timestamp without time zone, image_path character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.firstname,
        u.lastname,
        u.email,
        u.password_hash,
        r.nom,
        u.isactif,
        u.created_at,
        u.updated_at,
        u.image_path
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = p_user_id;
END;
$$;


ALTER FUNCTION public.sp_get_user_by_id(p_user_id integer) OWNER TO postgres;

--
-- Name: sp_update_courrier(integer, character varying, character varying, date, character varying, character varying, character varying, text, character varying, text, integer, integer, integer, timestamp without time zone); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_update_courrier(p_id integer, p_reference character varying, p_type character varying, p_date_courrier date, p_expediteur character varying, p_destinataire character varying, p_objet character varying, p_description text, p_statut character varying, p_texte_ocr text, p_categorie_id integer, p_auteur_id integer, p_assigne_a integer, p_date_echeance timestamp without time zone) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE courrier
    SET
        reference = p_reference,
        type = p_type,
        date_courrier = p_date_courrier,
        expediteur = p_expediteur,
        destinataire = p_destinataire,
        objet = p_objet,
        description = p_description,
        statut = p_statut,
        texte_ocr = p_texte_ocr,
        categorie_id = p_categorie_id,
        auteur_id = p_auteur_id,
        assigne_a = p_assigne_a,
        date_echeance = p_date_echeance,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id;

    RETURN FOUND;
END;
$$;


ALTER FUNCTION public.sp_update_courrier(p_id integer, p_reference character varying, p_type character varying, p_date_courrier date, p_expediteur character varying, p_destinataire character varying, p_objet character varying, p_description text, p_statut character varying, p_texte_ocr text, p_categorie_id integer, p_auteur_id integer, p_assigne_a integer, p_date_echeance timestamp without time zone) OWNER TO postgres;

--
-- Name: sp_update_courrier_statut(integer, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_update_courrier_statut(p_id integer, p_statut character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE courrier
    SET
        statut = p_statut,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id;

    RETURN FOUND;
END;
$$;


ALTER FUNCTION public.sp_update_courrier_statut(p_id integer, p_statut character varying) OWNER TO postgres;

--
-- Name: sp_update_user(integer, character varying, character varying, character varying, character varying, character varying, boolean, character varying); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_update_user(IN p_user_id integer, IN p_firstname character varying, IN p_lastname character varying, IN p_email character varying, IN p_password_hash character varying, IN p_role_name character varying, IN p_isactif boolean, IN p_image_path character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE users
    SET
        firstname = p_firstname,
        lastname = p_lastname,
        email = p_email,
        password_hash = COALESCE(p_password_hash, password_hash),
        role_id = (select id from roles where nom = p_role_name),
        isactif = p_isactif,
        image_path = COALESCE(p_image_path, image_path),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_user_id;
END;
$$;


ALTER PROCEDURE public.sp_update_user(IN p_user_id integer, IN p_firstname character varying, IN p_lastname character varying, IN p_email character varying, IN p_password_hash character varying, IN p_role_name character varying, IN p_isactif boolean, IN p_image_path character varying) OWNER TO postgres;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categorie; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorie (
    id integer NOT NULL,
    nom character varying(100) NOT NULL,
    description text
);


ALTER TABLE public.categorie OWNER TO postgres;

--
-- Name: categorie_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorie_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorie_id_seq OWNER TO postgres;

--
-- Name: categorie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorie_id_seq OWNED BY public.categorie.id;


--
-- Name: courrier; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courrier (
    id integer NOT NULL,
    reference character varying(100) NOT NULL,
    type character varying(50) NOT NULL,
    date_courrier date NOT NULL,
    expediteur character varying(255),
    destinataire character varying(255),
    objet character varying(255) NOT NULL,
    description text,
    statut character varying(50) DEFAULT 'EN_ATTENTE'::character varying NOT NULL,
    texte_ocr text,
    categorie_id integer NOT NULL,
    auteur_id integer NOT NULL,
    assigne_a integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_echeance timestamp without time zone
);


ALTER TABLE public.courrier OWNER TO postgres;

--
-- Name: courrier_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.courrier_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courrier_id_seq OWNER TO postgres;

--
-- Name: courrier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.courrier_id_seq OWNED BY public.courrier.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    nom character varying(255) NOT NULL,
    description text
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    firstname character varying(100),
    lastname character varying(100),
    email character varying(255),
    password_hash text NOT NULL,
    role_id integer,
    isactif boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    image_path character varying(900)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
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
-- Name: categorie id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorie ALTER COLUMN id SET DEFAULT nextval('public.categorie_id_seq'::regclass);


--
-- Name: courrier id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courrier ALTER COLUMN id SET DEFAULT nextval('public.courrier_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: categorie; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorie (id, nom, description) FROM stdin;
1	Administrative	Correspondence related to internal management and organization
2	Financial	Correspondence related to budget, invoices, payments, and accounting
3	Legal	Correspondence related to contracts, disputes, decisions, and laws
4	Technical	Correspondence related to IT systems, maintenance, and technical support
5	Human Resources	Correspondence related to employees, recruitment, leave, and training
6	Archive	Documents and correspondence intended for archiving and storage
7	External	Incoming correspondence from external entities
8	Internal	Correspondence exchanged within the organization
\.


--
-- Data for Name: courrier; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courrier (id, reference, type, date_courrier, expediteur, destinataire, objet, description, statut, texte_ocr, categorie_id, auteur_id, assigne_a, created_at, updated_at, date_echeance) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, nom, description) FROM stdin;
1	Lecteur	Utilisateur avec accès en lecture seulement
2	Admin	Administrateur avec tous les privilèges
3	Agent	Agent avec permissions opérationnelles
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, firstname, lastname, email, password_hash, role_id, isactif, created_at, updated_at, image_path) FROM stdin;
1	Mohamed	nasiri	mohamed@gmail.com	$2a$11$iUautrfRMBqE/QMMA3GcbulZb6X0QJX4ulfvwyyOKtYmD.uAujSRi	2	t	2026-04-20 00:22:51.505383	2026-04-20 00:22:51.505383	
2	Ahmed	Ali	Ahmed@gmail.com	$2a$11$.c7HUIPqdddjWo4JByz/i.DkPGGSNGcUtnVnN5fVk2JGQUSuHPX1a	3	t	2026-04-20 15:08:46.254342	2026-04-20 15:08:46.254342	string
3	Mohamed	En-nasry	mohamednasry34@gmail.com	$2a$11$eTJk9Pw5icitwwSLtU6mie0c6pKgalzsYTiGZCNd/I9OW0psGleBm	2	t	2026-04-23 00:20:33.244459	2026-04-23 00:20:33.244459	string
5	saad	sahara	sahara@gmail.com	$2a$11$g08gtIYCsiJODLI/PqPLlOHmze7exZLG8fKY0jVk0Vmm9/sqEGNL6	3	t	2026-04-26 01:06:28.833814	2026-04-26 01:06:28.833814	
6	Ali	Sahara	Ali@gmail.com	$2a$11$Ym2LJxW1IgXcN1tC2yxDleME4Xykat4irDfyte9hJSrvkUupv4cIm	1	t	2026-04-26 01:09:32.297157	2026-04-26 01:09:32.297157	
7	Ahmed	Ali	Ali2@gmail.com	$2a$11$2OjU.eOxtzlRBsvel60az.uJ3doqxR81Yes1wCbI6zZMYFs6OKM/O	3	t	2026-04-26 01:19:55.244596	2026-04-26 18:37:43.24645	
11	Ahmed	Saha	m@gmail.com	$2a$11$Qy7WwJsm8CIZPwaURl.6hOwsvVWvjyniYIh53USHMmuhtiPjR.x.6	1	t	2026-04-26 14:03:05.225173	2026-04-27 12:32:13.263016	
\.


--
-- Name: categorie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorie_id_seq', 8, true);


--
-- Name: courrier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courrier_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 11, true);


--
-- Name: categorie categorie_nom_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorie
    ADD CONSTRAINT categorie_nom_key UNIQUE (nom);


--
-- Name: categorie categorie_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorie
    ADD CONSTRAINT categorie_pkey PRIMARY KEY (id);


--
-- Name: courrier courrier_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courrier
    ADD CONSTRAINT courrier_pkey PRIMARY KEY (id);


--
-- Name: courrier courrier_reference_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courrier
    ADD CONSTRAINT courrier_reference_key UNIQUE (reference);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: courrier trigger_update_courrier_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_courrier_updated_at BEFORE UPDATE ON public.courrier FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: courrier fk_courrier_assigne_a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courrier
    ADD CONSTRAINT fk_courrier_assigne_a FOREIGN KEY (assigne_a) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: courrier fk_courrier_auteur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courrier
    ADD CONSTRAINT fk_courrier_auteur FOREIGN KEY (auteur_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: courrier fk_courrier_categorie; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courrier
    ADD CONSTRAINT fk_courrier_categorie FOREIGN KEY (categorie_id) REFERENCES public.categorie(id) ON DELETE RESTRICT;


--
-- Name: users fk_role; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict IcDT3XMKa0buT97f7iGdm6euOANON9pO6ix5HR5bErwGc00JgbI8V3o0YevDKk9

