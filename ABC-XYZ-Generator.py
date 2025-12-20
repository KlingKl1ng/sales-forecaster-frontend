import pandas as pd
import numpy as np

# Configuration
NUM_ITEMS = 50
FILENAME = "Operartis_ABC_XYZ_Template.xlsx"

# Generate Synthetic Data
np.random.seed(42)

ids = [f"SKU-{i:03d}" for i in range(1, NUM_ITEMS + 1)]
descriptions = [f"Industrial Component {i}" for i in range(1, NUM_ITEMS + 1)]

# 1. Generate Costs (Pareto Distribution for ABC)
# We want a few expensive items (A) and many cheap items (C)
costs = np.random.pareto(a=2.0, size=NUM_ITEMS) * 100
costs = np.round(costs, 2)

# 2. Generate Demand Patterns (for XYZ)
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
demand_data = []

for _ in range(NUM_ITEMS):
    pattern_type = np.random.choice(['stable', 'seasonal', 'volatile'], p=[0.5, 0.3, 0.2])
    base_demand = np.random.randint(50, 500)
    
    if pattern_type == 'stable':
        # Low variance (X-Class)
        noise = np.random.normal(0, base_demand * 0.1, 12)
        yearly_demand = base_demand + noise
    elif pattern_type == 'seasonal':
        # Medium variance (Y-Class)
        seasonality = np.array([0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.3, 1.2, 1.0, 0.9, 0.8, 0.8])
        noise = np.random.normal(0, base_demand * 0.2, 12)
        yearly_demand = (base_demand * seasonality) + noise
    else:
        # High variance (Z-Class)
        # Random spikes
        yearly_demand = np.random.exponential(scale=base_demand, size=12)
    
    # Ensure no negative demand
    yearly_demand = np.maximum(yearly_demand, 0).astype(int)
    demand_data.append(yearly_demand)

# Create DataFrame
df = pd.DataFrame({
    'Item_ID': ids,
    'Description': descriptions,
    'Unit_Cost_USD': costs
})

# Add monthly columns
demand_df = pd.DataFrame(demand_data, columns=months)
final_df = pd.concat([df, demand_df], axis=1)

# Save to Excel
try:
    final_df.to_excel(FILENAME, index=False)
    print(f"✅ Successfully created '{FILENAME}' with {NUM_ITEMS} items.")
    print("You can now upload this file to the ABC-XYZ Analysis module.")
except Exception as e:
    print(f"Error creating file: {e}")