import { ElementHandle, Page } from 'puppeteer';

import getAttribute from './utils/get-attribute';

interface Post {
  title: string;
  vote?: number;
  thumb?: string;
  link?: string;
}

async function postElementToObject(
  postElement: ElementHandle
): Promise<Post | undefined> {
  const title = await getAttribute(
    await postElement.$('div[class="post-info"] > h2')
  );
  const vote = Number(
    await getAttribute(await postElement.$('div[class="post-vote-cell"]'))
  );
  const thumb = await getAttribute(
    await postElement.$('img[class="post-thumb-img"]'),
    'src'
  );
  const link = await getAttribute(
    await postElement.$('div[class="post-thumb"] > a'),
    'href'
  );
  if (title) {
    return {
      title: title,
      vote: vote,
      thumb: thumb,
      link: link
    };
  }
}

/**
 * Scrap posts from webdesignernews.com - return array of objects - Post
 *
 */
export default async function scrapPosts(
  page: Page
): Promise<(Post | undefined)[] | undefined> {
  const postsBlock = await page.$('div[id="post-rows-block-latest"]');
  if (postsBlock) {
    const divPostsArray = await page.$$('div[class="post-row"]');
    const postsElement = await Promise.all(
      divPostsArray.map(
        async (postElement: ElementHandle): Promise<Post | undefined> =>
          await postElementToObject(postElement)
      )
    );
    return postsElement.filter(Boolean);
  }
}
