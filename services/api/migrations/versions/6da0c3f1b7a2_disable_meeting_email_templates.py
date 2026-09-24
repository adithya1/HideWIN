"""Disable meeting-related email templates without deleting their content.

Revision ID: 6da0c3f1b7a2
Revises: 18734f646942
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import MetaData, Table, func, or_, select, update

revision = "6da0c3f1b7a2"
down_revision = "18734f646942"
branch_labels = None
depends_on = None

ARCHIVE_TABLE = "hidewin_disabled_meeting_email_templates"


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    if "email_templates" not in inspector.get_table_names():
        return

    templates = Table("email_templates", MetaData(), autoload_with=bind)
    if "enabled" not in templates.c or "template_key" not in templates.c or "category" not in templates.c:
        return

    if ARCHIVE_TABLE not in inspector.get_table_names():
        op.create_table(
            ARCHIVE_TABLE,
            sa.Column("template_id", sa.Integer(), primary_key=True),
            sa.Column("was_enabled", sa.Boolean(), nullable=True),
        )
    archived = Table(ARCHIVE_TABLE, MetaData(), autoload_with=bind)
    meeting_template = or_(
        func.lower(func.coalesce(templates.c.template_key, "")).like("meeting%"),
        func.lower(func.coalesce(templates.c.category, "")).in_(("meeting", "meetings")),
    )
    bind.execute(
        archived.insert().from_select(
            ["template_id", "was_enabled"],
            select(templates.c.id, templates.c.enabled).where(
                meeting_template,
                ~select(archived.c.template_id).where(archived.c.template_id == templates.c.id).exists(),
            ),
        )
    )
    bind.execute(update(templates).where(meeting_template).values(enabled=False))


def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    if ARCHIVE_TABLE not in inspector.get_table_names() or "email_templates" not in inspector.get_table_names():
        return

    metadata = MetaData()
    archived = Table(ARCHIVE_TABLE, metadata, autoload_with=bind)
    templates = Table("email_templates", metadata, autoload_with=bind)
    for row in bind.execute(select(archived.c.template_id, archived.c.was_enabled)).mappings():
        bind.execute(
            update(templates)
            .where(templates.c.id == row["template_id"])
            .values(enabled=row["was_enabled"])
        )
    op.drop_table(ARCHIVE_TABLE)
