import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
    schema: z.object({
        title: z.string().max(100, 'The title length must be less than or equal to 100 chars'),
        description: z.string().default("read more..."),
        tags: z.string(),
        author: z.string(),
        date: z.string().transform((str) =>
	    {
		let cap = str.match(/\[(\d{4}-\d{2}-\d{2}) ...(?: (\d{2}:\d{2}))?\]/)
		return `${cap[1]} ${cap[2] ?? ""}`
	    }),
        image: z.string().optional(),
        kind: z.enum(["Memo", "Diary", "Knowledge", "Advertisment", "Translation", "HowTo"]),
	progress: z.enum(["Empty", "WIP", "Published"]),
	status: z.enum(["Normal", "Archive", "Accuracy", "Outdated"])
    })
})

export const collections = {
    'blog': blogCollection
}
