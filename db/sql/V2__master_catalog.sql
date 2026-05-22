-- Master catalog (read-only reference data). Populated by ETL pipeline.

CREATE TABLE game (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    release_year SMALLINT,
    franchise TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_game_title ON game (title);

CREATE TABLE console (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    manufacturer TEXT,
    release_year SMALLINT,
    generation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE console_tag (
    console_id UUID NOT NULL REFERENCES console (id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    PRIMARY KEY (console_id, tag)
);

CREATE INDEX idx_console_tag_tag ON console_tag (tag);

CREATE TABLE genre (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE game_genre (
    game_id UUID NOT NULL REFERENCES game (id) ON DELETE CASCADE,
    genre_id UUID NOT NULL REFERENCES genre (id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, genre_id)
);

CREATE TABLE rom_release (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES game (id) ON DELETE CASCADE,
    console_id UUID NOT NULL REFERENCES console (id) ON DELETE CASCADE,
    region TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL CHECK (file_size_bytes > 0),
    rom_hash TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'no-intro',
    verified BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (rom_hash)
);

CREATE INDEX idx_rom_release_game_id ON rom_release (game_id);
CREATE INDEX idx_rom_release_console_id ON rom_release (console_id);
