import path from 'path'
import { promises as fs } from 'fs'
import { globby } from 'globby'
import grayMatter from 'gray-matter'
import { unified } from 'unified'
import orgParse from 'uniorg-parse'

type IndexProps = {
    slug: string;
    title: string;
    description: string;
    tags: string[];
    body: string;
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

    let parser = unified().use(orgParse)

    if(contentFilePaths.length) {
        const files = contentFilePaths.map(async(filePath) => await fs.readFile(filePath, 'utf8'))
        const index: IndexProps[] = []
        let i = 0
        for await (let file of files){
	    const parsed = parser.parse(file);
	    const keywords = parsed.children.filter(c => c.type === 'keyword');
	    const bodies = parsed.children.filter(c => c.type != 'keyword');

            const { data: { title, description, tags }, content } = grayMatter(file)
            index.push({
                slug: getSlugFromPathname(contentFilePaths[i]),
                category: 'blog',
                title: keywords.find(k => k.key.toUpperCase() === 'TITLE')?.value,
                description: keywords.find(k => k.key.toUpperCase() === 'DESCRIPTION')?.value ?? null,
                tags: keywords.find(k => k.key.toUpperCase() === 'TAGS')?.value,
                body: bodies,
            })
            i++
        }
        await fs.writeFile(indexFile, JSON.stringify(index))
        console.log(`Indexed ${index.length} documents from ${contentBlogDir} to ${indexFile}`)
    }

})();
