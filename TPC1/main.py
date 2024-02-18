import os
import xml.etree.ElementTree as ET

html_template = """
<!DOCTYPE html>
<html lang="pt-PT">
<head>
    <title>{title}</title>
    <meta charset="utf-8">
</head>
<body>
"""

directory = "./texto"
html_directory = "html"

if not os.path.exists(html_directory):
    os.mkdir(html_directory)

all_files = os.listdir(directory)
lista_ruas = []

for xml_file in all_files:

    rua_name = xml_file.split(".")[0]
    lista_ruas.append(rua_name)
    ruas_template = html_template.format(title=rua_name)

    with open(os.path.join(directory, xml_file), "r", encoding="utf-8") as file:
        tree = ET.parse(file)
        root = tree.getroot()

        rua_meta = root.find('meta')
        rua_corpo = root.find('corpo')

        rua_title = rua_meta.find('nome').text
        ruas_template += f"<h1>{rua_title}</h1>"

        for figura in rua_corpo.findall('figura'):
            img_path = figura.find('imagem').attrib['path']
            legend = figura.find('legenda').text
            ruas_template += f"""
                                <figure>
                                    <img src="{img_path}" alt="{legend}" style="width: 500px;">
                                    <figcaption>{legend}</figcaption>
                                </figure>
                            """
        
        html_directory = "html"
        atual_directory = "./atual"
        all_pics = os.listdir(atual_directory)

        for pic in all_pics:
            pic_name = pic.split("-")[1].lower()
            rua_meta_name = rua_meta.find('nome').text.replace(" ", "").lower()
            
            if rua_meta_name == pic_name:
                relative_pic_path = os.path.join("../atual", pic)
                ruas_template += f"""
                                    <figure>
                                        <img src="{relative_pic_path}" alt="Imagem atual da Rua" style="width: 500px;">
                                        <figcaption>Imagem atual da Rua</figcaption>
                                    </figure>
                                """

        for para in rua_corpo.findall('para'):
            ruas_template += f"<p>{ET.tostring(para, encoding='unicode', method='xml')}</p>"

        ruas_template += "<h2>Lista de Casas</h2><ul>"
        lista_casas = rua_corpo.find('lista-casas')
        if lista_casas is not None:
            for casa in lista_casas.findall('casa'):
                number = casa.find('número').text if casa.find('número') is not None else 'Desconhecido'
                ruas_template += f"<li>Casa Número: {number}</li>"
        ruas_template += "</ul>"

        ruas_template += "<h6><a href='../listaruas.html'>Voltar</a></h6></body></html>"

        with open(f"{html_directory}/{rua_name}.html", "w", encoding="utf-8") as html_file:
            html_file.write(ruas_template)

index_html = html_template.format(title="Lista de Ruas") + "<ul>"
for rua in sorted(lista_ruas):
    index_html += f"<li><a href='{html_directory}/{rua}.html'>{rua}</a></li>"
index_html += "</ul></body></html>"

with open("listaruas.html", "w", encoding="utf-8") as index_file:
    index_file.write(index_html)
