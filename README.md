# Course website for 50002

Respective markdown materials can be found under the collection directory. 

When adding new collection:
1. Create folder with _[name], and populate with .md
2. In config.yml, add under collections:
    - Set output: true 
    - Set permalink: /[permalink]/
3. Enable tags for the collection:
    - Under `_layouts/tags.html`, `class home`, collect tags in the collection (see liquid example for notes and problemset)
    - Under `_layouts/tags.html`, `class "tag-posts"`, show tags and links (see liquid example for notes and problemset)
4. Enable search for the collection:
    - Under `assets/data/search.json`, add liquid template to loop through site.[collection]

Please make an MR should you find any issues. 