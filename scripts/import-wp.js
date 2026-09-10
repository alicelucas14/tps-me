import fs from 'fs';
import path from 'path';

// Let's create a script to inspect and parse the WordPress XML files
const postXmlPath = 'C:\\Users\\sylver083\\Downloads\\tpsme.post.xml';
const pageXmlPath = 'C:\\Users\\sylver083\\Downloads\\tpsme.pages.xml';

console.log('Checking files...');
console.log('postXml exists:', fs.existsSync(postXmlPath));
console.log('pageXml exists:', fs.existsSync(pageXmlPath));
