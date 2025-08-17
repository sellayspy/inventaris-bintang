--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';


--
-- Name: asal_barang; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.asal_barang (
    id bigint NOT NULL,
    nama character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: asal_barang_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.asal_barang_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: asal_barang_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.asal_barang_id_seq OWNED BY public.asal_barang.id;


--
-- Name: barang; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.barang (
    id bigint NOT NULL,
    jenis_barang_id bigint NOT NULL,
    asal_id bigint,
    lokasi_id bigint,
    serial_number character varying(255) NOT NULL,
    kondisi_awal character varying(255) DEFAULT 'baru'::character varying NOT NULL,
    status character varying(255) DEFAULT 'baik'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    model_id bigint NOT NULL,
    rak_id bigint,
    CONSTRAINT barang_kondisi_awal_check CHECK (((kondisi_awal)::text = ANY ((ARRAY['baru'::character varying, 'second'::character varying])::text[]))),
    CONSTRAINT barang_status_check CHECK (((status)::text = ANY (ARRAY[('baik'::character varying)::text, ('bagus'::character varying)::text, ('rusak'::character varying)::text, ('diperbaiki'::character varying)::text, ('dipinjamkan'::character varying)::text, ('dijual'::character varying)::text, ('dimusnahkan'::character varying)::text, ('menunggu'::character varying)::text])))
);


--
-- Name: barang_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.barang_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: barang_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.barang_id_seq OWNED BY public.barang.id;


--
-- Name: barang_keluar; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.barang_keluar (
    id bigint NOT NULL,
    tanggal date NOT NULL,
    lokasi_id bigint NOT NULL,
    user_id bigint,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: barang_keluar_detail; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.barang_keluar_detail (
    id bigint NOT NULL,
    barang_keluar_id bigint NOT NULL,
    barang_id bigint NOT NULL,
    status_keluar character varying(255) DEFAULT 'dipinjamkan'::character varying NOT NULL,
    CONSTRAINT barang_keluar_detail_status_keluar_check CHECK (((status_keluar)::text = ANY ((ARRAY['dipinjamkan'::character varying, 'dijual'::character varying])::text[])))
);


--
-- Name: barang_keluar_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.barang_keluar_detail_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: barang_keluar_detail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.barang_keluar_detail_id_seq OWNED BY public.barang_keluar_detail.id;


--
-- Name: barang_keluar_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.barang_keluar_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: barang_keluar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.barang_keluar_id_seq OWNED BY public.barang_keluar.id;


--
-- Name: barang_kembali; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.barang_kembali (
    id bigint NOT NULL,
    tanggal date NOT NULL,
    lokasi_id bigint NOT NULL,
    user_id bigint,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: barang_kembali_detail; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.barang_kembali_detail (
    id bigint NOT NULL,
    barang_kembali_id bigint NOT NULL,
    barang_id bigint NOT NULL,
    kondisi character varying(255) DEFAULT 'bagus'::character varying NOT NULL,
    status_saat_kembali character varying(255),
    kondisi_awal_saat_kembali character varying(255),
    CONSTRAINT barang_kembali_detail_kondisi_check CHECK (((kondisi)::text = ANY ((ARRAY['bagus'::character varying, 'rusak'::character varying, 'diperbaiki'::character varying])::text[])))
);


--
-- Name: barang_kembali_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.barang_kembali_detail_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: barang_kembali_detail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.barang_kembali_detail_id_seq OWNED BY public.barang_kembali_detail.id;


--
-- Name: barang_kembali_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.barang_kembali_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: barang_kembali_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.barang_kembali_id_seq OWNED BY public.barang_kembali.id;


--
-- Name: barang_masuk; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.barang_masuk (
    id bigint NOT NULL,
    tanggal date NOT NULL,
    asal_barang_id bigint,
    user_id bigint,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: barang_masuk_detail; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.barang_masuk_detail (
    id bigint NOT NULL,
    barang_masuk_id bigint NOT NULL,
    barang_id bigint NOT NULL
);


--
-- Name: barang_masuk_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.barang_masuk_detail_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: barang_masuk_detail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.barang_masuk_detail_id_seq OWNED BY public.barang_masuk_detail.id;


--
-- Name: barang_masuk_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.barang_masuk_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: barang_masuk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.barang_masuk_id_seq OWNED BY public.barang_masuk.id;


--
-- Name: barang_pemusnahan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.barang_pemusnahan (
    id bigint NOT NULL,
    pemusnahan_id bigint NOT NULL,
    barang_id bigint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: barang_pemusnahan_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.barang_pemusnahan_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: barang_pemusnahan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.barang_pemusnahan_id_seq OWNED BY public.barang_pemusnahan.id;


--
-- Name: cache; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration integer NOT NULL
);


--
-- Name: cache_locks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration integer NOT NULL
);


--
-- Name: failed_jobs; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;


--
-- Name: jenis_barang; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jenis_barang (
    id bigint NOT NULL,
    nama character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    kategori_id bigint
);


--
-- Name: jenis_barang_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jenis_barang_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jenis_barang_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jenis_barang_id_seq OWNED BY public.jenis_barang.id;


--
-- Name: job_batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);


--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: kategori_barang; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kategori_barang (
    id bigint NOT NULL,
    nama character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: kategori_barang_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.kategori_barang_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: kategori_barang_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.kategori_barang_id_seq OWNED BY public.kategori_barang.id;


--
-- Name: lokasi; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lokasi (
    id bigint NOT NULL,
    nama character varying(255) NOT NULL,
    alamat text,
    is_gudang boolean DEFAULT false NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: lokasi_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lokasi_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: lokasi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lokasi_id_seq OWNED BY public.lokasi.id;


--
-- Name: merek_barang; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.merek_barang (
    id bigint NOT NULL,
    nama character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: merek_barang_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.merek_barang_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: merek_barang_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.merek_barang_id_seq OWNED BY public.merek_barang.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: model_barang; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.model_barang (
    id bigint NOT NULL,
    kategori_id bigint NOT NULL,
    merek_id bigint NOT NULL,
    nama character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    jenis_id bigint,
    deskripsi character varying(255),
    label character varying(255)
);


--
-- Name: model_barang_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.model_barang_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: model_barang_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.model_barang_id_seq OWNED BY public.model_barang.id;


--
-- Name: model_has_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.model_has_permissions (
    permission_id bigint NOT NULL,
    model_type character varying(255) NOT NULL,
    model_id bigint NOT NULL
);


--
-- Name: model_has_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.model_has_roles (
    role_id bigint NOT NULL,
    model_type character varying(255) NOT NULL,
    model_id bigint NOT NULL
);


--
-- Name: mutasi_barang; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mutasi_barang (
    id bigint NOT NULL,
    barang_id bigint NOT NULL,
    lokasi_asal_id bigint,
    lokasi_tujuan_id bigint,
    user_id bigint,
    tanggal date NOT NULL,
    keterangan character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: mutasi_barang_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mutasi_barang_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mutasi_barang_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mutasi_barang_id_seq OWNED BY public.mutasi_barang.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);


--
-- Name: pemusnahan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pemusnahan (
    id bigint NOT NULL,
    kode_pemusnahaan character varying(255) NOT NULL,
    user_id bigint NOT NULL,
    tanggal_pemusnahaan date,
    alasan text,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    approved_by bigint,
    dokumen_bukti character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT pemusnahan_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[])))
);


--
-- Name: pemusnahan_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pemusnahan_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pemusnahan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pemusnahan_id_seq OWNED BY public.pemusnahan.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    guard_name character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    is_system boolean DEFAULT false NOT NULL
);


--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- Name: rak_barang; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rak_barang (
    id bigint NOT NULL,
    lokasi_id bigint NOT NULL,
    nama_rak character varying(255) NOT NULL,
    baris character varying(255),
    kode_rak character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: rak_barang_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rak_barang_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rak_barang_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rak_barang_id_seq OWNED BY public.rak_barang.id;


--
-- Name: rekap_stok_barang; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rekap_stok_barang (
    id bigint NOT NULL,
    lokasi_id bigint NOT NULL,
    jumlah_total integer DEFAULT 0 NOT NULL,
    jumlah_tersedia integer DEFAULT 0 NOT NULL,
    jumlah_rusak integer DEFAULT 0 NOT NULL,
    jumlah_perbaikan integer DEFAULT 0 NOT NULL,
    jumlah_terdistribusi integer DEFAULT 0 NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    model_id bigint NOT NULL,
    jumlah_terjual integer DEFAULT 0 NOT NULL
);


--
-- Name: rekap_stok_barang_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rekap_stok_barang_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rekap_stok_barang_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rekap_stok_barang_id_seq OWNED BY public.rekap_stok_barang.id;


--
-- Name: riwayat_status_barang; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.riwayat_status_barang (
    id bigint NOT NULL,
    barang_id bigint NOT NULL,
    user_id bigint,
    tanggal date NOT NULL,
    status character varying(255) NOT NULL,
    catatan character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT riwayat_status_barang_status_check CHECK (((status)::text = ANY ((ARRAY['baik'::character varying, 'rusak'::character varying, 'diperbaiki'::character varying])::text[])))
);


--
-- Name: riwayat_status_barang_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.riwayat_status_barang_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: riwayat_status_barang_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.riwayat_status_barang_id_seq OWNED BY public.riwayat_status_barang.id;


--
-- Name: role_has_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_has_permissions (
    permission_id bigint NOT NULL,
    role_id bigint NOT NULL
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    guard_name character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id bigint,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);


--
-- Name: stock_opname; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stock_opname (
    id bigint NOT NULL,
    tanggal date NOT NULL,
    lokasi_id bigint NOT NULL,
    user_id bigint,
    catatan character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    approved_by bigint,
    approved_at timestamp(0) without time zone
);


--
-- Name: stock_opname_detail; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stock_opname_detail (
    id bigint NOT NULL,
    stock_opname_id bigint NOT NULL,
    model_id bigint NOT NULL,
    jumlah_sistem integer NOT NULL,
    jumlah_fisik integer NOT NULL,
    selisih integer NOT NULL,
    catatan character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    serial_hilang json,
    serial_baru json
);


--
-- Name: stock_opname_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stock_opname_detail_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stock_opname_detail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stock_opname_detail_id_seq OWNED BY public.stock_opname_detail.id;


--
-- Name: stock_opname_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stock_opname_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stock_opname_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stock_opname_id_seq OWNED BY public.stock_opname.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: view_barang_keluar; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.view_barang_keluar AS
 SELECT bk.id AS transaksi_id,
    bk.tanggal,
    l.nama AS lokasi_tujuan,
    l.id AS lokasi_id,
    u.name AS nama_user,
    b.serial_number,
    mb.nama AS model,
    mb.nama AS merek,
    kb.nama AS kategori,
    kb.id AS kategori_id,
    bkd.status_keluar,
    bkd.id AS detail_id
   FROM ((((((public.barang_keluar bk
     JOIN public.barang_keluar_detail bkd ON ((bkd.barang_keluar_id = bk.id)))
     JOIN public.barang b ON ((b.id = bkd.barang_id)))
     JOIN public.model_barang mb ON ((mb.id = b.model_id)))
     JOIN public.kategori_barang kb ON ((kb.id = mb.kategori_id)))
     JOIN public.lokasi l ON ((l.id = bk.lokasi_id)))
     LEFT JOIN public.users u ON ((u.id = bk.user_id)));


--
-- Name: view_barang_kembali; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.view_barang_kembali AS
 SELECT bk.id AS transaksi_id,
    bk.tanggal,
    l.nama AS lokasi_nama,
    l.id AS lokasi_id,
    u.name AS nama_user,
    b.serial_number,
    mb.nama AS model,
    mk.nama AS merek,
    kb.nama AS kategori,
    kb.id AS kategori_id,
    jb.nama AS jenis,
    bkd.kondisi,
    bkd.status_saat_kembali,
    bkd.kondisi_awal_saat_kembali,
    bkd.id AS detail_id
   FROM ((((((((public.barang_kembali bk
     JOIN public.barang_kembali_detail bkd ON ((bkd.barang_kembali_id = bk.id)))
     JOIN public.barang b ON ((b.id = bkd.barang_id)))
     JOIN public.model_barang mb ON ((mb.id = b.model_id)))
     JOIN public.kategori_barang kb ON ((kb.id = mb.kategori_id)))
     JOIN public.merek_barang mk ON ((mk.id = mb.merek_id)))
     LEFT JOIN public.jenis_barang jb ON ((jb.id = mb.jenis_id)))
     JOIN public.lokasi l ON ((l.id = bk.lokasi_id)))
     LEFT JOIN public.users u ON ((u.id = bk.user_id)));


--
-- Name: view_barang_masuk; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.view_barang_masuk AS
 SELECT bm.id AS transaksi_id,
    bm.tanggal,
    ab.nama AS asal_barang,
    u.name AS nama_user,
    b.serial_number,
    mb.nama AS model,
    mk.nama AS merek,
    k.nama AS kategori
   FROM (((((((public.barang_masuk bm
     JOIN public.barang_masuk_detail bmd ON ((bm.id = bmd.barang_masuk_id)))
     JOIN public.barang b ON ((b.id = bmd.barang_id)))
     JOIN public.model_barang mb ON ((b.model_id = mb.id)))
     JOIN public.merek_barang mk ON ((mb.merek_id = mk.id)))
     JOIN public.kategori_barang k ON ((mb.kategori_id = k.id)))
     LEFT JOIN public.users u ON ((bm.user_id = u.id)))
     LEFT JOIN public.asal_barang ab ON ((bm.asal_barang_id = ab.id)));


--
-- Name: view_laporan_stok; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.view_laporan_stok AS
 SELECT rsb.id AS rekap_id,
    m.nama AS model,
    mk.nama AS merek,
    k.nama AS kategori,
    l.nama AS lokasi,
    rsb.jumlah_total,
    rsb.jumlah_tersedia,
    rsb.jumlah_rusak,
    rsb.jumlah_perbaikan,
    rsb.jumlah_terdistribusi
   FROM ((((public.rekap_stok_barang rsb
     JOIN public.model_barang m ON ((rsb.model_id = m.id)))
     JOIN public.merek_barang mk ON ((m.merek_id = mk.id)))
     JOIN public.kategori_barang k ON ((m.kategori_id = k.id)))
     JOIN public.lokasi l ON ((rsb.lokasi_id = l.id)));


--
-- Name: view_mutasi_barang; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.view_mutasi_barang AS
 SELECT mb.id AS mutasi_id,
    b.serial_number,
    mdl.nama AS model,
    mk.nama AS merek,
    k.nama AS kategori,
    lo.nama AS lokasi_asal,
    lt.nama AS lokasi_tujuan,
    u.name AS nama_user,
    mb.tanggal,
    mb.keterangan
   FROM (((((((public.mutasi_barang mb
     JOIN public.barang b ON ((b.id = mb.barang_id)))
     JOIN public.model_barang mdl ON ((b.model_id = mdl.id)))
     JOIN public.merek_barang mk ON ((mdl.merek_id = mk.id)))
     JOIN public.kategori_barang k ON ((mdl.kategori_id = k.id)))
     LEFT JOIN public.lokasi lo ON ((mb.lokasi_asal_id = lo.id)))
     LEFT JOIN public.lokasi lt ON ((mb.lokasi_tujuan_id = lt.id)))
     LEFT JOIN public.users u ON ((mb.user_id = u.id)));


--
-- Name: view_riwayat_status_barang; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.view_riwayat_status_barang AS
 SELECT rsb.id,
    b.serial_number,
    mb.nama AS model,
    mk.nama AS merek,
    k.nama AS kategori,
    rsb.status,
    rsb.tanggal,
    rsb.catatan,
    u.name AS nama_user
   FROM (((((public.riwayat_status_barang rsb
     JOIN public.barang b ON ((b.id = rsb.barang_id)))
     JOIN public.model_barang mb ON ((b.model_id = mb.id)))
     JOIN public.merek_barang mk ON ((mb.merek_id = mk.id)))
     JOIN public.kategori_barang k ON ((mb.kategori_id = k.id)))
     LEFT JOIN public.users u ON ((rsb.user_id = u.id)));


--
-- Name: asal_barang id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asal_barang ALTER COLUMN id SET DEFAULT nextval('public.asal_barang_id_seq'::regclass);


--
-- Name: barang id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang ALTER COLUMN id SET DEFAULT nextval('public.barang_id_seq'::regclass);


--
-- Name: barang_keluar id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_keluar ALTER COLUMN id SET DEFAULT nextval('public.barang_keluar_id_seq'::regclass);


--
-- Name: barang_keluar_detail id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_keluar_detail ALTER COLUMN id SET DEFAULT nextval('public.barang_keluar_detail_id_seq'::regclass);


--
-- Name: barang_kembali id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_kembali ALTER COLUMN id SET DEFAULT nextval('public.barang_kembali_id_seq'::regclass);


--
-- Name: barang_kembali_detail id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_kembali_detail ALTER COLUMN id SET DEFAULT nextval('public.barang_kembali_detail_id_seq'::regclass);


--
-- Name: barang_masuk id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_masuk ALTER COLUMN id SET DEFAULT nextval('public.barang_masuk_id_seq'::regclass);


--
-- Name: barang_masuk_detail id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_masuk_detail ALTER COLUMN id SET DEFAULT nextval('public.barang_masuk_detail_id_seq'::regclass);


--
-- Name: barang_pemusnahan id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_pemusnahan ALTER COLUMN id SET DEFAULT nextval('public.barang_pemusnahan_id_seq'::regclass);


--
-- Name: failed_jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);


--
-- Name: jenis_barang id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jenis_barang ALTER COLUMN id SET DEFAULT nextval('public.jenis_barang_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: kategori_barang id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kategori_barang ALTER COLUMN id SET DEFAULT nextval('public.kategori_barang_id_seq'::regclass);


--
-- Name: lokasi id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lokasi ALTER COLUMN id SET DEFAULT nextval('public.lokasi_id_seq'::regclass);


--
-- Name: merek_barang id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.merek_barang ALTER COLUMN id SET DEFAULT nextval('public.merek_barang_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: model_barang id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.model_barang ALTER COLUMN id SET DEFAULT nextval('public.model_barang_id_seq'::regclass);


--
-- Name: mutasi_barang id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mutasi_barang ALTER COLUMN id SET DEFAULT nextval('public.mutasi_barang_id_seq'::regclass);


--
-- Name: pemusnahan id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pemusnahan ALTER COLUMN id SET DEFAULT nextval('public.pemusnahan_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: rak_barang id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rak_barang ALTER COLUMN id SET DEFAULT nextval('public.rak_barang_id_seq'::regclass);


--
-- Name: rekap_stok_barang id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rekap_stok_barang ALTER COLUMN id SET DEFAULT nextval('public.rekap_stok_barang_id_seq'::regclass);


--
-- Name: riwayat_status_barang id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.riwayat_status_barang ALTER COLUMN id SET DEFAULT nextval('public.riwayat_status_barang_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: stock_opname id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_opname ALTER COLUMN id SET DEFAULT nextval('public.stock_opname_id_seq'::regclass);


--
-- Name: stock_opname_detail id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_opname_detail ALTER COLUMN id SET DEFAULT nextval('public.stock_opname_detail_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: asal_barang; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.asal_barang (id, nama, created_at, updated_at) FROM stdin;
1	SHOPEE	2025-08-06 08:27:35	2025-08-06 08:27:35
2	SUKMA	2025-08-06 08:27:50	2025-08-06 08:27:50
\.


--
-- Data for Name: barang; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.barang (id, jenis_barang_id, asal_id, lokasi_id, serial_number, kondisi_awal, status, created_at, updated_at, model_id, rak_id) FROM stdin;
3	1	1	4	19J182400187	baru	dipinjamkan	2025-08-06 08:47:44	2025-08-06 09:19:59	1	\N
47	1	1	4	11J155201860	baru	dipinjamkan	2025-08-06 09:10:02	2025-08-06 09:21:41	4	\N
50	1	1	5	11J142200381	second	dimusnahkan	2025-08-06 09:10:02	2025-08-13 02:42:25	4	\N
49	1	1	4	11J143600592	baru	dipinjamkan	2025-08-06 09:10:02	2025-08-06 09:21:41	4	\N
6	1	1	5	19J182303311	baru	bagus	2025-08-06 08:47:44	2025-08-06 08:47:44	1	\N
8	1	1	4	19J184801499	baru	dipinjamkan	2025-08-06 08:47:44	2025-08-08 03:10:00	1	\N
7	1	1	5	19J191801527	baru	bagus	2025-08-06 08:47:44	2025-08-06 08:47:44	1	\N
2	1	1	5	19J182303024	second	diperbaiki	2025-08-06 08:47:44	2025-08-08 07:08:48	1	\N
1	1	1	5	19J182102546	second	bagus	2025-08-06 08:47:44	2025-08-08 10:12:47	1	\N
48	1	1	5	11J135200210	second	bagus	2025-08-06 09:10:02	2025-08-09 07:43:08	4	\N
9	1	1	5	19J192100146	baru	bagus	2025-08-06 08:47:44	2025-08-06 08:47:44	1	\N
10	1	1	5	19J190301583	baru	bagus	2025-08-06 08:47:44	2025-08-06 08:47:44	1	\N
11	1	1	5	19J190300224	baru	bagus	2025-08-06 08:47:44	2025-08-06 08:47:44	1	\N
12	1	1	5	19J192062556	baru	bagus	2025-08-06 08:47:44	2025-08-06 08:47:44	1	\N
13	1	1	5	19J190301143	baru	bagus	2025-08-06 08:47:44	2025-08-06 08:47:44	1	\N
14	1	1	5	19J190300244	baru	bagus	2025-08-06 08:47:44	2025-08-06 08:47:44	1	\N
15	1	1	5	19J193603746	baru	bagus	2025-08-06 08:47:44	2025-08-06 08:47:44	1	\N
53	1	1	4	11J142200630	baru	dipinjamkan	2025-08-06 09:10:02	2025-08-06 09:21:41	4	\N
71	1	1	5	54J172001624	baru	bagus	2025-08-06 09:14:24	2025-08-06 09:14:24	5	\N
72	1	1	5	54J172001620	baru	bagus	2025-08-06 09:14:24	2025-08-06 09:14:24	5	\N
73	1	1	5	54J173403404	baru	bagus	2025-08-06 09:14:24	2025-08-06 09:14:24	5	\N
74	1	1	5	54J172001607	baru	bagus	2025-08-06 09:14:24	2025-08-06 09:14:24	5	\N
75	1	1	5	J4J163303233	baru	bagus	2025-08-06 09:14:24	2025-08-06 09:14:24	5	\N
36	1	1	3	D5J224614390	second	dipinjamkan	2025-08-06 08:57:01	2025-08-08 03:32:51	2	\N
38	1	1	3	D5J224614367	second	dipinjamkan	2025-08-06 08:57:01	2025-08-08 03:34:03	2	\N
4	1	1	5	19J182101070	second	diperbaiki	2025-08-06 08:47:44	2025-08-08 07:08:48	1	\N
5	1	1	5	19J182400145	second	diperbaiki	2025-08-06 08:47:44	2025-08-08 07:08:48	1	\N
76	1	1	5	54J173403374	baru	bagus	2025-08-06 09:14:24	2025-08-06 09:14:24	5	\N
37	1	1	5	D5J224613047	second	dimusnahkan	2025-08-06 08:57:01	2025-08-09 07:35:44	2	\N
77	1	1	5	54J172001609	baru	bagus	2025-08-06 09:14:24	2025-08-06 09:14:24	5	\N
56	1	1	5	11J141900429	second	rusak	2025-08-06 09:10:02	2025-08-09 07:40:45	4	\N
52	1	1	5	11J142200309	second	rusak	2025-08-06 09:10:02	2025-08-09 07:40:45	4	\N
51	1	1	5	11J142200351	second	rusak	2025-08-06 09:10:02	2025-08-09 07:40:45	4	\N
54	1	1	5	11J142200624	second	rusak	2025-08-06 09:10:02	2025-08-09 07:40:45	4	\N
16	1	1	5	19J185200278	baru	bagus	2025-08-06 08:47:44	2025-08-06 08:47:44	1	\N
17	1	1	5	19J193603726	baru	bagus	2025-08-06 08:47:44	2025-08-06 08:47:44	1	\N
18	1	1	5	19J193603600	baru	bagus	2025-08-06 08:47:44	2025-08-06 08:47:44	1	\N
19	1	1	5	19J193603799	baru	bagus	2025-08-06 08:47:44	2025-08-06 08:47:44	1	\N
20	1	1	5	19J192801588	baru	bagus	2025-08-06 08:47:44	2025-08-06 08:47:44	1	\N
21	1	1	5	19J192501735	baru	bagus	2025-08-06 08:50:15	2025-08-06 08:50:15	1	\N
22	1	1	5	19J193603780	baru	bagus	2025-08-06 08:50:15	2025-08-06 08:50:15	1	\N
23	1	1	5	19J193603785	baru	bagus	2025-08-06 08:50:15	2025-08-06 08:50:15	1	\N
24	1	1	5	19J185200020	baru	bagus	2025-08-06 08:50:15	2025-08-06 08:50:15	1	\N
25	1	1	5	19J193603661	baru	bagus	2025-08-06 08:50:15	2025-08-06 08:50:15	1	\N
26	1	1	5	19J190300219	baru	bagus	2025-08-06 08:50:15	2025-08-06 08:50:15	1	\N
27	1	1	5	19J193603649	baru	bagus	2025-08-06 08:50:15	2025-08-06 08:50:15	1	\N
28	1	1	5	19J193603670	baru	bagus	2025-08-06 08:50:15	2025-08-06 08:50:15	1	\N
29	1	1	5	19J193603695	baru	bagus	2025-08-06 08:50:15	2025-08-06 08:50:15	1	\N
30	1	1	5	19J182002534	baru	bagus	2025-08-06 08:50:15	2025-08-06 08:50:15	1	\N
31	1	1	5	19J192501503	baru	bagus	2025-08-06 08:50:15	2025-08-06 08:50:15	1	\N
32	1	1	5	19J184115062	baru	bagus	2025-08-06 08:50:15	2025-08-06 08:50:15	1	\N
33	1	1	5	19J184109096	baru	bagus	2025-08-06 08:50:15	2025-08-06 08:50:15	1	\N
34	1	1	5	19J184110004	baru	bagus	2025-08-06 08:50:15	2025-08-06 08:50:15	1	\N
35	1	1	5	19J184120094	baru	bagus	2025-08-06 08:50:15	2025-08-06 08:50:15	1	\N
39	1	1	5	D5J224612706	baru	bagus	2025-08-06 08:57:01	2025-08-06 08:57:01	2	\N
40	1	1	5	D5J224613058	baru	bagus	2025-08-06 08:57:01	2025-08-06 08:57:01	2	\N
41	1	1	5	D5J224613049	baru	bagus	2025-08-06 08:57:01	2025-08-06 08:57:01	2	\N
42	1	1	5	D5J224612801	baru	bagus	2025-08-06 08:57:01	2025-08-06 08:57:01	2	\N
43	1	1	5	D5J231904008	baru	bagus	2025-08-06 09:00:40	2025-08-06 09:00:40	3	\N
44	1	1	5	D5J231904081	baru	bagus	2025-08-06 09:00:40	2025-08-06 09:00:40	3	\N
46	1	1	5	D5J231903951	baru	bagus	2025-08-06 09:00:40	2025-08-06 09:00:40	3	\N
78	1	1	5	54J164700631	baru	bagus	2025-08-06 09:14:24	2025-08-06 09:14:24	5	\N
79	1	1	5	GC420-100520-000	baru	bagus	2025-08-06 09:14:24	2025-08-06 09:14:24	5	\N
80	1	1	5	54J173403253	baru	bagus	2025-08-06 09:14:24	2025-08-06 09:14:24	5	\N
81	1	1	5	54J173403359	baru	bagus	2025-08-06 09:14:24	2025-08-06 09:14:24	5	\N
83	1	1	5	E7763190201	baru	bagus	2025-08-08 02:43:21	2025-08-08 02:43:21	2	\N
55	1	1	5	11J135001463	second	dimusnahkan	2025-08-06 09:10:02	2025-08-13 03:20:39	4	\N
57	1	1	5	11J200210603	baru	bagus	2025-08-06 09:10:02	2025-08-06 09:10:02	4	\N
58	1	1	5	11J200210120	baru	bagus	2025-08-06 09:10:02	2025-08-06 09:10:02	4	\N
59	1	1	5	11J200210597	baru	bagus	2025-08-06 09:10:02	2025-08-06 09:10:02	4	\N
60	1	1	5	11J200210127	baru	bagus	2025-08-06 09:10:02	2025-08-06 09:10:02	4	\N
61	1	1	5	11J200210122	baru	bagus	2025-08-06 09:10:02	2025-08-06 09:10:02	4	\N
62	1	1	5	11J200210126	baru	bagus	2025-08-06 09:10:02	2025-08-06 09:10:02	4	\N
63	1	1	5	11J200246012	baru	bagus	2025-08-06 09:10:02	2025-08-06 09:10:02	4	\N
64	1	1	5	11J200246008	baru	bagus	2025-08-06 09:10:02	2025-08-06 09:10:02	4	\N
65	1	1	5	54J164700825	baru	bagus	2025-08-06 09:14:24	2025-08-06 09:14:24	5	\N
66	1	1	5	54J172001641	baru	bagus	2025-08-06 09:14:24	2025-08-06 09:14:24	5	\N
67	1	1	5	54J172001639	baru	bagus	2025-08-06 09:14:24	2025-08-06 09:14:24	5	\N
68	1	1	5	54J172001652	baru	bagus	2025-08-06 09:14:24	2025-08-06 09:14:24	5	\N
69	1	1	5	54J172001697	baru	bagus	2025-08-06 09:14:24	2025-08-06 09:14:24	5	\N
70	1	1	5	54J172001647	baru	bagus	2025-08-06 09:14:24	2025-08-06 09:14:24	5	\N
84	1	1	2	1234567890	baru	dipinjamkan	2025-08-13 08:18:43	2025-08-13 08:24:50	6	\N
\.


--
-- Data for Name: barang_keluar; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.barang_keluar (id, tanggal, lokasi_id, user_id, created_at, updated_at) FROM stdin;
1	2025-08-06	3	1	2025-08-06 09:17:48	2025-08-06 09:17:48
2	2025-08-06	4	1	2025-08-06 09:19:59	2025-08-06 09:19:59
3	2025-08-05	4	1	2025-08-06 09:21:41	2025-08-06 09:21:41
4	2025-08-13	2	1	2025-08-13 08:24:50	2025-08-13 08:24:50
\.


--
-- Data for Name: barang_keluar_detail; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.barang_keluar_detail (id, barang_keluar_id, barang_id, status_keluar) FROM stdin;
1	1	36	dipinjamkan
2	1	37	dipinjamkan
3	1	38	dipinjamkan
4	2	1	dipinjamkan
5	2	2	dipinjamkan
6	2	3	dipinjamkan
7	2	4	dipinjamkan
8	2	5	dipinjamkan
9	3	47	dipinjamkan
10	3	48	dipinjamkan
11	3	49	dipinjamkan
12	3	50	dipinjamkan
13	3	51	dipinjamkan
14	3	52	dipinjamkan
15	3	53	dipinjamkan
16	3	54	dipinjamkan
17	3	55	dipinjamkan
18	3	56	dipinjamkan
19	2	8	dipinjamkan
20	4	84	dipinjamkan
\.


--
-- Data for Name: barang_kembali; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.barang_kembali (id, tanggal, lokasi_id, user_id, created_at, updated_at) FROM stdin;
1	2025-08-08	3	1	2025-08-08 03:11:50	2025-08-08 03:11:50
2	2025-08-08	4	1	2025-08-08 07:08:48	2025-08-08 07:08:48
3	2025-08-09	4	1	2025-08-09 07:40:44	2025-08-09 07:40:44
\.


--
-- Data for Name: barang_kembali_detail; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.barang_kembali_detail (id, barang_kembali_id, barang_id, kondisi, status_saat_kembali, kondisi_awal_saat_kembali) FROM stdin;
1	1	37	bagus	rusak	second
4	2	4	bagus	diperbaiki	second
5	2	1	bagus	diperbaiki	second
6	2	2	bagus	diperbaiki	second
7	2	5	bagus	diperbaiki	second
8	3	55	bagus	rusak	second
9	3	48	bagus	rusak	second
10	3	56	bagus	rusak	second
11	3	52	bagus	rusak	second
12	3	51	bagus	rusak	second
13	3	50	bagus	rusak	second
14	3	54	bagus	rusak	second
\.


--
-- Data for Name: barang_masuk; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.barang_masuk (id, tanggal, asal_barang_id, user_id, created_at, updated_at) FROM stdin;
1	2025-08-04	1	\N	2025-08-06 08:47:44	2025-08-06 08:47:44
2	2025-08-05	1	\N	2025-08-06 08:50:15	2025-08-06 08:50:15
3	2025-08-06	1	\N	2025-08-06 08:57:01	2025-08-06 08:57:01
4	2025-08-02	1	\N	2025-08-06 09:00:40	2025-08-06 09:00:40
5	2025-08-01	1	\N	2025-08-06 09:10:02	2025-08-06 09:10:02
6	2025-08-02	1	\N	2025-08-06 09:14:24	2025-08-06 09:14:24
7	2025-08-13	1	\N	2025-08-13 08:18:43	2025-08-13 08:18:43
\.


--
-- Data for Name: barang_masuk_detail; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.barang_masuk_detail (id, barang_masuk_id, barang_id) FROM stdin;
1	1	1
2	1	2
3	1	3
4	1	4
5	1	5
6	1	6
7	1	7
8	1	8
9	1	9
10	1	10
11	1	11
12	1	12
13	1	13
14	1	14
15	1	15
16	1	16
17	1	17
18	1	18
19	1	19
20	1	20
21	2	21
22	2	22
23	2	23
24	2	24
25	2	25
26	2	26
27	2	27
28	2	28
29	2	29
30	2	30
31	2	31
32	2	32
33	2	33
34	2	34
35	2	35
36	3	36
37	3	37
38	3	38
39	3	39
40	3	40
41	3	41
42	3	42
43	4	43
44	4	44
46	4	46
47	5	47
48	5	48
49	5	49
50	5	50
51	5	51
52	5	52
53	5	53
54	5	54
55	5	55
56	5	56
57	5	57
58	5	58
59	5	59
60	5	60
61	5	61
62	5	62
63	5	63
64	5	64
65	6	65
66	6	66
67	6	67
68	6	68
69	6	69
70	6	70
71	6	71
72	6	72
73	6	73
74	6	74
75	6	75
76	6	76
77	6	77
78	6	78
79	6	79
80	6	80
81	6	81
83	3	83
84	7	84
\.


--
-- Data for Name: barang_pemusnahan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.barang_pemusnahan (id, pemusnahan_id, barang_id, created_at, updated_at) FROM stdin;
1	4	37	\N	\N
2	5	50	\N	\N
3	6	55	\N	\N
\.


--
-- Data for Name: cache; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cache (key, value, expiration) FROM stdin;
laravel_cache_spatie.permission.cache	a:3:{s:5:"alias";a:5:{s:1:"a";s:2:"id";s:1:"b";s:4:"name";s:1:"c";s:10:"guard_name";s:1:"f";s:9:"is_system";s:1:"r";s:5:"roles";}s:11:"permissions";a:77:{i:0;a:5:{s:1:"a";i:1;s:1:"b";s:14:"view-dashboard";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:2:{i:0;i:3;i:1;i:1;}}i:1;a:5:{s:1:"a";i:2;s:1:"b";s:13:"view-kategori";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:2;a:5:{s:1:"a";i:3;s:1:"b";s:15:"create-kategori";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:3;a:5:{s:1:"a";i:4;s:1:"b";s:13:"edit-kategori";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:4;a:5:{s:1:"a";i:5;s:1:"b";s:15:"delete-kategori";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:5;a:5:{s:1:"a";i:6;s:1:"b";s:10:"view-merek";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:6;a:5:{s:1:"a";i:7;s:1:"b";s:12:"create-merek";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:7;a:5:{s:1:"a";i:8;s:1:"b";s:10:"edit-merek";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:8;a:5:{s:1:"a";i:9;s:1:"b";s:12:"delete-merek";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:9;a:5:{s:1:"a";i:10;s:1:"b";s:10:"view-model";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:10;a:5:{s:1:"a";i:11;s:1:"b";s:12:"create-model";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:11;a:5:{s:1:"a";i:12;s:1:"b";s:10:"edit-model";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:12;a:5:{s:1:"a";i:13;s:1:"b";s:12:"delete-model";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:13;a:5:{s:1:"a";i:14;s:1:"b";s:10:"view-jenis";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:14;a:5:{s:1:"a";i:15;s:1:"b";s:12:"create-jenis";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:15;a:5:{s:1:"a";i:16;s:1:"b";s:10:"edit-jenis";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:16;a:5:{s:1:"a";i:17;s:1:"b";s:12:"delete-jenis";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:17;a:5:{s:1:"a";i:18;s:1:"b";s:16:"view-asal-barang";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:18;a:5:{s:1:"a";i:19;s:1:"b";s:18:"create-asal-barang";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:19;a:5:{s:1:"a";i:20;s:1:"b";s:16:"edit-asal-barang";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:20;a:5:{s:1:"a";i:21;s:1:"b";s:18:"delete-asal-barang";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:21;a:5:{s:1:"a";i:22;s:1:"b";s:22:"view-lokasi-distribusi";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:22;a:5:{s:1:"a";i:23;s:1:"b";s:24:"create-lokasi-distribusi";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:23;a:5:{s:1:"a";i:24;s:1:"b";s:22:"edit-lokasi-distribusi";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:24;a:5:{s:1:"a";i:25;s:1:"b";s:24:"delete-lokasi-distribusi";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:25;a:5:{s:1:"a";i:26;s:1:"b";s:15:"view-rak-barang";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:26;a:5:{s:1:"a";i:27;s:1:"b";s:17:"create-rak-barang";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:27;a:5:{s:1:"a";i:28;s:1:"b";s:15:"edit-rak-barang";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:28;a:5:{s:1:"a";i:29;s:1:"b";s:17:"delete-rak-barang";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:29;a:5:{s:1:"a";i:30;s:1:"b";s:17:"view-barang-masuk";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:30;a:5:{s:1:"a";i:31;s:1:"b";s:19:"create-barang-masuk";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:31;a:5:{s:1:"a";i:32;s:1:"b";s:17:"edit-barang-masuk";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:32;a:5:{s:1:"a";i:33;s:1:"b";s:19:"delete-barang-masuk";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:33;a:5:{s:1:"a";i:34;s:1:"b";s:18:"view-barang-keluar";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:34;a:5:{s:1:"a";i:35;s:1:"b";s:20:"create-barang-keluar";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:35;a:5:{s:1:"a";i:36;s:1:"b";s:18:"edit-barang-keluar";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:36;a:5:{s:1:"a";i:37;s:1:"b";s:20:"delete-barang-keluar";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:37;a:5:{s:1:"a";i:38;s:1:"b";s:19:"view-barang-kembali";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:38;a:5:{s:1:"a";i:39;s:1:"b";s:21:"create-barang-kembali";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:39;a:5:{s:1:"a";i:40;s:1:"b";s:19:"edit-barang-kembali";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:40;a:5:{s:1:"a";i:41;s:1:"b";s:21:"delete-barang-kembali";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:41;a:5:{s:1:"a";i:42;s:1:"b";s:16:"view-stok-gudang";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:42;a:5:{s:1:"a";i:43;s:1:"b";s:16:"edit-stok-gudang";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:43;a:5:{s:1:"a";i:44;s:1:"b";s:20:"view-stok-distribusi";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:44;a:5:{s:1:"a";i:45;s:1:"b";s:20:"edit-stok-distribusi";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:45;a:5:{s:1:"a";i:46;s:1:"b";s:17:"view-stok-terjual";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:46;a:5:{s:1:"a";i:47;s:1:"b";s:17:"edit-stok-terjual";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:47;a:5:{s:1:"a";i:48;s:1:"b";s:20:"view-stok-diperbaiki";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:48;a:5:{s:1:"a";i:49;s:1:"b";s:20:"edit-stok-diperbaiki";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:49;a:5:{s:1:"a";i:50;s:1:"b";s:15:"view-stok-rusak";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:50;a:5:{s:1:"a";i:51;s:1:"b";s:15:"edit-stok-rusak";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:51;a:5:{s:1:"a";i:52;s:1:"b";s:15:"view-stok-total";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:52;a:5:{s:1:"a";i:53;s:1:"b";s:15:"edit-stok-total";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:53;a:5:{s:1:"a";i:54;s:1:"b";s:17:"view-stock-opname";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:54;a:5:{s:1:"a";i:55;s:1:"b";s:19:"create-stock-opname";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:55;a:5:{s:1:"a";i:56;s:1:"b";s:17:"edit-stock-opname";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:56;a:5:{s:1:"a";i:57;s:1:"b";s:19:"delete-stock-opname";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:57;a:5:{s:1:"a";i:58;s:1:"b";s:22:"view-dashboard-laporan";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:58;a:5:{s:1:"a";i:59;s:1:"b";s:25:"view-laporan-barang-masuk";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:59;a:5:{s:1:"a";i:60;s:1:"b";s:26:"view-laporan-barang-keluar";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:60;a:5:{s:1:"a";i:61;s:1:"b";s:27:"view-laporan-barang-kembali";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:61;a:5:{s:1:"a";i:62;s:1:"b";s:19:"view-laporan-mutasi";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:62;a:5:{s:1:"a";i:63;s:1:"b";s:9:"view-user";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:2:{i:0;i:3;i:1;i:1;}}i:63;a:5:{s:1:"a";i:64;s:1:"b";s:11:"create-user";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:2:{i:0;i:3;i:1;i:1;}}i:64;a:5:{s:1:"a";i:65;s:1:"b";s:9:"edit-user";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:2:{i:0;i:3;i:1;i:1;}}i:65;a:5:{s:1:"a";i:66;s:1:"b";s:11:"delete-user";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:2:{i:0;i:3;i:1;i:1;}}i:66;a:5:{s:1:"a";i:67;s:1:"b";s:9:"view-role";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:2:{i:0;i:3;i:1;i:1;}}i:67;a:5:{s:1:"a";i:68;s:1:"b";s:11:"create-role";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:2:{i:0;i:3;i:1;i:1;}}i:68;a:5:{s:1:"a";i:69;s:1:"b";s:9:"edit-role";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:2:{i:0;i:3;i:1;i:1;}}i:69;a:5:{s:1:"a";i:70;s:1:"b";s:11:"delete-role";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:2:{i:0;i:3;i:1;i:1;}}i:70;a:5:{s:1:"a";i:71;s:1:"b";s:15:"view-permission";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:2:{i:0;i:3;i:1;i:1;}}i:71;a:5:{s:1:"a";i:72;s:1:"b";s:15:"edit-permission";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:2:{i:0;i:3;i:1;i:1;}}i:72;a:5:{s:1:"a";i:73;s:1:"b";s:12:"view-setting";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:2:{i:0;i:3;i:1;i:1;}}i:73;a:5:{s:1:"a";i:74;s:1:"b";s:12:"edit-setting";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:2:{i:0;i:3;i:1;i:1;}}i:74;a:5:{s:1:"a";i:75;s:1:"b";s:14:"view-transaksi";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:75;a:5:{s:1:"a";i:76;s:1:"b";s:20:"view-stock-dashboard";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}i:76;a:5:{s:1:"a";i:77;s:1:"b";s:18:"approve-stok-rusak";s:1:"c";s:3:"web";s:1:"f";b:0;s:1:"r";a:1:{i:0;i:1;}}}s:5:"roles";a:2:{i:0;a:3:{s:1:"a";i:3;s:1:"b";s:9:"developer";s:1:"c";s:3:"web";}i:1;a:3:{s:1:"a";i:1;s:1:"b";s:11:"super-admin";s:1:"c";s:3:"web";}}}	1755310078
laravel_cache_kategoriOptions	TzozOToiSWxsdW1pbmF0ZVxEYXRhYmFzZVxFbG9xdWVudFxDb2xsZWN0aW9uIjoyOntzOjg6IgAqAGl0ZW1zIjthOjE6e2k6MDtPOjI1OiJBcHBcTW9kZWxzXEthdGVnb3JpQmFyYW5nIjozMzp7czoxMzoiACoAY29ubmVjdGlvbiI7czo1OiJwZ3NxbCI7czo4OiIAKgB0YWJsZSI7czoxNToia2F0ZWdvcmlfYmFyYW5nIjtzOjEzOiIAKgBwcmltYXJ5S2V5IjtzOjI6ImlkIjtzOjEwOiIAKgBrZXlUeXBlIjtzOjM6ImludCI7czoxMjoiaW5jcmVtZW50aW5nIjtiOjE7czo3OiIAKgB3aXRoIjthOjA6e31zOjEyOiIAKgB3aXRoQ291bnQiO2E6MDp7fXM6MTk6InByZXZlbnRzTGF6eUxvYWRpbmciO2I6MDtzOjEwOiIAKgBwZXJQYWdlIjtpOjE1O3M6NjoiZXhpc3RzIjtiOjE7czoxODoid2FzUmVjZW50bHlDcmVhdGVkIjtiOjA7czoyODoiACoAZXNjYXBlV2hlbkNhc3RpbmdUb1N0cmluZyI7YjowO3M6MTM6IgAqAGF0dHJpYnV0ZXMiO2E6Mjp7czoyOiJpZCI7aToxO3M6NDoibmFtYSI7czo3OiJQUklOVEVSIjt9czoxMToiACoAb3JpZ2luYWwiO2E6Mjp7czoyOiJpZCI7aToxO3M6NDoibmFtYSI7czo3OiJQUklOVEVSIjt9czoxMDoiACoAY2hhbmdlcyI7YTowOnt9czoxMToiACoAcHJldmlvdXMiO2E6MDp7fXM6ODoiACoAY2FzdHMiO2E6MDp7fXM6MTc6IgAqAGNsYXNzQ2FzdENhY2hlIjthOjA6e31zOjIxOiIAKgBhdHRyaWJ1dGVDYXN0Q2FjaGUiO2E6MDp7fXM6MTM6IgAqAGRhdGVGb3JtYXQiO047czoxMDoiACoAYXBwZW5kcyI7YTowOnt9czoxOToiACoAZGlzcGF0Y2hlc0V2ZW50cyI7YTowOnt9czoxNDoiACoAb2JzZXJ2YWJsZXMiO2E6MDp7fXM6MTI6IgAqAHJlbGF0aW9ucyI7YTowOnt9czoxMDoiACoAdG91Y2hlcyI7YTowOnt9czoyNzoiACoAcmVsYXRpb25BdXRvbG9hZENhbGxiYWNrIjtOO3M6MjY6IgAqAHJlbGF0aW9uQXV0b2xvYWRDb250ZXh0IjtOO3M6MTA6InRpbWVzdGFtcHMiO2I6MTtzOjEzOiJ1c2VzVW5pcXVlSWRzIjtiOjA7czo5OiIAKgBoaWRkZW4iO2E6MDp7fXM6MTA6IgAqAHZpc2libGUiO2E6MDp7fXM6MTE6IgAqAGZpbGxhYmxlIjthOjE6e2k6MDtzOjQ6Im5hbWEiO31zOjEwOiIAKgBndWFyZGVkIjthOjE6e2k6MDtzOjE6IioiO319fXM6Mjg6IgAqAGVzY2FwZVdoZW5DYXN0aW5nVG9TdHJpbmciO2I6MDt9	1755227624
laravel_cache_asalOptions	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	1755227624
laravel_cache_merekOptions	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	1755227624
laravel_cache_modelOptions	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	1755227624
laravel_cache_jenisOptions	TzozOToiSWxsdW1pbmF0ZVxEYXRhYmFzZVxFbG9xdWVudFxDb2xsZWN0aW9uIjoyOntzOjg6IgAqAGl0ZW1zIjthOjE6e2k6MDtPOjIyOiJBcHBcTW9kZWxzXEplbmlzQmFyYW5nIjozMzp7czoxMzoiACoAY29ubmVjdGlvbiI7czo1OiJwZ3NxbCI7czo4OiIAKgB0YWJsZSI7czoxMjoiamVuaXNfYmFyYW5nIjtzOjEzOiIAKgBwcmltYXJ5S2V5IjtzOjI6ImlkIjtzOjEwOiIAKgBrZXlUeXBlIjtzOjM6ImludCI7czoxMjoiaW5jcmVtZW50aW5nIjtiOjE7czo3OiIAKgB3aXRoIjthOjA6e31zOjEyOiIAKgB3aXRoQ291bnQiO2E6MDp7fXM6MTk6InByZXZlbnRzTGF6eUxvYWRpbmciO2I6MDtzOjEwOiIAKgBwZXJQYWdlIjtpOjE1O3M6NjoiZXhpc3RzIjtiOjE7czoxODoid2FzUmVjZW50bHlDcmVhdGVkIjtiOjA7czoyODoiACoAZXNjYXBlV2hlbkNhc3RpbmdUb1N0cmluZyI7YjowO3M6MTM6IgAqAGF0dHJpYnV0ZXMiO2E6Mjp7czoyOiJpZCI7aToxO3M6NDoibmFtYSI7czo3OiJCQVJDT0RFIjt9czoxMToiACoAb3JpZ2luYWwiO2E6Mjp7czoyOiJpZCI7aToxO3M6NDoibmFtYSI7czo3OiJCQVJDT0RFIjt9czoxMDoiACoAY2hhbmdlcyI7YTowOnt9czoxMToiACoAcHJldmlvdXMiO2E6MDp7fXM6ODoiACoAY2FzdHMiO2E6MDp7fXM6MTc6IgAqAGNsYXNzQ2FzdENhY2hlIjthOjA6e31zOjIxOiIAKgBhdHRyaWJ1dGVDYXN0Q2FjaGUiO2E6MDp7fXM6MTM6IgAqAGRhdGVGb3JtYXQiO047czoxMDoiACoAYXBwZW5kcyI7YTowOnt9czoxOToiACoAZGlzcGF0Y2hlc0V2ZW50cyI7YTowOnt9czoxNDoiACoAb2JzZXJ2YWJsZXMiO2E6MDp7fXM6MTI6IgAqAHJlbGF0aW9ucyI7YTowOnt9czoxMDoiACoAdG91Y2hlcyI7YTowOnt9czoyNzoiACoAcmVsYXRpb25BdXRvbG9hZENhbGxiYWNrIjtOO3M6MjY6IgAqAHJlbGF0aW9uQXV0b2xvYWRDb250ZXh0IjtOO3M6MTA6InRpbWVzdGFtcHMiO2I6MTtzOjEzOiJ1c2VzVW5pcXVlSWRzIjtiOjA7czo5OiIAKgBoaWRkZW4iO2E6MDp7fXM6MTA6IgAqAHZpc2libGUiO2E6MDp7fXM6MTE6IgAqAGZpbGxhYmxlIjthOjI6e2k6MDtzOjQ6Im5hbWEiO2k6MTtzOjExOiJrYXRlZ29yaV9pZCI7fXM6MTA6IgAqAGd1YXJkZWQiO2E6MTp7aTowO3M6MToiKiI7fX19czoyODoiACoAZXNjYXBlV2hlbkNhc3RpbmdUb1N0cmluZyI7YjowO30=	1755227624
laravel_cache_rakOptions	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	1755227624
laravel_cache_kategori_options	TzozOToiSWxsdW1pbmF0ZVxEYXRhYmFzZVxFbG9xdWVudFxDb2xsZWN0aW9uIjoyOntzOjg6IgAqAGl0ZW1zIjthOjE6e2k6MDtPOjI1OiJBcHBcTW9kZWxzXEthdGVnb3JpQmFyYW5nIjozMzp7czoxMzoiACoAY29ubmVjdGlvbiI7czo1OiJwZ3NxbCI7czo4OiIAKgB0YWJsZSI7czoxNToia2F0ZWdvcmlfYmFyYW5nIjtzOjEzOiIAKgBwcmltYXJ5S2V5IjtzOjI6ImlkIjtzOjEwOiIAKgBrZXlUeXBlIjtzOjM6ImludCI7czoxMjoiaW5jcmVtZW50aW5nIjtiOjE7czo3OiIAKgB3aXRoIjthOjA6e31zOjEyOiIAKgB3aXRoQ291bnQiO2E6MDp7fXM6MTk6InByZXZlbnRzTGF6eUxvYWRpbmciO2I6MDtzOjEwOiIAKgBwZXJQYWdlIjtpOjE1O3M6NjoiZXhpc3RzIjtiOjE7czoxODoid2FzUmVjZW50bHlDcmVhdGVkIjtiOjA7czoyODoiACoAZXNjYXBlV2hlbkNhc3RpbmdUb1N0cmluZyI7YjowO3M6MTM6IgAqAGF0dHJpYnV0ZXMiO2E6Mjp7czoyOiJpZCI7aToxO3M6NDoibmFtYSI7czo3OiJQUklOVEVSIjt9czoxMToiACoAb3JpZ2luYWwiO2E6Mjp7czoyOiJpZCI7aToxO3M6NDoibmFtYSI7czo3OiJQUklOVEVSIjt9czoxMDoiACoAY2hhbmdlcyI7YTowOnt9czoxMToiACoAcHJldmlvdXMiO2E6MDp7fXM6ODoiACoAY2FzdHMiO2E6MDp7fXM6MTc6IgAqAGNsYXNzQ2FzdENhY2hlIjthOjA6e31zOjIxOiIAKgBhdHRyaWJ1dGVDYXN0Q2FjaGUiO2E6MDp7fXM6MTM6IgAqAGRhdGVGb3JtYXQiO047czoxMDoiACoAYXBwZW5kcyI7YTowOnt9czoxOToiACoAZGlzcGF0Y2hlc0V2ZW50cyI7YTowOnt9czoxNDoiACoAb2JzZXJ2YWJsZXMiO2E6MDp7fXM6MTI6IgAqAHJlbGF0aW9ucyI7YTowOnt9czoxMDoiACoAdG91Y2hlcyI7YTowOnt9czoyNzoiACoAcmVsYXRpb25BdXRvbG9hZENhbGxiYWNrIjtOO3M6MjY6IgAqAHJlbGF0aW9uQXV0b2xvYWRDb250ZXh0IjtOO3M6MTA6InRpbWVzdGFtcHMiO2I6MTtzOjEzOiJ1c2VzVW5pcXVlSWRzIjtiOjA7czo5OiIAKgBoaWRkZW4iO2E6MDp7fXM6MTA6IgAqAHZpc2libGUiO2E6MDp7fXM6MTE6IgAqAGZpbGxhYmxlIjthOjE6e2k6MDtzOjQ6Im5hbWEiO31zOjEwOiIAKgBndWFyZGVkIjthOjE6e2k6MDtzOjE6IioiO319fXM6Mjg6IgAqAGVzY2FwZVdoZW5DYXN0aW5nVG9TdHJpbmciO2I6MDt9	1755228735
laravel_cache_asal_options	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	1755228735
laravel_cache_merek_options	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	1755228735
laravel_cache_model_options	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	1755228735
laravel_cache_jenis_options	TzozOToiSWxsdW1pbmF0ZVxEYXRhYmFzZVxFbG9xdWVudFxDb2xsZWN0aW9uIjoyOntzOjg6IgAqAGl0ZW1zIjthOjE6e2k6MDtPOjIyOiJBcHBcTW9kZWxzXEplbmlzQmFyYW5nIjozMzp7czoxMzoiACoAY29ubmVjdGlvbiI7czo1OiJwZ3NxbCI7czo4OiIAKgB0YWJsZSI7czoxMjoiamVuaXNfYmFyYW5nIjtzOjEzOiIAKgBwcmltYXJ5S2V5IjtzOjI6ImlkIjtzOjEwOiIAKgBrZXlUeXBlIjtzOjM6ImludCI7czoxMjoiaW5jcmVtZW50aW5nIjtiOjE7czo3OiIAKgB3aXRoIjthOjA6e31zOjEyOiIAKgB3aXRoQ291bnQiO2E6MDp7fXM6MTk6InByZXZlbnRzTGF6eUxvYWRpbmciO2I6MDtzOjEwOiIAKgBwZXJQYWdlIjtpOjE1O3M6NjoiZXhpc3RzIjtiOjE7czoxODoid2FzUmVjZW50bHlDcmVhdGVkIjtiOjA7czoyODoiACoAZXNjYXBlV2hlbkNhc3RpbmdUb1N0cmluZyI7YjowO3M6MTM6IgAqAGF0dHJpYnV0ZXMiO2E6Mjp7czoyOiJpZCI7aToxO3M6NDoibmFtYSI7czo3OiJCQVJDT0RFIjt9czoxMToiACoAb3JpZ2luYWwiO2E6Mjp7czoyOiJpZCI7aToxO3M6NDoibmFtYSI7czo3OiJCQVJDT0RFIjt9czoxMDoiACoAY2hhbmdlcyI7YTowOnt9czoxMToiACoAcHJldmlvdXMiO2E6MDp7fXM6ODoiACoAY2FzdHMiO2E6MDp7fXM6MTc6IgAqAGNsYXNzQ2FzdENhY2hlIjthOjA6e31zOjIxOiIAKgBhdHRyaWJ1dGVDYXN0Q2FjaGUiO2E6MDp7fXM6MTM6IgAqAGRhdGVGb3JtYXQiO047czoxMDoiACoAYXBwZW5kcyI7YTowOnt9czoxOToiACoAZGlzcGF0Y2hlc0V2ZW50cyI7YTowOnt9czoxNDoiACoAb2JzZXJ2YWJsZXMiO2E6MDp7fXM6MTI6IgAqAHJlbGF0aW9ucyI7YTowOnt9czoxMDoiACoAdG91Y2hlcyI7YTowOnt9czoyNzoiACoAcmVsYXRpb25BdXRvbG9hZENhbGxiYWNrIjtOO3M6MjY6IgAqAHJlbGF0aW9uQXV0b2xvYWRDb250ZXh0IjtOO3M6MTA6InRpbWVzdGFtcHMiO2I6MTtzOjEzOiJ1c2VzVW5pcXVlSWRzIjtiOjA7czo5OiIAKgBoaWRkZW4iO2E6MDp7fXM6MTA6IgAqAHZpc2libGUiO2E6MDp7fXM6MTE6IgAqAGZpbGxhYmxlIjthOjI6e2k6MDtzOjQ6Im5hbWEiO2k6MTtzOjExOiJrYXRlZ29yaV9pZCI7fXM6MTA6IgAqAGd1YXJkZWQiO2E6MTp7aTowO3M6MToiKiI7fX19czoyODoiACoAZXNjYXBlV2hlbkNhc3RpbmdUb1N0cmluZyI7YjowO30=	1755228809
laravel_cache_rak_options	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	1755228809
\.


--
-- Data for Name: cache_locks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cache_locks (key, owner, expiration) FROM stdin;
\.


--
-- Data for Name: failed_jobs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.failed_jobs (id, uuid, connection, queue, payload, exception, failed_at) FROM stdin;
\.


--
-- Data for Name: jenis_barang; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.jenis_barang (id, nama, created_at, updated_at, kategori_id) FROM stdin;
1	BARCODE	2025-08-06 08:22:46	2025-08-06 08:22:46	1
\.


--
-- Data for Name: job_batches; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.job_batches (id, name, total_jobs, pending_jobs, failed_jobs, failed_job_ids, options, cancelled_at, created_at, finished_at) FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.jobs (id, queue, payload, attempts, reserved_at, available_at, created_at) FROM stdin;
\.


--
-- Data for Name: kategori_barang; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.kategori_barang (id, nama, created_at, updated_at) FROM stdin;
1	PRINTER	2025-08-06 08:19:21	2025-08-06 08:19:21
\.


--
-- Data for Name: lokasi; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.lokasi (id, nama, alamat, is_gudang, created_at, updated_at) FROM stdin;
1	RS MUHAMMADIYAH PALEMBANG	JL. JENDERAL AHMAD YANI NO.13, 13 ULU, KEC. SEBERANG ULU II, KOTA PALEMBANG	f	2025-08-06 08:34:13	2025-08-06 08:34:13
2	RS BHAYANGKARA PALEMBANG	JL.KOL.H.BURLIAN NO.8 KM.5	f	2025-08-06 08:35:29	2025-08-06 08:35:29
3	RSUD PALEMBANG BARI	JL. PANCA USAHA NO.01 KEL.5 ULU	f	2025-08-06 08:36:39	2025-08-06 08:36:39
4	RS KHUSUS MATA PROV.SUMATERA SELATAN	JL. KOL. H. BURLIAN NO.KM.5,5, SUKABANGUN, KEC. SUKARAMI, KOTA PALEMBAG	f	2025-08-06 08:38:25	2025-08-06 08:38:25
5	GUDANG	-	t	2025-08-06 08:39:13	2025-08-06 08:39:13
\.


--
-- Data for Name: merek_barang; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.merek_barang (id, nama, created_at, updated_at) FROM stdin;
1	ZEBRA	2025-08-06 08:20:17	2025-08-06 08:20:17
2	FARGO	2025-08-06 08:20:26	2025-08-06 08:20:26
4	XPRINTER	2025-08-06 08:20:43	2025-08-06 08:20:43
3	EPSON	2025-08-06 08:20:33	2025-08-06 08:21:03
5	TSC	2025-08-06 08:21:15	2025-08-06 08:21:15
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	0001_01_01_000000_create_users_table	1
2	0001_01_01_000001_create_cache_table	1
3	0001_01_01_000002_create_jobs_table	1
5	2025_07_31_012222_add_kolom_name_barang_table	3
6	2025_07_31_050627_add_status_keluar_to_barang_keluar_details_table	4
7	2025_07_31_060444_add_is_gudang_to_lokasi_table	5
8	2025_07_31_080500_add_kondisi_to_barang_kembali_details_table	6
9	2025_07_31_124657_add_rak_to_barang_and_create_rak_barang_table	7
11	2025_08_01_085832_add_lokasi_id_to_barang_table	8
13	2025_07_30_011626_create_tabel_inventaris_table	9
14	2025_08_02_001337_create_nama_barang_table	10
15	2025_08_02_001427_update_model_to_nama_barang_on_barang_table	10
16	2025_08_02_001527_update_rekap_stok_barang_table	10
17	2025_08_02_005304_update_struktur_barang	11
18	2025_08_02_100346_add_rak_id_to_barang_table	12
19	2025_08_04_011323_add_kolom_jumlah_stock_table	13
20	2025_08_05_035259_add_kolom_label_table	14
21	2025_08_06_014256_create_permission_tables	15
22	2025_08_06_041521_add_is_system_to_permissions_table	16
23	2025_08_07_011254_create_stock_opname_table	17
24	2025_08_07_022635_add_approval_columns_to_stock_opname_table	18
25	2025_08_07_030243_add_serial_to_stock_opname_details_table	19
28	2025_08_09_010756_create_pemusnahaan_table	20
29	2025_08_09_011046_create_barang_pemusnahaan_table	20
\.


--
-- Data for Name: model_barang; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.model_barang (id, kategori_id, merek_id, nama, created_at, updated_at, jenis_id, deskripsi, label) FROM stdin;
1	1	1	GK888T	2025-08-06 08:24:39	2025-08-06 08:24:48	1	\N	PRINTER LABEL
2	1	1	ZD220T	2025-08-06 08:25:45	2025-08-06 08:25:45	1	\N	PRINTER LABEL
3	1	1	ZD230T	2025-08-06 08:25:57	2025-08-06 08:25:57	1	\N	PRINTER LABEL
4	1	1	GT820	2025-08-06 08:27:03	2025-08-06 08:27:03	1	\N	PRINTER LABEL
5	1	1	GC420T	2025-08-06 09:11:37	2025-08-06 09:11:50	1	\N	PRINTER LABEL
6	1	2	C50	2025-08-13 08:18:43	2025-08-13 08:18:43	1	\N	\N
\.


--
-- Data for Name: model_has_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.model_has_permissions (permission_id, model_type, model_id) FROM stdin;
1	App\\Models\\User	2
3	App\\Models\\User	2
2	App\\Models\\User	2
4	App\\Models\\User	2
5	App\\Models\\User	2
7	App\\Models\\User	2
6	App\\Models\\User	2
8	App\\Models\\User	2
9	App\\Models\\User	2
11	App\\Models\\User	2
10	App\\Models\\User	2
12	App\\Models\\User	2
13	App\\Models\\User	2
15	App\\Models\\User	2
14	App\\Models\\User	2
16	App\\Models\\User	2
17	App\\Models\\User	2
19	App\\Models\\User	2
18	App\\Models\\User	2
20	App\\Models\\User	2
21	App\\Models\\User	2
23	App\\Models\\User	2
22	App\\Models\\User	2
24	App\\Models\\User	2
25	App\\Models\\User	2
27	App\\Models\\User	2
26	App\\Models\\User	2
28	App\\Models\\User	2
29	App\\Models\\User	2
31	App\\Models\\User	2
30	App\\Models\\User	2
32	App\\Models\\User	2
33	App\\Models\\User	2
35	App\\Models\\User	2
34	App\\Models\\User	2
36	App\\Models\\User	2
37	App\\Models\\User	2
39	App\\Models\\User	2
38	App\\Models\\User	2
40	App\\Models\\User	2
41	App\\Models\\User	2
42	App\\Models\\User	2
43	App\\Models\\User	2
44	App\\Models\\User	2
45	App\\Models\\User	2
46	App\\Models\\User	2
47	App\\Models\\User	2
48	App\\Models\\User	2
49	App\\Models\\User	2
50	App\\Models\\User	2
51	App\\Models\\User	2
52	App\\Models\\User	2
53	App\\Models\\User	2
55	App\\Models\\User	2
54	App\\Models\\User	2
56	App\\Models\\User	2
57	App\\Models\\User	2
58	App\\Models\\User	2
59	App\\Models\\User	2
60	App\\Models\\User	2
61	App\\Models\\User	2
62	App\\Models\\User	2
64	App\\Models\\User	2
63	App\\Models\\User	2
65	App\\Models\\User	2
66	App\\Models\\User	2
68	App\\Models\\User	2
67	App\\Models\\User	2
69	App\\Models\\User	2
70	App\\Models\\User	2
71	App\\Models\\User	2
72	App\\Models\\User	2
73	App\\Models\\User	2
74	App\\Models\\User	2
75	App\\Models\\User	1
3	App\\Models\\User	1
2	App\\Models\\User	3
3	App\\Models\\User	3
4	App\\Models\\User	3
5	App\\Models\\User	3
6	App\\Models\\User	3
7	App\\Models\\User	3
8	App\\Models\\User	3
9	App\\Models\\User	3
10	App\\Models\\User	3
11	App\\Models\\User	3
12	App\\Models\\User	3
13	App\\Models\\User	3
14	App\\Models\\User	3
15	App\\Models\\User	3
16	App\\Models\\User	3
17	App\\Models\\User	3
18	App\\Models\\User	3
19	App\\Models\\User	3
20	App\\Models\\User	3
21	App\\Models\\User	3
22	App\\Models\\User	3
23	App\\Models\\User	3
24	App\\Models\\User	3
25	App\\Models\\User	3
26	App\\Models\\User	3
27	App\\Models\\User	3
28	App\\Models\\User	3
29	App\\Models\\User	3
30	App\\Models\\User	3
31	App\\Models\\User	3
32	App\\Models\\User	3
33	App\\Models\\User	3
34	App\\Models\\User	3
35	App\\Models\\User	3
36	App\\Models\\User	3
37	App\\Models\\User	3
38	App\\Models\\User	3
39	App\\Models\\User	3
40	App\\Models\\User	3
41	App\\Models\\User	3
42	App\\Models\\User	3
44	App\\Models\\User	3
46	App\\Models\\User	3
48	App\\Models\\User	3
50	App\\Models\\User	3
52	App\\Models\\User	3
54	App\\Models\\User	3
75	App\\Models\\User	3
76	App\\Models\\User	3
77	App\\Models\\User	3
51	App\\Models\\User	3
49	App\\Models\\User	3
47	App\\Models\\User	3
45	App\\Models\\User	3
43	App\\Models\\User	3
\.


--
-- Data for Name: model_has_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.model_has_roles (role_id, model_type, model_id) FROM stdin;
2	App\\Models\\User	2
1	App\\Models\\User	1
3	App\\Models\\User	3
\.


--
-- Data for Name: mutasi_barang; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mutasi_barang (id, barang_id, lokasi_asal_id, lokasi_tujuan_id, user_id, tanggal, keterangan, created_at, updated_at) FROM stdin;
1	1	\N	5	\N	2025-08-04	Barang masuk dari sumber SHOPEE	2025-08-06 08:47:44	2025-08-06 08:47:44
2	2	\N	5	\N	2025-08-04	Barang masuk dari sumber SHOPEE	2025-08-06 08:47:44	2025-08-06 08:47:44
3	3	\N	5	\N	2025-08-04	Barang masuk dari sumber SHOPEE	2025-08-06 08:47:44	2025-08-06 08:47:44
4	4	\N	5	\N	2025-08-04	Barang masuk dari sumber SHOPEE	2025-08-06 08:47:44	2025-08-06 08:47:44
5	5	\N	5	\N	2025-08-04	Barang masuk dari sumber SHOPEE	2025-08-06 08:47:44	2025-08-06 08:47:44
6	6	\N	5	\N	2025-08-04	Barang masuk dari sumber SHOPEE	2025-08-06 08:47:44	2025-08-06 08:47:44
7	7	\N	5	\N	2025-08-04	Barang masuk dari sumber SHOPEE	2025-08-06 08:47:44	2025-08-06 08:47:44
8	8	\N	5	\N	2025-08-04	Barang masuk dari sumber SHOPEE	2025-08-06 08:47:44	2025-08-06 08:47:44
9	9	\N	5	\N	2025-08-04	Barang masuk dari sumber SHOPEE	2025-08-06 08:47:44	2025-08-06 08:47:44
10	10	\N	5	\N	2025-08-04	Barang masuk dari sumber SHOPEE	2025-08-06 08:47:44	2025-08-06 08:47:44
11	11	\N	5	\N	2025-08-04	Barang masuk dari sumber SHOPEE	2025-08-06 08:47:44	2025-08-06 08:47:44
12	12	\N	5	\N	2025-08-04	Barang masuk dari sumber SHOPEE	2025-08-06 08:47:44	2025-08-06 08:47:44
13	13	\N	5	\N	2025-08-04	Barang masuk dari sumber SHOPEE	2025-08-06 08:47:44	2025-08-06 08:47:44
14	14	\N	5	\N	2025-08-04	Barang masuk dari sumber SHOPEE	2025-08-06 08:47:44	2025-08-06 08:47:44
15	15	\N	5	\N	2025-08-04	Barang masuk dari sumber SHOPEE	2025-08-06 08:47:44	2025-08-06 08:47:44
16	16	\N	5	\N	2025-08-04	Barang masuk dari sumber SHOPEE	2025-08-06 08:47:44	2025-08-06 08:47:44
17	17	\N	5	\N	2025-08-04	Barang masuk dari sumber SHOPEE	2025-08-06 08:47:44	2025-08-06 08:47:44
18	18	\N	5	\N	2025-08-04	Barang masuk dari sumber SHOPEE	2025-08-06 08:47:44	2025-08-06 08:47:44
19	19	\N	5	\N	2025-08-04	Barang masuk dari sumber SHOPEE	2025-08-06 08:47:44	2025-08-06 08:47:44
20	20	\N	5	\N	2025-08-04	Barang masuk dari sumber SHOPEE	2025-08-06 08:47:44	2025-08-06 08:47:44
21	21	\N	5	\N	2025-08-05	Barang masuk dari sumber SHOPEE	2025-08-06 08:50:15	2025-08-06 08:50:15
22	22	\N	5	\N	2025-08-05	Barang masuk dari sumber SHOPEE	2025-08-06 08:50:15	2025-08-06 08:50:15
23	23	\N	5	\N	2025-08-05	Barang masuk dari sumber SHOPEE	2025-08-06 08:50:15	2025-08-06 08:50:15
24	24	\N	5	\N	2025-08-05	Barang masuk dari sumber SHOPEE	2025-08-06 08:50:15	2025-08-06 08:50:15
25	25	\N	5	\N	2025-08-05	Barang masuk dari sumber SHOPEE	2025-08-06 08:50:15	2025-08-06 08:50:15
26	26	\N	5	\N	2025-08-05	Barang masuk dari sumber SHOPEE	2025-08-06 08:50:15	2025-08-06 08:50:15
27	27	\N	5	\N	2025-08-05	Barang masuk dari sumber SHOPEE	2025-08-06 08:50:15	2025-08-06 08:50:15
28	28	\N	5	\N	2025-08-05	Barang masuk dari sumber SHOPEE	2025-08-06 08:50:15	2025-08-06 08:50:15
29	29	\N	5	\N	2025-08-05	Barang masuk dari sumber SHOPEE	2025-08-06 08:50:15	2025-08-06 08:50:15
30	30	\N	5	\N	2025-08-05	Barang masuk dari sumber SHOPEE	2025-08-06 08:50:15	2025-08-06 08:50:15
31	31	\N	5	\N	2025-08-05	Barang masuk dari sumber SHOPEE	2025-08-06 08:50:15	2025-08-06 08:50:15
32	32	\N	5	\N	2025-08-05	Barang masuk dari sumber SHOPEE	2025-08-06 08:50:15	2025-08-06 08:50:15
33	33	\N	5	\N	2025-08-05	Barang masuk dari sumber SHOPEE	2025-08-06 08:50:15	2025-08-06 08:50:15
34	34	\N	5	\N	2025-08-05	Barang masuk dari sumber SHOPEE	2025-08-06 08:50:15	2025-08-06 08:50:15
35	35	\N	5	\N	2025-08-05	Barang masuk dari sumber SHOPEE	2025-08-06 08:50:15	2025-08-06 08:50:15
36	36	\N	5	\N	2025-08-06	Barang masuk dari sumber SHOPEE	2025-08-06 08:57:01	2025-08-06 08:57:01
37	37	\N	5	\N	2025-08-06	Barang masuk dari sumber SHOPEE	2025-08-06 08:57:01	2025-08-06 08:57:01
38	38	\N	5	\N	2025-08-06	Barang masuk dari sumber SHOPEE	2025-08-06 08:57:01	2025-08-06 08:57:01
39	39	\N	5	\N	2025-08-06	Barang masuk dari sumber SHOPEE	2025-08-06 08:57:01	2025-08-06 08:57:01
40	40	\N	5	\N	2025-08-06	Barang masuk dari sumber SHOPEE	2025-08-06 08:57:01	2025-08-06 08:57:01
41	41	\N	5	\N	2025-08-06	Barang masuk dari sumber SHOPEE	2025-08-06 08:57:01	2025-08-06 08:57:01
42	42	\N	5	\N	2025-08-06	Barang masuk dari sumber SHOPEE	2025-08-06 08:57:01	2025-08-06 08:57:01
43	43	\N	5	\N	2025-08-02	Barang masuk dari sumber SHOPEE	2025-08-06 09:00:40	2025-08-06 09:00:40
44	44	\N	5	\N	2025-08-02	Barang masuk dari sumber SHOPEE	2025-08-06 09:00:40	2025-08-06 09:00:40
46	46	\N	5	\N	2025-08-02	Barang masuk dari sumber SHOPEE	2025-08-06 09:00:40	2025-08-06 09:00:40
47	47	\N	5	\N	2025-08-01	Barang masuk dari sumber SHOPEE	2025-08-06 09:10:02	2025-08-06 09:10:02
48	48	\N	5	\N	2025-08-01	Barang masuk dari sumber SHOPEE	2025-08-06 09:10:02	2025-08-06 09:10:02
49	49	\N	5	\N	2025-08-01	Barang masuk dari sumber SHOPEE	2025-08-06 09:10:02	2025-08-06 09:10:02
50	50	\N	5	\N	2025-08-01	Barang masuk dari sumber SHOPEE	2025-08-06 09:10:02	2025-08-06 09:10:02
51	51	\N	5	\N	2025-08-01	Barang masuk dari sumber SHOPEE	2025-08-06 09:10:02	2025-08-06 09:10:02
52	52	\N	5	\N	2025-08-01	Barang masuk dari sumber SHOPEE	2025-08-06 09:10:02	2025-08-06 09:10:02
53	53	\N	5	\N	2025-08-01	Barang masuk dari sumber SHOPEE	2025-08-06 09:10:02	2025-08-06 09:10:02
54	54	\N	5	\N	2025-08-01	Barang masuk dari sumber SHOPEE	2025-08-06 09:10:02	2025-08-06 09:10:02
55	55	\N	5	\N	2025-08-01	Barang masuk dari sumber SHOPEE	2025-08-06 09:10:02	2025-08-06 09:10:02
56	56	\N	5	\N	2025-08-01	Barang masuk dari sumber SHOPEE	2025-08-06 09:10:02	2025-08-06 09:10:02
57	57	\N	5	\N	2025-08-01	Barang masuk dari sumber SHOPEE	2025-08-06 09:10:02	2025-08-06 09:10:02
58	58	\N	5	\N	2025-08-01	Barang masuk dari sumber SHOPEE	2025-08-06 09:10:02	2025-08-06 09:10:02
59	59	\N	5	\N	2025-08-01	Barang masuk dari sumber SHOPEE	2025-08-06 09:10:02	2025-08-06 09:10:02
60	60	\N	5	\N	2025-08-01	Barang masuk dari sumber SHOPEE	2025-08-06 09:10:02	2025-08-06 09:10:02
61	61	\N	5	\N	2025-08-01	Barang masuk dari sumber SHOPEE	2025-08-06 09:10:02	2025-08-06 09:10:02
62	62	\N	5	\N	2025-08-01	Barang masuk dari sumber SHOPEE	2025-08-06 09:10:02	2025-08-06 09:10:02
63	63	\N	5	\N	2025-08-01	Barang masuk dari sumber SHOPEE	2025-08-06 09:10:02	2025-08-06 09:10:02
64	64	\N	5	\N	2025-08-01	Barang masuk dari sumber SHOPEE	2025-08-06 09:10:02	2025-08-06 09:10:02
65	65	\N	5	\N	2025-08-02	Barang masuk dari sumber SHOPEE	2025-08-06 09:14:24	2025-08-06 09:14:24
66	66	\N	5	\N	2025-08-02	Barang masuk dari sumber SHOPEE	2025-08-06 09:14:24	2025-08-06 09:14:24
67	67	\N	5	\N	2025-08-02	Barang masuk dari sumber SHOPEE	2025-08-06 09:14:24	2025-08-06 09:14:24
68	68	\N	5	\N	2025-08-02	Barang masuk dari sumber SHOPEE	2025-08-06 09:14:24	2025-08-06 09:14:24
69	69	\N	5	\N	2025-08-02	Barang masuk dari sumber SHOPEE	2025-08-06 09:14:24	2025-08-06 09:14:24
70	70	\N	5	\N	2025-08-02	Barang masuk dari sumber SHOPEE	2025-08-06 09:14:24	2025-08-06 09:14:24
71	71	\N	5	\N	2025-08-02	Barang masuk dari sumber SHOPEE	2025-08-06 09:14:24	2025-08-06 09:14:24
72	72	\N	5	\N	2025-08-02	Barang masuk dari sumber SHOPEE	2025-08-06 09:14:24	2025-08-06 09:14:24
73	73	\N	5	\N	2025-08-02	Barang masuk dari sumber SHOPEE	2025-08-06 09:14:24	2025-08-06 09:14:24
74	74	\N	5	\N	2025-08-02	Barang masuk dari sumber SHOPEE	2025-08-06 09:14:24	2025-08-06 09:14:24
75	75	\N	5	\N	2025-08-02	Barang masuk dari sumber SHOPEE	2025-08-06 09:14:24	2025-08-06 09:14:24
76	76	\N	5	\N	2025-08-02	Barang masuk dari sumber SHOPEE	2025-08-06 09:14:24	2025-08-06 09:14:24
77	77	\N	5	\N	2025-08-02	Barang masuk dari sumber SHOPEE	2025-08-06 09:14:24	2025-08-06 09:14:24
78	78	\N	5	\N	2025-08-02	Barang masuk dari sumber SHOPEE	2025-08-06 09:14:24	2025-08-06 09:14:24
79	79	\N	5	\N	2025-08-02	Barang masuk dari sumber SHOPEE	2025-08-06 09:14:24	2025-08-06 09:14:24
80	80	\N	5	\N	2025-08-02	Barang masuk dari sumber SHOPEE	2025-08-06 09:14:24	2025-08-06 09:14:24
81	81	\N	5	\N	2025-08-02	Barang masuk dari sumber SHOPEE	2025-08-06 09:14:24	2025-08-06 09:14:24
82	36	5	3	\N	2025-08-06	Barang keluar dengan status: dipinjamkan	2025-08-06 09:17:48	2025-08-06 09:17:48
83	37	5	3	\N	2025-08-06	Barang keluar dengan status: dipinjamkan	2025-08-06 09:17:48	2025-08-06 09:17:48
84	38	5	3	\N	2025-08-06	Barang keluar dengan status: dipinjamkan	2025-08-06 09:17:48	2025-08-06 09:17:48
85	1	5	4	\N	2025-08-06	Barang keluar dengan status: dipinjamkan	2025-08-06 09:19:59	2025-08-06 09:19:59
86	2	5	4	\N	2025-08-06	Barang keluar dengan status: dipinjamkan	2025-08-06 09:19:59	2025-08-06 09:19:59
87	3	5	4	\N	2025-08-06	Barang keluar dengan status: dipinjamkan	2025-08-06 09:19:59	2025-08-06 09:19:59
88	4	5	4	\N	2025-08-06	Barang keluar dengan status: dipinjamkan	2025-08-06 09:19:59	2025-08-06 09:19:59
89	5	5	4	\N	2025-08-06	Barang keluar dengan status: dipinjamkan	2025-08-06 09:19:59	2025-08-06 09:19:59
90	47	5	4	\N	2025-08-05	Barang keluar dengan status: dipinjamkan	2025-08-06 09:21:41	2025-08-06 09:21:41
91	48	5	4	\N	2025-08-05	Barang keluar dengan status: dipinjamkan	2025-08-06 09:21:41	2025-08-06 09:21:41
92	49	5	4	\N	2025-08-05	Barang keluar dengan status: dipinjamkan	2025-08-06 09:21:41	2025-08-06 09:21:41
93	50	5	4	\N	2025-08-05	Barang keluar dengan status: dipinjamkan	2025-08-06 09:21:41	2025-08-06 09:21:41
94	51	5	4	\N	2025-08-05	Barang keluar dengan status: dipinjamkan	2025-08-06 09:21:41	2025-08-06 09:21:41
95	52	5	4	\N	2025-08-05	Barang keluar dengan status: dipinjamkan	2025-08-06 09:21:41	2025-08-06 09:21:41
96	53	5	4	\N	2025-08-05	Barang keluar dengan status: dipinjamkan	2025-08-06 09:21:41	2025-08-06 09:21:41
97	54	5	4	\N	2025-08-05	Barang keluar dengan status: dipinjamkan	2025-08-06 09:21:41	2025-08-06 09:21:41
98	55	5	4	\N	2025-08-05	Barang keluar dengan status: dipinjamkan	2025-08-06 09:21:41	2025-08-06 09:21:41
99	56	5	4	\N	2025-08-05	Barang keluar dengan status: dipinjamkan	2025-08-06 09:21:41	2025-08-06 09:21:41
101	83	\N	5	\N	2025-08-06	Barang masuk dari sumber SHOPEE	2025-08-08 02:43:21	2025-08-08 02:43:21
102	8	5	4	\N	2025-08-06	Barang keluar dengan status: dipinjamkan (diedit)	2025-08-08 03:10:00	2025-08-08 03:10:00
103	37	3	5	\N	2025-08-08	Barang kembali dengan status: rusak	2025-08-08 03:11:50	2025-08-08 03:11:50
104	38	3	5	\N	2025-08-08	Barang kembali dengan status: bagus	2025-08-08 03:11:50	2025-08-08 03:11:50
105	36	3	5	\N	2025-08-08	Barang kembali dengan status: bagus	2025-08-08 03:11:50	2025-08-08 03:11:50
106	38	5	5	\N	2025-08-08	Perubahan kondisi pada transaksi kembali: rusak	2025-08-08 03:25:52	2025-08-08 03:25:52
107	36	5	5	\N	2025-08-08	Perubahan kondisi pada transaksi kembali: rusak	2025-08-08 03:25:52	2025-08-08 03:25:52
108	36	5	3	\N	2025-08-08	Pembatalan pengembalian ΓÇö kembali ke distribusi. Kondisi sebelumnya: rusak	2025-08-08 03:32:51	2025-08-08 03:32:51
109	38	5	3	\N	2025-08-08	Pembatalan pengembalian ΓÇö kembali ke distribusi. Kondisi sebelumnya: rusak	2025-08-08 03:34:03	2025-08-08 03:34:03
110	4	4	5	\N	2025-08-08	Barang kembali dengan status: diperbaiki	2025-08-08 07:08:48	2025-08-08 07:08:48
111	1	4	5	\N	2025-08-08	Barang kembali dengan status: diperbaiki	2025-08-08 07:08:48	2025-08-08 07:08:48
112	2	4	5	\N	2025-08-08	Barang kembali dengan status: diperbaiki	2025-08-08 07:08:48	2025-08-08 07:08:48
113	5	4	5	\N	2025-08-08	Barang kembali dengan status: diperbaiki	2025-08-08 07:08:48	2025-08-08 07:08:48
114	55	4	5	\N	2025-08-09	Barang kembali dengan status: rusak	2025-08-09 07:40:45	2025-08-09 07:40:45
115	48	4	5	\N	2025-08-09	Barang kembali dengan status: rusak	2025-08-09 07:40:45	2025-08-09 07:40:45
116	56	4	5	\N	2025-08-09	Barang kembali dengan status: rusak	2025-08-09 07:40:45	2025-08-09 07:40:45
117	52	4	5	\N	2025-08-09	Barang kembali dengan status: rusak	2025-08-09 07:40:45	2025-08-09 07:40:45
118	51	4	5	\N	2025-08-09	Barang kembali dengan status: rusak	2025-08-09 07:40:45	2025-08-09 07:40:45
119	50	4	5	\N	2025-08-09	Barang kembali dengan status: rusak	2025-08-09 07:40:45	2025-08-09 07:40:45
120	54	4	5	\N	2025-08-09	Barang kembali dengan status: rusak	2025-08-09 07:40:45	2025-08-09 07:40:45
121	84	\N	5	\N	2025-08-13	Barang masuk dari sumber SHOPEE	2025-08-13 08:18:43	2025-08-13 08:18:43
122	84	5	2	\N	2025-08-13	Barang keluar dengan status: dipinjamkan	2025-08-13 08:24:51	2025-08-13 08:24:51
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.password_reset_tokens (email, token, created_at) FROM stdin;
\.


--
-- Data for Name: pemusnahan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pemusnahan (id, kode_pemusnahaan, user_id, tanggal_pemusnahaan, alasan, status, approved_by, dokumen_bukti, created_at, updated_at) FROM stdin;
4	BAP-20250809-072845	1	\N	barang rusak	approved	\N	\N	2025-08-09 07:28:45	2025-08-09 07:35:44
5	BAP-20250813-024203	3	2025-08-13	sudah habis masanya	approved	3	\N	2025-08-13 02:42:03	2025-08-13 02:42:25
6	BAP-20250813-024247	3	2025-08-13	habis masanya juga	approved	1	\N	2025-08-13 02:42:47	2025-08-13 03:20:39
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.permissions (id, name, guard_name, created_at, updated_at, is_system) FROM stdin;
1	view-dashboard	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
2	view-kategori	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
3	create-kategori	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
4	edit-kategori	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
5	delete-kategori	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
6	view-merek	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
7	create-merek	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
8	edit-merek	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
9	delete-merek	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
10	view-model	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
11	create-model	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
12	edit-model	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
13	delete-model	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
14	view-jenis	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
15	create-jenis	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
16	edit-jenis	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
17	delete-jenis	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
18	view-asal-barang	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
19	create-asal-barang	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
20	edit-asal-barang	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
21	delete-asal-barang	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
22	view-lokasi-distribusi	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
23	create-lokasi-distribusi	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
24	edit-lokasi-distribusi	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
25	delete-lokasi-distribusi	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
26	view-rak-barang	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
27	create-rak-barang	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
28	edit-rak-barang	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
29	delete-rak-barang	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
30	view-barang-masuk	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
31	create-barang-masuk	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
32	edit-barang-masuk	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
33	delete-barang-masuk	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
34	view-barang-keluar	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
35	create-barang-keluar	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
36	edit-barang-keluar	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
37	delete-barang-keluar	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
38	view-barang-kembali	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
39	create-barang-kembali	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
40	edit-barang-kembali	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
41	delete-barang-kembali	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
42	view-stok-gudang	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
43	edit-stok-gudang	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
44	view-stok-distribusi	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
45	edit-stok-distribusi	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
46	view-stok-terjual	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
47	edit-stok-terjual	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
48	view-stok-diperbaiki	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
49	edit-stok-diperbaiki	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
50	view-stok-rusak	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
51	edit-stok-rusak	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
52	view-stok-total	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
53	edit-stok-total	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
54	view-stock-opname	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
55	create-stock-opname	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
56	edit-stock-opname	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
57	delete-stock-opname	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
58	view-dashboard-laporan	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
59	view-laporan-barang-masuk	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
60	view-laporan-barang-keluar	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
61	view-laporan-barang-kembali	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
62	view-laporan-mutasi	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
63	view-user	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
64	create-user	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
65	edit-user	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
66	delete-user	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
67	view-role	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
68	create-role	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
69	edit-role	web	2025-08-11 09:44:28	2025-08-11 09:44:28	f
70	delete-role	web	2025-08-11 09:44:29	2025-08-11 09:44:29	f
71	view-permission	web	2025-08-11 09:44:29	2025-08-11 09:44:29	f
72	edit-permission	web	2025-08-11 09:44:29	2025-08-11 09:44:29	f
73	view-setting	web	2025-08-11 09:44:29	2025-08-11 09:44:29	f
74	edit-setting	web	2025-08-11 09:44:29	2025-08-11 09:44:29	f
75	view-transaksi	web	2025-08-12 03:58:02	2025-08-12 03:58:02	f
76	view-stock-dashboard	web	2025-08-12 04:47:50	2025-08-12 04:47:50	f
77	approve-stok-rusak	web	2025-08-13 02:43:24	2025-08-13 02:44:06	f
\.


--
-- Data for Name: rak_barang; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rak_barang (id, lokasi_id, nama_rak, baris, kode_rak, created_at, updated_at) FROM stdin;
4	5	Lemari besi (1)	4	A004	2025-08-06 08:42:24	2025-08-06 08:44:06
3	5	Lemari besi (1)	3	A003	2025-08-06 08:42:14	2025-08-06 08:44:13
2	5	Lemari besi (1)	2	A002	2025-08-06 08:42:06	2025-08-06 08:44:20
1	5	Lemari besi (1)	1	A001	2025-08-06 08:41:56	2025-08-06 08:44:26
\.


--
-- Data for Name: rekap_stok_barang; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rekap_stok_barang (id, lokasi_id, jumlah_total, jumlah_tersedia, jumlah_rusak, jumlah_perbaikan, jumlah_terdistribusi, created_at, updated_at, model_id, jumlah_terjual) FROM stdin;
5	5	17	17	0	0	0	2025-08-06 09:14:24	2025-08-06 09:14:24	5	0
6	3	0	2	0	0	0	2025-08-06 09:17:48	2025-08-08 03:34:03	2	0
7	4	0	2	0	0	0	2025-08-06 09:19:59	2025-08-08 07:08:48	1	0
1	5	35	30	0	3	0	2025-08-06 08:47:44	2025-08-08 10:12:47	1	0
2	5	7	6	0	0	0	2025-08-06 08:57:01	2025-08-09 07:35:44	2	0
3	5	4	4	0	0	0	2025-08-06 09:00:40	2025-08-06 09:00:40	3	0
8	4	0	3	0	0	0	2025-08-06 09:21:41	2025-08-09 07:40:45	4	0
4	5	16	9	4	0	0	2025-08-06 09:10:02	2025-08-13 03:20:39	4	0
9	5	1	0	0	0	0	2025-08-13 08:18:43	2025-08-13 08:24:51	6	0
10	2	0	1	0	0	0	2025-08-13 08:24:51	2025-08-13 08:24:51	6	0
\.


--
-- Data for Name: riwayat_status_barang; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.riwayat_status_barang (id, barang_id, user_id, tanggal, status, catatan, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: role_has_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role_has_permissions (permission_id, role_id) FROM stdin;
1	3
68	3
67	3
69	3
70	3
71	3
72	3
73	3
74	3
64	3
63	3
65	3
66	3
1	1
3	1
2	1
4	1
5	1
7	1
6	1
8	1
9	1
11	1
10	1
12	1
13	1
15	1
14	1
16	1
17	1
19	1
18	1
20	1
21	1
23	1
22	1
24	1
25	1
27	1
26	1
28	1
29	1
30	1
32	1
33	1
35	1
34	1
36	1
37	1
39	1
38	1
40	1
41	1
42	1
43	1
44	1
45	1
46	1
47	1
48	1
49	1
50	1
51	1
52	1
53	1
55	1
54	1
56	1
57	1
58	1
59	1
60	1
61	1
62	1
64	1
63	1
65	1
66	1
68	1
67	1
69	1
70	1
71	1
72	1
73	1
74	1
31	1
75	1
76	1
77	1
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, name, guard_name, created_at, updated_at) FROM stdin;
1	super-admin	web	2025-08-06 02:20:09	2025-08-06 02:20:09
2	user	web	2025-08-06 05:18:07	2025-08-06 05:18:07
3	developer	web	2025-08-12 04:22:32	2025-08-12 04:22:32
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (id, user_id, ip_address, user_agent, payload, last_activity) FROM stdin;
ZJjCckrprWgavPplGpxxoVg77lchCALK0FnVMmgU	1	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	YTo1OntzOjY6Il90b2tlbiI7czo0MDoiZk1mMHJVYldveVBVNnpMc2J1cklPMjRkeFgzQU5XWklMYU5NdjJ2bCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC90cmFuc2Frc2kiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxO3M6MjI6IlBIUERFQlVHQkFSX1NUQUNLX0RBVEEiO2E6MDp7fX0=	1755227632
\.


--
-- Data for Name: stock_opname; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stock_opname (id, tanggal, lokasi_id, user_id, catatan, created_at, updated_at, approved_by, approved_at) FROM stdin;
1	2025-08-07	5	1	\N	2025-08-07 02:38:01	2025-08-07 02:38:01	\N	\N
2	2025-08-07	5	1	coba fitur	2025-08-07 04:56:52	2025-08-07 04:56:52	\N	\N
3	2025-08-07	5	1	tes	2025-08-07 09:16:53	2025-08-07 09:16:53	\N	\N
\.


--
-- Data for Name: stock_opname_detail; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stock_opname_detail (id, stock_opname_id, model_id, jumlah_sistem, jumlah_fisik, selisih, catatan, created_at, updated_at, serial_hilang, serial_baru) FROM stdin;
1	1	4	8	8	0	\N	2025-08-07 02:38:01	2025-08-07 02:38:01	\N	\N
2	1	2	4	6	2	\N	2025-08-07 02:38:01	2025-08-07 02:38:01	\N	\N
3	1	3	4	3	-1	\N	2025-08-07 02:38:01	2025-08-07 02:38:01	\N	\N
4	2	3	4	4	0	\N	2025-08-07 04:56:52	2025-08-07 04:56:52	\N	\N
5	2	2	4	5	1	\N	2025-08-07 04:56:52	2025-08-07 04:56:52	\N	\N
6	3	2	4	5	1	\N	2025-08-07 09:16:53	2025-08-07 09:16:53	[]	["D5J224614390"]
7	3	3	4	2	-2	\N	2025-08-07 09:16:53	2025-08-07 09:16:53	["D5J231904084","D5J231903951"]	[]
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, email_verified_at, password, remember_token, created_at, updated_at) FROM stdin;
2	user	user@gmail.com	\N	$2y$12$/ovnMnbFqkQUbsuclApLBuftHgtHAqdlfWVBBumsRkv4d3DmcJk/W	\N	2025-08-06 05:20:12	2025-08-06 05:20:12
1	admin	admin@gmail.com	\N	$2y$12$oJlWD055r6hZ.G5XZ/Ux0uzGCs0EAOclMyO4d/rYlU48lb1A3jupG	4RXPkMBFNTgeS74MvrLk7DfRSUcmEukKOmEiXS7dIxLmlBX38pdeaFsT6lJb	2025-07-30 13:32:22	2025-07-30 13:32:22
3	developer	rikinurjaman@gmail.com	\N	$2y$12$RUuxMUKLTsAurtwLp9.ENeCEuKFnhz2aC0RlcAYzwuUqkS5e7YUdK	YcRvEvF8MSwy9tDjXLBwIm0kpUUhPhGWwcA9UCDTbtbiY847zlhz2GAS5SMs	2025-08-12 04:36:15	2025-08-12 04:37:19
\.


--
-- Name: asal_barang_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.asal_barang_id_seq', 2, true);


--
-- Name: barang_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.barang_id_seq', 84, true);


--
-- Name: barang_keluar_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.barang_keluar_detail_id_seq', 20, true);


--
-- Name: barang_keluar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.barang_keluar_id_seq', 4, true);


--
-- Name: barang_kembali_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.barang_kembali_detail_id_seq', 14, true);


--
-- Name: barang_kembali_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.barang_kembali_id_seq', 3, true);


--
-- Name: barang_masuk_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.barang_masuk_detail_id_seq', 84, true);


--
-- Name: barang_masuk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.barang_masuk_id_seq', 7, true);


--
-- Name: barang_pemusnahan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.barang_pemusnahan_id_seq', 3, true);


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.failed_jobs_id_seq', 1, false);


--
-- Name: jenis_barang_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.jenis_barang_id_seq', 1, true);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.jobs_id_seq', 1, false);


--
-- Name: kategori_barang_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.kategori_barang_id_seq', 1, true);


--
-- Name: lokasi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lokasi_id_seq', 5, true);


--
-- Name: merek_barang_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.merek_barang_id_seq', 5, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.migrations_id_seq', 29, true);


--
-- Name: model_barang_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.model_barang_id_seq', 6, true);


--
-- Name: mutasi_barang_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mutasi_barang_id_seq', 122, true);


--
-- Name: pemusnahan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pemusnahan_id_seq', 6, true);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.permissions_id_seq', 77, true);


--
-- Name: rak_barang_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rak_barang_id_seq', 5, true);


--
-- Name: rekap_stok_barang_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rekap_stok_barang_id_seq', 10, true);


--
-- Name: riwayat_status_barang_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.riwayat_status_barang_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_id_seq', 3, true);


--
-- Name: stock_opname_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.stock_opname_detail_id_seq', 7, true);


--
-- Name: stock_opname_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.stock_opname_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: asal_barang asal_barang_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asal_barang
    ADD CONSTRAINT asal_barang_pkey PRIMARY KEY (id);


--
-- Name: barang_keluar_detail barang_keluar_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_keluar_detail
    ADD CONSTRAINT barang_keluar_detail_pkey PRIMARY KEY (id);


--
-- Name: barang_keluar barang_keluar_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_keluar
    ADD CONSTRAINT barang_keluar_pkey PRIMARY KEY (id);


--
-- Name: barang_kembali_detail barang_kembali_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_kembali_detail
    ADD CONSTRAINT barang_kembali_detail_pkey PRIMARY KEY (id);


--
-- Name: barang_kembali barang_kembali_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_kembali
    ADD CONSTRAINT barang_kembali_pkey PRIMARY KEY (id);


--
-- Name: barang_masuk_detail barang_masuk_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_masuk_detail
    ADD CONSTRAINT barang_masuk_detail_pkey PRIMARY KEY (id);


--
-- Name: barang_masuk barang_masuk_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_masuk
    ADD CONSTRAINT barang_masuk_pkey PRIMARY KEY (id);


--
-- Name: barang_pemusnahan barang_pemusnahan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_pemusnahan
    ADD CONSTRAINT barang_pemusnahan_pkey PRIMARY KEY (id);


--
-- Name: barang barang_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang
    ADD CONSTRAINT barang_pkey PRIMARY KEY (id);


--
-- Name: barang barang_serial_number_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang
    ADD CONSTRAINT barang_serial_number_unique UNIQUE (serial_number);


--
-- Name: cache_locks cache_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);


--
-- Name: cache cache_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);


--
-- Name: failed_jobs failed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);


--
-- Name: jenis_barang jenis_barang_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jenis_barang
    ADD CONSTRAINT jenis_barang_pkey PRIMARY KEY (id);


--
-- Name: job_batches job_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: kategori_barang kategori_barang_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kategori_barang
    ADD CONSTRAINT kategori_barang_pkey PRIMARY KEY (id);


--
-- Name: lokasi lokasi_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lokasi
    ADD CONSTRAINT lokasi_pkey PRIMARY KEY (id);


--
-- Name: merek_barang merek_barang_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.merek_barang
    ADD CONSTRAINT merek_barang_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: model_barang model_barang_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.model_barang
    ADD CONSTRAINT model_barang_pkey PRIMARY KEY (id);


--
-- Name: model_has_permissions model_has_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.model_has_permissions
    ADD CONSTRAINT model_has_permissions_pkey PRIMARY KEY (permission_id, model_id, model_type);


--
-- Name: model_has_roles model_has_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.model_has_roles
    ADD CONSTRAINT model_has_roles_pkey PRIMARY KEY (role_id, model_id, model_type);


--
-- Name: mutasi_barang mutasi_barang_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mutasi_barang
    ADD CONSTRAINT mutasi_barang_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);


--
-- Name: pemusnahan pemusnahan_kode_pemusnahaan_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pemusnahan
    ADD CONSTRAINT pemusnahan_kode_pemusnahaan_unique UNIQUE (kode_pemusnahaan);


--
-- Name: pemusnahan pemusnahan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pemusnahan
    ADD CONSTRAINT pemusnahan_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_name_guard_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_guard_name_unique UNIQUE (name, guard_name);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: rak_barang rak_barang_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rak_barang
    ADD CONSTRAINT rak_barang_pkey PRIMARY KEY (id);


--
-- Name: rekap_stok_barang rekap_stok_barang_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rekap_stok_barang
    ADD CONSTRAINT rekap_stok_barang_pkey PRIMARY KEY (id);


--
-- Name: riwayat_status_barang riwayat_status_barang_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.riwayat_status_barang
    ADD CONSTRAINT riwayat_status_barang_pkey PRIMARY KEY (id);


--
-- Name: role_has_permissions role_has_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_has_permissions
    ADD CONSTRAINT role_has_permissions_pkey PRIMARY KEY (permission_id, role_id);


--
-- Name: roles roles_name_guard_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_guard_name_unique UNIQUE (name, guard_name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: stock_opname_detail stock_opname_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_opname_detail
    ADD CONSTRAINT stock_opname_detail_pkey PRIMARY KEY (id);


--
-- Name: stock_opname stock_opname_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_opname
    ADD CONSTRAINT stock_opname_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_asal_barang_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_asal_barang_created_at ON public.asal_barang USING btree (created_at DESC);


--
-- Name: idx_asal_barang_nama_lower; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_asal_barang_nama_lower ON public.asal_barang USING btree (lower((nama)::text));


--
-- Name: idx_barang_masuk_asal_barang_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_barang_masuk_asal_barang_id ON public.barang_masuk USING btree (asal_barang_id);


--
-- Name: idx_barang_masuk_tanggal; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_barang_masuk_tanggal ON public.barang_masuk USING btree (tanggal DESC);


--
-- Name: idx_barang_model_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_barang_model_id ON public.barang USING btree (model_id);


--
-- Name: idx_barang_serial_lower; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_barang_serial_lower ON public.barang USING btree (lower((serial_number)::text));


--
-- Name: idx_bmd_barang_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bmd_barang_id ON public.barang_masuk_detail USING btree (barang_id);


--
-- Name: idx_bmd_barang_masuk_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bmd_barang_masuk_id ON public.barang_masuk_detail USING btree (barang_masuk_id);


--
-- Name: idx_jenis_barang_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_jenis_barang_created_at ON public.jenis_barang USING btree (created_at DESC);


--
-- Name: idx_jenis_barang_kategori_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_jenis_barang_kategori_id ON public.jenis_barang USING btree (kategori_id);


--
-- Name: idx_jenis_barang_nama_lower; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_jenis_barang_nama_lower ON public.jenis_barang USING btree (lower((nama)::text));


--
-- Name: idx_kategori_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_kategori_created_at ON public.kategori_barang USING btree (created_at);


--
-- Name: idx_kategori_nama; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_kategori_nama ON public.kategori_barang USING btree (nama);


--
-- Name: idx_lokasi_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lokasi_created_at ON public.lokasi USING btree (created_at DESC);


--
-- Name: idx_lokasi_is_gudang; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lokasi_is_gudang ON public.lokasi USING btree (is_gudang);


--
-- Name: idx_lokasi_nama_lower; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lokasi_nama_lower ON public.lokasi USING btree (lower((nama)::text));


--
-- Name: idx_merek_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_merek_created_at ON public.merek_barang USING btree (created_at);


--
-- Name: idx_merek_nama; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_merek_nama ON public.merek_barang USING btree (nama);


--
-- Name: idx_model_barang_jenis_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_model_barang_jenis_id ON public.model_barang USING btree (jenis_id);


--
-- Name: idx_model_barang_kategori_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_model_barang_kategori_id ON public.model_barang USING btree (kategori_id);


--
-- Name: idx_model_barang_merek_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_model_barang_merek_id ON public.model_barang USING btree (merek_id);


--
-- Name: idx_model_barang_nama; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_model_barang_nama ON public.model_barang USING btree (nama);


--
-- Name: idx_model_barang_nama_lower; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_model_barang_nama_lower ON public.model_barang USING btree (lower((nama)::text));


--
-- Name: idx_rak_barang_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rak_barang_created_at ON public.rak_barang USING btree (created_at DESC);


--
-- Name: idx_rak_barang_lokasi_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rak_barang_lokasi_id ON public.rak_barang USING btree (lokasi_id);


--
-- Name: idx_rak_barang_nama_lower; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rak_barang_nama_lower ON public.rak_barang USING btree (lower((nama_rak)::text));


--
-- Name: jobs_queue_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);


--
-- Name: model_has_permissions_model_id_model_type_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX model_has_permissions_model_id_model_type_index ON public.model_has_permissions USING btree (model_id, model_type);


--
-- Name: model_has_roles_model_id_model_type_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX model_has_roles_model_id_model_type_index ON public.model_has_roles USING btree (model_id, model_type);


--
-- Name: sessions_last_activity_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);


--
-- Name: sessions_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);


--
-- Name: barang barang_asal_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang
    ADD CONSTRAINT barang_asal_id_foreign FOREIGN KEY (asal_id) REFERENCES public.asal_barang(id) ON DELETE SET NULL;


--
-- Name: barang barang_jenis_barang_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang
    ADD CONSTRAINT barang_jenis_barang_id_foreign FOREIGN KEY (jenis_barang_id) REFERENCES public.jenis_barang(id) ON DELETE CASCADE;


--
-- Name: barang_keluar_detail barang_keluar_detail_barang_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_keluar_detail
    ADD CONSTRAINT barang_keluar_detail_barang_id_foreign FOREIGN KEY (barang_id) REFERENCES public.barang(id) ON DELETE CASCADE;


--
-- Name: barang_keluar_detail barang_keluar_detail_barang_keluar_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_keluar_detail
    ADD CONSTRAINT barang_keluar_detail_barang_keluar_id_foreign FOREIGN KEY (barang_keluar_id) REFERENCES public.barang_keluar(id) ON DELETE CASCADE;


--
-- Name: barang_keluar barang_keluar_lokasi_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_keluar
    ADD CONSTRAINT barang_keluar_lokasi_id_foreign FOREIGN KEY (lokasi_id) REFERENCES public.lokasi(id) ON DELETE RESTRICT;


--
-- Name: barang_keluar barang_keluar_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_keluar
    ADD CONSTRAINT barang_keluar_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: barang_kembali_detail barang_kembali_detail_barang_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_kembali_detail
    ADD CONSTRAINT barang_kembali_detail_barang_id_foreign FOREIGN KEY (barang_id) REFERENCES public.barang(id) ON DELETE CASCADE;


--
-- Name: barang_kembali_detail barang_kembali_detail_barang_kembali_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_kembali_detail
    ADD CONSTRAINT barang_kembali_detail_barang_kembali_id_foreign FOREIGN KEY (barang_kembali_id) REFERENCES public.barang_kembali(id) ON DELETE CASCADE;


--
-- Name: barang_kembali barang_kembali_lokasi_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_kembali
    ADD CONSTRAINT barang_kembali_lokasi_id_foreign FOREIGN KEY (lokasi_id) REFERENCES public.lokasi(id) ON DELETE RESTRICT;


--
-- Name: barang_kembali barang_kembali_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_kembali
    ADD CONSTRAINT barang_kembali_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: barang barang_lokasi_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang
    ADD CONSTRAINT barang_lokasi_id_foreign FOREIGN KEY (lokasi_id) REFERENCES public.lokasi(id) ON DELETE SET NULL;


--
-- Name: barang_masuk barang_masuk_asal_barang_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_masuk
    ADD CONSTRAINT barang_masuk_asal_barang_id_foreign FOREIGN KEY (asal_barang_id) REFERENCES public.asal_barang(id) ON DELETE SET NULL;


--
-- Name: barang_masuk_detail barang_masuk_detail_barang_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_masuk_detail
    ADD CONSTRAINT barang_masuk_detail_barang_id_foreign FOREIGN KEY (barang_id) REFERENCES public.barang(id) ON DELETE CASCADE;


--
-- Name: barang_masuk_detail barang_masuk_detail_barang_masuk_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_masuk_detail
    ADD CONSTRAINT barang_masuk_detail_barang_masuk_id_foreign FOREIGN KEY (barang_masuk_id) REFERENCES public.barang_masuk(id) ON DELETE CASCADE;


--
-- Name: barang_masuk barang_masuk_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_masuk
    ADD CONSTRAINT barang_masuk_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: barang barang_model_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang
    ADD CONSTRAINT barang_model_id_foreign FOREIGN KEY (model_id) REFERENCES public.model_barang(id) ON DELETE CASCADE;


--
-- Name: barang_pemusnahan barang_pemusnahan_barang_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_pemusnahan
    ADD CONSTRAINT barang_pemusnahan_barang_id_foreign FOREIGN KEY (barang_id) REFERENCES public.barang(id) ON DELETE CASCADE;


--
-- Name: barang_pemusnahan barang_pemusnahan_pemusnahan_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang_pemusnahan
    ADD CONSTRAINT barang_pemusnahan_pemusnahan_id_foreign FOREIGN KEY (pemusnahan_id) REFERENCES public.pemusnahan(id) ON DELETE CASCADE;


--
-- Name: barang barang_rak_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.barang
    ADD CONSTRAINT barang_rak_id_foreign FOREIGN KEY (rak_id) REFERENCES public.rak_barang(id);


--
-- Name: jenis_barang jenis_barang_kategori_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jenis_barang
    ADD CONSTRAINT jenis_barang_kategori_id_foreign FOREIGN KEY (kategori_id) REFERENCES public.kategori_barang(id) ON DELETE CASCADE;


--
-- Name: model_barang model_barang_jenis_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.model_barang
    ADD CONSTRAINT model_barang_jenis_id_foreign FOREIGN KEY (jenis_id) REFERENCES public.jenis_barang(id) ON DELETE SET NULL;


--
-- Name: model_barang model_barang_kategori_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.model_barang
    ADD CONSTRAINT model_barang_kategori_id_foreign FOREIGN KEY (kategori_id) REFERENCES public.kategori_barang(id) ON DELETE CASCADE;


--
-- Name: model_barang model_barang_merek_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.model_barang
    ADD CONSTRAINT model_barang_merek_id_foreign FOREIGN KEY (merek_id) REFERENCES public.merek_barang(id) ON DELETE CASCADE;


--
-- Name: model_has_permissions model_has_permissions_permission_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.model_has_permissions
    ADD CONSTRAINT model_has_permissions_permission_id_foreign FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: model_has_roles model_has_roles_role_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.model_has_roles
    ADD CONSTRAINT model_has_roles_role_id_foreign FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: mutasi_barang mutasi_barang_barang_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mutasi_barang
    ADD CONSTRAINT mutasi_barang_barang_id_foreign FOREIGN KEY (barang_id) REFERENCES public.barang(id) ON DELETE CASCADE;


--
-- Name: mutasi_barang mutasi_barang_lokasi_asal_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mutasi_barang
    ADD CONSTRAINT mutasi_barang_lokasi_asal_id_foreign FOREIGN KEY (lokasi_asal_id) REFERENCES public.lokasi(id) ON DELETE SET NULL;


--
-- Name: mutasi_barang mutasi_barang_lokasi_tujuan_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mutasi_barang
    ADD CONSTRAINT mutasi_barang_lokasi_tujuan_id_foreign FOREIGN KEY (lokasi_tujuan_id) REFERENCES public.lokasi(id) ON DELETE SET NULL;


--
-- Name: mutasi_barang mutasi_barang_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mutasi_barang
    ADD CONSTRAINT mutasi_barang_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: pemusnahan pemusnahan_approved_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pemusnahan
    ADD CONSTRAINT pemusnahan_approved_by_foreign FOREIGN KEY (approved_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: pemusnahan pemusnahan_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pemusnahan
    ADD CONSTRAINT pemusnahan_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: rak_barang rak_barang_lokasi_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rak_barang
    ADD CONSTRAINT rak_barang_lokasi_id_foreign FOREIGN KEY (lokasi_id) REFERENCES public.lokasi(id) ON DELETE CASCADE;


--
-- Name: rekap_stok_barang rekap_stok_barang_lokasi_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rekap_stok_barang
    ADD CONSTRAINT rekap_stok_barang_lokasi_id_foreign FOREIGN KEY (lokasi_id) REFERENCES public.lokasi(id) ON DELETE CASCADE;


--
-- Name: rekap_stok_barang rekap_stok_barang_model_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rekap_stok_barang
    ADD CONSTRAINT rekap_stok_barang_model_id_foreign FOREIGN KEY (model_id) REFERENCES public.model_barang(id) ON DELETE CASCADE;


--
-- Name: riwayat_status_barang riwayat_status_barang_barang_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.riwayat_status_barang
    ADD CONSTRAINT riwayat_status_barang_barang_id_foreign FOREIGN KEY (barang_id) REFERENCES public.barang(id) ON DELETE CASCADE;


--
-- Name: riwayat_status_barang riwayat_status_barang_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.riwayat_status_barang
    ADD CONSTRAINT riwayat_status_barang_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: role_has_permissions role_has_permissions_permission_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_has_permissions
    ADD CONSTRAINT role_has_permissions_permission_id_foreign FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: role_has_permissions role_has_permissions_role_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_has_permissions
    ADD CONSTRAINT role_has_permissions_role_id_foreign FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: stock_opname stock_opname_approved_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_opname
    ADD CONSTRAINT stock_opname_approved_by_foreign FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: stock_opname_detail stock_opname_detail_model_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_opname_detail
    ADD CONSTRAINT stock_opname_detail_model_id_foreign FOREIGN KEY (model_id) REFERENCES public.model_barang(id) ON DELETE CASCADE;


--
-- Name: stock_opname_detail stock_opname_detail_stock_opname_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_opname_detail
    ADD CONSTRAINT stock_opname_detail_stock_opname_id_foreign FOREIGN KEY (stock_opname_id) REFERENCES public.stock_opname(id) ON DELETE CASCADE;


--
-- Name: stock_opname stock_opname_lokasi_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_opname
    ADD CONSTRAINT stock_opname_lokasi_id_foreign FOREIGN KEY (lokasi_id) REFERENCES public.lokasi(id) ON DELETE RESTRICT;


--
-- Name: stock_opname stock_opname_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_opname
    ADD CONSTRAINT stock_opname_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

