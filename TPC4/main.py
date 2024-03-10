import json

def periodos(compositores):
    periodos = []
    unique_periodos = set()
    contador = 0
    for compositor in compositores:
        if 'periodo' in compositor:
            if compositor['periodo'] not in unique_periodos:
                contador += 1
                unique_periodos.add(compositor['periodo'])
                periodos.append({
                    'id': str(contador),
                    'periodo': compositor['periodo']
                })
    return periodos

with open('compositores.json', 'r') as json_file:
    db = json.load(json_file)

periodos_list = periodos(db['compositores'])
db['periodos'] = periodos_list

with open("compositores.json", "w") as f:
    json.dump(db, f, indent=4)