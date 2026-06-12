import html, json
SITE="https://www.mgcoat.com"; WA="https://wa.me/905528767973"; DATE="2026-06-04"
FONTS='<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Vazirmatn:wght@400;500;600;700&display=swap"/>'
LANGS=["en","ru","tr","ar","fa"]; RTL={"ar","fa"}
def _flag(c): return '<img class="flag" src="/assets/img/flags/'+c+'.svg" alt="" width="22" height="16"/>'
LBL={"en":(_flag("gb"),"English"),"ru":(_flag("ru"),"Русский"),"tr":(_flag("tr"),"Türkçe"),"ar":(_flag("sa"),"العربية"),"fa":(_flag("ir"),"فارسی")}
BACK={"en":"Back to site","ru":"На сайт","tr":"Siteye dön","ar":"العودة للموقع","fa":"بازگشت به سایت"}
HOME={"en":"Home","ru":"Главная","tr":"Ana sayfa","ar":"الرئيسية","fa":"خانه"}
BLOGW={"en":"Blog","ru":"Блог","tr":"Blog","ar":"المدونة","fa":"بلاگ"}
CTA={"en":"Get a quote on WhatsApp","ru":"Запросить цену в WhatsApp","tr":"WhatsApp'tan teklif al","ar":"احصل على عرض سعر عبر واتساب","fa":"دریافت قیمت در واتساپ"}
MORE={"en":"More articles","ru":"Другие статьи","tr":"Diğer yazılar","ar":"مقالات أخرى","fa":"مقاله‌های بیشتر"}
READ={"en":"Read article","ru":"Читать","tr":"Oku","ar":"اقرأ المقال","fa":"خواندن مقاله"}
BLOGTITLE={"en":"Blog & Insights","ru":"Блог и статьи","tr":"Blog ve İçgörüler","ar":"المدونة والمقالات","fa":"بلاگ و مقالات"}
BLOGLEAD={"en":"Practical guides on PCB waterproofing, protective coatings and protecting electronics in harsh environments.",
"ru":"Практические руководства по гидроизоляции плат, защитным покрытиям и защите электроники в тяжёлых условиях.",
"tr":"PCB su yalıtımı, koruyucu kaplamalar ve elektroniğin zorlu ortamlarda korunması üzerine pratik rehberler.",
"ar":"أدلة عملية حول عزل لوحات PCB والطلاءات الواقية وحماية الإلكترونيات في البيئات القاسية.",
"fa":"راهنماهای کاربردی دربارهٔ ضدآب‌سازی بردهای PCB، پوشش‌های محافظ و محافظت از الکترونیک در شرایط سخت."}


# ---------------- load article content from content/blog/*.json ----------------
import glob, json as _json
ARTICLES=[]
for _f in glob.glob("content/blog/*.json"):
    _a=_json.load(open(_f,encoding="utf-8"))
    ARTICLES.append(_a)
ARTICLES.sort(key=lambda a:(a.get("order",9999), a["slug"]))


def header(active_back):
    return ('<header class="site-header"><div class="container nav">'
      '<a class="brand" href="/" aria-label="MGCoat — home"><picture><source srcset="/assets/img/logo-mark.webp" type="image/webp"/><img src="/assets/img/logo-mark.png" alt="MGCoat logo" width="40" height="40"/></picture><span class="brand-text">MGCoat<small>Electronic Circuit Waterproofing</small></span></a>'
      '<div class="lang-select"><button class="lang-trigger" type="button" aria-haspopup="listbox" aria-expanded="false" aria-label="Select language"><span class="lt-flag"><img class="flag" src="/assets/img/flags/gb.svg" alt="" width="22" height="16"/></span><span class="lt-name">English</span><span class="lt-chev">▾</span></button>'
      '<div class="lang-menu" role="listbox">'+''.join(f'<button class="lang-btn" type="button" data-lang="{l}"><span>{LBL[l][0]}</span><span>{LBL[l][1]}</span></button>' for l in LANGS)+'</div></div>'
      '</div></header>')

BLOGJS='''<script src="/assets/js/flow-bg.js?v=2" defer></script><script src="/assets/js/site-content.js?v=1" defer></script><script src="/assets/js/blog.js?v=202606141"></script>'''

