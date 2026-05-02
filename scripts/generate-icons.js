const fs = require('fs');

const icons = {
  MarriottIcon: 'public/logos/marriott.svg',
  EmiratesIcon: 'public/logos/emirates.svg',
  HyattIcon: 'public/logos/hyatt.svg',
  QatarIcon: 'public/logos/qatar.svg',
  VisaIcon: 'public/logos/visa.svg',
  AmexIcon: 'public/logos/amex.svg',
};

let content = 'import React from "react";\n\n';

for (const [name, path] of Object.entries(icons)) {
  if (fs.existsSync(path)) {
    let svg = fs.readFileSync(path, 'utf8');
    if (svg.startsWith('<svg')) {
      svg = svg.replace(/xmlns="[^"]+"/, '');
      svg = svg.replace(/viewBox="([^"]+)"/, 'viewBox="$1" {...props}');
      svg = svg.replace(/role="img"/, '');
      svg = svg.replace(/<title>[^<]+<\/title>/, '');
      svg = svg.replace(/fill="[^"]+"/g, 'fill="currentColor"');
      if (!svg.includes('fill=')) {
        svg = svg.replace(/<path/, '<path fill="currentColor"');
      }
      content += `export const ${name} = (props: React.SVGProps<SVGSVGElement>) => (\n  ${svg.trim()}\n);\n\n`;
    }
  }
}

// Add Hyatt, Taj, Four Seasons as text SVGs if they don't exist
content += `export const TajIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 30" {...props}>
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="currentColor" fontSize="20" fontWeight="bold" letterSpacing="2">TAJ</text>
  </svg>
);\n\n`;

content += `export const FourSeasonsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 150 30" {...props}>
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="bold" letterSpacing="1">FOUR SEASONS</text>
  </svg>
);\n\n`;

if (!fs.existsSync('public/logos/hyatt.svg') || fs.readFileSync('public/logos/hyatt.svg', 'utf8').length < 50) {
  content += `export const HyattIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 30" {...props}>
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="currentColor" fontSize="20" fontWeight="bold" letterSpacing="2">HYATT</text>
  </svg>
);\n\n`;
}

fs.writeFileSync('components/brand-icons.tsx', content);
console.log('Generated brand-icons.tsx');
