

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


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."admin_settings" (
    "id" integer NOT NULL,
    "password_hash" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."admin_settings" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."admin_settings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."admin_settings_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."admin_settings_id_seq" OWNED BY "public"."admin_settings"."id";



CREATE TABLE IF NOT EXISTS "public"."facilities" (
    "id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text" NOT NULL,
    "image_url" "text",
    "order_index" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."facilities" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."facilities_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."facilities_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."facilities_id_seq" OWNED BY "public"."facilities"."id";



CREATE TABLE IF NOT EXISTS "public"."leaders" (
    "id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "role" character varying(50) NOT NULL,
    "description" "text",
    "image_url" "text",
    "order_index" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."leaders" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."leaders_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."leaders_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."leaders_id_seq" OWNED BY "public"."leaders"."id";



CREATE TABLE IF NOT EXISTS "public"."organization" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "members" "jsonb" DEFAULT '[]'::"jsonb",
    "order_index" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."organization" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."organization_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."organization_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."organization_id_seq" OWNED BY "public"."organization"."id";



CREATE TABLE IF NOT EXISTS "public"."scripture" (
    "id" integer NOT NULL,
    "verse" "text" NOT NULL,
    "reference" "text" NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."scripture" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."scripture_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."scripture_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."scripture_id_seq" OWNED BY "public"."scripture"."id";



CREATE TABLE IF NOT EXISTS "public"."slide_images" (
    "id" integer NOT NULL,
    "title" "text" NOT NULL,
    "image_url" "text" NOT NULL,
    "description" "text",
    "order_index" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."slide_images" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."slide_images_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."slide_images_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."slide_images_id_seq" OWNED BY "public"."slide_images"."id";



CREATE TABLE IF NOT EXISTS "public"."worship_guide" (
    "id" integer NOT NULL,
    "title" character varying(100) NOT NULL,
    "image_url" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."worship_guide" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."worship_guide_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."worship_guide_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."worship_guide_id_seq" OWNED BY "public"."worship_guide"."id";



ALTER TABLE ONLY "public"."admin_settings" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."admin_settings_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."facilities" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."facilities_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."leaders" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."leaders_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."organization" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."organization_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."scripture" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."scripture_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."slide_images" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."slide_images_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."worship_guide" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."worship_guide_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."admin_settings"
    ADD CONSTRAINT "admin_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."facilities"
    ADD CONSTRAINT "facilities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."leaders"
    ADD CONSTRAINT "leaders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."organization"
    ADD CONSTRAINT "organization_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."scripture"
    ADD CONSTRAINT "scripture_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."slide_images"
    ADD CONSTRAINT "slide_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."worship_guide"
    ADD CONSTRAINT "worship_guide_pkey" PRIMARY KEY ("id");



CREATE POLICY "Anyone can read leaders" ON "public"."leaders" FOR SELECT USING (true);



CREATE POLICY "Anyone can update leaders" ON "public"."leaders" FOR UPDATE USING (true);



ALTER TABLE "public"."leaders" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































GRANT ALL ON TABLE "public"."admin_settings" TO "anon";
GRANT ALL ON TABLE "public"."admin_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_settings" TO "service_role";



GRANT ALL ON SEQUENCE "public"."admin_settings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."admin_settings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."admin_settings_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."facilities" TO "anon";
GRANT ALL ON TABLE "public"."facilities" TO "authenticated";
GRANT ALL ON TABLE "public"."facilities" TO "service_role";



GRANT ALL ON SEQUENCE "public"."facilities_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."facilities_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."facilities_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."leaders" TO "anon";
GRANT ALL ON TABLE "public"."leaders" TO "authenticated";
GRANT ALL ON TABLE "public"."leaders" TO "service_role";



GRANT ALL ON SEQUENCE "public"."leaders_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."leaders_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."leaders_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."organization" TO "anon";
GRANT ALL ON TABLE "public"."organization" TO "authenticated";
GRANT ALL ON TABLE "public"."organization" TO "service_role";



GRANT ALL ON SEQUENCE "public"."organization_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."organization_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."organization_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."scripture" TO "anon";
GRANT ALL ON TABLE "public"."scripture" TO "authenticated";
GRANT ALL ON TABLE "public"."scripture" TO "service_role";



GRANT ALL ON SEQUENCE "public"."scripture_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."scripture_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."scripture_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."slide_images" TO "anon";
GRANT ALL ON TABLE "public"."slide_images" TO "authenticated";
GRANT ALL ON TABLE "public"."slide_images" TO "service_role";



GRANT ALL ON SEQUENCE "public"."slide_images_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."slide_images_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."slide_images_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."worship_guide" TO "anon";
GRANT ALL ON TABLE "public"."worship_guide" TO "authenticated";
GRANT ALL ON TABLE "public"."worship_guide" TO "service_role";



GRANT ALL ON SEQUENCE "public"."worship_guide_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."worship_guide_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."worship_guide_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























