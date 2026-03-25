const fs = require('fs-extra');
const path = require('path');
const cheerio = require('cheerio');

// Attributes to rename
const ATTR_MAP = {
    class: 'className',
    for: 'htmlFor',
    tabindex: 'tabIndex',
    readonly: 'readOnly',
    maxlength: 'maxLength',
    cellspacing: 'cellSpacing',
    cellpadding: 'cellPadding',
    colspan: 'colSpan',
    rowspan: 'rowSpan',
    enctype: 'encType'
};

const DONT_SELF_CLOSE = new Set(['div', 'span', 'p', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'li', 'ol', 'button', 'script', 'style', 'textarea', 'nav', 'section', 'main', 'footer', 'form', 'label', 'i', 'strong', 'em', 'b', 'table', 'tr', 'td', 'th', 'thead', 'tbody']);

function convertHtmlToJsx(html) {
    if (!html) return '';
    
    // Simple regex replacements for basic HTML to JSX
    let jsx = html;
    
    // Replace attributes
    for (const [htmlAttr, jsxAttr] of Object.entries(ATTR_MAP)) {
        const regex = new RegExp(`\\b${htmlAttr}=`, 'gi');
        jsx = jsx.replace(regex, `${jsxAttr}=`);
    }

    // Fix style attributes (e.g. style="display: none;" -> style={{display: 'none'}})
    jsx = jsx.replace(/style="([^"]+)"/g, (match, styleString) => {
        const styleObj = {};
        styleString.split(';').forEach(rule => {
            const parts = rule.split(':');
            if (parts.length === 2) {
                const key = parts[0].trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
                let value = parts[1].trim();
                if (!isNaN(value)) value = Number(value);
                else value = `'${value.replace(/'/g, "\\'")}'`;
                styleObj[key] = value;
            }
        });
        const styleStr = Object.entries(styleObj).map(([k, v]) => `${k}: ${v}`).join(', ');
        return `style={{ ${styleStr} }}`;
    });

    // Handle void elements (self-closing)
    const voidElements = ['input', 'img', 'br', 'hr', 'link', 'meta', 'source'];
    voidElements.forEach(tag => {
        const regex = new RegExp(`<${tag}([^>]*?)(?<!/)>`, 'gi');
        jsx = jsx.replace(regex, `<${tag}$1 />`);
    });

    // Handle HTML comments
    jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

    // Fix EJS blocks temporarily as comments or strings
    jsx = jsx.replace(/<%/g, '{/*').replace(/%>/g, '*/}');
    jsx = jsx.replace(/<%[=-]([\s\S]*?)%>/g, (m, code) => `{ \`EJS_PLACEHOLDER: ${code.trim().replace(/`/g, "\\`")} \` }`);

    return jsx;
}

async function convertViews() {
    const viewsDir = path.join(__dirname, '../backend/views');
    const pagesDir = path.join(__dirname, 'src/pages');
    const componentsDir = path.join(__dirname, 'src/components');

    await fs.ensureDir(pagesDir);
    await fs.ensureDir(componentsDir);

    const files = await fs.readdir(viewsDir);
    const imports = [];
    const routes = [];

    for (const file of files) {
        if (!file.endsWith('.ejs')) continue;

        const name = file.replace('.ejs', '');
        const Name = name.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
        
        const content = await fs.readFile(path.join(viewsDir, file), 'utf8');
        
        let componentCode = '';
        
        if (name === 'layout') continue; // Handled manually
        
        const $ = cheerio.load(content, { decodeEntities: false });
        
        // Remove scripts and styles for cleaner react code, they should be global or in App.css
        const scripts = [];
        $('script').each((i, el) => {
            scripts.push($(el).html());
            $(el).remove();
        });
        
        const styles = [];
        $('style').each((i, el) => {
            styles.push($(el).html());
            $(el).remove();
        });

        // Get inner body content.
        let htmlContent = '';
        if (name === 'home') {
             htmlContent = convertHtmlToJsx($('body').html());
        } else {
             // they are fragments
             htmlContent = convertHtmlToJsx($('body').html() || $.html());
        }

        // Write styles to a css file if needed, or just combine them
        if (styles.length > 0) {
            await fs.appendFile(path.join(__dirname, 'src/index.css'), styles.join('\n'));
        }

        componentCode = `import React, { useEffect } from 'react';\nimport { useNavigate, Link } from 'react-router-dom';\n\nconst ${Name} = () => {\n  const navigate = useNavigate();\n\n  useEffect(() => {\n    // Extracted scripts\n    /* \n${scripts.join('\n')}\n    */\n  }, []);\n\n  return (\n    <>\n      ${htmlContent}\n    </>\n  );\n};\n\nexport default ${Name};`;

        await fs.writeFile(path.join(pagesDir, `${Name}.jsx`), componentCode);
        
        let routePath = `/${name.toLowerCase()}`;
        if (name === 'home') routePath = '/';
        
        imports.push(`import ${Name} from './pages/${Name}';`);
        routes.push(`        <Route path="${routePath}" element={<${Name} />} />`);
        console.log(`Converted ${name} to ${Name}.jsx`);
    }

    // Generate App.jsx
    const appJsx = `import React from 'react';\nimport { BrowserRouter as Router, Routes, Route } from 'react-router-dom';\n${imports.join('\n')}\n\nfunction App() {\n  return (\n    <Router>\n      <Routes>\n${routes.join('\n')}\n      </Routes>\n    </Router>\n  );\n}\n\nexport default App;`;
    await fs.writeFile(path.join(__dirname, 'src/App.jsx'), appJsx);
    console.log('Generated App.jsx');
}

convertViews().catch(console.error);