def article_page(a):
    posts=""
    lds=[]
    adate=a.get("date",DATE)
    for l in LANGS:
        d=a["L"][l]; dirv="rtl" if l in RTL else "ltr"
        body="".join(f"<h2>{html.escape(h)}</h2><p>{html.escape(p)}</p>" for h,p in d["secs"])
        posts+=(f'<article class="post" data-lang="{l}" lang="{l}" dir="{dirv}" hidden>'
                f'<nav class="crumbs"><a href="/">{HOME[l]}</a> / <a href="/blog/">{BLOGW[l]}</a></nav>'
                f'<h1>{html.escape(d["title"])}</h1><p class="article-meta">MGCoat · {adate}</p>'
                f'<p class="lead-p">{html.escape(d["intro"])}</p>{body}<p>{html.escape(d["close"])}</p>'
                f'<div class="article-cta"><a class="btn red" href="{WA}" rel="noopener" target="_blank">{CTA[l]}</a> <a class="btn" href="/blog/">{MORE[l]}</a></div></article>')
        lds.append({"@type":"Article","headline":d["title"],"description":d["desc"],"inLanguage":l,"datePublished":adate,"dateModified":adate,"author":{"@type":"Organization","name":"MGCoat"},"publisher":{"@type":"Organization","name":"MGCoat","logo":{"@type":"ImageObject","url":SITE+"/assets/img/logo-mark.png"}},"mainEntityOfPage":f"{SITE}/blog/{a['slug']}.html","image":SITE+"/assets/img/og-banner.jpg"})
    en=a["L"]["en"]
    return f"""<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>{html.escape(en['title'])} | MGCoat</title>
<meta name="description" content="{html.escape(en['desc'])}"/>
<meta name="keywords" content="{html.escape(a['kw'])}"/>
<meta name="robots" content="index, follow"/>
<link rel="canonical" href="{SITE}/blog/{a['slug']}.html"/>
{"".join(f'<link rel="alternate" hreflang="{l}" href="{SITE}/blog/{a["slug"]}.html?lang={l}"/>' for l in LANGS)}<link rel="alternate" hreflang="x-default" href="{SITE}/blog/{a['slug']}.html"/>
<meta property="og:type" content="article"/><meta property="og:title" content="{html.escape(en['title'])}"/>
<meta property="og:description" content="{html.escape(en['desc'])}"/><meta property="og:url" content="{SITE}/blog/{a['slug']}.html"/>
<meta property="og:image" content="{SITE}/assets/img/og-banner.jpg"/><meta name="theme-color" content="#070910"/>
<link rel="icon" href="/favicon.ico" sizes="any"/><link rel="icon" type="image/png" sizes="48x48" href="/assets/img/favicon-48.png"/>
{FONTS}
<link rel="stylesheet" href="/assets/css/style.css?v=202606141"/>
<script type="application/ld+json">{json.dumps({"@context":"https://schema.org","@graph":lds},ensure_ascii=False,separators=(',',':'))}</script>
</head>
<body>
{header(True)}
<main class="article"><div class="container prose">
{posts}
</div></main>
<footer>© M.Ghanbari — MGCoat · Liquid PCB Plastic Coating. <a href="/">mgcoat.com</a></footer>
{BLOGJS}
</body></html>"""

for a in ARTICLES:
    open(f"blog/{a['slug']}.html","w",encoding='utf-8').write(article_page(a))
    print("wrote blog/"+a['slug']+".html")

# index
posts=""
for l in LANGS:
    dirv="rtl" if l in RTL else "ltr"
    cards="".join(f'<a class="blog-card" href="/blog/{a["slug"]}.html"><h2>{html.escape(a["L"][l]["title"])}</h2><p>{html.escape(a["L"][l]["desc"])}</p><span class="blog-more">{READ[l]} →</span></a>' for a in ARTICLES)
    posts+=(f'<div class="post" data-lang="{l}" lang="{l}" dir="{dirv}" hidden>'
            f'<h1>{html.escape(BLOGTITLE[l])}</h1><p class="lead-p">{html.escape(BLOGLEAD[l])}</p>'
            f'<div class="blog-grid">{cards}</div></div>')
idx=f"""<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Blog — PCB Waterproofing & Protective Coating | MGCoat</title>
<meta name="description" content="Guides on waterproofing PCBs, conformal vs plastic coatings and protecting electronics — in English, Russian, Turkish, Arabic and Persian."/>
<meta name="robots" content="index, follow"/>
<link rel="canonical" href="{SITE}/blog/"/>
{"".join(f'<link rel="alternate" hreflang="{l}" href="{SITE}/blog/?lang={l}"/>' for l in LANGS)}<link rel="alternate" hreflang="x-default" href="{SITE}/blog/"/>
<meta property="og:type" content="website"/><meta property="og:title" content="MGCoat Blog"/>
<meta property="og:image" content="{SITE}/assets/img/og-banner.jpg"/><meta name="theme-color" content="#070910"/>
<link rel="icon" href="/favicon.ico" sizes="any"/><link rel="icon" type="image/png" sizes="48x48" href="/assets/img/favicon-48.png"/>
{FONTS}
<link rel="stylesheet" href="/assets/css/style.css?v=202606141"/>
</head>
<body>
{header(True)}
<main class="article"><div class="container prose">
{posts}
</div></main>
<footer>© M.Ghanbari — MGCoat · Liquid PCB Plastic Coating. <a href="/">mgcoat.com</a></footer>
{BLOGJS}
</body></html>"""
open("blog/index.html","w",encoding='utf-8').write(idx)
print("wrote blog/index.html")

# compact search index for the on-site assistant
search=[]
for a in ARTICLES:
    e={"u":f"/blog/{a['slug']}.html","L":{}}
    for l in LANGS:
        d=a["L"][l]
        e["L"][l]={"t":d["title"],"d":d["desc"],"s":[[h,p] for h,p in d["secs"]]}
    search.append(e)
json.dump(search, open("content/blog-search.json","w",encoding='utf-8'), ensure_ascii=False, separators=(',',':'))
print("wrote content/blog-search.json")
