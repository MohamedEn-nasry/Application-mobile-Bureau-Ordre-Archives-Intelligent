--
-- PostgreSQL database dump
--

\restrict cKFQLdRigo2YaGY7GWSGYY0JqxTvyAETKS9YpRT25EDaahNWcK3InfSFe2GSoZP

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
-- Name: fn_courrier_update_statut_with_history(integer, character varying, integer, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_courrier_update_statut_with_history(p_courrier_id integer, p_nouveau_statut character varying, p_modifie_par integer, p_commentaire text DEFAULT NULL::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_ancien_statut VARCHAR;
BEGIN
    SELECT statut
    INTO v_ancien_statut
    FROM courrier
    WHERE id = p_courrier_id;

    IF v_ancien_statut IS NULL THEN
        RETURN FALSE;
    END IF;

    IF v_ancien_statut = p_nouveau_statut THEN
        RETURN TRUE;
    END IF;

    UPDATE courrier
    SET
        statut = p_nouveau_statut,
        updated_at = NOW()
    WHERE id = p_courrier_id;

    INSERT INTO historique_statut
    (
        courrier_id,
        ancien_statut,
        nouveau_statut,
        modifie_par,
        commentaire,
        changed_at
    )
    VALUES
    (
        p_courrier_id,
        v_ancien_statut,
        p_nouveau_statut,
        p_modifie_par,
        p_commentaire,
        NOW()
    );

    RETURN TRUE;
END;
$$;


ALTER FUNCTION public.fn_courrier_update_statut_with_history(p_courrier_id integer, p_nouveau_statut character varying, p_modifie_par integer, p_commentaire text) OWNER TO postgres;

--
-- Name: fn_historique_statut_get_by_courrier(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_historique_statut_get_by_courrier(p_courrier_id integer) RETURNS TABLE(id integer, courrier_id integer, ancien_statut character varying, nouveau_statut character varying, modifie_par integer, commentaire text, changed_at timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        hs.id,
        hs.courrier_id,
        hs.ancien_statut,
        hs.nouveau_statut,
        hs.modifie_par,
        hs.commentaire,
        hs.changed_at
    FROM historique_statut hs
    WHERE hs.courrier_id = p_courrier_id
    ORDER BY hs.changed_at DESC;
END;
$$;


ALTER FUNCTION public.fn_historique_statut_get_by_courrier(p_courrier_id integer) OWNER TO postgres;

--
-- Name: fn_piece_jointe_add(integer, character varying, character varying, text, character varying, bigint, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_piece_jointe_add(p_courrier_id integer, p_nom_fichier character varying, p_type_fichier character varying, p_chemin_fichier text, p_format character varying, p_taille bigint, p_est_scan boolean) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_id INT;
BEGIN
    INSERT INTO piece_jointe
    (
        courrier_id,
        nom_fichier,
        type_fichier,
        chemin_fichier,
        format,
        taille,
        est_scan,
        created_at
    )
    VALUES
    (
        p_courrier_id,
        p_nom_fichier,
        p_type_fichier,
        p_chemin_fichier,
        p_format,
        p_taille,
        p_est_scan,
        NOW()
    )
    RETURNING id INTO v_id;

    RETURN v_id;
END;
$$;


ALTER FUNCTION public.fn_piece_jointe_add(p_courrier_id integer, p_nom_fichier character varying, p_type_fichier character varying, p_chemin_fichier text, p_format character varying, p_taille bigint, p_est_scan boolean) OWNER TO postgres;

--
-- Name: fn_piece_jointe_confirm_ocr(integer, integer, text, integer, double precision, character varying, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_piece_jointe_confirm_ocr(p_piece_jointe_id integer, p_courrier_id integer, p_texte_ocr text, p_categorie_id integer DEFAULT NULL::integer, p_score_confiance double precision DEFAULT 0, p_methode character varying DEFAULT 'OCR_RULE_BASED'::character varying, p_validee_par integer DEFAULT NULL::integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_piece_exists INT;
    v_category_exists INT;
    v_classification_id INT;
BEGIN
    SELECT COUNT(*)
    INTO v_piece_exists
    FROM piece_jointe
    WHERE id = p_piece_jointe_id
      AND courrier_id = p_courrier_id;

    IF v_piece_exists = 0 THEN
        RETURN -1;
    END IF;

    IF p_categorie_id IS NOT NULL THEN
        SELECT COUNT(*)
        INTO v_category_exists
        FROM categorie
        WHERE id = p_categorie_id;

        IF v_category_exists = 0 THEN
            RETURN -1;
        END IF;
    END IF;

    UPDATE courrier
    SET
        texte_ocr = CASE
            WHEN texte_ocr IS NULL OR texte_ocr = ''
                THEN p_texte_ocr
            ELSE texte_ocr || E'\n\n' || p_texte_ocr
        END,
        categorie_id = COALESCE(p_categorie_id, categorie_id),
        updated_at = NOW()
    WHERE id = p_courrier_id;

    UPDATE piece_jointe
    SET est_scan = TRUE
    WHERE id = p_piece_jointe_id;

    INSERT INTO classification
    (
        courrier_id,
        categorie_proposee_id,
        score_confiance,
        methode,
        validee_par_utilisateur,
        validee_par,
        created_at
    )
    VALUES
    (
        p_courrier_id,
        p_categorie_id,
        p_score_confiance,
        p_methode,
        TRUE,
        p_validee_par,
        NOW()
    )
    RETURNING id INTO v_classification_id;

    RETURN v_classification_id;
END;
$$;


ALTER FUNCTION public.fn_piece_jointe_confirm_ocr(p_piece_jointe_id integer, p_courrier_id integer, p_texte_ocr text, p_categorie_id integer, p_score_confiance double precision, p_methode character varying, p_validee_par integer) OWNER TO postgres;

--
-- Name: fn_piece_jointe_confirm_ocr(integer, integer, text, double precision, boolean, integer, double precision, character varying, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_piece_jointe_confirm_ocr(p_piece_jointe_id integer, p_courrier_id integer, p_texte_extrait text, p_ocr_confiance double precision, p_corrige_manuellement boolean, p_categorie_id integer DEFAULT NULL::integer, p_score_confiance double precision DEFAULT 0, p_methode character varying DEFAULT 'OCR_RULE_BASED'::character varying, p_validee_par integer DEFAULT NULL::integer) RETURNS TABLE(ocr_resultat_id integer, classification_id integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_piece_exists INT;
    v_category_exists INT;
    v_ocr_resultat_id INT;
    v_classification_id INT;
BEGIN
    SELECT COUNT(*)
    INTO v_piece_exists
    FROM piece_jointe
    WHERE id = p_piece_jointe_id
      AND courrier_id = p_courrier_id;

    IF v_piece_exists = 0 THEN
        RETURN QUERY SELECT -1, -1;
        RETURN;
    END IF;

    IF p_categorie_id IS NOT NULL THEN
        SELECT COUNT(*)
        INTO v_category_exists
        FROM categorie
        WHERE id = p_categorie_id;

        IF v_category_exists = 0 THEN
            RETURN QUERY SELECT -1, -1;
            RETURN;
        END IF;
    END IF;

    INSERT INTO ocr_resultat
    (
        piece_jointe_id,
        texte_extrait,
        confiance,
        corrige_manuellement,
        created_at,
        updated_at
    )
    VALUES
    (
        p_piece_jointe_id,
        p_texte_extrait,
        p_ocr_confiance,
        p_corrige_manuellement,
        NOW(),
        NOW()
    )
    RETURNING id INTO v_ocr_resultat_id;

    UPDATE courrier
    SET
        texte_ocr = CASE
            WHEN texte_ocr IS NULL OR texte_ocr = ''
                THEN p_texte_extrait
            ELSE texte_ocr || E'\n\n' || p_texte_extrait
        END,
        categorie_id = COALESCE(p_categorie_id, categorie_id),
        updated_at = NOW()
    WHERE id = p_courrier_id;

    UPDATE piece_jointe
    SET est_scan = TRUE
    WHERE id = p_piece_jointe_id;

    INSERT INTO classification
    (
        courrier_id,
        categorie_proposee_id,
        score_confiance,
        methode,
        validee_par_utilisateur,
        validee_par,
        created_at
    )
    VALUES
    (
        p_courrier_id,
        p_categorie_id,
        p_score_confiance,
        p_methode,
        TRUE,
        p_validee_par,
        NOW()
    )
    RETURNING id INTO v_classification_id;

    RETURN QUERY SELECT v_ocr_resultat_id, v_classification_id;
END;
$$;


ALTER FUNCTION public.fn_piece_jointe_confirm_ocr(p_piece_jointe_id integer, p_courrier_id integer, p_texte_extrait text, p_ocr_confiance double precision, p_corrige_manuellement boolean, p_categorie_id integer, p_score_confiance double precision, p_methode character varying, p_validee_par integer) OWNER TO postgres;

--
-- Name: fn_piece_jointe_delete(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_piece_jointe_delete(p_id integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM piece_jointe
    WHERE id = p_id;

    RETURN FOUND;
END;
$$;


ALTER FUNCTION public.fn_piece_jointe_delete(p_id integer) OWNER TO postgres;

--
-- Name: fn_piece_jointe_get_by_courrier_id(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_piece_jointe_get_by_courrier_id(p_courrier_id integer) RETURNS TABLE(id integer, courrier_id integer, nom_fichier character varying, type_fichier character varying, chemin_fichier text, format character varying, taille bigint, est_scan boolean, created_at timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        pj.id,
        pj.courrier_id,
        pj.nom_fichier,
        pj.type_fichier,
        pj.chemin_fichier,
        pj.format,
        pj.taille,
        pj.est_scan,
        pj.created_at
    FROM piece_jointe pj
    WHERE pj.courrier_id = p_courrier_id
    ORDER BY pj.created_at DESC;
END;
$$;


ALTER FUNCTION public.fn_piece_jointe_get_by_courrier_id(p_courrier_id integer) OWNER TO postgres;

--
-- Name: fn_piece_jointe_get_by_id(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_piece_jointe_get_by_id(p_id integer) RETURNS TABLE(id integer, courrier_id integer, nom_fichier character varying, type_fichier character varying, chemin_fichier text, format character varying, taille bigint, est_scan boolean, created_at timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        pj.id,
        pj.courrier_id,
        pj.nom_fichier,
        pj.type_fichier,
        pj.chemin_fichier,
        pj.format,
        pj.taille,
        pj.est_scan,
        pj.created_at
    FROM piece_jointe pj
    WHERE pj.id = p_id;
END;
$$;


ALTER FUNCTION public.fn_piece_jointe_get_by_id(p_id integer) OWNER TO postgres;

--
-- Name: get_courriers_by_auteur_id(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_courriers_by_auteur_id(p_user_id integer) RETURNS TABLE(id integer, reference text, type text, date_courrier timestamp without time zone, expediteur text, destinataire text, objet text, description text, statut text, texte_ocr text, categorie_id integer, auteur_id integer, assigne_a integer, created_at timestamp without time zone, updated_at timestamp without time zone, date_echeance timestamp without time zone)
    LANGUAGE sql
    AS $$
    SELECT
        c.id,
        c.reference,
        c.type,
        c.date_courrier,
        c.expediteur,
        c.destinataire,
        c.objet,
        c.description,
        c.statut,
        c.texte_ocr,
        c.categorie_id,
        c.auteur_id,
        c.assigne_a,
        c.created_at,
        c.updated_at,
        c.date_echeance
    FROM courrier c
    WHERE c.auteur_id = p_user_id
    ORDER BY c.date_courrier DESC, c.created_at DESC;
$$;


ALTER FUNCTION public.get_courriers_by_auteur_id(p_user_id integer) OWNER TO postgres;

--
-- Name: sp_add_courrier(text, text, timestamp with time zone, text, text, text, text, text, text, integer, integer, integer, timestamp with time zone); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_add_courrier(p_reference text, p_type text, p_date_courrier timestamp with time zone, p_expediteur text, p_destinataire text, p_objet text, p_description text, p_statut text, p_texte_ocr text, p_categorie_id integer, p_auteur_id integer, p_assigne_a integer, p_date_echeance timestamp with time zone) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_id integer;
BEGIN
    INSERT INTO public.courrier (
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
    RETURNING id INTO new_id;

    RETURN new_id;
END;
$$;


ALTER FUNCTION public.sp_add_courrier(p_reference text, p_type text, p_date_courrier timestamp with time zone, p_expediteur text, p_destinataire text, p_objet text, p_description text, p_statut text, p_texte_ocr text, p_categorie_id integer, p_auteur_id integer, p_assigne_a integer, p_date_echeance timestamp with time zone) OWNER TO postgres;

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
-- Name: sp_add_notification(integer, character varying, text, character varying, character varying, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_add_notification(p_user_id integer, p_title character varying, p_message text, p_type character varying, p_entity_type character varying DEFAULT NULL::character varying, p_entity_id integer DEFAULT NULL::integer, p_created_by integer DEFAULT NULL::integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_id INT;
BEGIN
    INSERT INTO notifications (
        user_id,
        title,
        message,
        type,
        entity_type,
        entity_id,
        created_by,
        created_at,
        is_read
    )
    VALUES (
        p_user_id,
        p_title,
        p_message,
        p_type,
        p_entity_type,
        p_entity_id,
        p_created_by,
        NOW(),
        FALSE
    )
    RETURNING id INTO new_id;

    RETURN new_id;
END;
$$;


ALTER FUNCTION public.sp_add_notification(p_user_id integer, p_title character varying, p_message text, p_type character varying, p_entity_type character varying, p_entity_id integer, p_created_by integer) OWNER TO postgres;

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
-- Name: sp_delete_notification(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_delete_notification(p_id integer, p_user_id integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM notifications
    WHERE id = p_id
      AND user_id = p_user_id;

    RETURN FOUND;
END;
$$;


ALTER FUNCTION public.sp_delete_notification(p_id integer, p_user_id integer) OWNER TO postgres;

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
-- Name: sp_get_notifications_by_user(integer, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_get_notifications_by_user(p_user_id integer, p_only_unread boolean DEFAULT false) RETURNS TABLE(id integer, user_id integer, title character varying, message text, type character varying, entity_type character varying, entity_id integer, is_read boolean, created_by integer, created_at timestamp without time zone, read_at timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        n.id,
        n.user_id,
        n.title,
        n.message,
        n.type,
        n.entity_type,
        n.entity_id,
        n.is_read,
        n.created_by,
        n.created_at,
        n.read_at
    FROM notifications n
    WHERE n.user_id = p_user_id
      AND (p_only_unread = FALSE OR n.is_read = FALSE)
    ORDER BY n.created_at DESC;
END;
$$;


ALTER FUNCTION public.sp_get_notifications_by_user(p_user_id integer, p_only_unread boolean) OWNER TO postgres;

--
-- Name: sp_get_unread_notifications_count(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_get_unread_notifications_count(p_user_id integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    total INT;
BEGIN
    SELECT COUNT(*)
    INTO total
    FROM notifications
    WHERE user_id = p_user_id
      AND is_read = FALSE;

    RETURN total;
END;
$$;


ALTER FUNCTION public.sp_get_unread_notifications_count(p_user_id integer) OWNER TO postgres;

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
-- Name: sp_mark_all_notifications_as_read(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_mark_all_notifications_as_read(p_user_id integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE notifications
    SET
        is_read = TRUE,
        read_at = NOW()
    WHERE user_id = p_user_id
      AND is_read = FALSE;

    RETURN TRUE;
END;
$$;


ALTER FUNCTION public.sp_mark_all_notifications_as_read(p_user_id integer) OWNER TO postgres;

--
-- Name: sp_mark_notification_as_read(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_mark_notification_as_read(p_id integer, p_user_id integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE notifications
    SET
        is_read = TRUE,
        read_at = NOW()
    WHERE id = p_id
      AND user_id = p_user_id;

    RETURN FOUND;
END;
$$;


ALTER FUNCTION public.sp_mark_notification_as_read(p_id integer, p_user_id integer) OWNER TO postgres;

--
-- Name: sp_update_courrier(integer, text, text, timestamp without time zone, text, text, text, text, text, text, integer, integer, integer, timestamp without time zone); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_update_courrier(p_id integer, p_reference text, p_type text, p_date_courrier timestamp without time zone, p_expediteur text, p_destinataire text, p_objet text, p_description text, p_statut text, p_texte_ocr text, p_categorie_id integer, p_auteur_id integer, p_assigne_a integer, p_date_echeance timestamp without time zone) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE public.courrier
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


ALTER FUNCTION public.sp_update_courrier(p_id integer, p_reference text, p_type text, p_date_courrier timestamp without time zone, p_expediteur text, p_destinataire text, p_objet text, p_description text, p_statut text, p_texte_ocr text, p_categorie_id integer, p_auteur_id integer, p_assigne_a integer, p_date_echeance timestamp without time zone) OWNER TO postgres;

--
-- Name: sp_update_courrier(integer, text, text, timestamp with time zone, text, text, text, text, text, text, integer, integer, integer, timestamp with time zone); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_update_courrier(p_id integer, p_reference text, p_type text, p_date_courrier timestamp with time zone, p_expediteur text, p_destinataire text, p_objet text, p_description text, p_statut text, p_texte_ocr text, p_categorie_id integer, p_auteur_id integer, p_assigne_a integer, p_date_echeance timestamp with time zone) RETURNS integer
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE public.courrier
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

    IF FOUND THEN
        RETURN 1;
    ELSE
        RETURN 0;
    END IF;
END;
$$;


ALTER FUNCTION public.sp_update_courrier(p_id integer, p_reference text, p_type text, p_date_courrier timestamp with time zone, p_expediteur text, p_destinataire text, p_objet text, p_description text, p_statut text, p_texte_ocr text, p_categorie_id integer, p_auteur_id integer, p_assigne_a integer, p_date_echeance timestamp with time zone) OWNER TO postgres;

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
-- Name: classification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.classification (
    id integer NOT NULL,
    courrier_id integer NOT NULL,
    categorie_proposee_id integer,
    score_confiance double precision DEFAULT 0 NOT NULL,
    methode character varying(100) NOT NULL,
    validee_par_utilisateur boolean DEFAULT false NOT NULL,
    validee_par integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.classification OWNER TO postgres;

--
-- Name: classification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.classification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.classification_id_seq OWNER TO postgres;

--
-- Name: classification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.classification_id_seq OWNED BY public.classification.id;


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
-- Name: historique_statut; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historique_statut (
    id integer NOT NULL,
    courrier_id integer NOT NULL,
    ancien_statut character varying(50) NOT NULL,
    nouveau_statut character varying(50) NOT NULL,
    modifie_par integer NOT NULL,
    commentaire text,
    changed_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.historique_statut OWNER TO postgres;

--
-- Name: historique_statut_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historique_statut_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historique_statut_id_seq OWNER TO postgres;

--
-- Name: historique_statut_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historique_statut_id_seq OWNED BY public.historique_statut.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(150) NOT NULL,
    message text NOT NULL,
    type character varying(50) NOT NULL,
    entity_type character varying(50),
    entity_id integer,
    is_read boolean DEFAULT false NOT NULL,
    created_by integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    read_at timestamp without time zone
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: ocr_resultat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ocr_resultat (
    id integer NOT NULL,
    piece_jointe_id integer NOT NULL,
    texte_extrait text NOT NULL,
    confiance double precision DEFAULT 0 NOT NULL,
    corrige_manuellement boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.ocr_resultat OWNER TO postgres;

--
-- Name: ocr_resultat_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ocr_resultat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ocr_resultat_id_seq OWNER TO postgres;

--
-- Name: ocr_resultat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ocr_resultat_id_seq OWNED BY public.ocr_resultat.id;


--
-- Name: piece_jointe; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.piece_jointe (
    id integer NOT NULL,
    courrier_id integer NOT NULL,
    nom_fichier character varying(255) NOT NULL,
    type_fichier character varying(100) NOT NULL,
    chemin_fichier text NOT NULL,
    format character varying(30) NOT NULL,
    taille bigint NOT NULL,
    est_scan boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.piece_jointe OWNER TO postgres;

--
-- Name: piece_jointe_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.piece_jointe_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.piece_jointe_id_seq OWNER TO postgres;

--
-- Name: piece_jointe_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.piece_jointe_id_seq OWNED BY public.piece_jointe.id;


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
-- Name: classification id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classification ALTER COLUMN id SET DEFAULT nextval('public.classification_id_seq'::regclass);


--
-- Name: courrier id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courrier ALTER COLUMN id SET DEFAULT nextval('public.courrier_id_seq'::regclass);


--
-- Name: historique_statut id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historique_statut ALTER COLUMN id SET DEFAULT nextval('public.historique_statut_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: ocr_resultat id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ocr_resultat ALTER COLUMN id SET DEFAULT nextval('public.ocr_resultat_id_seq'::regclass);


--
-- Name: piece_jointe id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.piece_jointe ALTER COLUMN id SET DEFAULT nextval('public.piece_jointe_id_seq'::regclass);


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
-- Data for Name: classification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.classification (id, courrier_id, categorie_proposee_id, score_confiance, methode, validee_par_utilisateur, validee_par, created_at) FROM stdin;
1	8	5	95	OCR_RULE_BASED	t	2	2026-05-10 02:27:11.06833
2	9	2	95	OCR_RULE_BASED	t	2	2026-05-11 15:59:58.528423
3	10	5	95	OCR_RULE_BASED	t	2	2026-05-11 16:07:26.453963
\.


--
-- Data for Name: courrier; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courrier (id, reference, type, date_courrier, expediteur, destinataire, objet, description, statut, texte_ocr, categorie_id, auteur_id, assigne_a, created_at, updated_at, date_echeance) FROM stdin;
9	ENT-2026-009	Entrant	2026-05-11	MINISTÈRE DE L'ÉCONOMIE ET ‏كعم‎ FINANCES . - al - DIRECTION DU BUDGET Rabat, le 08 mai 2026 - DIVISION DES DÉPENSES PUBLIQUES	\N	Demande d’autorisation d’engagement de dépenses	ROYAUME DU MAROC\n\nMINISTÈRE DE L'ÉCONOMIE ET ‏كعم‎ FINANCES .\n\nal\nDIRECTION DU BUDGET Rabat, le 08 mai 2026\nDIVISION DES DÉPENSES PUBLIQUES\n\nRabat\n\nRéf:\n\nÀ Monsieur le Directeur Général\nDB/DDP/2026/0457 de la Comptabilité Publique\n\nRabat\n\nObjet : Demande d’autorisation d’engagement de dépenses\n\nau titre de l’exercice 2026.\n\nMonsieur le Directeur Général,\n\nDans le cadre de I'exécution du budget de I'Etat au titre de l’année 2026, nous avons\nI'honneur de solliciter votre bienveillante autorisation	ATraiter	ROYAUME DU MAROC\n\nMINISTÈRE DE L'ÉCONOMIE ET ‏كعم‎ FINANCES .\n\nal\nDIRECTION DU BUDGET Rabat, le 08 mai 2026\nDIVISION DES DÉPENSES PUBLIQUES\n\nRabat\n\nRéf:\n\nÀ Monsieur le Directeur Général\nDB/DDP/2026/0457 de la Comptabilité Publique\n\nRabat\n\nObjet : Demande d’autorisation d’engagement de dépenses\n\nau titre de l’exercice 2026.\n\nMonsieur le Directeur Général,\n\nDans le cadre de I'exécution du budget de I'Etat au titre de l’année 2026, nous avons\nI'honneur de solliciter votre bienveillante autorisation d’engagement des dépenses relatives\n\nà l’opération citée en objet.\n\nLes crédits nécessaires sont disponibles sur le budget du Ministère de l’Économie et des Finances,\nau titre de la rubrique suivante :\n\n \n\n| Chapitre | Article | Intitulé | Montant (MAD) |\n| 30 10 | 20 | Frais de fonctionnement et dépenses diverses | 1250 000,00 |\n\n \n\n \n\nVous trouverez ci-joint les pièces justificatives nécessaires à l’instruction de cette demande.\n\nVeuillez agréer, Monsieur le Directeur Général, l’expression de notre haute considération.\n\nLe Directeur du Budget\n\nSigné : Y. EL AMRANI DU Bpeey\n\n \n\n \n\nMinistère ‏عل‎ I'Economie et des Finances\nV, Quartier inistratif, Rabat - Maroc\nTél. : 05 37 67 74 01/02 - Fax : 05 37 67 74 20 - www.finances.gov.ma\n\nROYAUME DU MAROC\n\nMINISTÈRE DE L'ÉCONOMIE ET ‏كعم‎ FINANCES .\n\nal\nDIRECTION DU BUDGET Rabat, le 08 mai 2026\nDIVISION DES DÉPENSES PUBLIQUES\n\nRabat\n\nRéf:\n\nÀ Monsieur le Directeur Général\nDB/DDP/2026/0457 de la Comptabilité Publique\n\nRabat\n\nObjet : Demande d’autorisation d’engagement de dépenses\n\nau titre de l’exercice 2026.\n\nMonsieur le Directeur Général,\n\nDans le cadre de I'exécution du budget de I'Etat au titre de l’année 2026, nous avons\nI'honneur de solliciter votre bienveillante autorisation d’engagement des dépenses relatives\n\nà l’opération citée en objet.\n\nLes crédits nécessaires sont disponibles sur le budget du Ministère de l’Économie et des Finances,\nau titre de la rubrique suivante :\n\n \n\n| Chapitre | Article | Intitulé | Montant (MAD) |\n| 30 10 | 20 | Frais de fonctionnement et dépenses diverses | 1250 000,00 |\n\n \n\n \n\nVous trouverez ci-joint les pièces justificatives nécessaires à l’instruction de cette demande.\n\nVeuillez agréer, Monsieur le Directeur Général, l’expression de notre haute considération.\n\nLe Directeur du Budget\n\nSigné : Y. EL AMRANI DU Bpeey\n\n \n\n \n\nMinistère ‏عل‎ I'Economie et des Finances\nV, Quartier inistratif, Rabat - Maroc\nTél. : 05 37 67 74 01/02 - Fax : 05 37 67 74 20 - www.finances.gov.ma	2	2	3	2026-05-11 15:59:58.043444	2026-05-11 15:59:58.528423	2026-08-01 00:00:00
1	COUR-2026-001	Entrant	2026-05-03	Ministère de l'Éducation	Bureau d'Ordre	Mise à jour du dossier administratif	Courrier mis à jour concernant le suivi du dossier administratif.	Archive	Mise à jour du dossier administratif envoyée par le Ministère de l'Éducation au Bureau d'Ordre.	1	3	2	2026-05-03 06:50:49.962996	2026-05-03 14:54:45.934794	2026-05-15 18:00:00
6	COUR-2026-004	Entrant	2026-05-04	Ministère de l'Éducation	Bureau d'Ordre	Demande de suivi d'un dossier administratif	Courrier concernant le suivi et le traitement d'un dossier administratif urgent.	ATraiter	Demande de suivi d'un dossier administratif envoyée par le Ministère de l'Éducation au Bureau d'Ordre.	1	2	1	2026-05-04 22:53:26.920589	2026-05-04 22:53:26.920589	2026-05-15 18:00:00
7	COUR-2026-005	Entrant	2026-05-04	Ministère de l'Éducation	Bureau d'Ordre	Demande de suivi d'un dossier administratif	Courrier concernant le suivi et le traitement d'un dossier administratif urgent.	ATraiter	Demande de suivi d'un dossier administratif envoyée par le Ministère de l'Éducation au Bureau d'Ordre.	1	2	3	2026-05-04 22:54:28.782395	2026-05-04 22:54:28.782395	2026-05-15 18:00:00
8	BO-IN-2026-0247	Entrant	2026-05-10	Ministère de l'Éducation Nationale Rabat, le 24 Mars 2026 - Direction des Ressources Humaines	\N	Demande de congé exceptionnel	Royaume du Maroc\nMinistère de l'Éducation Nationale Rabat, le 24 Mars 2026\nDirection des Ressources Humaines\n\nRéf : BO-IN-2026-0247\n\nÀ Monsieur le Directeur\nAcadémie Régionale de Casablanca-Settat\n\nObjet : Demande de congé exceptionnel\n\nMonsieur le Directeur,\n\nJ'ai l'honneur de vous soumettre ma demande de congé exceptionnel pour une\npériode de 6 jours ouvrables, du 25 au 30 mars 2026, pour des raisons familiales\nurgentes.\n\nJe vous prie de bien vouloir examiner favorablement cette demande. Vous	ATraiter	Royaume du Maroc\nMinistère de l'Éducation Nationale Rabat, le 24 Mars 2026\nDirection des Ressources Humaines\n\nRéf : BO-IN-2026-0247\n\nÀ Monsieur le Directeur\nAcadémie Régionale de Casablanca-Settat\n\nObjet : Demande de congé exceptionnel\n\nMonsieur le Directeur,\n\nJ'ai l'honneur de vous soumettre ma demande de congé exceptionnel pour une\npériode de 6 jours ouvrables, du 25 au 30 mars 2026, pour des raisons familiales\nurgentes.\n\nJe vous prie de bien vouloir examiner favorablement cette demande. Vous trouverez\nci-joint les pièces justificatives nécessaires.\n\nDans l'attente de votre accord, veuillez agréer, Monsieur le Directeur, l'expression\nde ma considération distinguée.\n\nAhmed Benali\nAgent administratif\nDirection des Ressources Humaines\n\nRessources | o, ÂM 1\nHumaines\n\nPièces jointes : justificatif médical, formulaire de demande signé\n\nRoyaume du Maroc\nMinistère de l'Éducation Nationale Rabat, le 24 Mars 2026\nDirection des Ressources Humaines\n\nRéf : BO-IN-2026-0247\n\nÀ Monsieur le Directeur\nAcadémie Régionale de Casablanca-Settat\n\nObjet : Demande de congé exceptionnel\n\nMonsieur le Directeur,\n\nJ'ai l'honneur de vous soumettre ma demande de congé exceptionnel pour une\npériode de 6 jours ouvrables, du 25 au 30 mars 2026, pour des raisons familiales\nurgentes.\n\nJe vous prie de bien vouloir examiner favorablement cette demande. Vous trouverez\nci-joint les pièces justificatives nécessaires.\n\nDans l'attente de votre accord, veuillez agréer, Monsieur le Directeur, l'expression\nde ma considération distinguée.\n\nAhmed Benali\nAgent administratif\nDirection des Ressources Humaines\n\nRessources | o, ÂM 1\nHumaines\n\nPièces jointes : justificatif médical, formulaire de demande signé	5	2	3	2026-05-10 02:27:10.961728	2026-05-10 02:27:11.06833	2026-06-06 00:00:00
4	COUR-2026-003	Entrant	2026-05-03	Ministère de l'Éducation	\N	Demande de suivi d'un dossier administratif	Courrier concernant le suivi et le traitement d'un dossier administratif urgent.	Archive	Demande de suivi d'un dossier administratif envoyée par le Ministère de l'Éducation au Bureau d'Ordre.	1	3	2	2026-05-04 22:14:42.727	2026-05-11 11:01:02.442124	2026-05-16 00:00:00
10	BO-IN-2026-0248	Sortant	2026-05-11	\N	Rabat	Demande de congé exceptionnel	Royaume du Maroc\nMinistère de l'Éducation Nationale Rabat, le 24 Mars 2026\nDirection des Ressources Humaines\n\nRéf : BO-IN-2026-0247\n\nÀ Monsieur le Directeur\nAcadémie Régionale de Casablanca-Settat\n\nObjet : Demande de congé exceptionnel\n\nMonsieur le Directeur,\n\nJ'ai l'honneur de vous soumettre ma demande de congé exceptionnel pour une\npériode de 6 jours ouvrables, du 25 au 30 mars 2026, pour des raisons familiales\nurgentes.\n\nJe vous prie de bien vouloir examiner favorablement cette demande. Vous	ATraiter	Royaume du Maroc\nMinistère de l'Éducation Nationale Rabat, le 24 Mars 2026\nDirection des Ressources Humaines\n\nRéf : BO-IN-2026-0247\n\nÀ Monsieur le Directeur\nAcadémie Régionale de Casablanca-Settat\n\nObjet : Demande de congé exceptionnel\n\nMonsieur le Directeur,\n\nJ'ai l'honneur de vous soumettre ma demande de congé exceptionnel pour une\npériode de 6 jours ouvrables, du 25 au 30 mars 2026, pour des raisons familiales\nurgentes.\n\nJe vous prie de bien vouloir examiner favorablement cette demande. Vous trouverez\nci-joint les pièces justificatives nécessaires.\n\nDans l'attente de votre accord, veuillez agréer, Monsieur le Directeur, l'expression\nde ma considération distinguée.\n\nAhmed Benali\nAgent administratif\nDirection des Ressources Humaines\n\nRessources | o, ÂM 1\nHumaines\n\nPièces jointes : justificatif médical, formulaire de demande signé\n\nRoyaume du Maroc\nMinistère de l'Éducation Nationale Rabat, le 24 Mars 2026\nDirection des Ressources Humaines\n\nRéf : BO-IN-2026-0247\n\nÀ Monsieur le Directeur\nAcadémie Régionale de Casablanca-Settat\n\nObjet : Demande de congé exceptionnel\n\nMonsieur le Directeur,\n\nJ'ai l'honneur de vous soumettre ma demande de congé exceptionnel pour une\npériode de 6 jours ouvrables, du 25 au 30 mars 2026, pour des raisons familiales\nurgentes.\n\nJe vous prie de bien vouloir examiner favorablement cette demande. Vous trouverez\nci-joint les pièces justificatives nécessaires.\n\nDans l'attente de votre accord, veuillez agréer, Monsieur le Directeur, l'expression\nde ma considération distinguée.\n\nAhmed Benali\nAgent administratif\nDirection des Ressources Humaines\n\nRessources | o, ÂM 1\nHumaines\n\nPièces jointes : justificatif médical, formulaire de demande signé	5	2	\N	2026-05-11 16:07:26.325711	2026-05-11 16:07:26.453963	2026-09-18 00:00:00
\.


--
-- Data for Name: historique_statut; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historique_statut (id, courrier_id, ancien_statut, nouveau_statut, modifie_par, commentaire, changed_at) FROM stdin;
1	4	ATraiter	Archive	2	\N	2026-05-07 23:17:43.428971
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, title, message, type, entity_type, entity_id, is_read, created_by, created_at, read_at) FROM stdin;
1	2	Nouveau courrier assigné	Le courrier COUR-2026-003 vous a été assigné.	CourrierAssigned	Courrier	4	f	3	2026-05-04 22:14:42.769012	\N
2	1	Nouveau courrier assigné	Le courrier COUR-2026-004 vous a été assigné.	CourrierAssigned	Courrier	6	f	2	2026-05-04 22:53:26.927074	\N
3	3	Nouveau courrier assigné	Le courrier COUR-2026-005 vous a été assigné.	CourrierAssigned	Courrier	7	t	2	2026-05-04 22:54:28.785798	2026-05-04 22:55:17.455373
4	2	Statut du courrier modifié	Le statut du courrier COUR-2026-003 est maintenant Archive.	CourrierStatusChanged	Courrier	4	f	2	2026-05-07 23:17:43.485274	\N
5	3	Statut du courrier modifié	Le statut du courrier COUR-2026-003 est maintenant Archive.	CourrierStatusChanged	Courrier	4	t	2	2026-05-07 23:17:43.490233	2026-05-09 19:50:55.650884
6	3	Nouveau courrier assigné	Le courrier BO-IN-2026-0247 vous a été assigné.	CourrierAssigned	Courrier	8	t	2	2026-05-10 02:27:10.981855	2026-05-10 02:27:41.602472
7	3	Nouveau courrier assigné	Le courrier ENT-2026-009 vous a été assigné.	CourrierAssigned	Courrier	9	f	2	2026-05-11 15:59:58.108252	\N
\.


--
-- Data for Name: ocr_resultat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ocr_resultat (id, piece_jointe_id, texte_extrait, confiance, corrige_manuellement, created_at, updated_at) FROM stdin;
1	1	Royaume du Maroc\nMinistère de l'Éducation Nationale Rabat, le 24 Mars 2026\nDirection des Ressources Humaines\n\nRéf : BO-IN-2026-0247\n\nÀ Monsieur le Directeur\nAcadémie Régionale de Casablanca-Settat\n\nObjet : Demande de congé exceptionnel\n\nMonsieur le Directeur,\n\nJ'ai l'honneur de vous soumettre ma demande de congé exceptionnel pour une\npériode de 6 jours ouvrables, du 25 au 30 mars 2026, pour des raisons familiales\nurgentes.\n\nJe vous prie de bien vouloir examiner favorablement cette demande. Vous trouverez\nci-joint les pièces justificatives nécessaires.\n\nDans l'attente de votre accord, veuillez agréer, Monsieur le Directeur, l'expression\nde ma considération distinguée.\n\nAhmed Benali\nAgent administratif\nDirection des Ressources Humaines\n\nRessources | o, ÂM 1\nHumaines\n\nPièces jointes : justificatif médical, formulaire de demande signé	91	f	2026-05-10 02:27:11.06833	2026-05-10 02:27:11.06833
2	2	ROYAUME DU MAROC\n\nMINISTÈRE DE L'ÉCONOMIE ET ‏كعم‎ FINANCES .\n\nal\nDIRECTION DU BUDGET Rabat, le 08 mai 2026\nDIVISION DES DÉPENSES PUBLIQUES\n\nRabat\n\nRéf:\n\nÀ Monsieur le Directeur Général\nDB/DDP/2026/0457 de la Comptabilité Publique\n\nRabat\n\nObjet : Demande d’autorisation d’engagement de dépenses\n\nau titre de l’exercice 2026.\n\nMonsieur le Directeur Général,\n\nDans le cadre de I'exécution du budget de I'Etat au titre de l’année 2026, nous avons\nI'honneur de solliciter votre bienveillante autorisation d’engagement des dépenses relatives\n\nà l’opération citée en objet.\n\nLes crédits nécessaires sont disponibles sur le budget du Ministère de l’Économie et des Finances,\nau titre de la rubrique suivante :\n\n \n\n| Chapitre | Article | Intitulé | Montant (MAD) |\n| 30 10 | 20 | Frais de fonctionnement et dépenses diverses | 1250 000,00 |\n\n \n\n \n\nVous trouverez ci-joint les pièces justificatives nécessaires à l’instruction de cette demande.\n\nVeuillez agréer, Monsieur le Directeur Général, l’expression de notre haute considération.\n\nLe Directeur du Budget\n\nSigné : Y. EL AMRANI DU Bpeey\n\n \n\n \n\nMinistère ‏عل‎ I'Economie et des Finances\nV, Quartier inistratif, Rabat - Maroc\nTél. : 05 37 67 74 01/02 - Fax : 05 37 67 74 20 - www.finances.gov.ma	89	f	2026-05-11 15:59:58.528423	2026-05-11 15:59:58.528423
3	3	Royaume du Maroc\nMinistère de l'Éducation Nationale Rabat, le 24 Mars 2026\nDirection des Ressources Humaines\n\nRéf : BO-IN-2026-0247\n\nÀ Monsieur le Directeur\nAcadémie Régionale de Casablanca-Settat\n\nObjet : Demande de congé exceptionnel\n\nMonsieur le Directeur,\n\nJ'ai l'honneur de vous soumettre ma demande de congé exceptionnel pour une\npériode de 6 jours ouvrables, du 25 au 30 mars 2026, pour des raisons familiales\nurgentes.\n\nJe vous prie de bien vouloir examiner favorablement cette demande. Vous trouverez\nci-joint les pièces justificatives nécessaires.\n\nDans l'attente de votre accord, veuillez agréer, Monsieur le Directeur, l'expression\nde ma considération distinguée.\n\nAhmed Benali\nAgent administratif\nDirection des Ressources Humaines\n\nRessources | o, ÂM 1\nHumaines\n\nPièces jointes : justificatif médical, formulaire de demande signé	91	f	2026-05-11 16:07:26.453963	2026-05-11 16:07:26.453963
\.


--
-- Data for Name: piece_jointe; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.piece_jointe (id, courrier_id, nom_fichier, type_fichier, chemin_fichier, format, taille, est_scan, created_at) FROM stdin;
1	8	OCR!.png	image/png	uploads/courriers/8/9209fa12-ae11-45b1-8d49-3b32c78974ac.png	png	1067130	t	2026-05-10 02:27:11.041418
2	9	OCr.png	image/png	uploads/courriers/9/17995acf-2347-4086-9175-dba61e101f58.png	png	1245939	t	2026-05-11 15:59:58.373621
3	10	OCR!.png	image/png	uploads/courriers/10/0951f3fe-ba98-457f-bce3-26f6cf769f79.png	png	1067130	t	2026-05-11 16:07:26.429218
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
-- Name: classification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.classification_id_seq', 3, true);


--
-- Name: courrier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courrier_id_seq', 10, true);


--
-- Name: historique_statut_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historique_statut_id_seq', 1, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 7, true);


--
-- Name: ocr_resultat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ocr_resultat_id_seq', 3, true);


--
-- Name: piece_jointe_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.piece_jointe_id_seq', 3, true);


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
-- Name: classification classification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classification
    ADD CONSTRAINT classification_pkey PRIMARY KEY (id);


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
-- Name: historique_statut historique_statut_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historique_statut
    ADD CONSTRAINT historique_statut_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: ocr_resultat ocr_resultat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ocr_resultat
    ADD CONSTRAINT ocr_resultat_pkey PRIMARY KEY (id);


--
-- Name: piece_jointe piece_jointe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.piece_jointe
    ADD CONSTRAINT piece_jointe_pkey PRIMARY KEY (id);


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
-- Name: idx_classification_categorie_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_classification_categorie_id ON public.classification USING btree (categorie_proposee_id);


--
-- Name: idx_classification_courrier_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_classification_courrier_id ON public.classification USING btree (courrier_id);


--
-- Name: idx_historique_statut_courrier_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_historique_statut_courrier_id ON public.historique_statut USING btree (courrier_id);


--
-- Name: idx_ocr_resultat_piece_jointe_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ocr_resultat_piece_jointe_id ON public.ocr_resultat USING btree (piece_jointe_id);


--
-- Name: idx_piece_jointe_courrier_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_piece_jointe_courrier_id ON public.piece_jointe USING btree (courrier_id);


--
-- Name: courrier trigger_update_courrier_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_courrier_updated_at BEFORE UPDATE ON public.courrier FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: classification classification_categorie_proposee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classification
    ADD CONSTRAINT classification_categorie_proposee_id_fkey FOREIGN KEY (categorie_proposee_id) REFERENCES public.categorie(id);


--
-- Name: classification classification_courrier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classification
    ADD CONSTRAINT classification_courrier_id_fkey FOREIGN KEY (courrier_id) REFERENCES public.courrier(id) ON DELETE CASCADE;


--
-- Name: classification classification_validee_par_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classification
    ADD CONSTRAINT classification_validee_par_fkey FOREIGN KEY (validee_par) REFERENCES public.users(id);


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
-- Name: historique_statut historique_statut_courrier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historique_statut
    ADD CONSTRAINT historique_statut_courrier_id_fkey FOREIGN KEY (courrier_id) REFERENCES public.courrier(id) ON DELETE CASCADE;


--
-- Name: historique_statut historique_statut_modifie_par_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historique_statut
    ADD CONSTRAINT historique_statut_modifie_par_fkey FOREIGN KEY (modifie_par) REFERENCES public.users(id);


--
-- Name: ocr_resultat ocr_resultat_piece_jointe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ocr_resultat
    ADD CONSTRAINT ocr_resultat_piece_jointe_id_fkey FOREIGN KEY (piece_jointe_id) REFERENCES public.piece_jointe(id) ON DELETE CASCADE;


--
-- Name: piece_jointe piece_jointe_courrier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.piece_jointe
    ADD CONSTRAINT piece_jointe_courrier_id_fkey FOREIGN KEY (courrier_id) REFERENCES public.courrier(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict cKFQLdRigo2YaGY7GWSGYY0JqxTvyAETKS9YpRT25EDaahNWcK3InfSFe2GSoZP

