---
layout: default
title: Customization
nav_order: 6
---

# Customization

1. TOC
{:toc}

---

## Color schemes

$$ x = y^2 $$


1. Suggest the values for each timing specifications (**ts**, **th**, **tcd** , **tcd** CL2, **tpd**, **tclk** -- clock period) for the system **as a whole** using the timing specifications of each of the internal components that are given in the figure. 

	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	**th** and **ts** is for IN, **tcd** and **tpd** is with reference to the CLK. Below are the proposed values:
	$$
	\begin{aligned}
	t_S &= t_{S.R1} + t_{PD.CL1} = 4 + 3 = 7\\
	t_H &= t_{H.R1} - t_{CD.CL1} = 2 - 1 = 1\\
	t_{CD} \text{ CL2} &=t_{H.R2} - t_{CD.R1} = 7.5\\
	t_{CD} &= t_{CD.R2} = 2\\
	t_{PD} &= t_{PD.R2} = 8\\
	t_{CLK} &\geq t_{PD.R1} + t_{PD.CL2} + t_{S.R2} = 2 + 15 + 16 = 33
	\end{aligned}$$
	<div class="redbox">From this, hopefully you realise that the **tpd** and **tcd** of a sequential circuit is counted from the <strong>last</strong> downstream register(s) (there can be more than one) in the circuit because our reference "input" is no longer IN but the CLK.<br><br>Similarly, **ts** and **th** is concerning the path from **INPUT** until the <strong>first</strong> upstream register(s) (there can be more than one)  in the circuit.<br><br><strong>The dynamic discipline is always obeyed in any middle path</strong> between two DFFs or register in the circuit because of the hardware characteristics (tcds and CLK period) of the sequential circuit, so we don't need to worry about that. Therefore the definition of **ts** and **th** of the <strong>entire</strong> circuit is only concerning the first upstream register, because this is where we need need to be wary of its **ts** and **th** since it has to be fulfilled by the (unreliable) external input.</div>
	</p>
	</div><br>
  
{: .d-inline-block }

New
{: .label .label-green }

Just the Docs supports two color schemes: light (default), and dark.

To enable a color scheme, set the `color_scheme` parameter in your site's `_config.yml` file:

#### Example
{: .no_toc }

```yaml
# Color scheme supports "light" (default) and "dark"
color_scheme: dark
```

<button class="btn js-toggle-dark-mode">Preview dark color scheme</button>

<script>
const toggleDarkMode = document.querySelector('.js-toggle-dark-mode');

jtd.addEvent(toggleDarkMode, 'click', function(){
  if (jtd.getTheme() === 'dark') {
    jtd.setTheme('light');
    toggleDarkMode.textContent = 'Preview dark color scheme';
  } else {
    jtd.setTheme('dark');
    toggleDarkMode.textContent = 'Return to the light side';
  }
});
</script>

## Custom schemes

### Define a custom scheme

You can add custom schemes.
If you want to add a scheme named `foo` (can be any name) just add a file `_sass/color_schemes/foo.scss` (replace `foo` by your scheme name)
where you override theme variables to change colors, fonts, spacing, etc.

Available variables are listed in the [\_variables.scss](https://github.com/just-the-docs/just-the-docs/tree/main/_sass/support/_variables.scss) file.

For example, to change the link color from the purple default to blue, include the following inside your scheme file:

#### Example
{: .no_toc }

```scss
$link-color: $blue-000;
```

Keep in mind that changing a variable will not automatically change the value of other variables that depend on it.
For example, the default link color (`$link-color`) is set to `$purple-000`. However, redefining `$purple-000` in a custom color scheme will not automatically change `$link-color` to match it.
Instead, each variable that relies on previously-cascaded values must be manually reimplemented by copying the dependent rules from `_variables.scss` — in this case, rewriting `$link-color: $purple-000;`.

_Note:_ Editing the variables directly in `_sass/support/variables.scss` is not recommended and can cause other dependencies to fail.
Please use scheme files.

### Use a custom scheme

To use the custom color scheme, only set the `color_scheme` parameter in your site's `_config.yml` file:

```yaml
color_scheme: foo
```

### Switchable custom scheme

If you want to be able to change the scheme dynamically, for example via javascript, just add a file `assets/css/just-the-docs-foo.scss` (replace `foo` by your scheme name)
with the following content:

{% raw %}
    ---
    ---
    {% include css/just-the-docs.scss.liquid color_scheme="foo" %}
{% endraw %}

This allows you to switch the scheme via the following javascript.

```js
jtd.setTheme("foo")
```

## Override and completely custom styles

For styles that aren't defined as variables, you may want to modify specific CSS classes.
Additionally, you may want to add completely custom CSS specific to your content.
To do this, put your styles in the file `_sass/custom/custom.scss`.
This will allow for all overrides to be kept in a single file, and for any upstream changes to still be applied.

For example, if you'd like to add your own styles for printing a page, you could add the following styles.

#### Example
{: .no_toc }

```scss
// Print-only styles.
@media print {
  .side-bar,
  .page-header {
    display: none;
  }
  .main-content {
    max-width: auto;
    margin: 1em;
  }
}
```

## Override includes

The site can be modified by overriding any of the custom [Jekyll includes](https://jekyllrb.com/docs/includes/) provided by default in the theme.

To do this, create an `_includes` directory and make a copy of the specific file you wish to modify. Any content added to this file will override the theme defaults. You can learn more about this process in the Jekyll docs for [Overriding theme defaults](https://jekyllrb.com/docs/themes/#overriding-theme-defaults).

The following includes were made available to you:

### Custom Footer

`_includes/footer_custom.html`

This content appears at the bottom of every page's main content. More info for this include can be found in the [Configuration - Footer content]({{ site.baseurl }}{% link docs/configuration.md %}#footer-content).

### Custom Head

`_includes/head_custom.html`

Any HTML added to this file will be inserted before the closing `<head>` tag. This might include additional `<meta>`, `<link>`, or `<script>` tags.

#### Example
{: .no_toc }

To add a custom favicon, create `_includes/head_custom.html` and add:
```html
<link rel="shortcut icon" type="image/png" href="{{site.baseurl}}/path/to/your/favicon.png">
```

### Custom Header

`_includes/header_custom.html`

Content added to this file appears at the top of every page's main content between the site search and auxiliary links if they are enabled. If `search_enabled` were set to false and `aux_links` were removed, the content of `header_custom.html` would occupy the space at the top of every page.

### Custom Nav Footer

`_includes/nav_footer_custom.html`

Any content added to this file will appear at the bottom left of the page below the site's navigation. By default an attribution to Just the Docs is displayed which reads, `This site uses Just the Docs, a documentation theme for Jekyll.`.

### Custom Search Placeholder

`_includes/search_placeholder_custom.html`

Content added to this file will replace the default placeholder text in the search bar (and its `aria-label`), after stripping HTML and leading/trailing whitespace. By default, the content of the include is:

{% raw %}

```liquid
Search {{site.title}}
```

{% endraw %}

Override this file to render a custom placeholder. One common use-case is internationalization; for example,

{% raw %}

```liquid
Chercher notre site
```

{% endraw %}

would make the placeholder text "Chercher notre site". [Liquid code](https://jekyllrb.com/docs/liquid/) (including [Jekyll variables](https://jekyllrb.com/docs/variables/)) is also supported.
