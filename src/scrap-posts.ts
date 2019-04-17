import { ElementHandle, Page } from 'puppeteer';

import getAttribute from './utils/get-attribute';

interface Post {
  title: string;
  vote?: number;
  thumb?: string;
  link?: string;
  source?: string;
  date?: string;
  page?: number;
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
  const source = await getAttribute(
    await postElement.$('a[class="site-name-lnk"]')
  );
  const date = await getAttribute(
    await postElement.$('span[class="made-popuplar"]')
  );
  if (title) {
    return {
      title: title,
      vote: vote,
      thumb: thumb,
      link: link,
      source: source,
      date: date
    };
  }
}

/**
 * Get page number and assign it in Post object
 *
 */
async function pageNumberToPost(
  post: Post | undefined,
  page: Page
): Promise<Post | undefined> {
  if (post) {
    const pageNumber = await getAttribute(
      await page.$('nav[class="pagination"] > span[class="current"]')
    );
    if (pageNumber) {
      return Object.assign(post, { page: Number(pageNumber) });
    } else {
      return post;
    }
  }
}

/**
 * Scrap posts from webdesignernews.com - return array of objects - Post
 *
 */
export default async function scrapPosts(
  page: Page
): Promise<(Post | undefined)[]> {
  const postsBlock = await page.$('div[id="post-rows-block-latest"]');
  if (postsBlock) {
    const divPostsArray = await page.$$('div[class="post-row"]');
    const postsElement = await Promise.all(
      divPostsArray.map(
        async (postElement: ElementHandle): Promise<Post | undefined> =>
          await postElementToObject(postElement)
      )
    );
    const postsElementClean = postsElement.filter(Boolean);
    const postsElementWishPages = await Promise.all(
      postsElementClean.map(
        async (postElement: Post | undefined): Promise<Post | undefined> =>
          await pageNumberToPost(postElement, page)
      )
    );
    return postsElementWishPages;
  } else {
    return [];
  }
}
