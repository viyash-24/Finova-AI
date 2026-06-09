def calculate_savings_progress(saved: float, target: float) -> float:
    if target <= 0:
        return 0.0
    return min((saved / target) * 100, 100.0)

def calculate_budget_utilization(spent: float, limit: float) -> float:
    if limit <= 0:
        return 100.0 if spent > 0 else 0.0
    return (spent / limit) * 100
