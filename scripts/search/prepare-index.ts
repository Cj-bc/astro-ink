import path from 'path'
import { promises as fs } from 'fs'
import { globby } from 'globby'
import grayMatter from 'gray-matter'
import { unified } from 'unified'
import orgParse from 'uniorg-parse'
import { toString } from 'orgast-util-to-string'

type IndexProps = {
    slug: string;
    title: string;
    description: string;
    tags: string[];
    body: string;
}

async function processOrg(filePath: string): Promise<IndexProps> {
    const parser = unified().use(orgParse);
    const content = await fs.readFile(filePath, 'utf8');
    const parsed = parser.parse(content);
    const keywords = parsed.children.filter(c => c.type === 'keyword');
    const bodies = parsed.children.filter(c => c.type != 'keyword');

    return {
        slug: path.basename(filePath, path.extname(filePath)),
        title: keywords.find(k => k.key.toUpperCase() === 'TITLE')?.value,
        description: keywords.find(k => k.key.toUpperCase() === 'DESCRIPTION')?.value ?? null,
        tags: keywords.find(k => k.key.toUpperCase() === 'TAGS')?.value.split(':').filter(s => s != ''),
        body: toString(bodies),
    }
}

(async function () {
    // prepare the dirs
    const srcDir = path.join(process.cwd(), 'src')
    const publicDir = path.join(process.cwd(), 'public')
    const contentBlogDir = path.join(srcDir, 'content', 'blog')
    const contentFilePattern = path.join(contentBlogDir, '*.md')
    const indexFile = path.join(publicDir, 'search-index.json')
    const getSlugFromPathname = (pathname) => path.basename(pathname, path.extname(pathname))

    const contentFilePaths = await globby([ contentFilePattern ])

    if(contentFilePaths.length) {
        const index: IndexProps[] = await Promise.all(contentFilePaths.map(async (filePath) => await processOrg(filePath)));
        await fs.writeFile(indexFile, JSON.stringify(index))
        console.log(`Indexed ${index.length} documents from ${contentBlogDir} to ${indexFile}`)
    }

})();
