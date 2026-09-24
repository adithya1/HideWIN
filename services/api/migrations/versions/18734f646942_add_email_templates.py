"""Add email tables and OTP lockout fields while preserving existing data."""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "18734f646942"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _inspector():
    return sa.inspect(op.get_bind())


def upgrade() -> None:
    inspector = _inspector()
    tables = set(inspector.get_table_names())
    if "users" not in tables:
        raise RuntimeError("The users table must exist before applying this migration")

    user_columns = {column["name"] for column in inspector.get_columns("users")}
    for name, column_type in (
        ("failed_otp_attempts", sa.Integer()),
        ("otp_block_level", sa.Integer()),
        ("blocked_until", sa.DateTime(timezone=True)),
        ("admin_unblock_required", sa.Boolean()),
    ):
        if name not in user_columns:
            op.add_column("users", sa.Column(name, column_type, nullable=True))

    if "email_templates" not in tables:
        op.create_table(
            "email_templates",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("template_key", sa.String(), nullable=False, unique=True),
            sa.Column("name", sa.String(), nullable=False),
            sa.Column("description", sa.String()),
            sa.Column("category", sa.String(), server_default="CUSTOM"),
            sa.Column("enabled", sa.Boolean(), server_default=sa.true()),
            sa.Column("subject", sa.String(), nullable=False),
            sa.Column("preheader", sa.String()),
            sa.Column("body_content", sa.JSON()),
            sa.Column("body_html", sa.Text(), nullable=False),
            sa.Column("plain_text_content", sa.Text()),
            sa.Column("status", sa.String(), server_default="Published"),
            sa.Column("version", sa.Integer(), server_default="1"),
            sa.Column("global_style_enabled", sa.Boolean(), server_default=sa.true()),
            sa.Column("custom_style", sa.JSON()),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
            sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
            sa.Column("created_by", sa.String()),
            sa.Column("updated_by", sa.String()),
        )
        op.create_index("ix_email_templates_id", "email_templates", ["id"])
        op.create_index("ix_email_templates_template_key", "email_templates", ["template_key"], unique=True)

    if "email_branding" not in tables:
        op.create_table(
            "email_branding",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("company_name", sa.String(), server_default="HideWin"),
            sa.Column("website", sa.String(), server_default="https://hidwin.com"),
            sa.Column("support_email", sa.String(), server_default="support@hidwin.com"),
            sa.Column("from_name", sa.String(), server_default="HideWin"),
            sa.Column("from_email", sa.String(), server_default="noreply@hidwin.com"),
            sa.Column("reply_to", sa.String()),
            sa.Column("logo_light", sa.String()),
            sa.Column("logo_dark", sa.String()),
            sa.Column("primary_color", sa.String(), server_default="#0A6FB7"),
            sa.Column("background_color", sa.String(), server_default="#F9FAFB"),
            sa.Column("card_background", sa.String(), server_default="#FFFFFF"),
            sa.Column("text_color", sa.String(), server_default="#1F2937"),
            sa.Column("muted_text_color", sa.String(), server_default="#6B7280"),
            sa.Column("border_color", sa.String(), server_default="#E5E7EB"),
            sa.Column("code_background", sa.String(), server_default="#F3F4F6"),
            sa.Column("button_text", sa.String(), server_default="#FFFFFF"),
            sa.Column("footer_text", sa.String()),
            sa.Column("footer_links", sa.JSON()),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
            sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        )
        op.create_index("ix_email_branding_id", "email_branding", ["id"])

    if "email_logs" not in tables:
        op.create_table(
            "email_logs",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("template_key", sa.String()),
            sa.Column("recipient", sa.String(), nullable=False),
            sa.Column("subject", sa.String()),
            sa.Column("status", sa.String(), server_default="QUEUED"),
            sa.Column("provider_message_id", sa.String()),
            sa.Column("attempt_count", sa.Integer(), server_default="0"),
            sa.Column("failure_reason", sa.Text()),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
            sa.Column("sent_at", sa.DateTime(timezone=True)),
            sa.Column("delivered_at", sa.DateTime(timezone=True)),
        )
        op.create_index("ix_email_logs_id", "email_logs", ["id"])
        op.create_index("ix_email_logs_template_key", "email_logs", ["template_key"])
        op.create_index("ix_email_logs_recipient", "email_logs", ["recipient"])


def downgrade() -> None:
    # Intentionally keep newly created tables and lockout data to avoid data loss.
    pass
