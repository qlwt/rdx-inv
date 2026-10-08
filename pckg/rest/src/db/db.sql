CREATE TABLE IF NOT EXISTS img (
    id UUID PRIMARY KEY,
    deleted_at bigint,
    created_at bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS img_variant (
    id UUID PRIMARY KEY,
    deleted_at bigint,
    created_at bigint NOT NULL,

    area int NOT NULL,
    filename text NOT NULL,
    mimetype text NOT NULL,
    img_id UUID NOT NULL, FOREIGN KEY (img_id) REFERENCES img(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS porder (
    id UUID PRIMARY KEY,
    deleted_at bigint,
    created_at bigint NOT NULL,

    title text NOT NULL,
    description text NOT NULL,

    sent_to text,
    sent_at bigint
);

CREATE TABLE IF NOT EXISTS pgroup (
    id UUID PRIMARY KEY,
    deleted_at bigint,
    created_at bigint NOT NULL,

    title text NOT NULL,
    img_id UUID, FOREIGN KEY (img_id) REFERENCES img(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS product (
    id UUID PRIMARY KEY,
    deleted_at bigint,
    created_at bigint NOT NULL,

    porder_id UUID, FOREIGN KEY (porder_id) REFERENCES porder(id) ON DELETE CASCADE,

    status_wear smallint NOT NULL,
    status_avail smallint NOT NULL,
    pgroup_id UUID, FOREIGN KEY (pgroup_id) REFERENCES pgroup(id) ON DELETE SET NULL,

    spec text NOT NULL,
    title text NOT NULL,
    price_usd real NOT NULL,
    price_uah real NOT NULL
);
