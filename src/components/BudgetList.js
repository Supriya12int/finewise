import React from 'react';

export default function BudgetList({ budgets }) {
  if (!budgets.length) return <p>No budgets set yet.</p>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {budgets.map(budget => {
        const progressPercent = Math.min(budget.spent / budget.limit, 1) * 100;
        const isAlert = progressPercent >= budget.alertThresholdPercent;

        return (
          <div key={budget.id} className="shadow p-4 rounded border">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-semibold text-lg">{budget.name}</h3>
              <div className="text-sm font-medium">
                ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
              </div>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-5">
              <div
                className={`h-5 rounded-full transition-all duration-300 ${
                  isAlert ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {isAlert && (
              <p className="mt-1 text-red-600 font-semibold">
                Alert: Approaching budget limit!
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
