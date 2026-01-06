import { z, defineCollection } from "astro:content";


const dateSchema = z.string().transform((str, ctx) => {
    let cap = str.match(/\[(\d{4}-\d{2}-\d{2}) ...(?: (\d{2}:\d{2}))?\]/)
    if (cap == null)
    {
        ctx.addIssue({
            code: "invalid_format",
            message: "Invalid data format",
            input: str,
            pattern: /\[(\d{4}-\d{2}-\d{2}) ...(?: (\d{2}:\d{2}))?\]/
        });
        return z.NEVER;
    }
    return `${cap[1]} ${cap[2] ?? ""}`
})

const blogCollection = defineCollection({
    schema: z.object({
        title: z.string().max(100, 'The title length must be less than or equal to 100 chars'),
        description: z.string().default("read more..."),
        tags: z.string()
               .transform((str) => str.split(":").filter((s) => s != '' && s != " "))
                .pipe(z.array(z.string())),
        author: z.string().default("Cj-bc"),
        image: z.string().optional(),
        kind: z.enum(["Memo", "Diary", "Knowledge", "Advertisment", "Translation", "HowTo"]),
        progress: z.enum(["Empty", "WIP", "Published"]),
        status: z.enum(["Normal", "Archive", "Accuracy", "Outdated"]),
        date: dateSchema.optional(),
        publishDate: dateSchema.optional()
    }).refine(obj => (obj.date !== undefined) !== (obj.publishDate !== undefined), {
        message: "Must have either 'date' or 'publishDate', but not both"
    })
    // xor(date, publishDate). xor is not available in zod v3
})

export const collections = {
    'blog': blogCollection
}
