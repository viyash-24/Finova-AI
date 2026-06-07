from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Dict, Any

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.expense import Expense
from app.models.goal import Goal
from app.models.bill import Bill

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("")
async def chat_bot(
    payload: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    msg = payload.message.lower()
    
    if any(k in msg for k in ["expense", "spent", "spending", "transaction"]):
        # Fetch expenses
        result = await db.execute(select(Expense).filter(Expense.user_id == current_user.id))
        expenses = result.scalars().all()
        
        total = sum(e.amount for e in expenses)
        
        cat_map = {}
        for e in expenses:
            cat_map[e.category] = cat_map.get(e.category, 0.0) + e.amount
            
        breakdown_list = [f"**{k}**: Rs. {v:.2f}" for k, v in cat_map.items()]
        breakdown_str = ", ".join(breakdown_list) if breakdown_list else "No transactions recorded yet"
        
        reply = (
            f"Based on your database transactions, your total spending is **Rs. {total:.2f}**. "
            f"Category breakdown: {breakdown_str}. Would you like me to analyze any specific category?"
        )
        return {"reply": reply}
        
    elif any(k in msg for k in ["save", "saving", "goal"]):
        # Fetch goals
        result = await db.execute(select(Goal).filter(Goal.user_id == current_user.id))
        goals = result.scalars().all()
        
        total_saved = sum(g.current_amount for g in goals)
        
        goals_list = [f"**{g.title}** (Rs. {g.current_amount:.0f}/Rs. {g.target_amount:.0f})" for g in goals]
        goals_str = ", ".join(goals_list) if goals_list else "No goals created yet"
        
        reply = (
            f"Your current savings goal balance is **Rs. {total_saved:.2f}**. "
            f"You are contributing towards: {goals_str}. Keep going!"
        )
        return {"reply": reply}
        
    elif any(k in msg for k in ["bill", "payment", "subscription"]):
        # Fetch upcoming bills
        result = await db.execute(select(Bill).filter(Bill.user_id == current_user.id, Bill.status == "upcoming"))
        bills = result.scalars().all()
        
        total_bills = sum(b.amount for b in bills)
        
        bills_list = [
            f"**{b.name}** (Rs. {b.amount:.2f} due {b.due_date.strftime('%b %d') if b.due_date else ''})"
            for b in bills
        ]
        bills_str = ", ".join(bills_list) if bills_list else "No pending bills"
        
        reply = (
            f"You have **{len(bills)}** upcoming bills/subscriptions totaling **Rs. {total_bills:.2f}**: "
            f"{bills_str}. Would you like to schedule any payments?"
        )
        return {"reply": reply}
        
    else:
        reply = (
            "Hi! I am your Finova AI Financial Agent. I can analyze your database expenses, "
            "summarize your savings goals, or list your upcoming bills. What would you like to explore?"
        )
        return {"reply": reply}
