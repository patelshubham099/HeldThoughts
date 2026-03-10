# HeldThoughts

A simple personal website for publishing thoughts and notes.

## Files

- `index.html` - homepage and layout
- `styles.css` - styling
- `script.js` - frontend logic
- `data/posts.json` - all posts
- `admin/index.html` - admin panel
- `admin/config.yml` - Decap CMS config
- `.nojekyll` - helps GitHub Pages serve files as-is

## Update the site manually

Edit `data/posts.json` to add or change writing.

## Admin panel

The site includes a Decap CMS admin panel at:

`/admin/`

That means your admin URL is:

`https://patelshubham099.github.io/HeldThoughts/admin/`

## Important GitHub Pages note

GitHub Pages can host the Decap CMS admin interface, but GitHub login still needs a separate OAuth backend.
Before login works, replace this placeholder in `admin/config.yml`:

`https://YOUR-OAUTH-DOMAIN.example.com`

with your real OAuth proxy domain.

## Publish on GitHub Pages

1. Create or use the `HeldThoughts` repository.
2. Upload all files from this folder.
3. Open repository `Settings` > `Pages`.
4. Set `Source` to `Deploy from a branch`.
5. Select branch `main` and folder `/ (root)`.
6. Save.

Your site link will be:

`https://YOUR-USERNAME.github.io/HeldThoughts/`
