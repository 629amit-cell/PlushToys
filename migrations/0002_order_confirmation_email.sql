ALTER TABLE orders ADD COLUMN confirmation_email_claimed_at TEXT;
ALTER TABLE orders ADD COLUMN confirmation_email_sent_at TEXT;
ALTER TABLE orders ADD COLUMN confirmation_email_message_id TEXT;
ALTER TABLE orders ADD COLUMN confirmation_email_error TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_confirmation_email
  ON orders(confirmation_email_sent_at);
