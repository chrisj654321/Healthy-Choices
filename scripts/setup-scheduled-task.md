# Set Up Daily Ingestion Scheduled Task

To create the 9:30am daily scheduled task, paste this into a **new Cowork chat** (not during a scheduled task run):

---

**Tell Claude:**

> Create a daily scheduled task called "healthy-choices-daily-ingest" that runs at 9:30am every day. It should run these five ingestion queries in order, stopping on the first error and logging results to C:\Users\chris\HealthyChoices\scripts\ingestion_log.txt:
>
> 1. `node scripts/ingest-products.js --batch=25 --query="protein bar"`
> 2. `node scripts/ingest-products.js --batch=25 --query="organic snack"`
> 3. `node scripts/ingest-products.js --batch=25 --query="cereal"`
> 4. `node scripts/ingest-products.js --batch=25 --query="energy drink"`
> 5. `node scripts/ingest-products.js --batch=25 --source=usda --query="granola"`
>
> Script location: C:\Users\chris\HealthyChoices\scripts\ingest-products.js
> Working directory: C:\Users\chris\HealthyChoices

---

## Fix Network Access First (Required)

Before the scheduled task will work, fix these two blockers:

### 1. USDA API — Add to Cowork Allowlist
- Go to **Settings → Capabilities → Network**
- Add `api.nal.usda.gov` to the egress allowlist
- Without this, USDA calls fail with "EAI_AGAIN" DNS errors

### 2. OpenFoodFacts — Rate Limiting
- OpenFoodFacts returns HTTP 503 for anonymous bot requests
- **Option A:** Register a free account at https://world.openfoodfacts.org and set `OFF_USER` / `OFF_PASSWORD` env vars before running
- **Option B:** Run the script directly from your Windows terminal (no rate limit for local runs):
  ```
  cd C:\Users\chris\HealthyChoices
  node scripts/ingest-products.js --batch=25 --query="protein bar"
  ```

## Run Manually Right Now

Open a terminal in `C:\Users\chris\HealthyChoices` and run:

```bat
node scripts/ingest-products.js --batch=25 --query="protein bar"
node scripts/ingest-products.js --batch=25 --query="organic snack"
node scripts/ingest-products.js --batch=25 --query="cereal"
node scripts/ingest-products.js --batch=25 --query="energy drink"
node scripts/ingest-products.js --batch=25 --source=usda --query="granola"
```

Output goes to: `src\data\products_generated.json`
Log goes to: `scripts\ingestion_log.txt`
