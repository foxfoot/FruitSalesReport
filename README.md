# FruitSalesReport
A fruit sales report system. Use WebAPI to add/delete/modify/query fruit information. Create an order with fruit. Query the daily sales report which includs LEFT JOIN.

In order to avoid LEFT JOIN which is slow with > 1M records in both tables, use a cached table to store every day sales report. A cron job will be launched in the middle night (3 AM) to create yesterday's sales report.

Add a json file with the mysql connection information

models/connPasswd.json


Two configuration files for test only. With these configuration files, QA could test today's sales report. The cache table is updated very 15 seconds (configurable).

test/overridden_cron_job.config

test/subtractDay.config
