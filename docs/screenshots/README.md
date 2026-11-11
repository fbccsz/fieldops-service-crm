# FieldOps interface captures

These JPEG files are real, unedited browser captures of the working [FieldOps demo](https://fieldops-service-crm.vercel.app/), taken on **2026-11-11**. They use only the fictional Northstar Services records included in `src/data.js`; no customer or account data was entered.

| File | Interface | How to reproduce |
| --- | --- | --- |
| [01-overview.jpg](01-overview.jpg) | Operations overview | Open the demo and select **Overview**. |
| [02-pipeline.jpg](02-pipeline.jpg) | Sales pipeline | Select **Pipeline** from the workspace navigation. |
| [03-estimate.jpg](03-estimate.jpg) | Estimate details | Select **Estimates**, then open **EST-1042 — Kitchen renovation**. |
| [04-jobs.jpg](04-jobs.jpg) | Jobs and scheduling | Select **Jobs & scheduling**, then scroll to the scheduled and in-progress jobs. |

The app navigates between these views without changing its root URL. Captures retain the surrounding interface; the estimate drawer's backdrop blur is part of the app itself.

Demo dates are generated relative to the browser's current date, so future visits may show different dates. Changes persist only in that browser's local storage. The screenshots do not represent live business results or production integrations.
