-- Flyway Migration
-- Module  : Water Services (WS)
-- Purpose : Add connection and meter-related fields in eg_ws_service
-- Author  : UPYOG
-- Date    : 23-02-2026

ALTER TABLE public.eg_ws_service
    ADD COLUMN IF NOT EXISTS connection_id varchar(64),
    ADD COLUMN IF NOT EXISTS connectioncategory varchar(64),
    ADD COLUMN IF NOT EXISTS connectiontype varchar(64),
    ADD COLUMN IF NOT EXISTS watersource varchar(64),
    ADD COLUMN IF NOT EXISTS meterid varchar(64),
    ADD COLUMN IF NOT EXISTS meterinstallationdate bigint,
    ADD COLUMN IF NOT EXISTS pipesize numeric,
    ADD COLUMN IF NOT EXISTS nooftaps integer,
    ADD COLUMN IF NOT EXISTS connectionexecutiondate bigint,
    ADD COLUMN IF NOT EXISTS proposedpipesize numeric,
    ADD COLUMN IF NOT EXISTS proposedtaps integer,
    ADD COLUMN IF NOT EXISTS initialmeterreading numeric,
    ADD COLUMN IF NOT EXISTS detailsprovidedby varchar(256),
    ADD COLUMN IF NOT EXISTS estimationfilestoreid varchar(64),
    ADD COLUMN IF NOT EXISTS sanctionfilestoreid varchar(64);