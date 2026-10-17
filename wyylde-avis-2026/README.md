# Wyylde Avis — Le Guide W (17/10/2026)

Site de contenu indépendant, sans WordPress, cookies, traqueurs, JS ni abonnement. 20 URLs HTML pré-rendues : accueil + 19 pages, chacune dotée de titre, description, canonical, OG, JSON-LD Article/Breadcrumb et questions/réponses visibles. Les tarifs proviennent du centre d’aide officiel Wyylde (15/04/2026). Aucune promesse de position Google.

## Construire avec votre vrai domaine

```bash
SITE_URL=https://votre-domaine.fr python3 build_site.py
```

Publier le contenu de `dist/` à la racine du domaine (Netlify Drop, Cloudflare Pages, Vercel, etc.). Remplacer `SITE_URL` par la vraie URL AVANT publication : le sitemap et les canoniques doivent correspondre au domaine définitif. Aucune dépense ni clé API requise.

## Vérifier localement

```bash
python3 -m http.server 8000 -d dist
python3 audit_site.py
```

Les prix ou modalités Wyylde peuvent changer ; mettre à jour les articles concernés avant d'affirmer une nouveauté. **Attention : les fiches officielles Wyylde donnent des informations contradictoires sur le délai d’effacement de certaines données.**

Aucun programme d’affiliation n’a été configuré : ne pas insérer de code fictif.