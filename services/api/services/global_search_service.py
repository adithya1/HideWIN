
from sqlalchemy.orm import Session
from sqlalchemy import select, or_, String, cast
import re
from typing import List, Dict, Any

from services.api.db_models.user import User
from services.api.db_models.billing import Order, Transaction, Subscription

class GlobalSearchService:
    @staticmethod
    async def search(db, query: str) -> Dict[str, List[Dict[str, Any]]]:
        results = {
            'users': [],
            'orders': [],
            'transactions': [],
            'subscriptions': [],
            'documents': []
        }
        query = query.strip()
        if not query:
            return results

        if re.match(r'^[a-fA-F0-9]{24}$', query):
            tx_res = await db.execute(select(Transaction).filter(Transaction.id == query))
            tx = tx_res.scalars().first()
            if tx:
                results['transactions'].append({
                    'id': tx.id,
                    'title': f'Transaction {tx.id}',
                    'subtitle': f'{tx.amount} {tx.currency}',
                    'type': 'transaction'
                })

        elif query.upper().startswith('ORD-'):
            ord_res = await db.execute(select(Order).filter(Order.order_number == query.upper()))
            order = ord_res.scalars().first()
            if order:
                results['orders'].append({
                    'id': str(order.id),
                    'title': order.order_number,
                    'subtitle': f'{order.amount} {order.currency}',
                    'type': 'order'
                })

        elif query.upper().startswith('SUB-'):
            sub_res = await db.execute(select(Subscription).filter(Subscription.subscription_number == query.upper()))
            sub = sub_res.scalars().first()
            if sub:
                results['subscriptions'].append({
                    'id': str(sub.id),
                    'title': sub.subscription_number,
                    'subtitle': f'{sub.price} {sub.currency}/mo',
                    'type': 'subscription'
                })

        else:
            user_res = await db.execute(
                select(User).filter(
                    or_(
                        User.email.ilike(f'%{query}%'),
                        User.full_name.ilike(f'%{query}%')
                    )
                ).limit(5)
            )
            for u in user_res.scalars().all():
                results['users'].append({
                    'id': str(u.id),
                    'title': u.full_name or 'Unknown User',
                    'subtitle': u.email,
                    'type': 'user'
                })

            partial_tx_res = await db.execute(
                select(Transaction).filter(Transaction.id.ilike(f'%{query}%')).limit(5)
            )
            for tx in partial_tx_res.scalars().all():
                results['transactions'].append({
                    'id': tx.id,
                    'title': f'Transaction {tx.id}',
                    'subtitle': f'{tx.amount} {tx.currency}',
                    'type': 'transaction'
                })
                
        return results
