-- User domain: catalogs, entries, and training signals.

CREATE TABLE app_user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES app_user (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    storage_bytes BIGINT NOT NULL CHECK (storage_bytes > 0),
    generated_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_catalog_user_id ON catalog (user_id);

CREATE TABLE catalog_console (
    catalog_id UUID NOT NULL REFERENCES catalog (id) ON DELETE CASCADE,
    console_id UUID NOT NULL REFERENCES console (id) ON DELETE CASCADE,
    PRIMARY KEY (catalog_id, console_id)
);

CREATE TABLE catalog_genre (
    catalog_id UUID NOT NULL REFERENCES catalog (id) ON DELETE CASCADE,
    genre_id UUID NOT NULL REFERENCES genre (id) ON DELETE CASCADE,
    weight DOUBLE PRECISION NOT NULL DEFAULT 1.0 CHECK (weight >= 0.0 AND weight <= 1.0),
    PRIMARY KEY (catalog_id, genre_id)
);

CREATE TABLE catalog_entry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    catalog_id UUID NOT NULL REFERENCES catalog (id) ON DELETE CASCADE,
    rom_release_id UUID NOT NULL REFERENCES rom_release (id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'removed')),
    pin_type TEXT CHECK (pin_type IS NULL OR pin_type IN ('pinned', 'excluded')),
    added_by TEXT NOT NULL CHECK (added_by IN ('generator', 'user')),
    score DOUBLE PRECISION,
    position INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_catalog_entry_catalog_id ON catalog_entry (catalog_id);
CREATE INDEX idx_catalog_entry_rom_release_id ON catalog_entry (rom_release_id);

CREATE TABLE user_signal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES app_user (id) ON DELETE CASCADE,
    catalog_id UUID REFERENCES catalog (id) ON DELETE SET NULL,
    rom_release_id UUID NOT NULL REFERENCES rom_release (id) ON DELETE RESTRICT,
    signal_type TEXT NOT NULL CHECK (
        signal_type IN ('pin', 'exclude', 'swap_out', 'swap_in', 'manual_add', 'remove')
    ),
    context JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_signal_user_id ON user_signal (user_id);
CREATE INDEX idx_user_signal_catalog_id ON user_signal (catalog_id);
