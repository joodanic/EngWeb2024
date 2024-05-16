import csv
import json

csv_file_name = 'contratos2024.csv'
json_file_name = 'contratos2024.json'

data = []
with open(csv_file_name, mode='r', encoding='utf-8') as csv_file:
    csv_reader = csv.DictReader(csv_file, delimiter=';')
    for row in csv_reader:
        data.append(row)

with open(json_file_name, mode='w', encoding='utf-8') as json_file:
    json.dump(data, json_file, indent=4, ensure_ascii=False)
