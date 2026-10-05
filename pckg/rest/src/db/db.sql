CREATE TABLE IF NOT EXISTS porder (
    id UUID PRIMARY KEY,
    deleted_at bigint,
    created_at bigint NOT NULL,

    title text NOT NULL,
    description text NOT NULL,

    sent_to text,
    sent_at bigint
);

CREATE TABLE IF NOT EXISTS product (
    id UUID PRIMARY KEY,
    deleted_at bigint,
    created_at bigint NOT NULL,

    porder_id UUID, FOREIGN KEY (porder_id) REFERENCES porder(id),

    kind smallint NOT NULL,
    status_wear smallint NOT NULL,
    status_avail smallint NOT NULL,

    spec text NOT NULL,
    title text NOT NULL,
    price_usd real NOT NULL,
    price_uah real NOT NULL
);
