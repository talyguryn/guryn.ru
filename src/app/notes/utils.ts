import fs from 'fs';
import path from 'path';

export interface NotePost {
  slug: string;
  metadata: NoteMetadata;
}

export type NoteMetadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  tags?: string[];
};

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  let match = frontmatterRegex.exec(fileContent);
  let frontMatterBlock = match![1];
  let content = fileContent.replace(frontmatterRegex, '').trim();
  let frontMatterLines = frontMatterBlock.trim().split('\n');
  let metadata: Partial<NoteMetadata> = {};

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ');
    let value = valueArr.join(': ').trim();

    value = value.replace(/^['"](.*)['"]$/, '$1'); // Remove quotes
    const trimmedKey = key.trim() as keyof NoteMetadata;
    if (trimmedKey === 'tags') {
      metadata[trimmedKey] = value
        ? value.split(',').map((tag) => tag.trim())
        : [];
    } else {
      metadata[trimmedKey] = value;
    }
  });

  return { metadata: metadata as NoteMetadata, content };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx');
}

function readMDXFile(filePath: string) {
  let rawContent = fs.readFileSync(filePath, 'utf-8');
  return parseFrontmatter(rawContent);
}

function getMDXData(dir: string) {
  let mdxFiles = getMDXFiles(dir);
  const loadedFiles = mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file));
    let slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });

  return loadedFiles
    .filter((file) => {
      if (!file.metadata.publishedAt) {
        return false; // Skip files without publishedAt
      }

      // Filter out posts with publishedAt in the future
      let publishedAt = new Date(file.metadata.publishedAt);
      return publishedAt <= new Date();
    })
    .sort((a, b) => {
      // Sort by publishedAt date, newest first
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1;
      }
      return 1; // If dates are equal, maintain original order
    });
}

export function getNotesPosts() {
  return getMDXData(path.join(process.cwd(), 'src', 'app', 'notes', 'posts'));
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date();
  if (!date.includes('T')) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date);

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  let daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = '';

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = 'Today';
  }

  let fullDate = targetDate.toLocaleString('ru-RU', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}

export function getTagsWithCount(): { tag: string; count: number }[] {
  const allNotes = getNotesPosts();
  const allTags = allNotes
    .flatMap((post) => post.metadata.tags)
    .filter((tag): tag is string => typeof tag === 'string' && !!tag)
    .filter((tag, index, self) => self.indexOf(tag) === index)
    .sort((a, b) => {
      if (!a) return 1;
      if (!b) return -1;
      return a.localeCompare(b);
    });

  const tagCounts = allTags
    .map((tag) => {
      const count = allNotes.filter(
        (post) =>
          Array.isArray(post.metadata.tags) && post.metadata.tags.includes(tag)
      ).length;

      return { tag, count };
    })
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.tag.localeCompare(b.tag);
    });

  return tagCounts;
}
