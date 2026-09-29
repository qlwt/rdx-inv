CREATE TABLE IF NOT EXISTS porder (
    id SERIAL PRIMARY KEY,
    deleted_at timestamp,
    created_at timestamp NOT NULL,

    title text NOT NULL,
    description text NOT NULL
);

CREATE TABLE IF NOT EXISTS product (
    id SERIAL PRIMARY KEY,
    deleted_at timestamp,
    created_at timestamp NOT NULL,

    porder_id int NOT NULL, FOREIGN KEY (porder_id) REFERENCES porder(id),

    kind smallint NOT NULL,
    status_wear smallint NOT NULL,
    status_avail smallint NOT NULL,

    title text NOT NULL,
    price_usd real NOT NULL,
    warranty_start timestamp NOT NULL,
    warranty_end timestamp NOT NULL
);
