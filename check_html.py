def check_tags(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    div_opens = content.count('<div')
    div_closes = content.count('</div')
    article_opens = content.count('<article')
    article_closes = content.count('</article')
    print(f"{filename}: divs: +{div_opens} -{div_closes} | articles: +{article_opens} -{article_closes}")

check_tags('python_ext.html')
check_tags('react_ext.html')
check_tags('ts_ext.html')
