"""change string to text

Revision ID: 815d4cf50fbc
Revises: e7d3123dabed
Create Date: 2021-05-16 10:22:41.329688

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '815d4cf50fbc'
down_revision = 'e7d3123dabed'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('travel_spot', 'transport',
               existing_type=mysql.VARCHAR(length=8000),
               type_=sa.Text(length=8000),
               existing_nullable=True)
    op.alter_column('travel_spot', 'category',
               existing_type=mysql.VARCHAR(length=1000),
               type_=sa.Text(length=1000),
               existing_nullable=False)
    op.alter_column('travel_spot', 'address',
               existing_type=mysql.VARCHAR(length=1000),
               type_=sa.Text(length=1000),
               existing_nullable=False)
    op.alter_column('travel_spot', 'describe',
               existing_type=mysql.VARCHAR(length=9000),
               type_=sa.Text(length=9000),
               existing_nullable=False)
    op.alter_column('travel_spot', 'mrt',
               existing_type=mysql.VARCHAR(length=1000),
               type_=sa.Text(length=1000),
               existing_nullable=True)
    op.alter_column('url', 'url',
               existing_type=mysql.VARCHAR(length=8000),
               type_=sa.Text(length=8000),
               existing_nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('url', 'url',
               existing_type=sa.Text(length=8000),
               type_=mysql.VARCHAR(length=8000),
               existing_nullable=False)
    op.alter_column('travel_spot', 'mrt',
               existing_type=sa.Text(length=1000),
               type_=mysql.VARCHAR(length=1000),
               existing_nullable=True)
    op.alter_column('travel_spot', 'describe',
               existing_type=sa.Text(length=9000),
               type_=mysql.VARCHAR(length=9000),
               existing_nullable=False)
    op.alter_column('travel_spot', 'address',
               existing_type=sa.Text(length=1000),
               type_=mysql.VARCHAR(length=1000),
               existing_nullable=False)
    op.alter_column('travel_spot', 'category',
               existing_type=sa.Text(length=1000),
               type_=mysql.VARCHAR(length=1000),
               existing_nullable=False)
    op.alter_column('travel_spot', 'transport',
               existing_type=sa.Text(length=8000),
               type_=mysql.VARCHAR(length=8000),
               existing_nullable=True)
    # ### end Alembic commands ###
