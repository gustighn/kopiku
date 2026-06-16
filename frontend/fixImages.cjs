const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.jsx');
let modifiedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  if (content.includes('/uploads/products/')) {
    if (!content.includes('getImageUrl')) {
      const importRegex = /import.*?from.*?;?\n/g;
      let lastMatch;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        lastMatch = match;
      }
      
      const importPos = lastMatch ? lastMatch.index + lastMatch[0].length : 0;
      const depth = file.split('/').length - 2;
      const prefix = depth === 0 ? './' : '../'.repeat(depth);
      const importStatement = `import { getImageUrl } from '${prefix}services/api';\n`;
      
      content = content.slice(0, importPos) + importStatement + content.slice(importPos);
    }

    content = content.replace(/src=\{\`\/uploads\/products\/\$\{([^}]+)\}\`\}/g, 'src={getImageUrl($1)}');
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    modifiedFiles++;
    console.log('Modified ' + file);
  }
});
console.log('Done, modified ' + modifiedFiles + ' files.');
